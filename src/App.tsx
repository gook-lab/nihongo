import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

// Critical (첫 진입): splash/login/home — 정적 import 유지로 빠른 첫 페인트
import { SplashPage } from '@/pages/SplashPage'
import { LoginPage } from '@/pages/LoginPage'
import { HomePage } from '@/pages/HomePage'

// 나머지는 lazy — 초기 번들 줄이고 진입 시점에만 로드
const LearningPage = lazy(() => import('@/pages/LearningPage').then(m => ({ default: m.LearningPage })))
const ResultPage = lazy(() => import('@/pages/ResultPage').then(m => ({ default: m.ResultPage })))
const DictionaryPage = lazy(() => import('@/pages/DictionaryPage').then(m => ({ default: m.DictionaryPage })))
const StatisticsPage = lazy(() => import('@/pages/StatisticsPage').then(m => ({ default: m.StatisticsPage })))
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })))
const WrongWordsPage = lazy(() => import('@/pages/WrongWordsPage').then(m => ({ default: m.WrongWordsPage })))
const KanaChartPage = lazy(() => import('@/pages/KanaChartPage').then(m => ({ default: m.KanaChartPage })))
const KanaGamePage = lazy(() => import('@/pages/KanaGamePage').then(m => ({ default: m.KanaGamePage })))
const KanjiPage = lazy(() => import('@/pages/KanjiPage').then(m => ({ default: m.KanjiPage })))
const ReadingPage = lazy(() => import('@/pages/ReadingPage').then(m => ({ default: m.ReadingPage })))
const ReadingDetailPage = lazy(() => import('@/pages/ReadingDetailPage').then(m => ({ default: m.ReadingDetailPage })))
const AIReadingPage = lazy(() => import('@/pages/AIReadingPage').then(m => ({ default: m.AIReadingPage })))
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })))
const TermsPage = lazy(() => import('@/pages/LegalPages').then(m => ({ default: m.TermsPage })))
const PrivacyPage = lazy(() => import('@/pages/LegalPages').then(m => ({ default: m.PrivacyPage })))
const AccountDeletePage = lazy(() => import('@/pages/AccountDeletePage').then(m => ({ default: m.AccountDeletePage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })))
const NotificationSettingsPage = lazy(() => import('@/pages/NotificationSettingsPage').then(m => ({ default: m.NotificationSettingsPage })))
const AppearancePage = lazy(() => import('@/pages/AppearancePage').then(m => ({ default: m.AppearancePage })))
const GoalPage = lazy(() => import('@/pages/OnboardingPages').then(m => ({ default: m.GoalPage })))
const ReadyPage = lazy(() => import('@/pages/OnboardingPages').then(m => ({ default: m.ReadyPage })))
const NetworkErrorPage = lazy(() => import('@/pages/ErrorScreens').then(m => ({ default: m.NetworkErrorPage })))
const ServerErrorPage = lazy(() => import('@/pages/ErrorScreens').then(m => ({ default: m.ServerErrorPage })))
const PermissionErrorPage = lazy(() => import('@/pages/ErrorScreens').then(m => ({ default: m.PermissionErrorPage })))
const MaintenancePage = lazy(() => import('@/pages/ErrorScreens').then(m => ({ default: m.MaintenancePage })))
const UpdateRequiredPage = lazy(() => import('@/pages/ErrorScreens').then(m => ({ default: m.UpdateRequiredPage })))
const SongsPage = lazy(() => import('@/pages/SongsPage').then(m => ({ default: m.SongsPage })))
const SongDetailPage = lazy(() => import('@/pages/SongDetailPage').then(m => ({ default: m.SongDetailPage })))
const ConversationPage = lazy(() => import('@/pages/ConversationPage').then(m => ({ default: m.ConversationPage })))
const AIConversationPage = lazy(() => import('@/pages/AIConversationPage').then(m => ({ default: m.AIConversationPage })))
const BadgeCollectionPage = lazy(() => import('@/pages/BadgeCollectionPage').then(m => ({ default: m.BadgeCollectionPage })))
const ConversationDetailPage = lazy(() => import('@/pages/ConversationDetailPage').then(m => ({ default: m.ConversationDetailPage })))
const ConversationMemoPage = lazy(() => import('@/pages/ConversationMemoPage').then(m => ({ default: m.ConversationMemoPage })))
const ConversationQuizPage = lazy(() => import('@/pages/ConversationQuizPage').then(m => ({ default: m.ConversationQuizPage })))
const WritingPage = lazy(() => import('@/pages/WritingPage').then(m => ({ default: m.WritingPage })))
const MockTestEntryPage = lazy(() => import('@/pages/MockTestPage').then(m => ({ default: m.MockTestEntryPage })))
const MockTestPage = lazy(() => import('@/pages/MockTestPage').then(m => ({ default: m.MockTestPage })))
const DialoguePage = lazy(() => import('@/pages/DialoguePage').then(m => ({ default: m.DialoguePage })))
const DialogueDetailPage = lazy(() => import('@/pages/DialogueDetailPage').then(m => ({ default: m.DialogueDetailPage })))
const GrammarPage = lazy(() => import('@/pages/GrammarPage').then(m => ({ default: m.GrammarPage })))
const IdiomsPage = lazy(() => import('@/pages/IdiomsPage').then(m => ({ default: m.IdiomsPage })))
const KanjiPracticePage = lazy(() => import('@/pages/KanjiPracticePage').then(m => ({ default: m.KanjiPracticePage })))
const KanaPracticePage = lazy(() => import('@/pages/KanaPracticePage').then(m => ({ default: m.KanaPracticePage })))

