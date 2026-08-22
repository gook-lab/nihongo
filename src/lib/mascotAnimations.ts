// 마스코트 reaction 메타 — framer-motion keyframes/transition + CSS animation 이름 + sprite 타입
// MascotAvatar / MascotScene / MascotSprites가 모두 이곳을 참조하여 reaction 추가 시 한 곳만 수정
//
// 타이밍은 share/add-ani/Mascot Animations.html 원본과 sync.
import type { TargetAndTransition, Transition } from 'framer-motion'

export type MascotReaction =
  | 'idle'
  | 'happy'        // 정답, 긍정 피드백
  | 'sad'          // 실패, 빈 상태
  | 'celebrate'    // 학습 세션 완료
  | 'thinking'     // AI 응답 대기 (=think alias — 둘 다 유지하되 같은 거동)
  | 'think'        // 헷갈림, 곰곰이 생각
  | 'excited'      // 연속 정답, 레벨업
  | 'sleepy'       // 밤 시간대 (=sleep alias)
  | 'sleep'        // 잠자기
  | 'encourage'    // 격려 (오답 후)
  | 'wave'         // 인사
  | 'bounce'       // 통통 튀기 (대기)
  | 'cheer'        // 응원
  | 'streak'       // 스트릭 달성 🔥
  | 'shock'        // 놀람/실수
  | 'studying'     // 공부 중 (head bob + 집중)
  | 'dance'        // 춤 (학습 완료 즐거움)
  | 'proud'        // 자랑스러움 (목표 달성)

// reaction별 sprite 이름 (배경 위 파티클 오버레이)
export type SpriteKind =
  | 'sparkles'
  | 'confetti'
  | 'ring'
  | 'flames'
  | 'hearts'
  | 'questions'
  | 'exclaim'
  | 'tears'
  | 'zs'

export interface ReactionDef {
  // MascotAvatar (작은 원형 아바타) — framer-motion으로 부드러운 마이크로 모션
  framer: TargetAndTransition
  transition: Transition
  // MascotScene (큰 마스코트) — CSS keyframe 이름 (index.css에 정의)
  css: string | null
  // 위에 깔리는 sprite 파티클 종류
  sprite?: SpriteKind
  // 배경 그라데이션 CSS 값 (CSS 변수 형태 — 다크 모드 자동 대응)
  // null이면 마스코트별 기본 배경 사용
  background?: string | null
}

