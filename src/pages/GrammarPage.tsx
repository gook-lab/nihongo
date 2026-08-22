// 문법 페이지 — N5~N3 핵심 문법 (조사/동사/형용사/표현).
// 카테고리 + 레벨 필터, 펼침 카드.
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown, Play } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { BottomNav } from '@/components/BottomNav'
import { EmptyState } from '@/components/EmptyState'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TTSButton } from '@/components/TTSButton'
import { getIconByName } from '@/lib/icon-map'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'
import {
  GRAMMAR_ITEMS,
  GRAMMAR_CATEGORIES,
  type GrammarCategory,
  type GrammarItem,
} from '@/data/grammar'

type LevelFilter = 'all' | 'N5' | 'N4' | 'N3'
type CategoryFilter = 'all' | GrammarCategory

export function GrammarPage() {
  const navigate = useNavigate()
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const items = useMemo(() => {
    return GRAMMAR_ITEMS.filter(
      (g) =>
        (categoryFilter === 'all' || g.category === categoryFilter) &&
        (levelFilter === 'all' || g.level === levelFilter),
    )
  }, [categoryFilter, levelFilter])

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader title="문법" subtitle="JLPT N5~N3 핵심" icon={BookOpen} tone="study" back backTo="/" />

      <div className="px-5 pt-4 space-y-4">
        {/* 카테고리 필터 */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-2 px-1" style={{ color: 'var(--color-text-tertiary)' }}>
            카테고리
          </p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="전체"
              active={categoryFilter === 'all'}
              onClick={() => setCategoryFilter('all')}
            />
            {GRAMMAR_CATEGORIES.map((c) => {
              const Icon = getIconByName(c.icon)
              return (
                <FilterChip
                  key={c.id}
                  label={c.nameKo}
                  icon={<Icon className="w-3.5 h-3.5" />}
                  active={categoryFilter === c.id}
                  onClick={() => setCategoryFilter(c.id)}
                />
              )
            })}
          </div>
        </div>

        {/* 레벨 필터 */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-2 px-1" style={{ color: 'var(--color-text-tertiary)' }}>
            레벨
          </p>
          <div className="flex gap-2">
            {(['all', 'N5', 'N4', 'N3'] as LevelFilter[]).map((lv) => (
              <FilterChip
                key={lv}
                label={lv === 'all' ? '전체' : lv}
                active={levelFilter === lv}
                onClick={() => setLevelFilter(lv)}
              />
            ))}
          </div>
        </div>

        {/* 결과 카운트 */}
        <p className="text-xs px-1" style={{ color: 'var(--color-text-tertiary)' }}>
          {items.length}개 문법
        </p>

        {/* 문법 카드 목록 */}
        <div className="space-y-2.5">
          {items.length === 0 ? (
            <EmptyState
              reaction="think"
              compact
              title="조건에 맞는 문법이 없어요"
              description="다른 카테고리나 레벨을 선택해 보세요"
            />
          ) : (
            items.map((g) => (
              <GrammarCard
                key={g.id}
                item={g}
                expanded={expandedId === g.id}
                onToggle={() => setExpandedId(expandedId === g.id ? null : g.id)}
                onStartLearn={() => navigate('/learn', { state: { grammarLevel: g.level } })}
              />
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

function FilterChip({
  label,
  icon,
  active,
  onClick,
}: {
  label: string
  icon?: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-[12px] font-semibold transition-colors border-[1.5px]"
      style={{
        background: active ? 'var(--color-primary)' : 'var(--color-card)',
        color: active ? 'var(--color-primary-foreground)' : 'var(--color-text-secondary)',
        borderColor: active ? 'var(--color-primary)' : 'var(--color-border-light)',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

function GrammarCard({
  item,
  expanded,
  onToggle,
  onStartLearn,
}: {
  item: GrammarItem
  expanded: boolean
  onToggle: () => void
  onStartLearn: () => void
}) {
  return (
    <Card className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start justify-between gap-3 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded"
              style={{
                background: 'var(--color-primary)',
                color: 'var(--color-primary-foreground)',
              }}
            >
              {item.level}
            </span>
            <p className="text-sm font-bold">{item.title}</p>
          </div>
          <p
            className="text-[20px] font-bold mt-1"
            style={{
              color: 'var(--color-primary)',
              fontFamily: '"Hiragino Sans", "Noto Sans JP", serif',
              letterSpacing: '-0.5px',
            }}
          >
            {item.form}
          </p>
          <p
            className="text-[12px] mt-1"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {item.meaning}
          </p>
        </div>
        <m.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-text-tertiary)' }} />
        </m.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-4 pb-4 pt-1 border-t space-y-3"
              style={{ borderColor: 'var(--color-border-light)' }}
            >
              <p
                className="text-[13px] leading-relaxed pt-3"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {item.explanation}
              </p>

              {/* 예문 */}
              <div className="space-y-2.5 mt-3">
                {item.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-3"
                    style={{ background: 'var(--color-sakura-100)' }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[15px] font-bold leading-snug"
                          style={{
                            color: 'var(--color-foreground)',
                            fontFamily: '"Hiragino Sans", "Noto Sans JP", serif',
                          }}
                        >
                          {ex.ja}
                        </p>
                        <p
                          className="text-[11px] mt-1"
                          style={{ color: 'var(--color-text-tertiary)' }}
                        >
                          {ex.reading}
                        </p>
                        <p
                          className="text-[10px] mt-0.5 font-mono"
                          style={{ color: 'var(--color-text-tertiary)', opacity: 0.7 }}
                        >
                          {hiraganaToRomaji(ex.reading.replace(/\s+/g, ''))}
                        </p>
                        <p
                          className="text-[13px] mt-1.5"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {ex.ko}
                        </p>
                      </div>
                      <TTSButton text={ex.ja} variant="ghost" size="icon" />
                    </div>
                  </div>
                ))}
              </div>

              {/* "이 레벨 단어로 학습" 진입 */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onStartLearn()
                }}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 h-10 rounded-xl font-semibold transition-colors"
                style={{
                  background: 'var(--color-primary)',
                  color: 'var(--color-primary-foreground)',
                }}
              >
                <Play className="w-4 h-4 fill-current" />
                {item.level} 단어 학습하기
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

// 빌드 호환 — 사용 안 하지만 lint 위함
void Button