import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'
import { QuickDictSearchProvider } from '@/components/QuickDictSearch'
import { SWUpdatePrompt } from '@/components/SWUpdatePrompt'
import { AuthGuard, GuestGuard } from '@/components/AuthGuard'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { OnlineStatusToast } from '@/components/OnlineStatusToast'
import { Spinner } from '@/components/Spinner'
import { MotionConfig, LazyMotion } from 'framer-motion'

// framer-motion features를 lazy chunk로 분리 — 첫 진입 vendor-motion 평가 시간 절감.
// strict 모드는 motion.* 미허용하지만 우리는 m.*도 같이 쓰므로 strict 끔.
// domAnimation(40KB) — animate/initial/exit/whileTap 등 핵심 기능. 충분.
const loadMotionFeatures = () =>
  import('framer-motion').then((mod) => mod.domAnimation)
import { Toaster } from 'react-hot-toast'
import { useAppStore } from '@/store'
import {
  onAuthChange,
  firebaseUserToAppUser,
  isFirebaseConfigured,
} from '@/lib/firebase'
import { applyTheme } from '@/lib/themes'
import { setSentryUser } from '@/lib/sentry'
import { useFirestoreSync } from '@/hooks/useFirestoreSync'
import { loadPreferences, scheduleNext, getNotificationPermission, cancelScheduled } from '@/lib/notifications'

