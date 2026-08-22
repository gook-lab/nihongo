// 대화 시나리오 목록 — 짧은 상황극 모음
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { MessagesSquare, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { BottomNav } from '@/components/BottomNav'
import { PageHeader } from '@/components/PageHeader'
import { DIALOGUES } from '@/data/dialogues'

export function DialoguePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader title="대화 시나리오" icon={MessagesSquare} tone="conv" back backTo="/conversation" />

      <m.div
        className="px-5 mt-2 space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm text-muted-foreground px-1 mb-1">
          상황별 짧은 대화 {DIALOGUES.length}편 — 화자가 바뀌는 흐름으로 익히세요
        </p>

        {DIALOGUES.map((d, idx) => (
          <m.div
            key={d.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            <Card
              onClick={() => navigate(`/dialogue/${d.id}`)}
              className="p-4 cursor-pointer hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: 'var(--color-muted)' }}
                >
                  {d.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold truncate">{d.titleKo}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
                      {d.level}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {d.titleJa} · {d.lines.length}턴
                  </p>
                  <p className="text-[11px] text-muted-foreground/80 line-clamp-1 mt-0.5">
                    {d.context}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            </Card>
          </m.div>
        ))}
      </m.div>

      <BottomNav />
    </div>
  )
}
