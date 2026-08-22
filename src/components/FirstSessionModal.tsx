// 첫 학습 세션 완료 시 특별 축하 모달 — ResultPage에서 1회만 표시.
// 출시 직후 retention 강화 목적.
import { m } from 'framer-motion'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MascotScene } from '@/components/MascotScene'
import { Sparkles, BookOpen, Award } from 'lucide-react'

interface FirstSessionModalProps {
  open: boolean
  onClose: () => void
  score: number
  xpEarned: number
}

export function FirstSessionModal({ open, onClose, score, xpEarned }: FirstSessionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-32px)] max-w-[400px] p-0 overflow-hidden">
        <DialogTitle className="sr-only">첫 학습 완료 축하</DialogTitle>
        <DialogDescription className="sr-only">첫 번째 학습 세션을 완료했어요</DialogDescription>

        {/* 그라데이션 히어로 */}
        <div
          className="relative px-6 pt-7 pb-5 text-center text-white overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, var(--color-primary) 0%, #FF8FB1 100%)',
          }}
        >
          {/* 떠다니는 sparkle */}
          {[...Array(8)].map((_, i) => (
            <m.span
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [-10, -30],
              }}
              transition={{
                duration: 2.2,
                delay: i * 0.18,
                repeat: Infinity,
                repeatDelay: 0.4,
              }}
              style={{
                top: `${20 + (i * 17) % 40}%`,
                left: `${(i * 13 + 5) % 90}%`,
                fontSize: 10 + (i % 3) * 4,
              }}
            >
              ✨
            </m.span>
          ))}

          <p className="type-eyebrow opacity-90">
            FIRST SESSION
          </p>
          <m.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 220 }}
            className="mt-2"
          >
            <MascotScene reaction="celebrate" sizeToken="sm" />
          </m.div>
          <h2 className="font-extrabold mt-3" style={{ fontSize: 22, letterSpacing: '-0.5px' }}>
            첫 학습 완주!
          </h2>
          <p className="text-[13px] opacity-90 mt-1">
            축하해요. 매일의 작은 한 걸음이 큰 차이를 만들어요.
          </p>
        </div>

        {/* 결과 + 다음 단계 */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div
              className="rounded-xl py-3"
              style={{ background: 'var(--color-sakura-100)' }}
            >
              <p className="text-[10px] font-bold tracking-wider" style={{ color: 'var(--color-primary)' }}>
                정답률
              </p>
              <p className="text-xl font-extrabold mt-0.5">{score}점</p>
            </div>
            <div
              className="rounded-xl py-3"
              style={{ background: 'var(--color-sakura-100)' }}
            >
              <p className="text-[10px] font-bold tracking-wider" style={{ color: 'var(--color-primary)' }}>
                XP
              </p>
              <p className="text-xl font-extrabold mt-0.5">+{xpEarned}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p
              className="text-[11px] font-bold uppercase tracking-wider px-1"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              다음으로 추천해요
            </p>
            {[
              { icon: BookOpen, label: '오답노트로 부족한 부분 복습', hint: '/wrong-words' },
              { icon: Sparkles, label: 'AI 튜터와 일본어 회화 연습', hint: '/conversation' },
              { icon: Award, label: '뱃지 컬렉션 + 레벨 여정 확인', hint: '/stats' },
            ].map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                style={{ background: 'var(--color-muted)' }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'var(--color-card)' }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                </div>
                <span className="text-[12px] font-semibold">{label}</span>
              </div>
            ))}
          </div>

          <Button className="w-full h-11" onClick={onClose}>
            계속하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
