// 빠른 사전 검색 — 모든 페이지에서 ⌘K 또는 검색 FAB로 호출.
// 단어(사전) + 회화 표현을 함께 검색. 클릭 시 사전/회화 상세로 이동.
// 검색 로직은 lib/quickSearch.ts 순수 함수 (테스트 대상).
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { MessageCircle, Search, X } from 'lucide-react'
import { useAppStore } from '@/store'
import { searchWords, searchPhrases, type PhraseSearchHit } from '@/lib/quickSearch'

interface Props {
  open: boolean
  onClose: () => void
}

interface SearchResult {
  id: string
  kanji: string
  hiragana: string
  meaning: string
  level: number
}

export function QuickDictSearch({ open, onClose }: Props) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [phraseResults, setPhraseResults] = useState<PhraseSearchHit[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(t)
    } else {
      setQuery('')
      setResults([])
      setPhraseResults([])
    }
  }, [open])

  // 검색 — 데이터는 lazy하게 가져와서 첫 검색 시점에만 로드
  useEffect(() => {
    if (!open || !query.trim()) {
      setResults([])
      setPhraseResults([])
      return
    }
    let cancelled = false
    ;(async () => {
      const [{ WORDS }, { CONVERSATION_CATEGORIES }] = await Promise.all([
        import('@/data/words'),
        import('@/data/conversations'),
      ])
      if (cancelled) return
      setResults(searchWords(WORDS, query))
      setPhraseResults(searchPhrases(CONVERSATION_CATEGORIES, query))
    })()
    return () => {
      cancelled = true
    }
  }, [open, query])

  // ESC 단축키
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleSelect = (word: SearchResult) => {
    navigate(`/dictionary?search=${encodeURIComponent(word.kanji)}`)
    onClose()
  }

  const handleSelectPhrase = (hit: PhraseSearchHit) => {
    // 카테고리 상세로 이동 + 해당 표현 카드로 스크롤 (state로 전달)
    navigate(`/conversation/${hit.categoryId}`, {
      state: { phraseId: hit.phraseId },
    })
    onClose()
  }

  const hasAnyResult = results.length > 0 || phraseResults.length > 0

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={onClose}
        >
          <m.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', maxWidth: 480, background: 'var(--color-card)' }}
            className="rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 입력 */}
            <div className="flex items-center gap-2 p-3 border-b border-border-light">
              <Search className="w-5 h-5 shrink-0" style={{ color: 'var(--color-text-tertiary)' }} />
              <input
                ref={inputRef}
                type="text"
                placeholder="한자 / 히라가나 / 뜻 검색"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[15px]"
              />
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                aria-label="닫기"
              >
                <X className="w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
              </button>
            </div>

            {/* 결과 */}
            <div className="max-h-[60vh] overflow-y-auto">
              {!query.trim() ? (
                <div
                  className="px-4 py-8 text-center text-xs"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  단어를 입력하면 사전에서 빠르게 찾아드려요
                </div>
              ) : !hasAnyResult ? (
                <div
                  className="px-4 py-8 text-center text-xs"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  "{query}" 검색 결과가 없어요
                </div>
              ) : (
                <>
                {results.length > 0 && phraseResults.length > 0 && (
                  <p
                    className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    단어
                  </p>
                )}
                <ul>
                  {results.map((w) => (
                    <li key={w.id}>
                      <button
                        onClick={() => handleSelect(w)}
                        className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-muted transition-colors"
                      >
                        <span
                          className="text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded shrink-0"
                          style={{
                            background: 'var(--color-sakura-100)',
                            color: 'var(--color-primary)',
                          }}
                        >
                          N{w.level}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span
                              className="text-[15px] font-bold"
                              style={{ fontFamily: '"Hiragino Sans","Noto Sans JP", serif' }}
                            >
                              {w.kanji}
                            </span>
                            <span
                              className="text-[11px]"
                              style={{ color: 'var(--color-text-tertiary)' }}
                            >
                              {w.hiragana}
                            </span>
                          </div>
                          <p
                            className="text-[11px]"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {w.meaning}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
                {phraseResults.length > 0 && (
                  <>
                    <p
                      className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      회화 표현
                    </p>
                    <ul>
                      {phraseResults.map((hit) => (
                        <li key={hit.phraseId}>
                          <button
                            onClick={() => handleSelectPhrase(hit)}
                            className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-muted transition-colors"
                          >
                            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <MessageCircle className="w-3 h-3 text-primary" />
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2">
                                <span
                                  className="text-[14px] font-bold truncate"
                                  style={{ fontFamily: '"Hiragino Sans","Noto Sans JP", serif' }}
                                >
                                  {hit.japanese}
                                </span>
                              </div>
                              <p
                                className="text-[11px] truncate"
                                style={{ color: 'var(--color-text-secondary)' }}
                              >
                                {hit.korean} · {hit.categoryName}
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                </>
              )}
            </div>

            {/* 푸터 — 단축키 안내 */}
            <div
              className="px-4 py-2 border-t border-border-light flex items-center justify-between text-[10px]"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              <span>Esc 닫기</span>
              <span>⌘K로 어디서든 열기</span>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}

// 글로벌 단축키 (⌘K / Ctrl+K) 핸들러 + FAB 트리거 컴포넌트.
// App.tsx에 마운트하면 어디서든 열림.
// 검색 FAB를 표시할 라우트 — 일본어를 읽다 모르는 단어를 만나는 화면.
// 홈·인트로·통계·설정엔 표시하지 않는다.
// 학습 퀴즈(/learn)는 시험이므로 사전 검색을 노출하지 않는다 (커닝 방지).
// ⌘K 단축키는 어디서나 동작.
function shouldShowSearchFab(pathname: string): boolean {
  return (
    pathname.startsWith('/conversation') || pathname.startsWith('/reading')
  )
}

export function QuickDictSearchProvider() {
  const [open, setOpen] = useState(false)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const isGuest = useAppStore((s) => s.isGuest)
  const { pathname } = useLocation()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!isAuthenticated && !isGuest) return null

  return (
    <>
      <QuickDictSearch open={open} onClose={() => setOpen(false)} />
      {shouldShowSearchFab(pathname) && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 left-5 w-11 h-11 rounded-full flex items-center justify-center shadow-lg z-40 transition-transform"
          style={{
            background: 'var(--color-card)',
            border: '1.5px solid var(--color-border-light)',
          }}
          aria-label="빠른 사전 검색"
          title="⌘K로도 열 수 있어요"
        >
          <Search
            className="w-4 h-4"
            style={{ color: 'var(--color-text-secondary)' }}
          />
        </button>
      )}
    </>
  )
}
