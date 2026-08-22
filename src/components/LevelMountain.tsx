// C. 산 등반 stepper — share/Level Badges.html C 섹션 포팅.
// 7개 노드가 곡선을 따라 배치, 현재 레벨까지 솔리드 + 그 뒤는 dashed.
import { LevelBadgeSvg } from '@/components/LevelBadgeSvg'
import { LEVEL_BADGES } from '@/lib/levelBadges'

interface LevelMountainProps {
  currentLevel: number
}

// 곡선 path 위 노드 위치 (% 단위). 원본 HTML과 동일.
const NODE_POSITIONS = [
  { x: 4, y: 92 },
  { x: 22, y: 56 },
  { x: 38, y: 78 },
  { x: 56, y: 50 },
  { x: 70, y: 80 },
  { x: 82, y: 56 },
  { x: 96, y: 26 },
]

export function LevelMountain({ currentLevel }: LevelMountainProps) {
  return (
    <div
      className="rounded-3xl overflow-hidden relative"
      style={{
        background:
          'linear-gradient(180deg, #FFF6F9 0%, var(--color-card) 60%)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        padding: '32px 16px 40px',
      }}
    >
      <div className="relative" style={{ height: 230 }}>
        {/* 곡선 + 산 실루엣 SVG */}
        <svg
          viewBox="0 0 1000 230"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="lvl-curve" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#FF3366" />
              <stop offset="50%" stopColor="#FF8FB1" />
              <stop offset="100%" stopColor="#FFD9E2" />
            </linearGradient>
          </defs>
          {/* 산 silhouette */}
          <path
            d="M0 200 L120 190 L260 150 L420 170 L580 120 L740 140 L880 70 L1000 100 L1000 230 L0 230 Z"
            fill="#FFE6EC"
          />
          <path
            d="M0 215 L130 200 L290 175 L460 195 L620 150 L790 165 L920 95 L1000 120 L1000 230 L0 230 Z"
            fill="#FFD0DA"
          />
          {/* dashed 전체 climb path */}
          <path
            d="M40 200 Q200 200 220 130 Q240 60 380 170 Q520 280 580 100 Q640 -40 780 130 Q920 260 960 60"
            fill="none"
            stroke="#FFB0BC"
            strokeWidth={3}
            strokeDasharray="6 6"
          />
          {/* 현재 레벨까지 솔리드 — 단순화: 그라데이션 path만 강조 표시는 노드의 spotlight로 대체 */}
        </svg>

        {/* 7개 노드 */}
        {LEVEL_BADGES.map((lv, i) => {
          const pos = NODE_POSITIONS[i]
          const isCurrent = lv.id === currentLevel
          const isLocked = lv.id > currentLevel
          return (
            <div
              key={lv.id}
              className="absolute flex items-center justify-center"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: 60,
                height: 60,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* 현재 레벨 spotlight — dashed circle 회전 */}
              {isCurrent && (
                <span
                  aria-hidden="true"
                  className="absolute"
                  style={{
                    inset: -10,
                    borderRadius: '50%',
                    border: '2px dashed var(--color-primary)',
                    animation: 'badge-spin 20s linear infinite',
                  }}
                />
              )}
              <LevelBadgeSvg level={lv.id} size={42} locked={isLocked} />
              {/* tag */}
              <div
                className="absolute whitespace-nowrap text-[9px] font-extrabold tracking-wider"
                style={{
                  bottom: -22,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: isCurrent ? 'var(--color-primary)' : 'var(--color-foreground)',
                }}
              >
                Lv.{lv.id} {lv.name}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
