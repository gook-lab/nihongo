// 첫 진입 시 1.6초 표시되는 스플래시 화면 (share/fianl/tone-board SplashScreen 시안 기반)
// sessionStorage 플래그로 같은 세션에선 다시 표시 안 함
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '@/store'

const SPLASH_SEEN_KEY = 'nihongo-splash-seen'

export function SplashPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const onboardingCompletedAt = useAppStore((s) => s.onboardingCompletedAt)
  const xp = useAppStore((s) => s.xp)
  const dailyRecords = useAppStore((s) => s.dailyRecords)

  useEffect(() => {
    const returnTo = new URLSearchParams(location.search).get('to') || '/'
    const t = setTimeout(() => {
      sessionStorage.setItem(SPLASH_SEEN_KEY, '1')

      // 1) 미인증 → 로그인 페이지
      if (!isAuthenticated) {
        navigate('/login', { replace: true })
        return
      }

      // 2) 인증 + 신규 사용자 (온보딩 미완료 + 학습 기록 없음)
      const hasNoLearningData = xp === 0 && Object.keys(dailyRecords).length === 0
      const needsOnboarding = !onboardingCompletedAt && hasNoLearningData
      if (needsOnboarding) {
        navigate('/onboarding/goal', { replace: true })
        return
      }

      // 3) 기존 사용자 → 원래 가려던 경로
      navigate(returnTo, { replace: true })
    }, 1600)
    return () => clearTimeout(t)
  }, [navigate, location.search, isAuthenticated, onboardingCompletedAt, xp, dailyRecords])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white"
      style={{
        background:
          'linear-gradient(160deg, var(--color-primary) 0%, #FF8FB1 100%)',
      }}
    >
      {/* 떠다니는 거품 6개 */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full anim-float"
          style={{
            width: 40 + i * 14,
            height: 40 + i * 14,
            left: `${(i * 17 + 7) % 90}%`,
            top: `${(i * 23 + 5) % 90}%`,
            background: 'rgba(255,255,255,0.12)',
            animationDuration: `${6 + i}s`,
            animationDelay: `${-i * 0.7}s`,
          }}
        />
      ))}

      <div
        className="type-display anim-splash"
        style={{
          fontFamily: '"Hiragino Sans","Noto Sans JP", "Zen Maru Gothic", serif',
        }}
      >
        ことば
      </div>
      <div className="mt-3 type-eyebrow anim-fade-up" style={{ color: '#fff', opacity: 0.85 }}>
        K O T O B A
      </div>
      <div
        className="mt-2 anim-fade-up"
        style={{ fontSize: 12, opacity: 0.7, letterSpacing: 2, animationDelay: '0.8s' }}
      >
        니혼고 앱
      </div>
    </div>
  )
}

export function hasSeenSplash(): boolean {
  return sessionStorage.getItem(SPLASH_SEEN_KEY) === '1'
}
