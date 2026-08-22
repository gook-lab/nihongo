import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { m, LayoutGroup } from 'framer-motion'
import {
  MessageCircle,
  Bookmark,
  MessagesSquare,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { getIconByName } from '@/lib/icon-map'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BottomNav } from '@/components/BottomNav'
import { PageHeader } from '@/components/PageHeader'
import { ChatFAB } from '@/components/chat/ChatFAB'
import { ChatModal } from '@/components/chat/ChatModal'
import { ConversationMemoDrawer } from '@/components/ConversationMemoDrawer'
import { useAppStore } from '@/store'
import { CONVERSATION_CATEGORIES } from '@/data/conversations'

export function ConversationPage() {
  const navigate = useNavigate()
  const conversationMemo = useAppStore((state) => state.conversationMemo)
  const conversationProgress = useAppStore((state) => state.conversationProgress)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [memoOpen, setMemoOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader
        title="회화"
        subtitle="상황별 표현 학습"
        icon={MessageCircle}
        rightAction={
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            onClick={() => setMemoOpen(true)}
            aria-label="메모 열기"
          >
            <Bookmark className="w-5 h-5" />
            {conversationMemo.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                {conversationMemo.length > 99 ? '99+' : conversationMemo.length}
              </span>
            )}
          </Button>
        }
      />

      {/* 대화 시나리오 진입 카드 */}
      <m.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/dialogue')}
        className="mx-5 mt-4 w-[calc(100%-2.5rem)] rounded-2xl p-4 flex items-center gap-3 text-left"
        style={{
          background:
            'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
          color: 'var(--color-primary-foreground)',
        }}
      >
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(255,255,255,0.18)' }}
        >
          <MessagesSquare className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">대화 시나리오</p>
          <p className="text-[12px] opacity-90">상황별 짧은 대화로 흐름까지 익히기</p>
        </div>
        <ChevronRight className="w-4 h-4 shrink-0 opacity-80" />
      </m.button>

      {/* AI 회화 진입 카드 — Gemini가 NPC 역할로 일본어 롤플레이 */}
      <m.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/conversation/ai')}
        className="mx-5 mt-3 w-[calc(100%-2.5rem)] rounded-2xl p-4 flex items-center gap-3 text-left border-[1.5px]"
        style={{
          background: 'var(--color-card)',
          borderColor: 'var(--color-primary)',
        }}
      >
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: 'var(--color-sakura-100)',
            color: 'var(--color-primary)',
          }}
        >
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">AI 회화 (롤플레이)</p>
          <p
            className="text-[12px]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            상황을 골라 AI와 실시간 일본어 대화
          </p>
        </div>
        <ChevronRight
          className="w-4 h-4 shrink-0"
          style={{ color: 'var(--color-text-tertiary)' }}
        />
      </m.button>

      {/* 카테고리 그리드 */}
      <div className="grid grid-cols-2 gap-4 px-5 mt-4">
        {CONVERSATION_CATEGORIES.map((category, index) => {
          const Icon = getIconByName(category.icon)
          // 현재 phrases 배열에 존재하는 ID만 유효한 진척으로 카운트
          // (과거 자동 마킹/삭제된 phrase ID가 viewed에 남아있어도 부풀려지지 않음)
          const phraseIds = new Set(category.phrases.map((p) => p.id))
          const viewed = (conversationProgress[category.id] ?? []).filter((id) =>
            phraseIds.has(id),
          ).length
          const total = category.phrases.length
          const percent = total > 0 ? Math.round((viewed / total) * 100) : 0
          return (
            <m.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="p-4 cursor-pointer hover:bg-primary/5 transition-colors relative"
                onClick={() => navigate(`/conversation/${category.id}`)}
              >
                {/* 완료 배지 (100% 시) */}
                {percent === 100 && (
                  <span
                    className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: 'var(--color-success-light)',
                      color: 'var(--color-success-dark)',
                    }}
                  >
                    완료
                  </span>
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold">{category.nameKo}</p>
                  <p className="text-xs text-muted-foreground">{category.nameJa}</p>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {viewed > 0 ? `${viewed}/${total}` : `${total}개 표현`}
                  </p>
                  {/* 진행도 바 */}
                  {viewed > 0 && (
                    <div
                      className="w-full h-1 rounded-full mt-2 overflow-hidden"
                      style={{ background: 'var(--color-muted)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percent}%`,
                          background: 'var(--color-primary)',
                        }}
                      />
                    </div>
                  )}
                </div>
              </Card>
            </m.div>
          )
        })}
      </div>

      <LayoutGroup>
        <ChatFAB onClick={() => setIsChatOpen(true)} hasNewMessage={hasNewMessage} isOpen={isChatOpen} />
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onNewMessage={setHasNewMessage}
        />
      </LayoutGroup>

      <ConversationMemoDrawer open={memoOpen} onOpenChange={setMemoOpen} />

      <BottomNav />
    </div>
  )
}
