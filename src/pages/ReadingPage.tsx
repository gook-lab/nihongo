import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { BookOpen, Clock, ChevronRight, Sparkles, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BottomNav } from '@/components/BottomNav'
import { PageHeader } from '@/components/PageHeader'
import { READING_PIECES, getReadingByLevel } from '@/data/reading'
import { useAppStore } from '@/store'

type LevelFilter = 'all' | 'N5' | 'N4' | 'N3'

export function ReadingPage() {
  const navigate = useNavigate()
  const aiReadings = useAppStore((s) => s.aiReadings)
  const removeAiReading = useAppStore((s) => s.removeAiReading)
  const [filter, setFilter] = useState<LevelFilter>('all')

  const pieces = useMemo(() => getReadingByLevel(filter), [filter])

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader
        title="짧은 글"
        subtitle={`${READING_PIECES.length}편`}
        icon={BookOpen}
        back
        backTo="/"
      />

      <div className="px-5 mt-3 space-y-4">
        {/* AI 이야기 만들기 진입 */}
        <m.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/reading/ai')}
          className="w-full flex items-center gap-3 rounded-2xl p-4 text-left transition-all"
          style={{
            background: 'linear-gradient(135deg, var(--color-sakura-100), var(--color-card))',
            border: '1px solid var(--color-border-light)',
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'var(--color-card)' }}
          >
            <Sparkles className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="flex-1">
            <p className="font-semibold">AI로 새 이야기 만들기</p>
            <p
              className="text-xs"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              레벨과 주제를 골라 무한히 만들어보세요
            </p>
          </div>
          <ChevronRight
            className="w-5 h-5 shrink-0"
            style={{ color: 'var(--color-text-tertiary)' }}
          />
        </m.button>

        {/* 저장된 AI 이야기 — 최대 4개 미리보기, 더 보기는 별도 라우트 없으므로 카드들 그대로 표시 */}
        {aiReadings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <p
                className="type-section"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                내 라이브러리 · {aiReadings.length}편
              </p>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {aiReadings.slice(0, 5).map((piece) => (
                  <m.div
                    key={piece.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <Sparkles
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: 'var(--color-primary)' }}
                          />
                          <button
                            onClick={() => navigate(`/reading/${piece.id}`)}
                            className="flex-1 min-w-0 text-left"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                                style={{
                                  background: 'var(--color-sakura-100)',
                                  color: 'var(--color-primary)',
                                }}
                              >
                                {piece.level}
                              </span>
                              <span className="font-semibold text-sm truncate">
                                {piece.title}
                              </span>
                            </div>
                            <p
                              className="text-[11px] mt-0.5 truncate"
                              style={{ color: 'var(--color-text-secondary)' }}
                            >
                              {piece.titleKo}
                            </p>
                          </button>
                          <button
                            onClick={() => removeAiReading(piece.id)}
                            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center shrink-0"
                            aria-label="삭제"
                          >
                            <Trash2
                              className="w-3.5 h-3.5"
                              style={{ color: 'var(--color-text-tertiary)' }}
                            />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </m.div>
                ))}
              </AnimatePresence>
              {aiReadings.length > 5 && (
                <p
                  className="text-center text-[11px] pt-1"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  + {aiReadings.length - 5}편 더 (생성 순)
                </p>
              )}
            </div>
          </div>
        )}

        {/* 기본 짧은 글 섹션 라벨 */}
        <p
          className="type-section px-1"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          큐레이션 · {READING_PIECES.length}편
        </p>

        {/* JLPT 레벨 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['all', 'N5', 'N4', 'N3'] as LevelFilter[]).map((mode) => {
            const count =
              mode === 'all'
                ? READING_PIECES.length
                : READING_PIECES.filter((p) => p.level === mode).length
            return (
              <Button
                key={mode}
                variant={filter === mode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(mode)}
                className="shrink-0"
              >
                {mode === 'all' ? `전체 (${count})` : `${mode} (${count})`}
              </Button>
            )
          })}
        </div>

        {/* 목록 */}
        <m.div
          className="mt-4 grid grid-cols-1 gap-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
        >
          {pieces.map((piece) => (
            <m.div
              key={piece.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card
                onClick={() => navigate(`/reading/${piece.id}`)}
                className="cursor-pointer transition-transform active:scale-[0.98]"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            background: 'var(--color-sakura-100)',
                            color: 'var(--color-primary)',
                          }}
                        >
                          {piece.level}
                        </span>
                        <span
                          className="text-[10px] flex items-center gap-0.5"
                          style={{ color: 'var(--color-text-tertiary)' }}
                        >
                          <Clock className="w-3 h-3" />
                          {piece.estimatedMinutes}분
                        </span>
                      </div>
                      <h3 className="font-bold text-base leading-tight">
                        {piece.title}
                      </h3>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {piece.titleKo}
                      </p>
                      <p
                        className="text-xs mt-2 line-clamp-2"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {piece.description}
                      </p>
                      <p
                        className="text-[10px] mt-2"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        출처: {piece.sourceLabel}
                      </p>
                    </div>
                    <ChevronRight
                      className="w-5 h-5 shrink-0 mt-1"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </m.div>
          ))}
        </m.div>
      </div>

      <BottomNav />
    </div>
  )
}
