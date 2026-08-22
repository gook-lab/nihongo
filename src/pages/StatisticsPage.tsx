import { useState } from 'react'
import { m } from 'framer-motion'
import { Flame, Target, BookX, TrendingUp, BarChart3, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BottomNav } from '@/components/BottomNav'
import { PageHeader } from '@/components/PageHeader'
import { WrongWordsList } from '@/components/WrongWordsList'
import { WeaknessChart } from '@/components/WeaknessChart'
import { HeatmapCalendar } from '@/components/HeatmapCalendar'
import { JLPTMastery } from '@/components/JLPTMastery'
import { SrsDashboard } from '@/components/SrsDashboard'
import { LevelShowcaseCard } from '@/components/LevelShowcaseCard'
import { LevelJourneyDialog } from '@/components/LevelJourneyDialog'
import { SelectedBadgeStrip } from '@/components/SelectedBadgeStrip'
import { DayCompareCard } from '@/components/DayCompareCard'
import { LearningTrendChart } from '@/components/LearningTrendChart'
import { generateInsightsFromState } from '@/lib/insights'
import { useAppStore } from '@/store'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function StatisticsPage() {
  const { xp, streak, wrongWordIds, wordSrs } = useAppStore()
  const dailyRecords = useAppStore((s) => s.dailyRecords)
  const level = useAppStore((s) => s.level)
  const insights = generateInsightsFromState({
    dailyRecords,
    wordSrs,
    streak,
    xp,
    level,
  })
  const [showLevelJourney, setShowLevelJourney] = useState(false)

  // 실제 SRS 기반 정답률 (리뷰 기록이 없으면 null)
  const srsStates = Object.values(wordSrs)
  const totalReviews = srsStates.reduce((sum, s) => sum + s.reviewCount, 0)
  const totalCorrect = srsStates.reduce((sum, s) => sum + s.correctCount, 0)
  const actualAccuracy =
    totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : null

  // LevelShowcaseCard가 내부에서 level/xp 계산 — 페이지 레벨 계산 제거됨

  // 예상 학습 세션 수 (정답 1개당 10XP 기준)
  const estimatedSessions = Math.ceil(xp / 200) // 20문제 * 10XP = 200XP per session

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader title="통계" subtitle="나의 학습 현황" icon={BarChart3} />

      {/* 선택한 뱃지 — 통계 페이지 헤더 아래 */}
      <div className="px-5 mt-1 mb-2">
        <SelectedBadgeStrip size={28} showEmptyCta />
      </div>

      <m.div
        className="px-5 space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 레벨 & XP — share/Level Badges.html E. Showcase 디자인 */}
        <m.div variants={itemVariants} className="relative">
          <LevelShowcaseCard onClick={() => setShowLevelJourney(true)} />
          {/* 우상단 Info 버튼 — 동일 LevelJourneyDialog 호출 (카드 클릭과 같은 동작) */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowLevelJourney(true)
            }}
            className="absolute top-3 right-3 p-1.5 rounded-full transition-colors z-10"
            style={{ background: 'rgba(255,255,255,0.08)' }}
            aria-label="레벨 여정 보기"
          >
            <Info className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.7)' }} />
          </button>
        </m.div>

        {/* 어제 vs 오늘 비교 — 데이터 없으면 자동 숨김 */}
        <m.div variants={itemVariants}>
          <DayCompareCard />
        </m.div>

        {/* 최근 7일 트렌드 차트 */}
        <m.div variants={itemVariants}>
          <LearningTrendChart />
        </m.div>

        {/* 학습 인사이트 — 자연어 요약 카드 */}
        {insights.length > 0 && (
          <m.div variants={itemVariants}>
            <Card>
              <CardContent className="p-4 space-y-2.5">
                <p className="type-eyebrow">학습 인사이트</p>
                <ul className="space-y-2">
                  {insights.map((i) => (
                    <li key={i.id} className="flex items-start gap-2 text-sm leading-relaxed">
                      <span className="text-base shrink-0">{i.emoji}</span>
                      <span>{i.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </m.div>
        )}

        {/* 통계 그리드 */}
        <m.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          {/* 연속 학습 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Flame className="w-8 h-8 text-primary mb-2" />
                <p className="text-3xl font-bold">{streak}</p>
                <p className="text-sm text-muted-foreground">연속 학습일</p>
              </div>
            </CardContent>
          </Card>

          {/* 예상 학습 횟수 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-3xl font-bold">{estimatedSessions}</p>
                <p className="text-sm text-muted-foreground">예상 학습 횟수</p>
              </div>
            </CardContent>
          </Card>

          {/* 실제 정답률 (SRS 누적 기반) */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Target className="w-8 h-8 text-primary mb-2" />
                <p className="text-3xl font-bold">
                  {actualAccuracy === null ? '-' : `${actualAccuracy}%`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {actualAccuracy === null ? '학습 시작 전' : `정답률 (${totalReviews}회)`}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 오답 단어 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <BookX className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-3xl font-bold">{wrongWordIds.length}</p>
                <p className="text-sm text-muted-foreground">오답 단어</p>
              </div>
            </CardContent>
          </Card>
        </m.div>

        {/* 월간 히트맵 */}
        <m.div variants={itemVariants}>
          <HeatmapCalendar />
        </m.div>

        {/* JLPT 마스터리 */}
        <m.div variants={itemVariants}>
          <JLPTMastery />
        </m.div>

        {/* SRS Adaptive 대시보드 — 복습 큐 / 망각 위험 / 평균 지표 */}
        <m.div variants={itemVariants}>
          <SrsDashboard />
        </m.div>

        {/* 약점 분석 */}
        <m.div variants={itemVariants}>
          <WeaknessChart />
        </m.div>

        {/* 오답 노트 */}
        {wrongWordIds.length > 0 && (
          <m.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookX className="w-5 h-5 text-red-500" />
                  오답 노트
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WrongWordsList wordIds={wrongWordIds} />
              </CardContent>
            </Card>
          </m.div>
        )}

      </m.div>

      {/* 레벨 여정 다이얼로그 — 카드 클릭 / Info 버튼 모두 호출 */}
      <LevelJourneyDialog open={showLevelJourney} onOpenChange={setShowLevelJourney} />

      <BottomNav />
    </div>
  )
}
