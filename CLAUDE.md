# 니혼고 앱 (Nihongo App)

일본어 학습 앱 - 매일 조금씩 일본어를 배우는 귀여운 캐릭터 기반 학습 앱

## 기술 스택

- **프레임워크**: React 19 + Vite 7
- **언어**: TypeScript (strict mode)
- **스타일링**: Tailwind CSS v4 (@theme 기반, tailwind.config.js 없음)
- **UI 컴포넌트**: shadcn/ui (수동 설치)
- **상태관리**: Zustand + persist (localStorage)
- **라우팅**: React Router DOM v7
- **애니메이션**: Framer Motion
- **인증**: Firebase Auth (Google 기본, 카카오/네이버 OIDC, 이메일/비밀번호)
- **에러 트래킹**: Sentry (`@sentry/react`) + react-error-boundary
- **토스트**: react-hot-toast + 자체 `CustomToast` UI
- **AI**: Google Gemini (`@google/genai`) — 채팅/작문 첨삭/이야기 생성
- **아이콘**: Lucide React

## 프로젝트 구조

```
plans/                   # 작업 계획 문서 (워크플로우 실행 시 참조)
src/
├── App.tsx              # 라우터 및 인증 가드
├── main.tsx             # 엔트리포인트
├── store.ts             # Zustand 스토어 (persist, 이어하기 기능 포함)
├── types.ts             # TypeScript 타입 정의
├── constants.ts         # 레벨, XP 규칙 등 상수
├── index.css            # Tailwind v4 + shadcn 테마
├── assets/
│   └── lottie/          # Lottie 애니메이션 JSON 파일
│       └── success-check.json  # 정답 체크 애니메이션
├── lib/
│   ├── firebase.ts      # Firebase Auth (소셜 + 이메일)
│   ├── firestore.ts     # 4-doc 분리 동기화 (profile/state/srs/library)
│   ├── murf.ts          # Murf.ai TTS API (2계층 캐시: memory→IndexedDB→API, prefetchSpeech)
│   ├── audioCache.ts    # TTS 오디오 IndexedDB 영속 캐시 (db 'nihongo-tts', 실패 시 무해 폴백)
│   ├── quickSearch.ts   # ⌘K 검색 순수 로직 (단어 600 + 회화 표현 280)
│   ├── gemini.ts        # Gemini API (채팅/작문/이야기 생성)
│   ├── anthropic.ts     # Anthropic Claude API (옵션)
│   ├── themes.ts        # 7개 테마 + CSS 변수 주입
│   ├── toast.ts         # react-hot-toast 헬퍼
│   ├── srs.ts           # SuperMemo-2 SRS 알고리즘
│   ├── missions.ts      # 일일 미션 생성/검증
│   ├── notifications.ts # 로컬 알림 스케줄링
│   ├── answerMatcher.ts # 정답 매칭 (오탈자 허용)
│   ├── hiraganaToRomaji.ts
│   ├── utils.ts         # cn()
│   └── sentry/          # Sentry 통합 (init + 도메인 헬퍼 8종)
├── types/
│   └── lottie-light.d.ts    # lottie-web light 빌드 타입 정의
├── hooks/
│   ├── useTTS.ts        # TTS 훅 (Murf.ai + 브라우저 TTS)
│   └── useAIChat.ts     # AI 채팅 훅 (스트리밍, 메시지 관리)
├── components/
│   ├── ui/              # shadcn (Button, Card, Input, Progress, Dialog)
│   ├── chat/            # AI 튜터 채팅 (FAB, Modal, Message, JapaneseText)
│   ├── conversation/    # ClickablePhrase, PrefetchAudioButton (오프라인 발음 미리받기)
│   ├── home/            # HomeMono, HomeIos, HomeEditorial
│   ├── ErrorBoundary.tsx     # react-error-boundary + Sentry 자동 보고
│   ├── ConfirmDialog.tsx     # 확인 다이얼로그 + useConfirm 훅
│   ├── CustomToast.tsx       # 4종 토스트 UI
│   ├── Header.tsx
│   ├── BottomNav.tsx
│   ├── LevelBadge.tsx
│   ├── WeekCalendar.tsx, FullCalendarModal.tsx, HeatmapCalendar.tsx
│   ├── JLPTMastery.tsx, WeaknessChart.tsx
│   ├── MascotAvatar.tsx, MascotHeroCard.tsx
│   ├── DailyMissionWidget.tsx, StreakRewardModal.tsx
│   ├── HomeLayoutPicker.tsx, QuickAudioSettings.tsx
│   ├── PWAInstallPrompt.tsx, OnlineStatusToast.tsx
│   ├── ConversationMemoDrawer.tsx
│   ├── TTSButton.tsx, LottieLight.tsx
│   └── WrongWordsList.tsx
├── pages/
│   ├── LoginPage.tsx                # 소셜 + 이메일 로그인/회원가입
│   ├── SplashPage.tsx, OnboardingPages.tsx
│   ├── HomePage.tsx                 # 테마/레이아웃 4종 분기
│   ├── LearningPage.tsx, ResultPage.tsx
│   ├── DictionaryPage.tsx, StatisticsPage.tsx
│   ├── SettingsPage.tsx             # 외관/알림/계정 (초기화·탈퇴는 마이페이지)
│   ├── AppearancePage.tsx           # NEW — 마스코트/테마/홈/다크모드 통합
│   ├── NotificationSettingsPage.tsx
│   ├── ProfilePage.tsx              # 마이페이지 (초기화·탈퇴 진입)
│   ├── AccountDeletePage.tsx
│   ├── KanaChartPage.tsx, KanaGamePage.tsx
│   ├── KanjiPage.tsx                # WORDS에서 자동 추출
│   ├── WrongWordsPage.tsx
│   ├── ConversationPage.tsx, ConversationDetailPage.tsx
│   ├── ConversationMemoPage.tsx, ConversationQuizPage.tsx
│   ├── ReadingPage.tsx, ReadingDetailPage.tsx, AIReadingPage.tsx
│   ├── SongsPage.tsx, SongDetailPage.tsx
│   ├── WritingPage.tsx              # Gemini 작문 첨삭
│   ├── MockTestPage.tsx             # JLPT 모의고사 (Entry + 시험)
│   ├── ErrorScreens.tsx             # network/server/permission/maintenance/update
│   └── LegalPages.tsx, NotFoundPage.tsx
└── data/
    ├── words.ts             # 단어 사전 (words-n2/n1·words-ext 머지, 총 1,487개)
    ├── kana.ts
    ├── mascots.ts           # 코타로/유키/소라
    ├── conversations.ts     # base 11 카테고리
    ├── conversations-ext.ts # 확장 (5-6개씩 + 신규 3 카테고리)
    ├── reading.ts           # 짧은 글 10편
    └── songs.ts             # 동요 8곡
```

