# Lib

유틸리티 함수, 외부 서비스 연동, 도메인 로직

## 파일 목록

| 파일 | 설명 |
|------|------|
| utils.ts | `cn()` 클래스 병합 |
| hiraganaToRomaji.ts | 히라가나 → 로마자 변환 |
| firebase.ts | Firebase Auth (로그인/회원가입/탈퇴/재인증) |
| firestore.ts | Firestore 동기화 (4-doc 분리, debounced sync) |
| gemini.ts | Google Gemini API (채팅 스트리밍, 작문 첨삭, 이야기 생성) |
| anthropic.ts | Anthropic Claude API 래퍼 (옵션) |
| murf.ts | Murf.ai TTS API (2계층 캐시: memory→IDB→API, `prefetchSpeech`, `countCachedTexts`) |
| audioCache.ts | TTS 오디오 IndexedDB 영속 캐시 (db 'nihongo-tts', 테스트 포함) |
| quickSearch.ts | ⌘K 검색 순수 함수 — `searchWords`/`searchPhrases` (테스트 포함) |
| toast.ts | react-hot-toast 헬퍼 — `toast.success/error/warning/info` |
| themes.ts | 7개 색·폰트 테마 + CSS 변수 주입 |
| missions.ts | 일일 미션 생성/검증 |
| srs.ts | SuperMemo-2 기반 SRS 알고리즘 (테스트 포함) |
| answerMatcher.ts | 학습 정답 매칭 (오탈자 허용) |
| notifications.ts | 로컬 알림 + setTimeout 스케줄링 |
| sentry/ | Sentry 에러 보고 (init + 도메인 헬퍼) |

## sentry/

도메인별 에러 보고 헬퍼. **DSN 미설정 시 자동 no-op**.

```tsx
import {
  reportError,
  reportAuthError,
  reportFirestoreError,
  reportAIError,
  reportTTSError,
  reportStorageError,
  reportApiError,
  reportBoundaryError,
} from '@/lib/sentry'

// 인증
catch (e) { reportAuthError(e, { operation: 'signin', provider: 'google' }) }

// Firestore
catch (e) { reportFirestoreError(e, { operation: 'write', collection: 'profile' }) }

// Gemini AI (스트리밍/생성)
catch (e) { reportAIError(e, { feature: 'chat', extra: { reason: 'rate_limit' } }) }

// TTS
catch (e) { reportTTSError(e, { provider: 'murf', operation: 'synthesize' }) }

// localStorage
catch (e) { reportStorageError(e, { operation: 'write', key: STORAGE_KEY }) }

// 그 외 — type/level/tags 직접 지정
catch (e) {
  reportError(e, {
    type: 'pwa',
    level: 'warning',
    tags: { operation: 'install-prompt' },
  })
}
```

규칙:
- **toast/setError로 사용자 메시지** + **report*로 Sentry 보고**를 같이 호출
- 사용자 취소(`auth/popup-closed-by-user`, 비밀번호 오류)는 report 호출하지 않음
- fingerprint는 헬퍼가 자동 생성 (`[type, operation/feature, message]`)
- 환경 변수: `VITE_SENTRY_DSN`, `VITE_APP_VERSION`

## toast.ts

`react-hot-toast` 래퍼. 테마 토큰을 따라가는 `CustomToast` UI 사용.

```tsx
import { toast } from '@/lib/toast'

toast.success({ message: '닉네임이 변경됐어요' })
toast.error({ message: '로그아웃에 실패했어요. 다시 시도해 주세요.' })
toast.info({ message: '오답노트에 추가했어요', id: 'wrong-add' })   // id로 중복 방지
toast.warning({ title: '주의', message: '데이터가 삭제됩니다', duration: 4000 })
```

## themes.ts

7개 색·폰트 테마 + 다크 모드 대응.

| ID | 이름 | Primary |
|----|------|---------|
| default | 기본 | Airbnb Coral |
| d1-pink | 핑크 리파인드 | Hot Pink |
| d2-mono | 모노 + 핑크 액센트 | Hot Pink |
| d3-ios | iOS 네이티브 | iOS Pink |
| d4-editorial | 에디토리얼 | Magazine Pink |
| d5-mascot | 마스코트 퍼스트 | Soft Pink |
| **d6-ink** | **잉크 (검정 CTA)** | **#1A1A1A** |

