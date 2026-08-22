import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Check, X, Trophy, RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TTSButton } from '@/components/TTSButton'
import { MascotAvatar } from '@/components/MascotAvatar'
import { useTTS } from '@/hooks/useTTS'
import { cn } from '@/lib/utils'
import { BASIC_KANA, type KanaChar } from '@/data/kana'

type KanaType = 'hiragana' | 'katakana'
type Phase = 'start' | 'countdown' | 'playing' | 'feedback' | 'result'

interface Question {
  correctChar: KanaChar
  options: KanaChar[]
}

interface Answer {
  isCorrect: boolean
  correctChar: KanaChar
}

// 헬퍼: 모든 가나 문자 평면 배열 (빈 문자 제외)
function getAllKanaChars(): KanaChar[] {
  return BASIC_KANA.flat().filter(char => char.hiragana)
}

// 헬퍼: 문제 생성
function generateQuestions(count: number): Question[] {
  const allChars = getAllKanaChars()
  const shuffled = [...allChars].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, count)

  return selected.map(correctChar => {
    const otherChars = allChars
      .filter(c => c.hiragana !== correctChar.hiragana)
      .sort(() => Math.random() - 0.5)
      .slice(0, 9)

    const options = [...otherChars, correctChar].sort(() => Math.random() - 0.5)
    return { correctChar, options }
  })
}

// 귀여운 고양이 마스코트 컴포넌트

