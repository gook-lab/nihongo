// 작은 "Lv.1 입문자" 인라인 칩 — 텍스트 뱃지 (큰 SVG 뱃지는 LevelBadgeSvg)
// 색상은 lib/levelBadges.ts의 메타와 통일.
import { cn } from '@/lib/utils'
import { getLevelBadge } from '@/lib/levelBadges'

interface LevelBadgeProps {
  level: number
  size?: 'sm' | 'md' | 'lg'
  /** SVG 뱃지 함께 표시 */
  withSvg?: boolean
  className?: string
}

const SIZE_CLASSES = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
}

export function LevelBadge({
  level,
  size = 'md',
  withSvg = false,
  className = '',
}: LevelBadgeProps) {
  const meta = getLevelBadge(level)

  // SVG 함께 표시 (withSvg=true)
  if (withSvg) {
    // 동적 import 회피 — 직접 사용처에서 LevelBadgeSvg 호출 권장
    // 이 경로는 backward compat용
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 font-semibold rounded-full transition-all',
          SIZE_CLASSES[size],
          className,
        )}
        style={{
          background: `${meta.color}22`,
          color: meta.color,
        }}
      >
        Lv.{level} {meta.name}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full transition-all',
        SIZE_CLASSES[size],
        className,
      )}
      style={{
        background: `${meta.color}1F`, // 12% opacity hex
        color: meta.color,
      }}
    >
      Lv.{level} {meta.name}
    </span>
  )
}