**회화 최종**: 17 카테고리 · **421표현** (base + ext + ext2 머지). 여행 코어 8개
카테고리(travel/accommodation/restaurant/cafe/convenience/shopping/transport/weather)는
각 **30표현** 보장 — `src/data/conversations.test.ts` 무결성 테스트가 하한·중복을 검사.
대화 시나리오(`dialogues.ts`)는 **15개**.
가이드 문서는 각 디렉토리 `CLAUDE.md` + 프로젝트 룰 `.claude/rules/`.

## 주요 명령어

```bash
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
npm run lint     # ESLint
```

## 환경 변수

`.env` 파일에 Firebase 설정 필요 (`.env.example` 참고):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GEMINI_API_KEY=     # AI 튜터·작문·읽기 생성 (Google Gemini)
VITE_MURF_API_KEY=       # 자연스러운 일본어 TTS (옵션, 미설정 시 브라우저 TTS)
VITE_SENTRY_DSN=         # 에러 트래킹 (옵션, 비우면 no-op)
VITE_APP_VERSION=        # Sentry release 추적용 (옵션)
```

- Firebase 미설정 시 "데모 모드"로 테스트 가능
- Gemini API 키 미설정 시 AI 채팅/작문/AI 읽기 버튼은 표시되지만 기능 비활성화
- Sentry DSN 미설정 시 모든 `reportXxxError` 호출은 no-op

## TTS (Text-to-Speech)

- **Murf.ai API**: 자연스러운 일본어 음성 (설정에서 선택 가능)
- **브라우저 TTS**: 폴백 옵션 (Web Speech API)
- **2계층 캐시**: 재생(`synthesizeSpeech`)은 memory Map(LRU 100) → IndexedDB(히트 시
  memory 승격) → API 순서. API 성공 시 양쪽에 기록 (data URL만 영속화)
- **오프라인 미리받기**: `prefetchSpeech`는 memory를 **우회**하고 IndexedDB에만 기록
  — 일괄 미리받기가 세션 hot 캐시를 밀어내지 않게 함. 카테고리별 버튼은
  `PrefetchAudioButton` (진행률 = IDB 키 존재 수, `countCachedTexts`로 표현 기준 카운트
  — 문장 중복 시 캐시 키 공유 주의)
- **iOS 주의**: Safari는 7일 미사용 시 IndexedDB 축출 — 미리받기 완료 시
  `navigator.storage.persist()` 요청 + PWA 설치 안내 1회. 캐시 소실 시 브라우저 TTS로
  무증상 degrade
- **컴포넌트**: `TTSButton` - 로딩/재생 상태 표시가 포함된 재사용 버튼
- **훅**: `useTTS` - isLoading, isSpeaking 상태 제공

```tsx
// TTSButton 사용 예시
<TTSButton text="こんにちは" label="발음 듣기" variant="outline" />

