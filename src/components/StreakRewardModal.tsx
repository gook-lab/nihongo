import { m, AnimatePresence } from 'framer-motion'
import { Flame } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MascotScene } from '@/components/MascotScene'
import { streakBadgeName, streakRewardXP } from '@/lib/missions'

interface StreakRewardModalProps {
  isOpen: boolean
  onClose: () => void
  days: number
}

const PARTICLE_POSITIONS = [
  { x: 15, y: 20 }, { x: 85, y: 25 }, { x: 25, y: 75 },
  { x: 75, y: 80 }, { x: 10, y: 50 }, { x: 90, y: 45 },
  { x: 40, y: 15 }, { x: 60, y: 85 },
]

export function StreakRewardModal({ isOpen, onClose, days }: StreakRewardModalProps) {
  const xp = streakRewardXP(days)
  const badge = streakBadgeName(days)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-32px)] max-w-[400px] text-center">
        <AnimatePresence>
          {isOpen && (
            <>
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {PARTICLE_POSITIONS.map((pos, i) => (
                  <m.div
                    key={i}
                    className="absolute"
                    initial={{ opacity: 0, x: '50%', y: '50%', scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      x: `${pos.x}%`,
                      y: `${pos.y}%`,
                      scale: [0, 1.5, 0],
                    }}
                    transition={{ duration: 1.5, delay: i * 0.1 }}
                  >
                    <Flame className="w-6 h-6 text-primary" />
                  </m.div>
                ))}
              </div>

              <DialogHeader className="space-y-4">
                <m.div
                  className="mx-auto w-full"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.15 }}
                >
                  {/* streak reaction = 불꽃 sprite + 주황 그라데이션 배경 */}
                  <MascotScene reaction="streak" sizeToken="lg" />
                </m.div>

                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <DialogTitle className="text-2xl flex items-center justify-center gap-2">
                    <Flame className="w-7 h-7 text-primary" />
                    {days}일 연속 학습!
                  </DialogTitle>
                </m.div>

                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <DialogDescription className="text-base">
                    <span className="text-primary font-bold text-lg">{badge}</span>
                    <span className="block mt-2 text-muted-foreground">
                      보너스 <span className="font-bold text-foreground">+{xp} XP</span>
                    </span>
                  </DialogDescription>
                </m.div>
              </DialogHeader>

              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-6"
              >
                <Button onClick={onClose} className="w-full" size="lg">
                  받기
                </Button>
              </m.div>
            </>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
