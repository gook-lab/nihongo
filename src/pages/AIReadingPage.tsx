// AI 맞춤 짧은 이야기 생성기
// 사용자가 레벨/주제/길이 선택 → Gemini로 JSON 이야기 생성 → 저장 → /reading/:id에서 열람
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  Sparkles,
  AlertCircle,
  RotateCcw,
  Save,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BottomNav } from '@/components/BottomNav'
import { MascotScene } from '@/components/MascotScene'
import { Spinner } from '@/components/Spinner'
import { useAppStore } from '@/store'
import {
  generateReadingStory,
  isGeminiConfigured,
  type AIGeneratedStory,
  type GenerateStoryParams,
} from '@/lib/gemini'
import type { ReadingPiece } from '@/data/reading'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'
import { cn } from '@/lib/utils'

const SUGGESTED_TOPICS = [
  '주말 풍경',
  '회사 첫날',
  '여행지에서',
  '맛있는 음식',
  '비 오는 날',
  '오래된 친구',
  '계절의 변화',
  '실수와 배움',
]

const LEVELS: GenerateStoryParams['level'][] = ['N5', 'N4', 'N3']
const LENGTHS: Array<{ id: GenerateStoryParams['length']; label: string; sub: string }> = [
  { id: 'short', label: '짧게', sub: '단락 3~4개' },
  { id: 'medium', label: '보통', sub: '단락 5~7개' },
]

function storyToReadingPiece(story: AIGeneratedStory, params: GenerateStoryParams): ReadingPiece {
  const id = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return {
    id,
    title: story.title,
    titleKo: story.titleKo,
    level: params.level,
    source: 'ai',
    sourceLabel: `AI 생성 · ${params.topic || '일상'}`,
    estimatedMinutes: params.length === 'short' ? 1 : 2,
    description: story.description,
    paragraphs: story.paragraphs,
    vocabulary: story.vocabulary,
  }
}

