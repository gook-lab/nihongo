// SRS Adaptive 대시보드 — 통계 페이지에 표시되는 SRS 기반 학습 인사이트
// - 복습 큐 (오늘/이번 주 due)
// - 망각 위험 단어 (3일 내 due지만 아직 안 본)
// - 평균 ease / interval
// - 시간대별 정답률 (지난 30일 dailyRecords 기반)
import { m } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, AlertTriangle, Clock, TrendingUp } from 'lucide-react'
import { useAppStore } from '@/store'
import { WORDS } from '@/data/words'
import type { WordSrsState } from '@/types'

const DAY_MS = 24 * 60 * 60 * 1000

interface DueBucket {
  label: string
  count: number
  emoji: string
  /** 0~1 — 진행바용 */
  ratio: number
}

function bucketsFor(srs: WordSrsState[], now: number): DueBucket[] {
  const overdue = srs.filter((s) => s.reviewCount > 0 && s.dueDate < now - DAY_MS).length
  const today = srs.filter(
    (s) => s.reviewCount > 0 && s.dueDate >= now - DAY_MS && s.dueDate <= now + DAY_MS,
  ).length
  const week = srs.filter(
    (s) =>
      s.reviewCount > 0 &&
      s.dueDate > now + DAY_MS &&
      s.dueDate <= now + 7 * DAY_MS,
  ).length
  const later = srs.filter((s) => s.reviewCount > 0 && s.dueDate > now + 7 * DAY_MS).length
  const max = Math.max(overdue, today, week, later, 1)

  return [
    { label: '지연 (1일+ 지남)', count: overdue, emoji: '⚠️', ratio: overdue / max },
    { label: '오늘 복습', count: today, emoji: '📅', ratio: today / max },
    { label: '이번 주', count: week, emoji: '📆', ratio: week / max },
    { label: '나중에', count: later, emoji: '🗓️', ratio: later / max },
  ]
}

function getRiskyWords(srs: WordSrsState[], now: number, limit = 5): WordSrsState[] {
  // 망각 위험 = (낮은 ease) + (정답률 낮음) + (due 임박/지남)
  // 시계 skew/0 division 방지 위해 모든 term을 [0, 1]로 clamp
  function riskScore(s: WordSrsState): number {
    const accuracy = s.reviewCount > 0 ? s.correctCount / s.reviewCount : 0
    const easeTerm = Math.max(0, Math.min(1, (2.5 - s.ease) / (2.5 - 1.3))) // 0~1
    const accTerm = Math.max(0, Math.min(1, 1 - accuracy))                   // 0~1
    const daysUntil = (s.dueDate - now) / DAY_MS
    // due가 가까울수록(또는 지났을수록) 위험 ↑. clamp로 무한대 방지
    const proximityTerm = Math.max(0, Math.min(1, 1 - daysUntil / 3))        // 0~1 (3일 후=0, 오늘=1, 지남도 1)
    const score = easeTerm * 2 + accTerm * 3 + proximityTerm * 1
    return Number.isFinite(score) ? score : 0
  }
  return srs
    .filter((s) => s.reviewCount >= 2 && s.dueDate <= now + 3 * DAY_MS)
    .sort((a, b) => riskScore(b) - riskScore(a))
    .slice(0, limit)
}

function findWord(wordId: string) {
  return WORDS.find((w) => w.id === wordId)
}

