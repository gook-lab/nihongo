import { describe, it, expect } from 'vitest'
import { isAnswerCorrect, isJapaneseAnswerCorrect } from './answerMatcher'

describe('isAnswerCorrect', () => {
  it('정확히 일치하는 답을 정답으로 인정', () => {
    expect(isAnswerCorrect('학교', '학교')).toBe(true)
    expect(isAnswerCorrect('먹다', '먹다')).toBe(true)
  })

  it('공백 trim', () => {
    expect(isAnswerCorrect('  학교  ', '학교')).toBe(true)
    expect(isAnswerCorrect('학교', '  학교  ')).toBe(true)
  })

  it('빈 입력은 오답', () => {
    expect(isAnswerCorrect('', '학교')).toBe(false)
    expect(isAnswerCorrect('   ', '학교')).toBe(false)
  })

  it('쉼표로 구분된 복수 의미 — 어느 하나만 맞아도 정답', () => {
    expect(isAnswerCorrect('낮', '낮, 점심')).toBe(true)
    expect(isAnswerCorrect('점심', '낮, 점심')).toBe(true)
    expect(isAnswerCorrect('아침', '낮, 점심')).toBe(false)
  })

  it('일본어/슬래시 구분자도 처리', () => {
    expect(isAnswerCorrect('빨강', '빨강、붉은색')).toBe(true)
    expect(isAnswerCorrect('붉은색', '빨강、붉은색')).toBe(true)
    expect(isAnswerCorrect('파랑', '빨강/파랑')).toBe(true)
  })

  it('하다 접미사 변형: "편리" ↔ "편리하다"', () => {
    expect(isAnswerCorrect('편리', '편리하다')).toBe(true)
    expect(isAnswerCorrect('편리하다', '편리')).toBe(true)
    expect(isAnswerCorrect('사용', '사용하다')).toBe(true)
  })

  it('"~다"로 끝나는 단어는 "하다" 추가 안 함 (예: "크다" ≠ "크다하다")', () => {
    expect(isAnswerCorrect('크다', '크다')).toBe(true)
    expect(isAnswerCorrect('크', '크다')).toBe(false)
  })

  it('대소문자 무시 (영어 단어)', () => {
    expect(isAnswerCorrect('hello', 'Hello')).toBe(true)
    expect(isAnswerCorrect('HELLO', 'hello')).toBe(true)
  })

  it('완전히 다른 답은 오답', () => {
    expect(isAnswerCorrect('자동차', '학교')).toBe(false)
  })
})

describe('isJapaneseAnswerCorrect', () => {
  it('히라가나 일치', () => {
    expect(isJapaneseAnswerCorrect('がっこう', 'がっこう', '学校')).toBe(true)
  })

  it('한자 일치', () => {
    expect(isJapaneseAnswerCorrect('学校', 'がっこう', '学校')).toBe(true)
  })

  it('공백 trim', () => {
    expect(isJapaneseAnswerCorrect('  がっこう  ', 'がっこう', '学校')).toBe(true)
  })

  it('일치 안 함', () => {
    expect(isJapaneseAnswerCorrect('せんせい', 'がっこう', '学校')).toBe(false)
  })

  it('빈 입력', () => {
    expect(isJapaneseAnswerCorrect('', 'がっこう', '学校')).toBe(false)
  })
})
