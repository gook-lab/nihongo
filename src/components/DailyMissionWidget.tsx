import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { Target, Check, Sparkles, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/store'
import type { DailyMissionType } from '@/types'

// 미션 타입 → 클릭 시 이동할 경로
function missionToRoute(type: DailyMissionType): string {
  switch (type) {
    case 'learn-words':
      return '/learn'
    case 'conversation':
      return '/conversation'
    case 'review-wrong':
      return '/wrong-words'
    case 'streak-correct':
      return '/learn'
    default:
      return '/learn'
  }
}

export function DailyMissionWidget() {
  const navigate = useNavigate()
  const dailyMissions = useAppStore((s) => s.dailyMissions)
  const ensureTodaysMissions = useAppStore((s) => s.ensureTodaysMissions)

  useEffect(() => {
    ensureTodaysMissions()
    // 자정 자동 갱신 — 60초마다 체크 (날짜 바뀌면 새 미션 생성).
    // 또 페이지 visibility 복귀(앱 백그라운드→포그라운드) 시점도 체크.
    const interval = setInterval(ensureTodaysMissions, 60 * 1000)
    const onVisible = () => {
      if (document.visibilityState === 'visible') ensureTodaysMissions()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [ensureTodaysMissions])

  if (dailyMissions.length === 0) return null

  const completedCount = dailyMissions.filter((m) => m.completed).length
  const allDone = completedCount === dailyMissions.length

  return (
    <Card className={allDone ? 'border-primary/30 bg-primary/5' : ''}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              {allDone ? (
                <Sparkles className="w-4 h-4 text-primary" />
              ) : (
                <Target className="w-4 h-4 text-primary" />
              )}
            </div>
            <span className="font-semibold">오늘의 미션</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{dailyMissions.length}
          </span>
        </div>

        <div className="space-y-2">
          {dailyMissions.map((mission, idx) => {
            const percent = Math.min(100, (mission.progress / mission.target) * 100)
            return (
              <m.button
                key={mission.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  !mission.completed && navigate(missionToRoute(mission.type))
                }
                disabled={mission.completed}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  mission.completed
                    ? 'bg-primary/10 cursor-default'
                    : 'bg-muted/50 hover:bg-muted/70 cursor-pointer'
                }`}
                aria-label={
                  mission.completed
                    ? `${mission.description} (완료)`
                    : `${mission.description} 시작하기`
                }
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-sm font-medium ${
                      mission.completed ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {mission.description}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {mission.progress}/{mission.target}
                    </span>
                    {mission.completed ? (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <div className="h-1.5 bg-background rounded-full overflow-hidden">
                  <m.div
                    // width 대신 transform — width 애니메이션은 매 프레임
                    // 레이아웃을 다시 계산한다. 자식을 트랙 너비로 두고 왼쪽으로
                    // 밀면 둥근 양끝까지 시각 결과가 같고 합성만 일어난다.
                    initial={{ x: '-100%' }}
                    animate={{ x: `-${100 - percent}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`h-full w-full rounded-full ${
                      mission.completed ? 'bg-primary' : 'bg-primary/70'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  보상 +{mission.rewardXP} XP
                </p>
              </m.button>
            )
          })}
        </div>

        {allDone && (
          <m.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-primary font-semibold mt-3"
          >
            오늘의 미션 모두 완료! 잘했어요
          </m.p>
        )}
      </CardContent>
    </Card>
  )
}
