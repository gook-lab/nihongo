// share/Level Badges.html E 섹션 (Showcase) 포팅.
// 다크 배경 + 큰 뱃지 + 레벨 카피 + 3 stat (현재 XP / 다음까지 / 진행률) + 진행 바.
// 사용처: StatisticsPage 레벨 영역, ResultPage 등.
import { m } from 'framer-motion'
import { LevelBadgeSvg } from '@/components/LevelBadgeSvg'
import { getLevelBadge } from '@/lib/levelBadges'
import { useAppStore } from '@/store'

interface LevelShowcaseCardProps {
  /** 클릭 핸들러 (전체 카드를 버튼처럼 동작) */
  onClick?: () => void
  className?: string
}

// 다음 레벨까지 예상 일수 — 하루 50 XP 가정. UI 텍스트용 추정치.
function daysToNextLevel(remainingXP: number): number {
  const dailyXP = 50
  return Math.max(1, Math.ceil(remainingXP / dailyXP))
}

export function LevelShowcaseCard({ onClick, className = '' }: LevelShowcaseCardProps) {
  const xp = useAppStore((s) => s.xp)
  const level = useAppStore((s) => s.level)
  const nickname = useAppStore((s) => s.user?.nickname)
  const meta = getLevelBadge(level)
  const nextXP = meta.nextXP
  const remainingXP = nextXP === null ? 0 : Math.max(0, nextXP - xp)
  const xpInLevel = xp - meta.minXP
  const xpRangeInLevel = nextXP === null ? 1 : nextXP - meta.minXP
  const progressPct = nextXP === null ? 1 : Math.min(1, xpInLevel / xpRangeInLevel)
  const progressPercent = Math.round(progressPct * 100)

  const Wrapper = onClick ? m.button : m.div
  const wrapperProps = onClick
    ? { onClick, whileTap: { scale: 0.99 } as const }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-3xl text-left ${
        onClick ? 'cursor-pointer w-full' : ''
      } ${className}`}
      style={{
        background: '#161628',
        color: '#fff',
        boxShadow: '0 6px 24px rgba(22, 22, 40, 0.18)',
      }}
    >
      {/* 우상단 핑크 글로우 — 원본 ::before */}
      <span
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: -80,
          right: -80,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
          opacity: 0.5,
        }}
      />

      <div className="relative grid grid-cols-[auto_1fr] gap-5 p-6 items-center">
        {/* 큰 뱃지 */}
        <LevelBadgeSvg level={level} size={120} />

        {/* 메타 */}
        <div className="min-w-0">
          <p
            className="type-eyebrow"
            style={{ color: 'var(--color-primary)' }}
          >
            CURRENT LEVEL · LV.{level}
          </p>
          <h3
            className="font-extrabold leading-[1.1] mt-1.5"
            style={{ fontSize: 26, letterSpacing: '-0.5px' }}
          >
            {meta.name}
            <br />
            {nickname ? `${nickname}님의 발걸음` : '의 발걸음'}
          </h3>
          <p
            className="text-[12px] mt-2 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            {meta.sub}. 지금까지{' '}
            <span style={{ color: '#fff', fontWeight: 700 }}>{xp} XP</span>를
            모았어요.
          </p>

          {/* 3 stat */}
          <div className="flex gap-4 mt-3">
            <Stat label="현재 XP" value={`${xp}`} />
            <Stat
              label="다음까지"
              value={nextXP === null ? 'MAX' : `${remainingXP} XP`}
            />
            <Stat label="진행률" value={`${progressPercent}%`} />
          </div>

          {/* 큰 진행 바 */}
          <div
            className="h-2 rounded-full overflow-hidden mt-4 relative"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, var(--color-primary), #FF8FB1)',
                transformOrigin: 'left',
                transform: `scaleX(${progressPct.toFixed(3)})`,
                transition: 'transform 1s cubic-bezier(0.2, 0.7, 0.2, 1.05)',
              }}
            />
          </div>

          <p
            className="text-[11px] mt-2 font-mono"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            {nextXP === null
              ? '최고 레벨 달성! 🎉'
              : `Lv.${level + 1}까지 · 약 ${daysToNextLevel(remainingXP)}일`}
          </p>
        </div>
      </div>
    </Wrapper>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        className="text-[9px] font-extrabold tracking-[2px]"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        {label}
      </p>
      <p
        className="font-extrabold mt-0.5"
        style={{ fontSize: 18, letterSpacing: '-0.4px' }}
      >
        {value}
      </p>
    </div>
  )
}
