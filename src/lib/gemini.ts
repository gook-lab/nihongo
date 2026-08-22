import type { GoogleGenAI } from '@google/genai'
import { reportAIError } from './sentry'

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

let aiClient: GoogleGenAI | null = null

// @google/genai를 dynamic import로 — 첫 진입 번들에서 253KB 제거,
// AI 기능 사용 시점(채팅/작문/이야기/회화)에만 로드.
async function getClient(): Promise<GoogleGenAI> {
  if (!aiClient) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY가 설정되지 않았습니다.')
    }
    const { GoogleGenAI } = await import('@google/genai')
    aiClient = new GoogleGenAI({ apiKey })
  }
  return aiClient
}

export async function streamChat(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const ai = await getClient()

  // 시스템 프롬프트 + 대화 기록 구성
  const contents = [
    {
      role: 'user' as const,
      parts: [{ text: SYSTEM_PROMPT }],
    },
    {
      role: 'model' as const,
      parts: [{ text: '네, 알겠습니다! 일본어 학습을 도와드릴게요.' }],
    },
    ...messages.map((m) => ({
      role: (m.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
      parts: [{ text: m.content }],
    })),
  ]

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        
        maxOutputTokens: 1024,
      },
    })

    for await (const chunk of response) {
      if (signal?.aborted) {
        throw new Error('AbortError')
      }
      const text = chunk.text
      if (text) {
        onChunk(text)
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'AbortError') {
        throw error
      }

      // 429 에러 (할당량 초과) 처리
      if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')) {
        // retry 시간 추출 시도
        const retryMatch = error.message.match(/retry in (\d+(?:\.\d+)?)/i)
        const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 30

        reportAIError(error, {
          feature: 'chat',
          extra: { reason: 'rate_limit', retrySeconds },
        })
        throw new Error(`RATE_LIMIT:${retrySeconds}`)
      }
    }
    reportAIError(error, { feature: 'chat' })
    throw error
  }
}

export function isGeminiConfigured(): boolean {
  return !!import.meta.env.VITE_GEMINI_API_KEY
}

// ─── AI 회화 롤플레이 ───────────────────────────────────
// 시나리오별 NPC 페르소나 + 대화 기록 → 일본어 응답 스트리밍
export async function streamRoleplay(
  systemPrompt: string,
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const ai = await getClient()

  const contents = [
    { role: 'user' as const, parts: [{ text: systemPrompt }] },
    { role: 'model' as const, parts: [{ text: 'はい、わかりました。' }] },
    ...messages.map((m) => ({
      role: (m.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
      parts: [{ text: m.content }],
    })),
  ]

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents,
      config: { maxOutputTokens: 256 }, // 짧은 응답 강제
    })

    for await (const chunk of response) {
      if (signal?.aborted) throw new Error('AbortError')
      const text = chunk.text
      if (text) onChunk(text)
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'AbortError') throw error
      if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')) {
        const retryMatch = error.message.match(/retry in (\d+(?:\.\d+)?)/i)
        const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 30
        reportAIError(error, {
          feature: 'roleplay',
          extra: { reason: 'rate_limit', retrySeconds },
        })
        throw new Error(`RATE_LIMIT:${retrySeconds}`)
      }
    }
    reportAIError(error, { feature: 'roleplay' })
    throw error
  }
}

// 한국어 번역 — NPC 한 줄 메시지를 한국어로
export async function translateJaToKo(japaneseText: string): Promise<string> {
  const ai = await getClient()
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `다음 일본어 문장을 자연스러운 한국어로 번역해 주세요. 번역문만 출력하세요 (설명 없이).\n\n${japaneseText}`,
            },
          ],
        },
      ],
      config: { maxOutputTokens: 128 },
    })
    return (response.text ?? '').trim()
  } catch (error) {
    reportAIError(error, { feature: 'roleplay', extra: { reason: 'translate' } })
    throw error
  }
}

// ─── AI 작문 첨삭 ─────────────────────────────────────

export interface WritingCorrection {
  userAnswer: string         // 사용자 입력 일본어
  modelAnswer: string        // 모범 답안 일본어
  modelAnswerReading: string // 모범 답안 후리가나
  score: number              // 0~100
  feedback: string           // 한국어 피드백 (자연스러움, 문법 등)
  improvements: string[]     // 개선 제안 (한국어, 2~4개)
}

