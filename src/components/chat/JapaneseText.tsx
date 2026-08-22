import { TTSButton } from '@/components/TTSButton'

interface JapaneseBlock {
  text: string
  reading: string
  meaning: string
}

type ParsedContent = string | JapaneseBlock

function parseJapaneseBlocks(text: string): ParsedContent[] {
  const regex = /\[日:([^:]+):([^:]+):([^\]]+)\]/g
  const result: ParsedContent[] = []
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    // 매치 이전의 일반 텍스트 추가
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index))
    }

    // 일본어 블록 추가
    result.push({
      text: match[1],
      reading: match[2],
      meaning: match[3],
    })

    lastIndex = regex.lastIndex
  }

  // 마지막 일반 텍스트 추가
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex))
  }

  return result
}

function JapaneseBlockRenderer({ block }: { block: JapaneseBlock }) {
  return (
    <span className="inline-flex items-center gap-1 mx-0.5">
      <ruby className="text-lg font-medium">
        {block.text}
        <rp>(</rp>
        <rt className="text-[10px] text-muted-foreground font-normal">
          {block.reading}
        </rt>
        <rp>)</rp>
      </ruby>
      <span className="text-sm text-primary">({block.meaning})</span>
      <TTSButton
        text={block.text}
        variant="ghost"
        size="icon"
        className="w-6 h-6 p-0"
      />
    </span>
  )
}

interface JapaneseTextProps {
  content: string
}

export function JapaneseText({ content }: JapaneseTextProps) {
  const parsed = parseJapaneseBlocks(content)

  return (
    <span className="leading-relaxed">
      {parsed.map((item, index) => {
        if (typeof item === 'string') {
          // 줄바꿈 처리
          return item.split('\n').map((line, lineIndex, arr) => (
            <span key={`${index}-${lineIndex}`}>
              {line}
              {lineIndex < arr.length - 1 && <br />}
            </span>
          ))
        }
        return <JapaneseBlockRenderer key={index} block={item} />
      })}
    </span>
  )
}

// 텍스트에서 모든 일본어 블록의 텍스트만 추출 (전체 TTS용)
export function extractJapaneseTexts(content: string): string[] {
  const regex = /\[日:([^:]+):([^:]+):([^\]]+)\]/g
  const texts: string[] = []
  let match

  while ((match = regex.exec(content)) !== null) {
    texts.push(match[1])
  }

  return texts
}
