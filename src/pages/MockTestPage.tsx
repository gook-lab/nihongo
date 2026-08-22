// JLPT 모의고사 모드 — 단어 30문제 4지선다 + 시간 제한
// /mock 진입 페이지(레벨 선택) + /mock/:level 시험 페이지
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  GraduationCap,
  Clock,
  Trophy,
  Check,
  X as XIcon,
  Home,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BottomNav } from '@/components/BottomNav'
import { useConfirm } from '@/components/ConfirmDialog'
import { MascotScene } from '@/components/MascotScene'
import { WORDS } from '@/data/words'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

type Level = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'

const LEVEL_CONFIG: Record<Level, { totalQuestions: number; timeMin: number; passScore: number }> = {
  N5: { totalQuestions: 30, timeMin: 15, passScore: 60 },
  N4: { totalQuestions: 30, timeMin: 18, passScore: 65 },
  N3: { totalQuestions: 30, timeMin: 20, passScore: 70 },
  N2: { totalQuestions: 30, timeMin: 22, passScore: 70 },
  // N1은 단어 풀이 작아서 N2 단어 + 어려운 N3 단어 혼합 (정식 N1 단어 추가 시 분리)
  N1: { totalQuestions: 30, timeMin: 25, passScore: 75 },
}

interface Question {
  wordId: string
  kanji: string
  hiragana: string
  meaning: string
  options: string[]   // 4개
  answerIdx: number
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuestions(level: Level, count: number): Question[] {
  const lv =
    level === 'N5' ? 5 :
    level === 'N4' ? 4 :
    level === 'N3' ? 3 :
    level === 'N2' ? 2 :
    1 // N1
  // 정식 N1 단어 200개 추가됨 — level=1 필터링으로 출제
  const pool = WORDS.filter((w) => w.level === lv)
  const selected = shuffle(pool).slice(0, count)
  // 오답 풀: 같은 레벨에서 선택된 단어 외
  return selected.map((w) => {
    const others = shuffle(pool.filter((p) => p.id !== w.id)).slice(0, 3).map((p) => p.meaning)
    const options = shuffle([w.meaning, ...others])
    return {
      wordId: w.id,
      kanji: w.kanji,
      hiragana: w.hiragana,
      meaning: w.meaning,
      options,
      answerIdx: options.indexOf(w.meaning),
    }
  })
}

// ─── 진입 페이지 (레벨 선택) ─────────────────────────────────────
export function MockTestEntryPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background pb-nav">
      <div className="pt-6 pb-4 px-5 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border-light">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} aria-label="뒤로가기">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            <span className="type-h3">JLPT 모의고사</span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-5 pt-6 space-y-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              실제 시험 형식으로 단어 어휘 30문제를 풉니다. 시간이 다 되면 자동으로 채점됩니다.
              레벨을 선택해 주세요.
            </p>
          </CardContent>
        </Card>

        {(['N5', 'N4', 'N3', 'N2', 'N1'] as Level[]).map((level, idx) => {
          const cfg = LEVEL_CONFIG[level]
          return (
            <m.button
              key={level}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/mock/${level.toLowerCase()}`)}
              className="w-full rounded-2xl border-[1.5px] p-4 text-left transition-colors hover:border-primary/40"
              style={{
                background: 'var(--color-card)',
                borderColor: 'var(--color-border-light)',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-black"
                  style={{
                    background: 'var(--color-sakura-100)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {level}
                </div>
                <div className="flex-1">
                  <p className="font-bold">{level} 모의고사</p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {cfg.totalQuestions}문제 · {cfg.timeMin}분 · 합격 {cfg.passScore}점
                  </p>
                </div>
              </div>
            </m.button>
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}

// ─── 시험 페이지 ─────────────────────────────────────────────────
export function MockTestPage() {
  const navigate = useNavigate()
  const { level: levelParam } = useParams<{ level: string }>()
  const level = (levelParam?.toUpperCase() as Level) || 'N5'
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.N5
  const { confirm, dialog: confirmDialog } = useConfirm()

  const questions = useMemo(() => buildQuestions(level, cfg.totalQuestions), [level, cfg.totalQuestions])

  const [answers, setAnswers] = useState<Array<number | null>>(() =>
    new Array(questions.length).fill(null),
  )
  const [currentIdx, setCurrentIdx] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [remainingSec, setRemainingSec] = useState(cfg.timeMin * 60)
  const submittedRef = useRef(false)

  // 타이머
  useEffect(() => {
    if (submitted) return
    const t = setInterval(() => {
      setRemainingSec((s) => {
        if (s <= 1) {
          clearInterval(t)
          if (!submittedRef.current) {
            submittedRef.current = true
            setSubmitted(true)
          }
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [submitted])

  const score = useMemo(() => {
    let correct = 0
    answers.forEach((a, i) => {
      if (a === questions[i].answerIdx) correct++
    })
    return Math.round((correct / questions.length) * 100)
  }, [answers, questions])

  const passed = score >= cfg.passScore
  const answered = answers.filter((a) => a !== null).length
  const current = questions[currentIdx]
  const recordMockTest = useAppStore((s) => s.recordMockTest)
  const mockHistory = useAppStore((s) => s.mockTestHistory)

  // 제출 시 누적 기록
  const recordedRef = useRef(false)
  useEffect(() => {
    if (submitted && !recordedRef.current && answered > 0) {
      recordedRef.current = true
      recordMockTest({ level, score, passed })
    }
  }, [submitted, answered, level, score, passed, recordMockTest])

  // 같은 레벨의 누적 기록
  const sameLevelHistory = mockHistory.filter((h) => h.level === level)
  const attemptCount = sameLevelHistory.length + (recordedRef.current ? 0 : 1)
  const bestScore = sameLevelHistory.length > 0
    ? Math.max(...sameLevelHistory.map((h) => h.score), score)
    : score
  const passCount = sameLevelHistory.filter((h) => h.passed).length + (passed ? 1 : 0)

  const handlePick = (optionIdx: number) => {
    if (submitted) return
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIdx] = optionIdx
      return next
    })
  }

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
    } else {
      submittedRef.current = true
      setSubmitted(true)
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
  }

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  // 결과 화면
  if (submitted) {
    const correctList = questions.map((q, i) => ({
      ...q,
      userAnswer: answers[i],
      isCorrect: answers[i] === q.answerIdx,
    }))
    const wrongList = correctList.filter((q) => !q.isCorrect)

    return (
      <div className="min-h-screen bg-background pb-nav">
        <div className="pt-6 pb-4 px-5 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border-light">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="type-h3">시험 결과</span>
          </div>
        </div>

        <div className="px-5 pt-6 space-y-4">
          {/* 합격/불합격 기반 마스코트 + 말풍선 */}
          <MascotScene
            reaction={passed ? (score >= 90 ? 'celebrate' : 'happy') : 'encourage'}
            sizeToken="md"
            bubble={
              passed
                ? score >= 90
                  ? '완벽해요! 🎉'
                  : '합격! 잘했어요!'
                : '괜찮아요, 다시!'
            }
          />
          {/* 점수 카드 */}
          <Card className="anim-badge-pop">
            <CardContent className="p-6 text-center">
              <p
                className="type-eyebrow"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {level} 결과
              </p>
              <p
                className="text-6xl font-black mt-2"
                style={{
                  color: passed ? 'var(--color-success)' : 'var(--color-destructive)',
                }}
              >
                {score}
                <span className="text-2xl">점</span>
              </p>
              <p className="text-sm mt-2">
                <span
                  className="px-2.5 py-1 rounded-full font-bold text-xs"
                  style={{
                    background: passed
                      ? 'var(--color-success-light)'
                      : 'var(--color-error-light)',
                    color: passed
                      ? 'var(--color-success-dark)'
                      : 'var(--color-error-dark)',
                  }}
                >
                  {passed ? '합격' : '불합격'}
                </span>
                <span
                  className="ml-2 text-xs"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  (합격선 {cfg.passScore}점)
                </span>
              </p>
              <p
                className="text-xs mt-3"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                정답 {questions.length - wrongList.length} · 오답 {wrongList.length}
              </p>
            </CardContent>
          </Card>

          {/* 누적 기록 카드 — 1회 이상 응시 시 */}
          {attemptCount > 1 && (
            <Card>
              <CardContent className="p-4">
                <p className="type-eyebrow mb-2">{level} 누적 기록</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                      응시
                    </p>
                    <p className="text-xl font-bold mt-0.5">{attemptCount}회</p>
                  </div>
                  <div>
                    <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                      최고
                    </p>
                    <p
                      className="text-xl font-bold mt-0.5"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {bestScore}점
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                      합격
                    </p>
                    <p
                      className="text-xl font-bold mt-0.5"
                      style={{
                        color:
                          passCount > 0
                            ? 'var(--color-success-dark)'
                            : 'var(--color-text-secondary)',
                      }}
                    >
                      {passCount}회
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 틀린 문제 */}
          {wrongList.length > 0 && (
            <div>
              <p
                className="type-section mb-2 px-1"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                틀린 문제 {wrongList.length}
              </p>
              <div className="space-y-2">
                {wrongList.map((q) => (
                  <Card key={q.wordId}>
                    <CardContent className="p-3">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-bold text-lg">{q.kanji}</span>
                        <span
                          className="text-xs"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {q.hiragana}
                        </span>
                      </div>
                      <p className="text-sm">
                        <span
                          className="line-through mr-2"
                          style={{ color: 'var(--color-destructive)' }}
                        >
                          {q.userAnswer !== null ? q.options[q.userAnswer] : '미응답'}
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: 'var(--color-success-dark)' }}
                        >
                          → {q.meaning}
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 액션 */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button variant="outline" onClick={() => navigate('/')} className="h-12">
              <Home className="w-4 h-4 mr-1.5" />홈으로
            </Button>
            <Button onClick={() => window.location.reload()} className="h-12">
              <RotateCcw className="w-4 h-4 mr-1.5" />다시 도전
            </Button>
          </div>
        </div>

        <BottomNav />
      </div>
    )
  }

  // 시험 진행 중
  return (
    <div className="min-h-screen bg-background pb-nav">
      {/* 헤더 — 타이머 + 진행도 */}
      <div className="pt-6 pb-4 px-5 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border-light">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              const ok = await confirm({
                title: '시험을 중단할까요?',
                description: '진행 상황은 사라지고 다시 시작해야 해요.',
                confirmText: '중단하기',
                cancelText: '계속 풀기',
                tone: 'destructive',
              })
              if (ok) navigate('/')
            }}
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div
            className="flex items-center gap-1.5 font-bold tabular-nums"
            style={{ color: remainingSec < 60 ? 'var(--color-destructive)' : 'var(--color-foreground)' }}
          >
            <Clock className="w-4 h-4" />
            {fmt(remainingSec)}
          </div>
          <span
            className="text-xs tabular-nums"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {currentIdx + 1} / {questions.length}
          </span>
        </div>
        {/* 진행 도트 */}
        <div className="flex gap-[2px]">
          {questions.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-sm"
              style={{
                background:
                  i === currentIdx
                    ? 'var(--color-primary)'
                    : answers[i] !== null
                      ? 'color-mix(in srgb, var(--color-primary) 40%, transparent)'
                      : 'var(--color-muted)',
              }}
            />
          ))}
        </div>
      </div>

      <div className="px-5 pt-6 space-y-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p
              className="type-eyebrow mb-2"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              다음 단어의 뜻은?
            </p>
            <p className="text-5xl font-black mb-2">{current.kanji}</p>
            <p
              className="text-base"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {current.hiragana}
            </p>
          </CardContent>
        </Card>

        {/* 4지선다 */}
        <div className="space-y-2">
          <AnimatePresence mode="wait">
            {current.options.map((opt, i) => {
              const picked = answers[currentIdx] === i
              return (
                <m.button
                  key={`${currentIdx}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePick(i)}
                  className={cn(
                    'w-full rounded-xl border-[1.5px] py-3.5 px-4 text-left transition-all flex items-center gap-3',
                  )}
                  style={{
                    background: picked
                      ? 'color-mix(in srgb, var(--color-primary) 8%, var(--color-card))'
                      : 'var(--color-card)',
                    borderColor: picked
                      ? 'var(--color-primary)'
                      : 'var(--color-border)',
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: picked ? 'var(--color-primary)' : 'var(--color-muted)',
                      color: picked
                        ? 'var(--color-primary-foreground)'
                        : 'var(--color-text-secondary)',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium">{opt}</span>
                </m.button>
              )
            })}
          </AnimatePresence>
        </div>

        {/* 이전/다음 */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="h-11"
          >
            <ChevronLeft className="w-4 h-4 mr-1.5" />
            이전
          </Button>
          <Button onClick={handleNext} className="h-11">
            {currentIdx === questions.length - 1 ? (
              <>
                <Check className="w-4 h-4 mr-1.5" />
                제출
              </>
            ) : (
              <>
                다음
                <ChevronLeft className="w-4 h-4 ml-1.5 rotate-180" />
              </>
            )}
          </Button>
        </div>

        <p
          className="text-center text-[11px]"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          전체 {questions.length}개 중 {answered}개 응답
          {answered < questions.length && (
            <>
              {' · '}미응답은 0점 처리
            </>
          )}
        </p>

        {/* XIcon은 import 유지용 (안 쓰이면 type 에러) */}
        <span style={{ display: 'none' }}>
          <XIcon className="w-0 h-0" />
        </span>
      </div>

      <BottomNav />
      {confirmDialog}
    </div>
  )
}
