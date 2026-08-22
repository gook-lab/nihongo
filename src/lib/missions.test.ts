import { describe, it, expect } from 'vitest'
import {
  generateDailyMissions,
  updateMissionProgress,
  todayKey,
  streakRewardXP,
  streakBadgeName,
} from './missions'

describe('todayKey', () => {
  it('로컬 타임존 YYYY-MM-DD 포맷을 반환한다', () => {
    const key = todayKey()
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('UTC가 아닌 로컬 날짜 — toISOString과 다를 수 있음', () => {
    const local = todayKey()
    const d = new Date()
    const expected = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    expect(local).toBe(expected)
  })
})

describe('generateDailyMissions', () => {
  it('3개 미션을 생성한다', () => {
    const missions = generateDailyMissions()
    expect(missions).toHaveLength(3)
  })

  it('각 미션은 progress=0, completed=false 초기 상태', () => {
    const missions = generateDailyMissions()
    for (const m of missions) {
      expect(m.progress).toBe(0)
      expect(m.completed).toBe(false)
      expect(m.target).toBeGreaterThan(0)
      expect(m.rewardXP).toBeGreaterThan(0)
    }
  })

  it('today key가 generatedAt에 반영된다', () => {
    const missions = generateDailyMissions()
    expect(missions[0].generatedAt).toBe(todayKey())
  })
})

describe('updateMissionProgress', () => {
  it('해당 type만 progress를 증가시킨다', () => {
    const missions = [
      {
        id: 'a', type: 'learn-words' as const, target: 20, progress: 0,
        completed: false, rewardXP: 30, generatedAt: 'x', description: '',
      },
      {
        id: 'b', type: 'review-wrong' as const, target: 3, progress: 0,
        completed: false, rewardXP: 25, generatedAt: 'x', description: '',
      },
    ]
    const { next } = updateMissionProgress(missions, 'learn-words', 5)
    expect(next[0].progress).toBe(5)
    expect(next[1].progress).toBe(0)
  })

  it('target에 도달하면 completed=true + newlyCompleted 반환', () => {
    const missions = [
      {
        id: 'a', type: 'learn-words' as const, target: 5, progress: 4,
        completed: false, rewardXP: 30, generatedAt: 'x', description: '',
      },
    ]
    const { next, newlyCompleted } = updateMissionProgress(missions, 'learn-words', 1)
    expect(next[0].completed).toBe(true)
    expect(newlyCompleted).toHaveLength(1)
  })

  it('이미 완료된 미션은 더 이상 증가하지 않는다', () => {
    const missions = [
      {
        id: 'a', type: 'learn-words' as const, target: 5, progress: 5,
        completed: true, rewardXP: 30, generatedAt: 'x', description: '',
      },
    ]
    const { next, newlyCompleted } = updateMissionProgress(missions, 'learn-words', 1)
    expect(next[0].progress).toBe(5)
    expect(newlyCompleted).toHaveLength(0)
  })
})

describe('streakRewardXP', () => {
  it('마일스톤별 XP를 반환한다', () => {
    expect(streakRewardXP(0)).toBe(0)
    expect(streakRewardXP(3)).toBe(30)
    expect(streakRewardXP(7)).toBe(60)
    expect(streakRewardXP(14)).toBe(100)
    expect(streakRewardXP(30)).toBe(200)
    expect(streakRewardXP(60)).toBe(300)
    expect(streakRewardXP(100)).toBe(500)
  })
})

describe('streakBadgeName', () => {
  it('마일스톤별 뱃지 이름', () => {
    expect(streakBadgeName(3)).toBe('3일의 시작')
    expect(streakBadgeName(7)).toBe('일주일 챔피언')
    expect(streakBadgeName(30)).toBe('한 달의 결심')
    expect(streakBadgeName(100)).toBe('백일의 노력')
  })
})
