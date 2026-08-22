// Firestore ↔ Zustand store 양방향 동기화
// - 로그인 감지 → loadAllUserData → store rehydrate
// - 카테고리별 변경 감지 → 1.5초 debounce → saveCategory
// - 첫 로그인 시 (Firestore 데이터 없음) 현재 localStorage 값을 Firestore에 마이그레이션 write
import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store'
import {
  loadAllUserData,
  saveCategory,
  saveSrsPartial,
  saveDailyRecordsPartial,
  type ProfileDoc,
  type StateDoc,
  type SrsDoc,
  type LibraryDoc,
  type CategoryKey,
} from '@/lib/firestore'
import { onAuthChange, isFirebaseConfigured } from '@/lib/firebase'

const DEBOUNCE_MS = 1500

// 현재 store 상태에서 각 카테고리 데이터 추출
function pickProfile(s: ReturnType<typeof useAppStore.getState>): ProfileDoc {
  // Firestore는 undefined를 거부 → null로 변환 (특히 이메일 사용자는 photoURL 없음)
  const profile: ProfileDoc = {
    nickname: s.user?.nickname || '학습자',
    mascotId: s.selectedMascotId,
    themeId: s.themeId,
    homeLayoutId: s.homeLayoutId,
    ttsRate: s.ttsRate,
    ttsProvider: s.ttsProvider,
    murfVoiceId: s.murfVoiceId,
    darkMode: s.darkMode,
    createdAt: null,
    updatedAt: Date.now(),
  }
  if (s.user?.profileImage) {
    profile.photoURL = s.user.profileImage
  }
  return profile
}

function pickState(s: ReturnType<typeof useAppStore.getState>): StateDoc {
  return {
    xp: s.xp,
    level: s.level,
    streak: s.streak,
    lastStudyDate: s.lastStudyDate,
    wrongWordIds: s.wrongWordIds,
    dailyRecords: s.dailyRecords,
    dailyMissions: s.dailyMissions,
    missionsGeneratedAt: s.missionsGeneratedAt,
    claimedStreakMilestones: s.claimedStreakMilestones,
    onboardingCompletedAt: s.onboardingCompletedAt,
    updatedAt: Date.now(),
  }
}

function pickSrs(s: ReturnType<typeof useAppStore.getState>): SrsDoc {
  return {
    wordSrs: s.wordSrs,
    updatedAt: Date.now(),
  }
}

function pickLibrary(s: ReturnType<typeof useAppStore.getState>): LibraryDoc {
  return {
    conversationMemo: s.conversationMemo,
    aiReadings: s.aiReadings,
    favoriteKanji: s.favoriteKanji,
    favoriteWords: s.favoriteWords,
    favoritePhrases: s.favoritePhrases,
    updatedAt: Date.now(),
  }
}

