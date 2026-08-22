// 일일/주간 학습 목표 진척 위젯 — 홈 + 통계 페이지 공용.
import { Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/store'

function localDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

/** 이번 주 (월요일 시작) 학습 세션 수 */
function thisWeekSessions(records: Record<string, { studyCount: number }>): number {
  const now = new Date()
  // 월요일 시작 — 일요일 = 0이면 -6
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((day + 6) % 7))
  monday.setHours(0, 0, 0, 0)

  let count = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    if (d > now) break
    const key = localDateKey(d)
    if (records[key]) count += records[key].studyCount
  }
  return count
}

export function GoalProgressWidget({ compact = false }: { compact?: boolean }) {
  const dailyGoal = useAppStore((s) => s.dailyGoal)
  const weeklyGoal = useAppStore((s) => s.weeklyGoal)
  const dailyRecords = useAppStore((s) => s.dailyRecords)

  const today = localDateKey(new Date())
  const todayRecord = dailyRecords[today]
  const todayCount = todayRecord?.totalCount ?? 0
  const weekCount = thisWeekSessions(dailyRecords)

  const dailyPct = Math.min(100, Math.round((todayCount / dailyGoal) * 100))
  const weeklyPct = Math.min(100, Math.round((weekCount / weeklyGoal) * 100))

  return (
    <Card>
      <CardContent className={compact ? 'p-3' : 'p-4'}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Target className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
          </div>
          <p className="text-sm font-bold">학습 목표</p>
        </div>

        <div className="space-y-3">
          <GoalRow
            label="오늘 학습"
            current={todayCount}
            goal={dailyGoal}
            unit="문제"
            pct={dailyPct}
          />
          <GoalRow
            label="이번 주 세션"
            current={weekCount}
            goal={weeklyGoal}
            unit="회"
            pct={weeklyPct}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function GoalRow({
  label,
  current,
  goal,
  unit,
  pct,
}: {
  label: string
  current: number
  goal: number
  unit: string
  pct: number
}) {
  const done = pct >= 100
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
          {label}
        </span>
        <span
          className="text-[12px] font-bold font-mono"
          style={{ color: done ? 'var(--color-primary)' : 'var(--color-text-primary)' }}
        >
          {current} / {goal}
          <span className="text-[10px] ml-0.5 opacity-70">{unit}</span>
          {done && <span className="ml-1">✓</span>}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: 'var(--color-muted)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            background: done
              ? 'var(--color-primary)'
              : 'linear-gradient(90deg, var(--color-primary), #FF8FB1)',
            transformOrigin: 'left',
            transform: `scaleX(${(pct / 100).toFixed(2)})`,
            transition: 'transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1.05)',
          }}
        />
      </div>
    </div>
  )
}
