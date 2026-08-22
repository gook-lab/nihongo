// 빠른 검색 순수 로직 — QuickDictSearch에서 분리 (테스트 가능하게)
// 매칭 규칙: 부분 문자열(substring) 일치, 대소문자 무시(한국어/로마자), 퍼지 매칭 없음.
// 데이터는 호출자가 dynamic import로 넘긴다 (WORDS lazy 로드 유지).
import type { Word, ConversationCategory } from '@/types'

// [회귀 주의] 단어 검색은 QuickDictSearch의 기존 인라인 필터와 동일해야 한다:
// kanji/hiragana는 원문 그대로, meaning만 lowercase 비교. 결과 8개 제한.
export function searchWords(words: Word[], query: string, limit = 8): Word[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return words
    .filter(
      (w) =>
        w.kanji.includes(q) ||
        w.hiragana.includes(q) ||
        w.meaning.toLowerCase().includes(q),
    )
    .slice(0, limit)
}

export interface PhraseSearchHit {
  phraseId: string
  categoryId: string
  categoryName: string // nameKo
  japanese: string
  korean: string
  level: string
}

// 회화 표현 검색 — 일본어 원문 / 단어 후리가나 / 한국어 뜻 중 하나라도 부분 일치
export function searchPhrases(
  categories: ConversationCategory[],
  query: string,
  limit = 6,
): PhraseSearchHit[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  const hits: PhraseSearchHit[] = []
  for (const category of categories) {
    for (const phrase of category.phrases) {
      const matched =
        phrase.japanese.includes(q) ||
        phrase.korean.toLowerCase().includes(q) ||
        phrase.words.some(
          (w) => w.reading.includes(q) || w.text.includes(q),
        )
      if (matched) {
        hits.push({
          phraseId: phrase.id,
          categoryId: category.id,
          categoryName: category.nameKo,
          japanese: phrase.japanese,
          korean: phrase.korean,
          level: phrase.level,
        })
        if (hits.length >= limit) return hits
      }
    }
  }
  return hits
}
