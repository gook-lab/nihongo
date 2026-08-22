// TTS 오디오 IndexedDB 영속 캐시
// db 'nihongo-tts' v1 / objectStore 'audio'
// key = `${text}:${voiceId}` (murf.ts의 getCacheKey와 동일 체계)
// value = base64 data URL 문자열 (기존 재생 경로가 그대로 사용)
//
// 실패 계약: 어떤 실패(프라이빗 모드 open 거부, 쿼터 초과, 브라우저 축출)에서도
// throw하지 않는다. null/false/빈 Set을 반환하면 호출자는 "캐시 없음"으로 동작하고
// 기존 브라우저 TTS 폴백 경로가 이어받는다. Sentry 보고는 세션당 1회만.
import { openDB, type IDBPDatabase } from 'idb'
import { reportStorageError } from './sentry'

const DB_NAME = 'nihongo-tts'
const DB_VERSION = 1
const STORE_NAME = 'audio'

let dbPromise: Promise<IDBPDatabase> | null = null
let reportedOnce = false

function reportOnce(e: unknown, operation: 'read' | 'write'): void {
  if (reportedOnce) return
  reportedOnce = true
  reportStorageError(e, { operation, key: DB_NAME })
}

async function getDb(): Promise<IDBPDatabase | null> {
  if (typeof indexedDB === 'undefined') return null
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      },
    })
  }
  try {
    return await dbPromise
  } catch (e) {
    dbPromise = null // 다음 호출에서 재시도 가능하게
    reportOnce(e, 'read')
    return null
  }
}

/** 캐시된 오디오 data URL 조회. 없거나 실패 시 null. */
export async function getAudio(key: string): Promise<string | null> {
  try {
    const db = await getDb()
    if (!db) return null
    const value = await db.get(STORE_NAME, key)
    return typeof value === 'string' ? value : null
  } catch (e) {
    reportOnce(e, 'read')
    return null
  }
}

/** 오디오 data URL 저장. 성공 여부 반환 (실패해도 throw하지 않음). */
export async function putAudio(key: string, dataUrl: string): Promise<boolean> {
  try {
    const db = await getDb()
    if (!db) return false
    await db.put(STORE_NAME, dataUrl, key)
    return true
  } catch (e) {
    reportOnce(e, 'write')
    return false
  }
}

/**
 * 주어진 키들 중 캐시에 존재하는 키 집합 반환.
 * 값을 읽지 않고 getKey만 사용 — 카테고리 미리받기 진행률(n/전체) 계산용.
 */
export async function getCachedKeys(keys: string[]): Promise<Set<string>> {
  const cached = new Set<string>()
  try {
    const db = await getDb()
    if (!db) return cached
    await Promise.all(
      keys.map(async (key) => {
        const found = await db.getKey(STORE_NAME, key)
        if (found !== undefined) cached.add(key)
      }),
    )
    return cached
  } catch (e) {
    reportOnce(e, 'read')
    return cached
  }
}