// useTTS 훅 직접 사용
const { speak, isLoading, isSpeaking } = useTTS()
```

## 코드 컨벤션

- **경로 alias**: `@/` → `src/`
- **컴포넌트**: 함수형 + named export
- **스타일**: Tailwind 유틸리티 클래스, cn() 사용
- **상태**: Zustand selector 패턴 사용
- **타입**: 인터페이스 우선, 엄격한 타입 지정
- **애니메이션**: 모든 애니메이션은 Framer Motion 사용 (CSS animation 사용 금지)
  - 페이지 전환, 컴포넌트 등장/퇴장, 로딩 상태 등
  - `AnimatePresence`로 퇴장 애니메이션 처리
  - 예시: `<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />`

## 일본어 텍스트 표시 규칙 (필수)

**모든 일본어 텍스트는 반드시 후리가나(히라가나)와 로마자를 함께 표시한다.**

### 기본 표시 형식
```
한자/가타카나
히라가나 (후리가나)
romaji (로마자)
```

### 단어별 띄어쓰기
- 예문이나 문장은 **단어별로 띄어쓰기**하여 음절 구분
- 데이터: `reading: 'ほんを かいます。'` (띄어쓰기 포함)
- 로마자: `hiraganaToRomaji(reading)` → `honwo kaimasu。`

### 컴포넌트 패턴
```tsx
// 단어별 세로 정렬 (회화, 퀴즈 등)
<div className="flex flex-wrap items-end gap-1">
  {phrase.words.map((word) => (
    <div className="inline-flex flex-col items-center">
      <span className="text-base font-medium">{word.text}</span>
      <span className="text-[10px] text-muted-foreground">{word.reading}</span>
      <span className="text-[9px] text-muted-foreground/70">
        {hiraganaToRomaji(word.reading)}
      </span>
    </div>
  ))}
</div>

// 단순 표시 (사전, 학습 등)
<div className="flex flex-col items-center">
  <span className="font-bold text-xl">{word.kanji}</span>
  <span className="text-[11px] text-muted-foreground">{word.hiragana}</span>
  <span className="text-[10px] text-muted-foreground/70">
    {hiraganaToRomaji(word.hiragana)}
  </span>
</div>
```

### 데이터 구조
```typescript
// 단어 예문 (words.ts)
example: {
  japanese: '本を買います。',
  korean: '책을 삽니다.',
  targetWord: '買い',
  reading: 'ほんを かいます。'  // 필수! 띄어쓰기 포함
}

