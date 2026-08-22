// PWA 설치 프롬프트 카드 — Chrome/Edge의 beforeinstallprompt 이벤트 활용
// 이미 standalone 모드면 숨김. dismissed flag로 한 번 닫으면 재표시 안 함.
import { useEffect, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Download, X } from 'lucide-react'
import { reportError } from '@/lib/sentry'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'pwa-install-dismissed'

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isStandalone()) return // 이미 설치됨
    if (localStorage.getItem(DISMISS_KEY) === '1') return // 사용자가 닫았었음

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)

    const onInstalled = () => {
      setVisible(false)
      setDeferredPrompt(null)
    }
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    try {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      if (choice.outcome === 'dismissed') {
        localStorage.setItem(DISMISS_KEY, '1')
      }
    } catch (e) {
      console.warn('install prompt failed:', e)
      reportError(e, {
        type: 'pwa',
        level: 'warning',
        tags: { operation: 'install-prompt' },
      })
    } finally {
      setDeferredPrompt(null)
      setVisible(false)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        // wrapper가 fixed/width를 책임지고, motion.div는 width 0이어도 OK
        // (CLAUDE.md: motion.div에 left/right/max-w/mx-auto가 무시되는 이슈 회피)
        <div className="fixed bottom-24 left-0 right-0 z-30 px-5 pointer-events-none">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pointer-events-auto"
            style={{ width: '100%', maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}
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
                <Download className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold whitespace-nowrap">홈 화면에 추가</p>
                <p
                  className="text-[11px] whitespace-nowrap"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  앱처럼 바로 열 수 있어요
                </p>
              </div>
              <button
                onClick={handleInstall}
                className="px-3 py-1.5 rounded-full text-xs font-semibold shrink-0"
                style={{
                  background: 'var(--color-primary)',
                  color: 'var(--color-primary-foreground)',
                }}
              >
                설치
              </button>
              <button
                onClick={handleDismiss}
                className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center shrink-0"
                aria-label="닫기"
              >
                <X className="w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
              </button>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  )
}
