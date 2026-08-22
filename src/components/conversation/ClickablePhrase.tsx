import { m } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'
import type { ConversationPhrase, ConversationWord, SavedConversationWord } from '@/types'

interface ClickablePhraseProps {
  phrase: ConversationPhrase
  categoryId: string
  onWordClick?: (word: ConversationWord, isSaved: boolean, isParticle: boolean) => void
  showReading?: boolean // 후리가나/로마자 표시 여부
}

export function ClickablePhrase({ phrase, categoryId, onWordClick, showReading = true }: ClickablePhraseProps) {
  const conversationMemo = useAppStore((state) => state.conversationMemo)
  const addConversationMemo = useAppStore((state) => state.addConversationMemo)
  const removeConversationMemo = useAppStore((state) => state.removeConversationMemo)
  const bumpMissionProgress = useAppStore((state) => state.bumpMissionProgress)

  const isWordSaved = (wordText: string) => {
    return conversationMemo.some((w) => w.text === wordText)
  }

  const handleWordClick = (word: ConversationWord) => {
    const isSaved = isWordSaved(word.text)
    const isParticle = word.isParticle === true

    if (onWordClick) {
      onWordClick(word, isSaved, isParticle)
    }

    if (isParticle) {
      return
    }

    if (isSaved) {
      removeConversationMemo(word.text)
    } else {
      const savedWord: SavedConversationWord = {
        text: word.text,
        reading: word.reading,
        meaning: word.meaning,
        sourcePhrase: phrase.japanese,
        category: categoryId,
        savedAt: Date.now(),
      }
      addConversationMemo(savedWord)
      bumpMissionProgress('conversation', 1)
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-1">
      {phrase.words.map((word, index) => {
        const isSaved = isWordSaved(word.text)
        const isParticle = word.isParticle === true
        const romaji = hiraganaToRomaji(word.reading)

        return (
          <m.div
            key={`${word.text}-${index}`}
            onClick={() => handleWordClick(word)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'cursor-pointer rounded px-1 py-0.5 transition-colors inline-flex flex-col items-center',
              isParticle
                ? 'text-muted-foreground'
                : isSaved
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-primary/10'
            )}
          >
            {/* 메인 텍스트 (한자/카타카나) */}
            <span className="text-xl font-medium">{word.text}</span>

            {/* 후리가나 & 로마자 */}
            {showReading && (
              <div className="flex flex-col items-center leading-tight">
                <span className="text-[10px] text-muted-foreground">
                  {word.reading}
                </span>
                <span className="romaji text-[9px] text-muted-foreground/70">
                  {romaji}
                </span>
              </div>
            )}
          </m.div>
        )
      })}
    </div>
  )
}
