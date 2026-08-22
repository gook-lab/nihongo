// Sentry용 에러 정보 추출 유틸 — 도메인별 부가 컨텍스트를 standardize
import type { ErrorType } from '@/types'

export interface ExtractedErrorInfo {
  message: string
  stack?: string
  cause?: string
  // 외부 API/네트워크 응답 메타데이터가 error 객체에 붙어있을 때 끌어옴
  status?: number
  code?: string
  // 일본어 학습 앱 맥락
  type: ErrorType
}

interface ErrorWithMeta extends Error {
  status?: number
  statusCode?: number
  code?: string | number
  response?: { status?: number }
  cause?: unknown
}

export function extractErrorInfo(error: Error, type: ErrorType): ExtractedErrorInfo {
  const e = error as ErrorWithMeta
  const status =
    typeof e.status === 'number'
      ? e.status
      : typeof e.statusCode === 'number'
        ? e.statusCode
        : typeof e.response?.status === 'number'
          ? e.response.status
          : undefined
  const code = e.code !== undefined ? String(e.code) : undefined
  const cause = e.cause instanceof Error ? e.cause.message : undefined

  return {
    message: error.message,
    stack: error.stack,
    cause,
    status,
    code,
    type,
  }
}

// 비-Error 값(문자열, 객체)도 Sentry에 보내기 위해 Error로 정규화
export function toError(value: unknown): Error {
  if (value instanceof Error) return value
  if (typeof value === 'string') return new Error(value)
  try {
    return new Error(JSON.stringify(value))
  } catch {
    return new Error('Unknown error (unserializable)')
  }
}
