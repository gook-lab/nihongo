import { describe, it, expect } from 'vitest'
import { searchWords, searchPhrases } from './quickSearch'
import type { Word, ConversationCategory } from '@/types'

const WORDS: Word[] = [
  { id: 'w1', kanji: '食べる', hiragana: 'たべる', meaning: '먹다', level: 5 },
  { id: 'w2', kanji: '飲む', hiragana: 'のむ', meaning: '마시다', level: 5 },
  { id: 'w3', kanji: 'トイレ', hiragana: 'といれ', meaning: '화장실', level: 5 },
]

// QuickDictSearch에 원래 있던 인라인 필터 (회귀 기준선)
function legacyInlineFilter(words: Word[], query: string): Word[] {
  const q = query.toLowerCase().trim()
  return words
    .filter(
      (w) =>
        w.kanji.includes(q) ||
        w.hiragana.includes(q) ||
        w.meaning.toLowerCase().includes(q),
    )
    .slice(0, 8)
}

describe('searchWords', () => {
  it('[회귀·CRITICAL] 기존 인라인 필터와 결과가 동일하다', () => {
    for (const q of ['食', 'たべ', '마시', '화장실', 'トイレ', 'x없음', '  먹다  ']) {
      expect(searchWords(WORDS, q)).toEqual(legacyInlineFilter(WORDS, q))
    }
  })

  it('빈 검색어/공백은 빈 배열', () => {
    expect(searchWords(WORDS, '')).toEqual([])
    expect(searchWords(WORDS, '   ')).toEqual([])
  })

  it('limit을 초과하지 않는다', () => {
    const many: Word[] = Array.from({ length: 20 }, (_, i) => ({
      id: `m${i}`,
      kanji: '水',
      hiragana: 'みず',
      meaning: '물',
      level: 5,
    }))
    expect(searchWords(many, '水')).toHaveLength(8)
  })
})

const CATEGORIES: ConversationCategory[] = [
  {
    id: 'restaurant',
    nameKo: '식당',
    nameJa: 'レストラン',
    icon: 'Utensils',
    phrases: [
      {
        id: 'r1',
        japanese: 'トイレはどこですか',
        korean: '화장실은 어디예요?',
        level: 'N5',
        words: [
          { text: 'トイレ', reading: 'といれ', meaning: '화장실' },
          { text: 'は', reading: 'は', meaning: '은/는', isParticle: true },
          { text: 'どこ', reading: 'どこ', meaning: '어디' },
        ],
      },
      {
        id: 'r2',
        japanese: 'お会計お願いします',
        korean: '계산해 주세요',
        level: 'N5',
        words: [
          { text: 'お会計', reading: 'おかいけい', meaning: '계산' },
          { text: 'お願いします', reading: 'おねがいします', meaning: '부탁합니다' },
        ],
      },
    ],
  },
  {
    id: 'transport',
    nameKo: '대중교통',
    nameJa: '交通',
    icon: 'Train',
    phrases: [
      {
        id: 't1',
        japanese: '駅はどこですか',
        korean: '역은 어디예요?',
        level: 'N5',
        words: [{ text: '駅', reading: 'えき', meaning: '역' }],
      },
    ],
  },
]

describe('searchPhrases', () => {
  it('일본어 원문 부분 일치', () => {
    const hits = searchPhrases(CATEGORIES, 'トイレ')
    expect(hits).toHaveLength(1)
    expect(hits[0]).toMatchObject({
      phraseId: 'r1',
      categoryId: 'restaurant',
      categoryName: '식당',
    })
  })

  it('한국어 뜻 부분 일치 — 여러 카테고리에 걸쳐 찾는다', () => {
    const hits = searchPhrases(CATEGORIES, '어디')
    expect(hits.map((h) => h.phraseId)).toEqual(['r1', 't1'])
  })

  it('단어 후리가나 일치', () => {
    const hits = searchPhrases(CATEGORIES, 'えき')
    expect(hits.map((h) => h.phraseId)).toEqual(['t1'])
  })

  it('빈 검색어는 빈 배열, 0건도 빈 배열', () => {
    expect(searchPhrases(CATEGORIES, '')).toEqual([])
    expect(searchPhrases(CATEGORIES, '존재하지않는문장')).toEqual([])
  })

  it('limit 준수', () => {
    expect(searchPhrases(CATEGORIES, '어디', 1)).toHaveLength(1)
  })
})
