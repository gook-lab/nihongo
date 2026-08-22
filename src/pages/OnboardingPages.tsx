// 신규 사용자용 온보딩 흐름: Goal (학습 목표) → Ready (시작 준비)
// share/screens.jsx의 GoalScreen + ReadyScreen 패턴 React 포팅
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MascotAvatar } from '@/components/MascotAvatar'
import { useAppStore } from '@/store'

const GOALS = [
  { id: 5, mins: '5', label: '가볍게 5분', sub: '하루 5단어', xp: '+10 XP' },
  { id: 10, mins: '10', label: '꾸준히 10분', sub: '하루 10단어', xp: '+25 XP' },
  { id: 20, mins: '20', label: '집중 20분', sub: '하루 20단어', xp: '+50 XP' },
  { id: 30, mins: '30', label: '몰입 30분', sub: '하루 30단어', xp: '+80 XP' },
]

const STORAGE_KEY = 'nihongo-goal-mins'

export function GoalPage() {
  const navigate = useNavigate()
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const [pick, setPick] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? parseInt(saved, 10) : 10
  })

  const handleContinue = () => {
    localStorage.setItem(STORAGE_KEY, String(pick))
    navigate('/onboarding/ready')
  }

  const handleSkip = () => {
    completeOnboarding()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col anim-screen-in pb-8">
      <div className="px-6 pt-20">
        <p
          className="type-eyebrow"
          style={{ color: 'var(--color-primary)' }}
        >
          STEP 5 OF 6
        </p>
        <h1 className="mt-3 text-[28px] font-extrabold tracking-tight leading-tight">
          하루 학습 목표는?
        </h1>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          꾸준히 할 수 있는 양을 골라요. 늘리는 건 언제든 OK.
        </p>
      </div>

      <div className="px-6 mt-7 space-y-2.5">
        {GOALS.map((g, i) => {
          const active = pick === g.id
          return (
            <button
              key={g.id}
              onClick={() => setPick(g.id)}
              className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border-[1.5px] text-left transition-all anim-slide-up"
              style={{
                borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
                background: active
                  ? 'color-mix(in srgb, var(--color-primary) 6%, transparent)'
                  : 'var(--color-card)',
                animationDelay: `${i * 0.05}s`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-extrabold tracking-tight"
                style={{
                  background: active ? 'var(--color-primary)' : 'var(--color-muted)',
                  color: active ? 'var(--color-primary-foreground)' : 'var(--color-foreground)',
                }}
              >
                {g.mins}
              </div>
              <div className="flex-1">
                <p className="text-base font-bold leading-tight">{g.label}</p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {g.sub} · 보상 {g.xp}
                </p>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                style={{
                  borderColor: active ? 'var(--color-primary)' : 'var(--color-border)',
                  background: active ? 'var(--color-primary)' : 'transparent',
                }}
              >
                {active && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex-1 min-h-[40px]" />

      <div className="px-6">
        <Button onClick={handleContinue} className="w-full h-14 text-base">
          계속하기
        </Button>
        <button
          onClick={handleSkip}
          className="w-full mt-2.5 py-3 text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          나중에 설정할게요
        </button>
      </div>
    </div>
  )
}

export function ReadyPage() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const confettiColors = ['#FF3366', '#FFB400', '#2EBD6B', '#7FB8E6', '#FF8FB1']

  const handleStart = () => {
    completeOnboarding()
    navigate('/learn')
  }
  const handleHome = () => {
    completeOnboarding()
    navigate('/')
  }

  return (
    <div
      className="min-h-screen flex flex-col anim-screen-in relative overflow-hidden pb-8"
      style={{
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 8%, transparent) 0%, var(--color-background) 50%)',
      }}
    >
      {/* Confetti 20개 */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute anim-confetti"
          style={{
            top: 40,
            left: `${(i * 5.3 + 3) % 100}%`,
            width: 6,
            height: 10,
            borderRadius: 2,
            background: confettiColors[i % confettiColors.length],
            animationDelay: `${i * 0.04}s`,
            animationDuration: `${2.4 + i * 0.15}s`,
          }}
        />
      ))}

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="anim-bob">
          <MascotAvatar size="xl" reaction="celebrate" />
        </div>
        <p
          className="mt-6 type-eyebrow"
          style={{ color: 'var(--color-primary)' }}
        >
          READY!
        </p>
        <h1 className="mt-2.5 text-[30px] font-extrabold tracking-tight text-center leading-tight">
          준비 완료!
          <br />
          {user?.nickname && (
            <span style={{ color: 'var(--color-primary)' }}>{user.nickname}님</span>
          )}
          {' '}이제 시작해요.
        </h1>
        <p
          className="mt-3.5 text-sm leading-relaxed text-center max-w-[280px]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          오늘의 첫 학습을 시작하면
          <br />
          <b style={{ color: 'var(--color-foreground)' }}>+25 XP</b>를 받을 수 있어요.
        </p>
      </div>

      <div className="px-6">
        <Button onClick={handleStart} className="w-full h-14 text-base">
          오늘의 학습 시작하기
        </Button>
        <button
          onClick={handleHome}
          className="w-full mt-2.5 py-3 text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          홈으로
        </button>
      </div>
    </div>
  )
}