// reaction → 메타 매핑
// 주의:
//   - thinking/think 같은 alias는 동일한 사양을 공유
//   - sprite/background는 알리아스끼리 일관성 유지 (혼란 방지)
export const REACTIONS: Record<MascotReaction, ReactionDef> = {
  idle: {
    framer: { scale: 1, y: 0, rotate: 0 },
    transition: { duration: 0.2 },
    css: null,
  },
  happy: {
    framer: { y: [0, -8, 0], scale: [1, 1.1, 1] },
    transition: { duration: 0.5, ease: 'easeInOut' },
    css: 'happy 1.4s ease-in-out infinite',
    sprite: 'sparkles',
  },
  sad: {
    framer: { x: [-4, 4, -4, 4, 0], rotate: [-3, 3, -3, 3, 0] },
    transition: { duration: 0.4 },
    css: 'sad 2.2s ease-in-out infinite',
    sprite: 'tears',
    background: 'var(--reaction-bg-sad)',
  },
  celebrate: {
    framer: { y: [0, -12, 0, -8, 0], rotate: [0, -10, 10, -5, 0], scale: [1, 1.15, 1, 1.1, 1] },
    transition: { duration: 0.8, ease: 'easeInOut' },
    css: 'celebrate 1.2s ease-in-out infinite',
    sprite: 'confetti',
  },
  thinking: {
    framer: { rotate: [0, -15, 0], y: [0, -2, 0] },
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
    css: 'think 2.4s ease-in-out infinite',
    sprite: 'questions',
  },
  think: {
    framer: { rotate: [0, -12, 0, 12, 0], y: [0, -2, 0] },
    transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
    css: 'think 2.4s ease-in-out infinite',
    sprite: 'questions',
  },
  excited: {
    framer: {
      y: [0, -15, 0, -10, 0, -5, 0],
      scale: [1, 1.2, 1, 1.15, 1, 1.1, 1],
      rotate: [0, -5, 5, -5, 5, 0],
    },
    transition: { duration: 0.6, ease: 'easeOut' },
    css: 'celebrate 0.9s ease-in-out infinite',
  },
  sleepy: {
    framer: { rotate: [0, -5, 0, 5, 0], y: [0, 2, 0] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    css: 'sleep 3.6s ease-in-out infinite',
    sprite: 'zs',
    background: 'var(--reaction-bg-sleep)',
  },
  sleep: {
    framer: { rotate: [0, -4, 0, 4, 0], y: [0, 1.5, 0] },
    transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
    css: 'sleep 3.6s ease-in-out infinite',
    sprite: 'zs',
    background: 'var(--reaction-bg-sleep)',
  },
  encourage: {
    framer: { y: [0, -4, 0, -4, 0], scale: [1, 1.05, 1, 1.05, 1] },
    transition: { duration: 0.6, ease: 'easeInOut' },
    css: 'cheer 0.6s ease-in-out infinite',
  },
  wave: {
    framer: { rotate: [0, -10, 10, -10, 10, 0] },
    transition: { duration: 0.8, ease: 'easeInOut' },
    css: 'wave 1.4s ease-in-out infinite',
    sprite: 'hearts',
  },
  bounce: {
    framer: { y: [0, -6, 0] },
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
    css: 'happy 1.6s ease-in-out infinite',
  },
  cheer: {
    framer: {
      y: [0, -10, -4, -10, 0],
      scale: [1, 1.12, 1.06, 1.12, 1],
      rotate: [0, -8, 8, -8, 0],
    },
    transition: { duration: 0.8, repeat: Infinity, repeatDelay: 0.4, ease: 'easeInOut' },
    css: 'cheer 0.4s ease-in-out infinite',
    sprite: 'ring',
  },
  streak: {
    framer: {
      y: [0, -8, 0, -8, 0],
      rotate: [0, -10, 10, -10, 10, 0],
      scale: [1, 1.15, 1.08, 1.18, 1],
    },
    transition: { duration: 1.0, repeat: Infinity, repeatDelay: 0.6, ease: 'easeOut' },
    css: 'streak 0.18s ease-in-out infinite',
    sprite: 'flames',
    background: 'var(--reaction-bg-streak)',
  },
  shock: {
    framer: { y: [0, -16, -4, 0], x: [0, -5, 5, -3, 3, 0], scale: [1, 0.95, 1.08, 1] },
    transition: { duration: 0.5, ease: 'easeOut' },
    css: 'shock 2.6s ease-out infinite',
    sprite: 'exclaim',
  },
  studying: {
    framer: {
      y: [0, -2, 0, -2, 0],
      rotate: [0, -2, 0, 2, 0],
    },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    css: null,
    sprite: 'questions',
  },
  dance: {
    framer: {
      y: [0, -10, 0, -10, 0],
      x: [0, -8, 0, 8, 0],
      rotate: [0, -8, 0, 8, 0],
    },
    transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
    css: null,
    sprite: 'sparkles',
  },
  proud: {
    framer: {
      y: [0, -6, -2, 0],
      scale: [1, 1.08, 1.04, 1],
    },
    transition: { duration: 2.2, repeat: Infinity, repeatDelay: 0.4, ease: 'easeOut' },
    css: null,
    sprite: 'ring',
  },
}

// reaction별 기본 말풍선 메시지 — share/add-ani 원본 HTML의 카피와 sync
// bubble prop이 true면 이 메시지를 자동으로 사용. 문자열을 주면 그것으로 override.
// streak처럼 동적 값(일수)이 필요한 reaction은 caller가 직접 문자열을 넘기는 게 자연스러움.
export const REACTION_MESSAGES: Record<MascotReaction, string> = {
  idle: '',
  happy: '잘했어요!',
  sad: '조금만 더 노력!',
  celebrate: '완벽해요!',
  thinking: '생각 중…',
  think: '다시 해볼까요?',
  excited: '신난다!',
  sleepy: '졸려요…',
  sleep: '내일 또 만나요',
  encourage: '괜찮아요, 다시!',
  wave: '안녕!',
  bounce: '오늘도 화이팅!',
  cheer: '할 수 있어요!',
  streak: '연속 도전 중! 🔥',
  shock: '아이쿠!',
  studying: '공부 중이에요',
  dance: '신난다!',
  proud: '뿌듯해요!',
}

// sprite 타이밍 (share/add-ani 원본과 sync)
// MascotSprites.tsx가 inline animation 값에 사용
export const SPRITE_TIMING: Record<SpriteKind, { duration: number; easing: string }> = {
  sparkles: { duration: 1.4, easing: 'ease-in-out' },
  confetti: { duration: 2.4, easing: 'ease-in' }, // 각 조각이 i*0.08초씩 staggered
  ring: { duration: 1.6, easing: 'ease-out' },     // 원본 1.6s (이전 1.8s에서 sync)
  flames: { duration: 0.6, easing: 'ease-in-out' }, // 원본 0.6s (이전 0.9s에서 sync)
  hearts: { duration: 2.4, easing: 'ease-in-out' },
  questions: { duration: 2.6, easing: 'ease-out' }, // 원본 ease-out (이전 ease-in-out에서 sync)
  exclaim: { duration: 1.4, easing: 'ease-out' },
  tears: { duration: 1.8, easing: 'ease-in' },      // 원본 1.8s (이전 1.6s에서 sync)
  zs: { duration: 2.6, easing: 'ease-out' },         // 원본 ease-out (이전 ease-in-out에서 sync)
}
