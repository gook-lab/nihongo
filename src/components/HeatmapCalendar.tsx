// GitHub 스타일 365일 학습 활동 히트맵
// dailyRecords의 xpEarned 기반으로 4단계 색상 강도
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'
import { useAppStore } from '@/store'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']
const TOTAL_WEEKS = 26 // 약 6개월 (가로 폭 적당)

function intensityClass(xp: number): string {
  if (xp === 0) return 'bg-muted'
  if (xp < 50) return 'opacity-30'
  if (xp < 100) return 'opacity-50'
  if (xp < 200) return 'opacity-75'
  return 'opacity-100'
}

export function HeatmapCalendar() {
  const dailyRecords = useAppStore((s) => s.dailyRecords)

  // 365일 × 1개 컴포넌트라 매 렌더에 inline 계산해도 비용 미미 — useMemo 제거로 단순화
  // 첫 컬럼은 일요일부터 시작, 마지막 컬럼은 오늘까지 — 미래 빈 셀 안 그림 (시각적 잘림 방지)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayDay = today.getDay() // 0=일 ~ 6=토

  // 가장 오래된 날짜: 오늘 - todayDay(이번 주 일요일) - (TOTAL_WEEKS-1)*7
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - todayDay - (TOTAL_WEEKS - 1) * 7)

  const grid: Array<{ date: Date; key: string; xp: number }> = []
  // startDate(일요일)부터 today까지 (둘 다 포함). 미래 날짜는 추가 안 함.
  // 키는 로컬 타임존 YYYY-MM-DD — dailyRecords 저장 키와 동일 포맷 유지
  // (UTC toISOString 쓰면 KST 자정~오전9시 학습이 어제 셀로 들어가는 버그).
  const dayCount = Math.round((today.getTime() - startDate.getTime()) / 86400000) + 1
  for (let i = 0; i < dayCount; i++) {
    const d = new Date(startDate)
    d.setDate(startDate.getDate() + i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const rec = dailyRecords[key]
    grid.push({
      date: d,
      key,
      xp: rec?.xpEarned ?? 0,
    })
  }

  const studied = grid.filter((c) => c.xp > 0).length
  const totalXp = grid.reduce((sum, c) => sum + c.xp, 0)
  const bestDay = grid.reduce((max, c) => (c.xp > max ? c.xp : max), 0)
  const stats = { studied, totalXp, bestDay }

  // 7행 × TOTAL_WEEKS 열 그리드. 일요일이 row 0, 토요일이 row 6
  // CSS grid로 표현: gridTemplateColumns가 TOTAL_WEEKS개, 각 셀이 자기 row 지정
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          학습 활동
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 통계 요약 */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {stats.studied}
            </p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
              학습한 날
            </p>
          </div>
          <div>
            <p className="text-xl font-bold">{stats.totalXp}</p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
              누적 XP
            </p>
          </div>
          <div>
            <p className="text-xl font-bold">{stats.bestDay}</p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
              최고 일일 XP
            </p>
          </div>
        </div>

        {/* 학습 기록 0일 — 큰 빈 그리드 대신 안내 메시지 + 마스코트.
            데이터가 쌓이기 시작하면 자동으로 그리드 표시 모드로 전환. */}
        {stats.studied === 0 ? (
          <div
            className="rounded-2xl py-6 px-4 text-center"
            style={{ background: 'var(--color-muted)' }}
          >
            <p
              className="text-sm font-semibold"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              아직 학습 기록이 없어요
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              오늘 첫 학습을 시작하면 여기에 잔디가 채워져요 🌱
            </p>
          </div>
        ) : (
        /* 그리드 — 가로 스크롤 가능 */
        <div className="overflow-x-auto">
          <div className="flex gap-2 min-w-fit">
            {/* 요일 라벨 (월/수/금만 표시) */}
            <div
              className="flex flex-col justify-between pt-1 pb-1 text-[9px] shrink-0"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {WEEKDAY_LABELS.map((d, i) => (
                <span key={d} style={{ visibility: i % 2 === 1 ? 'visible' : 'hidden' }}>
                  {d}
                </span>
              ))}
            </div>

            {/* 셀 그리드 */}
            <div
              className="grid grid-flow-col grid-rows-7 gap-[3px]"
              style={{ gridAutoColumns: '10px' }}
            >
              {grid.map((c) => (
                <div
                  key={c.key}
                  className={`w-2.5 h-2.5 rounded-[2px] ${intensityClass(c.xp)}`}
                  style={
                    c.xp > 0
                      ? { background: 'var(--color-primary)' }
                      : { background: 'var(--color-muted)' }
                  }
                  title={`${c.key} · ${c.xp} XP`}
                />
              ))}
            </div>
          </div>
        </div>
        )}

        {/* 범례 — 그리드 표시 모드에서만 */}
        {stats.studied > 0 && (
        <div
          className="flex items-center gap-1.5 justify-end text-[10px]"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          <span>적음</span>
          {[0, 30, 60, 80, 100].map((opacity, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-[2px]"
              style={{
                background:
                  opacity === 0
                    ? 'var(--color-muted)'
                    : `var(--color-primary)`,
                opacity: opacity === 0 ? 1 : opacity / 100,
              }}
            />
          ))}
          <span>많음</span>
        </div>
        )}
      </CardContent>
    </Card>
  )
}
