// 문자열 → Lucide 컴포넌트 매핑 (데이터 파일의 icon 필드용)
// 회화 카테고리 / 대화 시나리오 / 향후 다른 도메인이 모두 이곳을 참조
//
// 새 카테고리에 새 아이콘을 쓰려면:
//   1) import에 추가
//   2) ICON_MAP에 등록
//   3) 데이터 파일의 icon 필드에 문자열로 사용
import {
  Briefcase,
  Hotel,
  Cloud,
  UtensilsCrossed,
  Plane,
  Heart,
  GraduationCap,
  ShoppingBag,
  Coffee,
  Store,
  Train,
  Smile,
  Users,
  School,
  MessageCircle,
  Music,
  BookText,
  Sparkles,
  PenLine,
  HandHeart,
  UserCircle,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react'

export const ICON_MAP: Record<string, LucideIcon> = {
  // 회화 카테고리
  Briefcase,
  Hotel,
  Cloud,
  UtensilsCrossed,
  Plane,
  Heart,
  GraduationCap,
  ShoppingBag,
  Coffee,
  Store,
  Train,
  Smile,
  Users,
  School,
  HandHeart,
  UserCircle,
  LifeBuoy,
  // 일반
  MessageCircle,
  Music,
  BookText,
  Sparkles,
  PenLine,
}

// 안전한 lookup — 매핑되지 않은 이름은 MessageCircle로 폴백 (개발 중 누락 방지)
export function getIconByName(name: string): LucideIcon {
  const icon = ICON_MAP[name]
  if (!icon && import.meta.env.DEV) {
    console.warn(`[icon-map] '${name}' 아이콘이 등록되지 않았습니다. ICON_MAP에 추가해 주세요.`)
  }
  return icon ?? MessageCircle
}
