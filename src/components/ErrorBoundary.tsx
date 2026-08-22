// 글로벌 에러 경계 — react-error-boundary 래퍼 + 자동 Sentry 보고
// 페이지 단위로 감싸도 되고 앱 전체에 한 번 감싸도 됨
import { type ReactNode } from 'react'
import {
  ErrorBoundary as ExternalErrorBoundary,
  type ErrorBoundaryProps,
  type FallbackProps,
} from 'react-error-boundary'
import { ErrorScreen } from '@/pages/ErrorScreens'
import { reportBoundaryError } from '@/lib/sentry'

interface Props extends Omit<ErrorBoundaryProps, 'children' | 'fallback' | 'fallbackRender' | 'FallbackComponent'> {
  children: ReactNode
  // 호출자가 별도 fallback을 주지 않으면 기본 ErrorScreen('server') 사용
  FallbackComponent?: ErrorBoundaryProps['FallbackComponent']
  // Sentry 태그에 들어갈 식별자 — 어느 영역의 boundary가 잡았는지 구분용
  boundaryName?: string
}

// 기본 fallback — share 디자인의 ErrorScreen 'server' 케이스
function DefaultFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <ErrorScreen
      kind="server"
      onPrimary={resetErrorBoundary}
      onSecondary={() => {
        window.location.href = '/'
      }}
    />
  )
}

export function ErrorBoundary({
  children,
  onError,
  FallbackComponent,
  boundaryName = 'app',
  ...rest
}: Props) {
  return (
    <ExternalErrorBoundary
      FallbackComponent={FallbackComponent ?? DefaultFallback}
      onError={(error, info) => {
        reportBoundaryError(error, boundaryName, info)
        onError?.(error, info)
      }}
      {...rest}
    >
      {children}
    </ExternalErrorBoundary>
  )
}
