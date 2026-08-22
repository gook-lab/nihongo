import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { ChevronLeft, ChevronRight, Flame, BookOpen, Trophy, CheckCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppStore, type DailyRecord } from '@/store'
import { cn } from '@/lib/utils'

interface FullCalendarModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export function FullCalendarModal({ open, onOpenChange }: FullCalendarModalProps) {
  const navigate = useNavigate()
  const { streak, dailyRecords, getDailyRecord } = useAppStore()

  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showDayDetail, setShowDayDetail] = useState(false)

  // 월 이동
  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1)
      setCurrentMonth(12)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1)
      setCurrentMonth(1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // 달력 데이터 생성
  const getCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth - 1, 1)
    const lastDay = new Date(currentYear, currentMonth, 0)
    const startDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const days: (number | null)[] = []

    // 이전 달의 빈 칸
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null)
    }

    // 현재 달의 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const formatDateKey = (day: number) => {
    return `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() + 1 &&
      currentYear === today.getFullYear()
    )
  }

  const hasStudyRecord = (day: number) => {
    const dateKey = formatDateKey(day)
    return !!dailyRecords[dateKey]
  }

  const handleDayClick = (day: number) => {
    const dateKey = formatDateKey(day)
    setSelectedDate(dateKey)
    setShowDayDetail(true)
  }

  const handleNavigateToWrongWords = () => {
    onOpenChange(false)
    setShowDayDetail(false)
    navigate('/wrong-words')
  }

  const handleNavigateToLearn = () => {
    onOpenChange(false)
    setShowDayDetail(false)
    navigate('/learn')
  }

  const calendarDays = getCalendarDays()
  const selectedRecord = selectedDate ? getDailyRecord(selectedDate) : null

  // 이번 달 학습일 수
  const monthStudyDays = Object.keys(dailyRecords).filter((date) =>
    date.startsWith(`${currentYear}-${String(currentMonth).padStart(2, '0')}`)
  ).length

  // 다음 달로 이동 가능 여부 (미래로는 못 감)
  const canGoNext = !(
    currentYear === today.getFullYear() && currentMonth === today.getMonth() + 1
  )

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100vw-32px)] max-w-[400px] max-h-[85vh] overflow-y-auto p-0">
          <div className="p-5">
            {/* 헤더: 년/월 네비게이션 */}
            <div className="flex items-center justify-between mb-6">
              <m.button
                whileTap={{ scale: 0.9 }}
                onClick={goToPrevMonth}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </m.button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">{currentYear}</p>
                <p className="text-4xl font-bold">{currentMonth}</p>
              </div>

              <m.button
                whileTap={{ scale: 0.9 }}
                onClick={goToNextMonth}
                disabled={!canGoNext}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  canGoNext ? "hover:bg-muted" : "opacity-30 cursor-not-allowed"
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </m.button>
            </div>

            {/* 통계 카드 */}
            <Card className="mb-5">
              <CardContent className="p-4">
                <div className="flex justify-around">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">연속 학습일</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Flame className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-2xl font-bold">{streak}</span>
                    </div>
                  </div>
                  <div className="w-px bg-border" />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">이번 달 학습</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-2xl font-bold">{monthStudyDays}일</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 달력 그리드 */}
            <Card>
              <CardContent className="p-4">
                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {DAYS.map((day, i) => (
                    <div
                      key={i}
                      className={cn(
                        'text-center text-xs font-medium py-2',
                        i === 0 && 'text-primary/70',
                        i === 6 && 'text-primary/70'
                      )}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* 날짜 그리드 */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={index} className="aspect-square" />
                    }

                    const studied = hasStudyRecord(day)
                    const todayFlag = isToday(day)
                    const dayOfWeek = (new Date(currentYear, currentMonth - 1, day)).getDay()

                    return (
                      <m.button
                        key={index}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDayClick(day)}
                        className={cn(
                          'aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all relative',
                          todayFlag && 'ring-2 ring-primary ring-offset-2',
                          studied && 'bg-primary/15 text-primary',
                          !studied && (dayOfWeek === 0 || dayOfWeek === 6) && 'text-muted-foreground',
                          'hover:bg-muted active:bg-muted/80'
                        )}
                      >
                        {day}
                        {studied && (
                          <m.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary"
                          />
                        )}
                      </m.button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 이번 달 기록 (메달) */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">이번 달 기록</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {monthStudyDays >= 7 ? '브론즈 달성!' : `브론즈까지 ${7 - monthStudyDays}일`}
                </span>
              </div>
              <Card>
                <CardContent className="py-4 px-2">
                  <div className="flex justify-around items-center">
                    <MedalIcon type="bronze" achieved={monthStudyDays >= 7} />
                    <MedalIcon type="silver" achieved={monthStudyDays >= 14} />
                    <MedalIcon type="gold" achieved={monthStudyDays >= 21} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 날짜 상세 팝업 */}
      <DayDetailDialog
        open={showDayDetail}
        onOpenChange={setShowDayDetail}
        date={selectedDate}
        record={selectedRecord}
        onNavigateToWrongWords={handleNavigateToWrongWords}
        onNavigateToLearn={handleNavigateToLearn}
      />
    </>
  )
}

// 메달 아이콘 컴포넌트
function MedalIcon({ type, achieved }: { type: 'bronze' | 'silver' | 'gold'; achieved: boolean }) {
  const config = {
    bronze: {
      gradient: achieved
        ? 'from-primary/80 to-primary'
        : 'from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600',
      icon: achieved ? 'text-white' : 'text-gray-400 dark:text-gray-500',
      label: '7일',
      glow: achieved ? 'shadow-[0_0_16px_rgba(255,90,95,0.3)]' : '',
    },
    silver: {
      gradient: achieved
        ? 'from-primary/60 to-primary/80'
        : 'from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600',
      icon: achieved ? 'text-white' : 'text-gray-400 dark:text-gray-500',
      label: '14일',
      glow: achieved ? 'shadow-[0_0_16px_rgba(255,90,95,0.4)]' : '',
    },
    gold: {
      gradient: achieved
        ? 'from-primary to-primary/70'
        : 'from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600',
      icon: achieved ? 'text-white' : 'text-gray-400 dark:text-gray-500',
      label: '21일',
      glow: achieved ? 'shadow-[0_0_16px_rgba(255,90,95,0.5)]' : '',
    },
  }

  const { gradient, icon, label, glow } = config[type]

  return (
    <m.div
      initial={false}
      animate={{ scale: achieved ? 1 : 0.9, opacity: achieved ? 1 : 0.6 }}
      className="flex flex-col items-center gap-2"
    >
      <div className={cn(
        'w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br transition-all',
        gradient,
        glow
      )}>
        <Trophy className={cn('w-6 h-6', icon)} />
      </div>
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
    </m.div>
  )
}

// 날짜 상세 다이얼로그
interface DayDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: string | null
  record: DailyRecord | null
  onNavigateToWrongWords: () => void
  onNavigateToLearn: () => void
}

function DayDetailDialog({
  open,
  onOpenChange,
  date,
  record,
  onNavigateToWrongWords,
  onNavigateToLearn,
}: DayDetailDialogProps) {
  if (!date) return null

  const [year, month, day] = date.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  const isToday = dateObj.toDateString() === new Date().toDateString()
  const isFuture = dateObj > new Date()

  const accuracy = record
    ? Math.round((record.correctCount / record.totalCount) * 100)
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-32px)] max-w-[360px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {year}년 {month}월 {day}일
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {isFuture ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <span className="text-3xl">🔮</span>
              </div>
              <p className="text-muted-foreground">아직 다가오지 않은 날이에요</p>
            </div>
          ) : record ? (
            <>
              {/* 어휘 학습 */}
              <m.button
                whileTap={{ scale: 0.98 }}
                onClick={onNavigateToLearn}
                className="w-full p-4 bg-primary/5 rounded-2xl flex items-center gap-4 text-left border border-primary/10"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">어휘 학습</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-primary" />
                    정답률 {accuracy}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{record.studyCount}회</p>
                  <p className="text-xs text-muted-foreground">
                    +{record.xpEarned} XP
                  </p>
                </div>
              </m.button>

              {/* 오답 단어 */}
              {record.wrongWordIds.length > 0 && (
                <m.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onNavigateToWrongWords}
                  className="w-full p-4 bg-primary/5 rounded-2xl flex items-center gap-4 text-left border border-primary/10"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">틀린 단어</p>
                    <p className="text-sm text-muted-foreground">
                      복습이 필요해요
                    </p>
                  </div>
                  <span className="text-xl font-bold text-primary">
                    {record.wrongWordIds.length}개
                  </span>
                </m.button>
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <span className="text-3xl">📚</span>
              </div>
              <p className="text-muted-foreground mb-4">학습 기록이 없어요</p>
              {isToday && (
                <Button onClick={onNavigateToLearn} size="lg">
                  지금 학습 시작하기
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
