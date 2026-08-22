// 선택한 뱃지 표시 — 프로필 카드, 통계 헤더 등에 inline으로 사용.
// 사용자가 BadgeCollectionPage에서 선택한 뱃지(최대 3개) 표시.
import { useNavigate } from 'react-router-dom'
import { Award } from 'lucide-react'
import { AchievementBadgeSvg } from '@/components/AchievementBadgeSvg'
import { getBadgeById, TIER_COLORS } from '@/data/achievementBadges'
import { useAppStore } from '@/store'

interface SelectedBadgeStripProps {
  /** 뱃지 크기 (기본 36) */
  size?: number
  /** 뱃지 이름 표시 (기본 false) */
  showLabel?: boolean
  /** 빈 상태(선택된 뱃지 없음)에서 "뱃지함" 진입 버튼 표시 */
  showEmptyCta?: boolean
  className?: string
}

export function SelectedBadgeStrip({
  size = 36,
  showLabel = false,
  showEmptyCta = false,
  className = '',
}: SelectedBadgeStripProps) {
  const navigate = useNavigate()
  const selectedBadgeIds = useAppStore((s) => s.selectedBadgeIds)
  const badges = selectedBadgeIds
    .map((id) => getBadgeById(id))
    .filter((b): b is NonNullable<ReturnType<typeof getBadgeById>> => !!b)

  if (badges.length === 0) {
    if (!showEmptyCta) return null
    return (
      <button
        onClick={() => navigate('/settings/badges')}
        className={`flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-2.5 py-1 transition-colors ${className}`}
        style={{
          background: 'var(--color-muted)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <Award className="w-3 h-3" />
        뱃지함에서 골라보세요
      </button>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {badges.map((badge) => {
        const tier = TIER_COLORS[badge.tier]
        return (
          <div
            key={badge.id}
            className="flex items-center gap-1.5 rounded-full px-1.5 py-1"
            style={{
              background: tier.bg,
              border: `1px solid ${tier.primary}`,
            }}
            title={`${badge.name} · ${badge.sub}`}
          >
            <AchievementBadgeSvg id={badge.id} size={size} animated={false} />
            {showLabel && (
              <span
                className="text-[10px] font-extrabold pr-1"
                style={{ color: tier.primary }}
              >
                {badge.name}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
