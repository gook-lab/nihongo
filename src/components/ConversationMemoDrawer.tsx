// 회화 메모 drawer.
// - 모바일(< 768px): 화면 전체 width의 bottom sheet (위로 슬라이드)
// - 데스크탑: 우하단 코너에 고정, 기본 1/2 width + 좌상단 대각 resize handle
//   (뒤의 콘텐츠와 비교 가능, 크기는 localStorage에 저장)
import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { Bookmark, BookOpen, Trash2, X, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TTSButton } from '@/components/TTSButton'
import { useAppStore } from '@/store'
import { CONVERSATION_CATEGORIES } from '@/data/conversations'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'

interface ConversationMemoDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SIZE_KEY = 'memo-drawer-size'
const MIN_W = 320
const MIN_H = 240
const MARGIN = 12 // 화면 가장자리 여유

interface Size {
  width: number
  height: number
}

function readSavedSize(): Size | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SIZE_KEY)
    if (!raw) return null
    const v = JSON.parse(raw)
    if (typeof v.width === 'number' && typeof v.height === 'number') return v
  } catch {}
  return null
}

function defaultSize(): Size {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1024
  const h = typeof window !== 'undefined' ? window.innerHeight : 768
  return {
    width: Math.round(Math.min(520, w * 0.5)),
    height: Math.round(Math.min(640, h * 0.75)),
  }
}

