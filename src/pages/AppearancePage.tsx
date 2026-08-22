// 외관/테마 통합 설정 페이지 — 마스코트, 색·폰트 테마, 홈 레이아웃, 다크 모드
import { m } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Palette,
  LayoutGrid,
  Moon,
  Sun,
  Sparkles,
  Award,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { BottomNav } from '@/components/BottomNav'
import { PageHeader } from '@/components/PageHeader'
import { useAppStore } from '@/store'
import { MASCOTS } from '@/data/mascots'
import { THEMES } from '@/lib/themes'
import { cn } from '@/lib/utils'
import { Target } from 'lucide-react'

const HOME_LAYOUTS = [
  { id: 'auto' as const, name: '자동', description: '여행 회화 우선 홈 (기본)' },
  { id: 'travel' as const, name: '여행', description: '회화 상황별 + 더 배우기' },
  { id: 'default' as const, name: '기본', description: '카드 + 캘린더 + XP 바' },
  { id: 'mono' as const, name: '모노', description: '잉크 블랙 streak 배너' },
  { id: 'ios' as const, name: 'iOS', description: '큰 타이틀 + 그룹 리스트' },
  { id: 'editorial' as const, name: '에디토리얼', description: '거대 세리프 + 매거진 row' },
  { id: 'mascot' as const, name: '마스코트', description: '큰 마스코트 + 말풍선' },
]

// UI Tone Board 기준 3개 테마 — 모두 추천 (더 보기 없음)
const RECOMMENDED_THEME_IDS = ['default', 'editorial', 'ink'] as const

const THEME_RECOMMENDED_DESC: Record<string, string> = {
  default: 'Airbnb Coral · 친근한 기본',
  editorial: '매거진 세리프 톤',
  ink: '미니멀 모노톤',
}

