import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  Zap,
  RotateCcw,
  Home,
  Check,
  X,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useAppStore } from '@/store'
import { CONVERSATION_CATEGORIES } from '@/data/conversations'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'
import { haptic } from '@/lib/haptic'
import { getIconByName } from '@/lib/icon-map'
import { MascotScene } from '@/components/MascotScene'
import type { MascotReaction } from '@/components/MascotAvatar'
import type { ConversationPhrase } from '@/types'

function scoreToReaction(score: number): MascotReaction {
  if (score >= 90) return 'celebrate'
  if (score >= 70) return 'happy'
  if (score >= 40) return 'cheer'
  return 'encourage'
}

function scoreToBubble(score: number): string {
  if (score >= 90) return '완벽해요! 🎉'
  if (score >= 70) return '잘했어요!'
  if (score >= 40) return '거의 다 왔어요!'
  return '괜찮아요, 다시!'
}

const QUIZ_COUNT = 10
const XP_PER_CORRECT = 10

interface QuizQuestion {
  phrase: ConversationPhrase
  options: ConversationPhrase[] // phrase 객체 배열로 변경
  correctIndex: number
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// 단어별 읽기/로마자 컴포넌트
function WordsWithReading({ phrase }: { phrase: ConversationPhrase }) {
  return (
    <div className="flex flex-wrap items-end gap-1">
      {phrase.words.map((word, index) => {
        const romaji = hiraganaToRomaji(word.reading)
        return (
          <div key={`${word.text}-${index}`} className="inline-flex flex-col items-center">
            <span className="text-base font-medium">{word.text}</span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              {word.reading}
            </span>
            <span className="romaji text-[9px] text-muted-foreground/70 leading-tight">
              {romaji}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function ConversationQuizPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const addXP = useAppStore((state) => state.addXP)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)

  const category = CONVERSATION_CATEGORIES.find((c) => c.id === categoryId)

  const questions = useMemo<QuizQuestion[]>(() => {
    if (!category) return []

    const allPhrases = category.phrases
    const shuffledPhrases = shuffleArray(allPhrases).slice(0, QUIZ_COUNT)

    return shuffledPhrases.map((phrase) => {
      // 오답 선택지 생성 (다른 표현들에서)
      const otherPhrases = allPhrases.filter((p) => p.id !== phrase.id)
      const shuffledOthers = shuffleArray(otherPhrases).slice(0, 3)

      const options = [phrase, ...shuffledOthers]
      const shuffledOptions = shuffleArray(options)
      const correctIndex = shuffledOptions.findIndex((p) => p.id === phrase.id)

      return {
        phrase,
        options: shuffledOptions,
        correctIndex,
      }
    })
  }, [category])

  const currentQuestion = questions[currentIndex]
  const Icon = category ? getIconByName(category.icon) : getIconByName('MessageCircle')

  useEffect(() => {
    if (showResult) {
      const xpEarned = correctCount * XP_PER_CORRECT
      if (xpEarned > 0) {
        addXP(xpEarned)
      }
    }
  }, [showResult, correctCount, addXP])

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>카테고리를 찾을 수 없습니다</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>문제를 생성할 수 없습니다</p>
      </div>
    )
  }

  const handleOptionClick = (index: number) => {
    if (isAnswered) return

    setSelectedIndex(index)
    setIsAnswered(true)

    if (index === currentQuestion.correctIndex) {
      setCorrectCount((prev) => prev + 1)
      haptic.success()
    } else {
      haptic.error()
    }

    // 다음 문제로 자동 진행
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        setSelectedIndex(null)
        setIsAnswered(false)
      } else {
        setShowResult(true)
      }
    }, 1500)
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedIndex(null)
    setCorrectCount(0)
    setShowResult(false)
    setIsAnswered(false)
  }

