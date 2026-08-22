// 마스코트 아바타 컴포넌트 (리액션 애니메이션 포함)
// reaction 메타는 lib/mascotAnimations.ts에서 중앙 관리. 새 reaction 추가는 거기서 하면 됨.
import { m } from 'framer-motion'
import { useAppStore } from '@/store'
import { MASCOTS } from '@/data/mascots'
import type { Mascot } from '@/types'
import { REACTIONS, type MascotReaction } from '@/lib/mascotAnimations'

export type { MascotReaction }
export type MascotSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

interface MascotAvatarProps {
  size?: MascotSize
  reaction?: MascotReaction
  mascot?: Mascot
  showBorder?: boolean
  className?: string
}

const sizeClasses: Record<MascotSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32',
  '3xl': 'w-40 h-40',
}

// reaction별 framer/transition은 REACTIONS[reaction]에서 가져옴 (단일 소스)

export function MascotAvatar({
  size = 'md',
  reaction = 'idle',
  mascot: propMascot,
  showBorder = true,
  className = '',
}: MascotAvatarProps) {
  const selectedMascotId = useAppStore((s) => s.selectedMascotId)
  const mascot = propMascot ?? MASCOTS.find((m) => m.id === selectedMascotId) ?? MASCOTS[0]

  const def = REACTIONS[reaction]
  return (
    <m.div
      key={reaction}
      animate={def.framer}
      transition={def.transition}
      className={`${sizeClasses[size]} rounded-full overflow-hidden ${
        showBorder ? 'border-2 border-primary/20 shadow-md bg-white' : ''
      } ${className}`}
    >
      {mascot.image ? (
        <img
          src={mascot.image}
          alt={mascot.nameKr}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ fontSize: '70%' }}
          aria-label={mascot.nameKr}
          role="img"
        >
          {mascot.emoji ?? '🐾'}
        </div>
      )}
    </m.div>
  )
}
