// 인증 가드: 미인증 사용자를 /login으로 보내되 원래 경로를 returnTo로 보존
// nested routes (<Outlet />) 또는 children 패턴 모두 지원
// 게스트 모드 — isGuest=true면 일부 페이지 통과 (allowGuest 옵션)
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppStore } from '@/store'

interface AuthGuardProps {
  children?: React.ReactNode
  /** true면 게스트(isGuest)도 통과시킴. 미설정 시 false (로그인 필수). */
  allowGuest?: boolean
}

export function AuthGuard({ children, allowGuest = false }: AuthGuardProps) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const isGuest = useAppStore((s) => s.isGuest)
  const location = useLocation()

  // 인증됐거나, allowGuest이고 게스트 모드면 통과
  if (isAuthenticated || (allowGuest && isGuest)) {
    return <>{children ?? <Outlet />}</>
  }

  // 미인증: returnTo 쿼리에 현재 경로 보존하고 /login으로
  const returnTo = location.pathname + location.search
  const target =
    returnTo && returnTo !== '/login'
      ? `/login?returnTo=${encodeURIComponent(returnTo)}`
      : '/login'
  return <Navigate to={target} replace />
}

// 게스트 전용 (이미 로그인되어 있으면 splash 거쳐서 신규/기존 사용자 분기)
export function GuestGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (isAuthenticated) {
    const params = new URLSearchParams(location.search)
    const returnTo = params.get('returnTo') || '/'
    // splash로 우회 → SplashPage가 신규 사용자면 /onboarding/goal로, 기존이면 returnTo로
    sessionStorage.removeItem('nihongo-splash-seen')
    return (
      <Navigate to={`/splash?to=${encodeURIComponent(returnTo)}`} replace />
    )
  }

  return <>{children ?? <Outlet />}</>
}
