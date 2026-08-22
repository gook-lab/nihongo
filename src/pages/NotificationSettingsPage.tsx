// 알림 설정 페이지
import { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import { Bell, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BottomNav } from '@/components/BottomNav'
import { PageHeader } from '@/components/PageHeader'
import {
  type NotifyPreferences,
  loadPreferences,
  savePreferences,
  getNotificationPermission,
  requestNotificationPermission,
  scheduleNext,
  sendLocalNotification,
  type PermissionStatus,
} from '@/lib/notifications'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export function NotificationSettingsPage() {
  const lastStudyDate = useAppStore((s) => s.lastStudyDate)
  const [prefs, setPrefs] = useState<NotifyPreferences>(loadPreferences())
  const [permission, setPermission] = useState<PermissionStatus>(
    getNotificationPermission(),
  )
  // 변경 시마다 저장 + 다음 알림 재예약
  useEffect(() => {
    savePreferences(prefs)
    if (permission === 'granted') {
      scheduleNext(prefs, lastStudyDate)
    }
  }, [prefs, permission, lastStudyDate])

  const handleEnableToggle = async () => {
    if (!prefs.dailyReminderEnabled) {
      // 활성화하려면 권한 필요
      if (permission !== 'granted') {
        const result = await requestNotificationPermission()
        setPermission(result)
        if (result !== 'granted') return
      }
      setPrefs((p) => ({ ...p, dailyReminderEnabled: true }))
    } else {
      setPrefs((p) => ({ ...p, dailyReminderEnabled: false }))
    }
  }

  const toggleWeekday = (idx: number) => {
    setPrefs((p) => ({
      ...p,
      weekDays: p.weekDays.map((v, i) => (i === idx ? !v : v)),
    }))
  }

  const handleTestNotification = async () => {
    if (permission !== 'granted') {
      const result = await requestNotificationPermission()
      setPermission(result)
      if (result !== 'granted') return
    }
    sendLocalNotification('🌸 알림 테스트', '잘 작동하고 있어요!')
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader title="알림 설정" icon={Bell} tone="system" back backTo="/settings" />

      <m.div
        className="px-5 mt-4 space-y-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* 권한 안내 */}
        {permission === 'denied' && (
          <Card
            style={{
              background: 'rgba(193, 53, 21, 0.05)',
              border: '1px solid rgba(193, 53, 21, 0.20)',
            }}
          >
            <CardContent className="p-4 flex items-start gap-2">
              <AlertCircle
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: 'var(--color-destructive)' }}
              />
              <div className="text-sm">
                <p
                  className="font-semibold"
                  style={{ color: 'var(--color-destructive)' }}
                >
                  알림 권한이 차단되어 있어요
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  브라우저 주소창 왼쪽 자물쇠 아이콘 → 알림 → "허용"으로 변경 후
                  새로고침 해주세요.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        {permission === 'unsupported' && (
          <Card>
            <CardContent className="p-4 text-sm">
              이 브라우저는 알림을 지원하지 않아요. Chrome, Edge, Safari 최신 버전을 사용해
              주세요.
            </CardContent>
          </Card>
        )}

        {/* 일일 학습 알림 */}
        <div>
          <p className="type-section mb-3 px-1">
            일일 학습 알림
          </p>
          <Card>
            <CardContent className="p-0 divide-y divide-border-light">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">매일 학습 알림</p>
                    <p
                      className="text-[11px]"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      설정한 시간에 학습 알림을 보내요
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleEnableToggle}
                  disabled={permission === 'unsupported'}
                  className={cn(
                    'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
                    prefs.dailyReminderEnabled ? 'bg-primary' : 'bg-muted',
                    permission === 'unsupported' && 'opacity-50',
                  )}
                  aria-label="일일 알림 토글"
                >
                  <m.span
                    layout
                    className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
                    animate={{ x: prefs.dailyReminderEnabled ? 26 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {prefs.dailyReminderEnabled && (
                <>
                  {/* 시간 선택 */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-sm font-medium">알림 시간</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={23}
                        value={prefs.dailyReminderHour}
                        onChange={(e) =>
                          setPrefs((p) => ({
                            ...p,
                            dailyReminderHour: Math.max(
                              0,
                              Math.min(23, parseInt(e.target.value || '0', 10)),
                            ),
                          }))
                        }
                        className="w-16 h-10 text-center rounded-lg border tabular-nums"
                        style={{
                          borderColor: 'var(--color-border)',
                          background: 'var(--color-card)',
                        }}
                      />
                      <span className="font-bold text-lg">:</span>
                      <input
                        type="number"
                        min={0}
                        max={59}
                        step={5}
                        value={prefs.dailyReminderMinute}
                        onChange={(e) =>
                          setPrefs((p) => ({
                            ...p,
                            dailyReminderMinute: Math.max(
                              0,
                              Math.min(59, parseInt(e.target.value || '0', 10)),
                            ),
                          }))
                        }
                        className="w-16 h-10 text-center rounded-lg border tabular-nums"
                        style={{
                          borderColor: 'var(--color-border)',
                          background: 'var(--color-card)',
                        }}
                      />
                      <span
                        className="text-sm ml-2"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {prefs.dailyReminderHour < 12 ? '오전' : '오후'}{' '}
                        {prefs.dailyReminderHour % 12 || 12}시{' '}
                        {String(prefs.dailyReminderMinute).padStart(2, '0')}분
                      </span>
                    </div>
                  </div>

                  {/* 요일 선택 */}
                  <div className="p-4 space-y-3">
                    <p className="text-sm font-medium">알림 요일</p>
                    <div className="grid grid-cols-7 gap-1.5">
                      {WEEKDAY_LABELS.map((label, idx) => {
                        const isOn = prefs.weekDays[idx]
                        const isWeekend = idx === 0 || idx === 6
                        return (
                          <m.button
                            key={idx}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleWeekday(idx)}
                            className={cn(
                              'h-10 rounded-lg font-semibold text-sm transition-all border-2',
                              isOn
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-card',
                            )}
                            style={
                              !isOn
                                ? {
                                    color: isWeekend
                                      ? 'var(--color-destructive)'
                                      : 'var(--color-text-secondary)',
                                  }
                                : undefined
                            }
                          >
                            {label}
                          </m.button>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 기타 알림 */}
        <div>
          <p className="type-section mb-3 px-1">
            기타
          </p>
          <Card>
            <CardContent className="p-0 divide-y divide-border-light">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-sm">일일 미션 완료 알림</p>
                  <p
                    className="text-[11px]"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    오늘의 미션을 모두 완료하면 축하 알림
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPrefs((p) => ({
                      ...p,
                      missionCompleteEnabled: !p.missionCompleteEnabled,
                    }))
                  }
                  className={cn(
                    'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
                    prefs.missionCompleteEnabled ? 'bg-primary' : 'bg-muted',
                  )}
                  aria-label="미션 완료 알림 토글"
                >
                  <m.span
                    layout
                    className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
                    animate={{ x: prefs.missionCompleteEnabled ? 26 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-sm">미사용 알림</p>
                  <p
                    className="text-[11px]"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    3일 이상 학습 안 했을 때 알려드려요
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPrefs((p) => ({
                      ...p,
                      inactivityReminderEnabled: !p.inactivityReminderEnabled,
                    }))
                  }
                  className={cn(
                    'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
                    prefs.inactivityReminderEnabled ? 'bg-primary' : 'bg-muted',
                  )}
                  aria-label="미사용 알림 토글"
                >
                  <m.span
                    layout
                    className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
                    animate={{ x: prefs.inactivityReminderEnabled ? 26 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 테스트 */}
        <Button
          variant="outline"
          className="w-full h-11"
          onClick={handleTestNotification}
          disabled={permission === 'unsupported'}
        >
          <Bell className="w-4 h-4 mr-2" />
          알림 테스트
        </Button>

        <p
          className="text-center text-[10px]"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          알림은 앱이 열려 있을 때 작동합니다. 백그라운드 알림은 향후 추가 예정.
        </p>
      </m.div>

      <BottomNav />
    </div>
  )
}