export function SrsDashboard() {
  const wordSrs = useAppStore((s) => s.wordSrs)
  const dailyRecords = useAppStore((s) => s.dailyRecords)
  const srsArr = Object.values(wordSrs).filter((s) => s.reviewCount > 0)
  const now = Date.now()

  // 충분한 데이터가 없으면 안내만
  if (srsArr.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            SRS 대시보드
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <p className="text-sm text-muted-foreground">
            학습 세션을 한 번 이상 완료하면 SRS 인사이트가 표시돼요
          </p>
        </CardContent>
      </Card>
    )
  }

  const buckets = bucketsFor(srsArr, now)
  const risky = getRiskyWords(srsArr, now)

  // 평균 ease / interval
  const avgEase = srsArr.reduce((sum, s) => sum + s.ease, 0) / srsArr.length
  const avgInterval =
    srsArr.reduce((sum, s) => sum + s.intervalDays, 0) / srsArr.length

  // 지난 30일 정답률 추세 (dailyRecords 기반)
  const last30 = Object.values(dailyRecords)
    .filter((r) => {
      const d = new Date(r.date).getTime()
      return d > now - 30 * DAY_MS && r.totalCount > 0
    })
    .sort((a, b) => a.date.localeCompare(b.date))
  const trendAvg =
    last30.length > 0
      ? Math.round(
          (last30.reduce((sum, r) => sum + r.correctCount / r.totalCount, 0) /
            last30.length) *
            100,
        )
      : null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          SRS 대시보드
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* 1) 복습 큐 분포 */}
        <section>
          <p className="type-section mb-2">
            복습 큐
          </p>
          <div className="space-y-2">
            {buckets.map((b, i) => (
              <m.div
                key={b.label}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className="text-base shrink-0 w-6 text-center">{b.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{b.label}</span>
                    <span className="font-semibold tabular-nums">{b.count}개</span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'var(--color-muted)' }}
                  >
                    <m.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.round(b.ratio * 100)}%` }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{
                        background:
                          b.label.includes('지연')
                            ? 'var(--color-destructive)'
                            : 'var(--color-primary)',
                      }}
                    />
                  </div>
                </div>
              </m.div>
            ))}
          </div>
        </section>

        {/* 2) 망각 위험 단어 */}
        {risky.length > 0 && (
          <section>
            <p className="type-section mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" />
              망각 위험 (낮은 ease + 임박)
            </p>
            <div className="space-y-1.5">
              {risky.map((s, i) => {
                const w = findWord(s.wordId)
                if (!w) return null
                const accuracy = Math.round((s.correctCount / s.reviewCount) * 100)
                const daysUntil = Math.round((s.dueDate - now) / DAY_MS)
                return (
                  <m.div
                    key={s.wordId}
                    initial={{ opacity: 0, y: 4 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-2 rounded-lg"
                    style={{ background: 'var(--color-muted)' }}
                  >
                    <div className="flex-1 min-w-0 flex items-baseline gap-2 flex-wrap">
                      <span className="font-semibold">{w.kanji}</span>
                      <span className="text-xs text-muted-foreground">{w.hiragana}</span>
                      <span className="romaji text-[10px] text-muted-foreground/70">
                        · {w.meaning}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-muted-foreground tabular-nums">
                        정답률 {accuracy}%
                      </div>
                      <div
                        className="text-[10px] tabular-nums"
                        style={{
                          color:
                            daysUntil <= 0
                              ? 'var(--color-destructive)'
                              : 'var(--color-text-secondary)',
                        }}
                      >
                        {daysUntil <= 0
                          ? `${Math.abs(daysUntil)}일 지남`
                          : `${daysUntil}일 후`}
                      </div>
                    </div>
                  </m.div>
                )
              })}
            </div>
          </section>
        )}

        {/* 3) 평균 지표 (ease / interval / 30일 정답률) */}
        <section>
          <p className="type-section mb-2">
            평균 지표
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Metric
              icon={<Brain className="w-3.5 h-3.5" />}
              label="평균 ease"
              value={avgEase.toFixed(2)}
              hint={avgEase >= 2.3 ? '안정적' : avgEase >= 2.0 ? '보통' : '복습 필요'}
            />
            <Metric
              icon={<Clock className="w-3.5 h-3.5" />}
              label="평균 간격"
              value={`${Math.round(avgInterval)}일`}
              hint={
                avgInterval >= 14
                  ? '장기 기억'
                  : avgInterval >= 5
                    ? '단기 기억'
                    : '초기 단계'
              }
            />
            <Metric
              icon={<TrendingUp className="w-3.5 h-3.5" />}
              label="30일 정답률"
              value={trendAvg !== null ? `${trendAvg}%` : '—'}
              hint={
                trendAvg === null
                  ? '데이터 부족'
                  : trendAvg >= 80
                    ? '훌륭해요'
                    : trendAvg >= 60
                      ? '꾸준히'
                      : '복습 필요'
              }
            />
          </div>
        </section>
      </CardContent>
    </Card>
  )
}

function Metric({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint: string
}) {
  return (
    <div
      className="rounded-lg p-2 text-center"
      style={{ background: 'var(--color-muted)' }}
    >
      <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px] mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-base font-bold tabular-nums leading-tight">{value}</p>
      <p
        className="text-[9px] mt-0.5"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        {hint}
      </p>
    </div>
  )
}
