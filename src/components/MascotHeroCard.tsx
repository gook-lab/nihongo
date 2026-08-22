// 홈 상단 마스코트 hero — 큰 마스코트(우측) + 말풍선(좌측) + 인사(하단)
import { m } from 'framer-motion'
import { useAppStore } from '@/store'
import { MASCOTS } from '@/data/mascots'
import { MascotAvatar, type MascotReaction } from '@/components/MascotAvatar'

interface MascotHeroCardProps {
  userName: string
  level: number
  /** 스트릭 7+ 시 reaction 자동 'streak' */
  streak?: number
}

// 시간대 → 인사말/reaction 매핑 (lookup table). 시간 슬롯 추가/조정 시 이 표만 수정.
// `from` 이상 ~ `to` 미만 (24h, from > to 면 자정 넘는 슬롯)
interface GreetingSlot {
  from: number
  to: number
  text: string
  reaction: MascotReaction
}
const GREETING_SLOTS: readonly GreetingSlot[] = [
  { from: 22, to: 6, text: '늦은 시간까지 공부하네요!', reaction: 'sleepy' },
  { from: 6, to: 10, text: '오늘도 함께 공부해요!', reaction: 'wave' },
  { from: 10, to: 14, text: '점심 전에 한 세션 어때요?', reaction: 'bounce' },
  { from: 14, to: 18, text: '오후에도 꾸준히, 좋아요!', reaction: 'happy' },
  { from: 18, to: 22, text: '오늘 학습 마무리 하실래요?', reaction: 'celebrate' },
]

function matchSlot(hour: number, slot: GreetingSlot): boolean {
  return slot.from < slot.to
    ? hour >= slot.from && hour < slot.to
    : hour >= slot.from || hour < slot.to
}

function timeOfDayGreeting(streak: number): { text: string; reaction: MascotReaction } {
  if (streak >= 7) return { text: `${streak}일 연속! 멋져요 🔥`, reaction: 'streak' }
  const hour = new Date().getHours()
  const slot = GREETING_SLOTS.find((s) => matchSlot(hour, s)) ?? GREETING_SLOTS[0]
  return { text: slot.text, reaction: slot.reaction }
}

export function MascotHeroCard({ userName, level, streak = 0 }: MascotHeroCardProps) {
  const selectedMascotId = useAppStore((s) => s.selectedMascotId)
  const mascot = MASCOTS.find((m) => m.id === selectedMascotId) ?? MASCOTS[0]
  const { text: greeting, reaction } = timeOfDayGreeting(streak)

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--color-sakura-100), #FFFFFF)',
        boxShadow: '0 6px 20px rgba(255,77,126,0.12)',
      }}
    >
      <div className="flex items-center gap-3 p-4 pb-5">
        {/* 말풍선 */}
        <m.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="flex-1 relative"
        >
          <div
            className="relative bg-white rounded-2xl px-4 py-3 inline-block"
            style={{ boxShadow: '0 2px 6px rgba(255,77,126,0.10)' }}
          >
            <p className="text-[11px] text-muted-foreground leading-none mb-1">
              {mascot.nameKr}의 한마디
            </p>
            <p className="text-sm font-semibold text-foreground leading-snug">
              {greeting}
            </p>
            {/* 말풍선 꼬리 */}
            <span
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0"
              style={{
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderLeft: '10px solid #FFFFFF',
                filter: 'drop-shadow(2px 0 1px rgba(255,77,126,0.06))',
              }}
            />
          </div>
        </m.div>

        {/* 마스코트 (크게) + 통통 튀기 애니메이션 */}
        <m.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.05 }}
          className="anim-bob shrink-0"
        >
          <MascotAvatar size="2xl" reaction={reaction} />
        </m.div>
      </div>

      {/* 하단 인사 라인 */}
      <div className="px-4 pb-4 -mt-1">
        <p className="text-[11px] text-muted-foreground">안녕하세요</p>
        <p className="text-base font-bold text-foreground">
          {userName}님{' '}
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground align-middle">
            Lv.{level}
          </span>
        </p>
      </div>
    </m.div>
  )
}
