// 마스코트 말풍선 — MascotAvatar 옆에 단독으로 띄울 때 사용
// (MascotScene 내부의 말풍선은 자체 구현 — 디자인 토큰만 공유)
import { m } from 'framer-motion'
import { REACTION_MESSAGES, type MascotReaction } from '@/lib/mascotAnimations'

interface MascotBubbleProps {
  reaction: MascotReaction
  text?: string                // 명시적 텍스트 (없으면 REACTION_MESSAGES 사용)
  tailDirection?: 'down' | 'left' | 'right' // 꼬리 방향. 기본 down (마스코트가 아래에 있을 때)
  tone?: 'light' | 'dark'      // dark는 sleep 같은 어두운 배경 위에서
  className?: string
  style?: React.CSSProperties
}

export function MascotBubble({
  reaction,
  text,
  tailDirection = 'down',
  tone = 'light',
  className = '',
  style,
}: MascotBubbleProps) {
  const message = text ?? REACTION_MESSAGES[reaction]
  if (!message) return null

  const bubbleColors =
    tone === 'dark'
      ? { bg: 'rgba(255,255,255,0.96)', color: '#1A1A1A' }
      : { bg: 'var(--color-card)', color: 'var(--color-text-primary)' }

  // 꼬리 공통 스타일
  const tailBase: React.CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
  }
  const tailByDir: Record<typeof tailDirection, React.CSSProperties> = {
    down: {
      ...tailBase,
      bottom: -6,
      left: 16,
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderTop: `6px solid ${bubbleColors.bg}`,
    },
    left: {
      ...tailBase,
      left: -6,
      top: 12,
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      borderRight: `6px solid ${bubbleColors.bg}`,
    },
    right: {
      ...tailBase,
      right: -6,
      top: 12,
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      borderLeft: `6px solid ${bubbleColors.bg}`,
    },
  }

  return (
    <m.div
      initial={{ opacity: 0, y: -4, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.92 }}
      transition={{ duration: 0.22 }}
      className={`relative ${className}`}
      style={{
        padding: '8px 12px',
        borderRadius: 16,
        fontSize: 13,
        fontWeight: 700,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        background: bubbleColors.bg,
        color: bubbleColors.color,
        ...style,
      }}
    >
      {message}
      <span aria-hidden="true" style={tailByDir[tailDirection]} />
    </m.div>
  )
}
