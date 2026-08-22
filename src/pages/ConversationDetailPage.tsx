import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { m } from 'framer-motion'
import { ConversationMemoDrawer } from '@/components/ConversationMemoDrawer'
import { toast } from '@/lib/toast'
import { Bookmark, Gamepad2, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TTSButton } from '@/components/TTSButton'
import { ClickablePhrase } from '@/components/conversation/ClickablePhrase'
import { PrefetchAudioButton } from '@/components/conversation/PrefetchAudioButton'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store'
import { CONVERSATION_CATEGORIES } from '@/data/conversations'
import { getIconByName } from '@/lib/icon-map'
import type { ConversationWord } from '@/types'

export function ConversationDetailPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const conversationMemo = useAppStore((state) => state.conversationMemo)
  const markConversationViewed = useAppStore((state) => state.markConversationViewed)
  const favoritePhrases = useAppStore((state) => state.favoritePhrases)
  const toggleFavoritePhrase = useAppStore((state) => state.toggleFavoritePhrase)

  const [memoOpen, setMemoOpen] = useState(false)

  const category = CONVERSATION_CATEGORIES.find((c) => c.id === categoryId)

  // 검색 결과에서 진입 시 해당 표현 카드로 스크롤 + 잠깐 하이라이트
  const targetPhraseId = (location.state as { phraseId?: string } | null)?.phraseId
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  useEffect(() => {
    if (!targetPhraseId) return
    // 카드가 마운트된 다음 프레임에 스크롤 (App의 ScrollToTop 이후 실행 보장)
    const raf = requestAnimationFrame(() => {
      document
        .getElementById(`phrase-${targetPhraseId}`)
        ?.scrollIntoView({ block: 'center' })
      setHighlightedId(targetPhraseId)
    })
    const timer = setTimeout(() => setHighlightedId(null), 2000)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [targetPhraseId])

  // viewport에 phrase 카드가 들어왔을 때만 viewed로 마킹 — 페이지 진입만으로 100% 완료되는 문제 방지
  // (기존 자동 마킹 useEffect는 motion.div의 onViewportEnter로 대체)

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>카테고리를 찾을 수 없습니다</p>
      </div>
    )
  }

  const Icon = getIconByName(category.icon)

  const handleWordClick = (word: ConversationWord, isSaved: boolean, isParticle: boolean) => {
    if (isParticle) {
      toast.warning({ message: '조사는 메모할 수 없습니다', id: 'particle-warn' })
      return
    }

    if (isSaved) {
      toast.info({ message: `"${word.text}" 메모에서 삭제됐어요`, id: `memo-${word.text}` })
    } else {
      toast.success({ message: `"${word.text}" 메모에 저장됐어요`, id: `memo-${word.text}` })
    }
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <PageHeader
        title={category.nameKo}
        subtitle={category.nameJa}
        icon={Icon}
        back
        backTo="/conversation"
        rightAction={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setMemoOpen(true)}
              aria-label="메모 열기"
            >
              <Bookmark className="w-5 h-5" />
              {conversationMemo.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {conversationMemo.length > 99 ? '99+' : conversationMemo.length}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/conversation/${categoryId}/quiz`)}
            >
              <Gamepad2 className="w-4 h-4 mr-1" />
              퀴즈
            </Button>
          </div>
        }
      />
      <p className="text-xs text-muted-foreground px-5 pt-2 ml-12">
        단어를 탭하면 메모에 저장됩니다
      </p>

      {/* 오프라인 발음 미리받기 (Murf 사용 시에만 표시) */}
      <PrefetchAudioButton phrases={category.phrases} />

      {/* 표현 목록 */}
      <div className="space-y-4 px-5 mt-4">
        {category.phrases.map((phrase, index) => {
          const isFavorite = favoritePhrases.some((f) => f.id === phrase.id)
          return (
          <m.div
            key={phrase.id}
            id={`phrase-${phrase.id}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            onViewportEnter={() =>
              categoryId && markConversationViewed(categoryId, phrase.id)
            }
            transition={{ delay: index * 0.03 }}
          >
            <Card
              className={cn(
                'transition-shadow',
                highlightedId === phrase.id && 'ring-2 ring-primary shadow-md',
              )}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {index + 1}/{category.phrases.length}
                    </span>
                    <span className="text-xs text-muted-foreground bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {phrase.level}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toggleFavoritePhrase(phrase.id, category.id)
                        if (isFavorite) {
                          toast.info({
                            message: '여행 키트에서 뺐어요',
                            id: `kit-${phrase.id}`,
                          })
                        } else {
                          toast.success({
                            message: '여행 키트에 담았어요',
                            id: `kit-${phrase.id}`,
                          })
                        }
                      }}
                      aria-label={isFavorite ? '여행 키트에서 빼기' : '여행 키트에 담기'}
                    >
                      <Star
                        className={cn(
                          'w-5 h-5',
                          isFavorite
                            ? 'text-primary fill-primary'
                            : 'text-muted-foreground',
                        )}
                      />
                    </Button>
                    <TTSButton text={phrase.japanese} variant="ghost" size="icon" />
                  </div>
                </div>
                <ClickablePhrase
                  phrase={phrase}
                  categoryId={category.id}
                  onWordClick={handleWordClick}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {phrase.korean}
                </p>
              </CardContent>
            </Card>
          </m.div>
          )
        })}
      </div>

      {/* 우하단 메모 플로팅 FAB (drawer 빠른 진입) */}
      <m.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setMemoOpen(true)}
        className="fixed bottom-6 right-5 z-30 w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border-light)',
        }}
        aria-label="메모 열기"
      >
        <Bookmark className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
        {conversationMemo.length > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{
              background: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
            }}
          >
            {conversationMemo.length > 99 ? '99+' : conversationMemo.length}
          </span>
        )}
      </m.button>

      {/* 메모 드로어 */}
      <ConversationMemoDrawer open={memoOpen} onOpenChange={setMemoOpen} />
    </div>
  )
}
