// 여행 우선 홈 — 회화 상황을 메인 표면으로.
// homeLayoutId가 'auto'(기본값) 또는 'travel'일 때 렌더 (resolveHomeLayout 참고).
// useHomeData()를 그대로 사용해 streak·보상·이어하기·모달을 유지하고,
// 레이아웃만 여행 우선으로 구성한다 (JLPT 시절 위젯은 렌더하지 않음).
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { PlayCircle, BookOpen, ChevronRight, ChevronDown, Plane, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BottomNav } from '@/components/BottomNav'
import { FullCalendarModal } from '@/components/FullCalendarModal'
import { StreakRewardModal } from '@/components/StreakRewardModal'
import { useAppStore } from '@/store'
import { useHomeData } from '@/hooks/useHomeData'
import { getIconByName } from '@/lib/icon-map'
import { travelCategories, LEARN_ENTRIES } from '@/lib/homeEntries'
import { CONVERSATION_CATEGORIES } from '@/data/conversations'
import { QUESTIONS_PER_SESSION } from '@/constants'

export function HomeTravel() {
  const navigate = useNavigate()
  const h = useHomeData()
  const favoritePhrases = useAppStore((s) => s.favoritePhrases)
  const travelCats = travelCategories(CONVERSATION_CATEGORIES)
  const hasSaved =
    !!h.savedLearning &&
    h.savedLearning.session.questionIndex < QUESTIONS_PER_SESSION

  // 여행 회화 카테고리는 대표 4개만 먼저, 나머지는 펼치기로
  const [expanded, setExpanded] = useState(false)
  const PREVIEW_COUNT = 4
  const visibleCats = expanded
    ? travelCats
    : travelCats.slice(0, PREVIEW_COUNT)
  const hiddenCount = travelCats.length - PREVIEW_COUNT

  return (
    <div className="min-h-screen bg-background pb-nav">
      {/* 헤더 */}
      <div className="pt-12 px-5 pb-3 bg-gradient-to-b from-primary/10 to-background">
        <m.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Plane className="w-4 h-4 text-primary" />
            </div>
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              오늘의 일본어
            </span>
          </div>
          <h1 className="text-2xl font-bold leading-tight">
            안녕하세요,
            <br />
            {h.user?.nickname || '여행자'}님
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Lv.{h.level} {h.levelInfo.name} · 연속{' '}
            <span className="text-primary font-semibold">{h.streak}일</span>
          </p>
        </m.div>
      </div>

      <div className="px-5 mt-4 space-y-6">
        {/* 학습 이어하기 / 시작 */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2.5"
        >
          {hasSaved ? (
            <>
              <Button
                onClick={() => navigate('/learn', { state: { resume: true } })}
                className="w-full h-14 text-base font-semibold"
                size="lg"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                학습 이어하기 ({h.savedLearning!.session.questionIndex}/
                {QUESTIONS_PER_SESSION})
              </Button>
              <Button
                onClick={() => {
                  h.clearSavedLearning()
                  navigate('/learn')
                }}
                variant="outline"
                className="w-full h-11"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                새로 시작하기
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate('/learn')}
              className="w-full h-14 text-base font-semibold"
              size="lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              오늘의 학습 시작하기
            </Button>
          )}
        </m.div>

        {/* 여행 회화 상황 — 메인 hero */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-bold text-lg">여행 회화</h2>
            <button
              onClick={() => navigate('/conversation')}
              className="text-xs font-semibold text-primary inline-flex items-center gap-0.5"
            >
              전체 보기 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {visibleCats.map((cat, i) => {
              const Icon = getIconByName(cat.icon)
              return (
                <m.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % PREVIEW_COUNT) * 0.04 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="p-4 cursor-pointer hover:bg-primary/5 transition-colors"
                    onClick={() => navigate(`/conversation/${cat.id}`)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2.5">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-semibold text-sm">{cat.nameKo}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {cat.phrases.length}개 표현
                      </p>
                    </div>
                  </Card>
                </m.div>
              )
            })}
          </div>
          {hiddenCount > 0 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-full mt-3 flex items-center justify-center gap-1 py-2.5 rounded-xl text-sm font-semibold text-primary bg-primary/10"
            >
              {expanded ? '접기' : `여행 상황 ${hiddenCount}개 더 보기`}
              <m.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                <ChevronDown className="w-4 h-4" />
              </m.span>
            </button>
          )}
        </section>

        {/* 내 여행 키트 — 즐겨찾기 표현 바로가기 (현지에서 3뎁스 탐색 없이 진입) */}
        <m.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/conversation/memo', { state: { tab: 'phrases' } })}
          className="w-full"
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star
                    className={
                      favoritePhrases.length > 0
                        ? 'w-5 h-5 text-primary fill-primary'
                        : 'w-5 h-5 text-primary'
                    }
                  />
                </div>
                <div className="text-left">
                  <p className="font-semibold">내 여행 키트</p>
                  <p className="text-xs text-muted-foreground">
                    {favoritePhrases.length > 0
                      ? `표현 ${favoritePhrases.length}개 — 바로 꺼내 쓰세요`
                      : '회화 표현의 별을 탭해 내 문장을 모아보세요'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </m.button>

        {/* 틀린 단어 복습 */}
        {h.wrongWordIds.length > 0 && (
          <m.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => navigate('/wrong-words')}
            className="w-full"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                    📝
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">틀린 단어 복습</p>
                    <p className="text-xs text-muted-foreground">
                      {h.wrongWordIds.length}개 단어가 복습을 기다려요
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </m.button>
        )}

        {/* 더 배우기 — JLPT 학습 콘텐츠 */}
        <section>
          <h2 className="font-bold text-lg mb-3">더 배우기</h2>
          <div className="space-y-2">
            {LEARN_ENTRIES.map((entry, i) => {
              const Icon = getIconByName(entry.icon)
              return (
                <m.button
                  key={entry.href}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => navigate(entry.href)}
                  className="w-full flex items-center gap-3 rounded-2xl p-3.5 text-left border"
                  style={{
                    background: 'var(--color-card)',
                    borderColor: 'var(--color-border-light)',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--color-muted)' }}
                  >
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{entry.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {entry.sub}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </m.button>
              )
            })}
          </div>
        </section>
      </div>

      <BottomNav />

      <FullCalendarModal
        open={h.showCalendarModal}
        onOpenChange={h.setShowCalendarModal}
      />
      <StreakRewardModal
        isOpen={h.streakRewardDays !== null}
        onClose={h.handleClaimStreak}
        days={h.streakRewardDays ?? 0}
      />
    </div>
  )
}
