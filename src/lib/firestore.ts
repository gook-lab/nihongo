// Firestore 데이터 동기화 모듈
// 데이터 모델: users/{uid}/data/{profile|state|srs|library}
// - profile: 자주 안 바뀌는 설정 (닉네임, 마스코트, 테마, 홈 레이아웃, TTS, darkMode)
// - state: 학습 진행 (xp, level, streak, dailyRecords, missions)
// - srs: 단어별 SRS 상태 (변경 빈번)
// - library: 컬렉션류 (회화 메모, AI 이야기, 즐겨찾기 한자)
import type { Firestore } from 'firebase/firestore'
import { getFirebaseApp, isFirebaseConfigured } from './firebase'
import { reportFirestoreError } from './sentry'
import type {
  WordSrsState,
  SavedConversationWord,
  FavoritePhrase,
  DailyMission,
  HomeLayoutId,
} from '@/types'
import type { ThemeId } from './themes'
import type { ReadingPiece } from '@/data/reading'
import type { DailyRecord } from '@/store'

// ── Doc 타입 정의 ─────────────────────────────────────────

export interface ProfileDoc {
  nickname: string
  photoURL?: string
  mascotId: string
  themeId: ThemeId
  homeLayoutId: HomeLayoutId
  ttsRate: number
  ttsProvider: 'browser' | 'murf'
  murfVoiceId: string
  darkMode: boolean
  createdAt: number | null
  updatedAt: number
}

export interface StateDoc {
  xp: number
  level: number
  streak: number
  lastStudyDate: string | null
  wrongWordIds: string[]
  dailyRecords: Record<string, DailyRecord>
  dailyMissions: DailyMission[]
  missionsGeneratedAt: string | null
  claimedStreakMilestones: number[]
  onboardingCompletedAt: number | null
  updatedAt: number
}

export interface SrsDoc {
  wordSrs: Record<string, WordSrsState>
  updatedAt: number
}

export interface LibraryDoc {
  conversationMemo: SavedConversationWord[]
  aiReadings: ReadingPiece[]
  favoriteKanji: string[]
  // 아래 두 필드는 2026-07 추가 — 기존 문서에는 없을 수 있으므로 로드 시 ?? [] 필수
  favoriteWords?: string[]
  favoritePhrases?: FavoritePhrase[]
  updatedAt: number
}

export type CategoryKey = 'profile' | 'state' | 'srs' | 'library'

export interface AllUserData {
  profile: ProfileDoc | null
  state: StateDoc | null
  srs: SrsDoc | null
  library: LibraryDoc | null
}

// ── Firestore 인스턴스 (lazy) ────────────────────────────
// firebase/firestore 178KB 청크를 dynamic import로 분리 — 로그인 후에만 로드.

let dbInstance: Firestore | null = null
let firestoreModulePromise: Promise<typeof import('firebase/firestore')> | null = null

async function loadFirestoreModule(): Promise<typeof import('firebase/firestore')> {
  if (!firestoreModulePromise) {
    firestoreModulePromise = import('firebase/firestore')
  }
  return firestoreModulePromise
}

async function getDb(): Promise<Firestore | null> {
  if (!isFirebaseConfigured()) return null
  if (dbInstance) return dbInstance
  const app = getFirebaseApp()
  if (!app) return null
  const mod = await loadFirestoreModule()
  dbInstance = mod.getFirestore(app)
  return dbInstance
}

// sync: 모듈이 이미 로드되었으면 ready. 첫 호출 전엔 false.
export function isFirestoreReady(): boolean {
  return dbInstance !== null
}

// 첫 사용 직전에 호출 — 모듈 + db 인스턴스를 lazy 로드.
export async function ensureFirestoreReady(): Promise<boolean> {
  return (await getDb()) !== null
}

// ── 헬퍼: doc 경로 ────────────────────────────────────────

async function docRef(uid: string, category: CategoryKey) {
  const db = await getDb()
  if (!db) throw new Error('Firestore가 설정되지 않았습니다.')
  const mod = await loadFirestoreModule()
  return mod.doc(db, 'users', uid, 'data', category)
}

// ── Load ──────────────────────────────────────────────────

async function loadCategory<T>(uid: string, category: CategoryKey): Promise<T | null> {
  const db = await getDb()
  if (!db) return null
  try {
    const mod = await loadFirestoreModule()
    const snap = await mod.getDoc(await docRef(uid, category))
    if (!snap.exists()) return null
    return snap.data() as T
  } catch (e) {
    console.warn(`[firestore] loadCategory(${category}) 실패:`, e)
    reportFirestoreError(e, { operation: 'read', collection: category })
    return null
  }
}

export async function loadAllUserData(uid: string): Promise<AllUserData> {
  if (!(await ensureFirestoreReady())) {
    return { profile: null, state: null, srs: null, library: null }
  }
  const [profile, state, srs, library] = await Promise.all([
    loadCategory<ProfileDoc>(uid, 'profile'),
    loadCategory<StateDoc>(uid, 'state'),
    loadCategory<SrsDoc>(uid, 'srs'),
    loadCategory<LibraryDoc>(uid, 'library'),
  ])
  return { profile, state, srs, library }
}

// ── Save ──────────────────────────────────────────────────

