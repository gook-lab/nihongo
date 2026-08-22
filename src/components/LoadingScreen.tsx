// 풀스크린 로딩 화면 — share/Loading Spinners.html의 phone preview 패턴
// 사용처: 앱 첫 진입(Splash), 학습 시작 전, 동기화, 큰 작업 대기
//
// 인라인 로딩(버튼/카드 안)은 <Spinner variant="..." />를 직접 쓸 것.
import { m } from 'framer-motion'
import { Spinner, type SpinnerVariant } from '@/components/Spinner'

interface LoadingScreenProps {
  variant?: SpinnerVariant   // 기본 'mascot'
  title?: string             // 큰 제목 (예: "시작하는 중")
  description?: string       // 작은 안내 (예: "오늘의 첫 학습을 준비하고 있어요")
  showProgress?: boolean     // 하단에 indeterminate 진행바 표시
  /** 풀스크린 vs 인라인 (overlay 안 띄움). 기본 true */
  fullscreen?: boolean
  /** 단색 배경 override */
  background?: string
}

export function LoadingScreen({
  variant = 'mascot',
  title,
  description,
  showProgress = true,
  fullscreen = true,
  background,
}: LoadingScreenProps) {
  const content = (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center gap-5 px-6 text-center"
    >
      <Spinner variant={variant} size={variant === 'hiragana' ? 64 : undefined} />
      {(title || description) && (
        <div>
          {title && (
            <p
              className="text-base font-extrabold"
              style={{ color: 'var(--color-foreground)', letterSpacing: '-0.3px' }}
            >
              {title}
            </p>
          )}
          {description && (
            <p
              className="text-xs mt-1.5 leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {description}
            </p>
          )}
        </div>
      )}
      {showProgress && (
        <div
          style={{
            width: 180,
            height: 4,
            borderRadius: 4,
            background: 'var(--color-muted)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--color-primary)',
              borderRadius: 4,
              transformOrigin: 'left',
              animation: 'spinner-bar-fill 2.4s ease-in-out infinite',
            }}
          />
        </div>
      )}
    </m.div>
  )

  if (!fullscreen) {
    return <div className="flex items-center justify-center py-12">{content}</div>
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: background ?? 'var(--color-background)' }}
      role="status"
      aria-live="polite"
    >
      {content}
    </div>
  )
}
