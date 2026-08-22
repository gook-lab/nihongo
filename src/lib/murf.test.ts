// murf 2계층 캐시 회귀 테스트
// [회귀·CRITICAL] memory 캐시 히트 시 IDB/API를 건드리지 않는다 (기존 동작 보존)
// [신규] IDB 히트 시 memory 승격, prefetchSpeech는 memory를 우회한다
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./sentry', () => ({
  reportTTSError: vi.fn(),
}))

// audioCache를 인메모리 Map으로 대체
const idbStore = new Map<string, string>()
const getAudioMock = vi.fn(async (key: string) => idbStore.get(key) ?? null)
const putAudioMock = vi.fn(async (key: string, value: string) => {
  idbStore.set(key, value)
  return true
})
vi.mock('./audioCache', () => ({
  getAudio: (key: string) => getAudioMock(key),
  putAudio: (key: string, value: string) => putAudioMock(key, value),
}))

function mockFetchSuccess() {
  return vi.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => ({ encodedAudio: 'QUJD' }),
    text: async () => '',
  })) as unknown as typeof fetch
}

async function importMurf() {
  vi.resetModules()
  vi.stubEnv('VITE_MURF_API_KEY', 'test-api-key')
  return await import('./murf')
}

beforeEach(() => {
  idbStore.clear()
  getAudioMock.mockClear()
  putAudioMock.mockClear()
  vi.unstubAllGlobals()
})

describe('synthesizeSpeech — 2계층 캐시', () => {
  it('[회귀] memory 캐시 히트 시 IDB 조회도 API 호출도 하지 않는다', async () => {
    const fetchMock = mockFetchSuccess()
    vi.stubGlobal('fetch', fetchMock)
    const murf = await importMurf()

    const first = await murf.synthesizeSpeech('こんにちは', 'ja-JP-kimi')
    expect(first).toBe('data:audio/mp3;base64,QUJD')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const idbReadsAfterFirst = getAudioMock.mock.calls.length

    // 두 번째 호출 — memory 히트로 즉시 반환되어야 함
    const second = await murf.synthesizeSpeech('こんにちは', 'ja-JP-kimi')
    expect(second).toBe(first)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(getAudioMock.mock.calls.length).toBe(idbReadsAfterFirst)
  })

  it('API 성공 시 IDB에도 영속화한다 (data URL만)', async () => {
    vi.stubGlobal('fetch', mockFetchSuccess())
    const murf = await importMurf()
    await murf.synthesizeSpeech('ありがとう', 'ja-JP-kimi')
    expect(putAudioMock).toHaveBeenCalledWith(
      'ありがとう:ja-JP-kimi',
      'data:audio/mp3;base64,QUJD',
    )
  })

  it('IDB 히트 시 API를 호출하지 않고 memory로 승격한다 (오프라인 재생 경로)', async () => {
    const fetchMock = vi.fn() as unknown as typeof fetch
    vi.stubGlobal('fetch', fetchMock)
    idbStore.set('すみません:ja-JP-kimi', 'data:audio/mp3;base64,WFla')
    const murf = await importMurf()

    const result = await murf.synthesizeSpeech('すみません', 'ja-JP-kimi')
    expect(result).toBe('data:audio/mp3;base64,WFla')
    expect(fetchMock).not.toHaveBeenCalled()

    // 승격 확인 — 같은 호출을 반복해도 IDB를 다시 읽지 않음
    const idbReads = getAudioMock.mock.calls.length
    await murf.synthesizeSpeech('すみません', 'ja-JP-kimi')
    expect(getAudioMock.mock.calls.length).toBe(idbReads)
  })
})

describe('countCachedTexts — 중복 문장 진행률', () => {
  it('[회귀] 중복 일본어 문장(캐시 키 공유)도 표현 수 기준으로 센다', async () => {
    const murf = await importMurf()
    // 20표현 중 같은 문장이 2번 나오는 카테고리 시뮬레이션
    const texts = ['A', 'B', 'A', 'C'] // 유니크 3, 표현 4
    const cached = new Set(['A:v', 'B:v', 'C:v'])
    // Set 크기(3)가 아니라 표현 수(4)여야 "준비됨" 판정이 가능
    expect(murf.countCachedTexts(texts, cached, 'v')).toBe(4)
    expect(murf.countCachedTexts(texts, new Set(['A:v']), 'v')).toBe(2)
    expect(murf.countCachedTexts([], cached, 'v')).toBe(0)
  })
})

describe('prefetchSpeech — memory 우회', () => {
  it('IDB에 기록하고, 이후 synthesizeSpeech는 IDB에서 읽는다', async () => {
    const fetchMock = mockFetchSuccess()
    vi.stubGlobal('fetch', fetchMock)
    const murf = await importMurf()

    expect(await murf.prefetchSpeech('駅はどこですか', 'ja-JP-kimi')).toBe('ok')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(idbStore.has('駅はどこですか:ja-JP-kimi')).toBe(true)

    // memory를 우회했으므로 재생 시 IDB 조회가 발생해야 함
    const idbReadsBefore = getAudioMock.mock.calls.length
    const played = await murf.synthesizeSpeech('駅はどこですか', 'ja-JP-kimi')
    expect(played).toBe('data:audio/mp3;base64,QUJD')
    expect(getAudioMock.mock.calls.length).toBeGreaterThan(idbReadsBefore)
    // API 재호출 없음
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('이미 캐시된 표현은 API를 호출하지 않고 cached를 반환한다', async () => {
    const fetchMock = vi.fn() as unknown as typeof fetch
    vi.stubGlobal('fetch', fetchMock)
    idbStore.set('はい:ja-JP-kimi', 'data:audio/mp3;base64,QQ==')
    const murf = await importMurf()
    expect(await murf.prefetchSpeech('はい', 'ja-JP-kimi')).toBe('cached')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('네트워크 오류(오프라인)는 throw 없이 fail을 반환한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }) as unknown as typeof fetch,
    )
    const murf = await importMurf()
    expect(await murf.prefetchSpeech('いいえ', 'ja-JP-kimi')).toBe('fail')
  })

  it('degraded 상태에서는 API를 건드리지 않고 fail', async () => {
    // 429 응답으로 degrade 진입시킨 뒤 prefetch 시도
    const fetchMock = vi.fn(async () => ({
      ok: false,
      status: 429,
      json: async () => ({}),
      text: async () => 'rate limited',
    })) as unknown as typeof fetch
    vi.stubGlobal('fetch', fetchMock)
    const murf = await importMurf()

    expect(await murf.prefetchSpeech('もしもし', 'ja-JP-kimi')).toBe('fail')
    expect(murf.isMurfTemporarilyDegraded()).toBe(true)
    const calls = (fetchMock as unknown as ReturnType<typeof vi.fn>).mock.calls.length

    expect(await murf.prefetchSpeech('もしもし', 'ja-JP-kimi')).toBe('fail')
    expect(
      (fetchMock as unknown as ReturnType<typeof vi.fn>).mock.calls.length,
    ).toBe(calls) // degrade 이후 추가 호출 없음
  })
})
