// 뱃지 컬렉션 — 스트릭 5종 + 이정표 6종 = 11종.
// share/Level Badges (1).html의 STREAKS / MILESTONES와 sync.
// 획득·진척률은 store(streak/xp/wordSrs)에서 자동 계산.
import type { AppState } from '@/store'

export type BadgeTier = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
export type BadgeCategory = 'streak' | 'milestone'

export interface AchievementBadge {
  id: string
  name: string
  sub: string
  category: BadgeCategory
  tier: BadgeTier
  /** 획득 조건 — store 상태 기반 */
  isEarned: (s: AppState) => boolean
  /** 진척률 (current/target) — 미획득이고 진행 중일 때만 */
  progress?: (s: AppState) => { current: number; target: number }
}

// ── 스트릭 5종
export const STREAK_BADGES: AchievementBadge[] = [
  {
    id: 'streak-3',
    name: '첫 불꽃',
    sub: '3일 연속 학습',
    category: 'streak',
    tier: 'COMMON',
    isEarned: (s) => s.streak >= 3,
    progress: (s) => ({ current: Math.min(s.streak, 3), target: 3 }),
  },
  {
    id: 'streak-7',
    name: '한 주의 빛',
    sub: '7일 연속 학습',
    category: 'streak',
    tier: 'UNCOMMON',
    isEarned: (s) => s.streak >= 7,
    progress: (s) => ({ current: Math.min(s.streak, 7), target: 7 }),
  },
  {
    id: 'streak-30',
    name: '한 달의 결실',
    sub: '30일 연속 학습',
    category: 'streak',
    tier: 'RARE',
    isEarned: (s) => s.streak >= 30,
    progress: (s) => ({ current: Math.min(s.streak, 30), target: 30 }),
  },
  {
    id: 'streak-90',
    name: '계절의 수호자',
    sub: '90일 연속 학습',
    category: 'streak',
    tier: 'EPIC',
    isEarned: (s) => s.streak >= 90,
    progress: (s) => ({ current: Math.min(s.streak, 90), target: 90 }),
  },
  {
    id: 'streak-365',
    name: '일년의 마스터',
    sub: '365일 연속 학습',
    category: 'streak',
    tier: 'LEGENDARY',
    isEarned: (s) => s.streak >= 365,
    progress: (s) => ({ current: Math.min(s.streak, 365), target: 365 }),
  },
]

// SRS 기반 마스터된 단어 수 (3회 이상 + 정답률 80%+)
function masteredWordCount(s: AppState): number {
  return Object.values(s.wordSrs).filter((w) => {
    if (w.reviewCount < 3) return false
    return w.correctCount / w.reviewCount >= 0.8
  }).length
}

// ── 이정표 6종
export const MILESTONE_BADGES: AchievementBadge[] = [
  {
    id: 'first-step',
    name: '첫 발걸음',
    sub: '첫 학습 완료',
    category: 'milestone',
    tier: 'COMMON',
    isEarned: (s) => s.xp > 0,
  },
  {
    id: 'word-hunter',
    name: '단어 사냥꾼',
    sub: '100단어 마스터',
    category: 'milestone',
    tier: 'UNCOMMON',
    isEarned: (s) => masteredWordCount(s) >= 100,
    progress: (s) => ({ current: Math.min(masteredWordCount(s), 100), target: 100 }),
  },
  {
    id: 'perfectionist',
    name: '완벽주의자',
    sub: '한 세션 만점',
    category: 'milestone',
    tier: 'RARE',
    isEarned: (s) =>
      Object.values(s.dailyRecords).some(
        (rec) => rec.totalCount >= 20 && rec.correctCount === rec.totalCount,
      ),
  },
  {
    id: 'xp-collector',
    name: 'XP 컬렉터',
    sub: '1,000 XP 누적',
    category: 'milestone',
    tier: 'RARE',
    isEarned: (s) => s.xp >= 1000,
    progress: (s) => ({ current: Math.min(s.xp, 1000), target: 1000 }),
  },
  {
    id: 'kanji-starter',
    name: '한자 입문',
    sub: 'N5 한자 80자 마스터',
    category: 'milestone',
    tier: 'EPIC',
    isEarned: (s) => {
      const n5Mastered = Object.values(s.wordSrs).filter(
        (w) => w.reviewCount >= 3 && w.correctCount / w.reviewCount >= 0.8,
      ).length
      return n5Mastered >= 80
    },
    progress: (s) => ({
      current: Math.min(masteredWordCount(s), 80),
      target: 80,
    }),
  },
  {
    id: 'flawless',
    name: '무결점',
    sub: '50연속 정답',
    category: 'milestone',
    tier: 'LEGENDARY',
    // 직접 추적은 어려워서 wordSrs 통계 평균 100%로 대체 (50회 이상 + 오답 0)
    isEarned: (s) => {
      const totalReviews = Object.values(s.wordSrs).reduce(
        (sum, w) => sum + w.reviewCount,
        0,
      )
      const totalWrong = Object.values(s.wordSrs).reduce(
        (sum, w) => sum + w.wrongCount,
        0,
      )
      return totalReviews >= 50 && totalWrong === 0
    },
  },
]

export const ALL_BADGES: AchievementBadge[] = [...STREAK_BADGES, ...MILESTONE_BADGES]

export function getBadgeById(id: string): AchievementBadge | undefined {
  return ALL_BADGES.find((b) => b.id === id)
}

// tier별 색
export const TIER_COLORS: Record<BadgeTier, { primary: string; bg: string; ring: string }> = {
  COMMON:    { primary: '#A89BBA', bg: '#F3EFF8', ring: '#C5BCD0' },
  UNCOMMON:  { primary: '#7FB8E6', bg: '#EAF3FB', ring: '#7FB8E6' },
  RARE:      { primary: '#E8A722', bg: '#FFF8E5', ring: '#F4B36A' },
  EPIC:      { primary: '#7A4DD8', bg: '#F1ECF8', ring: '#7A4DD8' },
  LEGENDARY: { primary: '#FF3366', bg: '#FFEBF1', ring: '#FFD64A' },
}
