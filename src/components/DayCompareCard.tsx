// 어제 vs 오늘 학습 비교 카드 — StatisticsPage에 표시.
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/store'
import { compareTodayVsYesterday } from '@/lib/insights'

export function DayCompareCard() {
  const records = useAppStore((s) => s.dailyRecords)
  const cmp = compareTodayVsYesterday(records)

  // 데이터가 둘 다 없으면 카드 숨김
  if (cmp.todayCount === 0 && cmp.yesterdayCount === 0) return null

  return (
    <Card>
      <CardContent className="p-4">
        <p className="type-eyebrow mb-3">어제 vs 오늘</p>
        <div className="grid grid-cols-3 gap-2">
          <Metric
            label="학습 문제"
            today={cmp.todayCount}
            yesterday={cmp.yesterdayCount}
            unit="문제"
          />
          <Metric
            label="정답률"
            today={cmp.todayAccuracy ?? 0}
            yesterday={cmp.yesterdayAccuracy ?? 0}
            unit="%"
            disabled={cmp.todayAccuracy === null && cmp.yesterdayAccuracy === null}
          />
          <Metric label="획득 XP" today={cmp.todayXp} yesterday={cmp.yesterdayXp} unit="XP" />
        </div>
      </CardContent>
    </Card>
  )
}

function Metric({
  label,
  today,
  yesterday,
  unit,
  disabled,
}: {
  label: string
  today: number
  yesterday: number
  unit: string
  disabled?: boolean
}) {
  const diff = today - yesterday
  const Icon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus
  const color = diff > 0 ? '#10B981' : diff < 0 ? '#EF4444' : 'var(--color-text-tertiary)'

  return (
    <div
      className="rounded-xl p-2.5 text-center"
      style={{ background: 'var(--color-muted)', opacity: disabled ? 0.5 : 1 }}
    >
      <p
        className="text-[10px] font-bold mb-1"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        {label}
      </p>
      <p className="text-base font-extrabold">
        {today}
        <span
          className="text-[10px] ml-0.5 font-mono"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {unit}
        </span>
      </p>
      <div className="flex items-center justify-center gap-0.5 mt-1">
        <Icon className="w-3 h-3" style={{ color }} />
        <span className="text-[10px] font-bold font-mono" style={{ color }}>
          {diff > 0 ? `+${diff}` : diff < 0 ? diff : '±0'}
        </span>
      </div>
    </div>
  )
}
