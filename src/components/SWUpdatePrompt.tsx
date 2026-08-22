// 새 SW 감지 시 사용자에게 업데이트 알림.
// vite-plugin-pwa의 useRegisterSW 훅이 새 버전 install 완료 (waiting) 시점에
// needRefresh=true를 트리거 → 사용자가 버튼 클릭하면 updateSW(true)로 강제 활성 + 리로드.
//
// 추가 보호망: dynamic chunk import 실패 시 자동 reload (SW 캐시 충돌 회피).
import { useEffect, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SWUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error: unknown) {
      // eslint-disable-next-line no-console
      console.warn('[SW] register error:', error)
    },
  })

  const [reloading, setReloading] = useState(false)

  // 안전망: dynamic import (lazy 페이지 청크) 실패 시 자동 reload.
  // SW가 옛 chunk 경로를 fetch → 새 빌드엔 없음 → SPA fallback 받음 → MIME 에러.
  // 이 패턴 감지하면 즉시 새로고침해서 새 SW가 install되도록 유도.
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      const msg = event.message || ''
      if (
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('Importing a module script failed') ||
        msg.includes('Expected a JavaScript-or-Wasm module script')
      ) {
        // 한 번만 reload (무한 새로고침 방지)
        const RELOAD_KEY = 'sw-chunk-reload-attempted'
        if (!sessionStorage.getItem(RELOAD_KEY)) {
          sessionStorage.setItem(RELOAD_KEY, '1')
          window.location.reload()
        }
      }
    }
    window.addEventListener('error', onError)
    return () => window.removeEventListener('error', onError)
  }, [])

  const handleUpdate = async () => {
    setReloading(true)
    try {
      // skipWaiting 메시지 전송 → 새 SW가 activate
      await updateServiceWorker(true)
    } catch {
      // SW 업데이트 실패해도 강제 reload (어차피 사용자 의도는 새로고침)
    }
    // 명시적 reload — vite-plugin-pwa의 updateServiceWorker는 자동 reload 안 함
    window.location.reload()
  }

  return (
    <AnimatePresence>
      {needRefresh && (
        <div className="fixed bottom-24 left-0 right-0 z-50 px-5 pointer-events-none">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pointer-events-auto"
            style={{
              width: '100%',
              maxWidth: '28rem',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <div
              className="rounded-2xl p-4 flex items-center gap-3 shadow-lg"
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-sakura-100)' }}
              >
                <RefreshCw className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">새 버전 준비 완료</p>
                <p
                  className="text-[11px]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  최신 기능을 쓰려면 새로고침하세요
                </p>
              </div>
              <Button
                onClick={handleUpdate}
                disabled={reloading}
                size="sm"
                className="shrink-0"
              >
                {reloading ? '적용 중…' : '업데이트'}
              </Button>
              <button
                onClick={() => setNeedRefresh(false)}
                className="text-xs px-2"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                나중에
              </button>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  )
}