export function useFirestoreSync() {
  // dirty flags per category
  const dirtyRef = useRef<Record<CategoryKey, boolean>>({
    profile: false,
    state: false,
    srs: false,
    library: false,
  })
  // 동시 쓰기 안전성을 위해 변경된 wordId/date만 추적 → dot-path update
  // (전체 객체를 매번 덮어쓰면 다른 디바이스의 변경분이 손실됨)
  const dirtyWordIdsRef = useRef<Set<string>>(new Set())
  const dirtyDatesRef = useRef<Set<string>>(new Set())
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const uidRef = useRef<string | null>(null)
  const hydratedRef = useRef(false) // hydrate 완료 전엔 write 비활성

  // Firestore에 dirty 카테고리만 flush
  const flushDirty = () => {
    const uid = uidRef.current
    if (!uid || !hydratedRef.current) return
    const s = useAppStore.getState()
    const dirty = dirtyRef.current

    if (dirty.profile) {
      saveCategory(uid, 'profile', pickProfile(s) as unknown as Record<string, unknown>)
      dirty.profile = false
    }
    // state — dailyRecords는 변경된 날짜만 dot-path로, 나머지(xp/level/streak 등)는 전체 set
    if (dirty.state) {
      const { dailyRecords, ...stateRest } = pickState(s)
      // dailyRecords는 따로 처리하므로 stateRest만 set
      saveCategory(uid, 'state', stateRest as unknown as Record<string, unknown>)
      // 변경된 날짜만 부분 업데이트 (다른 디바이스의 다른 날짜 변경 보존)
      if (dirtyDatesRef.current.size > 0) {
        const changed: Record<string, unknown> = {}
        for (const date of dirtyDatesRef.current) {
          if (dailyRecords[date]) {
            changed[date] = dailyRecords[date]
          }
        }
        if (Object.keys(changed).length > 0) {
          saveDailyRecordsPartial(uid, changed)
        }
        dirtyDatesRef.current.clear()
      }
      dirty.state = false
    }
    // srs — 변경된 wordId만 dot-path로
    if (dirty.srs) {
      if (dirtyWordIdsRef.current.size > 0) {
        const changed: Record<string, unknown> = {}
        for (const wordId of dirtyWordIdsRef.current) {
          if (s.wordSrs[wordId]) {
            changed[wordId] = s.wordSrs[wordId]
          }
        }
        if (Object.keys(changed).length > 0) {
          saveSrsPartial(uid, changed)
        }
        dirtyWordIdsRef.current.clear()
      }
      dirty.srs = false
    }
    if (dirty.library) {
      saveCategory(uid, 'library', pickLibrary(s) as unknown as Record<string, unknown>)
      dirty.library = false
    }
  }

  const scheduleFlush = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(flushDirty, DEBOUNCE_MS)
  }

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      return
    }

    // firestore 모듈은 onAuthChange 안에서 로그인 시점에 lazy 로드됨 (loadAllUserData가 트리거).
    // 로그인 상태 감지
    const unsubAuth = onAuthChange(async (fbUser) => {
      if (!fbUser) {
        // 로그아웃: dirty 무효화, write 중단
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
        dirtyRef.current = { profile: false, state: false, srs: false, library: false }
        dirtyWordIdsRef.current.clear()
        dirtyDatesRef.current.clear()
        hydratedRef.current = false
        uidRef.current = null
        return
      }

      const uid = fbUser.uid
      uidRef.current = uid

      // Firestore에서 데이터 로드
      const remote = await loadAllUserData(uid)

      // store에 hydrate. 원격 데이터 있으면 그것 우선, 없으면 localStorage 유지 + first-write.
      const patch: Partial<ReturnType<typeof useAppStore.getState>> = {}

      if (remote.profile) {
        patch.selectedMascotId = remote.profile.mascotId
        patch.themeId = remote.profile.themeId
        patch.homeLayoutId = remote.profile.homeLayoutId
        patch.ttsRate = remote.profile.ttsRate
        patch.ttsProvider = remote.profile.ttsProvider
        patch.murfVoiceId = remote.profile.murfVoiceId
        patch.darkMode = remote.profile.darkMode
      }
      if (remote.state) {
        patch.xp = remote.state.xp
        patch.level = remote.state.level
        patch.streak = remote.state.streak
        patch.lastStudyDate = remote.state.lastStudyDate
        patch.wrongWordIds = remote.state.wrongWordIds
        patch.dailyRecords = remote.state.dailyRecords
        patch.dailyMissions = remote.state.dailyMissions
        patch.missionsGeneratedAt = remote.state.missionsGeneratedAt
        patch.claimedStreakMilestones = remote.state.claimedStreakMilestones
        patch.onboardingCompletedAt = remote.state.onboardingCompletedAt ?? null
      }
      if (remote.srs) {
        patch.wordSrs = remote.srs.wordSrs
      }
      if (remote.library) {
        patch.conversationMemo = remote.library.conversationMemo
        patch.aiReadings = remote.library.aiReadings
        patch.favoriteKanji = remote.library.favoriteKanji
        // 2026-07 추가 필드 — 이전에 저장된 문서에는 없음 → 기본값 []
        patch.favoriteWords = remote.library.favoriteWords ?? []
        patch.favoritePhrases = remote.library.favoritePhrases ?? []
      }

      if (Object.keys(patch).length > 0) {
        useAppStore.setState(patch)
      }

      // 원격에 없는 카테고리는 현재 로컬 값으로 first-write (자연스러운 마이그레이션)
      const firstWrites: Array<Promise<void>> = []
      if (!remote.profile) {
        firstWrites.push(
          saveCategory(uid, 'profile', pickProfile(useAppStore.getState()) as unknown as Record<string, unknown>),
        )
      }
      if (!remote.state) {
        firstWrites.push(
          saveCategory(uid, 'state', pickState(useAppStore.getState()) as unknown as Record<string, unknown>),
        )
      }
      if (!remote.srs) {
        firstWrites.push(
          saveCategory(uid, 'srs', pickSrs(useAppStore.getState()) as unknown as Record<string, unknown>),
        )
      }
      if (!remote.library) {
        firstWrites.push(
          saveCategory(uid, 'library', pickLibrary(useAppStore.getState()) as unknown as Record<string, unknown>),
        )
      }
      await Promise.all(firstWrites)

      hydratedRef.current = true
    })

    // store 변경 감지
    const unsubStore = useAppStore.subscribe((curr, prev) => {
      if (!hydratedRef.current) return
      // Profile 카테고리
      if (
        curr.selectedMascotId !== prev.selectedMascotId ||
        curr.themeId !== prev.themeId ||
        curr.homeLayoutId !== prev.homeLayoutId ||
        curr.ttsRate !== prev.ttsRate ||
        curr.ttsProvider !== prev.ttsProvider ||
        curr.murfVoiceId !== prev.murfVoiceId ||
        curr.darkMode !== prev.darkMode ||
        curr.user?.nickname !== prev.user?.nickname
      ) {
        dirtyRef.current.profile = true
      }
      // State 카테고리
      if (
        curr.xp !== prev.xp ||
        curr.level !== prev.level ||
        curr.streak !== prev.streak ||
        curr.lastStudyDate !== prev.lastStudyDate ||
        curr.wrongWordIds !== prev.wrongWordIds ||
        curr.dailyRecords !== prev.dailyRecords ||
        curr.dailyMissions !== prev.dailyMissions ||
        curr.missionsGeneratedAt !== prev.missionsGeneratedAt ||
        curr.claimedStreakMilestones !== prev.claimedStreakMilestones ||
        curr.onboardingCompletedAt !== prev.onboardingCompletedAt
      ) {
        dirtyRef.current.state = true
      }
      // dailyRecords 변경된 날짜만 추적 (충돌 안전성)
      if (curr.dailyRecords !== prev.dailyRecords) {
        for (const date of Object.keys(curr.dailyRecords)) {
          if (curr.dailyRecords[date] !== prev.dailyRecords?.[date]) {
            dirtyDatesRef.current.add(date)
          }
        }
      }
      // SRS — 변경된 wordId만 추적
      if (curr.wordSrs !== prev.wordSrs) {
        dirtyRef.current.srs = true
        for (const wordId of Object.keys(curr.wordSrs)) {
          if (curr.wordSrs[wordId] !== prev.wordSrs?.[wordId]) {
            dirtyWordIdsRef.current.add(wordId)
          }
        }
      }
      // Library
      if (
        curr.conversationMemo !== prev.conversationMemo ||
        curr.aiReadings !== prev.aiReadings ||
        curr.favoriteKanji !== prev.favoriteKanji ||
        curr.favoriteWords !== prev.favoriteWords ||
        curr.favoritePhrases !== prev.favoritePhrases
      ) {
        dirtyRef.current.library = true
      }
      // 어떤 dirty라도 있으면 debounce 예약
      const any =
        dirtyRef.current.profile ||
        dirtyRef.current.state ||
        dirtyRef.current.srs ||
        dirtyRef.current.library
      if (any) scheduleFlush()
    })

    // 페이지 떠나기 전 미저장 변경 강제 flush
    const onBeforeUnload = () => {
      const uid = uidRef.current
      if (uid && hydratedRef.current) {
        flushDirty()
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)

    return () => {
      unsubAuth()
      unsubStore()
      window.removeEventListener('beforeunload', onBeforeUnload)
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [])

  return {
    /** uid 반환 (디버그/마이페이지에서 사용) */
    getUid: () => uidRef.current,
  }
}
