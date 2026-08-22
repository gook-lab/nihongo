// 일본어 관용구 페이지 — 카테고리 필터 + 펼침 카드.
import { useState, useMemo } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronDown } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { BottomNav } from '@/components/BottomNav'
import { Card } from '@/components/ui/card'
import { TTSButton } from '@/components/TTSButton'
import { EmptyState } from '@/components/EmptyState'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'
import { IDIOMS, IDIOM_CATEGORIES, type Idiom } from '@/data/idioms'

type CategoryFilter = 'all' | Idiom['category']
type LevelFilter = 'all' | Idiom['level']

export function IdiomsPage() {
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [level, setLevel] = useState<LevelFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const items = useMemo(() => {
    return IDIOMS.filter(
      (i) =>
        (category === 'all' || i.category === category) &&
        (level === 'all' || i.level === level),
    )
  }, [category, level])

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader title="관용구" subtitle="일상 비유 표현" icon={Sparkles} tone="content" back backTo="/" />

      <div className="px-5 pt-4 space-y-4">
        {/* 카테고리 필터 */}
        <div>
          <p className="type-section mb-2 px-1">카테고리</p>
          <div className="flex flex-wrap gap-2">
            <FilterChip label="전체" active={category === 'all'} onClick={() => setCategory('all')} />
            {IDIOM_CATEGORIES.map((c) => (
              <FilterChip
                key={c.id}
                label={`${c.emoji} ${c.nameKo}`}
                active={category === c.id}
                onClick={() => setCategory(c.id)}
              />
            ))}
          </div>
        </div>

        {/* 레벨 필터 */}
        <div>
          <p className="type-section mb-2 px-1">레벨</p>
          <div className="flex gap-2">
            {(['all', 'N5', 'N4', 'N3', 'N2', 'N1'] as LevelFilter[]).map((lv) => (
              <FilterChip
                key={lv}
                label={lv === 'all' ? '전체' : lv}
                active={level === lv}
                onClick={() => setLevel(lv)}
              />
            ))}
          </div>
        </div>

        <p className="text-xs px-1" style={{ color: 'var(--color-text-tertiary)' }}>
          {items.length}개 관용구
        </p>

        <div className="space-y-2.5">
          {items.length === 0 ? (
            <EmptyState
              reaction="think"
              compact
              title="조건에 맞는 관용구가 없어요"
              description="다른 카테고리나 레벨을 선택해 보세요"
            />
          ) : (
            items.map((idiom) => (
              <IdiomCard
                key={idiom.id}
                idiom={idiom}
                expanded={expandedId === idiom.id}
                onToggle={() => setExpandedId(expandedId === idiom.id ? null : idiom.id)}
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
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-3 h-8 rounded-full text-[12px] font-semibold transition-colors border-[1.5px]"
      style={{
        background: active ? 'var(--color-primary)' : 'var(--color-card)',
        color: active ? 'var(--color-primary-foreground)' : 'var(--color-text-secondary)',
        borderColor: active ? 'var(--color-primary)' : 'var(--color-border-light)',
      }}
    >
      {label}
    </button>
  )
}

function IdiomCard({
  idiom,
  expanded,
  onToggle,
}: {
  idiom: Idiom
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <Card className="overflow-hidden">
      <button onClick={onToggle} className="w-full p-4 flex items-start justify-between gap-3 text-left">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded"
              style={{ background: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
            >
              {idiom.level}
            </span>
            <p
              className="text-base font-bold"
              style={{ fontFamily: '"Hiragino Sans","Noto Sans JP", serif' }}
            >
              {idiom.ja}
            </p>
          </div>
          <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
            {idiom.reading}
            <span className="ml-2 font-mono opacity-70">{hiraganaToRomaji(idiom.reading.replace(/\s+/g, ''))}</span>
          </p>
          <p className="text-[13px] mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {idiom.meaningKo}
          </p>
        </div>
        <m.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown
            className="w-5 h-5 shrink-0 mt-0.5"
            style={{ color: 'var(--color-text-tertiary)' }}
          />
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
              <div className="pt-3">
                <p className="type-eyebrow mb-1">직역</p>
                <p className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
                  {idiom.literalKo}
                </p>
              </div>

              <div>
                <p className="type-eyebrow mb-1.5">예문</p>
                <div className="rounded-xl p-3" style={{ background: 'var(--color-sakura-100)' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[15px] font-bold leading-snug"
                        style={{
                          color: 'var(--color-foreground)',
                          fontFamily: '"Hiragino Sans","Noto Sans JP", serif',
                        }}
                      >
                        {idiom.example.ja}
                      </p>
                      <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                        {idiom.example.reading}
                      </p>
                      <p
                        className="text-[10px] mt-0.5 font-mono"
                        style={{ color: 'var(--color-text-tertiary)', opacity: 0.7 }}
                      >
                        {hiraganaToRomaji(idiom.example.reading.replace(/\s+/g, ''))}
                      </p>
                      <p className="text-[13px] mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                        {idiom.example.ko}
                      </p>
                    </div>
                    <TTSButton text={idiom.example.ja} variant="ghost" size="icon" />
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
