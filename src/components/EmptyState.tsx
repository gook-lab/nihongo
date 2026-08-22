// 공통 빈 상태 표시 — 마스코트 씬 + 제목 + 설명 + 옵션 액션 버튼
// 사용처: WrongWordsPage / ConversationMemoPage / ChatModal 빈 상태 등
//
// 마스코트 reaction은 빈 상태의 "톤"을 결정:
// - 'happy'  : 잘하고 있음 (예: 오답 0개)
// - 'sleep'  : 비어있음/대기 (예: 저장된 단어 0개)
// - 'think'  : 헷갈림 (예: 검색 결과 없음)
// - 'wave'   : 첫 진입 인사
import type { ReactNode } from 'react'
import { m } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MascotScene } from '@/components/MascotScene'
import type { MascotReaction } from '@/lib/mascotAnimations'

interface EmptyStateProps {
  reaction?: MascotReaction
  /** 작은 카드 (xl). 기본 false면 2xl 사용 */
  compact?: boolean
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  /** 액션 영역 커스텀 (버튼 여러 개 등) */
  customAction?: ReactNode
  /** 말풍선 — true: reaction 기본 메시지 / string: 직접 지정 / 기본 true */
  bubble?: boolean | string
  className?: string
}

export function EmptyState({
  reaction = 'sleep',
  compact = false,
  title,
  description,
  actionLabel,
  onAction,
  customAction,
  bubble = true,
  className = '',
}: EmptyStateProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center text-center py-8 ${className}`}
    >
      {/* 사이즈 토큰이 width까지 결정 — 부모는 가운데 정렬만 */}
      <div className="mb-4 flex justify-center">
        <MascotScene
          reaction={reaction}
          sizeToken={compact ? 'xl' : '2xl'}
          bubble={bubble}
        />
      </div>
      <p className="text-base font-semibold" style={{ color: 'var(--color-foreground)' }}>
        {title}
      </p>
      {description && (
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          {description}
        </p>
      )}
      {customAction ? (
        <div className="mt-4">{customAction}</div>
      ) : actionLabel && onAction ? (
        <Button variant="outline" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </m.div>
  )
}
