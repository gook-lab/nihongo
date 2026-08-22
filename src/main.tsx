import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { useAppStore } from './store'
import { applyTheme } from './lib/themes'

// Sentry/GlitchTip — idle 시점에 dynamic import로 defer (LCP 2.2초 envelope 영향 제거).
// 초기 paint 직후 첫 에러까지의 잠깐 동안 보고가 누락될 수 있으나 GlitchTip은 best-effort.
const deferSentry = () => import('./lib/sentry').then((m) => m.initSentry())
if ('requestIdleCallback' in window) {
  ;(window as Window & typeof globalThis).requestIdleCallback(deferSentry, { timeout: 3000 })
} else {
  setTimeout(deferSentry, 1500)
}

// 첫 렌더 전 테마/다크 모드를 즉시 반영해 flash 방지
// (Zustand persist는 동기 localStorage라서 import 시점에 이미 hydrated)
const { themeId, darkMode } = useAppStore.getState()
if (darkMode) {
  document.documentElement.classList.add('dark')
}
applyTheme(themeId, darkMode)

// 첫 진입(세션 내 처음) + 루트 경로면 스플래시로 우회
const SPLASH_SEEN_KEY = 'nihongo-splash-seen'
const seenSplash = sessionStorage.getItem(SPLASH_SEEN_KEY) === '1'
const path = window.location.pathname
// /splash, /terms, /privacy 같이 이미 destination이 명확한 경로는 제외
const splashSkipPaths = ['/splash', '/terms', '/privacy']
if (!seenSplash && !splashSkipPaths.includes(path)) {
  // 원래 가려던 경로 + query 보존
  const target = encodeURIComponent(path + window.location.search)
  window.history.replaceState({}, '', `/splash?to=${target}`)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
