import { m } from 'framer-motion'
import { MessageSquare } from 'lucide-react'

interface ChatFABProps {
  onClick: () => void
  hasNewMessage?: boolean
  isOpen?: boolean
}

export function ChatFAB({ onClick, hasNewMessage, isOpen }: ChatFABProps) {
  return (
    <m.button
      layoutId="chat-container"
      className="fixed bottom-24 right-5 z-[60] w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      style={{ opacity: isOpen ? 0 : 1, pointerEvents: isOpen ? 'none' : 'auto' }}
    >
      <m.div
        animate={hasNewMessage ? { scale: [1, 1.2, 1] } : { scale: [1, 1.1, 1] }}
        transition={{ duration: hasNewMessage ? 0.5 : 2, repeat: Infinity, repeatDelay: hasNewMessage ? 0.5 : 1 }}
      >
        <MessageSquare className="w-6 h-6" />
      </m.div>

      {/* 신규 메시지 배지 */}
      {hasNewMessage && (
        <m.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
        >
          1
        </m.span>
      )}
    </m.button>
  )
}
