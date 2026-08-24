# 니혼고 (Nihongo App)

> **About (EN)** — A Japanese-learning PWA built around a cute mascot companion.
> It combines an SM-2 spaced-repetition core with kana/kanji drills, conversation
> and reading libraries, JLPT mock tests, and Gemini-powered AI tutoring
> (chat, writing correction, generated stories). Audio is cached offline in
> IndexedDB so pronunciation works without a network. React 19 + Vite + Firebase.

매일 조금씩 일본어를 배워요. 귀여운 마스코트 캐릭터와 함께하는 학습 앱이에요.

SM-2 간격반복(SRS)을 코어로 하고, 가나·한자 드릴, 회화·독해 라이브러리, JLPT 모의고사,
그리고 Gemini 기반 AI 튜터(채팅 · 작문 첨삭 · 이야기 생성)를 얹었어요.
발음 오디오는 IndexedDB에 영속 캐시돼서 오프라인에서도 들을 수 있어요.

---

## 스크린샷

| 홈 (마스코트) | 학습 | AI 튜터 채팅 |
|---|---|---|
| <img src="homepage-with-mascot.png" width="240"> | <img src="learning-with-mascot.png" width="240"> | <img src="chat-with-mascot.png" width="240"> |

| 오답 피드백 | 음성 모드 | 마스코트 선택 |
|---|---|---|
| <img src="learning-wrong-answer.png" width="240"> | <img src="voice-mode-listening.png" width="240"> | <img src="settings-mascot-selection.png" width="240"> |

---

## 실행

```bash
npm install
npm run dev        # 개발 서버 (http://localhost:5000)
npm run build      # tsc -b && vite build
npm run lint
npm test           # Vitest
npm run test:ui    # Vitest UI
```

### 환경 변수

```
VITE_GEMINI_API_KEY=      # Google Gemini (AI 채팅 · 작문 첨삭 · 이야기 생성)
VITE_FIREBASE_*=          # Firebase (Auth · Firestore)
VITE_SENTRY_DSN=          # Sentry (미설정 시 자동 no-op)
```

**모든 외부 연동은 미설정 상태에서도 앱이 크래시하지 않아요.** Firebase가 없으면
로컬 저장만으로 동작하고, Gemini 키가 없으면 UI에 안내 메시지를 띄워요.

---

## 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 프레임워크 | React 19 + Vite 7 |
| 언어 | TypeScript (strict) |
| 스타일 | Tailwind CSS v4 (`@theme` 기반 — `tailwind.config.js` 없음) |
| UI | shadcn/ui (수동 설치) |
| 상태 | Zustand + persist (localStorage) |
| 라우팅 | React Router DOM v7 |
| 애니메이션 | Framer Motion · Lottie |
| 인증 | Firebase Auth (Google · 카카오/네이버 OIDC · 이메일) |
| 데이터 | Firestore (4-doc 분리 동기화) + IndexedDB (`idb`) |
| AI | Google Gemini (`@google/genai`) |
| TTS | Murf.ai (2계층 캐시) + 브라우저 TTS 폴백 |
| 에러 | Sentry + react-error-boundary |
| 배포 | Netlify (`netlify.toml`) / Firebase Hosting |

---

## 주요 기능

| 영역 | 내용 |
|---|---|
| **학습 코어** | SM-2 간격반복(SRS), 오답 노트, 일일 미션, 연속 학습 스트릭, XP/레벨 |
| **콘텐츠** | 단어 사전(N5~N1 레벨별 + 확장 파일 머지), 가나 차트/게임/연습, 한자(단어에서 자동 추출)/연습, 문법, 관용구, 회화(카테고리별) · 독해 · 동요 · 롤플레이 시나리오 |
| **AI** | 튜터 채팅(스트리밍), 작문 첨삭, AI 독해 지문 생성, AI 회화 |
| **시험** | JLPT 모의고사, JLPT 숙련도 · 약점 차트 |
| **개인화** | 마스코트 3종(코타로/유키/소라) + 의상, 테마 7종, 홈 레이아웃 4종, 다크모드 |
| **통계** | 히트맵 캘린더, 주간 캘린더, 업적 배지 |
| **오프라인** | TTS 오디오 IndexedDB 캐시, PWA 설치, 온라인 상태 토스트 |
| **검색** | ⌘K 퀵서치 (단어 + 회화 표현 통합 인덱스, `lib/quickSearch.ts`) |

---

## 프로젝트 구조

