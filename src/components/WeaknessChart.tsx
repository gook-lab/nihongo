import { m } from 'framer-motion'
import { Target, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/store'
import { WORDS, getWordById } from '@/data/words'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'

interface LevelStats {
  level: number
  label: string
  total: number
  correct: number
  reviews: number
  accuracy: number
}

export function WeaknessChart() {
  const wordSrs = useAppStore((s) => s.wordSrs)
  const dailyRecords = useAppStore((s) => s.dailyRecords)
  const states = Object.values(wordSrs)
  const totalReviews = states.reduce((sum, s) => sum + s.reviewCount, 0)

  if (totalReviews === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            약점 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            학습을 시작하면 약점 분석이 표시됩니다
          </p>
        </CardContent>
      </Card>
    )
  }

  const levelStats: LevelStats[] = [5, 4, 3].map((level) => {
    const label = `N${level}`
    const levelWordIds = new Set(WORDS.filter((w) => w.level === level).map((w) => w.id))
    const levelStates = states.filter((s) => levelWordIds.has(s.wordId))
    const correct = levelStates.reduce((sum, s) => sum + s.correctCount, 0)
    const reviews = levelStates.reduce((sum, s) => sum + s.reviewCount, 0)
    return {
      level,
      label,
      total: levelWordIds.size,
      correct,
      reviews,
      accuracy: reviews === 0 ? 0 : Math.round((correct / reviews) * 100),
    }
  })

  const weakest = [...states]
    .filter((s) => s.reviewCount > 0)
    .sort((a, b) => {
      const aWrong = a.wrongCount / a.reviewCount
      const bWrong = b.wrongCount / b.reviewCount
      return bWrong - aWrong || b.wrongCount - a.wrongCount
    })
    .slice(0, 5)
    .map((s) => ({ state: s, word: getWordById(s.wordId) }))
    .filter((x) => x.word)

  const last7 = recent7DaysAccuracy(dailyRecords)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          약점 분석
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="text-sm font-medium mb-2">JLPT 레벨별 정답률</p>
          <div className="space-y-2">
            {levelStats.map((s) => (
              <m.div
                key={s.level}
                // 등장 연출은 opacity 로 한다. width 0 → 100% 는 매 프레임
                // 레이아웃을 다시 계산하고, 게다가 이 요소는 원래 100% 라
                // 폭이 변할 이유가 없다.
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-1"
              >
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{s.label}</span>
                  <span className="text-muted-foreground">
                    {s.reviews === 0 ? '데이터 없음' : `${s.accuracy}% (${s.reviews}회)`}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <m.div
                    // width 대신 transform (레이아웃 재계산 회피, 시각 동일)
                    initial={{ x: '-100%' }}
                    animate={{ x: `-${100 - s.accuracy}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`h-full w-full rounded-full ${
                      s.accuracy >= 80
                        ? 'bg-green-500'
                        : s.accuracy >= 60
                          ? 'bg-primary'
                          : 'bg-red-500'
                    }`}
                  />
                </div>
              </m.div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">최근 7일 정답률 추이</p>
          <TrendSparkline data={last7} />
        </div>

        {weakest.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              자주 틀리는 단어
            </p>
            <div className="space-y-1.5">
              {weakest.map(({ state, word }) => {
                const wrongRate = Math.round((state.wrongCount / state.reviewCount) * 100)
                return (
                  <div
                    key={state.wordId}
                    className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {word!.kanji}{' '}
                        <span className="text-xs text-muted-foreground">
                          {word!.hiragana}
                          {/* immersion 시 구두점·로마자 둘 다 사라지도록 한 span으로 묶음 */}
                          <span className="romaji"> · {hiraganaToRomaji(word!.hiragana)}</span>
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">{word!.meaning}</span>
                    </div>
                    <span className="text-xs font-semibold text-red-500">
                      오답률 {wrongRate}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function recent7DaysAccuracy(
  dailyRecords: Record<string, { date: string; correctCount: number; totalCount: number }>,
): Array<{ date: string; accuracy: number; hasData: boolean }> {
  const out: Array<{ date: string; accuracy: number; hasData: boolean }> = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    // 로컬 타임존 YYYY-MM-DD — dailyRecords 키와 일치 (UTC 사용 시 KST 자정 직후 누락)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const rec = dailyRecords[key]
    if (rec && rec.totalCount > 0) {
      out.push({
        date: key,
        accuracy: Math.round((rec.correctCount / rec.totalCount) * 100),
        hasData: true,
      })
    } else {
      out.push({ date: key, accuracy: 0, hasData: false })
    }
  }
  return out
}

function TrendSparkline({
  data,
}: {
  data: Array<{ date: string; accuracy: number; hasData: boolean }>
}) {
  // 모든 날짜에 데이터 없거나, 학습했지만 정답률이 모두 0%면 큰 빈 차트 대신 안내.
  // (점들이 X축 바닥에 일렬로 깔려 시각적으로 텅 비어 보이는 문제 방지)
  const anyMeaningfulData = data.some((d) => d.hasData && d.accuracy > 0)
  if (!anyMeaningfulData) {
    const everStudied = data.some((d) => d.hasData)
    return (
      <div
        className="rounded-lg py-5 text-center text-xs"
        style={{
          background: 'var(--color-muted)',
          color: 'var(--color-text-tertiary)',
        }}
      >
        {everStudied
          ? '아직 정답 기록이 없어요. 다시 도전해 볼까요?'
          : '최근 7일간 학습 기록이 없어요'}
      </div>
    )
  }

  const max = 100
  const width = 280
  const height = 60
  const stepX = width / Math.max(1, data.length - 1)
  const points = data.map((d, i) => ({
    x: i * stepX,
    y: height - (d.accuracy / max) * height,
    hasData: d.hasData,
  }))
  // 데이터가 있는 포인트만 path에 연결 — 빈 날짜는 라인이 끊기게
  const path = points
    .map((p, i) => {
      if (!p.hasData) return ''
      const prev = points[i - 1]
      const cmd = !prev || !prev.hasData ? 'M' : 'L'
      return `${cmd} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    })
    .filter(Boolean)
    .join(' ')

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height + 16}`}
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <line
          x1={0}
          x2={width}
          y1={height}
          y2={height}
          stroke="currentColor"
          strokeOpacity={0.1}
        />
        <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth={2} />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.hasData ? 3 : 2}
            fill={p.hasData ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
            opacity={p.hasData ? 1 : 0.4}
          />
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-muted-foreground/70 mt-1">
        {data.map((d) => (
          <span key={d.date}>{d.date.slice(5)}</span>
        ))}
      </div>
    </div>
  )
}