// 회화 표현 (conversations.ts)
words: [
  { text: '本', reading: 'ほん', meaning: '책' },
  { text: 'を', reading: 'を', meaning: '을/를', isParticle: true },
  { text: '買います', reading: 'かいます', meaning: '삽니다' },
]
```

### 적용 페이지
- LearningPage: 단어 + 예문
- DictionaryPage: 단어 목록
- ConversationDetailPage: 회화 표현
- ConversationQuizPage: 퀴즈 선택지
- ConversationMemoPage: 저장된 단어
- WrongWordsList: 오답노트

## 디자인 시스템 (Airbnb 스타일)

### 색상 원칙
- **Primary 색상 중심**: 전체 UI를 `primary` (Airbnb Coral #FF5A5F) 색상으로 통일
- **다른 색상 사용 금지**: orange, yellow, blue 등 개별 색상 사용하지 않음
- **예외**: 정답(green), 오답(red), 위험 액션(destructive)만 허용

### 색상 사용 패턴
```tsx
// ✅ 올바른 사용
<div className="bg-primary/10" />           // 배경 (10% 투명도)
<div className="text-primary" />            // 텍스트
<div className="border-primary/20" />       // 테두리
<div className="ring-primary" />            // 포커스 링

// ❌ 잘못된 사용
<div className="bg-orange-100" />           // 개별 색상 사용 금지
<div className="text-blue-500" />           // 개별 색상 사용 금지
<div className="bg-yellow-100" />           // 개별 색상 사용 금지
```

### 페이지 헤더 패턴

**기본 탭 페이지 헤더** (사전, 회화, 통계, 설정):
- 스티키 헤더 + 스크롤 시 배경/그림자 변경
- 타이틀 + 서브텍스트 인라인 표시

```tsx
const [isScrolled, setIsScrolled] = useState(false)

