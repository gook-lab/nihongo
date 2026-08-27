// JLPT 레벨별 마스터리 % 카드
// SRS 데이터 기반 — 단어가 마스터됨 기준: 정답률 80% 이상 + 리뷰 3회 이상
import { m } from 'framer-motion'
import { Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/store'
import { WORDS } from '@/data/words'

interface LevelStats {
  level: number
  label: string
  total: number
  mastered: number
  reviewing: number
  percent: number
}

export function JLPTMastery() {
  const wordSrs = useAppStore((s) => s.wordSrs)

  // N5~N1 5단계 진척률 inline 계산.
  const levels: LevelStats[] = [5, 4, 3, 2, 1].map((level) => {
      const wordIds = WORDS.filter((w) => w.level === level).map((w) => w.id)
      const total = wordIds.length

      let mastered = 0
      let reviewing = 0
      for (const id of wordIds) {
        const s = wordSrs[id]
        if (!s || s.reviewCount === 0) continue
        const accuracy = s.correctCount / s.reviewCount
        if (s.reviewCount >= 3 && accuracy >= 0.8) {
          mastered++
        } else {
          reviewing++
        }
      }

      return {
        level,
        label: `N${level}`,
        total,
        mastered,
        reviewing,
        percent: Math.round((mastered / total) * 100),
      }
    })

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          JLPT 마스터리
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {levels.map((s) => (
          <div key={s.level}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-sm font-bold"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  {s.label}
                </span>
                <span
                  className="text-[11px]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  마스터 {s.mastered} · 학습중 {s.reviewing} · 전체 {s.total}
                </span>
              </div>
              <span
                className="text-sm font-extrabold tabular-nums"
                style={{ color: 'var(--color-primary)' }}
              >
                {s.percent}%
              </span>
            </div>
            <div
              className="h-2.5 rounded-full overflow-hidden"
              style={{ background: 'var(--color-muted)' }}
            >
              <m.div
                // width 대신 transform (레이아웃 재계산 회피, 시각 동일)
                initial={{ x: '-100%' }}
                animate={{ x: `-${100 - s.percent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full w-full rounded-full"
                style={{ background: 'var(--color-primary)' }}
              />
            </div>
          </div>
        ))}
        <p
          className="text-[10px] mt-2"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          마스터 기준: 3회 이상 학습 + 정답률 80% 이상
        </p>
      </CardContent>
    </Card>
  )
}
