import { useState, useRef, useEffect, useCallback } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Minus, Expand, Shrink, Trash2, Send, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatMessage } from './ChatMessage'
import { VoiceInputBar, type VoiceLang } from './VoiceInputBar'
import { MascotAvatar, type MascotReaction } from '@/components/MascotAvatar'
import { MascotScene } from '@/components/MascotScene'
import { useAIChat } from '@/hooks/useAIChat'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  onNewMessage?: (hasNew: boolean) => void
}

// 번역 프롬프트 생성 헬퍼
const createTranslationPrompt = (lang: VoiceLang, text: string): string => {
  return lang === 'ko-KR'
    ? `다음 한국어를 일본어로 번역해줘: ${text}`
    : `다음 일본어를 한국어로 번역해줘: ${text}`
}

export function ChatModal({ isOpen, onClose, onNewMessage }: ChatModalProps) {
  const [input, setInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [size, setSize] = useState({ width: 360, height: 450 })
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [selectedLang, setSelectedLang] = useState<VoiceLang>('ko-KR')
  const [mascotReaction, setMascotReaction] = useState<MascotReaction>('idle')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null)
  const isResizing = useRef(false)
  const prevMessagesLength = useRef(0)
  const selectedLangRef = useRef<VoiceLang>('ko-KR')

  // State와 Ref를 동시에 업데이트하는 통합 setter
  const setVoiceLang = useCallback((lang: VoiceLang) => {
    setSelectedLang(lang)
    selectedLangRef.current = lang
  }, [])

  const {
    messages,
    isLoading,
    error,
    isConfigured,
    sendMessage,
    clearMessages,
  } = useAIChat()

  // 음성 인식 결과 처리
  const handleVoiceResult = useCallback(async (text: string) => {
    if (!text.trim()) return

    setIsVoiceMode(false)
    const prompt = createTranslationPrompt(selectedLangRef.current, text)
    await sendMessage(prompt)
  }, [sendMessage])

  const {
    status: voiceStatus,
    transcript,
    interimTranscript,
    error: voiceError,
    isSupported: isVoiceSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    onResult: handleVoiceResult,
  })

  // 새 메시지 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 모달 열릴 때 입력창 포커스 & 배지 초기화
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
      onNewMessage?.(false)
    }
  }, [isOpen, onNewMessage])

  // 마스코트 리액션 관리
  useEffect(() => {
    if (isOpen) {
      // 채팅 열릴 때 wave 인사
      setMascotReaction('wave')
      const timer = setTimeout(() => {
        setMascotReaction('idle')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // AI 응답 대기 중 thinking 애니메이션
  useEffect(() => {
    if (isLoading) {
      setMascotReaction('thinking')
    } else if (mascotReaction === 'thinking') {
      setMascotReaction('idle')
    }
  }, [isLoading, mascotReaction])

  // 백그라운드 응답 감지
  useEffect(() => {
    if (!isOpen && messages.length > prevMessagesLength.current) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.role === 'assistant' && lastMessage.content) {
        onNewMessage?.(true)
      }
    }
    prevMessagesLength.current = messages.length
  }, [messages, isOpen, onNewMessage])

  // 리사이즈 핸들러 - 모달이 열려있을 때만 활성화
  useEffect(() => {
    if (!isOpen) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return

      const newWidth = Math.max(300, Math.min(800, window.innerWidth - e.clientX - 20))
      const newHeight = Math.max(350, Math.min(window.innerHeight - 120, window.innerHeight - e.clientY - 96))

      setSize({ width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      isResizing.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      // 모달 닫힐 때 body 스타일 정리
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isOpen])

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    isResizing.current = true
    document.body.style.cursor = 'nwse-resize'
    document.body.style.userSelect = 'none'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input
    setInput('')
    await sendMessage(message)
  }

  const handleMinimize = () => {
    onClose()
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // 음성 모드 핸들러 - 바로 녹음 시작
  const handleVoiceStart = (lang: VoiceLang) => {
    setVoiceLang(lang)
    resetTranscript()
    setIsVoiceMode(true)
    startListening(lang)
  }

  const handleVoiceClose = () => {
    stopListening()
    setIsVoiceMode(false)
    resetTranscript()
  }

  const handleVoiceRetry = () => {
    stopListening()
    resetTranscript()
    startListening(selectedLangRef.current)
  }

  // 수동 전송
  const handleVoiceSend = async () => {
    const text = (transcript + interimTranscript).trim()
    if (!text) return

    stopListening()
    setIsVoiceMode(false)

    const prompt = createTranslationPrompt(selectedLangRef.current, text)
    resetTranscript()
    await sendMessage(prompt)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <m.div
            className="fixed inset-0 z-[65] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleMinimize}
          />
          {/* 채팅 모달 */}
          <m.div
            layoutId="chat-container"
            className={`fixed z-[70] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden border ${
              isExpanded
                ? 'inset-4 sm:inset-8 md:inset-12 lg:inset-20'
                : ''
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={
              isExpanded
                ? {}
                : {
                    width: `${size.width}px`,
                    height: `${size.height}px`,
                    bottom: '96px',
                    right: '20px',
                  }
            }
          >
            {/* 리사이즈 핸들 (좌상단) */}
            {!isExpanded && (
              <div
                ref={resizeRef}
                onMouseDown={handleResizeStart}
                className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize z-10"
                style={{
                  background: 'linear-gradient(135deg, transparent 50%, hsl(var(--border)) 50%)',
                }}
              />
            )}

            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <MascotAvatar size="sm" reaction={mascotReaction} showBorder={false} />
                <span className="font-semibold">AI 일본어 튜터</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearMessages}
                  disabled={messages.length === 0}
                  title="대화 초기화"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleExpand}
                  title={isExpanded ? '작게 보기' : '크게 보기'}
                >
                  {isExpanded ? (
                    <Shrink className="w-4 h-4" />
                  ) : (
                    <Expand className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMinimize}
                  title="접기"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 메시지 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!isConfigured && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    API 키가 설정되지 않았습니다. .env 파일에 VITE_GEMINI_API_KEY를 추가해주세요.
                  </span>
                </div>
              )}

              {messages.length === 0 && isConfigured && (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  {/* 빈 채팅 = 인사 (wave) — MascotScene + 말풍선 */}
                  <div className="w-[200px] mb-3">
                    <MascotScene
                      reaction="wave"
                      sizeToken="sm"
                      bubble="안녕!"
                    />
                  </div>
                  <h3 className="font-semibold mb-1">무엇이든 물어보세요!</h3>
                  <p className="text-sm text-muted-foreground max-w-[250px]">
                    일본어 번역, 단어 뜻, 문법 설명 등
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {['꽃이 일본어로?', '안녕 번역', '~ます형'].map((example) => (
                      <button
                        key={example}
                        onClick={() => {
                          setInput(example)
                          inputRef.current?.focus()
                        }}
                        className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isStreaming={isLoading && index === messages.length - 1 && message.role === 'assistant'}
                />
              ))}

              {error && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  error.includes('한도')
                    ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 입력 영역 - 음성 모드 or 텍스트 입력 */}
            <AnimatePresence mode="wait">
              {isVoiceMode ? (
                <VoiceInputBar
                  key="voice"
                  status={voiceStatus}
                  selectedLang={selectedLang}
                  transcript={transcript}
                  interimTranscript={interimTranscript}
                  error={voiceError}
                  onClose={handleVoiceClose}
                  onRetry={handleVoiceRetry}
                  onSend={handleVoiceSend}
                />
              ) : (
                <m.form
                  key="text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2 p-3 border-t bg-background"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      !isConfigured
                        ? 'API 키가 필요합니다'
                        : error?.includes('한도')
                          ? '잠시 후 다시 시도해주세요...'
                          : '메시지를 입력하세요...'
                    }
                    disabled={!isConfigured || isLoading}
                    className="flex-1 px-4 py-2 rounded-full bg-muted border-none focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 text-sm"
                  />
                  {isVoiceSupported && (
                    <>
                      {/* 한국어 → 일본어 버튼 */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-9 w-9 text-base"
                        onClick={() => handleVoiceStart('ko-KR')}
                        disabled={!isConfigured || isLoading}
                        title="한국어 → 일본어 음성 번역"
                      >
                        🇰🇷
                      </Button>
                      {/* 일본어 → 한국어 버튼 */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-9 w-9 text-base"
                        onClick={() => handleVoiceStart('ja-JP')}
                        disabled={!isConfigured || isLoading}
                        title="일본어 → 한국어 음성 번역"
                      >
                        🇯🇵
                      </Button>
                    </>
                  )}
                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-full h-9 w-9"
                    disabled={!isConfigured || !input.trim() || isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </m.form>
              )}
            </AnimatePresence>
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
