import { describe, it, expect } from 'vitest'
import { buildIcsContent } from './ical-export'
import type { DailyRecord } from '@/store'

function makeRecord(date: string, partial: Partial<DailyRecord> = {}): DailyRecord {
  return {
    date,
    studyCount: 1,
    correctCount: 18,
    totalCount: 20,
    xpEarned: 50,
    wrongWordIds: [],
    ...partial,
  }
}

describe('buildIcsContent', () => {
  it('빈 dailyRecords일 때 VCALENDAR 헤더/푸터만 포함', () => {
    const ics = buildIcsContent({})
    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('END:VCALENDAR')
    expect(ics).not.toContain('BEGIN:VEVENT')
  })

  it('학습 기록 있으면 VEVENT 생성', () => {
    const ics = buildIcsContent({
      '2026-05-13': makeRecord('2026-05-13'),
    })
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics).toContain('END:VEVENT')
    expect(ics).toContain('DTSTART;VALUE=DATE:20260513')
    expect(ics).toContain('DTEND;VALUE=DATE:20260514')
  })

  it('studyCount=0인 날은 제외', () => {
    const ics = buildIcsContent({
      '2026-05-12': makeRecord('2026-05-12', { studyCount: 0 }),
      '2026-05-13': makeRecord('2026-05-13'),
    })
    // VEVENT는 정확히 1개만
    const matches = ics.match(/BEGIN:VEVENT/g) ?? []
    expect(matches.length).toBe(1)
    expect(ics).toContain('20260513')
    expect(ics).not.toContain('20260512')
  })

  it('월 경계를 넘는 다음날 계산 (5/31 → 6/1)', () => {
    const ics = buildIcsContent({
      '2026-05-31': makeRecord('2026-05-31'),
    })
    expect(ics).toContain('DTSTART;VALUE=DATE:20260531')
    expect(ics).toContain('DTEND;VALUE=DATE:20260601')
  })

  it('연 경계를 넘는 다음날 계산 (12/31 → 1/1)', () => {
    const ics = buildIcsContent({
      '2026-12-31': makeRecord('2026-12-31'),
    })
    expect(ics).toContain('DTSTART;VALUE=DATE:20261231')
    expect(ics).toContain('DTEND;VALUE=DATE:20270101')
  })

  it('SUMMARY에 학습 정보 + escape 처리', () => {
    const ics = buildIcsContent({
      '2026-05-13': makeRecord('2026-05-13', { studyCount: 3, xpEarned: 150 }),
    })
    expect(ics).toContain('3회 학습')
    expect(ics).toContain('+150 XP')
  })

  it('한국어 닉네임을 DESCRIPTION에 포함', () => {
    const ics = buildIcsContent(
      { '2026-05-13': makeRecord('2026-05-13') },
      '김민수',
    )
    expect(ics).toContain('김민수')
  })

  it('한글 멀티바이트도 RFC 5545 75 byte 라인 제한 준수', () => {
    // 매우 긴 한국어 닉네임으로 한 라인이 75 byte 초과하도록
    const ics = buildIcsContent(
      { '2026-05-13': makeRecord('2026-05-13') },
      '아주아주아주아주아주아주아주아주긴이름입니다정말로',
    )
    // 모든 라인의 byte 길이 확인 (RFC: 첫 줄 75, 이후 fold 라인은 ' ' 포함 75)
    const enc = new TextEncoder()
    for (const line of ics.split('\r\n')) {
      expect(enc.encode(line).length).toBeLessThanOrEqual(75)
    }
  })

  it('정렬: 날짜 오름차순으로 이벤트 생성', () => {
    const ics = buildIcsContent({
      '2026-05-15': makeRecord('2026-05-15'),
      '2026-05-13': makeRecord('2026-05-13'),
      '2026-05-14': makeRecord('2026-05-14'),
    })
    const idx13 = ics.indexOf('20260513')
    const idx14 = ics.indexOf('20260514')
    const idx15 = ics.indexOf('20260515')
    expect(idx13).toBeLessThan(idx14)
    expect(idx14).toBeLessThan(idx15)
  })
})
