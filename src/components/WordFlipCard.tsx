// 사전 단어 플립 카드 — 클릭하면 3D 뒤집기로 뜻+예문 표시.
// 앞면: kanji + 히라가나 + 로마자 + 배지. 뒷면: 뜻 + 예문 + TTS.
import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Star, RotateCcw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { TTSButton } from '@/components/TTSButton'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'
import { haptic } from '@/lib/haptic'
import type { Word } from '@/types'

interface Props {
  word: Word
  isWrong: boolean
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function WordFlipCard({ word, isWrong, isFavorite, onToggleFavorite }: Props) {
  const [flipped, setFlipped] = useState(false)

  const toggle = () => {
    haptic.tap()
    setFlipped((v) => !v)
  }

  return (
    <div
      style={{ perspective: 1000 }}
      onClick={toggle}
      role="button"
      tabIndex={0}
      className="cursor-pointer select-none"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggle()
        }
      }}
    >
      <div
        className="relative"
        style={{ transformStyle: 'preserve-3d', minHeight: 96 }}
      >
        <AnimatePresence initial={false} mode="wait">
          {!flipped ? (
            <m.div
              key="front"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1.05] }}
            >
              <Card className={isWrong ? 'border-orange-200 bg-orange-50' : ''}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    {/* TTS */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <TTSButton
                        text={word.kanji}
                        variant="ghost"
                        size="icon"
                        className="shrink-0 mt-1"
                      />
                    </div>

                    {/* 즐겨찾기 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite()
                      }}
                      className="shrink-0 mt-1 w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center"
                      aria-label={isFavorite ? '즐겨찾기 제거' : '즐겨찾기 추가'}
                    >
                      <Star
                        className="w-4 h-4"
                        style={{
                          color: isFavorite
                            ? 'var(--color-primary)'
                            : 'var(--color-text-tertiary)',
                          fill: isFavorite ? 'currentColor' : 'none',
                        }}
                      />
                    </button>

                    {/* 단어 정보 (앞면은 컴팩트 — 뜻 숨김) */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-end gap-3 flex-wrap">
                        <div className="flex flex-col items-center">
                          <span
                            className="font-bold text-xl"
                            style={{ fontFamily: '"Hiragino Sans","Noto Sans JP", serif' }}
                          >
                            {word.kanji}
                          </span>
                          <span className="text-[11px] text-muted-foreground leading-tight">
                            {word.hiragana}
                          </span>
                          <span className="romaji text-[10px] text-muted-foreground/70 leading-tight">
                            {hiraganaToRomaji(word.hiragana)}
                          </span>
                        </div>
                        <span
                          className="text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded"
                          style={{
                            background: 'var(--color-sakura-100)',
                            color: 'var(--color-primary)',
                          }}
                        >
                          N{word.level}
                        </span>
                        {isWrong && (
                          <span className="text-xs bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full">
                            복습 필요
                          </span>
                        )}
                        {word.id.startsWith('conv-') && (
                          <span
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                            style={{
                              background: 'var(--color-sakura-100)',
                              color: 'var(--color-primary)',
                            }}
                            title="회화 표현에서 추출된 단어"
                          >
                            회화
                          </span>
                        )}
                      </div>
                      <p
                        className="text-[10px] mt-2"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        탭하면 뜻이 나타나요
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </m.div>
          ) : (
            <m.div
              key="back"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1.05] }}
            >
              <Card
                className={isWrong ? 'border-orange-200' : ''}
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-sakura-100), var(--color-card))',
                }}
              >
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div onClick={(e) => e.stopPropagation()}>
                      <TTSButton
                        text={word.kanji}
                        variant="ghost"
                        size="icon"
                        className="shrink-0 mt-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-extrabold tracking-wider" style={{ color: 'var(--color-primary)' }}>
                        {word.kanji} · {word.hiragana}
                      </p>
                      <p className="text-lg font-bold mt-1">{word.meaning}</p>

                      {/* 예문 */}
                      {word.example && (() => {
                        const example = word.example
                        return (
                          <div className="mt-3 p-3 rounded-lg text-sm" style={{ background: 'var(--color-card)' }}>
                            <div className="flex items-start gap-2" onClick={(e) => e.stopPropagation()}>
                              <TTSButton
                                text={example.japanese}
                                variant="ghost"
                                size="icon"
                                className="shrink-0 h-6 w-6"
                              />
                              <p className="font-japanese flex-1">
                                {example.japanese.split(example.targetWord).map((part, i, arr) => (
                                  <span key={i}>
                                    {part}
                                    {i < arr.length - 1 && (
                                      <span className="font-bold text-primary">
                                        {example.targetWord}
                                      </span>
                                    )}
                                  </span>
                                ))}
                              </p>
                            </div>
                            {example.reading && (
                              <div className="mt-1">
                                <p className="text-xs text-muted-foreground">{example.reading}</p>
                                <p className="romaji text-[10px] text-muted-foreground/70">
                                  {hiraganaToRomaji(example.reading)}
                                </p>
                              </div>
                            )}
                            <p className="text-muted-foreground mt-1">{example.korean}</p>
                          </div>
                        )
                      })()}
                    </div>
                    <RotateCcw
                      className="w-3.5 h-3.5 mt-1.5 shrink-0"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
