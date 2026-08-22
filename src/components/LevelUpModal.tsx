import { m, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getLevelInfo } from '@/constants'
import { newlyUnlockedAt } from '@/data/mascots'
import { LevelBadgeSvg } from '@/components/LevelBadgeSvg'

interface LevelUpModalProps {
  isOpen: boolean
  onClose: () => void
  newLevel: number
}

const LEVEL_EMOJIS: Record<number, string> = {
  1: '',
  2: '',
  3: '',
  4: '',
  5: '',
  6: '',
  7: '',
}

// 파티클 위치를 미리 계산 (deterministic)
const PARTICLE_POSITIONS = [
  { x: 15, y: 20 }, { x: 85, y: 25 }, { x: 25, y: 75 },
  { x: 75, y: 80 }, { x: 10, y: 50 }, { x: 90, y: 45 },
  { x: 40, y: 15 }, { x: 60, y: 85 }, { x: 5, y: 30 },
  { x: 95, y: 70 }, { x: 35, y: 90 }, { x: 65, y: 10 },
]

const PARTICLE_EMOJIS = ['', '', '', '', '']

export function LevelUpModal({ isOpen, onClose, newLevel }: LevelUpModalProps) {
  const levelInfo = getLevelInfo(newLevel)
  const emoji = LEVEL_EMOJIS[newLevel] || ''
  // 이 레벨에서 새로 해금되는 마스코트 (Lv.2 → 유키, Lv.3 → 소라 ...)
  const newMascot = newlyUnlockedAt(newLevel)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-32px)] max-w-[400px] text-center">
        <AnimatePresence>
          {isOpen && (
            <>
              {/* 축하 파티클 효과 */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {PARTICLE_POSITIONS.map((pos, i) => (
                  <m.div
                    key={i}
                    className="absolute text-2xl"
                    initial={{
                      opacity: 0,
                      x: '50%',
                      y: '50%',
                      scale: 0,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      x: `${pos.x}%`,
                      y: `${pos.y}%`,
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      ease: 'easeOut',
                    }}
                  >
                    {PARTICLE_EMOJIS[i % PARTICLE_EMOJIS.length]}
                  </m.div>
                ))}
              </div>

              <DialogHeader className="space-y-4">
                {/* 새 레벨 뱃지 — share/Level Badges.html 디자인 */}
                <m.div
                  className="mx-auto"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                >
                  <LevelBadgeSvg level={newLevel} size={96} />
                </m.div>

                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <DialogTitle className="text-2xl">레벨 업! {emoji}</DialogTitle>
                </m.div>

                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <DialogDescription className="text-lg">
                    <span className="text-primary font-bold">Lv.{newLevel}</span>{' '}
                    <span className="text-foreground">{levelInfo.name}</span>
                    <span className="block mt-1 text-muted-foreground">
                      달성을 축하합니다!
                    </span>
                  </DialogDescription>
                </m.div>

                {/* 새 마스코트 해금 알림 */}
                {newMascot && (
                  <m.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="rounded-2xl p-4 flex items-center gap-3"
                    style={{
                      background: 'var(--color-sakura-100)',
                      border: '1.5px solid var(--color-primary)',
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center overflow-hidden shrink-0">
                      {newMascot.image ? (
                        <img
                          src={newMascot.image}
                          alt={newMascot.nameKr}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span style={{ fontSize: 30 }} role="img">
                          {newMascot.emoji ?? '🐾'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="type-eyebrow text-primary">
                        새 친구 해금! 🎉
                      </p>
                      <p className="text-sm font-extrabold mt-0.5">
                        {newMascot.nameKr}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {newMascot.description}
                      </p>
                    </div>
                  </m.div>
                )}
              </DialogHeader>

              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-6"
              >
                <Button onClick={onClose} className="w-full" size="lg">
                  확인
                </Button>
              </m.div>
            </>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
