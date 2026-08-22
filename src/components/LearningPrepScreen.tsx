// 학습 0단계 — 본 세션 진입 전 유형 선택 + 시작 화면.
// LearningPage에서 새 세션 시작 시 첫 화면.
import { m } from 'framer-motion'
import { ChevronLeft, BookOpen, Play, BookOpenCheck, Mic, PenLine } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MascotScene } from '@/components/MascotScene'
import { useAppStore } from '@/store'
import { QUESTIONS_PER_SESSION } from '@/constants'
import { haptic } from '@/lib/haptic'

const TYPES = [
  { id: 'standard' as const, label: '독해', desc: '일본어 보고 뜻 입력', Icon: BookOpenCheck },
  { id: 'reverse' as const, label: '작문', desc: '한국어 보고 일본어 쓰기', Icon: PenLine },
  { id: 'listening' as const, label: '청해', desc: 'TTS 듣고 뜻 입력', Icon: Mic },
]

interface Props {
  onStart: () => void
  onBack: () => void
}

export function LearningPrepScreen({ onStart, onBack }: Props) {
  const enabled = useAppStore((s) => s.enabledQuizTypes)
  const useCanvas = useAppStore((s) => s.useCanvasForReverse)
  const toggle = useAppStore((s) => s.toggleQuizType)
  const setUseCanvas = useAppStore((s) => s.setUseCanvasForReverse)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
      <div className="px-5 pt-6 pb-3 flex items-center">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full"
          style={{ background: 'var(--color-card)' }}
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 text-center">
          <p
            className="type-eyebrow"
            style={{ color: 'var(--color-primary)' }}
          >
            STEP 0 · 준비
          </p>
          <p className="text-sm font-bold mt-0.5">학습 유형 선택</p>
        </div>
        <div className="w-10" />
      </div>

      <m.div
        className="flex-1 px-5 pb-6 space-y-5 overflow-y-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* 마스코트 + 안내 */}
        <div className="flex flex-col items-center pt-2">
          <MascotScene reaction="wave" sizeToken="xs" />
          <p className="text-base font-bold mt-3 text-center">
            오늘은 어떤 식으로 학습할까요?
          </p>
          <p
            className="text-xs mt-1 text-center"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            총 {QUESTIONS_PER_SESSION}문제 · 켜둔 유형이 골고루 섞여요
          </p>
        </div>

        {/* 유형 토글 카드 */}
        <Card>
          <CardContent className="p-0 divide-y divide-border-light">
            {TYPES.map((t) => {
              const active = enabled.includes(t.id)
              const isLast = active && enabled.length === 1
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    if (isLast) return
                    haptic.tap()
                    toggle(t.id)
                  }}
                  disabled={isLast}
                  className="w-full flex items-center gap-3 p-4 text-left transition-colors"
                  style={{ opacity: isLast ? 0.7 : 1 }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: active ? 'var(--color-primary)' : 'var(--color-muted)',
                      color: active ? '#fff' : 'var(--color-text-secondary)',
                    }}
                  >
                    <t.Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{t.label}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {t.desc}
                    </p>
                  </div>
                  <div
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0"
                    style={{
                      background: active ? 'var(--color-primary)' : 'var(--color-border-light)',
                    }}
                    aria-hidden
                  >
                    <m.span
                      layout
                      className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
                      animate={{ x: active ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* 한→일 캔버스 모드 (reverse 켜져있을 때만) */}
        {enabled.includes('reverse') && (
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--color-sakura-100)' }}
                >
                  <span className="text-base">✍️</span>
                </div>
                <div>
                  <p className="text-sm font-bold">손글씨로 답하기</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {useCanvas ? '캔버스 입력 사용 중' : '키보드 입력 사용 중'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  haptic.tap()
                  setUseCanvas(!useCanvas)
                }}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{
                  background: useCanvas ? 'var(--color-primary)' : 'var(--color-border-light)',
                }}
                aria-label="손글씨 모드 전환"
                aria-pressed={useCanvas}
              >
                <m.span
                  layout
                  className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
                  animate={{ x: useCanvas ? 22 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </CardContent>
          </Card>
        )}
      </m.div>

      {/* 시작 버튼 */}
      <div
        className="px-5 pb-6 pt-3 border-t"
        style={{
          background: 'var(--color-background)',
          borderColor: 'var(--color-border-light)',
        }}
      >
        <Button
          onClick={() => {
            haptic.success()
            onStart()
          }}
          className="w-full h-14 text-base font-semibold"
          disabled={enabled.length === 0}
        >
          <Play className="w-4 h-4 mr-2 fill-current" />
          {QUESTIONS_PER_SESSION}문제 시작하기
        </Button>
      </div>
    </div>
  )
}

// 빌드 호환
void BookOpen