export function KanaGamePage() {
  const navigate = useNavigate()
  const { speak } = useTTS({ forceBrowser: true }) // 카나 게임은 항상 브라우저 TTS 사용

  // 게임 상태
  const [phase, setPhase] = useState<Phase>('start')
  const [kanaType, setKanaType] = useState<KanaType>('hiragana')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentRound, setCurrentRound] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [timeRemaining, setTimeRemaining] = useState(10)
  const [countdown, setCountdown] = useState(5)
  const [lastAnswer, setLastAnswer] = useState<Answer | null>(null)

  const currentQuestion = questions[currentRound]
  const hasPlayedAudio = useRef(false)

  // 게임 시작
  const startGame = useCallback(() => {
    setQuestions(generateQuestions(10))
    setCurrentRound(0)
    setAnswers([])
    setCountdown(5)
    setPhase('countdown')
  }, [])

  // 답 선택 (피드백에서는 음성 출력 안함)
  const handleAnswer = useCallback((selected: KanaChar) => {
    if (phase !== 'playing' || !currentQuestion) return

    const isCorrect = selected.hiragana === currentQuestion.correctChar.hiragana
    const answer: Answer = { isCorrect, correctChar: currentQuestion.correctChar }

    setAnswers(prev => [...prev, answer])
    setLastAnswer(answer)
    setPhase('feedback')
  }, [phase, currentQuestion])

  // 시간 초과 (피드백에서는 음성 출력 안함)
  const handleTimeout = useCallback(() => {
    if (!currentQuestion) return

    const answer: Answer = { isCorrect: false, correctChar: currentQuestion.correctChar }
    setAnswers(prev => [...prev, answer])
    setLastAnswer(answer)
    setPhase('feedback')
  }, [currentQuestion])

  // 다음 라운드
  const nextRound = useCallback(() => {
    if (currentRound + 1 >= 10) {
      setPhase('result')
    } else {
      setCurrentRound(r => r + 1)
      setTimeRemaining(10)
      setPhase('playing')
    }
  }, [currentRound])

  // 카운트다운 타이머
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown <= 0) {
      setPhase('playing')
      setTimeRemaining(10)
      return
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [phase, countdown])

  // 게임 타이머
  useEffect(() => {
    if (phase !== 'playing') return
    if (timeRemaining <= 0) {
      handleTimeout()
      return
    }
    const timer = setTimeout(() => setTimeRemaining(t => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [phase, timeRemaining, handleTimeout])

  // 타이머가 10→9가 될 때 음성 재생
  useEffect(() => {
    if (phase === 'playing' && timeRemaining === 9 && currentQuestion && !hasPlayedAudio.current) {
      hasPlayedAudio.current = true
      speak(currentQuestion.correctChar.hiragana)
    }
  }, [phase, timeRemaining, currentQuestion, speak])

  // 라운드 변경 시 오디오 플래그 리셋
  useEffect(() => {
    hasPlayedAudio.current = false
  }, [currentRound])

  // 피드백 후 자동 진행
  useEffect(() => {
    if (phase !== 'feedback') return
    const timer = setTimeout(nextRound, 1500)
    return () => clearTimeout(timer)
  }, [phase, nextRound])

  // 게임 리셋
  const resetGame = useCallback(() => {
    setPhase('start')
    setCurrentRound(0)
    setQuestions([])
    setAnswers([])
    setLastAnswer(null)
  }, [])

  // 결과 계산
  const correctCount = answers.filter(a => a.isCorrect).length
  const score = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0
  const wrongChars = answers.filter(a => !a.isCorrect).map(a => a.correctChar)

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <AnimatePresence mode="wait">
        {/* 시작 화면 */}
        {phase === 'start' && (
          <m.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex flex-col"
          >
            <div className="flex items-center p-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/kana')} aria-label="뒤로가기">
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-6">
              {/* 큰 마스코트 (응원하며 함께 시작) */}
              <m.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mb-6"
              >
                <MascotAvatar size="3xl" reaction="cheer" />
              </m.div>

              <m.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-2"
              >
                가나 맞추기 게임
              </m.h1>

              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground text-center mb-8"
              >
                소리를 듣고 맞는 글자를 찾아보세요!
              </m.p>

              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-3 mb-8"
              >
                {(['hiragana', 'katakana'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setKanaType(type)}
                    className={cn(
                      'px-6 py-3 rounded-xl font-medium transition-all',
                      kanaType === type
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {type === 'hiragana' ? 'ひらがな' : 'カタカナ'}
                  </button>
                ))}
              </m.div>

              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-muted rounded-2xl p-5 mb-8 w-[320px]"
              >
                <div className="text-sm space-y-3 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0">🎵</span>
                    <span className="text-left">총 10문제가 출제됩니다</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="shrink-0">⏱️</span>
                    <span className="text-left">각 문제당 10초의 시간이 주어집니다</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="shrink-0">🎯</span>
                    <span className="text-left">소리를 듣고 맞는 글자를 터치하세요</span>
                  </div>
                </div>
              </m.div>

              <m.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
              >
                <Button
                  onClick={startGame}
                  size="lg"
                  className="px-12 py-6 text-xl font-bold rounded-2xl shadow-lg"
                >
                  START
                </Button>
              </m.div>
            </div>
          </m.div>
        )}

        {/* 카운트다운 */}
        {phase === 'countdown' && (
          <m.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="min-h-screen flex flex-col items-center justify-center gap-8"
          >
            {/* 카운트다운 숫자 */}
            <AnimatePresence mode="wait">
              <m.div
                key={countdown}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.5, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-8xl font-bold text-primary"
              >
                {countdown > 0 ? countdown : 'GO!'}
              </m.div>
            </AnimatePresence>

            {/* 안내 텍스트 */}
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-sm"
            >
              캐릭터를 터치하면 미리 들어볼 수 있어요
            </m.p>
          </m.div>
        )}

        {/* 게임 플레이 */}
        {phase === 'playing' && currentQuestion && (
          <m.div
            key={`playing-${currentRound}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="min-h-screen flex flex-col"
          >
            {/* 고정 헤더 */}
            <div className="sticky top-0 z-10 bg-gradient-to-b from-primary/10 to-transparent pb-2">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{currentRound + 1} / 10</span>
                  <m.span
                    animate={timeRemaining <= 3 ? {
                      scale: [1, 1.2, 1],
                      color: ['#ef4444', '#dc2626', '#ef4444']
                    } : {}}
                    transition={{ duration: 0.5, repeat: timeRemaining <= 3 ? Infinity : 0 }}
                    className={cn(
                      'text-2xl font-bold',
                      timeRemaining <= 3 && 'text-red-500',
                      timeRemaining > 3 && timeRemaining <= 5 && 'text-amber-500'
                    )}
                  >
                    {timeRemaining}
                  </m.span>
                </div>
                <Progress value={((currentRound + 1) / 10) * 100} className="h-2" />
              </div>

              {/* 정답 음절 표시 + 음성 재생 버튼 */}
              <div className="flex flex-col items-center pb-2">
                <div className="text-center mb-2">
                  <p className="text-sm font-medium text-foreground">{currentQuestion.correctChar.romaji}</p>
                  <p className="text-xs text-muted-foreground">{currentQuestion.correctChar.korean}</p>
                </div>
                <TTSButton
                  text={currentQuestion.correctChar.hiragana}
                  label="다시 듣기"
                  variant="outline"
                  forceBrowser
                />
              </div>
            </div>

            {/* 문자들 (마인드맵 스타일 - 퍼진 레이아웃) */}
            <div className="flex-1 relative overflow-hidden">
              {/* 10개 옵션의 고정 위치 (겹치지 않게 배치) */}
              {currentQuestion.options.map((char, index) => {
                // 마인드맵 스타일 위치 (화면을 10개 영역으로 분할)
                const positions = [
                  { top: '5%', left: '15%' },
                  { top: '3%', left: '55%' },
                  { top: '8%', right: '8%' },
                  { top: '28%', left: '5%' },
                  { top: '25%', right: '18%' },
                  { top: '45%', left: '25%' },
                  { top: '48%', right: '5%' },
                  { top: '65%', left: '8%' },
                  { top: '62%', left: '50%' },
                  { top: '78%', right: '15%' },
                ]
                const pos = positions[index]

                return (
                  <m.button
                    key={`${char.hiragana}-${index}-${currentRound}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAnswer(char)}
                    style={pos}
                    className="absolute w-[56px] h-[56px] rounded-full bg-background shadow-lg flex items-center justify-center text-2xl font-bold hover:shadow-xl active:bg-primary/10 transition-all"
                  >
                    {kanaType === 'katakana' ? char.katakana : char.hiragana}
                  </m.button>
                )
              })}
            </div>

            {/* 고정 하단 안내 */}
            <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-4 pb-6">
              <p className="text-muted-foreground text-sm text-center">
                🎵 들리는 소리의 글자를 찾아 터치하세요
              </p>
            </div>
          </m.div>
        )}

        {/* 피드백 */}
        {phase === 'feedback' && lastAnswer && (
          <m.div
            key="feedback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <m.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-[320px] bg-background rounded-3xl shadow-2xl p-8 text-center"
            >
              {/* 마스코트 반응 (정답 happy / 오답 cheer = 격려) */}
              <div className="flex justify-center mb-4">
                <MascotAvatar
                  size="xl"
                  reaction={lastAnswer.isCorrect ? 'happy' : 'cheer'}
                />
              </div>

              {/* 정답/오답 아이콘 */}
              <m.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
                className={cn(
                  'w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6',
                  lastAnswer.isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                )}
              >
                {lastAnswer.isCorrect ? (
                  <Check className="w-10 h-10 text-green-600" />
                ) : (
                  <X className="w-10 h-10 text-red-600" />
                )}
              </m.div>

              {/* 정답 문자 */}
              <m.div
                initial={{ scale: 0.5, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", delay: 0.2 }}
                className={cn(
                  'text-8xl font-bold mb-4',
                  lastAnswer.isCorrect ? 'text-green-600' : 'text-red-600'
                )}
              >
                {kanaType === 'katakana'
                  ? lastAnswer.correctChar.katakana
                  : lastAnswer.correctChar.hiragana}
              </m.div>

              {/* 발음 정보 */}
              <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-1"
              >
                <p className="text-2xl font-medium text-muted-foreground">{lastAnswer.correctChar.romaji}</p>
                <p className="text-lg text-muted-foreground">{lastAnswer.correctChar.korean}</p>
              </m.div>
            </m.div>
          </m.div>
        )}

        {/* 결과 화면 */}
        {phase === 'result' && (
          <m.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <m.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-[340px]"
            >
              <Card className="mb-6">
                <CardContent className="pt-8 pb-6 text-center">
                  <m.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="text-6xl mb-4"
                  >
                    {score >= 90 ? '🎉' : score >= 70 ? '👏' : score >= 50 ? '💪' : '🌱'}
                  </m.div>

                  <m.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold mb-6"
                  >
                    {score >= 90 ? '완벽해요!' : score >= 70 ? '잘했어요!' : score >= 50 ? '좋은 시작이에요!' : '조금 더 연습해봐요!'}
                  </m.h1>

                  <m.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center mb-6"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <Trophy className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-3xl font-bold text-primary">{score}%</p>
                      <p className="text-sm text-muted-foreground">{correctCount}/10</p>
                    </div>
                  </m.div>

                  <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3"
                  >
                    <Button onClick={resetGame} className="w-full h-12">
                      <RotateCcw className="w-5 h-5 mr-2" />
                      다시 도전하기
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/kana')} className="w-full h-12">
                      <Home className="w-5 h-5 mr-2" />
                      발음표로 돌아가기
                    </Button>
                  </m.div>
                </CardContent>
              </Card>

              {/* 틀린 문자 복습 */}
              {wrongChars.length > 0 && (
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card>
                    <CardContent className="p-5">
                      <h2 className="font-semibold mb-4">📝 복습이 필요한 글자</h2>
                      <div className="grid grid-cols-5 gap-2">
                        {wrongChars.map((char, index) => (
                          <m.button
                            key={`wrong-${char.hiragana}-${index}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + index * 0.05 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => speak(char.hiragana)}
                            className="aspect-square  dark:bg-red-50 border border-red-200 dark:border-red-800 rounded-xl flex flex-col items-center justify-center"
                          >
                            <span className="text-xl font-bold  text-primary">
                              {kanaType === 'katakana' ? char.katakana : char.hiragana}
                            </span>
                            <span className="text-xs text-primary">{char.romaji}</span>
                          </m.button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        터치하면 발음을 들을 수 있어요
                      </p>
                    </CardContent>
                  </Card>
                </m.div>
              )}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
