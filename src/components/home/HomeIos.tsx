// d3-ios 테마 전용 홈 — Apple iOS native 미학 (large title + grouped list + progress dots)
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { Flame, Zap, ChevronRight, Sparkles, Play, BookOpen, BookText, Music, PenLine, GraduationCap } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { FullCalendarModal } from '@/components/FullCalendarModal'
import { StreakRewardModal } from '@/components/StreakRewardModal'
import { MascotAvatar } from '@/components/MascotAvatar'
import { QuizTypeQuickPick } from '@/components/QuizTypeQuickPick'
import { useHomeData, useWeekCalendar, getHomeReaction } from '@/hooks/useHomeData'
import { QUESTIONS_PER_SESSION } from '@/constants'

function GroupHead({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="px-8 pt-5 pb-1.5 text-[13px] uppercase tracking-[-0.005em]"
      style={{ color: 'var(--color-text-secondary)' }}
    >
      {children}
    </p>
  )
}

function GroupRow({
  children,
  last,
  onClick,
}: {
  children: React.ReactNode
  last?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center px-4 py-3 text-left"
      style={{
        borderBottom: last ? 'none' : '0.5px solid var(--color-border-light)',
      }}
    >
      {children}
    </button>
  )
}

export function HomeIos() {
  const navigate = useNavigate()
  const h = useHomeData()
  const { days } = useWeekCalendar(h.lastStudyDate)
  const hasSaved =
    !!h.savedLearning && h.savedLearning.session.questionIndex < QUESTIONS_PER_SESSION
  const sessionProgress = hasSaved ? h.savedLearning!.session.questionIndex : 0

  return (
    <div
      className="min-h-screen pb-nav"
      style={{ background: 'var(--color-background)' }}
    >
      {/* Large title */}
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-12 px-4"
      >
        <div className="flex items-center justify-between min-h-[40px] pt-1">
          <span></span>
          <MascotAvatar size="sm" reaction={getHomeReaction(h.streak)} showBorder={false} />
        </div>
        <h1
          className="mt-1.5"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: '-0.012em',
            color: 'var(--color-foreground)',
          }}
        >
          안녕하세요
        </h1>
        <p
          className="text-[15px] mt-0.5"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {h.user?.nickname || '학습자'}님 · Lv.{h.level} {h.levelInfo.name}
        </p>
      </m.div>

      {/* Hero CTA card */}
      <div
        className="mx-4 mt-3 rounded-2xl overflow-hidden"
        style={{ background: 'var(--color-card)' }}
      >
        <div className="p-4">
          <p
            className="text-[13px] font-semibold uppercase tracking-tight"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            오늘 학습
          </p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span
              className="font-bold"
              style={{
                fontSize: 28,
                letterSpacing: '-0.012em',
                color: 'var(--color-foreground)',
              }}
            >
              {sessionProgress}
            </span>
            <span style={{ fontSize: 15, color: 'var(--color-text-secondary)' }}>
              / {QUESTIONS_PER_SESSION} 단어
            </span>
          </div>
          {/* progress dots */}
          <div className="flex gap-[3px] mt-2.5">
            {Array.from({ length: QUESTIONS_PER_SESSION }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1.5 rounded-sm"
                style={{
                  background:
                    i < sessionProgress
                      ? 'var(--color-primary)'
                      : 'rgba(60,60,67,0.12)',
                }}
              />
            ))}
          </div>
          <div className="mt-3.5">
            <QuizTypeQuickPick />
          </div>
          <button
            onClick={() => navigate('/learn', hasSaved ? { state: { resume: true } } : {})}
            className="mt-3 w-full rounded-xl flex items-center justify-center gap-2 font-semibold"
            style={{
              height: 50,
              background: 'var(--color-primary)',
              color: '#FFFFFF',
              fontSize: 17,
            }}
          >
            <Play className="w-4 h-4 fill-current" />
            {hasSaved ? '학습 이어하기' : '학습 시작'}
          </button>
        </div>
      </div>

      {/* 학습 현황 group */}
      <GroupHead>학습 현황</GroupHead>
      <div
        className="mx-4 rounded-xl overflow-hidden"
        style={{ background: 'var(--color-card)' }}
      >
        <GroupRow onClick={() => navigate('/stats')}>
          <div
            className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center mr-3"
            style={{ background: 'var(--color-primary)' }}
          >
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="flex-1" style={{ color: 'var(--color-foreground)' }}>
            연속 학습
          </span>
          <span className="mr-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            {h.streak}일
          </span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--color-text-tertiary)' }} />
        </GroupRow>
        <GroupRow onClick={() => navigate('/stats')}>
          <div
            className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center mr-3"
            style={{ background: 'var(--color-primary)' }}
          >
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="flex-1" style={{ color: 'var(--color-foreground)' }}>
            경험치
          </span>
          <span className="mr-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            {h.xp} XP
          </span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--color-text-tertiary)' }} />
        </GroupRow>
        {h.wrongWordIds.length > 0 && (
          <GroupRow last onClick={() => navigate('/wrong-words')}>
            <div
              className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center mr-3"
              style={{ background: '#FF9500' }}
            >
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="flex-1" style={{ color: 'var(--color-foreground)' }}>
              오답 단어
            </span>
            <span className="mr-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              {h.wrongWordIds.length}개
            </span>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--color-text-tertiary)' }} />
          </GroupRow>
        )}
      </div>

      {/* 이번 주 */}
      <GroupHead>이번 주</GroupHead>
      <div
        className="mx-4 rounded-xl px-3 py-3.5"
        style={{ background: 'var(--color-card)' }}
      >
        <div className="flex justify-between">
          {days.map((c) => (
            <div key={c.n} className="flex-1 flex flex-col items-center gap-1.5">
              <span
                className="text-[11px] font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {c.d}
              </span>
              <div
                className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[13px]"
                style={{
                  background: c.active ? 'var(--color-primary)' : 'transparent',
                  color: c.active ? '#FFFFFF' : 'var(--color-foreground)',
                  fontWeight: c.active ? 700 : 500,
                }}
              >
                {c.n}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 더 보기 */}
      <GroupHead>더 보기</GroupHead>
      <div
        className="mx-4 rounded-xl overflow-hidden"
        style={{ background: 'var(--color-card)' }}
      >
        <GroupRow onClick={() => navigate('/kanji')}>
          <Sparkles className="w-5 h-5 mr-3" style={{ color: '#FFCC00' }} />
          <span className="flex-1" style={{ color: 'var(--color-foreground)' }}>
            한자 카드 학습
          </span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--color-text-tertiary)' }} />
        </GroupRow>
        <GroupRow onClick={() => navigate('/reading')}>
          <BookText className="w-5 h-5 mr-3" style={{ color: 'var(--color-primary)' }} />
          <span className="flex-1" style={{ color: 'var(--color-foreground)' }}>
            짧은 글 읽기
          </span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--color-text-tertiary)' }} />
        </GroupRow>
        <GroupRow onClick={() => navigate('/songs')}>
          <Music className="w-5 h-5 mr-3" style={{ color: '#FF9500' }} />
          <span className="flex-1" style={{ color: 'var(--color-foreground)' }}>
            동요로 배우기
          </span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--color-text-tertiary)' }} />
        </GroupRow>
        <GroupRow onClick={() => navigate('/writing')}>
          <PenLine className="w-5 h-5 mr-3" style={{ color: 'var(--color-primary)' }} />
          <span className="flex-1" style={{ color: 'var(--color-foreground)' }}>
            AI 작문 첨삭
          </span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--color-text-tertiary)' }} />
        </GroupRow>
        <GroupRow onClick={() => navigate('/mock')}>
          <GraduationCap className="w-5 h-5 mr-3" style={{ color: '#5856D6' }} />
          <span className="flex-1" style={{ color: 'var(--color-foreground)' }}>
            JLPT 모의고사
          </span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--color-text-tertiary)' }} />
        </GroupRow>
        <GroupRow onClick={() => navigate('/grammar')}>
          <BookOpen className="w-5 h-5 mr-3" style={{ color: '#34C759' }} />
          <span className="flex-1" style={{ color: 'var(--color-foreground)' }}>
            문법 학습
          </span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--color-text-tertiary)' }} />
        </GroupRow>
        <GroupRow onClick={() => navigate('/idioms')}>
          <Sparkles className="w-5 h-5 mr-3" style={{ color: '#FF9500' }} />
          <span className="flex-1" style={{ color: 'var(--color-foreground)' }}>
            관용구
          </span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--color-text-tertiary)' }} />
        </GroupRow>
        <GroupRow last onClick={() => navigate('/conversation')}>
          <BookOpen className="w-5 h-5 mr-3" style={{ color: 'var(--color-primary)' }} />
          <span className="flex-1" style={{ color: 'var(--color-foreground)' }}>
            회화 학습
          </span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--color-text-tertiary)' }} />
        </GroupRow>
      </div>

      <BottomNav />
      <FullCalendarModal open={h.showCalendarModal} onOpenChange={h.setShowCalendarModal} />
      <StreakRewardModal
        isOpen={h.streakRewardDays !== null}
        onClose={h.handleClaimStreak}
        days={h.streakRewardDays ?? 0}
      />
    </div>
  )
}
