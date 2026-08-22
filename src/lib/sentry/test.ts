// GlitchTip/Sentry 송신 검증용 헬퍼.
// 브라우저 콘솔에서 `window.__testGlitchTip()`으로 호출 — UI 노출 없음.
// 검증 절차:
//   1. 배포된 사이트 진입 → DevTools Console 열기
//   2. `__testGlitchTip()` 실행
//   3. GlitchTip 대시보드(https://app.glitchtip.com)에서 새 이슈 확인 (~30초 내)
import * as Sentry from '@sentry/react'
import { reportError } from './report'

export function testGlitchTip() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  // eslint-disable-next-line no-console
  console.group('[GlitchTip Test]')
  // eslint-disable-next-line no-console
  console.log('DSN configured:', !!dsn)
  // eslint-disable-next-line no-console
  console.log('Environment:', import.meta.env.MODE)

  if (!dsn) {
    // eslint-disable-next-line no-console
    console.warn(
      '⚠ VITE_SENTRY_DSN이 설정되지 않았어요. Netlify 환경변수 확인 필요:',
    )
    // eslint-disable-next-line no-console
    console.warn(
      '  Netlify Dashboard → Site settings → Environment variables → VITE_SENTRY_DSN',
    )
    // eslint-disable-next-line no-console
    console.groupEnd()
    return
  }

  try {
    throw new Error('GlitchTip 송신 테스트 — 정상 동작 확인용 더미 에러')
  } catch (e) {
    reportError(e, {
      type: 'unknown',
      level: 'info',
      tags: { test: 'glitchtip_smoke', source: 'manual' },
    })
  }

  // 추가로 메시지 캡처도 한 번 (송신 경로 다중 검증)
  Sentry.captureMessage('GlitchTip 송신 테스트 — captureMessage 경로', 'info')

  // eslint-disable-next-line no-console
  console.log('✓ 2개 이벤트 송신했어요. GlitchTip 대시보드에서 확인하세요:')
  // eslint-disable-next-line no-console
  console.log('  https://app.glitchtip.com')
  // eslint-disable-next-line no-console
  console.groupEnd()
}

// 글로벌 노출 — 콘솔에서 호출 가능
declare global {
  interface Window {
    __testGlitchTip?: () => void
  }
}

if (typeof window !== 'undefined') {
  window.__testGlitchTip = testGlitchTip
}
