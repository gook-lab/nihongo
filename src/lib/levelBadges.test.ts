import { describe, it, expect } from 'vitest'
import { LEVEL_BADGES, getLevelBadge } from './levelBadges'

describe('LEVEL_BADGES', () => {
  it('7개 레벨 모두 정의', () => {
    expect(LEVEL_BADGES).toHaveLength(7)
    expect(LEVEL_BADGES[0].id).toBe(1)
    expect(LEVEL_BADGES[6].id).toBe(7)
  })

  it('각 레벨에 색·이름·설명 메타가 있다', () => {
    for (const b of LEVEL_BADGES) {
      expect(b.name).toBeTruthy()
      expect(b.jp).toBeTruthy()
      expect(b.color).toMatch(/^#[0-9A-F]{6}$/i)
      expect(b.sub).toBeTruthy()
    }
  })

  it('nextXP는 다음 레벨의 minXP와 일치 (마지막 레벨은 null)', () => {
    for (let i = 0; i < LEVEL_BADGES.length - 1; i++) {
      expect(LEVEL_BADGES[i].nextXP).toBe(LEVEL_BADGES[i + 1].minXP)
    }
    expect(LEVEL_BADGES[6].nextXP).toBeNull()
  })
})

describe('getLevelBadge', () => {
  it('1~7 레벨 조회', () => {
    expect(getLevelBadge(1).name).toBe('입문자')
    expect(getLevelBadge(4).name).toBe('중급자')
    expect(getLevelBadge(7).name).toBe('마스터')
  })

  it('범위 밖이면 Lv.1로 폴백', () => {
    expect(getLevelBadge(99).id).toBe(1)
    expect(getLevelBadge(0).id).toBe(1)
  })
})
