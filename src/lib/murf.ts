// Murf.ai TTS API 서비스
// 문서: https://murf.ai/api/docs
//
// 캐시 구조 (2계층):
//   재생(synthesizeSpeech): memory Map → IndexedDB(히트 시 memory 승격) → API(양쪽 기록)
//   미리받기(prefetchSpeech): IndexedDB → API(IndexedDB만 기록) — 카테고리 일괄
//     미리받기가 세션 중 재생 hot 캐시(LRU 100)를 밀어내지 않도록 memory를 우회한다.
import { reportTTSError } from './sentry'
import { getAudio as getCachedAudio, putAudio as putCachedAudio } from './audioCache'

const MURF_API_KEY = import.meta.env.VITE_MURF_API_KEY
const MURF_API_BASE = 'https://api.murf.ai/v1'

// TTS 오디오 캐시 (text:voiceId -> audioDataUrl)
const audioCache = new Map<string, string>()
const MAX_CACHE_SIZE = 100 // 최대 캐시 항목 수

// ─── Degraded mode ─────────────────────────────────────────
// quota 초과/계정 만료 같이 retry로 풀리지 않는 영구적 실패를 감지하면
// 일정 시간 동안 Murf 호출을 건너뛰고 브라우저 TTS로만 동작 → 학습 흐름 끊김 방지
let consecutiveFailures = 0
let degradedUntilTs = 0
const FAILURE_THRESHOLD = 3
const DEGRADE_DURATION_MS = 5 * 60 * 1000 // 5분

export function isMurfTemporarilyDegraded(): boolean {
  return Date.now() < degradedUntilTs
}

// useSyncExternalStore 구독자 — degraded 상태 변경 시 컴포넌트 재렌더 트리거
const subscribers = new Set<() => void>()
export function subscribeMurfDegraded(cb: () => void): () => void {
  subscribers.add(cb)
  return () => {
    subscribers.delete(cb)
  }
}
function notifyDegradedChange(): void {
  for (const cb of subscribers) cb()
}

function recordSuccess(): void {
  if (consecutiveFailures > 0) {
    consecutiveFailures = 0
  }
}

function recordFailure(): void {
  consecutiveFailures += 1
  if (consecutiveFailures >= FAILURE_THRESHOLD) {
    degradedUntilTs = Date.now() + DEGRADE_DURATION_MS
    consecutiveFailures = 0
    console.warn(
      `[Murf] ${FAILURE_THRESHOLD}회 연속 실패 — 5분 동안 브라우저 TTS로 자동 전환`,
    )
    notifyDegradedChange()
  }
}

// 미리받기 UI가 진행률(IDB 키 존재 수) 계산에 사용하므로 export
export function getCacheKey(text: string, voiceId: string): string {
  return `${text}:${voiceId}`
}

// 캐시된 표현 수 계산 — 반드시 표현(text) 기준으로 센다.
// 카테고리 안에 같은 일본어 문장이 중복 존재할 수 있어(캐시 키 공유),
// Set 크기로 세면 전부 받아도 "16/20"처럼 영영 완료가 안 되는 버그가 생긴다.
export function countCachedTexts(
  texts: string[],
  cachedKeys: Set<string>,
  voiceId: string,
): number {
  return texts.filter((t) => cachedKeys.has(getCacheKey(t, voiceId))).length
}

function addToCache(key: string, value: string): void {
  // 캐시 크기 제한 - 오래된 항목 제거
  if (audioCache.size >= MAX_CACHE_SIZE) {
    const firstKey = audioCache.keys().next().value
    if (firstKey) {
      audioCache.delete(firstKey)
    }
  }
  audioCache.set(key, value)
}

export interface MurfVoice {
  voiceId: string
  name: string
  language: string
  gender: string
  age?: string
  style?: string
  avatar: string  // 귀여운 아바타 이모지
  description: string  // 음성 설명
}

