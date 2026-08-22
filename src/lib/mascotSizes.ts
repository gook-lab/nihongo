// 마스코트 카드 사이즈 토큰 — 14곳 사용처에서 size/height 매직 넘버 일관성 문제 해결.
//
// 토큰 사용 가이드:
//   xs  : 작은 모서리·플로팅 피드백 (ResultPage 우하단, ConversationQuizPage 정답 토스트)
//   sm  : 대화·페이지 인사·로딩 (ChatModal 빈 채팅, ProfilePage hero, WritingPage 채점)
//   md  : 결과 카드·에러 페이지 (MockTestPage, ConversationQuizPage 최종, NotFound, ErrorScreens)
//   lg  : 모달 강조 (StreakRewardModal)
//   xl  : EmptyState compact (작은 빈 상태)
//   2xl : EmptyState 기본 (큰 빈 상태)
//
// 비율은 size:height ≈ 1:1.4 (≈ 0.67) 로 통일. 카드 디자인의 시각 안정감 보장.
export type MascotSceneSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

// 마스코트가 카드 폭의 ~65~70% 차지 — 원본 HTML share/add-ani 비율 매칭.
// 마스코트가 카드 안에서 확실히 메인 요소로 보이고, sprite·말풍선은 모서리에 자연스럽게 배치.
export const MASCOT_SCENE_SIZES: Record<
  MascotSceneSize,
  { size: number; width: number; height: number }
> = {
  xs: { size: 80, width: 120, height: 130 },
  sm: { size: 110, width: 160, height: 175 },
  md: { size: 130, width: 190, height: 205 },
  lg: { size: 150, width: 220, height: 240 },
  xl: { size: 180, width: 260, height: 280 },
  '2xl': { size: 220, width: 300, height: 320 },
}
