import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  User,
  Session,
  Word,
  SavedConversationWord,
  FavoritePhrase,
  WordSrsState,
  DailyMission,
  HomeLayoutId,
} from './types'
import { toggleInArray } from './lib/utils'
import type { ReadingPiece } from './data/reading'
import { calculateLevel, XP_RULES } from './constants'
import { reviewSrs } from './lib/srs'
import { generateDailyMissions, updateMissionProgress, todayKey } from './lib/missions'
import { type ThemeId, DEFAULT_THEME_ID, migrateThemeId } from './lib/themes'

// 저장된 학습 세션 타입
export interface SavedLearningState {
  session: Session
  // 단어 객체가 아닌 id만 저장 — 복원 시 현재 데이터에서 다시 조회한다.
  // (단어 데이터 수정이 이어하기 세션에도 반영되도록)
  wordIds: string[]
  savedAt: number // timestamp
}

// 일별 학습 기록 타입
export interface DailyRecord {
  date: string // YYYY-MM-DD
  studyCount: number // 학습 세션 수
  correctCount: number // 맞춘 문제 수
  totalCount: number // 전체 문제 수
  xpEarned: number // 획득한 XP
  wrongWordIds: string[] // 그날 틀린 단어 IDs
  /** 24슬롯 학습 시간대 카운트 (인덱스 = hour 0~23). 세션 완료 시 ++. */
  hourCounts?: number[]
}

export interface AppState {
  // === Auth ===
  user: User | null
  isAuthenticated: boolean

  // === Progress (persisted) ===
  xp: number
  level: number
  streak: number
  lastStudyDate: string | null
  wrongWordIds: string[]
  dailyRecords: Record<string, DailyRecord> // 일별 학습 기록

  // === Settings (persisted) ===
  ttsRate: number
  darkMode: boolean
  /** 다크모드를 시스템 (prefers-color-scheme) 기준으로 자동 토글할지. true면 darkMode가 시스템 따라감. */
  darkModeAuto: boolean
  /** 햅틱 피드백(진동) 사용 여부 — 기본 true */
  hapticEnabled: boolean
  /** 일일 학습 목표 (문제 수) — 기본 20 */
  dailyGoal: number
  /** 주간 학습 목표 (세션 수) — 기본 5 */
  weeklyGoal: number
  /** 학습 문제 유형 — 비어있으면 standard만 적용. 최소 1개 보장. */
  enabledQuizTypes: ('standard' | 'reverse' | 'listening')[]
  /** 한국어 → 일본어 문제에서 키보드 입력 대신 손글씨 캔버스 사용 */
  useCanvasForReverse: boolean
  /** 게스트(데모) 모드 — 로그인 없이 일부 페이지 둘러보기. 학습 진행 시 로그인 권유. */
  isGuest: boolean
  /** 마스코트 인트로 투어를 본 적 있는지 — 로그인 후 첫 홈 진입 시 한 번만 표시 */
  hasSeenIntroTour: boolean
  /** 첫 학습 세션 완료 여부 — ResultPage에서 특별 축하 모달 트리거 */
  hasCompletedFirstSession: boolean
  /** JLPT 모의고사 응시 기록 — level별 [{score, date, passed}] */
  mockTestHistory: Array<{
    level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
    score: number
    passed: boolean
    date: string // ISO
  }>
  ttsProvider: 'browser' | 'murf'
  murfVoiceId: string
  selectedMascotId: string
  /** 뱃지함에서 사용자가 프로필에 표시하기로 선택한 뱃지 ID들 (최대 3개) */
  selectedBadgeIds: string[]
  themeId: ThemeId
  homeLayoutId: HomeLayoutId
  // Immersion mode — true면 모든 화면에서 로마자 표시 숨김 (한자/히라가나만 노출)
  immersionMode: boolean

  // === Session ===
  currentSession: Session | null
  isLoading: boolean
  error: string | null

  // === Saved Learning (persisted) ===
  savedLearning: SavedLearningState | null

  // === Conversation Memo (persisted) ===
  conversationMemo: SavedConversationWord[]

  // === SRS (persisted) ===
  wordSrs: Record<string, WordSrsState>

  // === Daily Missions (persisted) ===
  dailyMissions: DailyMission[]
  missionsGeneratedAt: string | null

  // === Streak rewards (persisted) ===
  claimedStreakMilestones: number[] // [3, 7, 14, ...]

