import { useCallback, useState, useSyncExternalStore, useRef } from 'react'
import { useAppStore } from '@/store'
import {
  playMurfAudio,
  isMurfConfigured,
  isMurfTemporarilyDegraded,
  subscribeMurfDegraded,
} from '@/lib/murf'

interface UseTTSOptions {
  rate?: number
  lang?: string
  forceBrowser?: boolean // Murf.ai 설정 무시하고 브라우저 TTS 강제 사용
}

interface UseTTSReturn {
  speak: (text: string) => void
  stop: () => void
  isSupported: boolean
  isLoading: boolean
  isSpeaking: boolean
  provider: 'browser' | 'murf'
}

// 브라우저 TTS 지원 여부
const getIsBrowserSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window
const subscribeToNothing = () => () => {}

export function useTTS(options: UseTTSOptions = {}): UseTTSReturn {
  const { rate, lang = 'ja-JP', forceBrowser = false } = options

  // 스토어에서 설정 가져오기
  const { ttsProvider, ttsRate, murfVoiceId } = useAppStore()
  const effectiveRate = rate ?? ttsRate

  // SSR-safe 브라우저 TTS 지원 확인
  const isBrowserSupported = useSyncExternalStore(
    subscribeToNothing,
    getIsBrowserSupported,
    () => false
  )

  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Murf degraded 상태 구독 — 모듈 상태가 바뀌면 컴포넌트 재렌더되어 provider 반환값이 갱신됨
  const degraded = useSyncExternalStore(
    subscribeMurfDegraded,
    () => isMurfTemporarilyDegraded(),
    () => false,
  )

  // Murf API 사용 여부 결정 (forceBrowser가 true면 항상 브라우저 TTS)
  const userPicksMurf = !forceBrowser && ttsProvider === 'murf' && isMurfConfigured()
  const isSupported = userPicksMurf || isBrowserSupported

  const speak = useCallback(
    async (text: string) => {
      if (!isSupported) return

      // 이전 재생 중지
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (isBrowserSupported) {
        speechSynthesis.cancel()
      }

      // 매 호출 시점에 degraded 체크 — 연속 실패로 일시 차단된 상태면 즉시 브라우저 TTS
      const useMurf = userPicksMurf && !isMurfTemporarilyDegraded()
      if (useMurf) {
        // Murf.ai TTS 사용
        setIsLoading(true)
        try {
          const success = await playMurfAudio(text, murfVoiceId)
          setIsLoading(false)
          if (!success && isBrowserSupported) {
            // Murf 실패 시 브라우저 TTS로 폴백
            speakWithBrowser(text, lang, effectiveRate, setIsSpeaking)
          } else {
            setIsSpeaking(false)
          }
        } catch {
          setIsLoading(false)
          // 에러 시 브라우저 TTS로 폴백
          if (isBrowserSupported) {
            speakWithBrowser(text, lang, effectiveRate, setIsSpeaking)
          } else {
            setIsSpeaking(false)
          }
        }
      } else {
        // 브라우저 TTS 사용
        speakWithBrowser(text, lang, effectiveRate, setIsSpeaking)
      }
    },
    [isSupported, userPicksMurf, murfVoiceId, isBrowserSupported, lang, effectiveRate]
  )

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (isBrowserSupported) {
      speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [isBrowserSupported])

  return {
    speak,
    stop,
    isSupported,
    isLoading,
    isSpeaking,
    // 사용자가 Murf를 선택했고 설정도 완료됐지만, degraded 상태일 수 있음 — degraded는 구독 중이라 자동 갱신
    provider: userPicksMurf && !degraded ? 'murf' : 'browser',
  }
}

// 브라우저 TTS로 재생
function speakWithBrowser(
  text: string,
  lang: string,
  rate: number,
  setIsSpeaking: (speaking: boolean) => void
) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = rate

  utterance.onstart = () => setIsSpeaking(true)
  utterance.onend = () => setIsSpeaking(false)
  utterance.onerror = () => setIsSpeaking(false)

  speechSynthesis.speak(utterance)
}