export function AppearancePage() {
  const navigate = useNavigate()
  const {
    darkMode,
    setDarkMode,
    darkModeAuto,
    setDarkModeAuto,
    hapticEnabled,
    setHapticEnabled,
    selectedMascotId,
    setMascot,
    themeId,
    setTheme,
    homeLayoutId,
    setHomeLayout,
    immersionMode,
    setImmersionMode,
  } = useAppStore()
  const userLevel = useAppStore((s) => s.level)
  void userLevel

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader title="테마 설정" icon={Sparkles} back backTo="/settings" />

      <m.div
        className="px-5 mt-4 space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* 다크 모드 */}
        <div>
          <p className="type-section mb-3 px-1">
            화면 모드
          </p>
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    {darkMode ? (
                      <Moon className="w-5 h-5 text-primary" />
                    ) : (
                      <Sun className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">다크 모드</p>
                    <p className="text-xs text-muted-foreground">
                      {darkModeAuto
                        ? '시스템 설정 따라가는 중'
                        : darkMode
                          ? '어두운 배경으로 표시'
                          : '밝은 배경으로 표시'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  disabled={darkModeAuto}
                  className={cn(
                    'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
                    darkMode ? 'bg-primary' : 'bg-muted',
                    darkModeAuto && 'opacity-50',
                  )}
                  aria-label="다크 모드 전환"
                >
                  <m.span
                    layout
                    className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
                    animate={{ x: darkMode ? 26 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* 시스템 자동 — prefers-color-scheme 따라감 */}
              <div className="flex items-center justify-between p-4 border-t border-border-light">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-base text-primary">🌓</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">시스템 설정 따르기</p>
                    <p className="text-xs text-muted-foreground">
                      OS 다크/라이트 모드에 자동으로 맞춰요
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDarkModeAuto(!darkModeAuto)}
                  className={cn(
                    'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
                    darkModeAuto ? 'bg-primary' : 'bg-muted',
                  )}
                  aria-label="시스템 다크 모드 자동 전환"
                >
                  <m.span
                    layout
                    className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
                    animate={{ x: darkModeAuto ? 26 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* 햅틱(진동) ON/OFF */}
              <div className="flex items-center justify-between p-4 border-t border-border-light">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-base text-primary">📳</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">진동 피드백</p>
                    <p className="text-xs text-muted-foreground">
                      정답·오답 시 짧게 진동 (지원 기기)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setHapticEnabled(!hapticEnabled)}
                  className={cn(
                    'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
                    hapticEnabled ? 'bg-primary' : 'bg-muted',
                  )}
                  aria-label="진동 피드백 전환"
                >
                  <m.span
                    layout
                    className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
                    animate={{ x: hapticEnabled ? 26 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Immersion 모드 — 모든 로마자 표시 숨김 */}
              <div className="flex items-center justify-between p-4 border-t border-border-light">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-base font-bold text-primary">あ</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Immersion 모드</p>
                    <p className="text-xs text-muted-foreground">
                      {immersionMode ? '한자·히라가나만 표시 (로마자 숨김)' : '한자 + 히라가나 + 로마자 모두 표시'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setImmersionMode(!immersionMode)}
                  className={cn(
                    'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
                    immersionMode ? 'bg-primary' : 'bg-muted',
                  )}
                  aria-label="Immersion 모드 전환"
                >
                  <m.span
                    layout
                    className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
                    animate={{ x: immersionMode ? 26 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 학습 목표 */}
        <GoalSettings />

        {/* 학습 문제 유형 + 캔버스 입력 */}
        <QuizSettings />

        {/* 마스코트 선택 */}
        <div>
          <p className="type-section mb-3 px-1">
            마스코트
          </p>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-3">학습 친구를 선택하세요</p>
              <div className="grid grid-cols-3 gap-3">
                {MASCOTS.map((mascot) => {
                  const isSelected = selectedMascotId === mascot.id
                  const isLocked = userLevel < mascot.unlockLevel
                  return (
                    <m.button
                      key={mascot.id}
                      whileTap={{ scale: isLocked ? 1 : 0.95 }}
                      onClick={() => {
                        if (isLocked) return
                        setMascot(mascot.id)
                      }}
                      disabled={isLocked}
                      title={isLocked ? `Lv.${mascot.unlockLevel} 달성 시 해금` : mascot.description}
                      className={cn(
                        'relative p-3 rounded-xl border-2 transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : isLocked
                            ? 'border-border cursor-not-allowed'
                            : 'border-border hover:border-foreground/30',
                      )}
                    >
                      <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-muted mb-2 flex items-center justify-center">
                        {mascot.image ? (
                          <img
                            src={mascot.image}
                            alt={mascot.nameKr}
                            className="w-full h-full object-cover"
                            // 잠금 상태: blur만 (opacity 없음, grayscale 없음 — 실루엣 분위기만)
                            style={isLocked ? { filter: 'blur(8px)' } : undefined}
                          />
                        ) : (
                          <span
                            style={{
                              fontSize: 38,
                              lineHeight: 1,
                              ...(isLocked ? { filter: 'blur(6px)' } : {}),
                            }}
                            role="img"
                          >
                            {mascot.emoji ?? '🐾'}
                          </span>
                        )}
                      </div>
                      <p
                        className={cn(
                          'text-sm font-medium text-center',
                          isSelected && 'text-primary',
                        )}
                      >
                        {isLocked ? '???' : mascot.nameKr}
                      </p>
                      <p className="text-[10px] text-muted-foreground text-center">
                        {isLocked ? `Lv.${mascot.unlockLevel} 해금` : mascot.name}
                      </p>
                      {isLocked && (
                        <div className="absolute inset-0 rounded-xl flex items-center justify-center pointer-events-none">
                          <span className="text-2xl">🔒</span>
                        </div>
                      )}
                      {isSelected && !isLocked && (
                        <m.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-xs">✓</span>
                        </m.div>
                      )}
                    </m.button>
                  )
                })}
              </div>

              {/* 뱃지함 진입 */}
              <button
                onClick={() => navigate('/settings/badges')}
                className="w-full mt-4 flex items-center justify-between px-3 py-3 rounded-xl border border-border hover:border-primary/30 transition-colors"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Award className="w-4 h-4 text-primary" />
                  뱃지함 — 획득한 뱃지 보기 & 선택
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>
        </div>

        {/* 색·폰트 테마 — UI Tone Board: 추천 3개 가로 카드 + 더 보기 토글 */}
        <div>
          <p className="type-section mb-3 px-1">
            테마
          </p>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2.5 px-1">
                <Palette className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground">
                  색·폰트 테마
                </p>
              </div>

              {/* 추천 3개 — 가로 라인 카드 */}
              <div className="space-y-1.5">
                {RECOMMENDED_THEME_IDS.map((id) => {
                  const theme = THEMES.find((t) => t.id === id)
                  if (!theme) return null
                  const isSelected = themeId === theme.id
                  return (
                    <m.button
                      key={theme.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTheme(theme.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-2.5 rounded-lg border-[1.5px] transition-all text-left',
                        isSelected
                          ? 'border-primary'
                          : 'border-border hover:border-foreground/30',
                      )}
                    >
                      {/* 큰 색 스와치 */}
                      <div
                        className="w-7 h-7 rounded-lg shrink-0"
                        style={{
                          background: theme.preview.accent,
                          boxShadow: isSelected
                            ? '0 0 0 2px var(--color-card), 0 0 0 4px var(--color-primary)'
                            : undefined,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-extrabold leading-tight">
                          {theme.name}
                        </p>
                        <p
                          className="text-[10px] leading-tight"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {THEME_RECOMMENDED_DESC[theme.id] ?? theme.nameJa}
                        </p>
                      </div>
                      {isSelected && (
                        <span
                          className="text-[10px] font-extrabold px-1.5 py-0.5 rounded"
                          style={{
                            background: 'var(--color-primary)',
                            color: 'var(--color-primary-foreground)',
                          }}
                        >
                          적용중
                        </span>
                      )}
                    </m.button>
                  )
                })}
              </div>

              {/* 3개 테마만 유지 — 추가 테마 없음 */}
            </CardContent>
          </Card>
        </div>

        {/* 홈 화면 레이아웃 */}
        <div>
          <p className="type-section mb-3 px-1">
            홈 화면
          </p>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2.5 px-1">
                <LayoutGrid className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground">
                  홈 레이아웃 — {HOME_LAYOUTS.length}종
                </p>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {HOME_LAYOUTS.map((layout) => {
                  const isSelected = homeLayoutId === layout.id
                  return (
                    <m.button
                      key={layout.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setHomeLayout(layout.id)}
                      className={cn(
                        'relative rounded-lg border-2 py-2 px-1.5 text-center transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-foreground/30',
                      )}
                    >
                      <p
                        className={cn(
                          'text-[11px] font-semibold truncate',
                          isSelected && 'text-primary',
                        )}
                      >
                        {layout.name}
                      </p>
                      {isSelected && (
                        <m.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-sm"
                        >
                          <span className="text-white text-[9px]">✓</span>
                        </m.div>
                      )}
                    </m.button>
                  )
                })}
              </div>
              <p
                className="text-[10px] mt-2 px-1"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                테마와 자유 조합 가능
              </p>
            </CardContent>
          </Card>
        </div>
      </m.div>

      <BottomNav />
    </div>
  )
}

// 학습 목표 설정 — 일일/주간
function GoalSettings() {
  const dailyGoal = useAppStore((s) => s.dailyGoal)
  const weeklyGoal = useAppStore((s) => s.weeklyGoal)
  const setDailyGoal = useAppStore((s) => s.setDailyGoal)
  const setWeeklyGoal = useAppStore((s) => s.setWeeklyGoal)

  return (
    <div>
      <p className="type-section mb-3 px-1">
        학습 목표
      </p>
      <Card>
        <CardContent className="p-4 space-y-5">
          <GoalRow
            icon={<Target className="w-4 h-4 text-primary" />}
            label="일일 학습"
            value={dailyGoal}
            min={5}
            max={100}
            step={5}
            unit="문제"
            onChange={setDailyGoal}
          />
          <GoalRow
            icon={<Sparkles className="w-4 h-4 text-primary" />}
            label="주간 세션"
            value={weeklyGoal}
            min={1}
            max={14}
            step={1}
            unit="회"
            onChange={setWeeklyGoal}
          />
        </CardContent>
      </Card>
    </div>
  )
}

// 학습 문제 유형 선택 + 한→일 캔버스 모드
function QuizSettings() {
  const enabledTypes = useAppStore((s) => s.enabledQuizTypes)
  const useCanvas = useAppStore((s) => s.useCanvasForReverse)
  const toggleType = useAppStore((s) => s.toggleQuizType)
  const setUseCanvas = useAppStore((s) => s.setUseCanvasForReverse)

  const types: { id: 'standard' | 'reverse' | 'listening'; label: string; desc: string }[] = [
    { id: 'standard', label: '일본어 → 한국어', desc: '독해. 일본어 보고 뜻 입력' },
    { id: 'reverse', label: '한국어 → 일본어', desc: '작문. 한국어 보고 일본어 쓰기' },
    { id: 'listening', label: '청해', desc: 'TTS 듣고 뜻 입력' },
  ]

  return (
    <div>
      <p className="type-section mb-3 px-1">
        학습 유형
      </p>
      <Card>
        <CardContent className="p-0 divide-y divide-border-light">
          {types.map((t) => {
            const active = enabledTypes.includes(t.id)
            const isLast = enabledTypes.length === 1 && active
            return (
              <div key={t.id} className="flex items-center justify-between p-4">
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-sm font-medium">{t.label}</p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {t.desc}
                  </p>
                </div>
                <button
                  onClick={() => toggleType(t.id)}
                  disabled={isLast}
                  className={cn(
                    'relative inline-flex h-7 w-12 items-center rounded-full transition-colors shrink-0',
                    active ? 'bg-primary' : 'bg-muted',
                    isLast && 'opacity-60 cursor-not-allowed',
                  )}
                  aria-label={`${t.label} 토글`}
                  aria-pressed={active}
                  title={isLast ? '최소 1개는 유지해야 해요' : undefined}
                >
                  <m.span
                    layout
                    className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
                    animate={{ x: active ? 26 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            )
          })}

          {/* 한→일 캔버스 입력 모드 */}
          {enabledTypes.includes('reverse') && (
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-base text-primary">✍️</span>
                </div>
                <div>
                  <p className="font-medium text-sm">한→일 손글씨 입력</p>
                  <p className="text-xs text-muted-foreground">
                    {useCanvas
                      ? '캔버스에 직접 일본어 손글씨'
                      : '키보드로 일본어 입력'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUseCanvas(!useCanvas)}
                className={cn(
                  'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
                  useCanvas ? 'bg-primary' : 'bg-muted',
                )}
                aria-label="한→일 손글씨 입력 전환"
                aria-pressed={useCanvas}
              >
                <m.span
                  layout
                  className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
                  animate={{ x: useCanvas ? 26 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function GoalRow({
  icon,
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (n: number) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <p className="text-sm font-medium">{label}</p>
        </div>
        <span className="text-sm font-bold font-mono">
          {value}
          <span className="text-[11px] ml-0.5 opacity-70">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
        aria-label={`${label} 목표`}
      />
    </div>
  )
}
