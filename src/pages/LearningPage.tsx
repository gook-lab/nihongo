import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { Lightbulb, Check, X, BookmarkPlus, ArrowRight } from 'lucide-react'
import { LottieLight } from '@/components/LottieLight'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Header } from '@/components/Header'
import { TTSButton } from '@/components/TTSButton'
import { useAppStore } from '@/store'
import { getLearningWords, resolveWordsByIds } from '@/data/words'
import { QUESTIONS_PER_SESSION } from '@/constants'
import type { Word } from '@/types'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'
import { isAnswerCorrect, isJapaneseAnswerCorrect } from '@/lib/answerMatcher'
import { haptic } from '@/lib/haptic'
import { CanvasAnswerInput, type CanvasAnswerHandle } from '@/components/CanvasAnswerInput'
import { CanvasCompare } from '@/components/CanvasCompare'
import { scoreKanjiDrawing } from '@/lib/kanjiPractice'
import { LearningPrepScreen } from '@/components/LearningPrepScreen'
import { MascotScene } from '@/components/MascotScene'
import { LoadingScreen } from '@/components/LoadingScreen'
import { trackEvent } from '@/lib/analytics'
import { QuickAudioSettings } from '@/components/QuickAudioSettings'
import { toast } from '@/lib/toast'
import successCheckAnimation from '@/assets/lottie/success-check.json'

type AnswerState = 'waiting' | 'correct' | 'wrong' | 'wrong-popup'
type QuestionType = 'standard' | 'reverse' | 'listening'
// standard: 일본어 보고 한국어 입력
// reverse: 한국어 보고 일본어 입력
// listening: TTS 듣고 한국어 입력 (일본어 표시 없음)

// 단어 ID 기반으로 결정적으로 questionType 결정 (재진입 시 일관성)
// enabled 배열 안에서만 선택. 비어있으면 standard.
function questionTypeFor(wordId: string, enabled: QuestionType[]): QuestionType {
  if (enabled.length === 0) return 'standard'
  if (enabled.length === 1) return enabled[0]
  const hash = wordId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return enabled[hash % enabled.length]
}

// 힌트 — 첫 글자만 노출하고 나머지는 ●로 가려 글자 수를 알려준다.
// 쉼표로 여러 뜻이 있으면 첫 번째 뜻만 사용.
function buildHint(raw: string): string {
  const first = raw.split(/[,、/]/)[0].trim()
  const chars = [...first]
  if (chars.length <= 1) return first
  return `${chars[0]} ${'●'.repeat(chars.length - 1)} (${chars.length}글자)`
}

