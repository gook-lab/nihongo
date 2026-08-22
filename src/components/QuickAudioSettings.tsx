// 학습 페이지에서 빠른 TTS 설정 변경용 다이얼로그
// SettingsPage의 음성 섹션을 압축, 학습 흐름을 끊지 않고 인라인에서 조정
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { Volume2, ChevronRight, Mic } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TTSButton } from '@/components/TTSButton'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'
import { JAPANESE_VOICES, isMurfConfigured } from '@/lib/murf'
import { cn } from '@/lib/utils'

const TTS_SPEED_OPTIONS = [
  { value: 0.5, label: '느리게' },
  { value: 0.75, label: '조금 느리게' },
  { value: 0.9, label: '보통' },
  { value: 1.0, label: '빠르게' },
] as const

const TTS_PROVIDER_OPTIONS = [
  { value: 'browser' as const, label: '기본 음성', description: '브라우저 TTS' },
  { value: 'murf' as const, label: 'Murf.ai', description: '자연스러운 AI' },
]

interface QuickAudioSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickAudioSettings({ open, onOpenChange }: QuickAudioSettingsProps) {
  const navigate = useNavigate()
  const ttsRate = useAppStore((s) => s.ttsRate)
  const setTTSRate = useAppStore((s) => s.setTTSRate)
  const ttsProvider = useAppStore((s) => s.ttsProvider)
  const setTTSProvider = useAppStore((s) => s.setTTSProvider)
  const murfVoiceId = useAppStore((s) => s.murfVoiceId)
  const setMurfVoiceId = useAppStore((s) => s.setMurfVoiceId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-32px)] max-w-[400px] p-5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Volume2 className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            빠른 음성 설정
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          {/* 음성 엔진 */}
          <div className="space-y-2">
            <p
              className="type-section"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              음성 엔진
            </p>
            <div className="grid grid-cols-2 gap-2">
              {TTS_PROVIDER_OPTIONS.map((option) => {
                const isDisabled = option.value === 'murf' && !isMurfConfigured()
                const isSelected = ttsProvider === option.value
                return (
                  <m.button
                    key={option.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => !isDisabled && setTTSProvider(option.value)}
                    disabled={isDisabled}
                    className={cn(
                      'p-2.5 rounded-xl border-2 text-left transition-all',
                      isDisabled && 'opacity-50 cursor-not-allowed',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-foreground/30',
                    )}
                  >
                    <p
                      className={cn(
                        'font-semibold text-sm',
                        isSelected && 'text-primary',
                      )}
                    >
                      {option.label}
                    </p>
                    <p
                      className="text-[10px]"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {isDisabled ? 'API 키 필요' : option.description}
                    </p>
                  </m.button>
                )
              })}
            </div>
          </div>

          {/* Murf 음성 선택 (Murf 활성 시) */}
          {ttsProvider === 'murf' && isMurfConfigured() && (
            <div className="space-y-2">
              <p
                className="type-section flex items-center gap-1"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                <Mic className="w-3 h-3" />
                일본어 음성
              </p>
              <div className="grid grid-cols-3 gap-2">
                {JAPANESE_VOICES.map((voice) => {
                  const isSelected = murfVoiceId === voice.voiceId
                  return (
                    <m.button
                      key={voice.voiceId}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setMurfVoiceId(voice.voiceId)}
                      className={cn(
                        'p-2 rounded-xl border-2 text-center transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-foreground/30',
                      )}
                    >
                      <div className="text-xl mb-0.5">{voice.avatar}</div>
                      <p
                        className={cn(
                          'font-semibold text-xs',
                          isSelected && 'text-primary',
                        )}
                      >
                        {voice.name}
                      </p>
                      <p
                        className="text-[9px]"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {voice.gender === 'female' ? '여성' : '남성'}
                      </p>
                    </m.button>
                  )
                })}
              </div>
            </div>
          )}

          {/* 발음 속도 (브라우저 TTS만) */}
          {ttsProvider === 'browser' && (
            <div className="space-y-2">
              <p
                className="type-section"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                발음 속도
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {TTS_SPEED_OPTIONS.map((option) => {
                  const isSelected = ttsRate === option.value
                  return (
                    <m.button
                      key={option.value}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTTSRate(option.value)}
                      className={cn(
                        'py-2 px-1 rounded-lg border-2 text-center transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-foreground/30',
                      )}
                    >
                      <p
                        className={cn(
                          'font-semibold text-xs',
                          isSelected && 'text-primary',
                        )}
                      >
                        {option.label}
                      </p>
                    </m.button>
                  )
                })}
              </div>
            </div>
          )}

          {/* 테스트 */}
          <TTSButton
            text="こんにちは、日本語を勉強しましょう"
            label="음성 테스트"
            variant="outline"
            className="w-full h-10"
          />

          {/* 전체 설정 페이지로 */}
          <Button
            variant="ghost"
            className="w-full h-10 justify-between text-sm"
            onClick={() => {
              onOpenChange(false)
              navigate('/settings')
            }}
          >
            <span style={{ color: 'var(--color-text-secondary)' }}>
              전체 설정 보기
            </span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
