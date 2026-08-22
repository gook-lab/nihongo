import type { LevelInfo } from './types'

export const LEVELS: LevelInfo[] = [
  { level: 1, name: '입문자', minXP: 0, badge: 'beginner' },
  { level: 2, name: '초보자', minXP: 100, badge: 'novice' },
  { level: 3, name: '학습자', minXP: 300, badge: 'learner' },
  { level: 4, name: '중급자', minXP: 600, badge: 'intermediate' },
  { level: 5, name: '숙련자', minXP: 1000, badge: 'advanced' },
  { level: 6, name: '전문가', minXP: 1500, badge: 'expert' },
  { level: 7, name: '마스터', minXP: 2000, badge: 'master' },
] as const

export const XP_RULES = {
  CORRECT_ANSWER: 10,
  CORRECT_NO_HINT: 15,
  PERFECT_SESSION: 50,
  STREAK_BONUS: 5,
} as const

export const QUESTIONS_PER_SESSION = 20

// XP로 레벨 계산
export function calculateLevel(xp: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i].level
    }
  }
  return 1
}

// 레벨 정보 가져오기
export function getLevelInfo(level: number): LevelInfo {
  return LEVELS.find(l => l.level === level) || LEVELS[0]
}

// 다음 레벨까지 필요한 XP
export function getXPToNextLevel(xp: number, level: number): number {
  const nextLevel = LEVELS.find(l => l.level === level + 1)
  if (!nextLevel) return 0
  return nextLevel.minXP - xp
}
