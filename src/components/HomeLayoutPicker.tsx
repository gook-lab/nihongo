// 홈 전용 플로팅 버튼: 클릭 시 6개 레이아웃을 즉시 변경할 수 있는 다이얼로그
import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { LayoutGrid, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppStore } from '@/store'
import type { HomeLayoutId } from '@/types'
import { cn } from '@/lib/utils'

const LAYOUTS: Array<{ id: HomeLayoutId; name: string; sub: string }> = [
  { id: 'auto', name: '자동', sub: '여행 회화 우선' },
  { id: 'travel', name: '여행', sub: '회화 상황별' },
  { id: 'default', name: '기본', sub: '카드 + XP 바' },
  { id: 'mono', name: '모노', sub: '잉크 블랙 배너' },
  { id: 'ios', name: 'iOS', sub: 'Large Title' },
  { id: 'editorial', name: '에디토리얼', sub: '거대 세리프' },
  { id: 'mascot', name: '마스코트', sub: '말풍선 hero' },
]

export function HomeLayoutPicker() {
  const homeLayoutId = useAppStore((s) => s.homeLayoutId)
  const setHomeLayout = useAppStore((s) => s.setHomeLayout)
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* 플로팅 버튼 — 우하단, BottomNav 위 */}
      <m.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-5 z-30 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors"
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border-light)',
        }}
        aria-label="홈 레이아웃 변경"
      >
        <LayoutGrid className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
        {/* 작은 인디케이터 dot (auto 아닐 때만) */}
        {homeLayoutId !== 'auto' && (
          <span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
            style={{
              background: 'var(--color-primary)',
              borderColor: 'var(--color-card)',
            }}
          />
        )}
      </m.button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100vw-32px)] max-w-[400px] p-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <LayoutGrid className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              홈 레이아웃
            </DialogTitle>
          </DialogHeader>

          <p
            className="text-[11px] mb-3"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            테마(색·폰트)는 그대로 두고, 홈 화면 구성만 바꿔봐요
          </p>

          <div className="grid grid-cols-2 gap-2">
            {LAYOUTS.map((layout) => {
              const isSelected = homeLayoutId === layout.id
              return (
                <m.button
                  key={layout.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setHomeLayout(layout.id)
                    // 약간의 딜레이로 사용자에게 선택 피드백을 보여준 뒤 닫기
                    setTimeout(() => setOpen(false), 180)
                  }}
                  className={cn(
                    'relative rounded-xl border-2 p-3 text-left transition-all',
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
                    {layout.name}
                  </p>
                  <p
                    className="text-[11px] mt-0.5"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {layout.sub}
                  </p>
                  <AnimatePresence>
                    {isSelected && (
                      <m.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm"
                      >
                        <span className="text-white text-xs">✓</span>
                      </m.div>
                    )}
                  </AnimatePresence>
                </m.button>
              )
            })}
          </div>

          <button
            onClick={() => setOpen(false)}
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-xs rounded-lg"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <X className="w-3 h-3" />
            닫기
          </button>
        </DialogContent>
      </Dialog>
    </>
  )
}
