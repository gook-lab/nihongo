// Sentry 에러 보고 헬퍼 — 도메인별로 일관된 fingerprint/tag/extra를 부착
import * as Sentry from '@sentry/react'
import type { ErrorType } from '@/types'
import { extractErrorInfo, toError } from './common'

export interface ErrorContext {
  type: ErrorType
  level?: Sentry.SeverityLevel
  tags?: Record<string, string | undefined>
  extra?: Record<string, string | number | boolean | object | undefined>
  fingerprint?: string[]
}

// Sentry는 undefined/null 태그를 거부하므로 정제
function cleanTags(tags: Record<string, string | undefined> | undefined) {
  if (!tags) return undefined
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(tags)) {
    if (v !== undefined && v !== null) out[k] = v
  }
  return out
}

export function reportError(error: unknown, context: ErrorContext) {
  const err = toError(error)
  const autoLevel = context.level || 'error'
  const errorInfo = extractErrorInfo(err, context.type)

  Sentry.captureException(err, {
    tags: {
      manual_report: 'true',
      error_type: context.type,
      error_name: err.name,
      ...(cleanTags(context.tags) ?? {}),
    },
    level: autoLevel,
    extra: {
      ...errorInfo,
      ...context.extra,
    },
    fingerprint: context.fingerprint || [context.type, err.name],
  })
}

// 외부 API 호출 실패 (Gemini, Murf, Firebase Auth REST 등)
export function reportApiError(
  error: unknown,
  config: {
    api: string // 'gemini' | 'murf' | 'firebase' 등 자유 식별자
    operation: string // 'generate' | 'tts' | 'signin' 등
    extra?: Record<string, string | number | boolean | object | undefined>
  },
) {
  const err = toError(error)
  reportError(err, {
    type: 'api',
    level: 'error',
    tags: { api: config.api, operation: config.operation },
    extra: config.extra,
    fingerprint: ['api', config.api, config.operation, err.message],
  })
}

// ErrorBoundary가 잡은 React 렌더 에러
export function reportBoundaryError(
  error: unknown,
  componentName: string,
  info?: { componentStack?: string | null },
) {
  const err = toError(error)
  reportError(err, {
    type: 'boundary',
    level: 'fatal',
    tags: { component: componentName },
    extra: {
      componentStack: info?.componentStack ?? undefined,
    },
    fingerprint: ['boundary', componentName, err.message],
  })
}

// 인증 관련 (로그인/회원가입/탈퇴/재인증)
export function reportAuthError(
  error: unknown,
  config: {
    operation: 'signin' | 'signup' | 'signout' | 'reauth' | 'delete' | 'update-profile'
    provider?: 'google' | 'kakao' | 'naver' | 'email'
    extra?: Record<string, string | number | boolean | object | undefined>
  },
) {
  const err = toError(error)
  reportError(err, {
    type: 'auth',
    level: 'error',
    tags: { operation: config.operation, provider: config.provider },
    extra: config.extra,
    fingerprint: ['auth', config.operation, config.provider ?? 'n/a', err.message],
  })
}

// Firestore 동기화 실패
export function reportFirestoreError(
  error: unknown,
  config: {
    operation: 'read' | 'write' | 'delete' | 'sync'
    collection?: string
    extra?: Record<string, string | number | boolean | object | undefined>
  },
) {
  const err = toError(error)
  reportError(err, {
    type: 'firestore',
    level: 'warning', // 로컬 사용 가능하므로 fatal 아님
    tags: { operation: config.operation, collection: config.collection },
    extra: config.extra,
    fingerprint: ['firestore', config.operation, config.collection ?? 'n/a', err.message],
  })
}

// Gemini AI 스트리밍/생성 실패
export function reportAIError(
  error: unknown,
  config: {
    feature: 'chat' | 'writing' | 'reading-story' | 'generate' | 'roleplay'
    extra?: Record<string, string | number | boolean | object | undefined>
  },
) {
  const err = toError(error)
  reportError(err, {
    type: 'ai',
    level: 'warning',
    tags: { feature: config.feature },
    extra: config.extra,
    fingerprint: ['ai', config.feature, err.message],
  })
}

// TTS 합성/재생 실패 (사용자 피드백 거의 없는 자동 폴백 동작이라 warning)
export function reportTTSError(
  error: unknown,
  config: {
    provider: 'murf' | 'browser'
    operation: 'list-voices' | 'synthesize' | 'play'
    extra?: Record<string, string | number | boolean | object | undefined>
  },
) {
  const err = toError(error)
  reportError(err, {
    type: 'tts',
    level: 'warning',
    tags: { provider: config.provider, operation: config.operation },
    extra: config.extra,
    fingerprint: ['tts', config.provider, config.operation, err.message],
  })
}

// localStorage / IndexedDB / 직렬화
export function reportStorageError(
  error: unknown,
  config: {
    operation: 'read' | 'write' | 'remove' | 'serialize'
    key?: string
    extra?: Record<string, string | number | boolean | object | undefined>
  },
) {
  const err = toError(error)
  reportError(err, {
    type: 'storage',
    level: 'warning',
    tags: { operation: config.operation, key: config.key },
    extra: config.extra,
    fingerprint: ['storage', config.operation, config.key ?? 'n/a', err.message],
  })
}
