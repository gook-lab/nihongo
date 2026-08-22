// 햅틱 피드백 — navigator.vibrate(). iOS Safari는 미지원이라 typeof 체크로 안전 폴백.
// 사용자가 "동작 줄이기"를 켰거나 store에서 햅틱 OFF면 비활성.
import { useAppStore } from '@/store'

function canVibrate(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return false
  }
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return false
  }
  // store 설정 우선
  try {
    if (!useAppStore.getState().hapticEnabled) return false
  } catch {
    // store hydration 전엔 통과
  }
  return true
}

export const haptic = {
  light: () => {
    if (canVibrate()) navigator.vibrate(10)
  },
  success: () => {
    if (canVibrate()) navigator.vibrate([20, 40, 20])
  },
  error: () => {
    if (canVibrate()) navigator.vibrate([60, 40, 60])
  },
  tap: () => {
    if (canVibrate()) navigator.vibrate(15)
  },
}
