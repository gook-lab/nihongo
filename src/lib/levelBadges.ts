// 7단계 레벨 뱃지 메타데이터 — share/Level Badges.html 디자인 시스템과 sync.
// constants.ts의 LEVELS는 level/minXP/name만 갖고, 시각 메타는 여기서 합성.
import { LEVELS } from '@/constants'

export interface LevelBadgeMeta {
  id: number              // 1~7
  name: string            // 한국어
  jp: string              // English/Japanese label (Sprout / Beginner ...)
  color: string           // 레벨별 accent
  sub: string             // 짧은 설명
  minXP: number
  nextXP: number | null   // null = MAX
}

// 색·라벨·설명은 share/Level Badges.html에서 그대로 가져옴
const META: Omit<LevelBadgeMeta, 'minXP' | 'nextXP'>[] = [
  { id: 1, name: '입문자', jp: 'Sprout',      color: '#C5BCD0', sub: '여정의 첫걸음' },
  { id: 2, name: '초보자', jp: 'Beginner',    color: '#7FB8E6', sub: '단어와 친해지기' },
  { id: 3, name: '학습자', jp: 'Learner',     color: '#2EBD6B', sub: '문장이 보이기 시작' },
  { id: 4, name: '중급자', jp: 'Intermediate',color: '#F4B36A', sub: '대화의 흐름을 익힘' },
  { id: 5, name: '숙련자', jp: 'Skilled',     color: '#FF8A4D', sub: '자연스러운 표현' },
  { id: 6, name: '전문가', jp: 'Expert',      color: '#FF3366', sub: '깊이 있는 이해' },
  { id: 7, name: '마스터', jp: 'Master',      color: '#1A1A1A', sub: '경지에 다다름' },
]

export const LEVEL_BADGES: LevelBadgeMeta[] = META.map((m) => {
  const cur = LEVELS.find((l) => l.level === m.id)
  const next = LEVELS.find((l) => l.level === m.id + 1)
  return {
    ...m,
    minXP: cur?.minXP ?? 0,
    nextXP: next?.minXP ?? null,
  }
})

export function getLevelBadge(level: number): LevelBadgeMeta {
  return LEVEL_BADGES.find((b) => b.id === level) ?? LEVEL_BADGES[0]
}
