import { m } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store'

interface WeekCalendarProps {
  lastStudyDate?: string | null // 하위 호환성 유지
  onClick?: () => void
}

export function WeekCalendar({ onClick }: WeekCalendarProps) {
  const { dailyRecords } = useAppStore()
  const today = new Date()
  const days = ['일', '월', '화', '수', '목', '금', '토']

  // 최근 7일 생성
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - i))
    return date
  })

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const isStudied = (date: Date) => {
    const dateKey = formatDateKey(date)
    return !!dailyRecords[dateKey]
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  return (
    <m.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <div className="flex items-center justify-between">
        <div className="flex justify-between gap-1 flex-1">
          {weekDays.map((date, index) => {
            const studied = isStudied(date)
            const todayFlag = isToday(date)

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-xs text-muted-foreground">
                  {days[date.getDay()]}
                </span>
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    todayFlag && !studied && 'ring-2 ring-primary ring-offset-2',
                    studied && 'bg-primary text-white',
                    !studied && !todayFlag && 'bg-muted text-muted-foreground'
                  )}
                >
                  {date.getDate()}
                </div>
              </div>
            )
          })}
        </div>
        {onClick && (
          <ChevronRight className="w-5 h-5 text-muted-foreground ml-2" />
        )}
      </div>
    </m.button>
  )
}
