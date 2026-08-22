// 학습 인사이트 — dailyRecords + wordSrs 분석 → 자연어 문장 3~5개.
// Gemini 없이 룰 기반으로 빠르게 생성. 데이터가 없으면 친절한 기본 문구.
import type { DailyRecord, AppState } from '@/store'
import type { WordSrsState } from '@/types'
import { WORDS } from '@/data/words'

export type InsightTone = 'celebrate' | 'encourage' | 'info'

export interface Insight {
  id: string
  tone: InsightTone
  emoji: string
  text: string
}

interface InsightInput {
  dailyRecords: Record<string, DailyRecord>
  wordSrs: Record<string, WordSrsState>
  streak: number
  xp: number
  level: number
}

/** 최근 N일치 dailyRecord를 배열로 반환. 빈 날은 빠짐. */
function recentRecords(
  records: Record<string, DailyRecord>,
  days: number,
): DailyRecord[] {
  const sorted = Object.values(records).sort((a, b) =>
    a.date.localeCompare(b.date),
  )
  return sorted.slice(-days)
}

/** 누적 정답률 (최근 7일) */
function recentAccuracy(records: DailyRecord[]): number | null {
  const total = records.reduce((s, r) => s + r.totalCount, 0)
  if (total === 0) return null
  const correct = records.reduce((s, r) => s + r.correctCount, 0)
  return correct / total
}

/** 학습 시간대 패턴 — hourCounts 누적 분석. 가장 활발한 시간 범위 추출. */
function topHourRange(records: DailyRecord[]): string | null {
  const totals = new Array(24).fill(0)
  let hasData = false
  for (const r of records) {
    if (!r.hourCounts) continue
    for (let h = 0; h < 24; h++) {
      const c = r.hourCounts[h] ?? 0
      totals[h] += c
      if (c > 0) hasData = true
    }
  }
  if (!hasData) return null
  // 가장 학습 많은 hour 추출
  let max = 0
  let maxIdx = 0
  for (let h = 0; h < 24; h++) {
    if (totals[h] > max) {
      max = totals[h]
      maxIdx = h
    }
  }
  // hour → 범위 라벨
  if (maxIdx >= 5 && maxIdx < 11) return '아침'
  if (maxIdx >= 11 && maxIdx < 14) return '점심'
  if (maxIdx >= 14 && maxIdx < 18) return '오후'
  if (maxIdx >= 18 && maxIdx < 22) return '저녁'
  return '밤'
}

/** 요일 패턴 — 최근 14일 중 가장 활발한 요일 */
function topWeekday(records: DailyRecord[]): string | null {
  if (records.length < 3) return null
  const counts = new Array(7).fill(0)
  for (const r of records) {
    const d = new Date(r.date + 'T00:00:00')
    if (Number.isNaN(d.getTime())) continue
    counts[d.getDay()] += r.studyCount
  }
  const max = Math.max(...counts)
  if (max === 0) return null
  const idx = counts.indexOf(max)
  return ['일', '월', '화', '수', '목', '금', '토'][idx]
}

/** SRS 분석 — 가장 많이 복습한 JLPT 레벨 추출 */
function topReviewedLevel(wordSrs: Record<string, WordSrsState>): string | null {
  const byLevel: Record<string, number> = {}
  for (const srs of Object.values(wordSrs)) {
    const word = WORDS.find((w) => w.id === srs.wordId)
    if (!word) continue
    const lv = word.level || 'N5'
    byLevel[lv] = (byLevel[lv] || 0) + srs.reviewCount
  }
  const entries = Object.entries(byLevel)
  if (entries.length === 0) return null
  entries.sort((a, b) => b[1] - a[1])
  return entries[0][0]
}

/** SRS 마스터 단어 수 — interval >= 21일이면 장기 기억 단계 */
function masteredCount(wordSrs: Record<string, WordSrsState>): number {
  return Object.values(wordSrs).filter((s) => s.intervalDays >= 21).length
}