  // === Kanji favorites (persisted) ===
  favoriteKanji: string[]

  // === Word favorites (사전, persisted) ===
  favoriteWords: string[]

  // === Phrase favorites — "내 여행 키트" (persisted) ===
  favoritePhrases: FavoritePhrase[]

  // === Conversation progress (카테고리별 본 표현 id, persisted) ===
  conversationProgress: Record<string, string[]>

  // === Onboarding completion timestamp (persisted) ===
  // null이면 미완료 → SplashPage가 신규 사용자를 온보딩으로 보냄
  onboardingCompletedAt: number | null

  // === AI-generated reading stories (persisted) ===
  aiReadings: ReadingPiece[]

  // === Actions ===
  // Auth
  login: (user: User) => void
  logout: () => void

  // Learning
  startSession: () => void
  submitAnswer: (wordId: string, isCorrect: boolean) => void
  completeSession: () => { score: number; xpEarned: number; leveledUp: boolean; newLevel: number }
  resetSession: () => void
  saveLearning: (words: Word[]) => void
  resumeLearning: () => { session: Session; wordIds: string[] } | null
  clearSavedLearning: () => void

  // Progress
  addXP: (amount: number) => void
  updateStreak: () => void
  addWrongWord: (wordId: string) => void
  removeWrongWord: (wordId: string) => void
  getDailyRecord: (date: string) => DailyRecord | null

  // Conversation Memo
  addConversationMemo: (word: SavedConversationWord) => void
  removeConversationMemo: (wordText: string) => void

