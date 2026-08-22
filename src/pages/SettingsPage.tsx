import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import {
  Volume2,
  LogOut,
  ChevronRight,
  Mic,
  Shield,
  HelpCircle,
  Bell,
  Settings,
  Sparkles,
  Award,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { BottomNav } from '@/components/BottomNav'
import { PageHeader } from '@/components/PageHeader'
import { ALL_BADGES } from '@/data/achievementBadges'
import type { AppState } from '@/store'
import { TTSButton } from '@/components/TTSButton'
import { useAppStore } from '@/store'
import { firebaseSignOut, isFirebaseConfigured } from '@/lib/firebase'
import { toast } from '@/lib/toast'
import { reportAuthError } from '@/lib/sentry'
import { useTTS } from '@/hooks/useTTS'
import { JAPANESE_VOICES, isMurfConfigured, isMurfTemporarilyDegraded } from '@/lib/murf'
import { cn } from '@/lib/utils'

const TTS_SPEED_OPTIONS = [
  { value: 0.5, label: '느리게', description: '초보자용' },
  { value: 0.75, label: '조금 느리게', description: '학습용' },
  { value: 0.9, label: '보통', description: '기본값' },
  { value: 1.0, label: '빠르게', description: '숙련자용' },
] as const

const TTS_PROVIDER_OPTIONS = [
  { value: 'browser' as const, label: '기본 음성', description: '브라우저 내장 TTS' },
  { value: 'murf' as const, label: 'Murf.ai', description: '자연스러운 AI 음성' },
]

export function SettingsPage() {
  const navigate = useNavigate()
  const {
    user,
    ttsRate,
    setTTSRate,
    ttsProvider,
    setTTSProvider,
    murfVoiceId,
    setMurfVoiceId,
    logout,
  } = useAppStore()

  const { isSupported, provider: activeProvider } = useTTS({ rate: ttsRate })

  // 획득 뱃지 카운트 — "내 배지 4/11" 표시용
  const fullState = useAppStore() as AppState
  const earnedBadgesCount = ALL_BADGES.filter((b) => b.isEarned(fullState)).length
  const totalBadgesCount = ALL_BADGES.length

  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      if (isFirebaseConfigured()) {
        await firebaseSignOut()
      }
      logout()
      navigate('/login')
    } catch (error) {
      console.error('로그아웃 실패:', error)
      reportAuthError(error, { operation: 'signout' })
      toast.error({ message: '로그아웃에 실패했어요. 다시 시도해 주세요.' })
    } finally {
      setIsLoggingOut(false)
      setShowLogoutDialog(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader title="설정" subtitle="앱 환경 설정" icon={Settings} />

      <m.div
        className="px-5 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* 프로필 섹션 */}
        <Card>
          <CardContent className="p-0">
            <button
              className="w-full flex items-center gap-4 p-5"
              onClick={() => navigate('/profile')}
            >
              {/* 프로필 이미지 */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 p-0.5">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-2xl overflow-hidden">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.nickname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">🌸</span>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0 text-left">
                <p className="text-lg font-semibold truncate">
                  {user?.nickname || '학습자'}
                  <span className="text-sm font-medium text-muted-foreground ml-0.5">
                    님
                  </span>
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {user?.email || '프로필 편집'}
                </p>
              </div>

              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>

        {/* 일반 설정 */}
        <div>
          <p className="type-section mb-3 px-1">
            일반
          </p>
          <Card>
            <CardContent className="p-0 divide-y divide-border-light">
              {/* 테마 설정 — 마스코트, 색·폰트, 홈 레이아웃, 다크 모드 통합 */}
              <button
                onClick={() => navigate('/settings/appearance')}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">테마 설정</p>
                    <p className="text-xs text-muted-foreground">
                      마스코트 · 색상 · 홈 레이아웃 · 다크 모드
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* 알림 */}
              <button
                onClick={() => navigate('/settings/notifications')}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-medium text-sm">알림 설정</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* 내 배지 — UI Tone Board 반영 */}
              <button
                onClick={() => navigate('/settings/badges')}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-medium text-sm">내 배지</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    {earnedBadgesCount} / {totalBadgesCount}
                  </span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* 음성 설정 */}
        {isSupported && (
          <div>
            <p className="type-section mb-3 px-1">
              음성
            </p>
            <Card>
              <CardContent className="p-4 space-y-5">
                {/* TTS 제공자 선택 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                      <p className="type-body font-semibold">음성 엔진</p>
                    </div>
                    {/* 현재 실제 작동 중인 provider 노출 — 선택과 실제가 다르면 즉시 확인 가능 */}
                    <span
                      className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full font-medium',
                        activeProvider === 'murf'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground',
                      )}
                      title={
                        ttsProvider === 'murf' && activeProvider === 'browser'
                          ? 'Murf 선택했지만 API 키 미설정 또는 호출 실패 — 브라우저 TTS로 폴백 중'
                          : ''
                      }
                    >
                      현재: {activeProvider === 'murf' ? 'Murf.ai' : '브라우저'}
                    </span>
                  </div>
                  {ttsProvider === 'murf' && activeProvider === 'browser' && (
                    <p className="text-[11px] text-destructive">
                      {isMurfTemporarilyDegraded() ? (
                        <>
                          Murf 호출이 연속 실패해 일시적으로 브라우저 TTS로 전환됐어요. 5분 후 자동 재시도.
                          무료 트라이얼 한도(<a
                            className="underline"
                            href="https://murf.ai/api/dashboard"
                            target="_blank"
                            rel="noreferrer"
                          >Murf 대시보드</a>)도 같이 확인해 주세요.
                        </>
                      ) : (
                        <>
                          Murf를 선택했지만 API 키가 없거나 호출에 실패해 브라우저 TTS로 동작 중이에요.{' '}
                          <code className="ml-1 px-1 bg-muted rounded">VITE_MURF_API_KEY</code> 확인 후 dev server 재시작이 필요해요.
                        </>
                      )}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    {TTS_PROVIDER_OPTIONS.map((option) => {
                      const isDisabled = option.value === 'murf' && !isMurfConfigured()
                      const isSelected = ttsProvider === option.value
                      return (
                        <m.button
                          key={option.value}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => !isDisabled && setTTSProvider(option.value)}
                          disabled={isDisabled}
                          className={cn(
                            "p-3 rounded-xl border-2 text-left transition-all",
                            isDisabled && "opacity-50 cursor-not-allowed",
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-foreground/30"
                          )}
                        >
                          <p className={cn(
                            "type-body font-semibold",
                            isSelected && "text-primary"
                          )}>{option.label}</p>
                          <p className="type-caption">
                            {isDisabled ? 'API 키 필요' : option.description}
                          </p>
                        </m.button>
                      )
                    })}
                  </div>
                </div>

                {/* Murf 음성 선택 */}
                {ttsProvider === 'murf' && isMurfConfigured() && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-muted-foreground" />
                      <p className="type-body font-semibold">일본어 음성</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {JAPANESE_VOICES.map((voice) => {
                        const isSelected = murfVoiceId === voice.voiceId
                        return (
                          <m.button
                            key={voice.voiceId}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMurfVoiceId(voice.voiceId)}
                            className={cn(
                              "p-3 rounded-xl border-2 text-center transition-all",
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-foreground/30"
                            )}
                          >
                            <div className="text-2xl mb-1">{voice.avatar}</div>
                            <p className={cn(
                              "type-body font-semibold",
                              isSelected && "text-primary"
                            )}>{voice.name}</p>
                            <p className="type-caption leading-tight mt-0.5">
                              {voice.description.replace(/\s*(여성|남성)\s*$/, '')}
                            </p>
                            <span
                              className="inline-block mt-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                              style={{
                                background: 'var(--color-muted)',
                                color: 'var(--color-text-secondary)',
                              }}
                            >
                              {voice.gender === 'female' ? '여성' : '남성'}
                            </span>
                          </m.button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 발음 속도 (브라우저 TTS만) */}
                {ttsProvider === 'browser' && (
                  <div className="space-y-3">
                    <p className="type-body font-semibold">발음 속도</p>
                    <div className="grid grid-cols-4 gap-2">
                      {TTS_SPEED_OPTIONS.map((option) => {
                        const isSelected = ttsRate === option.value
                        return (
                          <m.button
                            key={option.value}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setTTSRate(option.value)}
                            className={cn(
                              "py-2 px-3 rounded-xl border-2 text-center transition-all",
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-foreground/30"
                            )}
                          >
                            <p className={cn(
                              "type-caption font-semibold",
                              isSelected && "text-primary"
                            )}>{option.label}</p>
                          </m.button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 테스트 버튼 */}
                <TTSButton
                  text="こんにちは、日本語を勉強しましょう"
                  label="음성 테스트"
                  variant="outline"
                  className="w-full h-11"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* 지원 */}
        <div>
          <p className="type-section mb-3 px-1">
            지원
          </p>
          <Card>
            <CardContent className="p-0 divide-y divide-border-light">
              <button
                onClick={() => navigate('/terms')}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-medium text-sm">이용약관</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              <button
                onClick={() => navigate('/privacy')}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-medium text-sm">개인정보 처리방침</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              <a
                href="mailto:ym05200@naver.com?subject=%5B%EB%8B%88%ED%98%BC%EA%B3%A0%20%EC%95%B1%5D%20%EB%AC%B8%EC%9D%98"
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">문의하기</p>
                    <p className="text-xs text-muted-foreground">ym05200@naver.com</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </a>
            </CardContent>
          </Card>
        </div>

        {/* 계정 */}
        <div>
          <p className="type-section mb-3 px-1">
            계정
          </p>
          <Card>
            <CardContent className="p-0">
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-destructive" />
                  </div>
                  <p className="font-medium text-sm text-destructive">로그아웃</p>
                </div>
              </button>
            </CardContent>
          </Card>
          <p className="text-[11px] text-muted-foreground mt-2 px-1">
            데이터 초기화·계정 탈퇴는 마이페이지에서 진행할 수 있어요
          </p>
        </div>

        {/* 앱 정보 */}
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">니혼고 앱</p>
          <p className="text-xs text-muted-foreground mt-1">버전 1.0.0</p>
        </div>
      </m.div>

      {/* 로그아웃 확인 다이얼로그 */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="w-[calc(100vw-32px)] max-w-[320px]">
          <DialogHeader>
            <DialogTitle className="text-center">로그아웃</DialogTitle>
            <DialogDescription className="text-center">
              정말 로그아웃 하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1 h-11"
              onClick={() => setShowLogoutDialog(false)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              className="flex-1 h-11"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  )
}
