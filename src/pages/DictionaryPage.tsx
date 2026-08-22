import { useState, useMemo, useDeferredValue, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { m } from 'framer-motion'
import { Search, BookOpen, Grid3X3, Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BottomNav } from '@/components/BottomNav'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { WordFlipCard } from '@/components/WordFlipCard'
import { FlashcardView } from '@/components/FlashcardView'
import { Spinner } from '@/components/Spinner'
import { WORDS } from '@/data/words'
import { useAppStore } from '@/store'

const ITEMS_PER_PAGE = 20

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export function DictionaryPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const deferredQuery = useDeferredValue(searchQuery)
  const { wrongWordIds } = useAppStore()
  const favoriteWords = useAppStore((s) => s.favoriteWords)
  const toggleFavoriteWord = useAppStore((s) => s.toggleFavoriteWord)
  const [filter, setFilter] = useState<'all' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'favorite' | 'conversation'>('all')
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)
  const [flashcardMode, setFlashcardMode] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const filterRowRef = useRef<HTMLDivElement>(null)

  // 선택된 chip을 가운데로 자동 스크롤 (필터 바뀔 때만)
  useEffect(() => {
    const row = filterRowRef.current
    if (!row) return
    const target = row.querySelector<HTMLButtonElement>(`[data-chip="${filter}"]`)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [filter])

  // 레벨/즐겨찾기/회화 + 검색 필터링
  const filteredWords = useMemo(() => {
    let pool = WORDS
    if (filter === 'favorite') {
      pool = pool.filter((w) => favoriteWords.includes(w.id))
    } else if (filter === 'conversation') {
      // 회화 출신 단어 — id가 conv- prefix
      pool = pool.filter((w) => w.id.startsWith('conv-'))
    } else if (filter !== 'all') {
      const lv =
        filter === 'N5' ? 5 :
        filter === 'N4' ? 4 :
        filter === 'N3' ? 3 :
        filter === 'N2' ? 2 : 1
      pool = pool.filter((w) => w.level === lv)
    }
    if (!deferredQuery.trim()) return pool
    const query = deferredQuery.toLowerCase().trim()
    return pool.filter(
      (word) =>
        word.kanji.includes(query) ||
        word.hiragana.includes(query) ||
        word.meaning.toLowerCase().includes(query),
    )
  }, [deferredQuery, filter, favoriteWords])

  // 검색어 변경 시 표시 개수 리셋
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE)
  }, [deferredQuery])

  // 현재 표시할 단어들
  const visibleWords = useMemo(() => {
    return filteredWords.slice(0, displayCount)
  }, [filteredWords, displayCount])

  const hasMore = displayCount < filteredWords.length
  const isSearching = searchQuery !== deferredQuery

  // Intersection Observer로 무한 스크롤
  const loadMore = useCallback(() => {
    if (hasMore) {
      setDisplayCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredWords.length))
    }
  }, [hasMore, filteredWords.length])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    const target = loadMoreRef.current
    if (target) {
      observer.observe(target)
    }

    return () => {
      if (target) {
        observer.unobserve(target)
      }
    }
  }, [hasMore, loadMore])

  return (
    <div className="min-h-screen bg-background pb-nav">
      {/* 헤더 */}
      <PageHeader
        title="사전"
        subtitle={`N5~N1 단어 ${WORDS.length}개`}
        icon={BookOpen}
        rightAction={
          <Button variant="outline" size="sm" onClick={() => navigate('/kana')} className="gap-1">
            <Grid3X3 className="w-4 h-4" />
            발음표
          </Button>
        }
      />
      <div className="px-5 pb-4">
        <m.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>

          {/* 검색 입력 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="한자, 히라가나, 뜻으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          {/* 레벨 / 즐겨찾기 / 회화 필터 — 가로 스크롤 + 좌우 fade + scroll-snap */}
          <div
            className="relative mt-2"
            style={{
              // 좌우 fade — 끝 부분이 옅어져 "더 있어요" 신호
              maskImage:
                'linear-gradient(to right, transparent 0, black 12px, black calc(100% - 12px), transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0, black 12px, black calc(100% - 12px), transparent 100%)',
            }}
          >
            <div
              ref={filterRowRef}
              className="flex gap-1.5 overflow-x-auto px-3 -mx-3 pb-1 scrollbar-hide"
              style={{
                scrollSnapType: 'x mandatory',
                scrollPaddingInline: 12,
              }}
            >
              {(['all', 'N5', 'N4', 'N3', 'N2', 'N1', 'conversation', 'favorite'] as const).map((mode) => {
                const active = filter === mode
                const count =
                  mode === 'all'
                    ? WORDS.length
                    : mode === 'favorite'
                      ? favoriteWords.length
                      : mode === 'conversation'
                        ? WORDS.filter((w) => w.id.startsWith('conv-')).length
                        : WORDS.filter(
                            (w) =>
                              w.level ===
                              (mode === 'N5' ? 5 :
                               mode === 'N4' ? 4 :
                               mode === 'N3' ? 3 :
                               mode === 'N2' ? 2 : 1),
                          ).length
                return (
                  <button
                    key={mode}
                    data-chip={mode}
                    onClick={() => setFilter(mode)}
                    className="shrink-0 text-xs px-2.5 py-1 rounded-full border-[1.5px] font-semibold transition-colors flex items-center gap-1"
                    style={{
                      scrollSnapAlign: 'center',
                      background: active
                        ? 'var(--color-primary)'
                        : 'var(--color-card)',
                      color: active
                        ? 'var(--color-primary-foreground)'
                        : 'var(--color-text-secondary)',
                      borderColor: active
                        ? 'var(--color-primary)'
                        : 'var(--color-border)',
                    }}
                  >
                    {mode === 'favorite' && <Star className="w-3 h-3 fill-current" />}
                    {mode === 'all'
                      ? '전체'
                      : mode === 'favorite'
                        ? '즐겨찾기'
                        : mode === 'conversation'
                          ? '회화'
                          : mode}{' '}
                    ({count})
                  </button>
                )
              })}
            </div>
          </div>
        </m.div>
      </div>

      <div className="px-5 py-2">
        {/* 검색 결과 수 + 모드 토글 + 즐겨찾기 학습 진입 */}
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <p className="text-sm text-muted-foreground">
            {searchQuery ? (
              <>
                검색 결과: <span className="font-medium">{filteredWords.length}개</span>
              </>
            ) : (
              <>
                전체 단어: <span className="font-medium">{WORDS.length}개</span>
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            {/* 플래시카드 모드 토글 */}
            <button
              onClick={() => setFlashcardMode((v) => !v)}
              className="text-[11px] font-semibold px-2.5 h-8 rounded-full border-[1.5px] inline-flex items-center gap-1"
              style={{
                background: flashcardMode ? 'var(--color-primary)' : 'var(--color-card)',
                color: flashcardMode
                  ? 'var(--color-primary-foreground)'
                  : 'var(--color-text-secondary)',
                borderColor: flashcardMode ? 'var(--color-primary)' : 'var(--color-border-light)',
              }}
              aria-pressed={flashcardMode}
            >
              {flashcardMode ? '목록 보기' : '플래시카드'}
            </button>
            {filter === 'favorite' && favoriteWords.length >= 5 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate('/learn', { state: { favoritesOnly: true } })
                }
                className="text-xs h-8"
              >
                <Star className="w-3 h-3 mr-1.5 fill-current" />
                이 단어들로 학습
              </Button>
            )}
          </div>
        </div>

        {/* 플래시카드 모드 — 단일 카드 + 좌우 스와이프 */}
        {flashcardMode && filteredWords.length > 0 ? (
          <FlashcardView
            words={filteredWords}
            favoriteWordIds={favoriteWords}
            onToggleFavorite={toggleFavoriteWord}
          />
        ) : filteredWords.length > 0 ? (
          <div className={`space-y-3 transition-opacity ${isSearching ? 'opacity-60' : ''}`}>
            {visibleWords.map((word, index) => {
              const isWrongWord = wrongWordIds.includes(word.id)

              return (
                <m.div
                  key={word.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index < ITEMS_PER_PAGE ? index * 0.03 : 0 }}
                >
                  <WordFlipCard
                    word={word}
                    isWrong={isWrongWord}
                    isFavorite={favoriteWords.includes(word.id)}
                    onToggleFavorite={() => toggleFavoriteWord(word.id)}
                  />
                </m.div>
              )
            })}

            {/* 로드 더 트리거 */}
            <div ref={loadMoreRef} className="py-4 flex justify-center">
              {hasMore && (
                <div className="flex items-center gap-3 text-muted-foreground text-sm">
                  <Spinner variant="dots" size={8} />
                  <span>더 불러오는 중...</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            reaction="think"
            title="찾는 단어가 없네요"
            description="다른 키워드로 검색하거나 카테고리를 바꿔 보세요"
            bubble="다시 해볼까요?"
          />
        )}
      </div>

      <BottomNav />
    </div>
  )
}