// Firestore는 undefined 값을 거부함. 객체에서 undefined 필드 재귀적으로 제거.
function stripUndefined<T>(value: T): T {
  if (value === null || value === undefined) return value
  if (Array.isArray(value)) {
    return value.map((v) => stripUndefined(v)) as unknown as T
  }
  if (typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined) continue
      result[k] = stripUndefined(v)
    }
    return result as T
  }
  return value
}

export async function saveCategory<T extends Record<string, unknown>>(
  uid: string,
  category: CategoryKey,
  data: T,
): Promise<void> {
  const db = await getDb()
  if (!db) return
  try {
    const mod = await loadFirestoreModule()
    const cleaned = stripUndefined(data)
    await mod.setDoc(
      await docRef(uid, category),
      { ...cleaned, updatedAt: Date.now(), _serverTs: mod.serverTimestamp() },
      { merge: true },
    )
  } catch (e) {
    console.warn(`[firestore] saveCategory(${category}) 실패:`, e)
    reportFirestoreError(e, { operation: 'write', collection: category })
  }
}

// ── 부분 업데이트 (concurrent-safe) ─────────────────────────
// 문제: setDoc({ wordSrs: {...}}, merge: true)는 wordSrs 필드 전체를 통째 replace —
// 두 디바이스가 동시에 다른 word를 학습하면 늦은 쪽이 빠른 쪽을 덮음.
// 해결: dot-path update — `wordSrs.<wordId>` 같은 nested path로 변경된 항목만 update.
// Firestore가 같은 path가 아닌 한 동시 update 충돌 없음.

/**
 * wordSrs[wordId] 부분만 업데이트 (다른 word는 그대로)
 * @param changedWordSrs 변경된 word들만 담은 Record (전체가 아닌)
 */
export async function saveSrsPartial(
  uid: string,
  changedWordSrs: Record<string, unknown>,
): Promise<void> {
  const db = await getDb()
  if (!db) return
  const ids = Object.keys(changedWordSrs)
  if (ids.length === 0) return
  try {
    const mod = await loadFirestoreModule()
    const updates: Record<string, unknown> = { updatedAt: Date.now() }
    for (const wordId of ids) {
      updates[`wordSrs.${wordId}`] = stripUndefined(changedWordSrs[wordId])
    }
    await mod.updateDoc(await docRef(uid, 'srs'), updates)
  } catch (e) {
    // doc이 아직 없으면 updateDoc은 실패 — setDoc으로 fallback (첫 쓰기)
    if (e instanceof Error && e.message.includes('No document')) {
      try {
        const mod = await loadFirestoreModule()
        const fullData: Record<string, unknown> = { wordSrs: {} }
        for (const wordId of ids) {
          ;(fullData.wordSrs as Record<string, unknown>)[wordId] = stripUndefined(
            changedWordSrs[wordId],
          )
        }
        fullData.updatedAt = Date.now()
        await mod.setDoc(await docRef(uid, 'srs'), fullData, { merge: true })
        return
      } catch (e2) {
        console.warn('[firestore] saveSrsPartial fallback 실패:', e2)
        reportFirestoreError(e2, { operation: 'write', collection: 'srs' })
        return
      }
    }
    console.warn('[firestore] saveSrsPartial 실패:', e)
    reportFirestoreError(e, { operation: 'write', collection: 'srs' })
  }
}

/**
 * dailyRecords[date] 부분만 업데이트
 */
export async function saveDailyRecordsPartial(
  uid: string,
  changedDates: Record<string, unknown>,
): Promise<void> {
  const db = await getDb()
  if (!db) return
  const dates = Object.keys(changedDates)
  if (dates.length === 0) return
  try {
    const mod = await loadFirestoreModule()
    const updates: Record<string, unknown> = { updatedAt: Date.now() }
    for (const date of dates) {
      updates[`dailyRecords.${date}`] = stripUndefined(changedDates[date])
    }
    await mod.updateDoc(await docRef(uid, 'state'), updates)
  } catch (e) {
    if (e instanceof Error && e.message.includes('No document')) {
      try {
        const mod = await loadFirestoreModule()
        const fullData: Record<string, unknown> = { dailyRecords: {} }
        for (const date of dates) {
          ;(fullData.dailyRecords as Record<string, unknown>)[date] = stripUndefined(
            changedDates[date],
          )
        }
        fullData.updatedAt = Date.now()
        await mod.setDoc(await docRef(uid, 'state'), fullData, { merge: true })
        return
      } catch (e2) {
        console.warn('[firestore] saveDailyRecordsPartial fallback 실패:', e2)
        reportFirestoreError(e2, { operation: 'write', collection: 'state' })
        return
      }
    }
    console.warn('[firestore] saveDailyRecordsPartial 실패:', e)
    reportFirestoreError(e, { operation: 'write', collection: 'state' })
  }
}

// ── Delete (탈퇴 시) ──────────────────────────────────────

export async function deleteAllUserData(uid: string): Promise<void> {
  const db = await getDb()
  if (!db) return
  const mod = await loadFirestoreModule()
  const cats: CategoryKey[] = ['profile', 'state', 'srs', 'library']
  await Promise.all(
    cats.map(async (c) => {
      try {
        await mod.deleteDoc(await docRef(uid, c))
      } catch (e) {
        console.warn(`[firestore] deleteDoc(${c}) 실패:`, e)
        reportFirestoreError(e, { operation: 'delete', collection: c })
      }
    }),
  )
  // 부모 user doc도 삭제 시도
  try {
    await mod.deleteDoc(mod.doc(db, 'users', uid))
  } catch {
    // ignore
  }
}
