// 학습 중 reverse(한→일) 문제용 손글씨 캔버스.
// KanjiPracticePage의 캔버스 로직을 축소한 버전 — 간소화된 도구 (펜 두께 + 지우개 + 클리어 + 되돌리기).
import { useEffect, useImperativeHandle, useRef, useState, forwardRef, useCallback } from 'react'
import { Eraser, Trash2, RotateCcw } from 'lucide-react'

// 드로잉 버퍼 크기. 표시 크기는 디바이스 너비에 맞춰 늘어남(아래 maxWidth).
const SIZE = 360
const PEN_WIDTHS = { thin: 5, medium: 10, thick: 16 }
type PenSize = keyof typeof PEN_WIDTHS

export interface CanvasAnswerHandle {
  getCanvas: () => HTMLCanvasElement | null
  clear: () => void
}

interface Props {
  /** 캔버스가 비활성화될지 (정답·오답 표시 중) */
  disabled?: boolean
  /** 정답 표시 — 외곽선 색상 변경용 */
  state?: 'waiting' | 'correct' | 'wrong' | 'wrong-popup'
  /** 단어가 바뀌면 자동 클리어 — id로 감지 */
  resetKey?: string
}

export const CanvasAnswerInput = forwardRef<CanvasAnswerHandle, Props>(
  ({ disabled = false, state = 'waiting', resetKey }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
    const isDrawingRef = useRef(false)
    const strokesRef = useRef<ImageData[]>([])

    const [penSize, setPenSize] = useState<PenSize>('medium')
    const [isEraser, setIsEraser] = useState(false)

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
    }, [])

    useEffect(() => {
      initCanvas()
    }, [initCanvas, resetKey])

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      clear: () => initCanvas(),
    }))

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
      if (disabled || !ctxRef.current) return
      e.preventDefault()
      canvasRef.current?.setPointerCapture(e.pointerId)
      const snap = ctxRef.current.getImageData(0, 0, SIZE, SIZE)
      strokesRef.current.push(snap)
      if (strokesRef.current.length > 20) strokesRef.current.shift()
      isDrawingRef.current = true
      const p = pointFromEvent(e)
      const ctx = ctxRef.current
      ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over'
      ctx.strokeStyle = '#1A1A1A'
      ctx.lineWidth = PEN_WIDTHS[penSize] * (isEraser ? 1.6 : 1)
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(p.x + 0.01, p.y + 0.01)
      ctx.stroke()
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current || !ctxRef.current) return
      e.preventDefault()
      const p = pointFromEvent(e)
      ctxRef.current.lineTo(p.x, p.y)
      ctxRef.current.stroke()
    }

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      isDrawingRef.current = false
      canvasRef.current?.releasePointerCapture(e.pointerId)
    }

    const handleUndo = () => {
      const ctx = ctxRef.current
      if (!ctx) return
      const prev = strokesRef.current.pop()
      if (prev) ctx.putImageData(prev, 0, 0)
      else ctx.clearRect(0, 0, SIZE, SIZE)
    }

    const borderColor =
      state === 'correct'
        ? '#10B981'
        : state === 'wrong' || state === 'wrong-popup'
          ? '#EF4444'
          : 'var(--color-border)'

    return (
      <div className="space-y-2.5">
        {/* 캔버스 */}
        <div
          className="relative mx-auto"
          style={{ width: '100%', maxWidth: 460 }}
        >
          <div
            className="relative rounded-2xl overflow-hidden border-[1.5px]"
            style={{
              borderColor,
              background: 'var(--color-card)',
              aspectRatio: '1 / 1',
              touchAction: 'none',
              transition: 'border-color 0.2s',
            }}
          >
            <canvas
              ref={canvasRef}
              width={SIZE}
              height={SIZE}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="absolute inset-0 w-full h-full"
              style={{ touchAction: 'none', cursor: disabled ? 'not-allowed' : 'crosshair' }}
            />
          </div>
        </div>

        {/* 간소화 툴바 */}
        <div className="flex justify-center">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
            style={{
              background: 'var(--color-card)',
              border: '1.5px solid var(--color-border-light)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            {/* 펜 두께 */}
            {(['thin', 'medium', 'thick'] as PenSize[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setPenSize(s)
                  setIsEraser(false)
                }}
                disabled={disabled}
                className="h-8 w-8 rounded-full flex items-center justify-center transition-colors shrink-0"
                style={{
                  background:
                    !isEraser && penSize === s ? 'var(--color-muted)' : 'transparent',
                }}
                aria-label={`펜 ${s}`}
              >
                <span
                  className="rounded-full"
                  style={{
                    width: s === 'thin' ? 4 : s === 'medium' ? 8 : 12,
                    height: s === 'thin' ? 4 : s === 'medium' ? 8 : 12,
                    background: 'var(--color-text-primary)',
                  }}
                />
              </button>
            ))}

            <span
              className="inline-block shrink-0 mx-0.5"
              style={{ width: 1, height: 20, background: 'var(--color-border-light)' }}
              aria-hidden
            />

            <button
              onClick={() => setIsEraser((v) => !v)}
              disabled={disabled}
              className="h-8 w-8 rounded-full flex items-center justify-center transition-colors shrink-0"
              style={{
                background: isEraser ? 'var(--color-primary)' : 'transparent',
                color: isEraser ? '#fff' : 'var(--color-text-secondary)',
              }}
              aria-label="지우개"
              aria-pressed={isEraser}
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleUndo}
              disabled={disabled}
              className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
              style={{ color: 'var(--color-text-secondary)' }}
              aria-label="되돌리기"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => initCanvas()}
              disabled={disabled}
              className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
              style={{ color: 'var(--color-text-secondary)' }}
              aria-label="전체 지우기"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    )
  },
)
CanvasAnswerInput.displayName = 'CanvasAnswerInput'