```
src/
├── App.tsx              라우터 + 인증 가드
├── store.ts             Zustand (persist, 이어하기 포함)
├── constants.ts         레벨 · XP 규칙
├── lib/
│   ├── firebase.ts      Auth (소셜 + 이메일)
│   ├── firestore.ts     4-doc 분리 동기화 (profile / state / srs / library)
│   ├── srs.ts           SuperMemo-2 알고리즘
│   ├── murf.ts          TTS API — 2계층 캐시 (memory → IndexedDB → API) + prefetch
│   ├── audioCache.ts    TTS 오디오 IndexedDB 영속 캐시 (실패 시 무해 폴백)
│   ├── gemini.ts        Gemini (채팅 · 작문 · 이야기)
│   ├── quickSearch.ts   ⌘K 검색 순수 로직
│   ├── answerMatcher.ts 정답 매칭 (오탈자 허용)
│   ├── missions.ts · notifications.ts · themes.ts · hiraganaToRomaji.ts
│   └── sentry/          도메인별 에러 보고 헬퍼 8종
├── data/                순수 콘텐츠 — words(+n1/n2/ext) · kana · kanji · grammar · idioms
│                        conversations(+ext) · reading(+ext) · songs(+ext)
│                        dialogues · roleplay-scenarios · mascots · achievementBadges
├── hooks/               useTTS · useAIChat
├── components/          ui(shadcn) · chat · conversation · home
│                        ErrorBoundary · CustomToast · ConfirmDialog · 위젯 다수
└── pages/               40여 페이지 (학습 · 사전 · 통계 · 설정 · 회화 · 독해 · 시험 …)
plans/                   작업 계획 문서
docs/                    PROJECT_STATUS.md 등
```

각 디렉토리(`lib/`, `components/`, `hooks/`, `data/`, `pages/`)에 모듈별 `CLAUDE.md`가 있어요.

---

## 아키텍처

상세는 **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** 참조. 요점만:

1. **콘텐츠는 코드 안의 순수 데이터예요.** `src/data/*.ts`가 단어·회화·독해·동요를
   들고 있고, base와 `-ext` 파일을 머지해요. 콘텐츠 추가는 데이터 편집으로 끝나요.
2. **Firestore는 4-doc으로 분리해요** (profile / state / srs / library) — 자주 바뀌는
   것과 안 바뀌는 것을 갈라서 쓰기 비용과 충돌을 줄여요.
3. **TTS는 3계층 캐시예요** — memory → IndexedDB → API. 캐시가 실패해도 무해하게 폴백해요.
4. **모든 catch는 사용자 피드백 + Sentry 보고를 함께 해요.** 도메인별 헬퍼 8종이 있고,
   사용자 취소(팝업 닫기 · 비밀번호 오류 · `AbortError`)는 보고를 생략해요.

---

## 문서

| 문서 | 내용 |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 아키텍처 — 저장소 3층 · SRS · Firestore 4-doc · TTS 캐시 |
| [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) | 기능별 완료 현황 체크리스트 |
| [TODOS.md](TODOS.md) | 남은 작업 |
| [CLAUDE.md](CLAUDE.md) | 작업 규칙 (+ 각 디렉토리에 모듈별 `CLAUDE.md`) |
| [docs/mascot-costume-prompts.md](docs/mascot-costume-prompts.md) | 마스코트 의상 생성 프롬프트 |
| `plans/` | 기능별 작업 계획 — 진행 중 1건 + `completed/` 12건. **로컬 전용**(`.gitignore`)이라 이 레포에는 없다 |

## 프로젝트 룰

`.claude/rules/`에 정리되어 있어요.

| 파일 | 내용 |
|---|---|
| `error-handling.md` | catch 표준 패턴, 헬퍼 매핑, 보고 생략 케이스 |
| `design-system.md` | 색상 토큰, 테마 7종, 일본어 표시 규칙, Framer Motion 주의 |
| `data-patterns.md` | 회화 ext 분리, Firestore 4-doc, persist 키, 사용자 격리 데이터 |

---

## 알려진 함정

- **Tailwind v4는 `tailwind.config.js`를 안 써요** — `src/index.css`의 `@theme`을 써요.
  shadcn CLI가 v4와 호환되지 않아 컴포넌트는 수동 설치했어요.
- **Framer Motion + Tailwind width**: `flex items-center justify-center` 부모 안의
  `motion.div`에 `w-full` / `max-w-sm` 같은 클래스가 무시될 수 있어요.
  증상은 **텍스트가 세로로 한 글자씩** 나오는 거예요(width가 0에 수렴). 인라인 스타일로 지정하면 돼요.
  ```tsx
  // ❌ <motion.div className="w-full max-w-sm">
  // ✅ <motion.div style={{ width: '100%', maxWidth: '24rem' }}>
  ```
- 모든 Dialog에는 접근성을 위해 `DialogTitle`이 필수예요.

---

## 라이선스

**Source-available — 오픈소스가 아니에요.** 코드를 읽을 수 있게 공개했을 뿐,
사용 권한을 준 건 아니에요. 다른 프로젝트에 가져다 쓰거나 재배포·상업적 이용을
하려면 사전 서면 허락이 필요해요. 전문은 [LICENSE](LICENSE), 한국어 안내는 [LICENSE.ko.md](LICENSE.ko.md) 참조.

