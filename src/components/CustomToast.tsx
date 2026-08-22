// 통합 Toast 컴포넌트 (react-hot-toast 위에 우리 디자인 톤)
// 4가지 타입: success / error / warning / info
// 애니메이션: 기존 우리 앱의 framer-motion 패턴 활용 (slideUp + scale)
import { type Toast } from 'react-hot-toast'
import { m, AnimatePresence } from 'framer-motion'
import { CircleX, TriangleAlert, CircleCheck, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface CustomToastProps {
  t: Toast
  type: ToastType
  title?: string
  message: string
}

export function CustomToast({ t, type, title, message }: CustomToastProps) {
  // 타입별 아이콘 + 색상 (우리 디자인 토큰 기반)
  const styles = {
    success: {
      icon: <CircleCheck className="w-[22px] h-[22px] shrink-0" />,
      bg: 'var(--color-success-light)',
      border: 'var(--color-success)',
      color: 'var(--color-success-dark)',
    },
    error: {
      icon: <CircleX className="w-[22px] h-[22px] shrink-0" />,
      bg: 'var(--color-error-light)',
      border: 'var(--color-destructive)',
      color: 'var(--color-error-dark)',
    },
    warning: {
      icon: <TriangleAlert className="w-[22px] h-[22px] shrink-0" />,
      bg: 'var(--color-warning-light)',
      border: 'var(--color-warning)',
      color: 'var(--color-warning-dark)',
    },
    info: {
      icon: <Info className="w-[22px] h-[22px] shrink-0" />,
      bg: 'var(--color-muted)',
      border: 'var(--color-border)',
      color: 'var(--color-foreground)',
    },
  }[type]

  return (
    <AnimatePresence>
      {t.visible && (
        // CLAUDE.md design-system.md §7: motion.div에 Tailwind width 클래스가
        // 무시되는 이슈 회피 — 인라인 스타일로 width 명시.
        // react-hot-toast 컨테이너 폭(보통 viewport 기준 padding 적용)에 맞춰
        // 텍스트가 세로로 한 글자씩 떨어지는 버그(width 0) 방지.
        <m.div
          key={t.id}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.18 } }}
          transition={{ type: 'spring', damping: 24, stiffness: 320 }}
          className={cn(
            'pointer-events-auto rounded-2xl border-[1.5px] shadow-lg',
          )}
          style={{
            width: 'min(28rem, calc(100vw - 32px))',
            background: styles.bg,
            borderColor: styles.border,
            color: styles.color,
          }}
        >
          <div className="flex items-start gap-3 p-3.5">
            <span style={{ color: styles.border }}>{styles.icon}</span>
            <div className="flex-1 min-w-0">
              {title && (
                <p className="font-bold text-sm leading-tight mb-0.5">{title}</p>
              )}
              <p className="text-sm font-medium leading-snug break-keep">
                {message}
              </p>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
