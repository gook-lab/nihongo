// 로컬 알림 시스템 (Notification API + setTimeout)
// 한계: 백그라운드 푸시는 FCM 필요. 현재는 앱이 열려있을 때만 알림이 작동.
// (단, PWA로 설치 후 백그라운드에서도 service worker가 schedule된 시간에 발화 가능)
import { reportError, reportStorageError } from './sentry'

export interface NotifyPreferences {
  dailyReminderEnabled: boolean
  dailyReminderHour: number      // 0-23
  dailyReminderMinute: number    // 0-59
  weekDays: boolean[]            // [일,월,화,수,목,금,토] true/false
  missionCompleteEnabled: boolean
  inactivityReminderEnabled: boolean // 3일 미사용 알림
}

const STORAGE_KEY = 'nihongo-notify-preferences'

export const DEFAULT_PREFERENCES: NotifyPreferences = {
  dailyReminderEnabled: false,
  dailyReminderHour: 19,
  dailyReminderMinute: 0,
  weekDays: [true, true, true, true, true, true, true], // 매일
  missionCompleteEnabled: true,
  inactivityReminderEnabled: true,
}

export function loadPreferences(): NotifyPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PREFERENCES
    const parsed = JSON.parse(raw) as Partial<NotifyPreferences>
    return { ...DEFAULT_PREFERENCES, ...parsed }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export function savePreferences(prefs: NotifyPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch (e) {
    console.warn('알림 설정 저장 실패:', e)
    reportStorageError(e, { operation: 'write', key: STORAGE_KEY })
  }
}

// 알림 권한 상태
export type PermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported'

export function getNotificationPermission(): PermissionStatus {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported'
  }
  return Notification.permission as PermissionStatus
}

export async function requestNotificationPermission(): Promise<PermissionStatus> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported'
  }
  try {
    const result = await Notification.requestPermission()
    return result as PermissionStatus
  } catch (e) {
    console.warn('Notification.requestPermission 실패:', e)
    reportError(e, {
      type: 'notification',
      level: 'warning',
      tags: { operation: 'request-permission' },
    })
    return 'denied'
  }
}

export function sendLocalNotification(
  title: string,
  body: string,
  options: NotificationOptions = {},
): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  try {
    const n = new Notification(title, {
      body,
      icon: '/icons/icon-192.svg',
      badge: '/icons/icon-192.svg',
      lang: 'ko',
      ...options,
    })
    // 클릭 시 앱 열기
    n.onclick = () => {
      window.focus()
      n.close()
    }
  } catch (e) {
    console.warn('알림 발송 실패:', e)
    reportError(e, {
      type: 'notification',
      level: 'warning',
      tags: { operation: 'send' },
    })
  }
}

// 다음 알림 시각 계산 (오늘 시간이 지났으면 내일, 요일도 체크)
export function nextNotificationTime(prefs: NotifyPreferences): Date | null {
  if (!prefs.dailyReminderEnabled) return null
  const now = new Date()
  for (let i = 0; i < 7; i++) {
    const candidate = new Date(now)
    candidate.setDate(now.getDate() + i)
    candidate.setHours(prefs.dailyReminderHour, prefs.dailyReminderMinute, 0, 0)
    // 오늘이면서 이미 지난 시각은 skip
    if (i === 0 && candidate.getTime() <= now.getTime()) continue
    // 요일 체크
    if (prefs.weekDays[candidate.getDay()]) return candidate
  }
  return null
}

let scheduledTimer: ReturnType<typeof setTimeout> | null = null
let scheduledTarget = 0

// 다음 알림 스케줄링 (한 번만 등록, 시간 도달 시 발화 + 재귀 schedule)
export function scheduleNext(prefs: NotifyPreferences, lastStudyDate: string | null): void {
  if (scheduledTimer) {
    clearTimeout(scheduledTimer)
    scheduledTimer = null
  }
  const next = nextNotificationTime(prefs)
  if (!next) return
  const delay = next.getTime() - Date.now()
  if (delay <= 0 || delay > 24 * 60 * 60 * 1000) return // 24시간 초과 schedule은 무리

  scheduledTarget = next.getTime()
  scheduledTimer = setTimeout(() => {
    // 발화 시점에 권한 재확인
    if (Notification.permission === 'granted') {
      // 오늘 이미 학습한 경우엔 알림 생략 (사용자 친화)
      const today = new Date().toDateString()
      if (lastStudyDate !== today) {
        sendLocalNotification(
          '🌸 오늘의 일본어 학습',
          '잠깐, 5분만 단어를 익혀볼까요?',
        )
      }
    }
    // 다음 알림 재예약
    scheduleNext(prefs, lastStudyDate)
  }, delay)
}

export function cancelScheduled(): void {
  if (scheduledTimer) {
    clearTimeout(scheduledTimer)
    scheduledTimer = null
    scheduledTarget = 0
  }
}

export function getScheduledTarget(): number {
  return scheduledTarget
}
