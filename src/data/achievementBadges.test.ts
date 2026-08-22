import { describe, it, expect } from 'vitest'
import {
  ALL_BADGES,
  STREAK_BADGES,
  MILESTONE_BADGES,
  getBadgeById,
} from './achievementBadges'
import type { AppState } from '@/store'

// AppState 일부만 채운 mock (테스트용)
function mockState(overrides: Partial<AppState> = {}): AppState {
  return {
    streak: 0,
    xp: 0,
    wordSrs: {},
    dailyRecords: {},
    ...overrides,
  } as AppState
}

describe('AchievementBadges 데이터', () => {
  it('스트릭 5개 + 이정표 6개 = 11개', () => {
    expect(STREAK_BADGES).toHaveLength(5)
    expect(MILESTONE_BADGES).toHaveLength(6)
    expect(ALL_BADGES).toHaveLength(11)
  })

  it('모든 뱃지에 필수 메타 존재', () => {
    for (const b of ALL_BADGES) {
      expect(b.id).toBeTruthy()
      expect(b.name).toBeTruthy()
      expect(b.tier).toMatch(/COMMON|UNCOMMON|RARE|EPIC|LEGENDARY/)
      expect(typeof b.isEarned).toBe('function')
    }
  })
})

describe('STREAK_BADGES.isEarned', () => {
  it('streak 0이면 모두 미획득', () => {
    const s = mockState({ streak: 0 })
    for (const b of STREAK_BADGES) {
      expect(b.isEarned(s)).toBe(false)
    }
  })

  it('streak 7이면 3, 7일 뱃지 획득', () => {
    const s = mockState({ streak: 7 })
    expect(STREAK_BADGES[0].isEarned(s)).toBe(true)
    expect(STREAK_BADGES[1].isEarned(s)).toBe(true)
    expect(STREAK_BADGES[2].isEarned(s)).toBe(false)
  })

  it('streak 365면 모두 획득', () => {
    const s = mockState({ streak: 365 })
    for (const b of STREAK_BADGES) {
      expect(b.isEarned(s)).toBe(true)
    }
  })

  it('progress는 현재/목표 반환', () => {
    const s = mockState({ streak: 5 })
    const p = STREAK_BADGES[1].progress?.(s)
    expect(p).toEqual({ current: 5, target: 7 })
  })
})

describe('MILESTONE_BADGES.isEarned', () => {
  it('xp 0이면 첫 발걸음 미획득', () => {
    const s = mockState({ xp: 0 })
    expect(getBadgeById('first-step')!.isEarned(s)).toBe(false)
  })

  it('xp 1 이상이면 첫 발걸음 획득', () => {
    const s = mockState({ xp: 1 })
    expect(getBadgeById('first-step')!.isEarned(s)).toBe(true)
  })

  it('xp 1000 이상이면 XP 컬렉터 획득', () => {
    const s = mockState({ xp: 1000 })
    expect(getBadgeById('xp-collector')!.isEarned(s)).toBe(true)
  })

  it('SRS에 마스터된 단어 100개면 단어 사냥꾼 획득', () => {
    const wordSrs: AppState['wordSrs'] = {}
    for (let i = 0; i < 100; i++) {
      wordSrs[`w-${i}`] = {
        wordId: `w-${i}`,
        reviewCount: 5,
        correctCount: 5,
        wrongCount: 0,
        ease: 2.5,
        intervalDays: 7,
        dueDate: 0,
        lastReviewedAt: 0,
      }
    }
    const s = mockState({ wordSrs })
    expect(getBadgeById('word-hunter')!.isEarned(s)).toBe(true)
  })

  it('한 세션 만점 시 완벽주의자 획득', () => {
    const s = mockState({
      dailyRecords: {
        '2026-05-14': {
          date: '2026-05-14',
          totalCount: 20,
          correctCount: 20,
          studyCount: 1,
          xpEarned: 200,
          wrongWordIds: [],
        },
      },
    })
    expect(getBadgeById('perfectionist')!.isEarned(s)).toBe(true)
  })
})

describe('getBadgeById', () => {
  it('존재하는 ID는 객체 반환', () => {
    expect(getBadgeById('streak-3')?.name).toBe('첫 불꽃')
    expect(getBadgeById('flawless')?.tier).toBe('LEGENDARY')
  })

  it('없는 ID는 undefined', () => {
    expect(getBadgeById('nonexistent')).toBeUndefined()
  })
})
