// 단어 데이터 무결성 테스트 (conversations.test.ts와 같은 취지)
// 콘텐츠 확장이 계속되므로 id 충돌·필드 누락을 데이터 추가 시점에 잡는다.
import { describe, it, expect } from 'vitest'
import { WORDS } from './words'

describe('단어 데이터 무결성', () => {
  it('id가 전역에서 유일하다 (SRS·즐겨찾기·오답노트가 id를 키로 사용)', () => {
    const ids = WORDS.map((w) => w.id)
    const dups = ids.filter((id, i) => ids.indexOf(id) !== i)
    expect(dups, `중복 id: ${dups.slice(0, 10).join(', ')}`).toEqual([])
  })

  it('kanji/hiragana/meaning이 비어 있지 않다 (3단 표시 규칙)', () => {
    for (const word of WORDS) {
      expect(word.kanji, word.id).toBeTruthy()
      expect(word.hiragana, word.id).toBeTruthy()
      expect(word.meaning, word.id).toBeTruthy()
    }
  })

  it('level은 1~5(JLPT N1~N5) 범위다', () => {
    for (const word of WORDS) {
      expect([1, 2, 3, 4, 5], word.id).toContain(word.level)
    }
  })

  it('예문이 있으면 japanese/korean/reading을 모두 갖춘다 (띄어쓰기 reading 필수 규칙)', () => {
    for (const word of WORDS) {
      if (!word.example) continue
      expect(word.example.japanese, word.id).toBeTruthy()
      expect(word.example.korean, word.id).toBeTruthy()
      expect(word.example.reading, `${word.id} — 예문 reading 누락`).toBeTruthy()
    }
  })

  // 2026-07-10 정리 완료: N3/N2/N1 목록이 하위 레벨 단어를 재수록한 71건 제거.
  // 같은 단어는 하나의 항목·하나의 레벨로만 존재한다 (사전 이중 노출·SRS 이중 추적 방지).
  it('완전 중복(한자+히라가나+뜻) 항목이 없다', () => {
    const seen = new Map<string, string>()
    const dups: string[] = []
    for (const word of WORDS) {
      const key = `${word.kanji}|${word.hiragana}|${word.meaning}`
      if (seen.has(key)) dups.push(`${word.id}=${seen.get(key)} (${word.kanji})`)
      else seen.set(key, word.id)
    }
    expect(dups, dups.slice(0, 5).join(' | ')).toEqual([])
  })
})
