import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { Bookmark, BookOpen, ChevronRight, Star, Trash2 } from 'lucide-react'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/card'
import { TTSButton } from '@/components/TTSButton'
import { EmptyState } from '@/components/EmptyState'
import { ClickablePhrase } from '@/components/conversation/ClickablePhrase'
import { PrefetchAudioButton } from '@/components/conversation/PrefetchAudioButton'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store'
import { CONVERSATION_CATEGORIES } from '@/data/conversations'
import type { ConversationPhrase } from '@/types'

type MemoTab = 'words' | 'phrases'

// phrase id → { phrase, categoryId } 조회 맵 (모듈 1회 생성)
const PHRASE_BY_ID: Record<string, { phrase: ConversationPhrase; categoryId: string }> = {}
for (const category of CONVERSATION_CATEGORIES) {
  for (const phrase of category.phrases) {
    PHRASE_BY_ID[phrase.id] = { phrase, categoryId: category.id }
  }
}

export function ConversationMemoPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const conversationMemo = useAppStore((state) => state.conversationMemo)
  const removeConversationMemo = useAppStore((state) => state.removeConversationMemo)
  const favoritePhrases = useAppStore((state) => state.favoritePhrases)
  const toggleFavoritePhrase = useAppStore((state) => state.toggleFavoritePhrase)

  // 홈 "내 여행 키트" 카드에서 진입 시 표현 탭으로 바로 열기
  const initialTab = (location.state as { tab?: MemoTab } | null)?.tab ?? 'words'
  const [tab, setTab] = useState<MemoTab>(initialTab)

  const getCategoryName = (categoryId: string) => {
    const category = CONVERSATION_CATEGORIES.find((c) => c.id === categoryId)
    return category?.nameKo || categoryId
  }

  // 여행 키트 — 추가일 최신순, 데이터에서 사라진 표현 id는 조용히 제외
  const kitPhrases = useMemo(
    () =>
      [...favoritePhrases]
        .sort((a, b) => b.addedAt - a.addedAt)
        .map((fav) => ({ fav, resolved: PHRASE_BY_ID[fav.id] }))
        .filter(
          (
            entry,
          ): entry is {
            fav: (typeof favoritePhrases)[number]
            resolved: (typeof PHRASE_BY_ID)[string]
          } => Boolean(entry.resolved),
        ),
    [favoritePhrases],
  )

  // 키트 일괄 미리받기용 표현 배열 (PrefetchAudioButton의 effect 재실행 방지 위해 memo)
  const kitPhraseList = useMemo(
    () => kitPhrases.map((entry) => entry.resolved.phrase),
    [kitPhrases],
  )

  const handleGoToDictionary = (text: string) => {
    navigate(`/dictionary?search=${encodeURIComponent(text)}`)
  }

  // 카테고리별로 그룹화
  const groupedMemo = conversationMemo.reduce(
    (acc, word) => {
      if (!acc[word.category]) {
        acc[word.category] = []
      }
      acc[word.category].push(word)
      return acc
    },
    {} as Record<string, typeof conversationMemo>
  )

  return (
    <div className="min-h-screen bg-background pb-8">
      <PageHeader
        title="메모"
        subtitle={
          tab === 'words'
            ? `저장한 단어 ${conversationMemo.length}개`
            : `여행 키트 표현 ${kitPhrases.length}개`
        }
        icon={Bookmark}
        back
        backTo="/conversation"
      />

      {/* 단어 / 표현 탭 */}
      <div className="px-5 mt-3">
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ background: 'var(--color-muted)' }}
        >
          {(
            [
              { key: 'words', label: `단어 ${conversationMemo.length}` },
              { key: 'phrases', label: `표현 ${kitPhrases.length}` },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                tab === key ? 'text-primary' : 'text-muted-foreground',
              )}
              style={
                tab === key
                  ? { background: 'var(--color-card)', boxShadow: 'var(--shadow-primary-glow)' }
                  : undefined
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 내 키트 일괄 미리받기 — 여러 카테고리에서 모은 표현을 한 번에 오프라인화 */}
      {tab === 'phrases' && kitPhraseList.length > 0 && (
        <PrefetchAudioButton phrases={kitPhraseList} />
      )}

      {/* 내용 — 표현(여행 키트) 탭 */}
      {tab === 'phrases' && (
        <div className="px-5 mt-4">
          {kitPhrases.length === 0 ? (
            <EmptyState
              reaction="bounce"
              title="여행 키트가 비어 있어요"
              description="회화 표현의 별을 탭해서 내가 쓸 문장을 모아보세요"
              bubble="별을 탭해 보세요!"
              actionLabel="회화 둘러보기"
              onAction={() => navigate('/conversation')}
            />
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {kitPhrases.map(({ fav, resolved }, index) => (
                  <m.div
                    key={fav.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card className="p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <TTSButton
                          text={resolved.phrase.japanese}
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                        />
                        <div className="flex-1 min-w-0 pt-1">
                          <ClickablePhrase
                            phrase={resolved.phrase}
                            categoryId={resolved.categoryId}
                          />
                          <p className="text-sm text-muted-foreground mt-1.5">
                            {resolved.phrase.korean}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-primary"
                          onClick={() =>
                            toggleFavoritePhrase(fav.id, resolved.categoryId)
                          }
                          aria-label="여행 키트에서 빼기"
                        >
                          <Star className="w-4 h-4 fill-primary" />
                        </Button>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/conversation/${resolved.categoryId}`, {
                            state: { phraseId: fav.id },
                          })
                        }
                        className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-primary transition-colors pl-1"
                      >
                        <span>{getCategoryName(resolved.categoryId)}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </Card>
                  </m.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* 내용 — 단어 탭 */}
      {tab === 'words' && (
      <div className="px-5 mt-4">
        {conversationMemo.length === 0 ? (
          <EmptyState
            reaction="bounce"
            title="아직 저장한 단어가 없어요"
            description="회화 표현에서 단어를 탭해서 저장해보세요"
            bubble="단어를 탭해 보세요!"
            actionLabel="회화 둘러보기"
            onAction={() => navigate('/conversation')}
          />
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMemo).map(([categoryId, words], groupIndex) => (
              <m.div
                key={categoryId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
              >
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {getCategoryName(categoryId)}
                </h3>
                <div className="space-y-2">
                  <AnimatePresence>
                    {words.map((word, index) => (
                      <m.div
                        key={word.text}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Card className="p-3">
                          <div className="flex items-center gap-3">
                            {/* TTS 버튼 */}
                            <TTSButton
                              text={word.text}
                              variant="ghost"
                              size="icon"
                              className="shrink-0"
                            />

                            {/* 단어 정보 */}
                            <div
                              className="flex-1 min-w-0 cursor-pointer"
                              onClick={() => handleGoToDictionary(word.text)}
                            >
                              <div className="flex items-end gap-2">
                                <div className="flex flex-col items-center">
                                  <span className="font-bold text-lg">{word.text}</span>
                                  <span className="text-[10px] text-muted-foreground leading-tight">
                                    {word.reading}
                                  </span>
                                  <span className="romaji text-[9px] text-muted-foreground/70 leading-tight">
                                    {hiraganaToRomaji(word.reading)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-primary font-medium truncate mt-1">
                                {word.meaning}
                              </p>
                            </div>

                            {/* 사전 이동 버튼 */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                              onClick={() => handleGoToDictionary(word.text)}
                            >
                              <BookOpen className="w-4 h-4" />
                            </Button>

                            {/* 삭제 버튼 */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeConversationMemo(word.text)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      </m.div>
                    ))}
                  </AnimatePresence>
                </div>
              </m.div>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  )
}
