// d4-editorial 테마 전용 홈 — 매거진 톤 (큰 세리프 인사, 거대 STREAK, 검은 학습 카드)
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { FullCalendarModal } from '@/components/FullCalendarModal'
import { StreakRewardModal } from '@/components/StreakRewardModal'
import { useHomeData, useWeekCalendar, getHomeReaction } from '@/hooks/useHomeData'
import { MascotAvatar } from '@/components/MascotAvatar'
import { QuizTypeQuickPick } from '@/components/QuizTypeQuickPick'
import { QUESTIONS_PER_SESSION } from '@/constants'

export function HomeEditorial() {
  const navigate = useNavigate()
  const h = useHomeData()
  const { days } = useWeekCalendar(h.lastStudyDate)

  const todayLabel = new Date()
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    .toUpperCase()

  const hasSaved = !!h.savedLearning && h.savedLearning.session.questionIndex < QUESTIONS_PER_SESSION

  return (
    <div className="min-h-screen pb-nav" style={{ background: 'var(--color-background)' }}>
      {/* 매거진 마스트헤드 */}
      <div className="pt-12 px-6 pb-3 flex items-center justify-between">
        <span
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{ color: 'var(--color-text-tertiary)', fontWeight: 600 }}
        >
          {todayLabel} · NIHONGO TIMES
        </span>
        <span
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{ color: 'var(--color-text-tertiary)', fontWeight: 600 }}
        >
          ISSUE 01
        </span>
      </div>

      {/* 큰 인사말 (두 줄, 세리프, 이름은 핑크 italic) */}
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-2 relative"
      >
        {/* 우상단 마스코트 */}
        <div className="absolute top-0 right-5">
          <MascotAvatar size="md" reaction={getHomeReaction(h.streak)} showBorder={false} />
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 56,
            fontWeight: 400,
            color: 'var(--color-foreground)',
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
          }}
        >
          안녕하세요,
          <br />
          <em style={{ color: 'var(--color-primary)', fontStyle: 'italic' }}>
            {h.user?.nickname || '학습자'}
            <span style={{ fontStyle: 'normal', fontSize: 36 }}> 님</span>
          </em>
        </h1>
        <p
          className="mt-3 text-sm leading-relaxed max-w-[280px]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Lv.{h.level} {h.levelInfo.name}
          {h.xpToNext > 0 && (
            <>
              {' '}— 다음 레벨까지{' '}
              <b style={{ color: 'var(--color-foreground)' }}>{h.xpToNext} XP</b> 남았어요.
            </>
          )}
        </p>
      </m.div>

      {/* STREAK - 거대 숫자 (상하 hairline) */}
      <m.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-8 px-6 py-5 border-y"
        style={{ borderColor: 'var(--color-border-light)' }}
      >
        <div className="flex items-end justify-between">
          <div>
            <p
              className="text-[10px] tracking-[0.18em] uppercase"
              style={{ color: 'var(--color-text-tertiary)', fontWeight: 600 }}
            >
              Streak
            </p>
            <p
              className="mt-1 flex items-baseline gap-1"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 96,
                fontWeight: 400,
                lineHeight: 0.85,
                color: 'var(--color-foreground)',
                letterSpacing: '-0.05em',
              }}
            >
              <span style={{ fontStyle: 'italic' }}>{h.streak}</span>
              <span style={{ fontSize: 22, color: 'var(--color-text-secondary)' }}>
                일째
              </span>
            </p>
          </div>
        </div>

        {/* 7일 미니 캘린더 (세리프) */}
        <div className="flex justify-between mt-5">
          {days.map((c) => (
            <div key={c.n} className="flex flex-col items-center gap-1">
              <span
                className="text-[9px] tracking-[0.1em] uppercase"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {c.d}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  fontWeight: c.active ? 500 : 400,
                  fontStyle: c.active ? 'italic' : 'normal',
                  color: c.active ? 'var(--color-primary)' : 'var(--color-foreground)',
                }}
              >
                {c.n}
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: c.active ? 'var(--color-primary)' : 'transparent',
                  border: c.active ? 'none' : '1px solid var(--color-text-tertiary)',
                }}
              />
            </div>
          ))}
        </div>
      </m.section>

      {/* EXPERIENCE - 미니멀 라인 */}
      <section className="px-6 pt-5">
        <div className="flex items-baseline justify-between">
          <span
            className="text-[10px] tracking-[0.18em] uppercase"
            style={{ color: 'var(--color-text-tertiary)', fontWeight: 600 }}
          >
            Experience
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontStyle: 'italic',
              color: 'var(--color-foreground)',
            }}
          >
            {h.xp}
            <span style={{ color: 'var(--color-text-tertiary)' }}>
              /{h.nextLevel?.minXP ?? h.xp}
            </span>
          </span>
        </div>
        <div
          className="h-0.5 mt-3 relative"
          style={{ background: 'var(--color-border-light)' }}
        >
          <m.div
            initial={{ width: 0 }}
            animate={{ width: `${h.progressPercent}%` }}
            transition={{ duration: 0.6 }}
            className="absolute -top-px h-1"
            style={{ background: 'var(--color-primary)' }}
          />
        </div>
      </section>

      {/* 학습 유형 chip row */}
      <section className="px-6 pt-6">
        <QuizTypeQuickPick />
      </section>

      {/* CTA - 매거진 스타일 검은 카드 */}
      <section className="px-6 pt-3">
        <m.button
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate('/learn', hasSaved ? { state: { resume: true } } : {})}
          className="w-full flex items-center justify-between text-left"
          style={{
            background: 'var(--color-foreground)',
            color: 'var(--color-background)',
            padding: '20px 18px',
            borderRadius: 0,
          }}
        >
          <div>
            <p
              className="text-[10px] tracking-[0.18em] uppercase"
              style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}
            >
              Continue
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 30,
                fontStyle: 'italic',
                lineHeight: 1,
                marginTop: 4,
              }}
            >
              학습 이어하기
            </p>
          </div>
          <div className="text-right">
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 38,
                lineHeight: 1,
              }}
            >
              {hasSaved ? h.savedLearning!.session.questionIndex : 0}
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 22 }}>
                /{QUESTIONS_PER_SESSION}
              </span>
            </p>
          </div>
        </m.button>

        {hasSaved && (
          <button
            onClick={() => {
              h.clearSavedLearning()
              navigate('/learn')
            }}
            className="mt-3 w-full py-3 text-sm border-t border-b"
            style={{
              borderColor: 'var(--color-text-secondary)',
              color: 'var(--color-foreground)',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 16,
            }}
          >
            새로 시작하기
          </button>
        )}

        {/* REVIEW - 매거진 row */}
        {h.wrongWordIds.length > 0 && (
          <m.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/wrong-words')}
            className="mt-3 w-full flex items-center justify-between py-4 border-t border-b"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="text-left">
              <p
                className="text-[10px] tracking-[0.18em] uppercase"
                style={{ color: 'var(--color-text-tertiary)', fontWeight: 600 }}
              >
                Review
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontStyle: 'italic',
                  lineHeight: 1,
                  marginTop: 2,
                  color: 'var(--color-foreground)',
                }}
              >
                틀린 단어{' '}
                <span style={{ color: 'var(--color-primary)' }}>
                  {h.wrongWordIds.length}
                </span>
              </p>
            </div>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-foreground)' }} />
          </m.button>
        )}

        {/* 매거진 row 진입 — 한자/문법/관용구/독해/동요/작문/모의고사 */}
        {[
          { label: 'Kanji', title: '한자 카드 학습', href: '/kanji' },
          { label: 'Grammar', title: '문법 학습', href: '/grammar' },
          { label: 'Idioms', title: '관용구', href: '/idioms' },
          { label: 'Reading', title: '짧은 글 읽기', href: '/reading' },
          { label: 'Songs', title: '동요로 배우기', href: '/songs' },
          { label: 'Writing', title: 'AI 작문 첨삭', href: '/writing' },
          { label: 'Mock Test', title: 'JLPT 모의고사', href: '/mock' },
        ].map((item) => (
          <button
            key={item.href}
            onClick={() => navigate(item.href)}
            className="mt-3 w-full flex items-center justify-between py-4 border-t border-b"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="text-left">
              <p
                className="text-[10px] tracking-[0.18em] uppercase"
                style={{ color: 'var(--color-text-tertiary)', fontWeight: 600 }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontStyle: 'italic',
                  lineHeight: 1,
                  marginTop: 2,
                  color: 'var(--color-foreground)',
                }}
              >
                {item.title}
              </p>
            </div>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-foreground)' }} />
          </button>
        ))}
      </section>

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