// 라우트 변경 시 스크롤 최상단으로 이동
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  const { login, logout, isAuthenticated, darkMode, themeId, immersionMode } = useAppStore()
  const darkModeAuto = useAppStore((s) => s.darkModeAuto)
  const setDarkMode = useAppStore((s) => s.setDarkMode)
  const lastStudyDate = useAppStore((s) => s.lastStudyDate)

  // 다크모드 auto — prefers-color-scheme 변경 감지하여 darkMode 자동 토글
  useEffect(() => {
    if (!darkModeAuto || typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      // auto일 때만 시스템 값 따라감. setDarkMode가 auto를 끄지 않도록 직접 darkMode만 토글
      if (useAppStore.getState().darkModeAuto) {
        useAppStore.setState({ darkMode: e.matches })
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [darkModeAuto, setDarkMode])

  // Firestore ↔ store 동기화 (Firebase 설정된 경우만 작동, 로그인 자동 감지)
  useFirestoreSync()

  // 알림 schedule: 권한 + preferences 따라 다음 알림 예약
  useEffect(() => {
    if (getNotificationPermission() === 'granted') {
      const prefs = loadPreferences()
      scheduleNext(prefs, lastStudyDate)
    }
    return () => cancelScheduled()
  }, [lastStudyDate])

  // 마스코트·sprite·loading 등 루프 애니메이션을 첫 진입 후 60초만 활성.
  // 그 이후엔 body.motion-paused 클래스로 모든 CSS animation 정지 (멀미 방지).
  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add('motion-paused')
    }, 60_000)
    return () => clearTimeout(timer)
  }, [])

  // 다크 모드 클래스 + 테마 토큰을 한 곳에서 일괄 적용 (cascade 충돌 방지)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    applyTheme(themeId, darkMode)
  }, [darkMode, themeId])

  // Immersion mode — body 클래스로 토글 (CSS가 .romaji 요소 일괄 숨김)
  useEffect(() => {
    if (immersionMode) {
      document.body.classList.add('immersion')
    } else {
      document.body.classList.remove('immersion')
    }
  }, [immersionMode])

  // Firebase 인증 상태 감시 (Firebase가 설정된 경우에만)
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      return
    }

    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        const providerId = firebaseUser.providerData[0]?.providerId || ''
        let provider: 'google' | 'kakao' | 'naver' | 'email' = 'google'

        if (providerId === 'password') provider = 'email'
        else if (providerId.includes('kakao')) provider = 'kakao'
        else if (providerId.includes('naver')) provider = 'naver'

        const user = firebaseUserToAppUser(firebaseUser, provider)
        login(user)
        setSentryUser({ id: firebaseUser.uid, email: firebaseUser.email ?? undefined })
      } else if (isAuthenticated) {
        logout()
        setSentryUser(null)
      }
    })

    return () => unsubscribe()
  }, [login, logout, isAuthenticated])

  return (
    <ErrorBoundary boundaryName="root">
      {/* framer-motion 글로벌 — 시스템 "동작 줄이기" 켠 사용자 motion 즉시 점프.
          CSS와 별도로 1분 후 자동 정지는 useEffect에서 body.motion-paused 토글. */}
      <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures}>
      <BrowserRouter>
        <ScrollToTop />
        <OnlineStatusToast />
        <PWAInstallPrompt />
        <SWUpdatePrompt />
        <QuickDictSearchProvider />
        <Toaster
          position="bottom-center"
          containerStyle={{ bottom: 100 }}
          toastOptions={{ duration: 2400 }}
        />
        {/* 모든 페이지를 main 랜드마크로 감쌈 — Lighthouse 접근성 (스크린 리더 탐색).
            기존 LearningPage의 내부 <main>도 nested지만 페이지마다 다른 시맨틱 영역이라 OK. */}
        <main>
        <Suspense fallback={<PageLoader />}>
        <Routes>
        {/* ── 공개 라우트 (인증 불필요) ─────────────────────── */}
        {/* 스플래시 (첫 진입) */}
        <Route path="/splash" element={<SplashPage />} />
        {/* 약관/개인정보는 누구나 열람 가능 — 로그인 전에도 동의 절차 등에서 필요 */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* 에러 페이지 (인증 불필요, 시스템 에러 시 또는 직접 진입 가능) */}
        <Route path="/error/network" element={<NetworkErrorPage />} />
        <Route path="/error/server" element={<ServerErrorPage />} />
        <Route path="/error/permission" element={<PermissionErrorPage />} />
        <Route path="/error/maintenance" element={<MaintenancePage />} />
        <Route path="/error/update" element={<UpdateRequiredPage />} />

        {/* ── 게스트 전용 (이미 로그인 상태면 returnTo 또는 홈) ─ */}
        <Route element={<GuestGuard />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* ── 게스트 허용 라우트 (둘러보기 가능) ─────────── */}
        <Route element={<AuthGuard allowGuest />}>
          {/* 메인 탭 — 게스트도 둘러볼 수 있음 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/conversation" element={<ConversationPage />} />
          <Route path="/conversation/:categoryId" element={<ConversationDetailPage />} />
          <Route path="/kana" element={<KanaChartPage />} />
        </Route>

        {/* ── 인증 필요 라우트 (AuthGuard로 그룹화) ─────────── */}
        <Route element={<AuthGuard />}>
          <Route path="/conversation/ai" element={<AIConversationPage />} />
          <Route path="/conversation/memo" element={<ConversationMemoPage />} />
          <Route path="/conversation/:categoryId/quiz" element={<ConversationQuizPage />} />
          <Route path="/stats" element={<StatisticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* 학습 — 진행 상황 저장 위해 로그인 필요 */}
          <Route path="/learn" element={<LearningPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/wrong-words" element={<WrongWordsPage />} />
          <Route path="/kana-game" element={<KanaGamePage />} />
          <Route path="/kanji" element={<KanjiPage />} />
          <Route path="/kanji/practice" element={<KanjiPracticePage />} />
          <Route path="/kana/practice" element={<KanaPracticePage />} />
          <Route path="/grammar" element={<GrammarPage />} />
          <Route path="/idioms" element={<IdiomsPage />} />

          {/* 콘텐츠 */}
          <Route path="/reading" element={<ReadingPage />} />
          <Route path="/reading/ai" element={<AIReadingPage />} />
          <Route path="/reading/:id" element={<ReadingDetailPage />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/songs/:id" element={<SongDetailPage />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/mock" element={<MockTestEntryPage />} />
          <Route path="/mock/:level" element={<MockTestPage />} />
          <Route path="/dialogue" element={<DialoguePage />} />
          <Route path="/dialogue/:id" element={<DialogueDetailPage />} />

          {/* 계정 */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account/delete" element={<AccountDeletePage />} />
          <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
          <Route path="/settings/appearance" element={<AppearancePage />} />
          <Route path="/settings/badges" element={<BadgeCollectionPage />} />

          {/* 온보딩 */}
          <Route path="/onboarding/goal" element={<GoalPage />} />
          <Route path="/onboarding/ready" element={<ReadyPage />} />
        </Route>

        {/* 404 — 친근한 페이지 (인증 가드 밖에서 표시) */}
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
        </main>
      </BrowserRouter>
      </LazyMotion>
      </MotionConfig>
    </ErrorBoundary>
  )
}

// 페이지 lazy 로딩 중 fallback — 단순 ring 스피너 (페이지 청크는 보통 짧게 끝남)
function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-background)' }}
      aria-label="페이지 불러오는 중"
    >
      <Spinner variant="ring" size={40} />
    </div>
  )
}

export default App
