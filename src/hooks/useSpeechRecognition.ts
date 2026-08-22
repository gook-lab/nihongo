import { useState, useCallback, useRef, useSyncExternalStore, useEffect } from 'react'

// Web Speech API 타입 정의 (브라우저 내장 API)
interface SpeechRecognitionEventResult {
  readonly transcript: string
  readonly confidence: number
}

interface SpeechRecognitionResultItem {
  readonly isFinal: boolean
  readonly length: number
  [index: number]: SpeechRecognitionEventResult
}

interface SpeechRecognitionEventResultList {
  readonly length: number
  [index: number]: SpeechRecognitionResultItem
}

interface SpeechRecognitionEventType extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionEventResultList
}

interface SpeechRecognitionErrorEventType extends Event {
  readonly error: string
  readonly message: string
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  onstart: ((ev: Event) => void) | null
  onend: ((ev: Event) => void) | null
  onerror: ((ev: SpeechRecognitionErrorEventType) => void) | null
  onresult: ((ev: SpeechRecognitionEventType) => void) | null
  onspeechstart: ((ev: Event) => void) | null
  onspeechend: ((ev: Event) => void) | null
  start(): void
  stop(): void
  abort(): void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

// 음성 인식 상태
export type SpeechStatus = 'idle' | 'listening' | 'recording' | 'processing' | 'error'

// 에러 타입
export type SpeechError =
  | 'not-supported'      // 브라우저 미지원
  | 'permission-denied'  // 마이크 권한 거부
  | 'no-speech'          // 5초 무음성
  | 'network'            // 네트워크 에러
  | 'audio-capture'      // 마이크 에러
  | 'unknown'

// 옵션 인터페이스
interface UseSpeechRecognitionOptions {
  lang?: string                // 기본: 'ko-KR'
  noSpeechTimeoutMs?: number   // 기본: 5000
  silenceTimeoutMs?: number    // 기본: 2500
  onResult?: (transcript: string) => void
  onError?: (error: SpeechError) => void
}

// 반환 인터페이스
interface UseSpeechRecognitionReturn {
  status: SpeechStatus
  transcript: string           // 최종 텍스트
  interimTranscript: string    // 실시간 중간 텍스트
  error: SpeechError | null
  isSupported: boolean         // 브라우저 지원 여부
  startListening: (langOverride?: string) => void
  stopListening: () => void
  resetTranscript: () => void
}

// SpeechRecognition 가져오기 헬퍼
function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any
  return win.SpeechRecognition || win.webkitSpeechRecognition || null
}

// 브라우저 지원 여부 확인
const getIsSupported = () => {
  return getSpeechRecognition() !== null
}

const subscribeToNothing = () => () => {}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const {
    lang = 'ko-KR',
    noSpeechTimeoutMs = 5000,
    silenceTimeoutMs = 2500,
    onResult,
    onError,
  } = options

  // SSR-safe 지원 여부 확인
  const isSupported = useSyncExternalStore(
    subscribeToNothing,
    getIsSupported,
    () => false
  )

  const [status, setStatus] = useState<SpeechStatus>('idle')
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<SpeechError | null>(null)

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const noSpeechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasSpokenRef = useRef(false)
  const transcriptRef = useRef('')
  const interimRef = useRef('')

  // 타이머 클리어
  const clearTimers = useCallback(() => {
    if (noSpeechTimerRef.current) {
      clearTimeout(noSpeechTimerRef.current)
      noSpeechTimerRef.current = null
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }, [])

  // 음성 인식 시작
  const startListening = useCallback((langOverride?: string) => {
    const SpeechRecognitionClass = getSpeechRecognition()

    if (!SpeechRecognitionClass) {
      setError('not-supported')
      setStatus('error')
      onError?.('not-supported')
      return
    }

    // 이전 인식 정리
    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }
    clearTimers()

    const actualLang = langOverride || lang
    const recognition = new SpeechRecognitionClass()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = actualLang
    recognition.maxAlternatives = 1

    hasSpokenRef.current = false
    transcriptRef.current = ''
    interimRef.current = ''
    setError(null)
    setTranscript('')
    setInterimTranscript('')

    // 침묵 타이머 리셋 함수
    const resetSilenceTimer = () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
      silenceTimerRef.current = setTimeout(() => {
        // 2.5초 침묵 → 자동 종료
        recognition.stop()
      }, silenceTimeoutMs)
    }

    // 5초 무음성 타이머 시작
    noSpeechTimerRef.current = setTimeout(() => {
      if (!hasSpokenRef.current) {
        recognition.abort()
        setError('no-speech')
        setStatus('error')
        onError?.('no-speech')
      }
    }, noSpeechTimeoutMs)

    recognition.onstart = () => {
      setStatus('listening')
    }

    recognition.onspeechstart = () => {
      hasSpokenRef.current = true
      setStatus('recording')
      // 무음성 타이머 취소
      if (noSpeechTimerRef.current) {
        clearTimeout(noSpeechTimerRef.current)
        noSpeechTimerRef.current = null
      }
      // 침묵 타이머 시작
      resetSilenceTimer()
    }

    recognition.onresult = (event: SpeechRecognitionEventType) => {
      let finalTranscript = ''
      let interim = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }

      if (finalTranscript) {
        transcriptRef.current += finalTranscript
        setTranscript(transcriptRef.current)
      }
      interimRef.current = interim
      setInterimTranscript(interim)

      // 침묵 타이머 리셋
      resetSilenceTimer()
    }

    recognition.onerror = (event: SpeechRecognitionErrorEventType) => {
      clearTimers()
      let speechError: SpeechError = 'unknown'

      switch (event.error) {
        case 'not-allowed':
          speechError = 'permission-denied'
          break
        case 'no-speech':
          speechError = 'no-speech'
          break
        case 'network':
          speechError = 'network'
          break
        case 'audio-capture':
          speechError = 'audio-capture'
          break
        case 'aborted':
          // 사용자가 취소한 경우 에러로 처리하지 않음
          setStatus('idle')
          return
      }

      setError(speechError)
      setStatus('error')
      onError?.(speechError)
    }

    recognition.onend = () => {
      clearTimers()
      const currentRecognition = recognitionRef.current
      recognitionRef.current = null

      // 에러 상태가 아니면 결과 콜백 호출
      if (currentRecognition) {
        setStatus('processing')
        // 최종 트랜스크립트와 중간 트랜스크립트 합침
        const finalText = transcriptRef.current + interimRef.current
        if (finalText.trim()) {
          onResult?.(finalText.trim())
        }
        setStatus('idle')
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [lang, noSpeechTimeoutMs, silenceTimeoutMs, clearTimers, onError, onResult])

  // 음성 인식 중지
  const stopListening = useCallback(() => {
    clearTimers()
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setStatus('idle')
  }, [clearTimers])

  // 트랜스크립트 초기화
  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    transcriptRef.current = ''
    interimRef.current = ''
    setError(null)
    setStatus('idle')
  }, [])

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      clearTimers()
      if (recognitionRef.current) {
        recognitionRef.current.abort()
        recognitionRef.current = null
      }
    }
  }, [clearTimers])

  return {
    status,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  }
}
