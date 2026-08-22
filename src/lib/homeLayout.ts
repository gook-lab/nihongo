// 홈 레이아웃 resolve — homeLayoutId 설정값을 실제 렌더할 레이아웃으로 변환.
// 'auto'(기본값)는 여행 우선 홈으로 resolve. 명시적으로 고른 레이아웃은 그대로 유지.
import type { HomeLayoutId } from '@/types'

export type EffectiveHomeLayout = Exclude<HomeLayoutId, 'auto'>

export function resolveHomeLayout(
  homeLayoutId: HomeLayoutId,
): EffectiveHomeLayout {
  return homeLayoutId === 'auto' ? 'travel' : homeLayoutId
}
