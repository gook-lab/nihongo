// 뱃지함 — 사용자가 획득한 뱃지를 보고 프로필에 표시할 뱃지를 선택.
// 11종 뱃지 (스트릭 5 + 이정표 6). 최대 3개까지 선택 가능.
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { ChevronLeft, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BottomNav } from '@/components/BottomNav'
import { AchievementBadgeSvg } from '@/components/AchievementBadgeSvg'
import {
  STREAK_BADGES,
  MILESTONE_BADGES,
  TIER_COLORS,
  type AchievementBadge,
} from '@/data/achievementBadges'
import { getLevelBadge } from '@/lib/levelBadges'
import { useAppStore, type AppState } from '@/store'
import { toast } from '@/lib/toast'

export function BadgeCollectionPage() {
  const navigate = useNavigate()
  const state = useAppStore() as AppState
  const selectedBadgeIds = state.selectedBadgeIds
  const toggleBadge = state.toggleBadge

  const earnedCount =
    [...STREAK_BADGES, ...MILESTONE_BADGES].filter((b) => b.isEarned(state)).length
  const totalCount = STREAK_BADGES.length + MILESTONE_BADGES.length

  function handleToggle(badge: AchievementBadge) {
    if (!badge.isEarned(state)) {
      toast.info({ message: '아직 획득하지 못한 뱃지예요' })
      return
    }
    const isSelected = selectedBadgeIds.includes(badge.id)
    if (!isSelected && selectedBadgeIds.length >= 3) {
      toast.warning({ message: '최대 3개까지 선택 가능 — 가장 오래된 것이 빠집니다' })
    }
    toggleBadge(badge.id)
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      {/* 헤더 */}
      <div className="pt-6 pb-4 px-5 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border-light">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings/appearance')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="w-4 h-4 text-primary" />
            </div>
            <span className="type-h3">뱃지함</span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-5 pt-4 space-y-5">
        {/* 현재 레벨 헤더 — UI Tone Board: 핑크 그라데이션 카드 */}
        <CurrentLevelHero earnedCount={earnedCount} totalCount={totalCount} />

        {/* 안내 */}
        <Card>
          <CardContent className="p-4">
            <p className="text-sm leading-relaxed">
              최대 3개를 골라 프로필 카드에 표시할 수 있어요.
            </p>
            {selectedBadgeIds.length > 0 && (
              <p
                className="text-xs mt-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                현재 선택:{' '}
                <span className="font-semibold">
                  {selectedBadgeIds.length} / 3
                </span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* 스트릭 섹션 */}
        <Section
          title="연속 학습"
          subtitle="매일 학습하면 얻는 뱃지"
          badges={STREAK_BADGES}
          state={state}
          selectedIds={selectedBadgeIds}
          onToggle={handleToggle}
        />

        {/* 이정표 섹션 */}
        <Section
          title="이정표"
          subtitle="학습 성취로 얻는 뱃지"
          badges={MILESTONE_BADGES}
          state={state}
          selectedIds={selectedBadgeIds}
          onToggle={handleToggle}
        />
      </div>

      <BottomNav />
    </div>
  )
}

function Section({
  title,
  subtitle,
  badges,
  state,
  selectedIds,
  onToggle,
}: {
  title: string
  subtitle: string
  badges: AchievementBadge[]
  state: AppState
  selectedIds: string[]
  onToggle: (b: AchievementBadge) => void
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3 px-1">
        <p className="text-sm font-extrabold tracking-tight">{title}</p>
        <span
          className="text-[11px]"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {subtitle}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {badges.map((badge) => {
          const earned = badge.isEarned(state)
          const isSelected = selectedIds.includes(badge.id)
          const progress = !earned && badge.progress ? badge.progress(state) : null
          const tier = TIER_COLORS[badge.tier]

          return (
            <m.button
              key={badge.id}
              whileTap={{ scale: earned ? 0.97 : 1 }}
              onClick={() => onToggle(badge)}
              className="relative rounded-2xl p-3 flex flex-col items-center gap-2 transition-colors text-left border-[1.5px]"
              style={{
                background: 'var(--color-card)',
                borderColor: isSelected ? tier.primary : 'var(--color-border-light)',
                boxShadow: isSelected ? `0 4px 12px ${tier.primary}33` : undefined,
              }}
            >
              <AchievementBadgeSvg id={badge.id} size={48} locked={!earned} />
              <div className="text-center">
                <p className="text-[11px] font-extrabold leading-tight">
                  {badge.name}
                </p>
                <p
                  className="text-[9px] mt-0.5 leading-tight"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {badge.sub}
                </p>
              </div>
              <span
                className="text-[8px] font-extrabold tracking-[1px] px-1 py-0.5 rounded"
                style={{ background: tier.bg, color: tier.primary }}
              >
                {badge.tier}
              </span>

              {/* 진척률 바 — 미획득 + 진행 중 */}
              {progress && (
                <div className="w-full">
                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ background: 'var(--color-muted)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: tier.primary,
                        transformOrigin: 'left',
                        transform: `scaleX(${(progress.current / progress.target).toFixed(2)})`,
                        transition: 'transform 0.6s ease-out',
                      }}
                    />
                  </div>
                  <p
                    className="text-[9px] mt-0.5 text-center font-mono"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {progress.current} / {progress.target}
                  </p>
                </div>
              )}

              {/* 선택 표시 */}
              {isSelected && (
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: tier.primary }}
                >
                  <span className="text-white text-[10px] font-bold">✓</span>
                </div>
              )}
            </m.button>
          )
        })}
      </div>
    </div>
  )
}

// 상단 그라데이션 헤더 — UI Tone Board CURRENT LV.N 카드
function CurrentLevelHero({
  earnedCount,
  totalCount,
}: {
  earnedCount: number
  totalCount: number
}) {
  const xp = useAppStore((s) => s.xp)
  const level = useAppStore((s) => s.level)
  const nickname = useAppStore((s) => s.user?.nickname)
  const meta = getLevelBadge(level)
  const pct =
    meta.nextXP === null ? 1 : (xp - meta.minXP) / (meta.nextXP - meta.minXP)
  const remaining = meta.nextXP === null ? 0 : meta.nextXP - xp
  const dailyXP = 50
  const daysLeft = Math.max(1, Math.ceil(remaining / dailyXP))

  return (
    <div
      className="rounded-2xl p-4 text-white relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #FF8FB1 100%)',
      }}
    >
      <p className="text-[9px] font-extrabold tracking-[1.5px] opacity-85">
        CURRENT LV.{level} · {earnedCount} / {totalCount} 뱃지 획득
      </p>
      <p
        className="font-extrabold mt-1 leading-tight"
        style={{ fontSize: 18, letterSpacing: '-0.3px' }}
      >
        {meta.name} {nickname ? `${nickname}님의 발걸음` : '의 발걸음'}
      </p>
      <div
        className="h-1 rounded-full overflow-hidden mt-2"
        style={{ background: 'rgba(255,255,255,0.25)' }}
      >
        <div
          className="h-full rounded-full bg-white"
          style={{
            transformOrigin: 'left',
            transform: `scaleX(${pct.toFixed(2)})`,
            transition: 'transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1.05)',
          }}
        />
      </div>
      <p className="text-[10px] opacity-90 mt-1 font-mono">
        {meta.nextXP === null
          ? `${xp} XP · MAX`
          : `${xp} / ${meta.nextXP} XP · Lv.${level + 1}까지 ${daysLeft}일`}
      </p>
    </div>
  )
}
