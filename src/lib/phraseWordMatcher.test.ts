import { describe, it, expect } from 'vitest'
import { buildWordIndex, matchPhraseWords, segmentPhrasedText, matchPhraseWithWords } from './phraseWordMatcher'
import type { Word } from '@/types'

describe('phraseWordMatcher', () => {
  // 테스트용 샘플 단어
  const sampleWords: Word[] = [
    { id: 'w1', kanji: 'レストラン', hiragana: 'れすとらん', meaning: '레스토랑', level: 5 },
    { id: 'w2', kanji: '探す', hiragana: 'さがす', meaning: '찾다', level: 5 },
    { id: 'w3', kanji: '水', hiragana: 'みず', meaning: '물', level: 5 },
    { id: 'w4', kanji: '飲む', hiragana: 'のむ', meaning: '마시다', level: 5 },
    { id: 'w5', kanji: '家', hiragana: 'いえ', meaning: '집', level: 5 },
    { id: 'w6', kanji: '本', hiragana: 'ほん', meaning: '책', level: 5 },
  ]

  describe('buildWordIndex', () => {
    it('should create index with kanji keys', () => {
      const index = buildWordIndex(sampleWords)
      expect(index.has('レストラン')).toBe(true)
      expect(index.has('探す')).toBe(true)
      expect(index.get('レストラン')?.[0].meaning).toBe('레스토랑')
    })

    it('should create index with hiragana keys for fallback', () => {
      const index = buildWordIndex(sampleWords)
      expect(index.has('れすとらん')).toBe(true)
      expect(index.has('さがす')).toBe(true)
    })

    it('should handle words without kanji', () => {
      const wordsWithoutKanji: Word[] = [
        { id: 'w1', kanji: '', hiragana: 'あ', meaning: '문자', level: 5 },
      ]
      const index = buildWordIndex(wordsWithoutKanji)
      expect(index.has('あ')).toBe(true)
    })
  })

  describe('matchPhraseWords', () => {
    it('should match simple phrase', () => {
      const text = 'レストラン探す'
      const index = buildWordIndex(sampleWords)
      const matches = matchPhraseWords(text, index)

      // レストラン과 探す 매칭되어야 함
      expect(matches.length).toBeGreaterThanOrEqual(2)
      expect(matches.some((m) => m.word.id === 'w1')).toBe(true)
      expect(matches.some((m) => m.word.id === 'w2')).toBe(true)
    })

    it('should match longest substring first', () => {
      // 長い (4글자)와 長 (1글자)가 있어도 긴 것 우선
      const wordsWithDifferentLengths: Word[] = [
        { id: 'w1', kanji: '長', hiragana: 'なが', meaning: '길다', level: 5 },
        { id: 'w2', kanji: '長い', hiragana: 'ながい', meaning: '길다', level: 5 },
      ]
      const text = '長い川'
      const index = buildWordIndex(wordsWithDifferentLengths)
      const matches = matchPhraseWords(text, index)

      // 長い가 먼저 매칭
      expect(matches[0].word.id).toBe('w2')
      expect(matches[0].matchedText).toBe('長い')
    })

    it('should skip non-matching characters', () => {
      const text = '水飲む'
      const index = buildWordIndex(sampleWords)
      const matches = matchPhraseWords(text, index)

      // 水와 飲む 매칭 (사전에 있는 단어만)
      expect(matches.some((m) => m.word.id === 'w3')).toBe(true)
      expect(matches.some((m) => m.word.id === 'w4')).toBe(true)
    })

    it('should return correct positions', () => {
      const text = 'レストラン'
      const index = buildWordIndex(sampleWords)
      const matches = matchPhraseWords(text, index)

      expect(matches[0].startIndex).toBe(0)
      expect(matches[0].endIndex).toBe('レストラン'.length)
    })

    it('should handle empty results', () => {
      const text = 'ああああ'
      const index = buildWordIndex(sampleWords)
      const matches = matchPhraseWords(text, index)

      expect(matches.length).toBe(0)
    })

    it('should handle consecutive matches', () => {
      const text = '本を読む本'
      const index = buildWordIndex(sampleWords)
      const matches = matchPhraseWords(text, index)

      // 本이 두 번 매칭되어야 함
      const bookMatches = matches.filter((m) => m.word.id === 'w6')
      expect(bookMatches.length).toBe(2)
      expect(bookMatches[0].startIndex).toBe(0)
      expect(bookMatches[1].startIndex).toBe('本を読む'.length)
    })

    it('should not match partial overlaps', () => {
      const wordsWithPartialOverlap: Word[] = [
        { id: 'w1', kanji: '家', hiragana: 'いえ', meaning: '집', level: 5 },
        { id: 'w2', kanji: '家族', hiragana: 'かぞく', meaning: '가족', level: 5 },
      ]
      const text = '家族'
      const index = buildWordIndex(wordsWithPartialOverlap)
      const matches = matchPhraseWords(text, index)

      // 家族이 먼저 매칭 (최장일치)
      expect(matches[0].word.id).toBe('w2')
      expect(matches.length).toBe(1)
    })
  })

  describe('segmentPhrasedText', () => {
    it('should segment text with matches', () => {
      const text = 'レストランを探す'
      const index = buildWordIndex(sampleWords)
      const matches = matchPhraseWords(text, index)
      const segments = segmentPhrasedText(text, matches)

      // link, text, link 형태로 분절
      expect(segments.length).toBeGreaterThan(0)
      expect(segments.some((s) => s.type === 'link')).toBe(true)
      expect(segments.some((s) => s.type === 'text')).toBe(true)
    })

    it('should preserve text order', () => {
      const text = 'レストラン探す'
      const index = buildWordIndex(sampleWords)
      const matches = matchPhraseWords(text, index)
      const segments = segmentPhrasedText(text, matches)

      // 분절을 다시 조합하면 원본과 같아야 함
      const reconstructed = segments
        .map((s) => {
          if (s.type === 'link') {
            return s.content.matchedText
          }
          return s.content
        })
        .join('')
      expect(reconstructed).toBe(text)
    })
  })

  describe('matchPhraseWithWords', () => {
    it('should work without manual index', () => {
      const text = 'レストランを探す'
      const matches = matchPhraseWithWords(text, sampleWords)

      expect(matches.some((m) => m.word.id === 'w1')).toBe(true)
      expect(matches.some((m) => m.word.id === 'w2')).toBe(true)
    })
  })
})
