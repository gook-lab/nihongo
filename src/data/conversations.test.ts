// 회화 데이터 무결성 테스트
// 배경: 카테고리 내 일본어 문장이 중복되면 TTS 캐시 키(text:voiceId)를 공유해
// 미리받기 완료 판정·진행률이 왜곡된다 (2026-07 실버그). 데이터 추가 시 이 테스트가 막는다.
import { describe, it, expect } from 'vitest'
import { CONVERSATION_CATEGORIES } from './conversations'
import { DIALOGUES } from './dialogues'

describe('회화 데이터 무결성', () => {
  it('카테고리 내 일본어 문장이 중복되지 않는다 (TTS 캐시 키 공유 방지)', () => {
    for (const category of CONVERSATION_CATEGORIES) {
      const texts = category.phrases.map((p) => p.japanese)
      const dups = texts.filter((t, i) => texts.indexOf(t) !== i)
      expect(dups, `${category.id} 중복: ${dups.join(', ')}`).toEqual([])
    }
  })

  it('표현 id가 전역에서 유일하다 (진행도·즐겨찾기 오귀속 방지)', () => {
    const ids = CONVERSATION_CATEGORIES.flatMap((c) => c.phrases.map((p) => p.id))
    const dups = ids.filter((id, i) => ids.indexOf(id) !== i)
    expect(dups, `중복 id: ${dups.join(', ')}`).toEqual([])
  })

  it('모든 단어 토큰에 reading이 있다 (후리가나+로마자 표시 규칙)', () => {
    for (const category of CONVERSATION_CATEGORIES) {
      for (const phrase of category.phrases) {
        for (const word of phrase.words) {
          expect(word.reading, `${phrase.id}의 "${word.text}"`).toBeTruthy()
        }
      }
    }
  })

  it('level은 N5/N4/N3 중 하나다', () => {
    for (const category of CONVERSATION_CATEGORIES) {
      for (const phrase of category.phrases) {
        expect(['N5', 'N4', 'N3'], phrase.id).toContain(phrase.level)
      }
    }
  })

  it('여행 코어 8개 카테고리는 표현 30개 이상을 유지한다', () => {
    const TRAVEL_IDS = [
      'travel', 'accommodation', 'restaurant', 'cafe',
      'convenience', 'shopping', 'transport', 'weather',
    ]
    for (const id of TRAVEL_IDS) {
      const category = CONVERSATION_CATEGORIES.find((c) => c.id === id)
      expect(category, id).toBeDefined()
      expect(category!.phrases.length, id).toBeGreaterThanOrEqual(30)
    }
  })
})

describe('대화 시나리오 무결성', () => {
  it('시나리오 id가 유일하고 각 라인 토큰에 reading이 있다', () => {
    const ids = DIALOGUES.map((d) => d.id)
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
    for (const dialogue of DIALOGUES) {
      expect(dialogue.lines.length, dialogue.id).toBeGreaterThanOrEqual(4)
      for (const line of dialogue.lines) {
        for (const word of line.words) {
          expect(word.reading, `${dialogue.id}의 "${word.text}"`).toBeTruthy()
        }
      }
    }
  })
})
