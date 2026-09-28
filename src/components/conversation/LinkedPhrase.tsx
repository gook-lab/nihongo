import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/lib/toast'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'
import { useAppStore } from '@/store'
import { matchPhraseWithWords } from '@/lib/phraseWordMatcher'
import type { ConversationPhrase } from '@/types'
import { WORDS } from '@/data/words'

interface LinkedPhraseProps {
  phrase: ConversationPhrase
  categoryId: string
}

/**
 * 회화 표현에서 사전 단어를 링크로 표시하는 컴포넌트
 *
 * 기능:
 * - 사전에 있는 단어는 클릭 가능한 칩으로 표시
 * - 클릭 시 바텀시트에서 단어 상세 정보 표시
 * - "단어장에 담기" 버튼으로 개인 단어장에 추가
 * - 이미 추가된 단어는 "담아졌어요" 표시
 */
export function LinkedPhrase({ phrase, categoryId }: LinkedPhraseProps) {
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const bottomSheetRef = useRef<HTMLDivElement>(null)
  const matches = matchPhraseWithWords(phrase.japanese, WORDS)

  // Zustand store에서 회화 메모 조회 및 미션 진행도 업데이트
  const { conversationMemo, addConversationMemo, removeConversationMemo, bumpMissionProgress } = useAppStore()

  // 바텀시트 열 때: 포커스 저장, 닫을 때: 복귀
  useEffect(() => {
    if (selectedWordId) {
      previousFocusRef.current = document.activeElement as HTMLElement
      // 바텀시트에 포커스 이동 (닫기 버튼으로)
      setTimeout(() => {
        const closeButton = bottomSheetRef.current?.querySelector('button[aria-label="닫기"]') as HTMLButtonElement
        closeButton?.focus()
      }, 100)
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus()
      previousFocusRef.current = null
    }
  }, [selectedWordId])

  // Esc 키로 바텀시트 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedWordId) {
        setSelectedWordId(null)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [selectedWordId])

  // 선택된 단어 정보
  const selectedMatch = matches.find((m) => m.word.id === selectedWordId)
  const selectedWord = selectedMatch?.word

  // 선택된 단어가 입자인지 확인 (phrase.words에서 입자 정보 가져오기)
  const selectedWordFromPhrase = selectedMatch
    ? phrase.words.find(
        (w) =>
          w.text === selectedMatch.matchedText ||
          w.reading === selectedMatch.word.hiragana ||
          w.text === selectedMatch.word.kanji
      )
    : null
  const isParticle = selectedWordFromPhrase?.isParticle === true

  // 이 단어가 이미 메모에 있는지 확인
  const isMemoized =
    selectedWord &&
    conversationMemo.some((memo) => memo.text === selectedWord.kanji && memo.sourcePhrase === phrase.japanese)

  const handleAddToMemo = () => {
    if (!selectedWord) return

    // 입자는 메모 추가 불가
    if (isParticle) {
      toast.info({ message: '조사는 단어장에 담을 수 없어요.' })
      return
    }

    if (isMemoized) {
      removeConversationMemo(selectedWord.kanji)
      toast.info({ message: '단어장에서 제거했어요.' })
    } else {
      addConversationMemo({
        text: selectedWord.kanji,
        reading: selectedWord.hiragana,
        meaning: selectedWord.meaning,
        sourcePhrase: phrase.japanese,
        category: categoryId,
        savedAt: Date.now(),
      })
      toast.success({ message: '단어장에 담았어요.' })
      bumpMissionProgress('conversation', 1)
    }
  }

  return (
    <div className="space-y-4">
      {/* 일본어 표현 — 링크된 단어 표시 */}
      <div className="flex flex-wrap gap-2 items-center">
        {matches.length === 0 ? (
          // 매칭된 단어가 없으면 그냥 텍스트 표시
          <span className="text-lg font-medium">{phrase.japanese}</span>
        ) : (
          // 매칭 결과에 따라 링크와 일반 텍스트 분절
          <>
            {/* 첫 매칭까지의 텍스트 */}
            {matches[0].startIndex > 0 && (
              <span className="text-lg font-medium">{phrase.japanese.substring(0, matches[0].startIndex)}</span>
            )}

            {/* 매칭된 단어들 렌더링 */}
            {matches.map((match, index) => (
              <div key={`${match.word.id}-${index}`}>
                {/* 링크된 단어 칩 */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedWordId(match.word.id)}
                  className={`inline-flex flex-col items-center px-2 py-1 rounded-lg transition-colors ${
                    selectedWordId === match.word.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                  type="button"
                  aria-label={`${match.matchedText}. 뜻: ${match.word.meaning}`}
                >
                  <span className="text-sm font-medium">{match.matchedText}</span>
                  <span className="text-[10px] opacity-75">{hiraganaToRomaji(match.word.hiragana)}</span>
                </motion.button>

                {/* 다음 매칭까지의 텍스트 */}
                {index < matches.length - 1 && (
                  <span className="text-lg font-medium">
                    {phrase.japanese.substring(match.endIndex, matches[index + 1].startIndex)}
                  </span>
                )}
              </div>
            ))}

            {/* 마지막 매칭 이후의 텍스트 */}
            {matches[matches.length - 1].endIndex < phrase.japanese.length && (
              <span className="text-lg font-medium">
                {phrase.japanese.substring(matches[matches.length - 1].endIndex)}
              </span>
            )}
          </>
        )}
      </div>

      {/* 한국어 번역 */}
      <p className="text-base text-muted-foreground">{phrase.korean}</p>

      {/* 단어 상세 바텀시트 */}
      <AnimatePresence>
        {selectedWord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedWordId(null)}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* 바텀시트 콘텐츠 */}
      <AnimatePresence>
        {selectedWord && (
          <motion.div
            ref={bottomSheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-50 p-6 shadow-lg"
            style={{
              maxHeight: '60vh',
              overflowY: 'auto',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="단어 상세 정보"
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedWordId(null)}
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 단어 정보 */}
            <div className="space-y-6">
              {/* 한자 + 히라가나 + 로마자 */}
              <div className="text-center space-y-1">
                <div className="text-4xl font-bold text-primary">{selectedWord.kanji}</div>
                <div className="text-sm text-muted-foreground">{selectedWord.hiragana}</div>
                <div className="text-xs text-muted-foreground/70">{hiraganaToRomaji(selectedWord.hiragana)}</div>
              </div>

              {/* 뜻 */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">뜻</h3>
                <p className="text-lg">{selectedWord.meaning}</p>
              </div>

              {/* 레벨 */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">레벨</h3>
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                  N{selectedWord.level}
                </div>
              </div>

              {/* 예문 */}
              {selectedWord.example && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">예문</h3>
                  <div className="space-y-1 bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm">{selectedWord.example.japanese}</p>
                    <p className="text-xs text-muted-foreground">{selectedWord.example.korean}</p>
                  </div>
                </div>
              )}

              {/* 단어장 추가 버튼 */}
              <Button
                onClick={handleAddToMemo}
                variant={isMemoized ? 'outline' : 'default'}
                className="w-full"
                disabled={isParticle}
              >
                {isMemoized ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    <span>담아졌어요</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    <span>단어장에 담기</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
