import type { Word } from '@/types'

/**
 * 회화 표현 일본어 문장에서 사전 단어를 매칭하는 로직.
 * 일본어는 띄어쓰기가 없으므로 최장일치 매칭을 사용.
 *
 * @param text 일본어 문장 (예: "レストランを探しています")
 * @param words 사전 단어 배열
 * @returns 매칭된 단어들의 정보 + 위치
 */

export interface MatchedWord {
  word: Word
  startIndex: number
  endIndex: number
  matchedText: string // 일본어 텍스트에서 실제 매칭된 부분
}

/**
 * 단어 사전으로부터 매칭용 인덱스 생성 (Map)
 * 표기(kanji) 우선, 없으면 히라가나로 매칭
 *
 * @param words 사전 단어 배열
 * @returns Map<표기, Word[]> — 한 글자열이 여러 단어를 가질 수 있음
 */
export function buildWordIndex(words: Word[]): Map<string, Word[]> {
  const index = new Map<string, Word[]>()

  for (const word of words) {
    // kanji가 있으면 우선 인덱싱
    if (word.kanji) {
      const key = word.kanji
      if (!index.has(key)) {
        index.set(key, [])
      }
      index.get(key)!.push(word)
    }
    // 히라가나도 인덱싱 (kanji 매칭 실패 시 대안용)
    const hiraganaKey = word.hiragana
    if (hiraganaKey !== word.kanji) {
      if (!index.has(hiraganaKey)) {
        index.set(hiraganaKey, [])
      }
      index.get(hiraganaKey)!.push(word)
    }
  }

  return index
}

/**
 * 최장일치 매칭으로 일본어 문장에서 단어 추출
 *
 * 알고리즘:
 * 1. 현재 위치에서 가능한 가장 긴 부분문자열 찾기
 * 2. 없으면 다음 글자로 진행
 * 3. 매칭된 단어는 위치 기록 후 건너뜀
 *
 * @param text 일본어 문장
 * @param wordIndex 단어 매칭용 인덱스 (buildWordIndex로 생성)
 * @returns 매칭된 단어들 (위치순)
 */
export function matchPhraseWords(text: string, wordIndex: Map<string, Word[]>): MatchedWord[] {
  const matches: MatchedWord[] = []
  let i = 0

  while (i < text.length) {
    // 현재 위치에서 가능한 가장 긴 단어 찾기
    let bestMatch: MatchedWord | null = null
    let maxLen = 0

    // 최대 5글자까지 시도 (일본어 단어 길이 제한)
    for (let len = Math.min(5, text.length - i); len > 0; len--) {
      const substring = text.substring(i, i + len)
      const wordsForSubstring = wordIndex.get(substring)

      if (wordsForSubstring && wordsForSubstring.length > 0) {
        // 첫 번째 매칭 사용 (중복 처리)
        const word = wordsForSubstring[0]
        if (len > maxLen) {
          bestMatch = {
            word,
            startIndex: i,
            endIndex: i + len,
            matchedText: substring,
          }
          maxLen = len
        }
        break // 최장일치 찾음
      }
    }

    if (bestMatch) {
      matches.push(bestMatch)
      i = bestMatch.endIndex
    } else {
      // 매칭 실패 시 다음 글자로 진행
      i++
    }
  }

  return matches
}

export type Segment = { type: 'link'; content: MatchedWord } | { type: 'text'; content: string }

/**
 * 매칭 결과에 따라 회화 표현을 분절 배열로 변환
 * UI 렌더링용으로 링크된 단어와 일반 텍스트를 구분하기 위함
 *
 * @param text 일본어 문장
 * @param matches 매칭 결과
 * @returns Segment[]
 */
export function segmentPhrasedText(text: string, matches: MatchedWord[]): Segment[] {
  const segments: Segment[] = []
  let lastIndex = 0

  for (const match of matches) {
    // 매칭 전 일반 텍스트 추가
    if (lastIndex < match.startIndex) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex, match.startIndex),
      })
    }
    // 매칭된 단어 추가
    segments.push({
      type: 'link',
      content: match,
    })
    lastIndex = match.endIndex
  }

  // 남은 텍스트 추가
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(lastIndex),
    })
  }

  return segments
}

/**
 * 간편한 매칭 함수 (인덱스 자동 생성)
 * 작은 규모나 테스트용. 대규모는 인덱스를 재사용하는 게 더 효율적.
 *
 * @param phraseJapanese 회화 표현 일본어
 * @param words 사전 단어 배열
 * @returns 매칭 결과
 */
export function matchPhraseWithWords(phraseJapanese: string, words: Word[]) {
  const index = buildWordIndex(words)
  return matchPhraseWords(phraseJapanese, index)
}
