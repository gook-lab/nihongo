// d2-mono 테마 전용 홈 — 모노 톤 + 검은 streak 배너 + 핑크 액센트
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { Flame, ChevronRight, BookOpen, Plus, BookText, Music, PenLine, GraduationCap } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { FullCalendarModal } from '@/components/FullCalendarModal'
import { StreakRewardModal } from '@/components/StreakRewardModal'
import { DailyMissionWidget } from '@/components/DailyMissionWidget'
import { FortuneCookieBanner } from '@/components/FortuneCookie'
import { useHomeData, useWeekCalendar, getHomeReaction } from '@/hooks/useHomeData'
import { MascotAvatar } from '@/components/MascotAvatar'
import { QuizTypeQuickPick } from '@/components/QuizTypeQuickPick'
import { QUESTIONS_PER_SESSION } from '@/constants'

export function HomeMono() {
  const navigate = useNavigate()
  const h = useHomeData()
  const { days } = useWeekCalendar(h.lastStudyDate)
  const hasSaved = !!h.savedLearning && h.savedLearning.session.questionIndex < QUESTIONS_PER_SESSION

  return (
    <div className="min-h-screen pb-nav" style={{ background: 'var(--color-background)' }}>
      {/* hero — 매거진 라벨 + 큰 인사 */}
      <m.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-14 px-6 pb-4 relative"
      >
        <p
          className="text-[11px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--color-text-tertiary)', fontWeight: 600 }}
        >
          오늘의 학습
        </p>
        <h1
          className="mt-2 text-[28px] font-extrabold leading-[1.15]"
          style={{ color: 'var(--color-foreground)', letterSpacing: '-0.025em' }}
        >
          안녕하세요,
          <br />
          {h.user?.nickname || '학습자'}님
        </h1>
        {/* 우상단 마스코트 — 시간/스트릭 기반 reaction */}
        <div className="absolute top-12 right-5">
          <MascotAvatar size="md" reaction={getHomeReaction(h.streak)} showBorder={false} />
        </div>
        <div
          className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border"
          style={{
            background: 'var(--color-card)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--color-primary)' }}
          />
          <span
            className="text-[11px] font-semibold"
            style={{ color: 'var(--color-foreground)' }}
          >
            Lv.{h.level} · {h.levelInfo.name}
          </span>
        </div>
      </m.div>

      {/* STREAK 배너 — 잉크 블랙 카드 */}
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mx-6 rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'var(--color-foreground)', color: '#FFFFFF' }}
      >
        <div className="flex justify-between items-start">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.12em]"
              style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}
            >
              연속 학습
            </p>
            <p
              className="mt-1 font-extrabold leading-none flex items-baseline gap-1.5"
              style={{ fontSize: 48, letterSpacing: '-0.04em' }}
            >
              {h.streak}
              <span
                className="text-base font-semibold"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                일째
              </span>
            </p>
          </div>
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,45,111,0.18)' }}
          >
            <Flame className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          </div>
        </div>
        {/* 미니 캘린더 dots */}
        <div className="flex justify-between gap-1 mt-4">
          {days.map((c) => (
            <div key={c.n} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {c.d}
              </span>
              <span
                className="w-5.5 h-5.5 rounded-full flex items-center justify-center text-[11px] font-bold"
                style={{
                  width: 22,
                  height: 22,
                  background: c.active ? 'var(--color-primary)' : 'rgba(255,255,255,0.08)',
                  color: c.active ? 'var(--color-foreground)' : 'rgba(255,255,255,0.85)',
                }}
              >
                {c.n}
              </span>
            </div>
          ))}
        </div>
      </m.div>

      {/* XP 미니멀 */}
      <div className="mx-6 mt-4">
        <div className="flex justify-between items-baseline mb-2">
          <span
            className="text-[10px] uppercase tracking-[0.12em]"
            style={{ color: 'var(--color-text-tertiary)', fontWeight: 600 }}
          >
            경험치
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {h.xp} / {h.nextLevel?.minXP ?? h.xp} XP
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: 'var(--color-border)' }}
        >
          <m.div
            initial={{ width: 0 }}
            animate={{ width: `${h.progressPercent}%` }}
            transition={{ duration: 0.6 }}
            className="h-full"
            style={{ background: 'var(--color-primary)' }}
          />
        </div>
      </div>

      {/* 학습 유형 chip row */}
      <div className="px-6 mt-4">
        <QuizTypeQuickPick />
      </div>

      {/* CTA - 모노 검정 */}
      <div className="px-6 mt-3">
        <button
          onClick={() => navigate('/learn', hasSaved ? { state: { resume: true } } : {})}
          className="w-full flex items-center justify-between rounded-2xl px-5 text-base font-bold"
          style={{
            height: 56,
            background: 'var(--color-foreground)',
            color: '#FFFFFF',
          }}
        >
          <span>{hasSaved ? '학습 이어하기' : '오늘의 학습 시작'}</span>
          <span
            className="inline-flex items-center gap-2 text-xs"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            {hasSaved
              ? `${h.savedLearning!.session.questionIndex}/${QUESTIONS_PER_SESSION}`
              : ''}
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </button>
        {hasSaved && (
          <button
            onClick={() => {
              h.clearSavedLearning()
              navigate('/learn')
            }}
            className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-2xl text-sm font-semibold border"
            style={{
              height: 48,
              borderColor: 'var(--color-foreground)',
              color: 'var(--color-foreground)',
            }}
          >
            <Plus className="w-4 h-4" />
            새로 시작하기
          </button>
        )}
      </div>

      {/* 일일 미션 */}
      <div className="px-6 mt-4">
        <DailyMissionWidget />
      </div>

      {/* 인라인 카드 행 */}
      <div className="px-6 mt-3 space-y-2.5">
        {h.wrongWordIds.length > 0 && (
          <button
            onClick={() => navigate('/wrong-words')}
            className="w-full flex items-center gap-3 rounded-2xl p-3.5 text-left border"
            style={{
              background: 'var(--color-card)',
              borderColor: 'var(--color-border-light)',
            }}
          >
            <div
              className="w-1 h-9 rounded"
              style={{ background: 'var(--color-primary)' }}
            />
            <div className="flex-1">
              <p
                className="text-[13px] font-bold"
                style={{ color: 'var(--color-foreground)' }}
              >
                틀린 단어 복습
              </p>
              <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                {h.wrongWordIds.length}개 단어 대기 중
              </p>
            </div>
            <ChevronRight
              className="w-4 h-4"
              style={{ color: 'var(--color-text-tertiary)' }}
            />
          </button>
        )}

        {[
          { href: '/kanji', title: '한자 카드 학습', sub: 'JLPT N5~N3', Icon: BookOpen },
          { href: '/grammar', title: '문법 학습', sub: 'N5~N3 핵심 91개', Icon: BookOpen },
          { href: '/idioms', title: '관용구', sub: '일상 비유 표현', Icon: BookText },
          { href: '/reading', title: '짧은 글 읽기', sub: '독해 연습', Icon: BookText },
          { href: '/songs', title: '동요로 배우기', sub: 'Public Domain 가사', Icon: Music },
          { href: '/writing', title: 'AI 작문 첨삭', sub: 'Gemini 채점·교정', Icon: PenLine },
          { href: '/mock', title: 'JLPT 모의고사', sub: '시간 제한 30문제', Icon: GraduationCap },
        ].map(({ href, title, sub, Icon }) => (
          <button
            key={href}
            onClick={() => navigate(href)}
            className="w-full flex items-center gap-3 rounded-2xl p-3.5 text-left border"
            style={{
              background: 'var(--color-card)',
              borderColor: 'var(--color-border-light)',
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--color-muted)' }}
            >
              <Icon className="w-4 h-4" style={{ color: 'var(--color-foreground)' }} />
            </div>
            <div className="flex-1">
              <p
                className="text-[13px] font-bold"
                style={{ color: 'var(--color-foreground)' }}
              >
                {title}
              </p>
              <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                {sub}
              </p>
            </div>
            <ChevronRight
              className="w-4 h-4"
              style={{ color: 'var(--color-text-tertiary)' }}
            />
          </button>
        ))}

        <FortuneCookieBanner />
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