function useIsDesktop() {
  const [v, setV] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false,
  )
  useEffect(() => {
    const on = () => setV(window.innerWidth >= 768)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return v
}

export function ConversationMemoDrawer({
  open,
  onOpenChange,
}: ConversationMemoDrawerProps) {
  const navigate = useNavigate()
  const isDesktop = useIsDesktop()
  const conversationMemo = useAppStore((s) => s.conversationMemo)
  const removeConversationMemo = useAppStore((s) => s.removeConversationMemo)

  const [size, setSize] = useState<Size>(() => readSavedSize() ?? defaultSize())

  // 화면 크기 변화 시 size를 화면 안으로 clamp
  useEffect(() => {
    if (!isDesktop) return
    const clamp = () => {
      setSize((s) => ({
        width: Math.min(s.width, window.innerWidth - MARGIN * 2),
        height: Math.min(s.height, window.innerHeight - MARGIN * 2),
      }))
    }
    clamp()
    window.addEventListener('resize', clamp)
    return () => window.removeEventListener('resize', clamp)
  }, [isDesktop])

  // body 스크롤 잠금 (모바일에서만 — 데스크탑은 뒷 콘텐츠와 비교 가능해야)
  useEffect(() => {
    if (open && !isDesktop) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, isDesktop])

  // ESC로 닫기
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  // ── 좌상단 모서리 대각 resize 핸들 ─────────────────────
  const dragRef = useRef<{
    startX: number
    startY: number
    startW: number
    startH: number
  } | null>(null)

  const onResizeMove = useCallback((ev: MouseEvent | TouchEvent) => {
    if (!dragRef.current) return
    const point = 'touches' in ev ? ev.touches[0] : ev
    const dx = dragRef.current.startX - point.clientX
    const dy = dragRef.current.startY - point.clientY
    const maxW = window.innerWidth - MARGIN * 2
    const maxH = window.innerHeight - MARGIN * 2
    setSize({
      width: Math.max(MIN_W, Math.min(maxW, dragRef.current.startW + dx)),
      height: Math.max(MIN_H, Math.min(maxH, dragRef.current.startH + dy)),
    })
  }, [])

  const onResizeEnd = useCallback(() => {
    if (!dragRef.current) return
    dragRef.current = null
    document.removeEventListener('mousemove', onResizeMove)
    document.removeEventListener('mouseup', onResizeEnd)
    document.removeEventListener('touchmove', onResizeMove)
    document.removeEventListener('touchend', onResizeEnd)
    // 저장
    try {
      localStorage.setItem(SIZE_KEY, JSON.stringify(size))
    } catch {}
  }, [size, onResizeMove])

  const onResizeStart = (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault()
    const point = 'touches' in e ? e.touches[0] : e
    dragRef.current = {
      startX: point.clientX,
      startY: point.clientY,
      startW: size.width,
      startH: size.height,
    }
    document.addEventListener('mousemove', onResizeMove)
    document.addEventListener('mouseup', onResizeEnd)
    document.addEventListener('touchmove', onResizeMove, { passive: false })
    document.addEventListener('touchend', onResizeEnd)
  }

  const getCategoryName = (categoryId: string) => {
    return CONVERSATION_CATEGORIES.find((c) => c.id === categoryId)?.nameKo ?? categoryId
  }

  const handleGoToDictionary = (text: string) => {
    onOpenChange(false)
    navigate(`/dictionary?search=${encodeURIComponent(text)}`)
  }

  const grouped = conversationMemo.reduce(
    (acc, word) => {
      if (!acc[word.category]) acc[word.category] = []
      acc[word.category].push(word)
      return acc
    },
    {} as Record<string, typeof conversationMemo>,
  )

  // BottomNav(88px) + 시각적 여백 12px = drawer가 BottomNav와 살짝 떨어져 자연스럽게 보임
  const BOTTOM_NAV_H = 100

  // 모바일: 기존 풀-width bottom sheet (단, BottomNav 영역 만큼 위에서 끝남)
  // 데스크탑: 우하단 코너 fixed box (resize 가능)
  const panelStyle: React.CSSProperties = isDesktop
    ? {
        background: 'var(--color-card)',
        width: size.width,
        height: size.height,
        right: MARGIN,
        bottom: MARGIN,
        boxShadow: '0 -8px 28px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.05)',
      }
    : {
        background: 'var(--color-card)',
        // 가용 영역을 BottomNav만큼 제외 → 내부 콘텐츠가 잘리지 않음
        maxHeight: `calc(85vh - ${BOTTOM_NAV_H}px)`,
        bottom: BOTTOM_NAV_H,
        boxShadow: '0 -8px 28px rgba(0,0,0,0.16)',
      }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — 모바일만 (데스크탑은 뒷 콘텐츠와 비교 가능해야 하므로 없음) */}
          {!isDesktop && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => onOpenChange(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
          )}

          {/* Panel */}
          <m.div
            initial={
              isDesktop
                ? { opacity: 0, scale: 0.95, x: 20, y: 20 }
                : { y: '100%' }
            }
            animate={
              isDesktop ? { opacity: 1, scale: 1, x: 0, y: 0 } : { y: 0 }
            }
            exit={
              isDesktop
                ? { opacity: 0, scale: 0.95, x: 20, y: 20 }
                : { y: '100%' }
            }
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className={
              isDesktop
                ? 'fixed z-50 rounded-2xl overflow-hidden flex flex-col'
                : // bottom은 panelStyle에서 BOTTOM_NAV_H로 지정 (Tailwind bottom-0 제거)
                  'fixed left-0 right-0 z-50 rounded-t-3xl overflow-hidden flex flex-col'
            }
            style={panelStyle}
            role="dialog"
            aria-modal={!isDesktop ? 'true' : undefined}
          >
            {/* 좌상단 대각 resize handle (데스크탑만) */}
            {isDesktop && (
              <button
                onMouseDown={onResizeStart}
                onTouchStart={onResizeStart}
                className="absolute top-1 left-1 w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted group z-10"
                style={{ cursor: 'nwse-resize' }}
                aria-label="크기 조절"
                title="모서리를 드래그해 크기 조절"
              >
                <Maximize2
                  className="w-3.5 h-3.5 -scale-x-100 opacity-50 group-hover:opacity-100"
                  style={{ color: 'var(--color-text-secondary)' }}
                />
              </button>
            )}

            {/* 모바일: drag handle 시각 어포던스 */}
            {!isDesktop && (
              <div className="flex justify-center pt-3 pb-1">
                <div
                  className="w-10 h-1 rounded-full"
                  style={{ background: 'var(--color-border)' }}
                />
              </div>
            )}

            {/* Header */}
            <div
              className={`flex items-center justify-between px-5 pb-3 border-b ${
                isDesktop ? 'pt-3 pl-10' : 'pt-2'
              }`}
              style={{ borderColor: 'var(--color-border-light)' }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'var(--color-sakura-100)' }}
                >
                  <Bookmark className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold leading-tight">메모</p>
                  <p
                    className="text-[11px] leading-tight"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    저장한 단어 {conversationMemo.length}개
                  </p>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center shrink-0"
                aria-label="닫기"
              >
                <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            </div>

            {/* Body (scrollable) */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {conversationMemo.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                    style={{ background: 'var(--color-muted)' }}
                  >
                    <Bookmark
                      className="w-6 h-6"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    />
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    아직 저장한 단어가 없습니다
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    회화 표현에서 단어를 탭해서 저장하세요
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {Object.entries(grouped).map(([catId, words]) => (
                    <div key={catId}>
                      <p
                        className="type-section mb-2 px-1"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        {getCategoryName(catId)} · {words.length}개
                      </p>
                      <div className="space-y-2">
                        <AnimatePresence>
                          {words.map((word) => (
                            <m.div
                              key={word.text}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="rounded-xl p-3 flex items-center gap-3 border"
                              style={{
                                background: 'var(--color-card)',
                                borderColor: 'var(--color-border-light)',
                              }}
                            >
                              <TTSButton
                                text={word.text}
                                variant="ghost"
                                size="icon"
                                className="shrink-0"
                              />
                              <button
                                className="flex-1 min-w-0 text-left"
                                onClick={() => handleGoToDictionary(word.text)}
                              >
                                <div className="flex items-baseline gap-2 flex-wrap">
                                  <span className="font-bold whitespace-nowrap">
                                    {word.text}
                                  </span>
                                  <span
                                    className="text-[10px] whitespace-nowrap"
                                    style={{ color: 'var(--color-text-secondary)' }}
                                  >
                                    {word.reading}
                                  </span>
                                  <span
                                    className="romaji text-[9px] whitespace-nowrap"
                                    style={{ color: 'var(--color-text-tertiary)' }}
                                  >
                                    {hiraganaToRomaji(word.reading)}
                                  </span>
                                </div>
                                <p
                                  className="text-sm font-medium mt-0.5 truncate"
                                  style={{ color: 'var(--color-primary)' }}
                                >
                                  {word.meaning}
                                </p>
                              </button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0"
                                onClick={() => handleGoToDictionary(word.text)}
                                aria-label="사전에서 보기"
                              >
                                <BookOpen
                                  className="w-4 h-4"
                                  style={{ color: 'var(--color-text-secondary)' }}
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0"
                                onClick={() => removeConversationMemo(word.text)}
                                aria-label="삭제"
                              >
                                <Trash2
                                  className="w-4 h-4"
                                  style={{ color: 'var(--color-text-secondary)' }}
                                />
                              </Button>
                            </m.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
