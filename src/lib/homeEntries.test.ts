import { describe, it, expect } from 'vitest'
import { CONVERSATION_CATEGORIES } from '@/data/conversations'
import { TRAVEL_CATEGORY_IDS, travelCategories, moreCategories } from './homeEntries'

describe('homeEntries — 여행 카테고리 구분', () => {
  it('TRAVEL_CATEGORY_IDS의 모든 id가 실제 회화 카테고리에 존재한다 (오타 가드)', () => {
    const allIds = new Set(CONVERSATION_CATEGORIES.map((c) => c.id))
    for (const id of TRAVEL_CATEGORY_IDS) {
      expect(allIds.has(id), `'${id}' 카테고리가 CONVERSATION_CATEGORIES에 없음`).toBe(
        true,
      )
    }
  })

  it('travelCategories + moreCategories가 전체를 누락·중복 없이 덮는다', () => {
    const travel = travelCategories(CONVERSATION_CATEGORIES)
    const more = moreCategories(CONVERSATION_CATEGORIES)
    expect(travel.length + more.length).toBe(CONVERSATION_CATEGORIES.length)
    const ids = new Set([...travel, ...more].map((c) => c.id))
    expect(ids.size).toBe(CONVERSATION_CATEGORIES.length)
  })

  it('travelCategories는 TRAVEL_CATEGORY_IDS 순서를 그대로 따른다', () => {
    const travel = travelCategories(CONVERSATION_CATEGORIES)
    expect(travel.map((c) => c.id)).toEqual([...TRAVEL_CATEGORY_IDS])
  })

  it('moreCategories에는 여행 카테고리가 하나도 없다', () => {
    const more = moreCategories(CONVERSATION_CATEGORIES)
    const travelSet = new Set<string>(TRAVEL_CATEGORY_IDS)
    expect(more.every((c) => !travelSet.has(c.id))).toBe(true)
  })
})
