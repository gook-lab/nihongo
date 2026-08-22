import type { WordSrsState } from '@/types'

const MIN_EASE = 1.3
const MAX_EASE = 2.5
const DEFAULT_EASE = 2.5
const DAY_MS = 24 * 60 * 60 * 1000

export function createSrsState(wordId: string): WordSrsState {
  return {
    wordId,
    ease: DEFAULT_EASE,
    intervalDays: 0,
    dueDate: Date.now(),
    reviewCount: 0,
    correctCount: 0,
    wrongCount: 0,
    lastReviewedAt: 0,
  }
}

export function reviewSrs(
  state: WordSrsState | undefined,
  wordId: string,
  isCorrect: boolean,
): WordSrsState {
  const prev = state ?? createSrsState(wordId)
  const now = Date.now()

  if (isCorrect) {
    const nextEase = Math.min(MAX_EASE, prev.ease + 0.1)
    const nextInterval =
      prev.intervalDays === 0
        ? 1
        : prev.intervalDays === 1
        ? 3
        : Math.round(prev.intervalDays * nextEase)

    return {
      ...prev,
      ease: nextEase,
      intervalDays: nextInterval,
      dueDate: now + nextInterval * DAY_MS,
      reviewCount: prev.reviewCount + 1,
      correctCount: prev.correctCount + 1,
      lastReviewedAt: now,
    }
  }

  return {
    ...prev,
    ease: Math.max(MIN_EASE, prev.ease - 0.2),
    intervalDays: 1,
    dueDate: now + DAY_MS,
    reviewCount: prev.reviewCount + 1,
    wrongCount: prev.wrongCount + 1,
    lastReviewedAt: now,
  }
}

export function isDue(state: WordSrsState, atMs: number = Date.now()): boolean {
  return state.dueDate <= atMs
}

export function accuracyOf(state: WordSrsState): number {
  if (state.reviewCount === 0) return 0
  return state.correctCount / state.reviewCount
}