export function LearningPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isResuming = (location.state as { resume?: boolean })?.resume ?? false
  const favoritesOnly = (location.state as { favoritesOnly?: boolean })?.favoritesOnly ?? false
  const weakOnly = (location.state as { weakOnly?: boolean })?.weakOnly ?? false
  const grammarLevel = (location.state as { grammarLevel?: 'N5' | 'N4' | 'N3' })?.grammarLevel

  const {
    currentSession,
    startSession,
    submitAnswer,
    completeSession,
    addWrongWord,
    removeWrongWord,
    wrongWordIds,
    saveLearning,
    resumeLearning,
    clearSavedLearning,
    recordSrsReview,
    bumpMissionProgress,
    ensureTodaysMissions,
  } = useAppStore()
  const enabledQuizTypes = useAppStore((s) => s.enabledQuizTypes)
  const useCanvasForReverse = useAppStore((s) => s.useCanvasForReverse)

  const [words, setWords] = useState<Word[]>([])
  const [answer, setAnswer] = useState('')
  const [answerState, setAnswerState] = useState<AnswerState>('waiting')
  const [showHint, setShowHint] = useState(false)
  const [wrongWord, setWrongWord] = useState<Word | null>(null)
  // 캔버스 모드 채점 결과 — 내 글씨 스냅샷 + 정답 글자 비교용
  const [canvasResult, setCanvasResult] = useState<{
    snapshot: string
    target: string
    score: number
    word: Word
  } | null>(null)
  const [showSuccessFlash, setShowSuccessFlash] = useState(false)
  const [showLottie, setShowLottie] = useState(false)
  const [showQuickAudio, setShowQuickAudio] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const canvasAnswerRef = useRef<CanvasAnswerHandle>(null)
  const wordsRef = useRef<Word[]>([])
  const correctStreakRef = useRef(0)

  // 준비 단계 (prep) — 새 세션 시 유형 선택 화면. 이어하기는 즉시 본 세션.
  const [showPrep, setShowPrep] = useState(!isResuming)

  // 세션 시작 또는 복원
  useEffect(() => {
    ensureTodaysMissions()
    if (isResuming) {
      const saved = resumeLearning()
      if (saved) {
        // 저장된 id를 현재 단어 데이터로 다시 조회 (데이터 수정 반영)
        const resumed = resolveWordsByIds(saved.wordIds)
        if (resumed.length === QUESTIONS_PER_SESSION) {
          setWords(resumed)
          wordsRef.current = resumed
          return
        }
        // 해석 실패(데이터 변경·구버전 세션) — 저장 세션 폐기 후 prep
        clearSavedLearning()
      }
      // 이어하기 데이터 없으면 prep 화면 표시
      setShowPrep(true)
    }
  }, [isResuming, resumeLearning, clearSavedLearning, ensureTodaysMissions])

  // prep 화면에서 "시작" 클릭 시 호출
  const handleStartFromPrep = () => {
    startSession()
    const allWords = getLearningWords(QUESTIONS_PER_SESSION, favoritesOnly, weakOnly)
    // grammarLevel이 지정되면 해당 레벨 단어만 필터 (Grammar→Learn 진입)
    const newWords = grammarLevel
      ? allWords.filter((w) => `N${w.level}` === grammarLevel).slice(0, QUESTIONS_PER_SESSION)
      : allWords
    setWords(newWords)
    wordsRef.current = newWords
    clearSavedLearning()
    setShowPrep(false)
  }

  const currentIndex = currentSession?.questionIndex ?? 0
  const currentWord = words[currentIndex]
  const questionType: QuestionType = currentWord
    ? questionTypeFor(currentWord.id, enabledQuizTypes)
    : 'standard'
  // reverse 타입 + 캔버스 모드면 input 대신 손글씨 캔버스
  const useCanvasMode = questionType === 'reverse' && useCanvasForReverse

  // 세션 저장 함수 (페이지 이탈 시)
  const saveCurrentSession = useCallback(() => {
    if (wordsRef.current.length > 0 && currentSession && currentSession.questionIndex < QUESTIONS_PER_SESSION) {
      saveLearning(wordsRef.current)
    }
  }, [currentSession, saveLearning])

  // 뒤로가기 처리 — 진행 중이면 격려 메시지 + 자동 저장 안내
  const handleBack = useCallback(() => {
    saveCurrentSession()
    // 진행 중일 때만 격려 (시작 직후 0 진행은 silent)
    if (currentSession && currentSession.questionIndex > 0 && currentSession.questionIndex < QUESTIONS_PER_SESSION) {
      const messages = [
        '여기까지 잘 왔어요. 진행 상황은 자동 저장됐어요 💪',
        '괜찮아요. 나중에 이어할 수 있어요 🌱',
        '한 걸음 한 걸음이 쌓여요. 다음에 또 봐요 ✨',
      ]
      const msg = messages[Math.floor(Math.random() * messages.length)]
      toast.info({ message: msg })
    }
    navigate('/')
  }, [saveCurrentSession, navigate, currentSession])

  // 글로벌 Esc — input 외 영역에서도 학습 중단 가능
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleBack()
      }
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [handleBack])

  // 페이지 떠나려 할 때 (탭 닫기·새로고침·뒤로가기) 경고 — 학습 중에만.
  // saveCurrentSession이 자동 저장하지만, 사용자에게 의도 확인.
  useEffect(() => {
    const inProgress =
      !showPrep && currentSession && currentSession.questionIndex < QUESTIONS_PER_SESSION
    if (!inProgress) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // 학습 진행 중이면 confirm 표시 (브라우저별 메시지 자동)
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [showPrep, currentSession])

  // 정답 체크
  const checkAnswer = () => {
    if (!currentWord || answerState !== 'waiting') return

    let isCorrect: boolean
    if (useCanvasMode) {
      // 캔버스 손글씨 모드 — 한자 또는 히라가나 타겟. 60점 이상 정답.
      const canvas = canvasAnswerRef.current?.getCanvas()
      if (!canvas) return
      // 한자가 있으면 한자로, 없으면 히라가나로 채점
      const target = /[一-龯]/.test(currentWord.kanji)
        ? currentWord.kanji
        : currentWord.hiragana
      const score = scoreKanjiDrawing(canvas, target, 280)
      isCorrect = score.total >= 60
      // 내 글씨 스냅샷 캡처 — 정답/오답 모두 비교 타일 표시
      setCanvasResult({
        snapshot: canvas.toDataURL('image/png'),
        target,
        score: score.total,
        word: currentWord,
      })
    } else {
      const trimmedAnswer = answer.trim()
      isCorrect =
        questionType === 'reverse'
          ? isJapaneseAnswerCorrect(trimmedAnswer, currentWord.hiragana, currentWord.kanji)
          : isAnswerCorrect(trimmedAnswer, currentWord.meaning) ||
            isJapaneseAnswerCorrect(trimmedAnswer, currentWord.hiragana, currentWord.kanji)
    }

    submitAnswer(currentWord.id, isCorrect)
    recordSrsReview(currentWord.id, isCorrect)
    bumpMissionProgress('learn-words', 1)

    if (isCorrect) {
      correctStreakRef.current += 1
      haptic.success()
      setAnswerState('correct')

      bumpMissionProgress('streak-correct', 1)
      if (wrongWordIds.includes(currentWord.id)) {
        removeWrongWord(currentWord.id)
        bumpMissionProgress('review-wrong', 1)
      }

      if (useCanvasMode) {
        // 캔버스 모드 — 비교 팝업이 뜨므로 플래시/Lottie/자동 진행 생략
        return
      }

      setShowSuccessFlash(true)
      setShowLottie(true)

      // 플래시 효과 해제
      setTimeout(() => {
        setShowSuccessFlash(false)
      }, 500)

      // Lottie 애니메이션 후 다음 문제로
      setTimeout(() => {
        setShowLottie(false)
        goToNextQuestion()
      }, 1200)
    } else {
      // 오답이면 팝업 표시 — 다이얼로그 안의 MascotScene이 shock + "아이쿠!" 표시
      correctStreakRef.current = 0
      haptic.error()
      setWrongWord(currentWord)
      setAnswerState('wrong-popup')
    }
  }

  // 다음 문제로 이동
  const goToNextQuestion = () => {
    if (currentIndex + 1 >= QUESTIONS_PER_SESSION) {
      clearSavedLearning()
      const result = completeSession()
      trackEvent('learn-completed', { score: result.score, xp: result.xpEarned })
      navigate('/result', { state: result })
    } else {
      setAnswer('')
      setAnswerState('waiting')
      setShowHint(false)
      setWrongWord(null)
      setCanvasResult(null)
      inputRef.current?.focus()
    }
  }

  // 오답 팝업에서 오답노트 추가 선택
  const handleAddToWrongWords = () => {
    if (wrongWord) {
      addWrongWord(wrongWord.id)
      toast.info({
        message: `"${wrongWord.kanji}" 오답노트에 저장됐어요`,
        id: `wrong-${wrongWord.id}`,
      })
    }
    goToNextQuestion()
  }

  // 오답 팝업에서 그냥 진행 선택
  const handleSkipWrongWords = () => {
    goToNextQuestion()
  }

  // 키보드 단축키 처리
  // Enter: 답안 제출 (waiting) 또는 다음 문제 (wrong-popup)
  // Tab: 힌트 토글 (waiting 시)
  // Esc: 학습 중단 + 진행 저장 후 홈으로
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (answerState === 'waiting') {
        checkAnswer()
      } else if (answerState === 'wrong-popup') {
        e.preventDefault()
        handleSkipWrongWords()
      }
    } else if (e.key === 'Tab' && answerState === 'waiting') {
      e.preventDefault()
      setShowHint((v) => !v)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleBack()
    }
  }

  // 0단계: 준비 화면 — 유형 선택 + 시작 버튼
  if (showPrep) {
    return <LearningPrepScreen onStart={handleStartFromPrep} onBack={handleBack} />
  }

  if (!currentWord) {
    return (
      <LoadingScreen
        variant="hiragana"
        title="시작하는 중"
        description="오늘의 첫 학습을 준비하고 있어요"
      />
    )
  }

  // 예문에서 타겟 단어 하이라이트
  const highlightExample = (text: string, target: string) => {
    const parts = text.split(target)
    return parts.map((part, i) => (
      <span key={i}>
        {part}
        {i < parts.length - 1 && (
          <span className="font-bold text-primary">{target}</span>
        )}
      </span>
    ))
  }

  // reverse/listening 문제용 — 정답 단어 + 뒤따르는 오쿠리가나(활용 어미)까지
  // 한 덩어리로 블록 처리한다 (예문이 정답을 노출하지 않도록).
  const maskExample = (text: string, target: string) => {
    if (!target) return text
    const segments: Array<{ text: string; masked: boolean }> = []
    let i = 0
    while (i < text.length) {
      if (text.startsWith(target, i)) {
        let end = i + target.length
        // 한자(target) 뒤에 이어지는 히라가나(오쿠리가나·활용)를 마스크 범위에 포함
        while (end < text.length && /[ぁ-ん]/.test(text[end])) end++
        segments.push({ text: text.slice(i, end), masked: true })
        i = end
      } else {
        const next = text.indexOf(target, i)
        const stop = next === -1 ? text.length : next
        segments.push({ text: text.slice(i, stop), masked: false })
        i = stop
      }
    }
    return segments.map((seg, idx) =>
      seg.masked ? (
        <span
          key={idx}
          className="bg-primary text-transparent rounded px-1.5 select-none"
        >
          {seg.text}
        </span>
      ) : (
        <span key={idx}>{seg.text}</span>
      ),
    )
  }

  // 한국어 예문에서 정답(뜻)에 해당하는 부분을 블록 처리
  const blockMeaningInKorean = (koreanText: string, meaning: string) => {
    // 단어의 뜻(meaning)을 한국어 예문에서 찾아 블록 처리
    // 예: meaning="냉장고", text="냉장고에 우유가 있습니다." -> "[블록]에 우유가 있습니다."

    // 복수 의미 처리 (쉼표로 구분된 경우 모든 의미 시도)
    const meanings = meaning.split(/[,،、\/]/).map((s) => s.trim())

    for (const m of meanings) {
      // 의미의 어근 추출 (하다, 다 제거)
      const meaningRoot = m.replace(/하다$/, '').replace(/다$/, '')

      // 한국어 문장에서 의미 또는 어근이 포함된 부분 찾기
      // 조사가 붙은 형태도 매칭 (예: "냉장고에", "학교를", "책을")
      const regex = new RegExp(`(${meaningRoot}[가-힣]*)`)
      const match = koreanText.match(regex)

      if (match && match[0]) {
        const targetWord = match[0]
        const index = koreanText.indexOf(targetWord)

        if (index !== -1) {
          const before = koreanText.slice(0, index)
          const after = koreanText.slice(index + targetWord.length)

          return (
            <>
              {before}
              <span className="bg-primary/80 text-primary/10 rounded-sm px-0.5 select-none">
                {targetWord}
              </span>
              {after}
            </>
          )
        }
      }
    }

    // 매칭 실패 시 원본 반환
    return koreanText
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-primary/5 to-background dark:from-primary/15 dark:via-primary/5 dark:to-background flex flex-col relative overflow-hidden">
      {/* 정답 플래시 효과 */}
      <AnimatePresence>
        {showSuccessFlash && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-green-400/20 dark:bg-green-500/30 z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Lottie 성공 애니메이션 */}
      <AnimatePresence>
        {showLottie && (
          <m.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <LottieLight
              animationData={successCheckAnimation}
              loop={false}
              style={{ width: 200, height: 200 }}
            />
          </m.div>
        )}
      </AnimatePresence>

      <Header
        showBack
        showSettings
        progress={{ current: currentIndex + 1, total: QUESTIONS_PER_SESSION }}
        onSettingsClick={() => setShowQuickAudio(true)}
        onBackConfirm={handleBack}
        backConfirmMessage={{
          title: '학습을 중단할까요?',
          highlight: '진행 상황이 저장',
          description: '됩니다. 나중에 이어서 할 수 있어요!'
        }}
      />

      <section className="flex-1 flex flex-col p-5 relative">
        {/* 단어 카드 */}
        <AnimatePresence mode="wait">
          <m.div
            key={currentWord.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col"
          >
            <Card className="flex-1">
              <CardContent className="h-full flex flex-col items-center justify-center py-10">
                {/* 문제 유형 뱃지 */}
                <div className="mb-3 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {questionType === 'reverse'
                    ? '한국어 → 일본어'
                    : questionType === 'listening'
                      ? '🎧 청해'
                      : '일본어 → 한국어'}
                </div>

                {/* 문제 표시: reverse=한국어, listening=숨김(TTS만), standard=한자/히라가나 */}
                <m.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-center mb-8"
                >
                  {questionType === 'reverse' ? (
                    <>
                      <p className="text-5xl font-bold mb-3">{currentWord.meaning}</p>
                      <p className="text-sm text-muted-foreground">
                        {useCanvasMode
                          ? '한자 또는 히라가나로 써 보세요'
                          : '한자 또는 히라가나로 입력하세요'}
                      </p>
                    </>
                  ) : questionType === 'listening' ? (
                    <>
                      {/* 일본어/히라가나 숨김 — 오디오 아이콘 + 안내문 */}
                      <div
                        className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-3 anim-halo"
                        style={{
                          background:
                            'color-mix(in srgb, var(--color-primary) 12%, transparent)',
                        }}
                      >
                        <span className="text-6xl">🔊</span>
                      </div>
                      <p className="text-base font-semibold">
                        들리는 단어의 뜻을 입력하세요
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        아래 버튼으로 여러 번 들을 수 있어요
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-6xl font-bold mb-3 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                        {currentWord.kanji}
                      </p>
                      <p className="text-xl text-muted-foreground">
                        {currentWord.hiragana}
                      </p>
                      <p className="romaji text-sm text-muted-foreground/70 mt-1">
                        {hiraganaToRomaji(currentWord.hiragana)}
                      </p>
                    </>
                  )}
                </m.div>

                {/* TTS 버튼들 */}
                <m.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-3 mb-6"
                >
                  <TTSButton
                    text={currentWord.kanji}
                    label="단어"
                    variant="outline"
                  />
                  {currentWord.example && (
                    <TTSButton
                      text={currentWord.example.japanese}
                      label="예문"
                      variant="ghost"
                    />
                  )}
                </m.div>

                {/* 예문 박스 - 예문 있을 때만 표시 */}
                {currentWord.example && (
                  <m.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="self-stretch mx-4 bg-muted rounded-2xl p-5"
                  >
                    <p className="text-lg mb-1 leading-relaxed">
                      {questionType === 'standard'
                        ? highlightExample(
                            currentWord.example.japanese,
                            currentWord.example.targetWord,
                          )
                        : maskExample(
                            currentWord.example.japanese,
                            currentWord.example.targetWord,
                          )}
                    </p>
                    {/* 읽기·로마자는 정답을 노출하므로 standard 문제에서만 표시 */}
                    {questionType === 'standard' && currentWord.example.reading && (
                      <div className="mb-2">
                        <p className="text-xs text-muted-foreground">
                          {currentWord.example.reading}
                        </p>
                        <p className="romaji text-[10px] text-muted-foreground/70">
                          {hiraganaToRomaji(currentWord.example.reading)}
                        </p>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {blockMeaningInKorean(currentWord.example.korean, currentWord.meaning)}
                    </p>
                  </m.div>
                )}

                {/* 힌트 */}
                <AnimatePresence>
                  {showHint && (
                    <m.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 px-4 py-2 bg-primary/10 rounded-full"
                    >
                      <p className="text-sm text-primary">
                        💡 힌트:{' '}
                        {questionType === 'reverse'
                          ? buildHint(currentWord.hiragana)
                          : buildHint(currentWord.meaning)}
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* 입력 영역 — 캔버스 모드 또는 키보드 입력 */}
            <div className="mt-5 space-y-4">
              {useCanvasMode ? (
                <CanvasAnswerInput
                  ref={canvasAnswerRef}
                  disabled={answerState !== 'waiting'}
                  state={answerState}
                  resetKey={currentWord.id}
                />
              ) : (
                <div className="relative">
                  <Input
                    ref={inputRef}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      questionType === 'reverse'
                        ? '한자 또는 히라가나로'
                        : '뜻을 입력하세요'
                    }
                    disabled={answerState !== 'waiting'}
                    className={`h-14 text-lg text-center pr-14 ${
                      answerState === 'correct'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : answerState === 'wrong-popup'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : ''
                    }`}
                  />
                  <AnimatePresence>
                    {answerState !== 'waiting' && (
                      <m.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        {answerState === 'correct' ? (
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        ) : answerState === 'wrong-popup' ? (
                          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                            <X className="w-5 h-5 text-white" />
                          </div>
                        ) : null}
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* 버튼들 */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowHint(true)}
                  disabled={showHint || answerState !== 'waiting'}
                  className="flex-1 h-12"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  힌트
                </Button>
                <Button
                  onClick={checkAnswer}
                  disabled={
                    answerState !== 'waiting' ||
                    (!useCanvasMode && !answer.trim())
                  }
                  className="flex-1 h-12"
                >
                  확인
                </Button>
              </div>
            </div>
          </m.div>
        </AnimatePresence>
      </section>

      {/* 오답 팝업 — 키보드 입력 모드 (캔버스 모드는 아래 비교 팝업) */}
      <Dialog
        open={answerState === 'wrong-popup' && !!wrongWord && !canvasResult}
        onOpenChange={() => {}}
      >
        <DialogContent className="w-[calc(100vw-32px)] max-w-[360px]" hideCloseButton>
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex flex-col items-center gap-2">
                {/* 오답 = shock + "아이쿠!" — ConversationQuizPage와 일관성 유지 */}
                <MascotScene
                  reaction="shock"
                  sizeToken="sm"
                  bubble="아이쿠!"
                />
                <span className="inline-flex items-center gap-2 text-red-500">
                  <X className="w-6 h-6" />
                  오답
                </span>
              </div>
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-center space-y-4 pt-2">
                <div className="bg-gradient-to-br from-muted to-muted/50 rounded-2xl p-5">
                  <p className="text-3xl font-bold text-foreground mb-1">
                    {wrongWord?.kanji}
                  </p>
                  <p className="text-lg text-muted-foreground">
                    {wrongWord?.hiragana}
                  </p>
                  <p className="romaji text-sm text-muted-foreground/70 mb-3">
                    {wrongWord && hiraganaToRomaji(wrongWord.hiragana)}
                  </p>
                  <p className="text-xl font-semibold text-primary">
                    {wrongWord?.meaning}
                  </p>
                  {wrongWord && (
                    <div className="mt-4">
                      <TTSButton
                        text={wrongWord.kanji}
                        label="발음 듣기"
                        variant="outline"
                      />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  이 단어를 오답노트에 추가할까요?
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={handleAddToWrongWords}
              className="w-full h-12"
            >
              <BookmarkPlus className="w-4 h-4 mr-2" />
              오답노트에 추가
            </Button>
            <Button
              variant="outline"
              onClick={handleSkipWrongWords}
              className="w-full h-12"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              그냥 진행하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 캔버스 모드 채점 결과 — 내 글씨 vs 정답 비교 (정답·오답 공용) */}
      <Dialog
        open={
          !!canvasResult &&
          (answerState === 'correct' || answerState === 'wrong-popup')
        }
        onOpenChange={() => {}}
      >
        <DialogContent
          className="w-[calc(100vw-32px)] max-w-[360px]"
          hideCloseButton
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex flex-col items-center gap-2">
                <MascotScene
                  reaction={answerState === 'correct' ? 'happy' : 'shock'}
                  sizeToken="sm"
                  bubble={answerState === 'correct' ? '잘 썼어요!' : '아이쿠!'}
                />
                {answerState === 'correct' ? (
                  <span className="inline-flex items-center gap-2 text-green-500">
                    <Check className="w-6 h-6" />
                    정답
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-red-500">
                    <X className="w-6 h-6" />
                    오답
                  </span>
                )}
              </div>
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 pt-2">
                {/* 내 글씨 vs 정답 비교 타일 */}
                {canvasResult && (
                  <CanvasCompare
                    userImage={canvasResult.snapshot}
                    target={canvasResult.target}
                    score={canvasResult.score}
                  />
                )}
                {/* 단어 정보 */}
                {canvasResult && (
                  <div className="bg-gradient-to-br from-muted to-muted/50 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-bold text-foreground mb-0.5">
                      {canvasResult.word.kanji}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {canvasResult.word.hiragana}
                    </p>
                    <p className="romaji text-xs text-muted-foreground/70 mb-2">
                      {hiraganaToRomaji(canvasResult.word.hiragana)}
                    </p>
                    <p className="text-lg font-semibold text-primary">
                      {canvasResult.word.meaning}
                    </p>
                    <div className="mt-3">
                      <TTSButton
                        text={canvasResult.word.kanji}
                        label="발음 듣기"
                        variant="outline"
                      />
                    </div>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            {answerState === 'correct' ? (
              <Button onClick={goToNextQuestion} className="w-full h-12">
                <ArrowRight className="w-4 h-4 mr-2" />
                다음 문제
              </Button>
            ) : (
              <>
                <Button onClick={handleAddToWrongWords} className="w-full h-12">
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  오답노트에 추가
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSkipWrongWords}
                  className="w-full h-12"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  그냥 진행하기
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 빠른 음성 설정 */}
      <QuickAudioSettings open={showQuickAudio} onOpenChange={setShowQuickAudio} />
    </div>
  )
}
