// 최근 7일 학습 트렌드 SVG 차트 — 학습 문제 수 (또는 정답률) line chart.
// recharts 같은 라이브러리 없이 SVG 직접 — 100KB 절감.
import { useMemo, useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/store'
import type { DailyRecord } from '@/store'

type Metric = 'count' | 'accuracy' | 'xp'

const METRICS: { id: Metric; label: string; unit: string }[] = [
  { id: 'count', label: '학습량', unit: '문제' },
  { id: 'accuracy', label: '정답률', unit: '%' },
  { id: 'xp', label: 'XP', unit: 'XP' },
]

function localDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function valueFor(rec: DailyRecord | undefined, metric: Metric): number {
  if (!rec) return 0
  switch (metric) {
    case 'count':
      return rec.totalCount
    case 'accuracy':
      return rec.totalCount > 0
        ? Math.round((rec.correctCount / rec.totalCount) * 100)
        : 0
    case 'xp':
      return rec.xpEarned
  }
}

export function LearningTrendChart() {
  const dailyRecords = useAppStore((s) => s.dailyRecords)
  const [metric, setMetric] = useState<Metric>('count')

  const series = useMemo(() => {
    const today = new Date()
    const points: { date: string; label: string; value: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = localDateKey(d)
      const rec = dailyRecords[key]
      points.push({
        date: key,
        label: ['일', '월', '화', '수', '목', '금', '토'][d.getDay()],
        value: valueFor(rec, metric),
      })
    }
    return points
  }, [dailyRecords, metric])

  const max = Math.max(1, ...series.map((p) => p.value))
  const total = series.reduce((s, p) => s + p.value, 0)
  const avg = Math.round(total / series.length)

  // SVG 좌표 — viewBox 360x140
  const W = 360
  const H = 140
  const PAD_X = 24
  const PAD_T = 16
  const PAD_B = 28
  const innerW = W - PAD_X * 2
  const innerH = H - PAD_T - PAD_B
  const step = innerW / (series.length - 1)

  const points = series.map((p, i) => ({
    x: PAD_X + i * step,
    y: PAD_T + innerH - (p.value / max) * innerH,
    ...p,
  }))

  // line path
  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ')

  // area path (line + bottom)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PAD_T + innerH} L ${points[0].x} ${PAD_T + innerH} Z`

  if (total === 0) return null

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <p className="text-sm font-bold">최근 7일 트렌드</p>
          </div>
          <div
            className="inline-flex p-0.5 rounded-full"
            style={{ background: 'var(--color-muted)' }}
          >
            {METRICS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMetric(m.id)}
                className="text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors"
                style={{
                  background: metric === m.id ? 'var(--color-card)' : 'transparent',
                  color:
                    metric === m.id
                      ? 'var(--color-primary)'
                      : 'var(--color-text-secondary)',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 평균 표시 */}
        <p className="text-[11px] mb-1" style={{ color: 'var(--color-text-secondary)' }}>
          평균{' '}
          <span className="font-bold font-mono" style={{ color: 'var(--color-text-primary)' }}>
            {avg}
            <span className="text-[9px] ml-0.5 opacity-70">
              {METRICS.find((m) => m.id === metric)?.unit}
            </span>
          </span>
        </p>

        {/* SVG 차트 */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="auto"
          style={{ display: 'block', maxHeight: 160 }}
          role="img"
          aria-label={`최근 7일 ${METRICS.find((m) => m.id === metric)?.label} 트렌드`}
        >
          <defs>
            <linearGradient id="trend-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* 영역 */}
          <path d={areaPath} fill="url(#trend-grad)" />
          {/* 라인 */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 데이터 포인트 + 요일 */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={p.value > 0 ? 3.5 : 2}
                fill="var(--color-primary)"
                stroke="var(--color-card)"
                strokeWidth="1.5"
              />
              {p.value > 0 && (
                <text
                  x={p.x}
                  y={p.y - 8}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize="9"
                  fontWeight="700"
                  fill="var(--color-text-primary)"
                >
                  {p.value}
                </text>
              )}
              <text
                x={p.x}
                y={H - 8}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill={i === points.length - 1 ? 'var(--color-primary)' : 'var(--color-text-tertiary)'}
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </CardContent>
    </Card>
  )
}
