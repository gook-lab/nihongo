# 니혼고 — 아키텍처

> 기능 개요와 실행법은 [`../README.md`](../README.md).
> 이 문서는 데이터가 어디에 살고 어떻게 흐르는가를 다뤄요.

---

## 0. 큰 그림

```
   ┌──────────────────────────────────────────────────────────────┐
   │ src/data/*.ts   콘텐츠 = 코드 안의 순수 데이터                 │
   │   words · kana · kanji · grammar · idioms · conversations     │
   │   reading · songs · dialogues · roleplay · mascots · badges   │
   └───────────────────────────┬──────────────────────────────────┘
                               │ import
   ┌───────────────────────────▼──────────────────────────────────┐
   │ store.ts  (Zustand + persist → localStorage)                 │
   │   xp · level · streak · dailyRecords · wordSrs · 즐겨찾기 …    │
   └────────┬──────────────────────────────────┬──────────────────┘
            │ dirty flag + 1.5s 디바운스        │
            ▼                                  ▼
   ┌────────────────────┐            ┌──────────────────────────┐
   │ Firestore 4-doc    │            │ IndexedDB (idb)          │
   │ profile / state /  │            │ TTS 오디오 영속 캐시      │
   │ srs / library      │            │ (db 'nihongo-tts')       │
   └────────────────────┘            └──────────────────────────┘
```

**세 저장소가 각자 다른 걸 맡아요.**
localStorage = 즉시 복구용 스냅샷, Firestore = 기기 간 동기화, IndexedDB = 무거운 오디오 바이너리.

---

## 1. 콘텐츠는 데이터다 — 그리고 base / ext로 나눈다

`src/data/`의 파일들은 순수 TypeScript 상수예요. 서버도 CMS도 없어요.

### base + `-ext` 분리 규칙

```ts
// conversations.ts     — BASE_CATEGORIES (기본 11 카테고리)
// conversations-ext.ts — EXTRA_PHRASES (기존 카테고리에 추가) + NEW_CATEGORIES (신규)
//                        ↓ conversations.ts 끝의 머지 로직
//                        CONVERSATION_CATEGORIES 로 export
```

**왜 나누나요**

- `conversations.ts`가 2,000줄을 넘어가면 편집 자체가 불안정해져요.
- 증분 추가가 안전하고 추적이 쉬워요.

같은 패턴이 `words-ext.ts`, `reading-ext.ts`, `songs-ext.ts`, `conversations-ext2.ts`에 적용돼요.

> 새 카테고리를 추가하면 `ConversationPage`의 `ICON_MAP`에 lucide 아이콘 이름을 등록해야 해요.

### 콘텐츠 중복 금지 — 테스트로 강제

| 대상 | 규칙 | 안 지키면 |
|---|---|---|
| 회화 | 카테고리 내 일본어 문장 중복 금지 | TTS 캐시 키(`text:voiceId`)를 공유해서 **미리받기 완료 판정이 왜곡**돼요 (실제 사고: 확장 누적으로 중복 30건) |
| 단어 | 같은 단어(한자+히라가나+뜻)는 하나의 항목·하나의 레벨로만 | 사전 이중 노출 + **SRS 이중 추적** (실제 정리: N2/N1/N3 재수록 71건 제거) |

`src/data/conversations.test.ts`, `src/data/words.test.ts`의 무결성 테스트가 이걸 잠궈요.
확장 전에는 기존 데이터와 **기계 대조**해요.

> **제거한 콘텐츠 id는 재사용하면 안 돼요.** 진행도·즐겨찾기·SRS가 엉뚱한 항목에 붙어요.

### 일본어 reading은 단어별로 띄어 써요

```ts
// ✅ reading: 'ほんを かいます。'
// ❌ reading: 'ほんをかいます。'   ← hiraganaToRomaji가 음절을 구분 못해요
```

---

## 2. SRS — SuperMemo-2 (`lib/srs.ts`)

순수 함수예요. 상태는 `WordSrsState { wordId, ease, intervalDays, dueDate, reviewCount, correctCount, wrongCount, lastReviewedAt }`.

- `ease`: 기본 2.5, 하한 1.3, 상한 2.5
- 정답: ease +0.1(상한 클램프), 간격 `0 → 1일 → 3일 → round(직전 × ease)`
- 오답: ease 하락 + 간격 초기화

순수 함수라 단위 테스트가 쉽고, UI/저장소와 독립적이에요.

---

## 3. Firestore 4-doc 분리

```
users/{uid}/data/profile   닉네임 · 마스코트 · 테마 · 홈 레이아웃 · TTS · 다크모드
users/{uid}/data/state     xp · level · streak · dailyRecords · missions
users/{uid}/data/srs       단어별 SRS
users/{uid}/data/library   회화 메모 · AI 이야기 · 즐겨찾기(한자/단어/표현/여행 키트)
```

