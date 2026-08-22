import { useState, useCallback, useRef } from 'react'
import { streamChat, isGeminiConfigured } from '@/lib/gemini'

export interface ChatMessageData {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface UseAIChatReturn {
  messages: ChatMessageData[]
  isLoading: boolean
  error: string | null
  isConfigured: boolean
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  abortRequest: () => void
}

export function useAIChat(): UseAIChatReturn {
  const [messages, setMessages] = useState<ChatMessageData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    setError(null)

    // 사용자 메시지 추가
    const userMessage: ChatMessageData = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // AI 응답 메시지 플레이스홀더 추가
    const assistantMessageId = `assistant-${Date.now()}`
    const assistantMessage: ChatMessageData = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, assistantMessage])

    try {
      abortControllerRef.current = new AbortController()

      // 이전 메시지들을 API 형식으로 변환
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

      await streamChat(
        apiMessages,
        (chunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId
                ? { ...m, content: m.content + chunk }
                : m
            )
          )
        },
        abortControllerRef.current.signal
      )
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError' || err.message === 'AbortError') {
          // 요청 취소됨 - 에러로 표시하지 않음
          return
        }

        // Rate limit 에러 처리
        if (err.message.startsWith('RATE_LIMIT:')) {
          const seconds = parseInt(err.message.split(':')[1], 10) || 30
          setError(`요청 한도를 초과했습니다. ${seconds}초 후에 다시 시도해주세요.`)
        } else {
          setError(err.message)
        }
      } else {
        setError('알 수 없는 오류가 났어요.')
      }

      // 빈 응답이면 메시지 제거
      setMessages((prev) => {
        const lastMessage = prev.find((m) => m.id === assistantMessageId)
        if (lastMessage && !lastMessage.content) {
          return prev.filter((m) => m.id !== assistantMessageId)
        }
        return prev
      })
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [messages])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const abortRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsLoading(false)
  }, [])

  return {
    messages,
    isLoading,
    error,
    isConfigured: isGeminiConfigured(),
    sendMessage,
    clearMessages,
    abortRequest,
  }
}