useEffect(() => {
  const handleScroll = () => setIsScrolled(window.scrollY > 10)
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

<div className={`pt-6 pb-4 px-5 sticky top-0 z-10 transition-all duration-200 ${
  isScrolled
    ? 'bg-background/95 backdrop-blur-sm shadow-sm'
    : 'bg-gradient-to-b from-primary/10 to-background'
}`}>
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-2"
  >
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div>
      <span className="font-semibold text-lg">제목</span>
      <span className="text-sm text-muted-foreground ml-2">서브텍스트</span>
    </div>
  </motion.div>
</div>
```

**서브페이지 헤더** (뒤로가기 버튼 + 중앙 타이틀):
```tsx
<div className={`pt-6 pb-4 px-5 sticky top-0 z-10 transition-all duration-200 ${
  isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-sm' : 'bg-gradient-to-b from-primary/10 to-background'
}`}>
  <div className="flex items-center justify-between">
    <Button variant="ghost" size="icon" onClick={() => navigate('/parent-route')}>
      <ChevronLeft className="w-5 h-5" />
    </Button>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="font-semibold text-lg">제목</span>
    </div>
    <div className="w-10" /> {/* 우측 여백 맞춤 */}
  </div>
</div>
```

**뒤로가기 규칙**:
- `navigate(-1)` 사용 금지 (히스토리 순환 문제)
- 항상 명시적인 부모 경로로 이동: `navigate('/dictionary')`, `navigate('/conversation')`

### 라우트 변경 시 스크롤 초기화

App.tsx에 ScrollToTop 컴포넌트 적용:
```tsx
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// BrowserRouter 내부에 배치
<BrowserRouter>
  <ScrollToTop />
  <Routes>...</Routes>
</BrowserRouter>
```

페이지 내 탭 전환 시 (예: KanaChartPage 히라가나/카타카나):
```tsx
useEffect(() => {
  window.scrollTo(0, 0)
}, [kanaType])

### 카드 내 아이콘 패턴
```tsx
<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
  <Icon className="w-4 h-4 text-primary" />
</div>
```

### 팝업/다이얼로그 크기
```tsx
// 모바일 최적화 크기
<DialogContent className="w-[calc(100vw-32px)] max-w-[360px]">
```

### Border Radius
- 기본: `rounded-xl` (12px)
- 작은 요소: `rounded-lg` (8px)
- 큰 카드: `rounded-2xl` (16px)
- 원형: `rounded-full`

### 하단 여백
- 하단 네비게이션이 있는 페이지: `pb-[88px]`

## 작업 계획

- 모든 작업 계획은 `plans/` 폴더에 마크다운 파일로 저장
- `/workflows:work` 명령어 실행 시 해당 폴더의 계획 문서 참조
- 계획 파일 예시: `plans/feature-name.md`

## 단어 데이터

- **총 1,487개** (2026-07-10 완전 중복 71건 정리 후): JLPT N5~N1
  (`words.ts` + `words-n2.ts` + `words-n1.ts`) + 회화 토큰 자동 추출(`CONV_WORDS`,
  JLPT와 kanji+hiragana 겹치면 제외)
- 예문은 N5 전수 + 일부(`words-ext.ts` 머지). 예문 없는 단어는 조건부 렌더링
- **같은 단어(한자+히라가나+뜻)는 하나의 항목·하나의 레벨로만** —
  `src/data/words.test.ts` 무결성 테스트가 중복·id 충돌·필드 누락을 검사

## 학습 이어하기 기능

- 학습 중간에 나가면 세션이 자동 저장됨 (localStorage)
- 24시간 이내에 재진입 시 "학습 이어하기" 버튼 표시
- store의 `savedLearning` 상태로 관리

```tsx
// store.ts
interface SavedLearningState {
  session: Session
  wordIds: string[]   // 단어 id만 저장 — 복원 시 현재 데이터로 재조회 (resolveWordsByIds)
  savedAt: number // timestamp, 24시간 만료
}

// 액션
saveLearning(words)      // 세션 저장
resumeLearning()         // 세션 복원
clearSavedLearning()     // 저장된 세션 삭제
```

## Lottie 애니메이션

- **패키지**: `lottie-web` (light 빌드 사용 - 번들 크기 최적화)
- **위치**: `src/assets/lottie/`
- **컴포넌트**: `src/components/LottieLight.tsx` - 경량 Lottie 래퍼
- **타입 정의**: `src/types/lottie-light.d.ts`
- **정답 효과**: 화면 플래시 (bg-green-400/20) + 체크마크 Lottie 애니메이션

```tsx
import { LottieLight } from '@/components/LottieLight'
import successCheckAnimation from '@/assets/lottie/success-check.json'

<LottieLight animationData={successCheckAnimation} loop={false} />
```

## 사전 페이지 최적화

- **디바운싱**: `useDeferredValue`로 검색 입력 최적화
- **무한스크롤**: Intersection Observer로 20개씩 로드
- 검색 중 상태 시각적 피드백 (opacity 60%)

## 로마자(Romaji) 표시

> ⚠️ **중요**: "일본어 텍스트 표시 규칙" 섹션 참고 - 모든 일본어는 후리가나+로마자 필수

- 모든 단어/예문 표시 화면에서 히라가나 아래에 영문 발음(로마자) 표시
- `src/lib/hiraganaToRomaji.ts` 유틸리티 사용
- 적용 페이지:
  - LearningPage (단어 학습 + 예문)
  - WrongWordsList (오답노트)
  - DictionaryPage (단어 사전)
  - ConversationDetailPage (회화 표현)
  - ConversationQuizPage (퀴즈 선택지)
  - ConversationMemoPage (저장된 단어)
  - 오답 팝업 모달

```tsx
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'

// 예: "たべる" -> "taberu"
<p className="text-sm text-muted-foreground/70">
  {hiraganaToRomaji(word.hiragana)}
</p>
```

## 예문 힌트 블록 처리

- 학습 중 예문의 한국어 해석에서 정답에 해당하는 부분을 블록 처리
- 한국어 문장 끝의 동사/형용사를 `bg-primary/70`로 숨김
- 예: "공원에서 놉니다." → "공원에서 [블록]."

```tsx
// LearningPage.tsx의 blockMeaningInKorean 함수
<span className="bg-primary/70 text-primary/70 rounded-sm px-0.5 select-none">
  {verb}
</span>
```

## 카나 게임 (KanaGamePage)

- **레이아웃**: CSS Grid 5열 배치 (버튼 겹침 방지)
- **음성 재생**: 타이머 10→9 시점에 자동 재생
- **피드백 화면**: 음성 없이 문자 + 로마자 + 한국어 발음 표시

## 회화 기능 (Conversation)

상황별 일본어 회화 표현 학습 기능

### 구조
- **17개 카테고리**: 여행 코어 8(여행·숙소·식당·카페·편의점·쇼핑·대중교통·날씨, 각 30표현) + 일하기·건강·공부·감정·가족·학교·인사·자기소개·응급
- **421개 표현** + 대화 시나리오 15개 (`dialogues.ts`)
- **5개 탭 내비게이션**: 홈, 사전, **회화**, 통계, 설정

### 라우트
```
/conversation              # 카테고리 목록
/conversation/:categoryId  # 표현 목록
/conversation/:categoryId/quiz  # 퀴즈
/conversation/memo         # 메모 (저장된 단어)
```

### 데이터 구조 (conversations.ts)
```typescript
interface ConversationWord {
  text: string        // "レストラン"
  reading: string     // "れすとらん"
  meaning: string     // "레스토랑"
  isParticle?: boolean // 조사 여부
}

interface ConversationPhrase {
  id: string
  japanese: string    // "レストランを探しています"
  korean: string      // "레스토랑을 찾고 있습니다"
  words: ConversationWord[]  // 단어 토큰화
  level: 'N5' | 'N4' | 'N3'
}

interface ConversationCategory {
  id: string
  nameKo: string      // "식당"
  nameJa: string      // "レストラン"
  icon: string        // Lucide 아이콘명
  phrases: ConversationPhrase[]
}
```

### 주요 기능
1. **단어 클릭 → 메모 저장**: 표현에서 단어를 탭하면 메모에 저장
2. **메모 → 사전 연동**: 저장된 단어 클릭 시 사전 페이지로 이동
3. **퀴즈 모드**: 4지선다, 10문제, 정답당 +10 XP
4. **조사 처리**: 조사(を, に, は)는 클릭해도 저장 불가 안내

### 스토어 (store.ts)
```typescript
conversationMemo: SavedConversationWord[]
addConversationMemo: (word) => void
removeConversationMemo: (wordText) => void

// 표현 즐겨찾기 — "내 여행 키트" (ConversationMemoPage의 "표현" 탭에서 열람)
favoritePhrases: FavoritePhrase[]   // {id, categoryId, addedAt}
toggleFavoritePhrase: (phraseId, categoryId) => void
```

## AI 채팅 기능 (AI Tutor)

회화 탭에서 플로팅 버튼을 통해 접근하는 일본어 학습 AI 튜터

### 핵심 기능
- **플로팅 버튼 (FAB)**: 회화 페이지 우하단에 위치, 클릭 시 채팅 모달 오픈
- **일본어 Q&A**: 번역, 단어 뜻, 문법 설명 등 일본어 관련 질문에 답변
- **스트리밍 응답**: 실시간 타이핑 효과로 응답 표시
- **리사이즈/확장**: 모달 크기 조절 및 전체화면 확장 가능
- **최소화 애니메이션**: Framer Motion LayoutGroup으로 FAB ↔ 모달 전환 애니메이션
- **단발성**: 세션 종료 시 대화 삭제 (localStorage 저장 안 함)

### 컴포넌트 구조
```
src/components/chat/
├── ChatFAB.tsx       # 플로팅 버튼 (bottom-24 right-5, layoutId 공유)
├── ChatModal.tsx     # 채팅 모달 (리사이즈, 확장, layoutId 공유)
└── ChatMessage.tsx   # 메시지 버블 (사용자/AI 구분)

src/lib/gemini.ts     # Google Gemini API 클라이언트
src/hooks/useAIChat.ts # 채팅 상태 관리 훅
```

### API (Google Gemini)
- **SDK**: `@google/genai`
- **모델**: `gemini-2.0-flash` (또는 설정된 모델)
- **Rate Limit 처리**: 429 에러 시 친절한 한국어 메시지 표시

### 사용 예시
```tsx
// ConversationPage에 이미 통합됨
const [isChatOpen, setIsChatOpen] = useState(false)
const [hasNewMessage, setHasNewMessage] = useState(false)

<LayoutGroup>
  <ChatFAB onClick={() => setIsChatOpen(true)} hasNewMessage={hasNewMessage} isOpen={isChatOpen} />
  <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} onNewMessage={setHasNewMessage} />
</LayoutGroup>
```

### 환경 설정
```
VITE_GEMINI_API_KEY=AIzaSy...
```

API 키 미설정 시 UI에 안내 메시지 표시 (앱 크래시 없음)

## 주의사항

- Tailwind CSS v4는 `tailwind.config.js` 대신 `src/index.css`의 `@theme` 사용
- shadcn CLI가 Tailwind v4와 호환되지 않아 컴포넌트 수동 설치함
- Firebase 미설정 시에도 앱이 크래시하지 않도록 처리됨
- 모든 Dialog에는 접근성을 위해 DialogTitle 필수
- **Framer Motion width 이슈**: `motion.div`에 Tailwind width 클래스(`w-full`, `max-w-sm` 등)가 적용 안 될 수 있음
  - **증상**: 텍스트가 세로로 한 글자씩 표시됨 (width가 0에 가깝게 축소)
  - **발생 조건**: `flex items-center justify-center` 부모 안에서 `motion.div` 사용 시
  - **해결**: Tailwind 클래스 대신 **인라인 스타일** 사용
  ```tsx
  // ❌ 잘못된 사용 (width가 무시될 수 있음)
  <motion.div className="w-full max-w-sm">

  // ✅ 올바른 사용 (인라인 스타일)
  <motion.div style={{ width: '100%', maxWidth: '24rem' }}>
  ```
- **flex 레이아웃 중앙 정렬**: `flex items-center justify-center` 사용 시 자식 너비 이슈
  - **증상**: 자식 요소의 너비가 컨텐츠에 맞춰 축소됨
  - **해결 1**: 부모에 `flex-col` 추가
  - **해결 2**: 자식에 `w-full` + 인라인 스타일로 명시적 width 지정
  ```tsx
  // ✅ flex-col 추가
  <div className="flex flex-col items-center justify-center">
    <motion.div style={{ width: '100%', maxWidth: '24rem' }}>

  // ✅ 또는 자식에 w-full + 인라인 스타일
  <div className="flex items-center justify-center w-full">
    <motion.div className="w-full" style={{ maxWidth: '24rem' }}>
  ```

## 에러 처리 / Sentry

이 프로젝트의 모든 catch 블록은 **사용자 피드백 + Sentry 보고**를 함께 처리합니다.

```ts
import { reportAuthError } from '@/lib/sentry'
import { toast } from '@/lib/toast'

try { /* ... */ }
catch (e) {
  reportAuthError(e, { operation: 'signin', provider: 'google' })  // Sentry
  toast.error({ message: '로그인에 실패했어요. 다시 시도해 주세요.' }) // 사용자
}
```

- 도메인별 헬퍼: `reportAuthError / reportFirestoreError / reportAIError / reportTTSError / reportStorageError / reportApiError / reportBoundaryError`
- ErrorBoundary는 react-error-boundary 기반 — `<ErrorBoundary boundaryName="xxx">`로 사용
- 사용자 취소(`popup-closed`, 비밀번호 오류, `AbortError`)는 Sentry 보고 생략
- DSN 미설정 시 자동 no-op (`VITE_SENTRY_DSN`)
- 상세 규칙: `.claude/rules/error-handling.md`

## 디자인·데이터 패턴 룰

프로젝트 룰은 `.claude/rules/`에 정리되어 있습니다.

| 파일 | 내용 |
|------|------|
| `error-handling.md` | catch 표준 패턴, 헬퍼 매핑, 보고 생략 케이스 |
| `design-system.md` | 색상 토큰, 7개 테마, 일본어 표시 규칙, Framer Motion 주의 |
| `data-patterns.md` | 회화 ext 분리, Firestore 4-doc, persist 키, 사용자 격리 데이터 |

각 디렉토리(`lib/`, `components/`, `hooks/`, `data/`, `pages/`)에도 `CLAUDE.md`가 있어 모듈별 상세 사용법을 담고 있습니다.

## 문서 규약

사람이 읽는 문서(`README*.md`, `docs/**/*.md`)는 guk-lab 공통 규약을 따른다.
정본은 `~/sonix/toy/guk-lab-docs` — 복사하지 않고 가리킨다.

- 톤: `guk-lab-docs/STYLE.md` — 본문 습니다체, 헤드 요약·표 셀은 명사형,
  헤딩은 기술 명사구, 수치에는 측정 시점 병기.
- 다이어그램: `guk-lab-docs/harness/skills/doc-diagrams/SKILL.md` —
  `docs/diagrams/<name>.mmd` 가 정본, 색은 의미(core/view/store/external/tool),
  점선은 런타임 밖 경로에만.
- 브랜치·PR: `guk-lab-docs/playbooks/branching.md` — main 직접 커밋 금지,
  develop 에 쌓고 PR 로 합친다.
- `README.md` 를 고치면 `README.en.md` 도 같은 커밋에서 고친다.
