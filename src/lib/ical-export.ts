// 학습 기록을 iCal(.ics) 형식으로 export
// 사용자가 Google Calendar / Apple Calendar / Outlook에 가져와 시각적 성취감 + 외부 백업
//
// 각 학습 일자를 종일 이벤트로 만들고, 요약에 XP / 정답 / 학습 수 표시
import type { DailyRecord } from '@/store'

const APP_NAME = '니혼고 앱'
const CAL_NAME = '니혼고 학습 기록'
// 안정적인 UID prefix — Calendar 앱이 같은 날짜 이벤트를 업데이트로 인식
const UID_PREFIX = 'nihongo-app'

/**
 * iCal RFC 5545 텍스트 escape
 * - 콤마/세미콜론/백슬래시 → 백슬래시 escape
 * - 줄바꿈 → \n
 */
function escapeIcal(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

/**
 * "YYYY-MM-DD" → "YYYYMMDD" (iCal DATE 형식)
 * VALUE=DATE는 시간대가 없는 floating date라 캘린더 앱이 사용자 timezone으로 해석.
 * 저장된 dailyRecords.date가 이미 KST 자정 기준 YYYY-MM-DD라 그대로 사용.
 */
function toIcalDate(yyyymmdd: string): string {
  return yyyymmdd.replace(/-/g, '')
}

/**
 * 다음 날짜 (종일 이벤트는 DTEND가 exclusive)
 * 단순 문자열 산술 — UTC/KST 변환 없이 day-level만 처리해 시차 회피.
 */
function nextDayIcal(yyyymmdd: string): string {
  const [y, m, d] = yyyymmdd.split('-').map((s) => parseInt(s, 10))
  // KST 자정 기준으로 명시 (T00:00:00+09:00) — 한국 사용자가 학습한 그 날짜를 그대로
  const kstMidnight = new Date(`${yyyymmdd}T00:00:00+09:00`)
  kstMidnight.setDate(kstMidnight.getDate() + 1)
  // 다시 KST 기준 YYYY-MM-DD로 추출
  const kstNext = new Date(kstMidnight.getTime() + 9 * 60 * 60 * 1000)
  const Y = kstNext.getUTCFullYear()
  const M = String(kstNext.getUTCMonth() + 1).padStart(2, '0')
  const D = String(kstNext.getUTCDate()).padStart(2, '0')
  // y/m/d 사용 안 한다는 lint 경고 회피
  void y; void m; void d
  return `${Y}${M}${D}`
}

/**
 * UTC ISO 8601 → iCal DATETIME 형식 (YYYYMMDDTHHMMSSZ)
 */
function toIcalDateTime(ms: number): string {
  return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/**
 * RFC 5545: 한 라인은 75 **octets(byte)** 이하. 초과 시 CRLF + 공백으로 folding.
 * 한글/일본어는 UTF-8에서 글자당 3 byte라 byte 기준으로 끊지 않으면 RFC 위반 + 일부 앱이 거부.
 * (TextEncoder로 byte 길이 확인 후 byte 단위로 안전 분할)
 */
const enc = new TextEncoder()
const dec = new TextDecoder()

function byteLen(s: string): number {
  return enc.encode(s).length
}

function sliceBytes(s: string, maxBytes: number): { head: string; tail: string } {
  // UTF-8 멀티바이트 경계를 깨지 않으면서 maxBytes 이하로 자른다
  const bytes = enc.encode(s)
  if (bytes.length <= maxBytes) return { head: s, tail: '' }
  let end = maxBytes
  // UTF-8 continuation byte (10xxxxxx)면 한 글자 안에 들어와 있으므로 뒤로 후퇴
  while (end > 0 && (bytes[end] & 0xc0) === 0x80) end--
  const headBytes = bytes.slice(0, end)
  const tailBytes = bytes.slice(end)
  return { head: dec.decode(headBytes), tail: dec.decode(tailBytes) }
}

function foldLine(line: string): string {
  // 첫 라인은 75 byte, 이후 라인은 ' ' 1 byte 포함 75 byte → 콘텐츠 74 byte
  if (byteLen(line) <= 75) return line
  const parts: string[] = []
  let { head, tail } = sliceBytes(line, 75)
  parts.push(head)
  while (tail.length > 0 && byteLen(tail) > 74) {
    const next = sliceBytes(tail, 74)
    parts.push(' ' + next.head)
    tail = next.tail
  }
  if (tail.length > 0) parts.push(' ' + tail)
  return parts.join('\r\n')
}

export function buildIcsContent(
  dailyRecords: Record<string, DailyRecord>,
  userName: string = '학습자',
): string {
  const now = toIcalDateTime(Date.now())
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${APP_NAME}//KO`,
    `X-WR-CALNAME:${escapeIcal(CAL_NAME)}`,
    'X-WR-TIMEZONE:Asia/Seoul',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ]

  const records = Object.values(dailyRecords)
    .filter((r) => r.studyCount > 0 && r.date)
    .sort((a, b) => a.date.localeCompare(b.date))

  for (const rec of records) {
    const startDate = toIcalDate(rec.date)
    const endDate = nextDayIcal(rec.date)
    const accuracy =
      rec.totalCount > 0
        ? Math.round((rec.correctCount / rec.totalCount) * 100)
        : 0
    const summary = `📚 ${rec.studyCount}회 학습 · +${rec.xpEarned} XP`
    const description = [
      `${userName}님의 일본어 학습 기록`,
      ``,
      `학습 세션: ${rec.studyCount}회`,
      `문제: ${rec.correctCount} / ${rec.totalCount} 정답 (${accuracy}%)`,
      `획득 XP: ${rec.xpEarned}`,
      rec.wrongWordIds.length > 0
        ? `오답: ${rec.wrongWordIds.length}개 (복습 권장)`
        : `오답 없음 🎉`,
    ].join('\n')

    lines.push(
      'BEGIN:VEVENT',
      foldLine(`UID:${UID_PREFIX}-${rec.date}@nihongo`),
      foldLine(`DTSTAMP:${now}`),
      foldLine(`DTSTART;VALUE=DATE:${startDate}`),
      foldLine(`DTEND;VALUE=DATE:${endDate}`),
      foldLine(`SUMMARY:${escapeIcal(summary)}`),
      foldLine(`DESCRIPTION:${escapeIcal(description)}`),
      'TRANSP:TRANSPARENT', // 일정 위에 겹치지 않는 종일 표시
      'END:VEVENT',
    )
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

export function downloadIcs(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
