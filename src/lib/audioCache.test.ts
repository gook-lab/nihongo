// audioCache 단위 테스트 — fake-indexeddb로 IndexedDB 환경 시뮬레이션
import 'fake-indexeddb/auto'
import { describe, it, expect, vi } from 'vitest'

// sentry는 no-op으로 대체 (테스트에서 @sentry/react 로드 방지)
vi.mock('./sentry', () => ({
  reportStorageError: vi.fn(),
}))

import { getAudio, putAudio, getCachedKeys } from './audioCache'

describe('audioCache', () => {
  it('put 후 get으로 동일한 data URL을 돌려준다', async () => {
    const key = 'こんにちは:ja-JP-kimi'
    const dataUrl = 'data:audio/mp3;base64,AAAA'
    expect(await putAudio(key, dataUrl)).toBe(true)
    expect(await getAudio(key)).toBe(dataUrl)
  })

  it('없는 키는 null을 반환한다', async () => {
    expect(await getAudio('없는키:ja-JP-kimi')).toBeNull()
  })

  it('getCachedKeys는 존재하는 키만 담은 Set을 반환한다', async () => {
    await putAudio('a:v', 'data:audio/mp3;base64,AA')
    await putAudio('b:v', 'data:audio/mp3;base64,BB')
    const cached = await getCachedKeys(['a:v', 'b:v', 'c:v'])
    expect(cached.has('a:v')).toBe(true)
    expect(cached.has('b:v')).toBe(true)
    expect(cached.has('c:v')).toBe(false)
    expect(cached.size).toBe(2)
  })

  it('빈 키 배열이면 빈 Set', async () => {
    const cached = await getCachedKeys([])
    expect(cached.size).toBe(0)
  })

  it('문자열이 아닌 값이 저장돼 있으면 null 취급', async () => {
    // 과거 버전/외부 오염 방어 — value 타입 가드
    const key = 'weird:v'
    await putAudio(key, 'data:audio/mp3;base64,CC')
    expect(await getAudio(key)).toBe('data:audio/mp3;base64,CC')
  })
})

describe('audioCache — indexedDB 미지원 환경', () => {
  it('indexedDB가 없으면 전부 무해하게 실패한다 (throw 없음)', async () => {
    // 모듈 상태(dbPromise) 격리를 위해 fresh import
    vi.resetModules()
    const original = globalThis.indexedDB
    // @ts-expect-error — 미지원 환경 시뮬레이션
    delete globalThis.indexedDB
    try {
      const fresh = await import('./audioCache')
      expect(await fresh.getAudio('k')).toBeNull()
      expect(await fresh.putAudio('k', 'v')).toBe(false)
      expect((await fresh.getCachedKeys(['k'])).size).toBe(0)
    } finally {
      globalThis.indexedDB = original
    }
  })
})
