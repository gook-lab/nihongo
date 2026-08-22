import { m } from 'framer-motion'
import { User } from 'lucide-react'
import { JapaneseText } from './JapaneseText'
import { useAppStore } from '@/store'
import { MASCOTS } from '@/data/mascots'
import type { ChatMessageData } from '@/hooks/useAIChat'

interface ChatMessageProps {
  message: ChatMessageData
  isStreaming?: boolean
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const selectedMascotId = useAppStore((s) => s.selectedMascotId)
  const mascot = MASCOTS.find((m) => m.id === selectedMascotId) ?? MASCOTS[0]

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* 아바타 */}
      {isUser ? (
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary text-primary-foreground">
          <User className="w-4 h-4" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-primary/20 shadow-sm">
          <img src={mascot.image} alt={mascot.nameKr} className="w-full h-full object-cover" />
        </div>
      )}

      {/* 메시지 버블 */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="text-sm">
            {message.content ? (
              <JapaneseText content={message.content} />
            ) : isStreaming ? (
              <span className="inline-flex items-center gap-1.5">
                {[0, 0.15, 0.3].map((d, i) => (
                  <span
                    key={i}
                    className="inline-block w-2 h-2 rounded-full bg-current"
                    style={{
                      animation: `spinner-typing-dot 1.2s ease-in-out ${d}s infinite`,
                    }}
                  />
                ))}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </m.div>
  )
}