```tsx
import { applyTheme, THEMES, type ThemeId } from '@/lib/themes'

applyTheme('d6-ink', /* isDark */ false)
// → :root에 CSS 변수 (--color-primary 등) 주입
// → 다크 모드일 때는 액센트/radius/font만 적용, .dark 규칙이 cascade 이김
```

테마는 `:root` data-attribute로도 노출됨 (`[data-theme="d6-ink"]`).

## firebase.ts / firestore.ts

- **firebase.ts**: Auth (Google/카카오/네이버 OIDC + 이메일/비밀번호), 재인증, 탈퇴
- **firestore.ts**: 4-doc 분리 동기화
  - `users/{uid}/data/profile` — 닉네임, 마스코트, 테마, 홈 레이아웃, TTS, 다크모드
  - `users/{uid}/data/state` — xp, level, streak, dailyRecords, missions
  - `users/{uid}/data/srs` — 단어별 SRS 상태
  - `users/{uid}/data/library` — 회화 메모, AI 이야기, 즐겨찾기 한자
- 카테고리별 dirty flag로 1.5초 디바운스 후 저장
- `stripUndefined()`로 Firestore 거부 값 자동 제거

## gemini.ts

```tsx
import {
  generateChatStream,        // AI 튜터 채팅
  correctWriting,             // 작문 첨삭 (JSON 응답)
  generateReadingStory,       // 짧은 글 생성 (JSON 응답)
  isGeminiConfigured,
} from '@/lib/gemini'

// 스트리밍 채팅
await generateChatStream(messages, signal, (chunk) => setText((t) => t + chunk))
```

- Rate limit (429/`RESOURCE_EXHAUSTED`) 시 `RATE_LIMIT:<seconds>` 에러 throw
- `AbortError`는 정상 흐름 — 보고/표시 안 함
- 그 외는 `reportAIError`로 자동 보고

## murf.ts / audioCache.ts

2계층 캐시. 재생과 미리받기의 경로가 다르다:

```ts
// 재생 — memory Map(LRU 100) → IndexedDB(히트 시 memory 승격) → API(양쪽 기록)
const src = await synthesizeSpeech('こんにちは', voiceId)

// 미리받기 — memory 우회, IDB만 기록 (일괄 다운로드가 hot 캐시를 밀어내지 않게)
const r = await prefetchSpeech(text, voiceId) // 'cached' | 'ok' | 'fail' (throw 없음)

// 진행률 — 반드시 표현 기준으로 센다 (문장 중복 시 캐시 키 text:voiceId 공유)
countCachedTexts(texts, await getCachedKeys(keys), voiceId)
```

- 실패 시 `null` 반환 + `reportTTSError` 보고, 호출자(`useTTS`)가 브라우저 TTS 폴백
- degraded 모드: 연속 실패 3회 → 5분 / 401·403·429 → 1시간 브라우저 TTS 전환
- audioCache는 모든 실패(프라이빗 모드, 쿼터, 축출)에서 throw 없이 null/false —
  "캐시 없음"으로 동작. 원격 URL 응답은 영속화하지 않음 (data URL만)

## quickSearch.ts

```ts
searchWords(WORDS, q)                       // 기존 인라인 필터와 동일 결과 (회귀 테스트)
searchPhrases(CONVERSATION_CATEGORIES, q)   // 일어/후리가나/한국어 뜻 OR 부분 일치
```

데이터는 호출자(QuickDictSearch)가 dynamic import로 전달 — 순수 함수 유지.

## srs.ts / missions.ts / answerMatcher.ts

- **srs.ts**: SuperMemo-2 변형 (ease/interval/nextReview 계산). 단위 테스트 `srs.test.ts` 11개
- **missions.ts**: 일일 미션 3종 (학습/정답률/연속) 생성 + 진척도 계산
- **answerMatcher.ts**: 학습 정답 매칭 — 공백/특수문자 정규화 후 비교

## hiraganaToRomaji.ts

```tsx
hiraganaToRomaji('たべる')   // "taberu"
hiraganaToRomaji('きょう')   // "kyou" (요음)
hiraganaToRomaji('がっこう') // "gakkou" (촉음)
```

지원: 청음/탁음/반탁음/요음/촉음. 장음(`ー`)은 무시.
