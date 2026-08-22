import type { DailyMission, DailyMissionType } from '@/types'

const MISSION_TEMPLATES: Array<{
  type: DailyMissionType
  target: number
  rewardXP: number
  description: string
}> = [
  { type: 'learn-words', target: 20, rewardXP: 30, description: '단어 20개 학습하기' },
  { type: 'conversation', target: 5, rewardXP: 20, description: '회화 표현 5개 학습하기' },
  { type: 'review-wrong', target: 3, rewardXP: 25, description: '오답 단어 3개 복습하기' },
  { type: 'streak-correct', target: 5, rewardXP: 20, description: '연속 정답 5개 만들기' },
]

// 로컬 타임존 기준 YYYY-MM-DD (KST면 KST 자정 기준).
// toISOString()은 UTC 기준이라 한국에선 자정 ~ 오전 9시 사이 어제 날짜로 인식됨.
export function todayKey(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function generateDailyMissions(): DailyMission[] {
  const today = todayKey()
  const shuffled = [...MISSION_TEMPLATES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3).map((tpl, idx) => ({
    id: `${today}-${tpl.type}-${idx}`,
    type: tpl.type,
    target: tpl.target,
    progress: 0,
    completed: false,
    rewardXP: tpl.rewardXP,
    generatedAt: today,
    description: tpl.description,
  }))
}

export function updateMissionProgress(
  missions: DailyMission[],
  type: DailyMissionType,
  delta: number,
): { next: DailyMission[]; newlyCompleted: DailyMission[] } {
  const newlyCompleted: DailyMission[] = []
  const next = missions.map((m) => {
    if (m.type !== type || m.completed) return m
    const progress = Math.min(m.target, m.progress + delta)
    const completed = progress >= m.target
    if (completed && !m.completed) {
      newlyCompleted.push({ ...m, progress, completed: true })
    }
    return { ...m, progress, completed }
  })
  return { next, newlyCompleted }
}

export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100] as const

export function streakRewardXP(days: number): number {
  if (days >= 100) return 500
  if (days >= 60) return 300
  if (days >= 30) return 200
  if (days >= 14) return 100
  if (days >= 7) return 60
  if (days >= 3) return 30
  return 0
}

export function streakBadgeName(days: number): string {
  if (days >= 100) return '백일의 노력'
  if (days >= 60) return '두 달의 의지'
  if (days >= 30) return '한 달의 결심'
  if (days >= 14) return '2주 마스터'
  if (days >= 7) return '일주일 챔피언'
  return '3일의 시작'
}
