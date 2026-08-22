import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { Sparkles, Star, ChevronLeft, ChevronRight, PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BottomNav } from '@/components/BottomNav'
import { TTSButton } from '@/components/TTSButton'
import { KanjiStrokeOrder } from '@/components/KanjiStrokeOrder'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { useAppStore } from '@/store'
import { WORDS } from '@/data/words'
import { getKanjiMeta } from '@/data/kanji'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'

interface KanjiEntry {
  kanji: string
  level: number
  readings: Array<{ hiragana: string; meaning: string }>
}

function buildKanjiList(): KanjiEntry[] {
  const map = new Map<string, KanjiEntry>()
  for (const word of WORDS) {
    // 가타카나 단독 단어 등은 한자 학습에서 제외 (한자 한 글자 이상 포함된 것만)
    if (!/[一-龯]/.test(word.kanji)) continue
    const existing = map.get(word.kanji)
    if (existing) {
      existing.readings.push({ hiragana: word.hiragana, meaning: word.meaning })
    } else {
      map.set(word.kanji, {
        kanji: word.kanji,
        level: word.level,
        readings: [{ hiragana: word.hiragana, meaning: word.meaning }],
      })
    }
  }
  return Array.from(map.values()).sort((a, b) => b.level - a.level)
}

type FilterMode = 'all' | 'N5' | 'N4' | 'N3' | 'favorite'

