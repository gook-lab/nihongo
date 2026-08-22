// AI 회화 롤플레이 — 시나리오 선택 + Gemini NPC와 일본어 채팅
// 시나리오 선택 → 채팅 화면 (NPC starter 메시지 자동 송신) → 한국어 번역 토글
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Send, RotateCcw, MessagesSquare, Languages, Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BottomNav } from '@/components/BottomNav'
import { MascotScene } from '@/components/MascotScene'
import { Spinner } from '@/components/Spinner'
import { TTSButton } from '@/components/TTSButton'
import { ROLEPLAY_SCENARIOS, type RoleplayScenario } from '@/data/roleplay-scenarios'
import {
  streamRoleplay,
  translateJaToKo,
  isGeminiConfigured,
  type ChatMessage,
} from '@/lib/gemini'
import { toast } from '@/lib/toast'
import { trackEvent } from '@/lib/analytics'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'

interface RoleplayMessage extends ChatMessage {
  id: string
  /** 한국어 번역 캐시 — 사용자가 토글하면 가져옴 */
  translation?: string
  /** 번역 로딩 중 */
  translating?: boolean
}

export function AIConversationPage() {
  const navigate = useNavigate()
  const configured = isGeminiConfigured()

  const [scenario, setScenario] = useState<RoleplayScenario | null>(null)
  const [messages, setMessages] = useState<RoleplayMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // 음성 입력 — ja-JP. 인식된 텍스트는 input에 누적.
  const speech = useSpeechRecognition({
    lang: 'ja-JP',
    onResult: (text) => {
      if (text) setInput((prev) => (prev ? `${prev} ${text}` : text))
    },
    onError: (err) => {
      if (err === 'permission-denied') {
        toast.error({ message: '마이크 권한이 필요해요. 브라우저 설정에서 허용해 주세요.' })
      } else if (err === 'not-supported') {
        toast.info({ message: '이 브라우저는 음성 인식을 지원하지 않아요.' })
      } else if (err === 'no-speech') {
        toast.info({ message: '소리가 잘 들리지 않았어요. 다시 시도해 주세요.' })
      }
    },
  })
  const isListening = speech.status === 'listening' || speech.status === 'recording'

  // 새 메시지 시 자동 스크롤
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  function startScenario(s: RoleplayScenario) {
    trackEvent('ai-roleplay-started', { scenario: s.id, level: s.difficulty })
    setScenario(s)
    setMessages([
      {
        id: 'starter',
        role: 'assistant',
        content: s.starterJa,
        translation: s.starterKo,
      },
    ])
    setError(null)
  }

  function exitScenario() {
    abortRef.current?.abort()
    setScenario(null)
    setMessages([])
    setInput('')
    setError(null)
    setIsLoading(false)
  }

  function resetConversation() {
    if (!scenario) return
    abortRef.current?.abort()
    setMessages([
      {
        id: 'starter',
        role: 'assistant',
        content: scenario.starterJa,
        translation: scenario.starterKo,
      },
    ])
    setInput('')
    setError(null)
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || !scenario || isLoading) return

    setInput('')
    setError(null)
    const userMsg: RoleplayMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)

    // assistant 빈 메시지 추가 후 스트리밍 chunk 누적
    const aId = `a-${Date.now()}`
    setMessages((prev) => [...prev, { id: aId, role: 'assistant', content: '' }])

    setIsLoading(true)
    abortRef.current = new AbortController()

    try {
      let acc = ''
      await streamRoleplay(
        scenario.systemPrompt,
        // streamRoleplay에는 starter 포함된 전체 기록 (assistant placeholder 제외)
        newMessages.map(({ role, content }) => ({ role, content })),
        (chunk) => {
          acc += chunk
          setMessages((prev) =>
            prev.map((m) => (m.id === aId ? { ...m, content: acc } : m)),
          )
        },
        abortRef.current.signal,
      )
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === 'AbortError') return
        if (e.message.startsWith('RATE_LIMIT:')) {
          const sec = e.message.split(':')[1]
          setError(`요청이 너무 많아요. ${sec}초 후 다시 시도해 주세요.`)
        } else {
          setError('응답 중 오류가 났어요. 다시 시도해 주세요.')
        }
      }
      // 실패한 assistant placeholder 제거
      setMessages((prev) => prev.filter((m) => m.id !== aId))
    } finally {
      setIsLoading(false)
    }
  }

  async function toggleTranslation(id: string) {
    const msg = messages.find((m) => m.id === id)
    if (!msg || msg.role !== 'assistant') return
    // 이미 번역 있으면 토글 (숨김 → 보임 / 보임 → 숨김)
    if (msg.translation) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, translation: undefined } : m)),
      )
      return
    }
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, translating: true } : m)),
    )
    try {
      const ko = await translateJaToKo(msg.content)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, translation: ko, translating: false } : m,
        ),
      )
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, translating: false } : m)),
      )
      toast.error({ message: '번역에 실패했어요.' })
    }
  }

  // ─── 시나리오 선택 화면 ─────────────────────────────────
  if (!scenario) {
    return (
      <div className="min-h-screen bg-background pb-nav">
        <div className="pt-6 pb-4 px-5 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border-light">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/conversation')}
              aria-label="뒤로가기"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-sakura-100)' }}
              >
                <MessagesSquare
                  className="w-4 h-4"
                  style={{ color: 'var(--color-primary)' }}
                />
              </div>
              <span className="type-h3">AI 회화</span>
            </div>
            <div className="w-10" />
          </div>
        </div>

        <div className="px-5 pt-4 space-y-5">
          <MascotScene
            reaction="wave"
            sizeToken="sm"
            bubble="상황을 골라봐!"
          />
          <Card>
            <CardContent className="p-4">
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                상황을 고르면 AI가 그 역할을 맡아 일본어로 대화해요.
                자연스러운 회화 연습을 해 보세요.
              </p>
            </CardContent>
          </Card>

          {!configured && (
            <div
              className="rounded-xl p-3 text-sm"
              style={{
                background: 'var(--color-error-light)',
                color: 'var(--color-error-dark)',
              }}
            >
              Gemini API 키가 설정되지 않았어요. .env에 VITE_GEMINI_API_KEY를
              추가하세요.
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {ROLEPLAY_SCENARIOS.map((s) => (
              <m.button
                key={s.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => startScenario(s)}
                disabled={!configured}
                className="text-left rounded-2xl p-4 border-[1.5px] transition-colors disabled:opacity-50"
                style={{
                  background: 'var(--color-card)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="text-3xl mb-2">{s.emoji}</div>
                <p className="text-sm font-bold leading-tight">{s.titleKo}</p>
                <p
                  className="text-[11px] mt-0.5"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {s.titleJa}
                </p>
                <span
                  className="inline-block mt-2 text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    background: 'var(--color-sakura-100)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {s.difficulty}
                </span>
              </m.button>
            ))}
          </div>
        </div>

        <BottomNav />
      </div>
    )
  }

  // ─── 채팅 화면 ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 — 시나리오 정보 + 나가기 */}
      <div className="pt-6 pb-3 px-5 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border-light">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={exitScenario} aria-label="뒤로가기">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{scenario.emoji}</span>
            <div>
              <p className="text-sm font-bold leading-tight">{scenario.titleKo}</p>
              <p
                className="text-[10px] leading-tight"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {scenario.titleJa}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetConversation}
            aria-label="대화 초기화"
            title="대화 초기화"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        style={{ paddingBottom: 16 }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <m.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[80%] rounded-2xl px-3 py-2"
                style={{
                  background:
                    msg.role === 'user'
                      ? 'var(--color-primary)'
                      : 'var(--color-muted)',
                  color:
                    msg.role === 'user'
                      ? 'var(--color-primary-foreground)'
                      : 'var(--color-text-primary)',
                }}
              >
                {/* 메시지 본문 — 비어 있고 스트리밍 중이면 typing 점 */}
                {msg.content ? (
                  <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    {[0, 0.15, 0.3].map((d, i) => (
                      <span
                        key={i}
                        className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-40"
                        style={{
                          animation: `spinner-typing-dot 1.2s ease-in-out ${d}s infinite`,
                        }}
                      />
                    ))}
                  </span>
                )}

                {/* assistant 메시지에만 — TTS + 번역 토글 */}
                {msg.role === 'assistant' && msg.content && (
                  <div className="flex items-center gap-1 mt-1.5 -ml-1">
                    <TTSButton
                      text={msg.content}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                    />
                    <button
                      onClick={() => toggleTranslation(msg.id)}
                      disabled={msg.translating}
                      className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md disabled:opacity-50"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      <Languages className="w-3 h-3" />
                      {msg.translating ? '번역 중…' : msg.translation ? '숨기기' : '한국어'}
                    </button>
                  </div>
                )}

                {/* 한국어 번역 — 보임 상태 */}
                {msg.translation && (
                  <m.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-[12px] mt-1.5 pt-1.5 border-t border-current/10 leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {msg.translation}
                  </m.p>
                )}
              </div>
            </m.div>
          ))}
        </AnimatePresence>

        {error && (
          <div
            className="rounded-xl p-3 text-sm text-center flex flex-col items-center gap-2"
            style={{
              background: 'var(--color-error-light)',
              color: 'var(--color-error-dark)',
            }}
          >
            <span>{error}</span>
            {/* 마지막 사용자 메시지 재전송 — input이 비어 있어도 작동 */}
            {messages.some((m) => m.role === 'user') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
                  if (!lastUser) return
                  // 마지막 user 메시지부터 다시 전송 (이후 메시지는 제거)
                  const lastUserIdx = messages.findIndex((m) => m.id === lastUser.id)
                  setMessages(messages.slice(0, lastUserIdx))
                  setInput(lastUser.content)
                  setTimeout(() => sendMessage(), 50)
                }}
              >
                다시 시도
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 입력 영역 — fixed bottom, safe-area */}
      <div
        className="border-t border-border-light px-3 py-3 sticky bottom-0 bg-background"
        style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={
              isListening && speech.interimTranscript
                ? `${input}${input ? ' ' : ''}${speech.interimTranscript}`
                : input
            }
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder={isListening ? '듣고 있어요…' : '日本語で入力…'}
            disabled={isLoading || !configured}
            className="flex-1 h-11 rounded-full px-4 text-[15px] border-[1.5px] focus:outline-none focus:border-primary"
            style={{
              background: 'var(--color-card)',
              borderColor: isListening ? 'var(--color-primary)' : 'var(--color-border)',
            }}
          />
          {/* 음성 입력 마이크 — 브라우저 지원 시에만 노출 */}
          {speech.isSupported && (
            <Button
              onClick={() => {
                if (isListening) {
                  speech.stopListening()
                } else {
                  speech.startListening('ja-JP')
                }
              }}
              disabled={isLoading || !configured}
              size="icon"
              variant={isListening ? 'default' : 'outline'}
              className="h-11 w-11 rounded-full shrink-0"
              aria-label={isListening ? '음성 입력 멈춤' : '음성 입력 시작'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          )}
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-11 w-11 rounded-full shrink-0"
          >
            {isLoading ? (
              <Spinner variant="ring" size={16} color="currentColor" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
