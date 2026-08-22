# Pages

라우트별 페이지 컴포넌트. `App.tsx`에서 `React.lazy` + `Suspense`로 코드 스플릿.

## 라우트 목록

### 메인 탭 (5)
| 경로 | 페이지 | 비고 |
|------|--------|------|
| `/` | HomePage | 테마/홈레이아웃에 따라 4종 분기 |
| `/dictionary` | DictionaryPage | 무한스크롤 + 디바운스 검색 |
| `/conversation` | ConversationPage | 17 카테고리 그리드 + AI FAB |
| `/stats` | StatisticsPage | 히트맵 + JLPT 진척도 + 약점 분석 |
| `/settings` | SettingsPage | 외관/알림/계정 |

### 학습
| 경로 | 페이지 |
|------|--------|
| `/learn` | LearningPage — 20문제 + Lottie 정답 효과 + 이어하기 |
| `/result` | ResultPage |
| `/wrong-words` | WrongWordsPage |
| `/kana` | KanaChartPage |
| `/kana-game` | KanaGamePage — 5열 그리드, 10→9 자동 재생 |
| `/kanji` | KanjiPage — WORDS에서 자동 추출 |

### 콘텐츠
| 경로 | 페이지 |
|------|--------|
| `/reading`, `/reading/:id` | ReadingPage / ReadingDetailPage |
| `/reading/ai` | AIReadingPage — Gemini로 짧은 글 생성 |
| `/songs`, `/songs/:id` | SongsPage / SongDetailPage |
| `/writing` | WritingPage — AI 작문 첨삭 |
| `/mock`, `/mock/:level` | MockTestEntryPage / MockTestPage — JLPT 모의고사 |

### 회화 서브
| 경로 | 페이지 |
|------|--------|
| `/conversation/memo` | ConversationMemoPage — "단어"/"표현" 탭. 표현 탭 = 내 여행 키트(즐겨찾기 표현, 일괄 미리받기 포함). `state:{tab:'phrases'}`로 표현 탭 직행 (HomeTravel 키트 카드가 사용) |
| `/conversation/:categoryId` | ConversationDetailPage — 오프라인 발음 미리받기 버튼, 표현 별(키트) 토글, 검색 유입 시 `state:{phraseId}`로 카드 스크롤+하이라이트 |
| `/conversation/:categoryId/quiz` | ConversationQuizPage |

### 계정·설정 서브
| 경로 | 페이지 |
|------|--------|
| `/profile` | ProfilePage — 닉네임/통계/CSV 내보내기/**초기화·탈퇴** |
| `/account/delete` | AccountDeletePage |
| `/settings/appearance` | **AppearancePage** — 마스코트/테마/홈/다크모드 통합 |
| `/settings/notifications` | NotificationSettingsPage |

### 온보딩·기타
| 경로 | 페이지 |
|------|--------|
| `/splash` | SplashPage |
| `/onboarding/goal`, `/onboarding/ready` | OnboardingPages |
| `/login` | LoginPage (소셜 + 이메일) |
| `/terms`, `/privacy` | LegalPages |
| 404 | NotFoundPage |

## SettingsPage 구조

```
프로필 카드 (→ /profile)
일반
├─ ✨ 테마 설정 (→ /settings/appearance)
└─ 🔔 알림 설정 (→ /settings/notifications)
음성 (인라인)
지원 (이용약관·개인정보)
계정
└─ ⎋ 로그아웃
   "데이터 초기화·계정 탈퇴는 마이페이지에서 진행할 수 있어요"
```

**데이터 초기화는 ProfilePage 위험 영역으로 이동**. SettingsPage에는 로그아웃만.

## ProfilePage 위험 영역

```
↻ 학습 데이터 초기화 (다이얼로그 + 클라우드 동시 삭제 체크박스)
⚠ 계정 탈퇴 (→ /account/delete)
```

## AppearancePage 4개 섹션

1. 화면 모드 (다크 모드 토글)
2. 마스코트 (3종)
3. 테마 (7종 — d6-ink 잉크 포함)
4. 홈 화면 레이아웃 (6종, 테마와 독립)

## HomePage 분기

```ts
homeLayoutId === 'auto'
  ? themeToLayout(themeId)   // d2-mono/d6-ink → mono, d3-ios → ios, ...
  : homeLayoutId             // 사용자 명시 선택
```

레이아웃 변형 4종: `HomeDefaultOrMascot`, `HomeMono`, `HomeIos`, `HomeEditorial`.

## 페이지 공통 패턴

### 헤더 (서브페이지 — 뒤로가기 + 중앙 타이틀)
```tsx
<div className={`pt-6 pb-4 px-5 sticky top-0 z-10 transition-all duration-200 ${
  isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-sm'
             : 'bg-gradient-to-b from-primary/10 to-background'
}`}>
  <div className="flex items-center justify-between">
    <Button variant="ghost" size="icon" onClick={() => navigate('/parent')}>
      <ChevronLeft className="w-5 h-5" />
    </Button>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="font-semibold text-lg">제목</span>
    </div>
    <div className="w-10" />
  </div>
</div>
```

### 뒤로가기 규칙
- `navigate(-1)` **금지** (히스토리 순환 문제)
- 항상 명시적 부모 경로: `navigate('/settings')`, `navigate('/conversation')`

### 하단 네비 여백
탭이 있는 페이지: `pb-[88px]`

### Framer Motion width 이슈
```tsx
// ❌ Tailwind width 클래스가 무시될 수 있음
<motion.div className="w-full max-w-sm">
// ✅ 인라인 스타일
<motion.div style={{ width: '100%', maxWidth: '24rem' }}>
```

### 페이지 catch 정책
```tsx
try { ... }
catch (e) {
  reportXxxError(e, { operation: ... })   // Sentry
  toast.error({ message: '실패했어요...' }) // 사용자 피드백
}
```
사용자 취소(`popup-closed`, 비밀번호 오류 등)는 report 생략.
