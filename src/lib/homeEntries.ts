// 홈 화면 진입점 데이터 — HomeTravel(여행 우선 홈)이 사용.
// 회화 카테고리의 여행/비여행 구분 + "더 배우기" 학습 콘텐츠 링크 목록.
// 데이터·순수함수만 (JSX 없음) — 단위 테스트 가능.
import type { ConversationCategory } from '@/types'

// 여행 동선에 해당하는 회화 카테고리 id. 배열 순서 = 홈 표시 순서.
export const TRAVEL_CATEGORY_IDS = [
  'travel',
  'accommodation',
  'transport',
  'restaurant',
  'cafe',
  'convenience',
  'shopping',
  'weather',
] as const

const TRAVEL_ID_SET = new Set<string>(TRAVEL_CATEGORY_IDS)

/** 여행 동선 카테고리만, TRAVEL_CATEGORY_IDS 순서대로. */
export function travelCategories(
  all: ConversationCategory[],
): ConversationCategory[] {
  return TRAVEL_CATEGORY_IDS.map((id) => all.find((c) => c.id === id)).filter(
    (c): c is ConversationCategory => c !== undefined,
  )
}

/** 여행 외 카테고리 (일하기·공부·건강 등). 회화 탭에서 접근. */
export function moreCategories(
  all: ConversationCategory[],
): ConversationCategory[] {
  return all.filter((c) => !TRAVEL_ID_SET.has(c.id))
}

// 홈 "더 배우기" 섹션의 학습 콘텐츠 링크. icon은 lucide 아이콘명.
export interface HomeLearnEntry {
  href: string
  title: string
  sub: string
  icon: string
}

export const LEARN_ENTRIES: HomeLearnEntry[] = [
  { href: '/kanji', title: '한자 카드', sub: 'JLPT N5~N3', icon: 'Sparkles' },
  { href: '/grammar', title: '문법', sub: 'N5~N3 핵심', icon: 'BookText' },
  { href: '/idioms', title: '관용구', sub: '일상 비유 표현', icon: 'Sparkles' },
  { href: '/reading', title: '짧은 글 읽기', sub: '독해 연습', icon: 'BookText' },
  { href: '/songs', title: '동요로 배우기', sub: '가사로 익히기', icon: 'Music' },
  { href: '/writing', title: 'AI 작문 첨삭', sub: 'Gemini 채점·교정', icon: 'PenLine' },
  { href: '/mock', title: 'JLPT 모의고사', sub: '시간 제한 시험', icon: 'GraduationCap' },
]
