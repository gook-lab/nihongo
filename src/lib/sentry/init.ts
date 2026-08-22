// 에러 트래킹 초기화 (GlitchTip 사용 — Sentry SDK 호환 API)
// main.tsx에서 앱 부트 직후 호출. VITE_SENTRY_DSN 미설정 시 no-op (개발 환경 노이즈 방지)
import * as Sentry from '@sentry/react'

let initialized = false

export function initSentry() {
  if (initialized) return
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined
  if (!dsn) return

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION as string | undefined,
    // GlitchTip 무료 플랜 보호 — 트랜잭션은 1%만, 개발에선 끔
    // (GlitchTip은 Performance/Replay 일부 미지원이라 보수적으로)
    tracesSampleRate: import.meta.env.PROD ? 0.01 : 0,
    // GlitchTip 미지원 기능들 — 명시적으로 비활성
    // (autoSessionTracking은 최신 SDK에서 제거됨 — tracesSampleRate가 0.01이라
    //  session 발생 자체가 거의 없음. GlitchTip의 sessions 미지원 영향 무시 가능.)
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    // 학습 데이터에 개인정보 거의 없지만 발생 시 자동 스크럽
    sendDefaultPii: false,
    beforeSend(event, hint) {
      // 우리 reportError를 거치지 않은 자동 캡처도 받되,
      // 흔한 네트워크 노이즈는 필터
      const err = hint.originalException
      if (err instanceof Error) {
        // Firebase: 사용자가 팝업 닫음 — 정상 흐름, 보낼 가치 없음
        if (err.message?.includes('auth/popup-closed-by-user')) return null
        if (err.message?.includes('auth/cancelled-popup-request')) return null
        // ResizeObserver loop 경고 — 브라우저 noise
        if (err.message?.includes('ResizeObserver loop')) return null
      }
      return event
    },
  })

  initialized = true
}

export function setSentryUser(user: { id: string; email?: string } | null) {
  if (!initialized) return
  if (user) {
    Sentry.setUser({ id: user.id, email: user.email })
  } else {
    Sentry.setUser(null)
  }
}
