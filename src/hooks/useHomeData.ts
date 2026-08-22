// 홈 화면(테마별 변형 포함) 공통 데이터/액션 hook
import { useEffect, useState } from 'react'
import { useAppStore } from '@/store'
import { getLevelInfo, getXPToNextLevel, LEVELS } from '@/constants'
import type { MascotReaction } from '@/components/MascotAvatar'

// 시간대 + 스트릭 기반 마스코트 reaction
// - 스트릭 7+ : streak (🔥)
// - 22-6시  : sleepy
// - 6-10시  : wave
// - 10-18시 : bounce
// - 그 외   : happy
export function getHomeReaction(streak: number, hour: number = new Date().getHours()): MascotReaction {
  if (streak >= 7) return 'streak'
  if (hour >= 22 || hour < 6) return 'sleepy'
  if (hour >= 6 && hour < 10) return 'wave'
  if (hour >= 10 && hour < 18) return 'bounce'
  return 'happy'
}

export function useHomeData() {
  const {
    user,
    xp,
    level,
    streak,
    lastStudyDate,
    wrongWordIds,
    savedLearning,
    clearSavedLearning,
    unclaimedStreakMilestone,
    claimStreakMilestone,
  } = useAppStore()

  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [streakRewardDays, setStreakRewardDays] = useState<number | null>(null)

  useEffect(() => {
    const pending = unclaimedStreakMilestone()
    if (pending !== null) {
      setStreakRewardDays(pending)
    }
  }, [unclaimedStreakMilestone, streak])

  const handleClaimStreak = () => {
    if (streakRewardDays !== null) {
      claimStreakMilestone(streakRewardDays)
      setStreakRewardDays(null)
    }
  }

  const levelInfo = getLevelInfo(level)
  const xpToNext = getXPToNextLevel(xp, level)
  const nextLevel = LEVELS.find((l) => l.level === level + 1)
  const progressPercent = nextLevel
    ? ((xp - levelInfo.minXP) / (nextLevel.minXP - levelInfo.minXP)) * 100
    : 100

  return {
    user,
    xp,
    level,
    streak,
    lastStudyDate,
    wrongWordIds,
    savedLearning,
    clearSavedLearning,
    levelInfo,
    xpToNext,
    nextLevel,
    progressPercent,
    showCalendarModal,
    setShowCalendarModal,
    streakRewardDays,
    handleClaimStreak,
  }
}

// 이번 주 7일 캘린더 데이터 생성 (오늘 포함 뒤로 6일)
export function useWeekCalendar(lastStudyDate: string | null) {
  const today = new Date()
  const days: Array<{ d: string; n: number; active: boolean; date: Date }> = []
  const weekday = ['일', '월', '화', '수', '목', '금', '토']
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    days.push({
      d: weekday[date.getDay()],
      n: date.getDate(),
      active: date.toDateString() === today.toDateString(),
      date,
    })
  }
  return { days, hasStudiedToday: lastStudyDate === today.toDateString() }
}
