// 단어 데이터
export interface Word {
  id: string
  kanji: string
  hiragana: string
  meaning: string
  level: number // JLPT 레벨 (5=N5, 4=N4, ...)
  example?: {
    japanese: string
    korean: string
    targetWord: string // 볼드 처리할 단어
    reading?: string // 전체 예문의 히라가나 읽기
  }
}

// 사용자 (Firebase Auth)
export interface User {
  id: string
  provider: 'kakao' | 'naver' | 'google' | 'email'
  nickname: string
  email?: string
  profileImage?: string
}

// 학습 진행 상태 (localStorage에 저장)
export interface Progress {
  xp: number
  level: number
  streak: number
  lastStudyDate: string | null
  wrongWordIds: string[]
  todayCompleted: boolean
}

// 현재 세션 (메모리만)
export interface Session {
  questionIndex: number
  correctCount: number
  answers: { wordId: string; correct: boolean }[]
}

// 레벨 정보
export interface LevelInfo {
  level: number
  name: string
  minXP: number
  badge: string
}

// 회화 관련 타입
export interface ConversationWord {
  text: string // "レストラン"
  reading: string // "れすとらん"
  meaning: string // "레스토랑"
  isParticle?: boolean // 조사 여부 (を, に, は 등)
}

export interface ConversationPhrase {
  id: string
  japanese: string // "レストランを探しています"
  korean: string // "레스토랑을 찾고 있습니다"
  words: ConversationWord[]
  level: 'N5' | 'N4' | 'N3'
}

export interface ConversationCategory {
  id: string
  nameKo: string // "식당"
  nameJa: string // "レストラン"
  icon: string // Lucide 아이콘명
  phrases: ConversationPhrase[]
}

export interface SavedConversationWord {
  text: string
  reading: string
  meaning: string
  sourcePhrase: string
  category: string
  savedAt: number
}

// 표현 즐겨찾기 — "내 여행 키트" (phrase 단위, 단어 메모와 별개)
export interface FavoritePhrase {
  id: string // ConversationPhrase.id
  categoryId: string
  addedAt: number
}

// 마스코트 캐릭터
export interface Mascot {
  id: string
  name: string // 일본어 이름
  nameKr: string // 한국어 이름
  /** import된 이미지 URL — 없으면 emoji fallback */
  image?: string
  /** 이미지 없을 때 fallback emoji (선택) */
  emoji?: string
  /** 해금 레벨 — 사용자 레벨이 이 값 이상이면 사용 가능. 1이면 기본 해금 */
  unlockLevel: number
  /** 한 줄 소개 */
  description: string
}

// SRS (Spaced Repetition System) — SM-2 lite
export interface WordSrsState {
  wordId: string
  ease: number          // 1.3 ~ 2.5, 기본 2.5
  intervalDays: number  // 다음 복습까지 일수
  dueDate: number       // timestamp (ms)
  reviewCount: number   // 총 복습 횟수
  correctCount: number  // 누적 정답 수
  wrongCount: number    // 누적 오답 수
  lastReviewedAt: number
}

// 일일 미션
export type DailyMissionType =
  | 'learn-words'       // 단어 N개 학습
  | 'conversation'      // 회화 표현 N개 학습
  | 'review-wrong'      // 오답 복습 N개
  | 'streak-correct'    // 연속 정답 N개

export interface DailyMission {
  id: string
  type: DailyMissionType
  target: number
  progress: number
  completed: boolean
  rewardXP: number
  generatedAt: string   // YYYY-MM-DD
  description: string
}

// 스트릭 보상
export interface StreakReward {
  days: number          // 마일스톤 (3, 7, 14, 30, 60, 100)
  rewardXP: number
  badgeName: string
  claimed: boolean
  claimedAt?: number
}

// 홈 레이아웃 선택 (테마와 독립적으로 선택 가능)
// 'auto'는 현재 테마에 매핑된 레이아웃을 자동 사용 (기본값, 기존 호환)
export type HomeLayoutId =
  | 'auto'
  | 'default'
  | 'mono'
  | 'ios'
  | 'editorial'
  | 'mascot'
  | 'travel'

// 대화 시나리오 (짧은 상황극)
export interface DialogueLine {
  speaker: string      // "店員" / "客" 등 (일본어 화자명)
  speakerKr: string    // "점원" / "손님"
  japanese: string
  korean: string
  words: ConversationWord[]
}

export interface DialogueScenario {
  id: string
  titleKo: string
  titleJa: string
  context: string      // 시나리오 배경 (한국어 한 문장)
  emoji: string        // 대표 이모지
  level: 'N5' | 'N4' | 'N3'
  lines: DialogueLine[]
}

// Sentry 에러 분류 (지문/필터링 용도)
export type ErrorType =
  | 'api'        // 외부 API 호출 (Gemini, Murf, Firebase Auth REST 등)
  | 'auth'       // 로그인/회원가입/로그아웃/재인증
  | 'firestore'  // Firestore 동기화
  | 'ai'         // Gemini 스트리밍/생성
  | 'tts'        // 음성 합성
  | 'boundary'   // React 에러 바운더리
  | 'storage'    // localStorage / IndexedDB
  | 'notification' // 알림 권한/예약
  | 'pwa'        // 설치 프롬프트/Service Worker
  | 'unknown'
