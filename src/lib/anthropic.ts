const SYSTEM_PROMPT = `당신은 일본어 학습을 돕는 친절한 AI 튜터입니다.

응답 규칙:
1. 일본어 단어/문장을 포함할 때는 반드시 다음 형식을 사용하세요:
   [日:일본어텍스트:よみがな:한국어뜻]
   예: [日:花:はな:꽃], [日:食べる:たべる:먹다]

2. 번역 요청 시:
   - 원문의 자연스러운 일본어 번역 제공
   - 각 단어에 읽기와 뜻 표시
   - 전체 문장의 한국어 해석 포함

3. 간단하고 친근하게 답변하세요.
4. 한국어로 설명하세요.`

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function streamChat(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY가 설정되지 않았습니다.')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      stream: true,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
    signal,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API 오류: ${response.status} - ${errorText}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('스트림을 읽을 수 없습니다.')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') continue

        try {
          const parsed = JSON.parse(data)
          if (
            parsed.type === 'content_block_delta' &&
            parsed.delta?.type === 'text_delta'
          ) {
            onChunk(parsed.delta.text)
          }
        } catch {
          // JSON 파싱 실패 시 무시
        }
      }
    }
  }
}

export function isAnthropicConfigured(): boolean {
  return !!import.meta.env.VITE_ANTHROPIC_API_KEY
}
