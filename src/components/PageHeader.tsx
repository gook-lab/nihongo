// 공통 페이지 헤더 — sticky + 스크롤 시 배경/그림자 전환
// 12개+ 페이지에서 반복되던 isScrolled state + scroll listener를 한 곳에 통합
//
// 두 가지 변형:
// 1) 탭 페이지 (좌측 아이콘+제목, 우측 액션): 뒤로가기 없음
// 2) 서브페이지: 좌측 뒤로가기, 중앙 아이콘+제목, 우측 액션 또는 여백
import { useEffect, useState, type ReactNode, type ComponentType } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

/** 페이지별 visual anchor 톤 — icon 배경 색상 변형. AI slop 단조로움 회피. */
export type PageHeaderTone = 'primary' | 'study' | 'conv' | 'content' | 'reward' | 'system'

const TONE_STYLES: Record<PageHeaderTone, { bg: string; fg: string }> = {
  primary: { bg: 'bg-primary/10', fg: 'text-primary' },
  study: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', fg: 'text-emerald-600 dark:text-emerald-300' },
  conv: { bg: 'bg-sky-100 dark:bg-sky-900/40', fg: 'text-sky-600 dark:text-sky-300' },
  content: { bg: 'bg-amber-100 dark:bg-amber-900/40', fg: 'text-amber-600 dark:text-amber-300' },
  reward: { bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/40', fg: 'text-fuchsia-600 dark:text-fuchsia-300' },
  system: { bg: 'bg-zinc-100 dark:bg-zinc-800', fg: 'text-zinc-600 dark:text-zinc-300' },
}

interface PageHeaderProps {
  title: string
  /** 우측 부제 (탭 페이지에서 인라인 표시) */
  subtitle?: string
  /** 좌측 작은 라운드 아이콘 (Lucide 컴포넌트) */
  icon?: ComponentType<{ className?: string }>
  /** 서브페이지면 true — 좌측 뒤로가기 버튼 + 중앙 정렬 */
  back?: boolean
  /** 뒤로가기 경로 (back=true일 때만). 미지정 시 navigate(-1) 대신 부모 디폴트 사용 권장 */
  backTo?: string
  /** 뒤로가기 클릭 시 커스텀 핸들러 (확인 다이얼로그 등) */
  onBack?: () => void
  /** 우측 액션(아이콘 버튼 등). back=true에서 우측 여백 대신 표시 */
  rightAction?: ReactNode
  /** 페이지 카테고리별 톤. 기본 'primary' (분홍). 학습=study(초록), 회화=conv(블루), 콘텐츠=content(앰버), 보상=reward(퍼시아), 시스템=system(회색) */
  tone?: PageHeaderTone
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  back = false,
  backTo,
  onBack,
  rightAction,
  tone = 'primary',
}: PageHeaderProps) {
  const toneStyle = TONE_STYLES[tone]
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }
    if (backTo) {
      navigate(backTo)
      return
    }
    // CLAUDE.md: navigate(-1)은 히스토리 순환 위험 → 호출자가 backTo를 명시해야 함
    if (import.meta.env.DEV) {
      console.error(
        '[PageHeader] back=true에는 backTo 또는 onBack이 필요합니다. navigate(-1)로 폴백하지만 권장하지 않아요.',
      )
    }
    navigate(-1)
  }

  const titleBlock = (
    <div className="flex items-center gap-2 min-w-0">
      {Icon && (
        <div className={`w-8 h-8 rounded-full ${toneStyle.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${toneStyle.fg}`} />
        </div>
      )}
      <div className="min-w-0">
        <span className="type-h3">{title}</span>
        {subtitle && (
          <span className="type-caption ml-2">{subtitle}</span>
        )}
      </div>
    </div>
  )

  return (
    <div
      className={`pt-6 pb-4 px-5 sticky top-0 z-10 transition-all duration-200 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm shadow-sm'
          : 'bg-gradient-to-b from-primary/10 to-background'
      }`}
    >
      {back ? (
        <m.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button variant="ghost" size="icon" onClick={handleBack} aria-label="뒤로가기">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          {titleBlock}
          <div className="min-w-[40px] flex justify-end">
            {rightAction ?? <div className="w-10" />}
          </div>
        </m.div>
      ) : (
        <m.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          {titleBlock}
          {rightAction}
        </m.div>
      )}
    </div>
  )
}