export function KanjiPage() {
  const navigate = useNavigate()
  const favoriteKanji = useAppStore((s) => s.favoriteKanji)
  const toggleFavoriteKanji = useAppStore((s) => s.toggleFavoriteKanji)

  const allKanji = useMemo(() => buildKanjiList(), [])
  const [filter, setFilter] = useState<FilterMode>('all')
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [showStrokes, setShowStrokes] = useState(false)

  const filtered = useMemo(() => {
    if (filter === 'all') return allKanji
    if (filter === 'favorite') return allKanji.filter((k) => favoriteKanji.includes(k.kanji))
    const lv = filter === 'N5' ? 5 : filter === 'N4' ? 4 : 3
    return allKanji.filter((k) => k.level === lv)
  }, [allKanji, favoriteKanji, filter])

  useEffect(() => {
    setIndex(0)
    setFlipped(false)
  }, [filter])

  const current = filtered[index]
  const isFavorite = current ? favoriteKanji.includes(current.kanji) : false

  const goPrev = () => {
    setFlipped(false)
    setShowStrokes(false)
    setIndex((i) => (i - 1 + filtered.length) % filtered.length)
  }

  const goNext = () => {
    setFlipped(false)
    setShowStrokes(false)
    setIndex((i) => (i + 1) % filtered.length)
  }

  const meta = current ? getKanjiMeta(current.kanji) : undefined

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader title="한자 학습" icon={Sparkles} tone="study" back backTo="/" />

      <div className="px-5 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['all', 'N5', 'N4', 'N3', 'favorite'] as FilterMode[]).map((mode) => (
            <Button
              key={mode}
              variant={filter === mode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(mode)}
              className="shrink-0"
            >
              {mode === 'all'
                ? `전체 (${allKanji.length})`
                : mode === 'favorite'
                  ? `즐겨찾기 (${favoriteKanji.length})`
                  : `${mode}`}
            </Button>
          ))}
        </div>

        {!current ? (
          <EmptyState
            reaction={filter === 'favorite' ? 'sleep' : 'think'}
            title={
              filter === 'favorite' ? '즐겨찾기한 한자가 없어요' : '표시할 한자가 없어요'
            }
            description={
              filter === 'favorite'
                ? '카드의 별 버튼을 눌러 한자를 추가해 보세요'
                : '다른 레벨을 선택해 보세요'
            }
            bubble={filter === 'favorite' ? '별을 눌러보세요!' : undefined}
          />
        ) : (
          <>
            <div className="text-center text-sm text-muted-foreground">
              {index + 1} / {filtered.length}
            </div>

            {/* 한자 플립 카드 — 한 면씩 렌더 (backface-visibility 의존 제거, 안정적) */}
            <div style={{ perspective: '1000px', height: 380 }}>
              <AnimatePresence initial={false} mode="wait">
                {!flipped ? (
                  <m.div
                    key="front"
                    onClick={() => setFlipped(true)}
                    className="cursor-pointer w-full"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Card className="relative flex flex-col items-center justify-center p-8 overflow-hidden" style={{ height: 380 }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavoriteKanji(current.kanji)
                        }}
                        className="absolute top-3 right-3 p-2 hover:bg-muted rounded-full transition-colors"
                        aria-label="즐겨찾기"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                      <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        N{current.level}
                      </div>
                      {showStrokes ? (
                        <KanjiStrokeOrder kanji={current.kanji} size={180} className="mb-3" />
                      ) : (
                        <p className="text-[110px] leading-none font-bold mb-4 whitespace-nowrap">
                          {current.kanji}
                        </p>
                      )}
                      {meta && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {meta.strokes}획{meta.radical ? ` · 부수 ${meta.radical}` : ''}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowStrokes((v) => !v)
                        }}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary inline-flex items-center gap-1 hover:bg-primary/20 transition-colors whitespace-nowrap shrink-0"
                      >
                        <PenLine className="w-3 h-3 shrink-0" />
                        <span className="whitespace-nowrap">
                          {showStrokes ? '한자 크게 보기' : '획순 보기'}
                        </span>
                      </button>
                      <p className="text-[11px] text-muted-foreground mt-2">탭하여 뜻 보기</p>
                    </Card>
                  </m.div>
                ) : (
                  <m.div
                    key="back"
                    onClick={() => setFlipped(false)}
                    className="cursor-pointer w-full"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Card className="relative flex flex-col items-center justify-center p-6 overflow-hidden" style={{ height: 380 }}>
                      <p className="text-5xl font-bold mb-3 whitespace-nowrap">{current.kanji}</p>
                      {meta && (
                        <div className="flex gap-2 mb-3 flex-wrap justify-center">
                          {meta.onyomi.length > 0 && (
                            <span
                              className="text-[11px] px-2 py-1 rounded-full"
                              style={{
                                background: 'var(--color-muted)',
                                color: 'var(--color-text-secondary)',
                              }}
                            >
                              음 {meta.onyomi.join(' · ')}
                            </span>
                          )}
                          {meta.kunyomi.length > 0 && (
                            <span className="text-[11px] px-2 py-1 rounded-full bg-primary/10 text-primary">
                              훈 {meta.kunyomi.join(' · ')}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="w-full space-y-2 max-w-md">
                        {current.readings.map((r, i) => (
                          <div
                            key={`${r.hiragana}-${i}`}
                            className="flex items-center justify-between gap-4 bg-muted/50 rounded-lg p-3"
                          >
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium whitespace-nowrap">{r.hiragana}</span>
                              <span className="romaji text-xs text-muted-foreground whitespace-nowrap">
                                {hiraganaToRomaji(r.hiragana)}
                              </span>
                            </div>
                            <span className="text-sm text-primary font-medium whitespace-nowrap text-right">
                              {r.meaning}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                        <TTSButton text={current.kanji} label="발음" variant="outline" />
                      </div>
                    </Card>
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={goPrev} className="flex-1 h-12">
                <ChevronLeft className="w-4 h-4 mr-1" />
                이전
              </Button>
              <Button onClick={goNext} className="flex-1 h-12">
                다음
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* 손글씨 연습 진입 */}
            <Button
              variant="outline"
              onClick={() => navigate('/kanji/practice')}
              className="w-full h-12 mt-3"
              style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
            >
              <PenLine className="w-4 h-4 mr-1.5" />
              손글씨 연습 시작
            </Button>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
