// 손글씨 한자 연습 — Canvas 기반.
// - 타겟 한자를 옅게 표시 (template)
// - 펜 두께 3단계 + 클리어/되돌리기
// - 채점: 사용자 손글씨 vs 타겟 픽셀 비교 (lib/kanjiPractice)
// - 결과 표시 → 다음 한자로 진행
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { PenLine, Eraser, Trash2, RotateCcw, Check, Eye, EyeOff, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { BottomNav } from '@/components/BottomNav'
import { KanjiStrokeOrder } from '@/components/KanjiStrokeOrder'
import { MascotScene } from '@/components/MascotScene'
import type { MascotReaction } from '@/lib/mascotAnimations'
import { WORDS } from '@/data/words'
import { scoreKanjiDrawing, feedbackForScore, type PracticeScore } from '@/lib/kanjiPractice'
import { haptic } from '@/lib/haptic'
import { trackEvent } from '@/lib/analytics'

// FigJam 스타일 툴바의 그룹 구분선
function ToolDivider() {
  return (
    <span
      className="inline-block shrink-0"
      style={{ width: 1, height: 24, background: 'var(--color-border-light)' }}
      aria-hidden
    />
  )
}

// 단일 한자만 선별 (학습 난이도)
function singleCharKanjiList(): { kanji: string; meaning: string; reading: string; level: number }[] {
  const seen = new Set<string>()
  const list: { kanji: string; meaning: string; reading: string; level: number }[] = []
  for (const w of WORDS) {
    if (w.kanji.length !== 1) continue
    if (!/[一-龯]/.test(w.kanji)) continue
    if (seen.has(w.kanji)) continue
    seen.add(w.kanji)
    list.push({ kanji: w.kanji, meaning: w.meaning, reading: w.hiragana, level: w.level })
  }
  return list
}

const CANVAS_SIZE = 320

type PenSize = 'thin' | 'medium' | 'thick'
const PEN_WIDTHS: Record<PenSize, number> = { thin: 6, medium: 12, thick: 20 }

// 6색 팔레트 — 잉크 / 코랄(앱 메인) / 블루 / 그린 / 퍼플 / 브라운
const PEN_COLORS: { id: string; hex: string; label: string }[] = [
  { id: 'ink', hex: '#1A1A1A', label: '잉크' },
  { id: 'coral', hex: '#FF5A5F', label: '코랄' },
  { id: 'blue', hex: '#3B82F6', label: '블루' },
  { id: 'green', hex: '#10B981', label: '그린' },
  { id: 'purple', hex: '#8B5CF6', label: '퍼플' },
  { id: 'brown', hex: '#92400E', label: '브라운' },
]

export function KanjiPracticePage() {
  const navigate = useNavigate()
  const list = useMemo(() => singleCharKanjiList(), [])
  const [index, setIndex] = useState(0)
  const target = list[index]

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const strokesRef = useRef<ImageData[]>([])

  const [penSize, setPenSize] = useState<PenSize>('medium')
  const [penColor, setPenColor] = useState<string>(PEN_COLORS[0].hex)
  const [isEraser, setIsEraser] = useState(false)
  const [showTemplate, setShowTemplate] = useState(true)
  const [showStrokeGuide, setShowStrokeGuide] = useState(false)
  const [result, setResult] = useState<PracticeScore | null>(null)
  const [hasDrawn, setHasDrawn] = useState(false)

  // 캔버스 초기화
  const initCanvas = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctxRef.current = ctx
    strokesRef.current = []
    setHasDrawn(false)
    setResult(null)
  }, [])

  useEffect(() => {
    initCanvas()
  }, [index, initCanvas])

  // 좌표 추출 (touch + mouse 통합)
  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!
    const rect = c.getBoundingClientRect()
    const scale = c.width / rect.width
    return {
      x: (e.clientX - rect.left) * scale,
      y: (e.clientY - rect.top) * scale,
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current) return
    e.preventDefault()
    canvasRef.current?.setPointerCapture(e.pointerId)
    // undo용 스냅샷 저장
    const snap = ctxRef.current.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    strokesRef.current.push(snap)
    if (strokesRef.current.length > 20) strokesRef.current.shift()

    isDrawingRef.current = true
    const p = pointFromEvent(e)
    lastPointRef.current = p
    const ctx = ctxRef.current
    // 지우개 모드면 destination-out, 아니면 일반 그리기
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over'
    ctx.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : penColor
    ctx.lineWidth = PEN_WIDTHS[penSize] * (isEraser ? 1.6 : 1)
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    // 점 한 번 찍어주기 (탭만 했을 때도 보이게)
    ctx.lineTo(p.x + 0.01, p.y + 0.01)
    ctx.stroke()
    setHasDrawn(true)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !ctxRef.current) return
    e.preventDefault()
    const p = pointFromEvent(e)
    ctxRef.current.lineTo(p.x, p.y)
    ctxRef.current.stroke()
    lastPointRef.current = p
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = false
    lastPointRef.current = null
    canvasRef.current?.releasePointerCapture(e.pointerId)
  }

  const handleClear = () => {
    initCanvas()
    haptic.tap()
  }

  const handleUndo = () => {
    const ctx = ctxRef.current
    if (!ctx) return
    const prev = strokesRef.current.pop()
    if (prev) {
      ctx.putImageData(prev, 0, 0)
    } else {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
      setHasDrawn(false)
    }
  }

  const handleCheck = () => {
    if (!canvasRef.current || !target) return
    const score = scoreKanjiDrawing(canvasRef.current, target.kanji, CANVAS_SIZE)
    setResult(score)
    trackEvent('kanji-practice-check', { kanji: target.kanji, score: score.total })
    if (score.total >= 80) haptic.success()
    else if (score.total < 40) haptic.error()
    else haptic.tap()
  }

  const handleNext = () => {
    if (index + 1 < list.length) {
      setIndex(index + 1)
    } else {
      // 끝까지 진행 — 첫 한자로
      setIndex(0)
    }
  }

  if (!target) {
    return (
      <div className="min-h-screen bg-background pb-nav">
        <PageHeader title="한자 연습" icon={PenLine} tone="study" back backTo="/kanji" />
        <div className="px-5 pt-12 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          연습할 한자를 찾을 수 없어요.
        </div>
        <BottomNav />
      </div>
    )
  }

  const feedback = result ? feedbackForScore(result.total) : null
  const reaction: MascotReaction =
    feedback?.level === 'great' ? 'celebrate' : feedback?.level === 'good' ? 'happy' : 'encourage'

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader title="한자 연습" icon={PenLine} tone="study" back backTo="/kanji" />

      <div className="px-5 pt-4 space-y-4">
        {/* 타겟 한자 정보 */}
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold tracking-wider" style={{ color: 'var(--color-primary)' }}>
                N{target.level} · {index + 1} / {list.length}
              </p>
              <p className="text-[26px] font-bold mt-0.5" style={{ fontFamily: '"Hiragino Sans", "Noto Sans JP", serif' }}>
                {target.kanji}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                {target.reading} · {target.meaning}
              </p>
            </div>
            <button
              onClick={() => setShowStrokeGuide((v) => !v)}
              className="text-[11px] font-semibold px-3 h-9 rounded-full border-[1.5px]"
              style={{
                background: showStrokeGuide ? 'var(--color-primary)' : 'var(--color-card)',
                color: showStrokeGuide ? '#fff' : 'var(--color-text-secondary)',
                borderColor: showStrokeGuide ? 'var(--color-primary)' : 'var(--color-border-light)',
              }}
            >
              획순 보기
            </button>
          </CardContent>
        </Card>

        {/* 획순 가이드 */}
        <AnimatePresence>
          {showStrokeGuide && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="flex justify-center pb-1">
                <KanjiStrokeOrder kanji={target.kanji} size={200} showNumbers />
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {/* FigJam 스타일 상단 부유 툴바 — 캔버스 위에 pill 형태 */}
        <div className="flex justify-center">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 overflow-x-auto"
            style={{
              background: 'var(--color-card)',
              border: '1.5px solid var(--color-border-light)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              maxWidth: '100%',
            }}
          >
            {/* 펜 두께 — 3종 */}
            <div className="flex items-center gap-1.5 shrink-0">
              {(['thin', 'medium', 'thick'] as PenSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setPenSize(s)}
                  className="h-9 w-9 rounded-full flex items-center justify-center transition-colors shrink-0"
                  style={{
                    background: penSize === s ? 'var(--color-muted)' : 'transparent',
                  }}
                  aria-label={`펜 ${s}`}
                >
                  <span
                    className="rounded-full"
                    style={{
                      width: s === 'thin' ? 5 : s === 'medium' ? 9 : 14,
                      height: s === 'thin' ? 5 : s === 'medium' ? 9 : 14,
                      background: 'var(--color-text-primary)',
                    }}
                  />
                </button>
              ))}
            </div>

            <ToolDivider />

            {/* 색상 — 6종 */}
            <div className="flex items-center gap-1.5 shrink-0">
              {PEN_COLORS.map((c) => {
                const active = !isEraser && penColor === c.hex
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setPenColor(c.hex)
                      setIsEraser(false)
                    }}
                    className="h-9 w-9 rounded-full flex items-center justify-center transition-all shrink-0"
                    aria-label={`${c.label} 색상`}
                  >
                    <span
                      className="rounded-full transition-all"
                      style={{
                        width: active ? 22 : 18,
                        height: active ? 22 : 18,
                        background: c.hex,
                        boxShadow: active
                          ? '0 0 0 2px var(--color-card), 0 0 0 4px var(--color-foreground)'
                          : undefined,
                      }}
                    />
                  </button>
                )
              })}
            </div>

            <ToolDivider />

            {/* 지우개 모드 */}
            <button
              onClick={() => setIsEraser((v) => !v)}
              className="h-9 w-9 rounded-full flex items-center justify-center transition-colors shrink-0"
              style={{
                background: isEraser ? 'var(--color-primary)' : 'transparent',
                color: isEraser ? '#fff' : 'var(--color-text-secondary)',
              }}
              aria-label="지우개 모드"
              aria-pressed={isEraser}
            >
              <Eraser className="w-4 h-4" />
            </button>

            <ToolDivider />

            {/* 액션 — 가이드/되돌리기/전체지우기 */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setShowTemplate((v) => !v)}
                className="h-9 w-9 rounded-full flex items-center justify-center transition-colors shrink-0"
                style={{
                  background: showTemplate ? 'var(--color-muted)' : 'transparent',
                  color: 'var(--color-text-secondary)',
                }}
                aria-label="가이드 토글"
              >
                {showTemplate ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={handleUndo}
                className="h-9 w-9 rounded-full flex items-center justify-center transition-colors shrink-0"
                style={{ color: 'var(--color-text-secondary)' }}
                aria-label="되돌리기"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                className="h-9 w-9 rounded-full flex items-center justify-center transition-colors shrink-0"
                style={{ color: 'var(--color-text-secondary)' }}
                aria-label="전체 지우기"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 그리기 캔버스 */}
        <div className="relative" style={{ width: '100%', maxWidth: CANVAS_SIZE, margin: '0 auto' }}>
          <div
            className="relative rounded-2xl overflow-hidden border-[1.5px]"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--color-card)',
              aspectRatio: '1 / 1',
              touchAction: 'none',
            }}
          >
            {/* 타겟 한자 — 옅게 표시 (template) */}
            {showTemplate && (
              <span
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-bold"
                style={{
                  fontSize: CANVAS_SIZE * 0.78,
                  color: 'var(--color-border)',
                  opacity: 0.5,
                  fontFamily: '"Hiragino Sans", "Noto Sans JP", serif',
                  lineHeight: 1,
                  marginTop: CANVAS_SIZE * 0.05,
                }}
                aria-hidden="true"
              >
                {target.kanji}
              </span>
            )}
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="absolute inset-0 w-full h-full"
              style={{ touchAction: 'none' }}
            />
          </div>
        </div>


        {/* 채점 결과 */}
        <AnimatePresence>
          {result && feedback && (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <MascotScene reaction={reaction} sizeToken="xs" />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[10px] font-extrabold tracking-wider"
                      style={{
                        color: feedback.level === 'great'
                          ? 'var(--color-success-dark, #16a34a)'
                          : feedback.level === 'good'
                            ? 'var(--color-primary)'
                            : 'var(--color-warning, #f59e0b)',
                      }}
                    >
                      {result.total}점
                    </p>
                    <p className="text-sm font-bold mt-0.5">{feedback.message}</p>
                    <p className="text-[10px] mt-1 font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                      적중 {result.coverage}% · 노이즈 {result.noise}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </m.div>
          )}
        </AnimatePresence>

        {/* 액션 버튼 — 캔버스와 폭 맞추기 + 위로 충분한 여백 */}
        <div
          className="grid grid-cols-2 gap-2.5 pt-6"
          style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}
        >
          {result ? (
            <>
              <Button variant="outline" className="h-12" onClick={() => initCanvas()}>
                <RotateCcw className="w-4 h-4 mr-1.5" />
                다시 쓰기
              </Button>
              <Button className="h-12" onClick={handleNext}>
                다음 한자
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="h-12" onClick={() => navigate('/kanji')}>
                목록으로
              </Button>
              <Button
                className="h-12"
                onClick={handleCheck}
                disabled={!hasDrawn}
              >
                <Check className="w-4 h-4 mr-1.5" />
                채점하기
              </Button>
            </>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