export function AIReadingPage() {
  const navigate = useNavigate()
  const saveAiReading = useAppStore((s) => s.saveAiReading)

  const [level, setLevel] = useState<GenerateStoryParams['level']>('N5')
  const [topic, setTopic] = useState('')
  const [length, setLength] = useState<GenerateStoryParams['length']>('short')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<ReadingPiece | null>(null)
  const [saved, setSaved] = useState(false)

  const configured = isGeminiConfigured()

  const handleGenerate = async () => {
    if (!configured) {
      setError('Gemini API 키가 설정되지 않았습니다. .env에 VITE_GEMINI_API_KEY를 추가하세요.')
      return
    }
    setLoading(true)
    setError(null)
    setSaved(false)
    try {
      const story = await generateReadingStory({ level, topic: topic.trim(), length })
      const piece = storyToReadingPiece(story, { level, topic: topic.trim(), length })
      setPreview(piece)
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.startsWith('RATE_LIMIT:')) {
          const sec = e.message.split(':')[1]
          setError(`요청이 너무 많아요. ${sec}초 후 다시 시도해 주세요.`)
        } else {
          setError(e.message)
        }
      } else {
        setError('알 수 없는 오류가 났어요.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    if (!preview) return
    saveAiReading(preview)
    setSaved(true)
  }

  const handleOpenInDetail = () => {
    if (!preview) return
    if (!saved) saveAiReading(preview)
    navigate(`/reading/${preview.id}`)
  }

  const handleReset = () => {
    setPreview(null)
    setError(null)
    setSaved(false)
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <div className="pt-6 pb-4 px-5 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border-light">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/reading')} aria-label="뒤로가기">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-sakura-100)' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            </div>
            <span className="type-h3">AI 이야기</span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-5 pt-4 space-y-5">
        {!preview && (
          <>
            {/* 안내 — 생성 중이면 think, 평소엔 bounce(설렘) */}
            <MascotScene
              reaction={loading ? 'think' : 'bounce'}
              sizeToken="sm"
              bubble={loading ? '생각 중…' : '오늘은 무슨 이야기?'}
            />
            <Card>
              <CardContent className="p-4">
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  레벨·주제·길이를 선택하면 AI가 일본어 짧은 글을 만들어 드려요.
                  매번 다른 이야기가 나오니 여러 번 시도해보세요.
                </p>
              </CardContent>
            </Card>

            {/* JLPT 레벨 */}
            <div>
              <p
                className="text-[11px] uppercase tracking-wider font-semibold mb-2 px-1"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                JLPT 레벨
              </p>
              <div className="grid grid-cols-3 gap-2">
                {LEVELS.map((lv) => {
                  const isSelected = level === lv
                  return (
                    <m.button
                      key={lv}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setLevel(lv)}
                      className={cn(
                        'rounded-xl border-2 py-3 text-center transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-foreground/30',
                      )}
                    >
                      <p
                        className={cn('text-base font-bold', isSelected && 'text-primary')}
                      >
                        {lv}
                      </p>
                    </m.button>
                  )
                })}
              </div>
            </div>

            {/* 주제 */}
            <div>
              <p
                className="text-[11px] uppercase tracking-wider font-semibold mb-2 px-1"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                주제 (자유 입력 또는 추천)
              </p>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 카페에서, 첫 출근, 비밀의 정원…"
                maxLength={50}
                className="h-11"
              />
              <div className="flex gap-1.5 flex-wrap mt-2">
                {SUGGESTED_TOPICS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className="text-[11px] px-2.5 py-1 rounded-full border transition-colors"
                    style={{
                      background:
                        topic === t ? 'var(--color-sakura-100)' : 'transparent',
                      borderColor:
                        topic === t
                          ? 'var(--color-primary)'
                          : 'var(--color-border)',
                      color:
                        topic === t
                          ? 'var(--color-primary)'
                          : 'var(--color-text-secondary)',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* 길이 */}
            <div>
              <p
                className="text-[11px] uppercase tracking-wider font-semibold mb-2 px-1"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                길이
              </p>
              <div className="grid grid-cols-2 gap-2">
                {LENGTHS.map((opt) => {
                  const isSelected = length === opt.id
                  return (
                    <m.button
                      key={opt.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setLength(opt.id)}
                      className={cn(
                        'rounded-xl border-2 p-3 text-left transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-foreground/30',
                      )}
                    >
                      <p
                        className={cn(
                          'text-sm font-semibold',
                          isSelected && 'text-primary',
                        )}
                      >
                        {opt.label}
                      </p>
                      <p
                        className="text-[11px] mt-0.5"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {opt.sub}
                      </p>
                    </m.button>
                  )
                })}
              </div>
            </div>

            {/* 에러 */}
            {error && (
              <div
                className="rounded-xl p-3 flex items-start gap-2 text-sm"
                style={{
                  background: 'rgba(255, 90, 95, 0.08)',
                  border: '1px solid rgba(255, 90, 95, 0.2)',
                  color: 'var(--color-destructive)',
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="break-all">{error}</span>
              </div>
            )}

            {/* 생성 버튼 */}
            <Button
              onClick={handleGenerate}
              disabled={loading || !configured}
              className="w-full h-12 text-base font-semibold"
            >
              {loading ? (
                <>
                  <Spinner variant="ring" size={16} color="currentColor" className="mr-2" />
                  생성 중…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  이야기 만들기
                </>
              )}
            </Button>
            {!configured && (
              <p
                className="text-center text-[11px]"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                .env에 <code>VITE_GEMINI_API_KEY</code>를 추가해야 작동합니다
              </p>
            )}
          </>
        )}

        {/* 미리보기 */}
        <AnimatePresence>
          {preview && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: 'var(--color-sakura-100)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {preview.level}
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  AI 생성
                </span>
              </div>
              <h2 className="text-xl font-bold leading-tight">{preview.title}</h2>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {preview.titleKo}
              </p>

              {/* 단락 (간략 미리보기 — 첫 2개만) */}
              <div className="space-y-2 mt-3">
                {preview.paragraphs.slice(0, 2).map((p, i) => (
                  <Card key={i}>
                    <CardContent className="p-3">
                      <p className="font-medium leading-relaxed">{p.ja}</p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {p.reading}
                      </p>
                      <p
                        className="romaji text-[10px]"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        {hiraganaToRomaji(p.reading)}
                      </p>
                      <p
                        className="text-sm mt-2 pt-2 border-t"
                        style={{
                          color: 'var(--color-text-secondary)',
                          borderColor: 'var(--color-border-light)',
                        }}
                      >
                        {p.ko}
                      </p>
                    </CardContent>
                  </Card>
                ))}
                {preview.paragraphs.length > 2 && (
                  <p
                    className="text-xs text-center"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    + 단락 {preview.paragraphs.length - 2}개 더
                  </p>
                )}
              </div>

              {/* 액션 */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="h-11"
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  다시
                </Button>
                <Button onClick={handleOpenInDetail} className="h-11">
                  <Eye className="w-4 h-4 mr-1.5" />
                  전체 보기
                </Button>
              </div>
              {!saved ? (
                <Button
                  variant="ghost"
                  onClick={handleSave}
                  className="w-full h-10"
                >
                  <Save className="w-4 h-4 mr-1.5" />내 라이브러리에 저장
                </Button>
              ) : (
                <p
                  className="text-center text-xs"
                  style={{ color: 'var(--color-primary)' }}
                >
                  저장됨 — 짧은 글 목록에서 다시 볼 수 있어요
                </p>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  )
}