export async function correctWriting(
  koreanPrompt: string,
  userJapanese: string,
  level: 'N5' | 'N4' | 'N3',
  signal?: AbortSignal,
): Promise<WritingCorrection> {
  const ai = await getClient()

  const prompt = `당신은 일본어 학습자의 작문을 채점하고 첨삭하는 전문가입니다.

[과제]
한국어: ${koreanPrompt}
사용자 일본어 답안: ${userJapanese}
학습자 레벨: JLPT ${level}

[규칙]
1. 사용자의 답안이 문법적으로 맞고 자연스러운지 평가하고 점수(0~100)를 매깁니다.
2. 모범 답안 1개를 ${level} 수준으로 작성합니다.
3. 사용자가 개선할 점 2~4개를 한국어로 명료하게 제시합니다.
4. JSON 형식으로만 응답합니다. 코드 펜스(\`\`\`) 없이 JSON 객체만 출력하세요.

[JSON 스키마]
{
  "userAnswer": "string (사용자 답안 그대로)",
  "modelAnswer": "string (자연스러운 일본어 모범 답안)",
  "modelAnswerReading": "string (모범 답안 전체 후리가나, 띄어쓰기)",
  "score": number (0~100),
  "feedback": "string (한국어, 답안에 대한 종합 평가 1~2문장)",
  "improvements": ["string (한국어 개선 제안 1)", "..."]
}`

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        maxOutputTokens: 1024,
        temperature: 0.4,
      },
    })

    if (signal?.aborted) throw new Error('AbortError')

    const text = response.text ?? ''
    if (!text) throw new Error('Gemini가 빈 응답을 반환했습니다.')

    const cleaned = text
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```\s*$/, '')
      .trim()
    const parsed = JSON.parse(cleaned) as WritingCorrection

    if (
      typeof parsed.score !== 'number' ||
      !parsed.modelAnswer ||
      !Array.isArray(parsed.improvements)
    ) {
      throw new Error('첨삭 응답 형식이 올바르지 않습니다.')
    }
    parsed.userAnswer = parsed.userAnswer || userJapanese
    return parsed
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'AbortError') throw error
      if (
        error.message.includes('429') ||
        error.message.includes('RESOURCE_EXHAUSTED')
      ) {
        const retryMatch = error.message.match(/retry in (\d+(?:\.\d+)?)/i)
        const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 30
        reportAIError(error, {
          feature: 'writing',
          extra: { reason: 'rate_limit', retrySeconds },
        })
        throw new Error(`RATE_LIMIT:${retrySeconds}`)
      }
    }
    reportAIError(error, { feature: 'writing' })
    throw error
  }
}

// 한국어 작문 프롬프트 풀 (랜덤 선택)
export const WRITING_PROMPTS = {
  N5: [
    '오늘 날씨가 좋아요.',
    '나는 학생입니다.',
    '커피를 마십니다.',
    '내일 친구를 만납니다.',
    '주말에 영화를 봤어요.',
    '이 책은 재미있어요.',
  ],
  N4: [
    '오늘 아침에 늦잠을 잤기 때문에 회사에 늦었어요.',
    '한국 음식 중에서 김치찌개를 가장 좋아합니다.',
    '비가 와서 우산을 가지고 갈 거예요.',
    '일본어를 공부한 지 1년이 됐어요.',
    '친구가 결혼한다는 이야기를 들었어요.',
  ],
  N3: [
    '환경 문제를 해결하기 위해서는 개인의 작은 노력부터 시작해야 합니다.',
    '경험이 부족하더라도 의지가 있다면 누구든 도전할 수 있어요.',
    '바쁘다는 이유로 가족과 보내는 시간을 줄이는 것은 후회할 수 있어요.',
    '인공지능이 발전함에 따라 새로운 직업이 생기기도 합니다.',
  ],
} as const

// ─── AI 읽기 콘텐츠 생성 ─────────────────────────────────────

export interface GenerateStoryParams {
  level: 'N5' | 'N4' | 'N3'
  topic: string          // 자유 입력 또는 추천 키워드 (예: "여행", "회사 첫날")
  length: 'short' | 'medium'  // short=3-4단락, medium=5-7단락
}

export interface AIGeneratedStory {
  title: string          // 일본어 제목
  titleKo: string        // 한국어 제목
  description: string    // 한 줄 미리보기 (한국어)
  paragraphs: Array<{
    ja: string           // 일본어 문장 1-2개
    reading: string      // 후리가나 (단어별 띄어쓰기)
    ko: string           // 한국어 번역
  }>
  vocabulary: Array<{
    kanji: string
    reading: string
    meaning: string
  }>
}

const LEVEL_GUIDE: Record<GenerateStoryParams['level'], string> = {
  N5: '기초 (인사, 가족, 숫자, 시간, 음식, 날씨 등 일상 단어 중심. 매우 짧은 문장, 기본 동사 ます형/です체)',
  N4: '초중급 (회사, 학교, 친구, 여행 등 일상 상황. て형, た형, ない형 가능, 접속사 사용)',
  N3: '중급 (감정, 의견, 사회적 상황. 수동/사역, 조건형, 추측 표현, 복문 가능)',
}

const LENGTH_GUIDE: Record<GenerateStoryParams['length'], string> = {
  short: '단락 3~4개, 각 단락 1~2문장',
  medium: '단락 5~7개, 각 단락 1~3문장',
}

export async function generateReadingStory(
  params: GenerateStoryParams,
  signal?: AbortSignal,
): Promise<AIGeneratedStory> {
  const ai = await getClient()

  const prompt = `당신은 일본어 학습자를 위한 짧은 글을 작성하는 전문가입니다.
