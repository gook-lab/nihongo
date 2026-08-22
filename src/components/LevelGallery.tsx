// A. 뱃지 갤러리 — share/Level Badges.html A 섹션 포팅.
// 7개 카드 그리드. 각 카드: 큰 뱃지 + 레벨 라벨 + XP 범위 칩
import { LevelBadgeSvg } from '@/components/LevelBadgeSvg'
import { LEVEL_BADGES } from '@/lib/levelBadges'

interface LevelGalleryProps {
  /** 강조할 현재 레벨 (기본: 강조 없음) */
  currentLevel?: number
}

export function LevelGallery({ currentLevel }: LevelGalleryProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {LEVEL_BADGES.map((lv) => {
        const isCurrent = currentLevel === lv.id
        return (
          <div
            key={lv.id}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-transform hover:-translate-y-0.5"
            style={{
              background: 'var(--color-card)',
              border: isCurrent
                ? `1.5px solid ${lv.color}`
                : '1px solid var(--color-border-light)',
              boxShadow: isCurrent
                ? `0 4px 14px ${lv.color}33`
                : '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <LevelBadgeSvg level={lv.id} size={64} />
            <div className="text-center">
              <p
                className="text-[10px] tracking-[1.5px] font-extrabold"
                style={{ color: lv.color }}
              >
                LV.{lv.id} · {lv.jp.toUpperCase()}
              </p>
              <p className="text-sm font-extrabold mt-0.5">{lv.name}</p>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono"
              style={{
                background: 'var(--color-muted)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {lv.nextXP === null ? '2000+ XP' : `${lv.minXP}–${lv.nextXP - 1} XP`}
            </span>
          </div>
        )
      })}
    </div>
  )
}
