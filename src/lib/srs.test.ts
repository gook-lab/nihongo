import { describe, it, expect, beforeEach, vi } from 'vitest'
import { reviewSrs, createSrsState, isDue, accuracyOf } from './srs'

const DAY_MS = 24 * 60 * 60 * 1000

describe('createSrsState', () => {
  it('기본 SRS 상태를 생성한다', () => {
    const s = createSrsState('word-1')
    expect(s.wordId).toBe('word-1')
    expect(s.ease).toBe(2.5) // DEFAULT_EASE
    expect(s.intervalDays).toBe(0)
    expect(s.reviewCount).toBe(0)
    expect(s.correctCount).toBe(0)
    expect(s.wrongCount).toBe(0)
  })
})

describe('reviewSrs - 정답 시나리오', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-12T00:00:00Z'))
  })

  it('첫 정답: ease 유지(2.5 max), interval 1일로 시작', () => {
    const next = reviewSrs(undefined, 'word-1', true)
    expect(next.ease).toBe(2.5) // 이미 max라 증가 안 함
    expect(next.intervalDays).toBe(1)
    expect(next.correctCount).toBe(1)
    expect(next.reviewCount).toBe(1)
    expect(next.dueDate).toBe(Date.now() + DAY_MS)
  })

  it('두 번째 정답: interval 1 → 3일로 증가', () => {
    const first = reviewSrs(undefined, 'word-1', true)
    const second = reviewSrs(first, 'word-1', true)
    expect(second.intervalDays).toBe(3)
    expect(second.correctCount).toBe(2)
  })

  it('세 번째 정답: interval 3 * 2.5 = 8일로 증가', () => {
    let s = reviewSrs(undefined, 'word-1', true)
    s = reviewSrs(s, 'word-1', true)
    s = reviewSrs(s, 'word-1', true)
    expect(s.intervalDays).toBeGreaterThanOrEqual(7) // 3 * 2.5 = 7.5 → 8 round
    expect(s.correctCount).toBe(3)
  })
})

describe('reviewSrs - 오답 시나리오', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-12T00:00:00Z'))
  })

  it('오답: interval 1일로 리셋, ease 감소 (max 2.5 → 2.3)', () => {
    const next = reviewSrs(undefined, 'word-1', false)
    expect(next.ease).toBe(2.3) // 2.5 - 0.2
    expect(next.intervalDays).toBe(1)
    expect(next.wrongCount).toBe(1)
    expect(next.correctCount).toBe(0)
  })

  it('연속 오답으로 ease가 minimum 1.3까지만 감소', () => {
    let s = reviewSrs(undefined, 'word-1', false) // 2.3
    s = reviewSrs(s, 'word-1', false) // 2.1
    s = reviewSrs(s, 'word-1', false) // 1.9
    s = reviewSrs(s, 'word-1', false) // 1.7
    s = reviewSrs(s, 'word-1', false) // 1.5
    s = reviewSrs(s, 'word-1', false) // 1.3
    s = reviewSrs(s, 'word-1', false) // 1.3 (clamp)
    expect(s.ease).toBe(1.3)
    expect(s.wrongCount).toBe(7)
  })

  it('정답 후 오답: interval 리셋', () => {
    let s = reviewSrs(undefined, 'word-1', true)
    s = reviewSrs(s, 'word-1', true) // interval 3일
    s = reviewSrs(s, 'word-1', false) // 오답 → 1일로 리셋
    expect(s.intervalDays).toBe(1)
    expect(s.wrongCount).toBe(1)
    expect(s.correctCount).toBe(2)
  })
})

describe('isDue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-12T00:00:00Z'))
  })

  it('dueDate가 과거면 due=true', () => {
    const s = createSrsState('word-1')
    s.dueDate = Date.now() - 1000
    expect(isDue(s)).toBe(true)
  })

  it('dueDate가 미래면 due=false', () => {
    const s = createSrsState('word-1')
    s.dueDate = Date.now() + 1000
    expect(isDue(s)).toBe(false)
  })
})

describe('accuracyOf', () => {
  it('리뷰 0회는 정답률 0', () => {
    const s = createSrsState('word-1')
    expect(accuracyOf(s)).toBe(0)
  })

  it('3정답 / 1오답 = 0.75 정답률', () => {
    let s = reviewSrs(undefined, 'word-1', true)
    s = reviewSrs(s, 'word-1', true)
    s = reviewSrs(s, 'word-1', true)
    s = reviewSrs(s, 'word-1', false)
    expect(accuracyOf(s)).toBe(0.75)
  })
})
