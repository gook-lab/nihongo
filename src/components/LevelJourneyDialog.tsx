// 레벨 여정 다이얼로그 — 4가지 뷰 segmented control로 전환
//   - journey  : B 세로 여정 (기본)
//   - gallery  : A 뱃지 갤러리 그리드
//   - mountain : C 산 등반 stepper
//   - compact  : D 컴팩트 리스트
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LevelBadgeSvg } from '@/components/LevelBadgeSvg'
import { LevelGallery } from '@/components/LevelGallery'
import { LevelMountain } from '@/components/LevelMountain'
import { LEVEL_BADGES, getLevelBadge } from '@/lib/levelBadges'
import { MASCOTS, newlyUnlockedAt } from '@/data/mascots'
import { useAppStore } from '@/store'

// compact 뷰는 여정(journey)과 정보가 중복되어 제거
type ViewMode = 'journey' | 'gallery' | 'mountain'

interface LevelJourneyDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  /** 다이얼로그 진입 시 기본 뷰 (기본 journey) */
  defaultView?: ViewMode
}

const VIEWS: { id: ViewMode; label: string }[] = [
  { id: 'journey', label: '여정' },
  { id: 'gallery', label: '갤러리' },
  { id: 'mountain', label: '등반' },
]

export function LevelJourneyDialog({
  open,
  onOpenChange,
  defaultView = 'journey',
}: LevelJourneyDialogProps) {
  const xp = useAppStore((s) => s.xp)
  const level = useAppStore((s) => s.level)
  const nickname = useAppStore((s) => s.user?.nickname)
  const currentMeta = getLevelBadge(level)
  const nextXP = currentMeta.nextXP
  const progressPct =
    nextXP === null ? 1 : (xp - currentMeta.minXP) / (nextXP - currentMeta.minXP)
  const xpToNext = nextXP === null ? 0 : nextXP - xp

  const [view, setView] = useState<ViewMode>(defaultView)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[calc(100vw-32px)] max-w-[440px] max-h-[85vh] p-0 overflow-hidden"
      >
        {/* sticky 헤더 영역 — 타이틀 + hero 카드 + segmented control.
            본문 스크롤 시에도 항상 보이도록 background 명시 + z-index */}
        <div
          className="sticky top-0 z-20 px-6 pt-6 pb-3 space-y-3"
          style={{
            background: 'var(--color-card)',
            borderBottom: '1px solid var(--color-border-light)',
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-base">
              {currentMeta.name}{' '}
              {nickname ? `${nickname}님의 여정` : '여정'}
            </DialogTitle>
          </DialogHeader>

          {/* 현재 레벨 hero 카드 */}
          <div
            className="rounded-2xl p-3 flex items-center gap-3"
            style={{
              background:
                'linear-gradient(135deg, var(--color-sakura-100), var(--color-card))',
              border: '1px solid var(--color-border-light)',
            }}
          >
            <LevelBadgeSvg level={level} size={60} />
            <div className="flex-1 min-w-0">
              <p
                className="type-eyebrow"
                style={{ color: currentMeta.color }}
              >
                LV.{level} · {currentMeta.jp.toUpperCase()}
              </p>
              <p className="text-base font-extrabold mt-0.5">{currentMeta.name}</p>
              <div
                className="h-1.5 rounded-full overflow-hidden mt-1.5"
                style={{ background: 'var(--color-muted)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, var(--color-primary), #FF8FB1)',
                    transformOrigin: 'left',
                    transform: `scaleX(${progressPct.toFixed(2)})`,
                    transition: 'transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1.05)',
                  }}
                />
              </div>
              <p
                className="text-[10px] mt-1 font-mono"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {nextXP === null
                  ? `${xp} XP · MAX`
                  : `${xp}/${nextXP} XP · 다음까지 ${xpToNext}`}
              </p>
            </div>
          </div>

          {/* 뷰 전환 segmented control */}
          <div
            className="grid grid-cols-3 gap-1 p-1 rounded-full"
            style={{ background: 'var(--color-muted)' }}
          >
            {VIEWS.map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className="text-[11px] font-bold py-1.5 rounded-full transition-colors"
                style={{
                  background: view === v.id ? 'var(--color-card)' : 'transparent',
                  color:
                    view === v.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  boxShadow:
                    view === v.id ? '0 1px 3px rgba(0,0,0,0.06)' : undefined,
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* 뷰 본문 — 스크롤 영역 */}
        <div className="px-6 pb-6 pt-3 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 220px)' }}>
          {view === 'journey' && <JourneyView currentLevel={level} />}
          {view === 'gallery' && <LevelGallery currentLevel={level} />}
          {view === 'mountain' && <LevelMountain currentLevel={level} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/** B 세로 여정 — 이전 LevelJourneyDialog의 본문 부분 */
function JourneyView({ currentLevel }: { currentLevel: number }) {
  return (
    <div className="relative">
      {/* 점선 커넥터 (배경) */}
      <div
        className="absolute top-3 bottom-3"
        style={{
          left: 21,
          width: 2,
          background:
            'repeating-linear-gradient(180deg, var(--color-border) 0 4px, transparent 4px 10px)',
          borderRadius: 2,
        }}
        aria-hidden="true"
      />
      {currentLevel > 1 && (
        <div
          className="absolute"
          style={{
            left: 21,
            top: 24,
            width: 2,
            // 한 row 높이 = 마스코트 카드 포함 약 92px
            height: `${(currentLevel - 1) * 92}px`,
            background: 'var(--color-primary)',
            boxShadow: '0 0 8px rgba(255,51,102,0.4)',
            borderRadius: 2,
          }}
          aria-hidden="true"
        />
      )}

      {LEVEL_BADGES.map((meta) => {
        const isCurrent = meta.id === currentLevel
        const isAchieved = meta.id < currentLevel
        const isLocked = meta.id > currentLevel
        const pillText = isAchieved ? '달성' : isCurrent ? '진행 중' : '잠김'
        // 이 레벨에서 해금되는 마스코트 (Lv.1 = 코타로 / Lv.2 = 유키 / ...)
        const mascot = newlyUnlockedAt(meta.id) ?? MASCOTS[0]
        return (
          <div
            key={meta.id}
            className="flex items-center gap-3 py-2 relative z-10"
          >
            <div className="shrink-0">
              <LevelBadgeSvg level={meta.id} size={44} locked={isLocked} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-extrabold">
                  Lv.{meta.id}{' '}
                  <span style={{ color: meta.color }}>{meta.name}</span>
                </span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isAchieved
                      ? meta.color
                      : isCurrent
                        ? 'var(--color-primary)'
                        : 'var(--color-muted)',
                    color: isLocked ? 'var(--color-text-tertiary)' : '#fff',
                    ...(isCurrent
                      ? { animation: 'badge-pulse-pill 1.6s ease-in-out infinite' }
                      : {}),
                  }}
                >
                  {pillText}
                </span>
              </div>
              <p
                className="text-[11px] mt-0.5"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {meta.sub} ·{' '}
                {meta.nextXP === null
                  ? `${meta.minXP}+ XP`
                  : `${meta.minXP} ~ ${meta.nextXP - 1} XP`}
              </p>

              {/* 이 레벨에서 해금되는 마스코트 — 잠김이면 blur */}
              <div
                className="flex items-center gap-1.5 mt-1.5 rounded-md py-1 px-2"
                style={{
                  background: isLocked ? 'transparent' : 'var(--color-sakura-100)',
                }}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-white/80 flex items-center justify-center shrink-0">
                  {mascot.image ? (
                    <img
                      src={mascot.image}
                      alt={mascot.nameKr}
                      className="w-full h-full object-cover"
                      style={isLocked ? { filter: 'blur(4px)' } : undefined}
                    />
                  ) : (
                    <span style={{ fontSize: 16 }} role="img">
                      {mascot.emoji ?? '🐾'}
                    </span>
                  )}
                </div>
                <span
                  className="text-[10px] font-semibold"
                  style={{
                    color: isLocked
                      ? 'var(--color-text-tertiary)'
                      : 'var(--color-primary)',
                  }}
                >
                  {isLocked ? '???' : mascot.nameKr} 친구
                  {isLocked ? ' 잠김' : isCurrent || isAchieved ? ' 사용 가능' : ''}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