다음 조건에 맞는 짧은 이야기를 만들어 주세요.

JLPT 레벨: ${params.level}
레벨 설명: ${LEVEL_GUIDE[params.level]}
주제: ${params.topic || '일상의 한 장면'}
길이: ${LENGTH_GUIDE[params.length]}

규칙:
1. 자연스럽고 학습자가 흥미를 느낄 만한 짧은 이야기여야 합니다.
2. JLPT ${params.level} 수준의 단어와 문법만 사용합니다.
3. 각 단락의 "reading"은 일본어 본문 전체의 후리가나를, 띄어쓰기로 단어를 구분해 작성합니다.
   예: "私は学校に行きます。" → "わたしは がっこうに いきます。"
4. "vocabulary"에는 학습자가 알면 좋을 핵심 단어 4~6개를 선정합니다.
5. JSON 형식으로만 응답합니다. 코드 펜스(\`\`\`) 없이 JSON 객체만 출력하세요.

JSON 스키마:
{
  "title": "string (일본어 제목, 짧고 매력적으로)",
  "titleKo": "string (한국어 제목)",
  "description": "string (한 줄 한국어 미리보기, 30자 이내)",
  "paragraphs": [
    {
      "ja": "string (일본어 본문)",
      "reading": "string (전체 후리가나, 띄어쓰기로 단어 구분)",
      "ko": "string (한국어 번역)"
    }
  ],
  "vocabulary": [
    {
      "kanji": "string (한자 또는 가타카나 단어)",
      "reading": "string (히라가나 읽기)",
      "meaning": "string (한국어 뜻)"
    }
  ]
}`

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        maxOutputTokens: 2048,
        temperature: 0.85,
      },
    })

    if (signal?.aborted) throw new Error('AbortError')

    const text = response.text ?? ''
    if (!text) {
      throw new Error('Gemini가 빈 응답을 반환했습니다.')
    }

    // JSON parse — 가끔 응답에 ```json 펜스가 섞이는 경우 정리
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim()
    const parsed = JSON.parse(cleaned) as AIGeneratedStory

    // 필수 필드 검증
    if (
      !parsed.title ||
      !parsed.titleKo ||
      !Array.isArray(parsed.paragraphs) ||
      parsed.paragraphs.length === 0 ||
      !Array.isArray(parsed.vocabulary)
    ) {
      throw new Error('생성된 이야기 형식이 올바르지 않습니다.')
    }
    return parsed
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'AbortError') throw error
      if (
        error.message.includes('429') ||
        error.message.includes('RESOURCE_EXHAUSTED')
      ) {
        const retryMatch = error.message.match(/retry in (\d+(?:\.\d+)?)/i)
        const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 30
        reportAIError(error, {
          feature: 'reading-story',
          extra: { reason: 'rate_limit', retrySeconds },
        })
        throw new Error(`RATE_LIMIT:${retrySeconds}`)
      }
    }
    reportAIError(error, { feature: 'reading-story' })
    throw error
  }
}
