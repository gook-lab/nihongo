import { useMemo } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { X, Mic, Send, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SpeechStatus, SpeechError } from '@/hooks/useSpeechRecognition'

// 에러 메시지 (한국어)
const ERROR_MESSAGES: Record<SpeechError, string> = {
  'not-supported': '브라우저 미지원',
  'permission-denied': '마이크 권한 필요',
  'no-speech': '음성이 감지되지 않았습니다',
  'network': '네트워크 오류',
  'audio-capture': '마이크 사용 불가',
  'unknown': '알 수 없는 오류',
}

// 언어 타입
export type VoiceLang = 'ko-KR' | 'ja-JP'

interface VoiceInputBarProps {
  status: SpeechStatus
  selectedLang: VoiceLang
  transcript: string
  interimTranscript: string
  error: SpeechError | null
  onClose: () => void
  onRetry: () => void
  onSend: () => void  // 수동 전송
}

// 웨이브 바 애니메이션 (Siri 스타일) - 음성 감지 시 역동적 움직임
/** 막대를 이 높이로 고정해 두고 scaleY 로 줄인다 (컨테이너 h-10 = 40px) */
const BAR_MAX = 40

function WaveBars({ isActive }: { isActive: boolean }) {
  const bars = 5

  // 각 바의 애니메이션 설정 (중앙이 가장 높게)
  const barConfigs = useMemo(() => {
    const centerIndex = Math.floor(bars / 2)
    return [...Array(bars)].map((_, i) => {
      const distanceFromCenter = Math.abs(i - centerIndex)
      const baseHeight = 32 - distanceFromCenter * 5 // 중앙: 32, 양끝: 22
      // 높이 대신 배율로 표현한다 — 컨테이너 높이(BAR_MAX)를 1 로 본 비율.
      const heights = [6, baseHeight + Math.random() * 8, 12, baseHeight - 5, 6]
      return {
        scales: heights.map((h) => h / BAR_MAX),
        duration: 0.4 + Math.random() * 0.2,
      }
    })
  }, [])

  return (
    <div className="flex items-center justify-center gap-[3px] h-10">
      {barConfigs.map((config, i) => (
        <m.div
          key={i}
          // height 무한 반복은 녹음 내내 레이아웃을 다시 계산한다.
          // 최대 높이로 고정하고 scaleY 로 줄인다 (합성만 일어난다).
          className="w-[3px] origin-center rounded-full bg-primary"
          style={{ height: BAR_MAX }}
          initial={{ scaleY: 6 / BAR_MAX, opacity: 0.3 }}
          animate={isActive ? {
            scaleY: config.scales,
            opacity: [0.4, 1, 0.7, 1, 0.4],
          } : { scaleY: 6 / BAR_MAX, opacity: 0.3 }}
          transition={{
            duration: config.duration,
            repeat: isActive ? Infinity : 0,
            repeatType: 'loop',
            delay: i * 0.08,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// 펄스 링 애니메이션 - 무한 반복 + 경계 전 페이드아웃
function PulseRings({ color = 'primary' }: { color?: 'primary' | 'destructive' }) {
  const colorClass = color === 'destructive' ? 'border-destructive' : 'border-primary'

  return (
    <>
      {[...Array(3)].map((_, i) => (
        <m.div
          key={i}
          className={`absolute inset-0 rounded-full border-2 ${colorClass}`}
          animate={{
            scale: [1, 1.4, 1.8, 2.0],
            opacity: [0, 0.4, 0.15, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
            times: [0, 0.15, 0.6, 1], // opacity가 60% 지점에서 거의 사라짐
          }}
        />
      ))}
    </>
  )
}

// 마이크 버튼 with 애니메이션
function MicButton({
  status,
  error,
}: {
  status: SpeechStatus
  error: SpeechError | null
}) {
  const isRecording = status === 'recording'
  const isListening = status === 'listening'
  const isError = !!error
  const isProcessing = status === 'processing'

  return (
    <div className="relative overflow-visible z-10">
      {/* 펄스 링 */}
      {(isListening || isRecording) && !isError && (
        <PulseRings color="primary" />
      )}

      {/* 메인 버튼 */}
      <m.div
        className={`relative w-14 h-14 rounded-full flex items-center justify-center ${
          isError
            ? 'bg-destructive/10'
            : isRecording
              ? 'bg-primary'
              : 'bg-primary/10'
        }`}
        animate={isRecording ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {isProcessing ? (
          <m.div
            className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <m.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Mic className={`w-6 h-6 ${
              isError
                ? 'text-destructive'
                : isRecording
                  ? 'text-primary-foreground'
                  : 'text-primary'
            }`} />
          </m.div>
        )}
      </m.div>
    </div>
  )
}

export function VoiceInputBar({
  status,
  selectedLang,
  transcript,
  interimTranscript,
  error,
  onClose,
  onRetry,
  onSend,
}: VoiceInputBarProps) {
  // 먼저 변수 선언
  const displayText = transcript + interimTranscript
  const isActive = status === 'recording'
  const hasText = displayText.trim().length > 0
  const canSend = hasText && !error && status !== 'processing'
  // idle 상태 = 녹음이 끝난 상태 (다시 버튼 필요)
  const showRetry = error || status === 'idle'

  const getLangLabel = () => {
    return selectedLang === 'ko-KR' ? '한국어 → 일본어' : '일본어 → 한국어'
  }

  const getStatusMessage = () => {
    if (error) return ERROR_MESSAGES[error]
    switch (status) {
      case 'listening':
        return '말씀해주세요...'
      case 'recording':
        return '듣고 있어요'
      case 'processing':
        return '전송 중...'
      case 'idle':
        // idle 상태인데 텍스트가 없으면 인식 실패
        if (!hasText) {
          return '인식된 내용이 없습니다'
        }
        return '녹음 완료'
      default:
        return ''
    }
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="border-t bg-gradient-to-t from-background via-background to-background/80"
    >
      {/* 트랜스크립트 표시 영역 */}
      <AnimatePresence>
        {displayText && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="px-4 pt-3 overflow-hidden"
          >
            <m.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="px-4 py-3 rounded-2xl bg-muted/50 backdrop-blur-sm border border-border/50"
            >
              <p className="text-sm break-words text-center">
                <span className="text-foreground">{transcript}</span>
                <span className="text-muted-foreground">{interimTranscript}</span>
              </p>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* 메인 컨트롤 */}
      <div className="flex flex-col items-center gap-3 p-4 overflow-visible">
        {/* 웨이브 + 마이크 */}
        <div className="flex items-center gap-4 overflow-visible">
          {/* 왼쪽 웨이브 */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <WaveBars isActive={isActive} />
          </m.div>

          {/* 중앙 마이크 버튼 */}
          <MicButton status={status} error={error} />

          {/* 오른쪽 웨이브 */}
          <m.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <WaveBars isActive={isActive} />
          </m.div>
        </div>

        {/* 상태 텍스트 */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col items-center gap-1"
        >
          <m.span
            className={`text-sm font-medium ${error ? 'text-destructive' : 'text-foreground'}`}
            key={getStatusMessage()}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {getStatusMessage()}
          </m.span>
          <span className="text-xs text-muted-foreground">
            {selectedLang === 'ko-KR' ? '🇰🇷' : '🇯🇵'} {getLangLabel()}
          </span>
        </m.div>

        {/* 하단 버튼들 */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2"
        >
          {/* 취소 버튼 */}
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full px-4 text-muted-foreground"
            onClick={onClose}
          >
            <X className="w-4 h-4 mr-1" />
            취소
          </Button>

          {/* 재시도 버튼 - 에러 시 또는 idle 상태일 때 (녹음 완료 후) */}
          {showRetry && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-4"
              onClick={onRetry}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              다시
            </Button>
          )}

          {/* 전송 버튼 - 텍스트가 있을 때 */}
          {canSend && (
            <Button
              size="sm"
              className="rounded-full px-4"
              onClick={onSend}
            >
              <Send className="w-4 h-4 mr-1" />
              전송
            </Button>
          )}
        </m.div>
      </div>
    </m.div>
  )
}
