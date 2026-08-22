// 플래시카드 모드 — 사전 단어를 1장씩 표시, framer-motion drag로 좌우 스와이프.
// 탭하면 플립 (앞=한자+히라가나, 뒤=뜻+예문).
import { useState } from 'react'
import { m, AnimatePresence, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, RotateCcw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { TTSButton } from '@/components/TTSButton'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'
import { haptic } from '@/lib/haptic'
import type { Word } from '@/types'

interface Props {
  words: Word[]
  initialIndex?: number
  favoriteWordIds: string[]
  onToggleFavorite: (id: string) => void
}

const SWIPE_THRESHOLD = 60
const SWIPE_VELOCITY = 200

export function FlashcardView({
  words,
  initialIndex = 0,
  favoriteWordIds,
  onToggleFavorite,
}: Props) {
  const [index, setIndex] = useState(Math.min(initialIndex, words.length - 1))
  const [flipped, setFlipped] = useState(false)
  const [direction, setDirection] = useState<1 | -1>(1)

  if (words.length === 0) return null
  const word = words[index]
  const isFavorite = favoriteWordIds.includes(word.id)

  const goNext = () => {
    if (index >= words.length - 1) return
    haptic.tap()
    setDirection(1)
    setFlipped(false)
    setIndex(index + 1)
  }

  const goPrev = () => {
    if (index <= 0) return
    haptic.tap()
    setDirection(-1)
    setFlipped(false)
    setIndex(index - 1)
  }

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -SWIPE_VELOCITY) {
      goNext()
    } else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > SWIPE_VELOCITY) {
      goPrev()
    }
  }

  const handleTap = () => {
    haptic.tap()
    setFlipped((v) => !v)
  }

  // 진척 텍스트
  const progress = `${index + 1} / ${words.length}`

  return (
    <div className="w-full select-none" style={{ maxWidth: 420, margin: '0 auto' }}>
      {/* 진척 + 좌우 버튼 */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          onClick={goPrev}
          disabled={index <= 0}
          className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30"
          style={{ background: 'var(--color-card)', border: '1.5px solid var(--color-border-light)' }}
          aria-label="이전 카드"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-extrabold tracking-wider font-mono"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            {progress}
          </span>
          {/* 진척 점 */}
          <div className="flex gap-1">
            {words.slice(0, Math.min(7, words.length)).map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full"
                style={{
                  width: i === index ? 12 : 4,
                  background: i === index ? 'var(--color-primary)' : 'var(--color-border)',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={goNext}
          disabled={index >= words.length - 1}
          className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30"
          style={{ background: 'var(--color-card)', border: '1.5px solid var(--color-border-light)' }}
          aria-label="다음 카드"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 플래시카드 */}
      <div style={{ perspective: 1000, minHeight: 320 }}>
        <AnimatePresence custom={direction} mode="wait">
          <m.div
            key={`${word.id}-${flipped}`}
            custom={direction}
            initial={{
              opacity: 0,
              x: direction * 60,
              rotateY: flipped ? -90 : 0,
            }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{
              opacity: 0,
              x: direction * -40,
              rotateY: flipped ? 90 : 0,
            }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1.05] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            onClick={handleTap}
            style={{ touchAction: 'pan-y' }}
            className="cursor-grab active:cursor-grabbing"
          >
            <Card className="overflow-hidden">
              <CardContent
                className="p-6 flex flex-col items-center justify-center text-center"
                style={{
                  minHeight: 280,
                  background: flipped
                    ? 'linear-gradient(135deg, var(--color-sakura-100), var(--color-card))'
                    : undefined,
                }}
              >
                {/* 우상단 즐겨찾기 + 플립 힌트 */}
                <div className="w-full flex items-center justify-between mb-3">
                  <span
                    className="text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded"
                    style={{
                      background: 'var(--color-sakura-100)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    N{word.level}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleFavorite(word.id)
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
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
                </div>

                {!flipped ? (
                  // 앞면: 한자 큰 + 발음
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <p
                      className="font-bold leading-none"
                      style={{
                        fontFamily: '"Hiragino Sans","Noto Sans JP", serif',
                        fontSize: 64,
                        letterSpacing: '-2px',
                      }}
                    >
                      {word.kanji}
                    </p>
                    <p
                      className="text-sm mt-3"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {word.hiragana}
                    </p>
                    <p
                      className="text-[11px] mt-1 font-mono"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      {hiraganaToRomaji(word.hiragana)}
                    </p>
                    <div className="flex items-center gap-2 mt-5" onClick={(e) => e.stopPropagation()}>
                      <TTSButton text={word.kanji} variant="outline" size="sm" label="발음" />
                    </div>
                    <p
                      className="text-[10px] mt-4 flex items-center gap-1"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      <RotateCcw className="w-3 h-3" />
                      탭하면 뜻
                    </p>
                  </div>
                ) : (
                  // 뒷면: 뜻 + 예문
                  <div className="flex-1 flex flex-col justify-center w-full">
                    <p
                      className="type-eyebrow"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {word.kanji} · {word.hiragana}
                    </p>
                    <p className="text-2xl font-bold mt-1.5">{word.meaning}</p>

                    {word.example && (
                      <div
                        className="mt-4 p-3 rounded-xl text-left"
                        style={{ background: 'var(--color-card)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-start gap-2">
                          <TTSButton
                            text={word.example.japanese}
                            variant="ghost"
                            size="icon"
                            className="shrink-0 h-6 w-6"
                          />
                          <p className="text-sm font-bold flex-1">{word.example.japanese}</p>
                        </div>
                        {word.example.reading && (
                          <p
                            className="text-[11px] mt-1"
                            style={{ color: 'var(--color-text-tertiary)' }}
                          >
                            {word.example.reading}
                          </p>
                        )}
                        <p
                          className="text-xs mt-1"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {word.example.korean}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </m.div>
        </AnimatePresence>
      </div>

      {/* 스와이프 힌트 */}
      <p
        className="text-center text-[10px] mt-3"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        ← 좌우 스와이프로 이동 · 탭하면 뒤집기 →
      </p>
    </div>
  )
}
