// 오프라인/온라인 전환 시 토스트
import { useEffect, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { WifiOff, Wifi } from 'lucide-react'

export function OnlineStatusToast() {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )
  // 처음 페이지 진입 시 토스트 안 띄우고, 상태가 변할 때만 표시
  const [showed, setShowed] = useState<'offline' | 'reconnected' | null>(null)

  useEffect(() => {
    // 자동 닫기 타이머를 붙잡아 둔다 — 정리하지 않으면 언마운트 뒤에 setState 가
    // 불린다 (react-doctor/effect-needs-cleanup).
    let hideTimer: ReturnType<typeof setTimeout> | null = null
    const onOnline = () => {
      setOnline(true)
      // 오프라인이었다가 복귀한 경우만 표시
      setShowed('reconnected')
      if (hideTimer) clearTimeout(hideTimer)
      hideTimer = setTimeout(() => setShowed(null), 2500)
    }
    const onOffline = () => {
      setOnline(false)
      setShowed('offline')
      // offline 토스트는 자동 닫지 않음 — 사용자가 의식하도록
    }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      if (hideTimer) clearTimeout(hideTimer)
    }
  }, [])

  return (
    <AnimatePresence>
      {showed && (
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[60]"
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
            style={{
              background:
                showed === 'offline'
                  ? 'var(--color-destructive)'
                  : 'var(--color-primary)',
              color: '#FFFFFF',
            }}
          >
            {showed === 'offline' ? (
              <>
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">
                  오프라인 상태입니다. 변경사항은 연결 후 동기화됩니다
                </span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">다시 연결되었습니다</span>
              </>
            )}
          </div>
        </m.div>
      )}
      {/* 항상 오프라인인 동안에는 보이도록 (별도 element) */}
      {!online && showed !== 'reconnected' && showed === null && (
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[60]"
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
            style={{
              background: 'var(--color-destructive)',
              color: '#FFFFFF',
            }}
          >
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">오프라인</span>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
