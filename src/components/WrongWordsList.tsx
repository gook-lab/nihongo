import { m } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WORDS } from '@/data/words'
import { useAppStore } from '@/store'
import { TTSButton } from '@/components/TTSButton'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'

interface WrongWordsListProps {
  wordIds: string[]
  showRemoveButton?: boolean
}

export function WrongWordsList({
  wordIds,
  showRemoveButton = true,
}: WrongWordsListProps) {
  const { removeWrongWord } = useAppStore()

  // ID로 단어 정보 찾기
  const wrongWords = wordIds
    .map((id) => WORDS.find((w) => w.id === id))
    .filter(Boolean)

  if (wrongWords.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        오답 단어가 없습니다
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {wrongWords.map((word, index) => (
        <m.div
          key={word!.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-3 p-3 bg-muted rounded-xl"
        >
          {/* TTS 버튼 */}
          <TTSButton
            text={word!.kanji}
            variant="ghost"
            size="icon"
            className="shrink-0"
          />

          {/* 단어 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg">{word!.kanji}</span>
              <span className="text-sm text-muted-foreground">
                {word!.hiragana}
              </span>
              <span className="romaji text-xs text-muted-foreground/70">
                {hiraganaToRomaji(word!.hiragana)}
              </span>
            </div>
            <p className="text-sm text-primary font-medium truncate">
              {word!.meaning}
            </p>
          </div>

          {/* 삭제 버튼 */}
          {showRemoveButton && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => removeWrongWord(word!.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </m.div>
      ))}
    </div>
  )
}
