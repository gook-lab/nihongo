// AI 작문 첨삭 페이지 — 한국어 프롬프트 → 일본어 답안 → Gemini 채점/교정
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  PenLine,
  Shuffle,
  Send,
  CheckCircle,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BottomNav } from '@/components/BottomNav'
import { TTSButton } from '@/components/TTSButton'
import { MascotScene } from '@/components/MascotScene'
import { Spinner } from '@/components/Spinner'
import { cn } from '@/lib/utils'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'
import {
  correctWriting,
  isGeminiConfigured,
  type WritingCorrection,
  WRITING_PROMPTS,
} from '@/lib/gemini'

type Level = 'N5' | 'N4' | 'N3'

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function WritingPage() {
  const navigate = useNavigate()
  const [level, setLevel] = useState<Level>('N5')
  const [koreanPrompt, setKoreanPrompt] = useState<string>(() =>
    pickRandom(WRITING_PROMPTS.N5),
  )
  const [userJapanese, setUserJapanese] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<WritingCorrection | null>(null)
  const configured = isGeminiConfigured()

  // 레벨 바뀌면 새 프롬프트 추첨
  useEffect(() => {
    setKoreanPrompt(pickRandom(WRITING_PROMPTS[level]))
    setUserJapanese('')
    setResult(null)
    setError(null)
  }, [level])

  const handleShuffle = () => {
    setKoreanPrompt(pickRandom(WRITING_PROMPTS[level]))
    setUserJapanese('')
    setResult(null)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!configured) {
      setError('Gemini API 키가 설정되지 않았어요.')
      return
    }
    if (!userJapanese.trim()) {
      setError('일본어로 답안을 작성해 주세요.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const correction = await correctWriting(koreanPrompt, userJapanese.trim(), level)
      setResult(correction)
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.startsWith('RATE_LIMIT:')) {
          const sec = e.message.split(':')[1]
          setError(`요청이 너무 많아요. ${sec}초 후 다시 시도해 주세요.`)
        } else {
          setError(e.message)
        }
      } else {
        setError('알 수 없는 오류가 발생했어요.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setUserJapanese('')
    setResult(null)
    setError(null)
  }

  const scoreColor = useMemo(() => {
    if (!result) return 'var(--color-text-secondary)'
    if (result.score >= 80) return 'var(--color-success)'
    if (result.score >= 60) return 'var(--color-warning)'
    return 'var(--color-destructive)'
  }, [result])

  return (
    <div className="min-h-screen bg-background pb-nav">
      {/* 헤더 */}
      <div className="pt-6 pb-4 px-5 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border-light">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} aria-label="뒤로가기">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <PenLine className="w-4 h-4 text-primary" />
            </div>
            <span className="type-h3">AI 작문 첨삭</span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-5 pt-4 space-y-4">
        {/* 레벨 선택 */}
        <div className="flex gap-2">
          {(['N5', 'N4', 'N3'] as Level[]).map((lv) => (
            <Button
              key={lv}
              variant={level === lv ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLevel(lv)}
              className="flex-1"
            >
              {lv}
            </Button>
          ))}
        </div>

        {/* 한국어 프롬프트 카드 */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p
                className="type-eyebrow"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                다음 문장을 일본어로
              </p>
              <button
                onClick={handleShuffle}
                disabled={loading}
                className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: 'var(--color-primary)' }}
              >
                <Shuffle className="w-3 h-3" />
                다른 문장
              </button>
            </div>
            <p className="text-lg font-bold leading-snug">{koreanPrompt}</p>
          </CardContent>
        </Card>

        {/* 사용자 답안 */}
        {!result && (
          <>
            <textarea
              value={userJapanese}
              onChange={(e) => setUserJapanese(e.target.value)}
              placeholder="일본어로 작성해 보세요 (예: 今日は…)"
              disabled={loading}
              rows={4}
              className="w-full rounded-xl px-4 py-3 text-base resize-none border-[1.5px] focus:outline-none focus:border-primary"
              style={{
                background: 'var(--color-card)',
                borderColor: 'var(--color-border)',
              }}
              autoFocus
            />

            {error && (
              <div
                className="rounded-xl p-3 flex items-start gap-2 text-sm"
                style={{
                  background: 'var(--color-error-light)',
                  color: 'var(--color-error-dark)',
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={loading || !userJapanese.trim() || !configured}
              className="w-full h-12"
            >
              {loading ? (
                <>
                  <Spinner variant="ring" size={16} color="currentColor" className="mr-2" />
                  채점 중…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  채점받기
                </>
              )}
            </Button>

            {/* 채점 중 — AI가 곰곰이 생각하는 모습 */}
            {loading && (
              <m.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-1"
              >
                <MascotScene reaction="think" sizeToken="sm" bubble="생각 중…" />
                <p
                  className="text-center text-xs mt-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  AI 튜터가 첨삭하고 있어요…
                </p>
              </m.div>
            )}
            {!configured && (
              <p
                className="text-center text-[11px]"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                .env에 <code>VITE_GEMINI_API_KEY</code> 필요
              </p>
            )}
          </>
        )}

        {/* 결과 */}
        <AnimatePresence>
          {result && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* 점수 기반 마스코트 reaction + 말풍선 */}
              <MascotScene
                reaction={
                  result.score >= 90
                    ? 'celebrate'
                    : result.score >= 70
                      ? 'happy'
                      : result.score >= 40
                        ? 'cheer'
                        : 'encourage'
                }
                sizeToken="md"
                bubble={
                  result.score >= 90
                    ? '완벽해요! 🎉'
                    : result.score >= 70
                      ? '잘했어요!'
                      : result.score >= 40
                        ? '거의 다 왔어요!'
                        : '괜찮아요, 다시!'
                }
              />

              {/* 점수 */}
              <Card>
                <CardContent className="p-5 text-center">
                  <p
                    className="type-eyebrow mb-1"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    SCORE
                  </p>
                  <p
                    className="text-5xl font-black anim-badge-pop"
                    style={{ color: scoreColor }}
                  >
                    {result.score}
                    <span className="text-xl">/100</span>
                  </p>
                  <p
                    className="text-sm mt-2 leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {result.feedback}
                  </p>
                </CardContent>
              </Card>

              {/* 사용자 답안 */}
              <Card>
                <CardContent className="p-4">
                  <p
                    className="type-eyebrow mb-1"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    내 답안
                  </p>
                  <p className="text-base leading-relaxed">{result.userAnswer}</p>
                </CardContent>
              </Card>

              {/* 모범 답안 */}
              <Card
                style={{
                  background:
                    'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 8%, var(--color-card)) 0%, var(--color-card) 100%)',
                  borderColor:
                    'color-mix(in srgb, var(--color-primary) 22%, transparent)',
                }}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p
                      className="type-eyebrow flex items-center gap-1"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      <CheckCircle className="w-3 h-3" />
                      모범 답안
                    </p>
                    <TTSButton text={result.modelAnswer} variant="ghost" size="icon" />
                  </div>
                  <p className="text-lg font-bold leading-snug">{result.modelAnswer}</p>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {result.modelAnswerReading}
                  </p>
                  <p
                    className="romaji text-[11px]"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {hiraganaToRomaji(result.modelAnswerReading)}
                  </p>
                </CardContent>
              </Card>

              {/* 개선 제안 */}
              {result.improvements.length > 0 && (
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <p
                      className="type-eyebrow mb-2"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      개선 제안
                    </p>
                    <ul className="space-y-1.5">
                      {result.improvements.map((imp, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm leading-relaxed"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          <span
                            className={cn('font-bold shrink-0')}
                            style={{ color: 'var(--color-primary)' }}
                          >
                            {i + 1}.
                          </span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* 액션 */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button variant="outline" onClick={handleReset} className="h-11">
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  다시 쓰기
                </Button>
                <Button onClick={handleShuffle} className="h-11">
                  <Shuffle className="w-4 h-4 mr-1.5" />
                  다음 문제
                </Button>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  )
}
