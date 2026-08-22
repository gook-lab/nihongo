import { useEffect, useState, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { Flame, Zap, BookOpen, ChevronRight, PlayCircle, Sparkles, BookText, Music, PenLine, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BottomNav } from '@/components/BottomNav'
import { WeekCalendar } from '@/components/WeekCalendar'
import { FullCalendarModal } from '@/components/FullCalendarModal'
import { FortuneCookieBanner } from '@/components/FortuneCookie'
import { DailyMissionWidget } from '@/components/DailyMissionWidget'
import { GoalProgressWidget } from '@/components/GoalProgressWidget'
import { QuizTypeQuickPick } from '@/components/QuizTypeQuickPick'
import { WeakWordsCard } from '@/components/WeakWordsCard'
const TodayWordsCard = lazy(() =>
  import('@/components/TodayWordsCard').then((m) => ({ default: m.TodayWordsCard })),
)
import { StreakRewardModal } from '@/components/StreakRewardModal'
import { MascotHeroCard } from '@/components/MascotHeroCard'
import { HomeEditorial } from '@/components/home/HomeEditorial'
import { HomeMono } from '@/components/home/HomeMono'
import { HomeIos } from '@/components/home/HomeIos'
import { HomeTravel } from '@/components/home/HomeTravel'
import { HomeLayoutPicker } from '@/components/HomeLayoutPicker'
import { MascotIntroTour } from '@/components/MascotIntroTour'
import { resolveHomeLayout } from '@/lib/homeLayout'
import { useAppStore } from '@/store'
import { getLevelInfo, getXPToNextLevel, LEVELS, QUESTIONS_PER_SESSION } from '@/constants'

export function HomePage() {
  const homeLayoutId = useAppStore((s) => s.homeLayoutId)
  const hasSeenIntroTour = useAppStore((s) => s.hasSeenIntroTour)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const isGuest = useAppStore((s) => s.isGuest)
  const [tourOpen, setTourOpen] = useState(false)

  // 로그인 후 첫 진입 시 인트로 투어 한 번 표시 (게스트는 제외)
  useEffect(() => {
    if (isAuthenticated && !isGuest && !hasSeenIntroTour) {
      // 약간의 지연 후 열기 (페이지 mount 후 마스코트 등 다른 요소 로드 후)
      const t = setTimeout(() => setTourOpen(true), 500)
      return () => clearTimeout(t)
    }
  }, [isAuthenticated, isGuest, hasSeenIntroTour])

  // 'auto'(기본값)는 여행 우선 홈으로, 그 외엔 사용자가 명시 선택한 레이아웃
  const effective = resolveHomeLayout(homeLayoutId)

  let content: React.ReactNode
  if (effective === 'travel') content = <HomeTravel />
  else if (effective === 'editorial') content = <HomeEditorial />
  else if (effective === 'mono') content = <HomeMono />
  else if (effective === 'ios') content = <HomeIos />
  else content = <HomeDefaultOrMascot forceMascot={effective === 'mascot'} />

  return (
    <>
      {content}
      <HomeLayoutPicker />
      <MascotIntroTour open={tourOpen} onClose={() => setTourOpen(false)} />
    </>
  )
}

// forceMascot은 layout 매핑(mascot) 식별용으로 유지 — 현재 동일 카드 사용으로 분기 없음
function HomeDefaultOrMascot(_props: { forceMascot?: boolean }) {
  const navigate = useNavigate()
  const {
    user,
    xp,
    level,
    streak,
    lastStudyDate,
    wrongWordIds,
    savedLearning,
    clearSavedLearning,
    unclaimedStreakMilestone,
    claimStreakMilestone,
  } = useAppStore()
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [streakRewardDays, setStreakRewardDays] = useState<number | null>(null)

  // 진입 시 미수령 스트릭 마일스톤이 있으면 모달 표시
  useEffect(() => {
    const pending = unclaimedStreakMilestone()
    if (pending !== null) {
      setStreakRewardDays(pending)
    }
  }, [unclaimedStreakMilestone, streak])

  const handleClaimStreak = () => {
    if (streakRewardDays !== null) {
      claimStreakMilestone(streakRewardDays)
      setStreakRewardDays(null)
    }
  }

  const levelInfo = getLevelInfo(level)
  const xpToNext = getXPToNextLevel(xp, level)
  const nextLevel = LEVELS.find((l) => l.level === level + 1)
  const progressPercent = nextLevel
    ? ((xp - levelInfo.minXP) / (nextLevel.minXP - levelInfo.minXP)) * 100
    : 100

  const isGuest = useAppStore((s) => s.isGuest)
  const handleStartLearning = () => {
    if (isGuest) {
      // 게스트는 학습 진행 시 로그인 권유
      navigate('/login?returnTo=/learn')
      return
    }
    navigate('/learn')
  }

  // 모든 테마에서 동일한 마스코트 hero 카드 사용 (큰 마스코트 + 말풍선)
  // (forceMascot은 mascot 레이아웃 ID 호환을 위해 유지)

  return (
    <div className="min-h-screen bg-background pb-nav">
      <div className="pt-12 px-5">
        <MascotHeroCard
          userName={user?.nickname || '학습자'}
          level={level}
          streak={streak}
        />
      </div>

      <div className="px-5 space-y-4 mt-4">
        {/* 포츈쿠키 배너 */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <FortuneCookieBanner />
        </m.div>

        {/* 오늘의 미션 */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <DailyMissionWidget />
        </m.div>

        {/* 학습 목표 위젯 */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.09 }}
        >
          <GoalProgressWidget />
        </m.div>

        {/* 오늘의 단어 5개 — SRS due 우선 큐레이션 (lazy chunk) */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Suspense fallback={null}>
            <TodayWordsCard />
          </Suspense>
        </m.div>

        {/* 약점 단어 집중 학습 — 약점 있을 때만 자동 표시 */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <WeakWordsCard />
        </m.div>

        {/* 주간 캘린더 카드 */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-semibold">학습 캘린더</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  연속 <span className="font-bold text-primary">{streak}일</span>
                </div>
              </div>
              <WeekCalendar
                lastStudyDate={lastStudyDate}
                onClick={() => setShowCalendarModal(true)}
              />
            </CardContent>
          </Card>
        </m.div>

        {/* XP 프로그레스 카드 */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span className="font-semibold">경험치</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{levelInfo.name}</span>
                  {nextLevel && (
                    <span className="text-muted-foreground">{nextLevel.name}</span>
                  )}
                </div>
                <Progress value={progressPercent} className="h-3" />
                <p className="text-center text-sm text-muted-foreground">
                  {xpToNext > 0 ? (
                    <>
                      다음 레벨까지{' '}
                      <span className="font-semibold text-foreground">
                        {xpToNext} XP
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold text-primary">
                      최고 레벨 달성!
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </m.div>

        {/* 학습 유형 빠른 선택 */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <QuizTypeQuickPick />
        </m.div>

        {/* 이어하기 or 오늘의 학습 버튼 */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {savedLearning && savedLearning.session.questionIndex < QUESTIONS_PER_SESSION ? (
            <>
              <Button
                onClick={() => navigate('/learn', { state: { resume: true } })}
                className="w-full h-14 text-lg font-semibold"
                size="lg"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                학습 이어하기 ({savedLearning.session.questionIndex}/{QUESTIONS_PER_SESSION})
              </Button>
              <Button
                onClick={() => {
                  clearSavedLearning()
                  handleStartLearning()
                }}
                variant="outline"
                className="w-full h-12"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                새로 시작하기
              </Button>
            </>
          ) : (
            <Button
              onClick={handleStartLearning}
              className="w-full h-14 text-lg font-semibold"
              size="lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              오늘의 학습 시작하기
            </Button>
          )}
        </m.div>

        {/* 콘텐츠 학습 카드 — 한자/짧은글/동요 */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-3 gap-2"
        >
          <button
            onClick={() => navigate('/kanji')}
            className="rounded-2xl p-3 text-left transition-transform active:scale-[0.97]"
            style={{ background: 'var(--color-sakura-100)' }}
          >
            <div className="w-9 h-9 rounded-full bg-card flex items-center justify-center mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <p className="font-semibold text-sm">한자 카드</p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
              JLPT N5~N3
            </p>
          </button>
          <button
            onClick={() => navigate('/reading')}
            className="rounded-2xl p-3 text-left transition-transform active:scale-[0.97]"
            style={{ background: 'var(--color-sakura-100)' }}
          >
            <div className="w-9 h-9 rounded-full bg-card flex items-center justify-center mb-2">
              <BookText className="w-4 h-4 text-primary" />
            </div>
            <p className="font-semibold text-sm">짧은 글</p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
              독해 연습
            </p>
          </button>
          <button
            onClick={() => navigate('/songs')}
            className="rounded-2xl p-3 text-left transition-transform active:scale-[0.97]"
            style={{ background: 'var(--color-sakura-100)' }}
          >
            <div className="w-9 h-9 rounded-full bg-card flex items-center justify-center mb-2">
              <Music className="w-4 h-4 text-primary" />
            </div>
            <p className="font-semibold text-sm">동요</p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
              가사로 배우기
            </p>
          </button>
          <button
            onClick={() => navigate('/writing')}
            className="rounded-2xl p-3 text-left transition-transform active:scale-[0.97]"
            style={{ background: 'var(--color-sakura-100)' }}
          >
            <div className="w-9 h-9 rounded-full bg-card flex items-center justify-center mb-2">
              <PenLine className="w-4 h-4 text-primary" />
            </div>
            <p className="font-semibold text-sm">AI 작문</p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
              첨삭 받기
            </p>
          </button>
          <button
            onClick={() => navigate('/mock')}
            className="rounded-2xl p-3 text-left transition-transform active:scale-[0.97]"
            style={{ background: 'var(--color-sakura-100)' }}
          >
            <div className="w-9 h-9 rounded-full bg-card flex items-center justify-center mb-2">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            <p className="font-semibold text-sm">모의고사</p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
              JLPT 시험
            </p>
          </button>
          <button
            onClick={() => navigate('/grammar')}
            className="rounded-2xl p-3 text-left transition-transform active:scale-[0.97]"
            style={{ background: 'var(--color-sakura-100)' }}
          >
            <div className="w-9 h-9 rounded-full bg-card flex items-center justify-center mb-2">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <p className="font-semibold text-sm">문법</p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
              N5~N3 핵심
            </p>
          </button>
          <button
            onClick={() => navigate('/idioms')}
            className="rounded-2xl p-3 text-left transition-transform active:scale-[0.97]"
            style={{ background: 'var(--color-sakura-100)' }}
          >
            <div className="w-9 h-9 rounded-full bg-card flex items-center justify-center mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <p className="font-semibold text-sm">관용구</p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
              일상 표현
            </p>
          </button>
        </m.div>

        {/* 오답 노트 카드 */}
        {wrongWordIds.length > 0 && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-0">
                <button
                  onClick={() => navigate('/wrong-words')}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg">📝</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        틀린 단어 복습하기
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {wrongWordIds.length}개의 단어가 복습을 기다려요
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </CardContent>
            </Card>
          </m.div>
        )}
      </div>

      <BottomNav />

      {/* 풀 캘린더 모달 */}
      <FullCalendarModal
        open={showCalendarModal}
        onOpenChange={setShowCalendarModal}
      />

      {/* 스트릭 마일스톤 보상 모달 */}
      <StreakRewardModal
        isOpen={streakRewardDays !== null}
        onClose={handleClaimStreak}
        days={streakRewardDays ?? 0}
      />
    </div>
  )
}