  // Settings
  setTTSRate: (rate: number) => void
  setDarkMode: (enabled: boolean) => void
  setDarkModeAuto: (enabled: boolean) => void
  setHapticEnabled: (enabled: boolean) => void
  setDailyGoal: (n: number) => void
  setWeeklyGoal: (n: number) => void
  toggleQuizType: (type: 'standard' | 'reverse' | 'listening') => void
  setUseCanvasForReverse: (enabled: boolean) => void
  startGuestMode: () => void
  exitGuestMode: () => void
  markIntroTourSeen: () => void
  markFirstSessionComplete: () => void
  recordMockTest: (entry: { level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'; score: number; passed: boolean }) => void
  setTTSProvider: (provider: 'browser' | 'murf') => void
  setMurfVoiceId: (voiceId: string) => void
  setMascot: (mascotId: string) => void
  toggleBadge: (badgeId: string) => void
  setTheme: (themeId: ThemeId) => void
  setHomeLayout: (id: HomeLayoutId) => void
  setImmersionMode: (enabled: boolean) => void

  // SRS
  recordSrsReview: (wordId: string, isCorrect: boolean) => void
  getDueWordIds: () => string[]

  // Daily missions
  ensureTodaysMissions: () => void
  bumpMissionProgress: (type: DailyMission['type'], delta?: number) => DailyMission[]

  // Streak rewards
  unclaimedStreakMilestone: () => number | null
  claimStreakMilestone: (days: number) => void

  // Kanji favorites
  toggleFavoriteKanji: (kanji: string) => void

  // Word favorites
  toggleFavoriteWord: (wordId: string) => void

  // Phrase favorites (여행 키트)
  toggleFavoritePhrase: (phraseId: string, categoryId: string) => void

  // Conversation progress
  markConversationViewed: (categoryId: string, phraseId: string) => void
  getConversationProgress: (categoryId: string) => number

  // Onboarding
  completeOnboarding: () => void

  // AI readings
  saveAiReading: (piece: ReadingPiece) => void
  removeAiReading: (id: string) => void
  getAiReadingById: (id: string) => ReadingPiece | undefined
}

// ── localStorage 용량 관리 ──────────────────────────────────
// const는 hoist되지 않음 → store 생성보다 위에 둬야 onRehydrateStorage
// 콜백이 module 평가 도중 실행돼도 TDZ 회피
const PRUNE_DAILY_DAYS = 400 // 약 1년 + 한 달 buffer

function pruneOldLocalData(state: AppState): void {
  const now = Date.now()
  const cutoffMs = now - PRUNE_DAILY_DAYS * 24 * 60 * 60 * 1000
  const cutoffDate = new Date(cutoffMs).toISOString().split('T')[0]
  let removedCount = 0
  const pruned: Record<string, DailyRecord> = {}
  for (const [date, rec] of Object.entries(state.dailyRecords ?? {}) as Array<[string, DailyRecord]>) {
    if (date >= cutoffDate) {
      pruned[date] = rec
    } else {
      removedCount += 1
    }
  }
  if (removedCount > 0) {
    state.dailyRecords = pruned
    if (import.meta.env.DEV) {
      console.info(
        `[store] 오래된 dailyRecords ${removedCount}개 정리 (${PRUNE_DAILY_DAYS}일 이전, ${cutoffDate} 기준)`,
      )
    }
  }
  if (state.aiReadings && state.aiReadings.length > 50) {
    state.aiReadings = state.aiReadings.slice(0, 50)
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      xp: 0,
      level: 1,
      streak: 0,
      lastStudyDate: null,
      wrongWordIds: [],
      dailyRecords: {},
      ttsRate: 0.9,
      darkMode: false,
      darkModeAuto: false,
      hapticEnabled: true,
      dailyGoal: 20,
      weeklyGoal: 5,
      enabledQuizTypes: ['standard', 'reverse', 'listening'],
      useCanvasForReverse: true,
      isGuest: false,
      hasSeenIntroTour: false,
      hasCompletedFirstSession: false,
      mockTestHistory: [],
      ttsProvider: 'browser',
      murfVoiceId: 'ja-JP-kimi',
      selectedMascotId: 'kotaro',
      selectedBadgeIds: [],
      themeId: DEFAULT_THEME_ID,
      homeLayoutId: 'auto',
      immersionMode: false,
      currentSession: null,
      isLoading: false,
      error: null,
      savedLearning: null,
      conversationMemo: [],
      wordSrs: {},
      dailyMissions: [],
      missionsGeneratedAt: null,
      claimedStreakMilestones: [],
      favoriteKanji: [],
      favoriteWords: [],
      favoritePhrases: [],
      conversationProgress: {},
      aiReadings: [],
      onboardingCompletedAt: null,

      // Auth actions
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () =>
        // 사용자별 격리: 학습 데이터/세션을 모두 초기화 (다음 로그인 시 Firestore에서 hydrate)
        // 디바이스 선호(테마/마스코트/TTS/darkMode/homeLayout)는 유지 — 디바이스별 설정 성격
        set({
          user: null,
          isAuthenticated: false,
          // 학습 진행
          xp: 0,
          level: 1,
          streak: 0,
          lastStudyDate: null,
          wrongWordIds: [],
          dailyRecords: {},
          // SRS
          wordSrs: {},
          // 미션/보상
          dailyMissions: [],
          missionsGeneratedAt: null,
          claimedStreakMilestones: [],
          // 라이브러리
          conversationMemo: [],
          aiReadings: [],
          favoriteKanji: [],
          favoriteWords: [],
          favoritePhrases: [],
          // 온보딩
          onboardingCompletedAt: null,
          // 세션
          savedLearning: null,
          currentSession: null,
        }),

      // Learning actions
      startSession: () =>
        set({
          currentSession: { questionIndex: 0, correctCount: 0, answers: [] },
        }),

      submitAnswer: (wordId, isCorrect) => {
        set((state) => ({
          currentSession: state.currentSession
            ? {
                ...state.currentSession,
                questionIndex: state.currentSession.questionIndex + 1,
                correctCount:
                  state.currentSession.correctCount + (isCorrect ? 1 : 0),
                answers: [
                  ...state.currentSession.answers,
                  { wordId, correct: isCorrect },
                ],
              }
            : null,
        }))
        // 오답 시 자동으로 오답노트에 추가하지 않음 - 사용자 선택에 맡김
      },

      completeSession: () => {
        const session = get().currentSession
        if (!session) return { score: 0, xpEarned: 0, leveledUp: false, newLevel: 1 }

        const score = Math.round((session.correctCount / 20) * 100)
        const xpEarned = session.correctCount * XP_RULES.CORRECT_ANSWER

        const oldLevel = get().level
        get().addXP(xpEarned)
        get().updateStreak()
        const newLevel = get().level
        const leveledUp = newLevel > oldLevel

        // 일별 학습 기록 저장 — 로컬 타임존 기준 (KST 자정 단위로 일별 분리)
        const today = todayKey()
        const wrongIds = session.answers
          .filter((a) => !a.correct)
          .map((a) => a.wordId)

        // 현재 시간대 (0~23) — 시간대 패턴 분석용
        const currentHour = new Date().getHours()

        set((state) => {
          const existingRecord = state.dailyRecords[today]
          const baseHourCounts = existingRecord?.hourCounts
            ? [...existingRecord.hourCounts]
            : new Array(24).fill(0)
          // 모자라거나 넘으면 24슬롯으로 정규화
          while (baseHourCounts.length < 24) baseHourCounts.push(0)
          baseHourCounts[currentHour] = (baseHourCounts[currentHour] ?? 0) + 1

          const updatedRecord: DailyRecord = existingRecord
            ? {
                ...existingRecord,
                studyCount: existingRecord.studyCount + 1,
                correctCount: existingRecord.correctCount + session.correctCount,
                totalCount: existingRecord.totalCount + session.answers.length,
                xpEarned: existingRecord.xpEarned + xpEarned,
                wrongWordIds: [...new Set([...existingRecord.wrongWordIds, ...wrongIds])],
                hourCounts: baseHourCounts,
              }
            : {
                date: today,
                studyCount: 1,
                correctCount: session.correctCount,
                totalCount: session.answers.length,
                xpEarned,
                wrongWordIds: wrongIds,
                hourCounts: baseHourCounts,
              }

          return {
            currentSession: null,
            dailyRecords: {
              ...state.dailyRecords,
              [today]: updatedRecord,
            },
          }
        })

        return { score, xpEarned, leveledUp, newLevel }
      },

      resetSession: () => set({ currentSession: null }),

      saveLearning: (words) => {
        const session = get().currentSession
        if (session && session.questionIndex < 20) {
          set({
            savedLearning: {
              session,
              wordIds: words.map((w) => w.id),
              savedAt: Date.now(),
            },
          })
        }
      },

      resumeLearning: () => {
        const saved = get().savedLearning
        if (!saved) return null

        // 24시간 이상 지난 세션은 무효화
        const hoursSinceSaved = (Date.now() - saved.savedAt) / (1000 * 60 * 60)
        if (hoursSinceSaved > 24) {
          set({ savedLearning: null })
          return null
        }

        set({ currentSession: saved.session })
        // 단어 해석은 호출부(LearningPage)가 현재 데이터로 수행 — resolveWordsByIds
        return { session: saved.session, wordIds: saved.wordIds ?? [] }
      },

      clearSavedLearning: () => set({ savedLearning: null }),

      // Progress actions
      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount
          const newLevel = calculateLevel(newXP)
          return { xp: newXP, level: newLevel }
        }),

      updateStreak: () =>
        set((state) => {
          const today = new Date().toDateString()
          if (state.lastStudyDate === today) return state

          const yesterday = new Date(Date.now() - 86400000).toDateString()
          const newStreak =
            state.lastStudyDate === yesterday ? state.streak + 1 : 1

          return { streak: newStreak, lastStudyDate: today }
        }),

      addWrongWord: (wordId) =>
        set((state) => ({
          wrongWordIds: state.wrongWordIds.includes(wordId)
            ? state.wrongWordIds
            : [...state.wrongWordIds, wordId],
        })),

      removeWrongWord: (wordId) =>
        set((state) => ({
          wrongWordIds: state.wrongWordIds.filter((id) => id !== wordId),
        })),

      getDailyRecord: (date) => {
        return get().dailyRecords[date] || null
      },

      // Conversation Memo actions
      addConversationMemo: (word) =>
        set((state) => ({
          conversationMemo: state.conversationMemo.some((w) => w.text === word.text)
            ? state.conversationMemo
            : [...state.conversationMemo, word],
        })),

      removeConversationMemo: (wordText) =>
        set((state) => ({
          conversationMemo: state.conversationMemo.filter((w) => w.text !== wordText),
        })),

      // SRS actions
      recordSrsReview: (wordId, isCorrect) => {
        set((state) => {
          const prev = state.wordSrs[wordId]
          const next = reviewSrs(prev, wordId, isCorrect)
          return {
            wordSrs: { ...state.wordSrs, [wordId]: next },
          }
        })
      },

      getDueWordIds: () => {
        const now = Date.now()
        return Object.values(get().wordSrs)
          .filter((s) => s.dueDate <= now && s.reviewCount > 0)
          .sort((a, b) => a.dueDate - b.dueDate)
          .map((s) => s.wordId)
      },

      // Daily missions actions — 로컬 자정 기준 새 미션 자동 생성
      ensureTodaysMissions: () => {
        const today = todayKey()
        if (get().missionsGeneratedAt === today) return
        set({
          dailyMissions: generateDailyMissions(),
          missionsGeneratedAt: today,
        })
      },

      bumpMissionProgress: (type, delta = 1) => {
        get().ensureTodaysMissions()
        const { next, newlyCompleted } = updateMissionProgress(
          get().dailyMissions,
          type,
          delta,
        )
        set({ dailyMissions: next })
        // 미션 완료 시 보상 XP 지급
        if (newlyCompleted.length > 0) {
          const total = newlyCompleted.reduce((sum, m) => sum + m.rewardXP, 0)
          get().addXP(total)
        }
        return newlyCompleted
      },

      // Streak rewards
      unclaimedStreakMilestone: () => {
        const streak = get().streak
        const claimed = get().claimedStreakMilestones
        const milestones = [3, 7, 14, 30, 60, 100]
        for (let i = milestones.length - 1; i >= 0; i--) {
          if (streak >= milestones[i] && !claimed.includes(milestones[i])) {
            return milestones[i]
          }
        }
        return null
      },

      claimStreakMilestone: (days) => {
        if (get().claimedStreakMilestones.includes(days)) return
        set((state) => ({
          claimedStreakMilestones: [...state.claimedStreakMilestones, days],
        }))
      },

      // Kanji favorites
      toggleFavoriteKanji: (kanji) =>
        set((state) => ({
          favoriteKanji: toggleInArray(state.favoriteKanji, kanji),
        })),

      // Word favorites
      toggleFavoriteWord: (wordId) =>
        set((state) => ({
          favoriteWords: toggleInArray(state.favoriteWords, wordId),
        })),

      // Phrase favorites (여행 키트) — 객체 배열이라 id 기준 토글
      toggleFavoritePhrase: (phraseId, categoryId) =>
        set((state) => ({
          favoritePhrases: state.favoritePhrases.some((f) => f.id === phraseId)
            ? state.favoritePhrases.filter((f) => f.id !== phraseId)
            : [
                ...state.favoritePhrases,
                { id: phraseId, categoryId, addedAt: Date.now() },
              ],
        })),
      // Conversation progress
      markConversationViewed: (categoryId, phraseId) =>
        set((state) => {
          const existing = state.conversationProgress[categoryId] || []
          if (existing.includes(phraseId)) return state
          return {
            conversationProgress: {
              ...state.conversationProgress,
              [categoryId]: [...existing, phraseId],
            },
          }
        }),
      getConversationProgress: (categoryId) =>
        get().conversationProgress[categoryId]?.length ?? 0,

      completeOnboarding: () => set({ onboardingCompletedAt: Date.now() }),

      // AI readings - 최신순으로 prepend, 같은 id면 교체
      saveAiReading: (piece) =>
        set((state) => ({
          aiReadings: [
            piece,
            ...state.aiReadings.filter((p) => p.id !== piece.id),
          ].slice(0, 50), // 최대 50개 보존
        })),
      removeAiReading: (id) =>
        set((state) => ({
          aiReadings: state.aiReadings.filter((p) => p.id !== id),
        })),
      getAiReadingById: (id) => get().aiReadings.find((p) => p.id === id),

      // Settings actions
      setTTSRate: (rate) => set({ ttsRate: rate }),
      setDarkMode: (enabled) => {
        // DOM에 dark 클래스 추가/제거
        if (enabled) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        // 수동 변경 시 auto 해제 (사용자 의도 명시적 우선)
        set({ darkMode: enabled, darkModeAuto: false })
      },
      setHapticEnabled: (enabled) => set({ hapticEnabled: enabled }),
      setDailyGoal: (n) => set({ dailyGoal: Math.max(5, Math.min(200, n)) }),
      setWeeklyGoal: (n) => set({ weeklyGoal: Math.max(1, Math.min(14, n)) }),
      toggleQuizType: (type) =>
        set((state) => {
          const current = state.enabledQuizTypes
          const has = current.includes(type)
          // 최소 1개는 유지 (전부 끄면 standard 보장)
          if (has && current.length === 1) return {}
          return {
            enabledQuizTypes: has
              ? current.filter((t) => t !== type)
              : [...current, type],
          }
        }),
      setUseCanvasForReverse: (enabled) => set({ useCanvasForReverse: enabled }),
      startGuestMode: () => set({ isGuest: true }),
      exitGuestMode: () => set({ isGuest: false }),
      markIntroTourSeen: () => set({ hasSeenIntroTour: true }),
      markFirstSessionComplete: () => set({ hasCompletedFirstSession: true }),
      recordMockTest: (entry) =>
        set((state) => ({
          mockTestHistory: [
            ...(state.mockTestHistory ?? []),
            { ...entry, date: new Date().toISOString() },
          ].slice(-50), // 최근 50회만 유지
        })),
      setDarkModeAuto: (enabled) => {
        if (enabled) {
          // auto on — 즉시 현재 시스템 값 반영
          const prefersDark =
            typeof window !== 'undefined' &&
            window.matchMedia?.('(prefers-color-scheme: dark)').matches
          if (prefersDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          set({ darkModeAuto: true, darkMode: !!prefersDark })
        } else {
          set({ darkModeAuto: false })
        }
      },
      setTTSProvider: (provider) => set({ ttsProvider: provider }),
      setMurfVoiceId: (voiceId) => set({ murfVoiceId: voiceId }),
      setMascot: (mascotId) => set({ selectedMascotId: mascotId }),

      toggleBadge: (badgeId) =>
        set((state) => {
          const current = state.selectedBadgeIds
          if (current.includes(badgeId)) {
            return { selectedBadgeIds: current.filter((id) => id !== badgeId) }
          }
          // 최대 3개 — 가득 차면 가장 오래된 것 제거
          const next = [...current, badgeId]
          return { selectedBadgeIds: next.slice(-3) }
        }),
      // applyTheme 호출은 App.tsx의 useEffect가 themeId 변화를 보고 일괄 처리
      setTheme: (themeId) => set({ themeId }),
      setHomeLayout: (id) => set({ homeLayoutId: id }),

      setImmersionMode: (enabled) => set({ immersionMode: enabled }),
    }),
    {
      name: 'nihongo-app-storage',
      storage: createJSONStorage(() => localStorage),
      // currentSession, isLoading, error는 persist하지 않음
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        xp: state.xp,
        level: state.level,
        streak: state.streak,
        lastStudyDate: state.lastStudyDate,
        wrongWordIds: state.wrongWordIds,
        dailyRecords: state.dailyRecords,
        ttsRate: state.ttsRate,
        darkMode: state.darkMode,
        darkModeAuto: state.darkModeAuto ?? false,
        hapticEnabled: state.hapticEnabled ?? true,
        dailyGoal: state.dailyGoal ?? 20,
        weeklyGoal: state.weeklyGoal ?? 5,
        enabledQuizTypes: state.enabledQuizTypes ?? ['standard', 'reverse', 'listening'],
        useCanvasForReverse: state.useCanvasForReverse ?? true,
        hasSeenIntroTour: state.hasSeenIntroTour ?? false,
        hasCompletedFirstSession: state.hasCompletedFirstSession ?? false,
        mockTestHistory: state.mockTestHistory ?? [],
        ttsProvider: state.ttsProvider,
        murfVoiceId: state.murfVoiceId,
        selectedMascotId: state.selectedMascotId,
        selectedBadgeIds: state.selectedBadgeIds,
        themeId: migrateThemeId(state.themeId) ?? DEFAULT_THEME_ID,
        homeLayoutId: state.homeLayoutId ?? 'auto',
        immersionMode: state.immersionMode ?? false,
        savedLearning: state.savedLearning,
        conversationMemo: state.conversationMemo,
        wordSrs: state.wordSrs,
        dailyMissions: state.dailyMissions,
        missionsGeneratedAt: state.missionsGeneratedAt,
        claimedStreakMilestones: state.claimedStreakMilestones,
        favoriteKanji: state.favoriteKanji,
        favoriteWords: state.favoriteWords,
        favoritePhrases: state.favoritePhrases,
        conversationProgress: state.conversationProgress,
        aiReadings: state.aiReadings,
        onboardingCompletedAt: state.onboardingCompletedAt,
      }),
      // localStorage 5MB 한계 — 오래된 dailyRecords는 hydrate 시점에 정리
      // (Firestore에는 그대로 남아있어, 통계용 장기 기록은 클라우드에서 조회 가능 시 복원)
      onRehydrateStorage: () => (state) => {
        if (!state) return
        try {
          pruneOldLocalData(state)
        } catch (e) {
          console.warn('[store] pruning 실패:', e)
        }
      },
    },
  ),
)

// (PRUNE_DAILY_DAYS / pruneOldLocalData는 store 정의 위로 이동 — TDZ 회피)