/** 오늘 학습 안 한 경우 */
function todayKey(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

/**
 * 인사이트 3~5개 생성. 우선순위:
 *  1. 스트릭 축하 (3일+)
 *  2. 최근 정답률 변화
 *  3. JLPT 레벨별 복습 분포
 *  4. 마스터 단어 수
 *  5. 활발한 요일
 *  6. 오늘 학습 권유 (오늘 기록 없을 때)
 */
export function generateInsights(input: InsightInput): Insight[] {
  const { dailyRecords, wordSrs, streak } = input
  const insights: Insight[] = []

  const recent7 = recentRecords(dailyRecords, 7)
  const acc = recentAccuracy(recent7)
  const studiedToday = !!dailyRecords[todayKey()]

  // 1. 스트릭 축하
  if (streak >= 7) {
    insights.push({
      id: 'streak',
      tone: 'celebrate',
      emoji: '🔥',
      text: `${streak}일 연속 학습 중! 꾸준함이 가장 큰 무기예요.`,
    })
  } else if (streak >= 3) {
    insights.push({
      id: 'streak',
      tone: 'encourage',
      emoji: '✨',
      text: `${streak}일째 학습 중이에요. 일주일까지 ${7 - streak}일 남았어요!`,
    })
  }

  // 2. 정답률 인사이트
  if (acc !== null) {
    const pct = Math.round(acc * 100)
    if (pct >= 85) {
      insights.push({
        id: 'accuracy',
        tone: 'celebrate',
        emoji: '🎯',
        text: `최근 정답률 ${pct}%! 다음 레벨로 올라갈 준비가 됐어요.`,
      })
    } else if (pct >= 65) {
      insights.push({
        id: 'accuracy',
        tone: 'info',
        emoji: '📊',
        text: `최근 정답률 ${pct}% — 안정적인 속도로 익히고 있어요.`,
      })
    } else if (pct >= 30) {
      insights.push({
        id: 'accuracy',
        tone: 'encourage',
        emoji: '💪',
        text: `최근 정답률 ${pct}%. 오답 복습부터 시작해 보세요.`,
      })
    }
  }

  // 3. 활발한 요일
  const day = topWeekday(recentRecords(dailyRecords, 14))
  if (day) {
    insights.push({
      id: 'weekday',
      tone: 'info',
      emoji: '📅',
      text: `${day}요일에 가장 열심히 학습하시네요.`,
    })
  }

  // 3b. 학습 시간대 패턴
  const hourRange = topHourRange(recentRecords(dailyRecords, 14))
  if (hourRange) {
    insights.push({
      id: 'hour-range',
      tone: 'info',
      emoji: '⏰',
      text: `주로 ${hourRange} 시간대에 학습하세요.`,
    })
  }

  // 4. JLPT 레벨 분포
  const topLv = topReviewedLevel(wordSrs)
  if (topLv) {
    insights.push({
      id: 'top-level',
      tone: 'info',
      emoji: '🏷️',
      text: `${topLv} 단어를 가장 많이 복습했어요.`,
    })
  }

  // 5. 마스터 단어 수
  const mastered = masteredCount(wordSrs)
  if (mastered >= 10) {
    insights.push({
      id: 'mastered',
      tone: 'celebrate',
      emoji: '🏆',
      text: `${mastered}개 단어를 장기 기억에 옮겼어요 (21일+ 복습 간격).`,
    })
  }

  // 6. 오늘 학습 안 했으면 — 부드러운 권유
  if (!studiedToday && insights.length < 3) {
    insights.push({
      id: 'today',
      tone: 'encourage',
      emoji: '🌱',
      text: '오늘 아직 학습 전이에요. 10분만 시작해 볼까요?',
    })
  }

  // 데이터가 거의 없을 때 기본 환영 문구
  if (insights.length === 0) {
    insights.push({
      id: 'welcome',
      tone: 'encourage',
      emoji: '👋',
      text: '학습을 시작하면 여기에 인사이트가 쌓여요.',
    })
  }

  // 최대 5개
  return insights.slice(0, 5)
}

/** AppState에서 바로 호출하는 편의 래퍼 */
export function generateInsightsFromState(state: Pick<AppState, 'dailyRecords' | 'wordSrs' | 'streak' | 'xp' | 'level'>): Insight[] {
  return generateInsights({
    dailyRecords: state.dailyRecords ?? {},
    wordSrs: state.wordSrs ?? {},
    streak: state.streak ?? 0,
    xp: state.xp ?? 0,
    level: state.level ?? 1,
  })
}

// ── 어제 vs 오늘 비교 ─────────────────────────────────────

export interface DayComparison {
  todayCount: number
  yesterdayCount: number
  todayAccuracy: number | null // 0~100
  yesterdayAccuracy: number | null
  todayXp: number
  yesterdayXp: number
}

function dateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export function compareTodayVsYesterday(
  records: Record<string, DailyRecord>,
): DayComparison {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const t = records[dateKey(today)]
  const y = records[dateKey(yesterday)]

  return {
    todayCount: t?.totalCount ?? 0,
    yesterdayCount: y?.totalCount ?? 0,
    todayAccuracy: t && t.totalCount > 0 ? Math.round((t.correctCount / t.totalCount) * 100) : null,
    yesterdayAccuracy: y && y.totalCount > 0 ? Math.round((y.correctCount / y.totalCount) * 100) : null,
    todayXp: t?.xpEarned ?? 0,
    yesterdayXp: y?.xpEarned ?? 0,
  }
}
