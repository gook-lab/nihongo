// 회화 표현의 단어 토큰을 사전(Word) 형식으로 자동 추출.
// 사전 검색에서 회화 어휘까지 노출되도록 — words.ts가 머지해서 사용.
//
// 추출 규칙:
//   - isParticle=true → 제외 (조사: を, に, は 등)
//   - meaning 길이 < 2자 또는 '~'로 시작 → 제외 (어미·접미사)
//   - text 길이 < 1 → 제외
//   - 동일 (kanji, hiragana) 조합은 한 번만
//   - level은 그 단어가 처음 등장한 표현의 level (N5 우선 — 가장 기초 학습자 시점)
import type { Word } from '@/types'
import { CONVERSATION_CATEGORIES } from './conversations'

function levelLabelToNumber(label: 'N5' | 'N4' | 'N3' | 'N2' | undefined): number {
  switch (label) {
    case 'N5':
      return 5
    case 'N4':
      return 4
    case 'N3':
      return 3
    case 'N2':
      return 2
    default:
      return 5
  }
}

function isMeaningful(meaning: string): boolean {
  const trimmed = meaning.trim()
  if (trimmed.length < 2) return false
  // 한국어 어미·조사 패턴 (~합니다, ~을, ~의 등)
  if (trimmed.startsWith('~')) return false
  return true
}

export function extractWordsFromConversations(): Word[] {
  // (kanji + hiragana) 키로 dedup. 가장 낮은 level(가장 큰 숫자)을 우선해 기초 학습자 시점 유지.
  const map = new Map<string, Word>()

  for (const cat of CONVERSATION_CATEGORIES) {
    for (const phrase of cat.phrases) {
      const phraseLevel = levelLabelToNumber(phrase.level)
      for (const token of phrase.words) {
        if (token.isParticle) continue
        if (!isMeaningful(token.meaning)) continue

        const text = token.text.trim()
        const reading = token.reading.trim()
        if (!text) continue

        const key = `${text}|${reading}`
        const existing = map.get(key)
        if (existing) {
          // 같은 단어가 더 낮은 레벨(큰 숫자) 표현에서도 등장 → level 갱신
          if (phraseLevel > existing.level) {
            existing.level = phraseLevel
          }
          continue
        }

        map.set(key, {
          id: `conv-${cat.id}-${phrase.id}-${text}`,
          kanji: text,
          hiragana: reading || text,
          meaning: token.meaning,
          level: phraseLevel,
        })
      }
    }
  }

  return Array.from(map.values())
}
