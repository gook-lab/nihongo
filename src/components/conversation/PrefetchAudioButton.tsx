// 카테고리 오프라인 발음 미리받기 버튼
// - 진행률/완료 상태는 IndexedDB 키 존재 수로 계산 (별도 상태 저장 없음
//   → 목소리 변경·캐시 축출 시 자동으로 "미완료"로 되돌아감)
// - 순차 호출: degraded 진입 또는 연속 실패 2회 시 중단, 언마운트 시 취소
// - 미리받기는 memory 캐시를 우회 (prefetchSpeech) — 재생 hot 캐시 오염 방지
// - 완료 시 navigator.storage.persist() + (미설치 기기) 홈 화면 추가 안내 1회
//   → iOS Safari의 7일 미사용 스토리지 축출 완화
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { m } from 'framer-motion'
import { CheckCircle2, Download, Loader2 } from 'lucide-react'
import { toast } from '@/lib/toast'
import { useAppStore } from '@/store'
import {
  countCachedTexts,
  getCacheKey,
  isMurfConfigured,
  isMurfTemporarilyDegraded,
  prefetchSpeech,
  subscribeMurfDegraded,
} from '@/lib/murf'
import { getCachedKeys } from '@/lib/audioCache'
import type { ConversationPhrase } from '@/types'

const INSTALL_NUDGE_KEY = 'nihongo-offline-install-nudge'

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

// 지속 스토리지 요청 — 실패해도 무해 (best-effort)
async function requestPersistentStorage(): Promise<void> {
  try {
    await navigator.storage?.persist?.()
  } catch {
    // 미지원 브라우저 — 무시
  }
}

function showInstallNudgeOnce(): void {
  if (isStandalone()) return
  if (localStorage.getItem(INSTALL_NUDGE_KEY) === '1') return
  localStorage.setItem(INSTALL_NUDGE_KEY, '1')
  toast.info({
    message: '홈 화면에 추가하면 받아둔 발음이 더 안전하게 보관돼요',
    duration: 5000,
    id: 'offline-install-nudge',
  })
}

interface Props {
  phrases: ConversationPhrase[]
}

export function PrefetchAudioButton({ phrases }: Props) {
  const ttsProvider = useAppStore((s) => s.ttsProvider)
  const murfVoiceId = useAppStore((s) => s.murfVoiceId)

  const [cachedCount, setCachedCount] = useState<number | null>(null)
  const [prefetching, setPrefetching] = useState(false)
  const cancelledRef = useRef(false)

  const degraded = useSyncExternalStore(
    subscribeMurfDegraded,
    () => isMurfTemporarilyDegraded(),
    () => false,
  )

  const total = phrases.length
  const show = isMurfConfigured() && ttsProvider === 'murf' && total > 0

  // 진행률 초기 계산 — 목소리 변경 시 키가 달라져 자동 재계산됨
  // 주의: cached.size(유니크 키 수)가 아니라 표현 기준으로 센다 (중복 문장 = 키 공유)
  useEffect(() => {
    if (!show) return
    let stale = false
    const texts = phrases.map((p) => p.japanese)
    const keys = texts.map((t) => getCacheKey(t, murfVoiceId))
    getCachedKeys(keys).then((cached) => {
      if (!stale) setCachedCount(countCachedTexts(texts, cached, murfVoiceId))
    })
    return () => {
      stale = true
    }
  }, [show, phrases, murfVoiceId])

  // 언마운트 시 진행 중인 미리받기 취소
  useEffect(() => {
    return () => {
      cancelledRef.current = true
    }
  }, [])

  if (!show) return null

  const complete = cachedCount !== null && cachedCount >= total

  const handlePrefetch = async () => {
    if (prefetching || complete) return
    if (isMurfTemporarilyDegraded()) {
      toast.warning({
        message: '음성 서비스가 잠시 쉬는 중이에요. 나중에 다시 시도해 주세요.',
        id: 'prefetch-degraded',
      })
      return
    }
    setPrefetching(true)
    cancelledRef.current = false

    const texts = phrases.map((p) => p.japanese)
    const keys = texts.map((t) => getCacheKey(t, murfVoiceId))
    const cached = await getCachedKeys(keys)
    let count = countCachedTexts(texts, cached, murfVoiceId)
    setCachedCount(count)
    let consecutiveFails = 0
    let aborted = false

    for (const phrase of phrases) {
      if (cancelledRef.current) return // 언마운트 — 상태 업데이트 없이 종료
      if (isMurfTemporarilyDegraded()) {
        aborted = true
        toast.warning({
          message: '음성 서비스 한도로 미리받기를 멈췄어요. 나중에 이어서 받을 수 있어요.',
          id: 'prefetch-degraded',
        })
        break
      }
      const key = getCacheKey(phrase.japanese, murfVoiceId)
      if (cached.has(key)) continue

      const result = await prefetchSpeech(phrase.japanese, murfVoiceId)
      if (result === 'fail') {
        consecutiveFails += 1
        if (consecutiveFails >= 2) {
          aborted = true
          toast.error({
            message: '발음 미리받기가 중단됐어요. 인터넷 연결을 확인하고 다시 시도해 주세요.',
            id: 'prefetch-fail',
          })
          break
        }
      } else {
        consecutiveFails = 0
        count += 1
        setCachedCount(count)
      }
    }

    setPrefetching(false)
    if (!aborted && count >= total) {
      toast.success({
        message: '오프라인 발음 준비 완료! 비행기 모드에서도 들을 수 있어요',
        id: 'prefetch-done',
      })
      await requestPersistentStorage()
      showInstallNudgeOnce()
    }
  }

  const label = complete
    ? '오프라인 발음 준비됨'
    : prefetching
      ? `발음 받는 중… ${cachedCount ?? 0}/${total}`
      : `오프라인 발음 미리받기${cachedCount ? ` (${cachedCount}/${total})` : ''}`

  return (
    <div className="px-5 mt-3">
      <m.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: complete ? 1 : 0.98 }}
        onClick={handlePrefetch}
        disabled={prefetching || complete || degraded}
        className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left disabled:cursor-default"
        style={{
          background: complete ? 'var(--color-muted)' : 'var(--color-sakura-100)',
        }}
        aria-label="오프라인 발음 미리받기"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          {complete ? (
            <CheckCircle2 className="w-4 h-4 text-primary" />
          ) : prefetching ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          ) : (
            <Download className="w-4 h-4 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-primary">{label}</p>
          <p className="text-[11px] text-muted-foreground">
            {complete
              ? '이 카테고리는 인터넷 없이도 발음이 나와요'
              : degraded
                ? '음성 서비스가 잠시 쉬는 중 — 나중에 받을 수 있어요'
                : '여행 전에 받아두면 현지에서 인터넷 없이 들을 수 있어요'}
          </p>
          {prefetching && (
            <div
              className="mt-2 h-1 rounded-full overflow-hidden"
              style={{ background: 'var(--color-border-light)' }}
            >
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${Math.round(((cachedCount ?? 0) / total) * 100)}%` }}
              />
            </div>
          )}
        </div>
      </m.button>
    </div>
  )
}