  // 결과 화면
  if (showResult) {
    const xpEarned = correctCount * XP_PER_CORRECT
    const score = Math.round((correctCount / questions.length) * 100)

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ width: '100%', maxWidth: '24rem' }}
        >
          <Card>
            <CardContent className="p-6 text-center">
              <MascotScene
                reaction={scoreToReaction(score)}
                sizeToken="md"
                bubble={scoreToBubble(score)}
                className="mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">퀴즈 완료!</h2>
              <p className="text-4xl font-bold text-primary mb-2">{score}점</p>
              <p className="text-muted-foreground mb-4">
                {questions.length}문제 중 {correctCount}문제 정답
              </p>

              {xpEarned > 0 && (
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center gap-2 bg-primary/10 text-primary py-2 px-4 rounded-full mb-6"
                >
                  <Zap className="w-4 h-4" />
                  <span className="font-semibold">+{xpEarned} XP 획득!</span>
                </m.div>
              )}

              <div className="space-y-2">
                <Button
                  onClick={handleRestart}
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  다시 도전하기
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/conversation/${categoryId}`)}
                  className="w-full"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  표현 목록으로
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/conversation')}
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  회화 홈으로
                </Button>
              </div>
            </CardContent>
          </Card>
        </m.div>
      </div>
    )
  }

  // 정답/오답 피드백 — selectedIndex가 정답이면 happy, 아니면 encourage
  const isAnsweredCorrect =
    isAnswered && selectedIndex !== null && selectedIndex === currentQuestion.correctIndex
  const isAnsweredWrong =
    isAnswered && selectedIndex !== null && selectedIndex !== currentQuestion.correctIndex

  // 퀴즈 화면
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 정답/오답 마스코트 피드백 (1.5초 노출) */}
      <AnimatePresence>
        {(isAnsweredCorrect || isAnsweredWrong) && (
          <m.div
            initial={{ opacity: 0, scale: 0.6, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 right-4 z-50 pointer-events-none"
            style={{ width: 130 }}
          >
            <MascotScene
              reaction={isAnsweredCorrect ? 'happy' : 'shock'}
              sizeToken="xs"
              bubble={isAnsweredCorrect ? '잘했어요!' : '아이쿠!'}
              bubblePosition="top-left"
            />
          </m.div>
        )}
      </AnimatePresence>

      {/* 헤더 — sticky + backdrop-blur (다른 페이지와 톤 일치) */}
      <div className="pt-6 pb-3 px-5 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border-light">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/conversation/${categoryId}`)}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="type-h3">{category.nameKo} 퀴즈</span>
          </div>
          <div className="w-10" />
        </div>
        <div className="flex items-center gap-3">
          <Progress
            value={((currentIndex + 1) / questions.length) * 100}
            className="flex-1 h-2"
          />
          <span className="type-caption font-mono">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* 문제 */}
      <div className="px-5 mt-8">
        <AnimatePresence mode="wait">
          <m.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="mb-6">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">
                  다음 한국어에 맞는 일본어를 고르세요
                </p>
                <p className="text-xl font-semibold">
                  {currentQuestion.phrase.korean}
                </p>
              </CardContent>
            </Card>

            {/* 선택지 */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedIndex === index
                const isCorrect = index === currentQuestion.correctIndex
                const showCorrect = isAnswered && isCorrect
                const showWrong = isAnswered && isSelected && !isCorrect

                return (
                  <m.div
                    key={option.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      className={`w-full h-auto py-3 px-4 text-left flex items-center gap-3 rounded-xl border transition-all ${
                        showCorrect
                          ? 'bg-green-50 dark:bg-green-950/50 border-green-300 dark:border-green-700'
                          : showWrong
                            ? 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-700'
                            : isSelected
                              ? 'bg-primary/10 border-primary/50'
                              : 'bg-card border-border hover:border-primary/30 hover:bg-muted/30'
                      }`}
                      onClick={() => handleOptionClick(index)}
                      disabled={isAnswered}
                    >
                      {/* 넘버링 */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                          showCorrect
                            ? 'bg-green-500 text-white'
                            : showWrong
                              ? 'bg-red-500 text-white'
                              : isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <WordsWithReading phrase={option} />
                      </div>
                      {showCorrect && <Check className="w-5 h-5 text-green-500 shrink-0" />}
                      {showWrong && <X className="w-5 h-5 text-red-500 shrink-0" />}
                    </button>
                  </m.div>
                )
              })}
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