**왜 4개예요**: 바뀌는 빈도가 완전히 달라요. 학습 한 번에 `state`와 `srs`는 매번 바뀌지만
`profile`은 거의 안 바뀌어요. 한 문서에 몰아넣으면 쓰기 비용과 충돌이 같이 커져요.

운영 규칙:

- **카테고리별 dirty flag → 1.5초 디바운스** 저장. 매 상호작용마다 안 써요.
- **`stripUndefined()` 필수** — Firestore가 `undefined`를 거부해요.
- 탈퇴 시 전체 카테고리 + 부모 user doc까지 삭제해요.

---

## 4. TTS 3계층 캐시 (`lib/murf.ts` + `lib/audioCache.ts`)

```
   요청
    │
    ├─▶ memory 캐시            (세션 내 즉시)
    │
    ├─▶ IndexedDB 'nihongo-tts' (재방문/오프라인)
    │
    └─▶ Murf.ai API            (최초 1회)
             │ 실패 시
             └─▶ 브라우저 내장 TTS 폴백
```

캐시 계층이 실패해도 **무해하게** 아래 계층으로 떨어져요 — IndexedDB를 못 쓰는
브라우저에서도 앱이 죽지 않아요.

회화 화면의 `PrefetchAudioButton`이 카테고리 오디오를 미리 받아두면
그 이후로는 네트워크 없이 발음이 재생돼요.

---

## 5. 저장소 키와 사용자 격리

| 키 | 저장소 | 내용 |
|---|---|---|
| `nihongo-app-storage` | localStorage | Zustand persist 메인 |
| `nihongo-notify-prefs` | localStorage | 알림 설정 |
| `nihongo-splash-seen` | sessionStorage | 스플래시 표시 여부 |

**로그아웃 시 초기화되는 것(사용자별)**: xp · level · streak · dailyRecords · wordSrs ·
회화 메모/진행도 · 오답 단어 · 즐겨찾기.
**남는 것(디바이스 설정)**: 테마 · 다크모드 · 홈 레이아웃 · 알림 설정.

데이터 초기화는 메인 키만 제거 + (선택) Firestore 카테고리 삭제 → `window.location.reload()`로 끝나요.

---

## 6. 에러 처리 — 사용자와 Sentry에 동시에

이 프로젝트의 모든 `catch`는 **사용자 피드백 + Sentry 보고**를 함께 해요.

```ts
try { /* ... */ }
catch (e) {
  reportAuthError(e, { operation: 'signin', provider: 'google' })   // Sentry
  toast.error({ message: '로그인에 실패했어요. 다시 시도해 주세요.' })  // 사용자
}
```

- 도메인별 헬퍼 8종: `reportAuthError` / `reportFirestoreError` / `reportAIError` /
  `reportTTSError` / `reportStorageError` / `reportApiError` / `reportBoundaryError`
- `ErrorBoundary`는 react-error-boundary 기반 — `<ErrorBoundary boundaryName="xxx">`로 써요
- **사용자 취소는 보고하지 않아요** — 팝업 닫기(`popup-closed`), 비밀번호 오류, `AbortError`.
  이건 버그가 아니라 정상 흐름이거든요.
- DSN 미설정 시 자동 no-op

---

## 7. 외부 의존은 전부 선택적이에요

| 미설정 시 | 동작 |
|---|---|
| Firebase | 로컬(localStorage) 저장만으로 정상 동작 |
| Gemini | AI 화면에 안내 메시지 (앱 크래시 없음) |
| Murf.ai | 브라우저 내장 TTS로 폴백 |
| Sentry | no-op |

토이 프로젝트지만 이 원칙 덕분에 **아무 키 없이 클론해서 바로 돌려볼 수 있어요.**

---

## 8. UI 계층 함정

- **Tailwind v4는 `tailwind.config.js`가 없어요.** `src/index.css`의 `@theme`이 토큰 소스예요.
  shadcn CLI가 v4와 호환되지 않아 컴포넌트는 수동 설치했어요.
- **Framer Motion + Tailwind width**: `flex items-center justify-center` 부모 안의
  `motion.div`에서 `w-full` / `max-w-sm`이 무시될 수 있어요. 증상은 **텍스트가 세로로
  한 글자씩** 나오는 거예요. 인라인 스타일로 명시하면 돼요.
- 모든 Dialog에 `DialogTitle` 필수예요 (접근성).

---

## 9. 모듈별 문서

각 디렉토리(`lib/`, `components/`, `hooks/`, `data/`, `pages/`)에 `CLAUDE.md`가 있고,
프로젝트 룰은 `.claude/rules/{error-handling,design-system,data-patterns}.md`에 있어요.
