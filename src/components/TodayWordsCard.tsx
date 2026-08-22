// 오늘의 단어 5개 — SRS due > 미학습 > 랜덤 순으로 큐레이션.
// 홈에 카드 표시, 클릭 시 사전 검색 페이지로 이동 (단어 강조).
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { Sparkles, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/store'
import { WORDS } from '@/data/words'
import { TTSButton } from '@/components/TTSButton'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'

const TODAY_COUNT = 5

function pickTodayWords(srs: Record<string, { dueDate: number }>, count: number) {
  const now = Date.now()
  const srsIds = new Set(Object.keys(srs))

  // 1. SRS due 단어 (복습 우선)
  const due = Object.values(srs)
    .filter((s: { dueDate: number }) => s.dueDate <= now)
    .map((s: unknown) => (s as { wordId: string }).wordId)
    .filter((id) => WORDS.some((w) => w.id === id))

  const result: string[] = []
  for (const id of due) {
    if (result.length >= count) break
    if (!result.includes(id)) result.push(id)
  }

  // 2. 미학습 (SRS 기록 없음) — N5부터 시작 (학습자 우선 보호)
  if (result.length < count) {
    const unlearned = WORDS.filter((w) => !srsIds.has(w.id)).sort(
      (a, b) => (b.level || 0) - (a.level || 0),
    )
    for (const w of unlearned) {
      if (result.length >= count) break
      if (!result.includes(w.id)) result.push(w.id)
    }
  }

  // 3. 그래도 부족하면 랜덤
  if (result.length < count) {
    const remaining = WORDS.filter((w) => !result.includes(w.id))
    while (result.length < count && remaining.length > 0) {
      const idx = Math.floor(Math.random() * remaining.length)
      result.push(remaining.splice(idx, 1)[0].id)
    }
  }

  return result.map((id) => WORDS.find((w) => w.id === id)!).filter(Boolean)
}

// SRS 객체 타입 — store.wordSrs는 wordId → WordSrsState
type SrsRecord = Record<string, { wordId: string; dueDate: number }>

export function TodayWordsCard() {
  const navigate = useNavigate()
  const wordSrs = useAppStore((s) => s.wordSrs) as SrsRecord
  // 오늘의 단어는 하루 단위로 일정해야 하므로 today date를 seed로 — 그래도 단어 추가/학습마다 바뀜
  const todayWords = useMemo(() => pickTodayWords(wordSrs, TODAY_COUNT), [wordSrs])

  if (todayWords.length === 0) return null

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <p className="text-sm font-bold">오늘의 단어</p>
          </div>
          <button
            onClick={() => navigate('/dictionary')}
            className="text-[11px] font-semibold flex items-center gap-0.5"
            style={{ color: 'var(--color-primary)' }}
          >
            사전 보기
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-1.5">
          {todayWords.map((w, i) => (
            <m.div
              key={w.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 py-2 px-2 rounded-xl"
              style={{ background: 'var(--color-muted)' }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[15px] font-bold" style={{ fontFamily: '"Hiragino Sans","Noto Sans JP", serif' }}>
                    {w.kanji}
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    {w.hiragana}
                  </span>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                  {w.meaning}
                  <span className="text-[9px] ml-1.5 font-mono opacity-60">
                    {hiraganaToRomaji(w.hiragana)}
                  </span>
                </p>
              </div>
              <span
                className="text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0"
                style={{
                  background: 'var(--color-sakura-100)',
                  color: 'var(--color-primary)',
                }}
              >
                N{w.level}
              </span>
              <TTSButton text={w.kanji} variant="ghost" size="icon" />
            </m.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
