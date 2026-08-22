// Plausible 커스텀 이벤트 헬퍼 — 쿠키 없는 프라이버시 친화 분석.
// 스크립트 미로드 환경(개발/차단)에선 no-op.
//
// 사용 예시:
//   trackEvent('learn-completed', { score: 80, level: 'N5' })
//   trackEvent('ai-roleplay-started', { scenario: 'hotel-checkin' })
declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void
  }
}

export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean>,
): void {
  if (typeof window === 'undefined') return
  try {
    window.plausible?.(name, props ? { props } : undefined)
  } catch {
    // 분석 실패는 사용자 흐름에 영향 주면 안 됨
  }
}
