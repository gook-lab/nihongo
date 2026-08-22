// 통합 에러 처리 헬퍼 — Sentry 보고 + toast 알림을 한 호출로
// catch 블록의 보일러플레이트 줄이고, 사용자 메시지/보고 컨텍스트 분기 일관화
//
// 사용 예시:
//   try { ... }
//   catch (e) {
//     handleError(e, {
//       sentry: { kind: 'auth', operation: 'signin', provider: 'google' },
//       toast: { message: '로그인에 실패했어요. 다시 시도해 주세요.' },
//     })
//   }
//
// 사용자 취소/입력 오류 같이 보고할 필요 없는 케이스:
//   if (isUserCancellation(e)) {
//     toast.warning({ message: '취소되었습니다' })
//     return
//   }
//   handleError(e, { ... })
import { toast } from './toast'
import {
  reportError,
  reportAuthError,
  reportFirestoreError,
  reportAIError,
  reportTTSError,
  reportStorageError,
  reportApiError,
} from './sentry'
import type { ErrorType } from '@/types'

// 도메인별 sentry 보고 옵션 (discriminated union)
type SentryConfig =
  | { kind: 'auth'; operation: 'signin' | 'signup' | 'signout' | 'reauth' | 'delete' | 'update-profile'; provider?: 'google' | 'kakao' | 'naver' | 'email'; extra?: Record<string, string | number | boolean | object | undefined> }
  | { kind: 'firestore'; operation: 'read' | 'write' | 'delete' | 'sync'; collection?: string; extra?: Record<string, string | number | boolean | object | undefined> }
  | { kind: 'ai'; feature: 'chat' | 'writing' | 'reading-story' | 'generate'; extra?: Record<string, string | number | boolean | object | undefined> }
  | { kind: 'tts'; provider: 'murf' | 'browser'; operation: 'list-voices' | 'synthesize' | 'play'; extra?: Record<string, string | number | boolean | object | undefined> }
  | { kind: 'storage'; operation: 'read' | 'write' | 'remove' | 'serialize'; key?: string; extra?: Record<string, string | number | boolean | object | undefined> }
  | { kind: 'api'; api: string; operation: string; extra?: Record<string, string | number | boolean | object | undefined> }
  | { kind: 'generic'; type: ErrorType; tags?: Record<string, string | undefined>; extra?: Record<string, string | number | boolean | object | undefined> }

interface ToastConfig {
  /** 한 줄 사용자 메시지 */
  message: string
  /** title 표시 (선택) */
  title?: string
  /** toast id — 중복 방지 */
  id?: string
  /** 토스트 종류 (기본 error) */
  variant?: 'error' | 'warning' | 'info'
}

interface HandleErrorConfig {
  sentry: SentryConfig
  toast?: ToastConfig | false
}

export function handleError(error: unknown, config: HandleErrorConfig): void {
  // 1) Sentry로 도메인별 보고
  const s = config.sentry
  switch (s.kind) {
    case 'auth':
      reportAuthError(error, { operation: s.operation, provider: s.provider, extra: s.extra })
      break
    case 'firestore':
      reportFirestoreError(error, { operation: s.operation, collection: s.collection, extra: s.extra })
      break
    case 'ai':
      reportAIError(error, { feature: s.feature, extra: s.extra })
      break
    case 'tts':
      reportTTSError(error, { provider: s.provider, operation: s.operation, extra: s.extra })
      break
    case 'storage':
      reportStorageError(error, { operation: s.operation, key: s.key, extra: s.extra })
      break
    case 'api':
      reportApiError(error, { api: s.api, operation: s.operation, extra: s.extra })
      break
    case 'generic':
      reportError(error, { type: s.type, tags: s.tags, extra: s.extra })
      break
  }

  // 2) 사용자에게 toast (false로 명시 시 생략)
  if (config.toast === false) return
  if (config.toast) {
    const { variant = 'error', message, title, id } = config.toast
    toast[variant]({ message, title, id })
  }
}

// 사용자가 의도적으로 취소한 흐름 — Sentry 보고 생략 대상 식별
export function isUserCancellation(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const code = (error as { code?: string }).code ?? ''
  const msg = error.message ?? ''
  return (
    code === 'auth/popup-closed-by-user' ||
    code === 'auth/cancelled-popup-request' ||
    code === 'auth/wrong-password' ||
    code === 'auth/invalid-credential' ||
    msg === 'AbortError' ||
    msg.includes('cancelled') ||
    msg.includes('popup-closed')
  )
}