// 사전 정의된 일본어 음성 목록 (Murf.ai API에서 확인된 음성)
export const JAPANESE_VOICES: MurfVoice[] = [
  { voiceId: 'ja-JP-kimi', name: 'Kimi', language: 'ja-JP', gender: 'female', avatar: '👩', description: '밝고 친근한' },
  { voiceId: 'ja-JP-kenji', name: 'Kenji', language: 'ja-JP', gender: 'male', avatar: '👨‍💼', description: '차분하고 신뢰감' },
  { voiceId: 'ja-JP-denki', name: 'Denki', language: 'ja-JP', gender: 'male', avatar: '🧑‍💻', description: '젊고 활기찬' },
]

// Murf API가 설정되었는지 확인
export function isMurfConfigured(): boolean {
  return Boolean(MURF_API_KEY && MURF_API_KEY !== 'your-murf-api-key')
}

// 음성 목록 조회
export async function fetchVoices(): Promise<MurfVoice[]> {
  if (!isMurfConfigured()) {
    console.warn('Murf API 키가 설정되지 않았습니다.')
    return JAPANESE_VOICES
  }

  try {
    const response = await fetch(`${MURF_API_BASE}/speech/voices`, {
      method: 'GET',
      headers: {
        'api-key': MURF_API_KEY,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.status}`)
    }

    const data = await response.json()

    // 일본어 음성만 필터링
    const japaneseVoices = data.filter(
      (voice: MurfVoice) => voice.language?.startsWith('ja')
    )

    return japaneseVoices.length > 0 ? japaneseVoices : JAPANESE_VOICES
  } catch (error) {
    console.error('음성 목록 조회 실패:', error)
    reportTTSError(error, { provider: 'murf', operation: 'list-voices' })
    return JAPANESE_VOICES
  }
}

// ── Murf API 호출 코어 (캐시 미포함) ─────────────────────────
// synthesizeSpeech(재생)와 prefetchSpeech(미리받기)가 공유.
// 네트워크 오류는 1회 재시도 후 throw — 재생 경로에서는 useTTS의 catch가
// 브라우저 TTS로 폴백하고, 미리받기 경로에서는 prefetchSpeech가 'fail'로 변환.
async function requestMurfAudio(
  text: string,
  voiceId: string
): Promise<string | null> {
  // 일시적 5xx 오류는 한 번 재시도 (400ms 백오프)
  // Murf는 quota 초과/일시 장애를 종종 500으로 반환 → 즉시 재시도가 성공률을 올림
  let response: Response | null = null
  let lastErrorBody = ''
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      response = await fetch(`${MURF_API_BASE}/speech/generate`, {
        method: 'POST',
        headers: {
          'api-key': MURF_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId,
          format: 'MP3',
          modelVersion: 'GEN2',
          encodeAsBase64: true,
        }),
      })
      if (response.ok) break
      lastErrorBody = await response.text().catch(() => '')
      // 4xx 처리:
      //   401/403 — 인증/quota 만료 → retry 무의미, 즉시 long-degrade로 진입 (5분이 아니라 세션 끝까지)
      //   429 — rate limit → retry 무의미, degrade
      //   400 — 잘못된 요청 (텍스트 형식 등) → 이 텍스트만 폴백, retry 없음
      // 5xx만 짧은 백오프로 1회 재시도
      if (response.status === 401 || response.status === 403 || response.status === 429) {
        // quota/auth 만료는 그 세션 동안 회복 안 됨 — 즉시 degraded로 강제 진입
        degradedUntilTs = Date.now() + 60 * 60 * 1000 // 1시간
        consecutiveFailures = 0
        notifyDegradedChange()
        console.warn(
          `[Murf] ${response.status} ${response.status === 429 ? 'rate limit' : 'auth/quota'} — 1시간 브라우저 TTS로 자동 전환`,
        )
        break
      }
      if (response.status < 500 || attempt === 1) break
      await new Promise((r) => setTimeout(r, 400))
    } catch (netErr) {
      // 네트워크 자체 실패도 한 번 재시도
      if (attempt === 1) throw netErr
      await new Promise((r) => setTimeout(r, 400))
    }
  }

  try {
    if (!response || !response.ok) {
      throw new Error(
        `TTS 생성 실패: ${response?.status ?? 'no-response'} - ${lastErrorBody.slice(0, 300)}`,
      )
    }

    const data = await response.json()
    let audioSrc: string | null = null

    // Base64로 인코딩된 오디오 반환 (encodedAudio 필드)
    if (data.encodedAudio) {
      audioSrc = `data:audio/mp3;base64,${data.encodedAudio}`
    }
    // audioFile 필드로 반환된 경우
    else if (data.audioFile) {
      audioSrc = `data:audio/mp3;base64,${data.audioFile}`
    }
    // URL로 반환된 경우
    else if (data.audioUrl) {
      audioSrc = data.audioUrl
    }

    if (audioSrc) {
      recordSuccess()
    }

    return audioSrc
  } catch (error) {
    console.error('TTS 생성 실패:', error)
    recordFailure()
    // 에러 컨텍스트 강화 — 어떤 텍스트/길이/응답에서 실패했는지 Sentry로 추적
    reportTTSError(error, {
      provider: 'murf',
      operation: 'synthesize',
      extra: {
        voiceId,
        textLength: text.length,
        textPreview: text.slice(0, 80),
        responseStatus: response?.status ?? undefined,
        responseBody: lastErrorBody.slice(0, 300),
      },
    })
    return null
  }
}

// 텍스트를 음성으로 변환 (2계층 캐시: memory → IndexedDB → API)
export async function synthesizeSpeech(
  text: string,
  voiceId: string = 'ja-JP-kimi'
): Promise<string | null> {
  if (!isMurfConfigured()) {
    console.warn('Murf API 키가 설정되지 않았습니다.')
    return null
  }

  // 1) memory 캐시 (세션 hot)
  const cacheKey = getCacheKey(text, voiceId)
  const cached = audioCache.get(cacheKey)
  if (cached) {
    return cached
  }

  // 2) IndexedDB 영속 캐시 — 오프라인에서도 여기서 반환. 히트 시 memory 승격
  const persisted = await getCachedAudio(cacheKey)
  if (persisted) {
    addToCache(cacheKey, persisted)
    return persisted
  }

  // 3) Murf API — 성공 시 양쪽 캐시에 기록
  const audioSrc = await requestMurfAudio(text, voiceId)
  if (audioSrc) {
    addToCache(cacheKey, audioSrc)
    // 원격 URL(audioUrl) 응답은 오프라인 재생이 안 되므로 data URL만 영속화
    if (audioSrc.startsWith('data:')) {
      void putCachedAudio(cacheKey, audioSrc)
    }
  }
  return audioSrc
}

export type PrefetchResult = 'cached' | 'ok' | 'fail'

// 카테고리 미리받기 전용 — memory 캐시를 우회하고 IndexedDB에만 기록한다.
// (일괄 미리받기가 세션 중 재생 hot 캐시 LRU를 밀어내지 않도록)
export async function prefetchSpeech(
  text: string,
  voiceId: string = 'ja-JP-kimi'
): Promise<PrefetchResult> {
  if (!isMurfConfigured() || isMurfTemporarilyDegraded()) return 'fail'
  const cacheKey = getCacheKey(text, voiceId)
  if (await getCachedAudio(cacheKey)) return 'cached'
  try {
    const audioSrc = await requestMurfAudio(text, voiceId)
    if (!audioSrc || !audioSrc.startsWith('data:')) return 'fail'
    return (await putCachedAudio(cacheKey, audioSrc)) ? 'ok' : 'fail'
  } catch {
    // 네트워크 오류 — 호출 루프가 연속 실패로 감지해 중단
    return 'fail'
  }
}

// 오디오 재생
export async function playMurfAudio(
  text: string,
  voiceId: string = 'ja-JP-kimi'
): Promise<boolean> {
  const audioSrc = await synthesizeSpeech(text, voiceId)

  if (!audioSrc) {
    return false
  }

  return new Promise((resolve) => {
    const audio = new Audio(audioSrc)
    audio.onended = () => resolve(true)
    audio.onerror = () => resolve(false)
    audio.play().catch(() => resolve(false))
  })
}
