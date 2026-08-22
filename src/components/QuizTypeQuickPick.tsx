// 홈에서 빠르게 학습 유형을 토글 — chip row.
// 학습 시작 버튼 바로 위에 배치.
import { m } from 'framer-motion'
import { useAppStore } from '@/store'
import { haptic } from '@/lib/haptic'

type QuizType = 'standard' | 'reverse' | 'listening'

const TYPES: { id: QuizType; label: string; emoji: string }[] = [
  { id: 'standard', label: '독해', emoji: '📖' },
  { id: 'reverse', label: '작문', emoji: '✍️' },
  { id: 'listening', label: '청해', emoji: '🎧' },
]

export function QuizTypeQuickPick() {
  const enabled = useAppStore((s) => s.enabledQuizTypes)
  const toggle = useAppStore((s) => s.toggleQuizType)

  return (
    <div className="flex items-center gap-1.5">
      <span
        className="text-[11px] font-bold tracking-wider shrink-0 mr-1"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        유형
      </span>
      {TYPES.map((t) => {
        const active = enabled.includes(t.id)
        const isLast = active && enabled.length === 1
        return (
          <m.button
            key={t.id}
            whileTap={{ scale: isLast ? 1 : 0.94 }}
            onClick={() => {
              if (isLast) return
              haptic.tap()
              toggle(t.id)
            }}
            disabled={isLast}
            className="inline-flex items-center gap-1 h-8 px-2.5 rounded-full text-[12px] font-semibold transition-colors border-[1.5px]"
            style={{
              background: active ? 'var(--color-primary)' : 'var(--color-card)',
              color: active
                ? 'var(--color-primary-foreground)'
                : 'var(--color-text-secondary)',
              borderColor: active ? 'var(--color-primary)' : 'var(--color-border-light)',
              opacity: isLast ? 0.85 : 1,
            }}
            aria-pressed={active}
            title={isLast ? '최소 1개는 유지해야 해요' : `${t.label} 토글`}
          >
            <span aria-hidden>{t.emoji}</span>
            {t.label}
          </m.button>
        )
      })}
    </div>
  )
}
