# Components

재사용 UI 컴포넌트 모음

## 디렉토리

```
components/
├── ui/                    # shadcn 기반 (Button, Card, Input, Progress, Dialog 등)
├── chat/                  # AI 튜터 채팅 (ChatFAB, ChatModal, ChatMessage, JapaneseText)
├── conversation/          # 회화 (ClickablePhrase, PrefetchAudioButton — 오프라인 발음 미리받기)
├── home/                  # 홈 레이아웃 변형 (HomeMono, HomeIos, HomeEditorial, HomeTravel — 여행 우선 + 내 여행 키트 카드)
├── ErrorBoundary.tsx      # react-error-boundary + Sentry 자동 보고
├── ConfirmDialog.tsx      # 확인 다이얼로그 컴포넌트 + useConfirm 훅
├── CustomToast.tsx        # 4종 토스트 (success/error/warning/info)
├── Header.tsx             # 상단 헤더 (뒤로가기, 진행바)
├── BottomNav.tsx          # 5탭 하단 네비
├── MascotAvatar.tsx       # 마스코트 아이콘 + 반응 애니메이션
├── MascotHeroCard.tsx     # 마스코트 큰 카드 (말풍선)
├── LevelBadge.tsx
├── WeekCalendar.tsx       # 7일 학습 캘린더
├── FullCalendarModal.tsx  # 월간 캘린더 모달
├── HeatmapCalendar.tsx    # 365일 히트맵
├── JLPTMastery.tsx        # JLPT 레벨별 진척도
├── WeaknessChart.tsx      # 약점 단어 분석
├── DailyMissionWidget.tsx # 일일 미션 위젯
├── StreakRewardModal.tsx  # 스트릭 보상 모달
├── HomeLayoutPicker.tsx   # 홈 레이아웃 선택
├── QuickAudioSettings.tsx # 헤더 음성 설정 팝오버
├── PWAInstallPrompt.tsx
├── OnlineStatusToast.tsx
├── ConversationMemoDrawer.tsx
├── TTSButton.tsx
├── LottieLight.tsx        # 경량 Lottie 래퍼
└── WrongWordsList.tsx
```

## ErrorBoundary

`react-error-boundary` 기반. Sentry로 자동 보고 + 기본 fallback (`<ErrorScreen kind="server">`).

```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

<ErrorBoundary boundaryName="root">
  <App />
</ErrorBoundary>

// 영역별 fallback 커스텀
<ErrorBoundary
  boundaryName="learning-page"
  FallbackComponent={({ resetErrorBoundary }) => (
    <MyFallback onReset={resetErrorBoundary} />
  )}
>
  ...
</ErrorBoundary>
```

`boundaryName`은 Sentry 태그 `component`로 노출되어 어느 영역에서 잡았는지 식별.

## ConfirmDialog / useConfirm

native `confirm()` 대체. 두 가지 사용 패턴.

```tsx
// 1) 컴포넌트 props 방식
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="시험을 중단할까요?"
  description="진행 상황은 사라져요."
  tone="destructive"
  onConfirm={handleExit}
/>

// 2) Hook (Promise) 방식 — 권장
const { confirm, dialog } = useConfirm()

const ok = await confirm({
  title: '학습 데이터 초기화',
  description: '이 작업은 되돌릴 수 없습니다.',
  confirmText: '초기화',
  tone: 'destructive',
})
if (ok) await handleReset()

return (<>{dialog}{/* 페이지 내용 */}</>)
```

`tone='destructive'`면 ⚠ 아이콘과 빨간 CTA 버튼 표시.

## CustomToast (lib/toast.ts와 함께 사용)

```tsx
import { toast } from '@/lib/toast'
toast.success({ message: '저장됐어요' })
toast.error({ message: '실패했어요. 다시 시도해 주세요.' })
```

`<Toaster>`는 `App.tsx`에 1개만 mount. `id`로 중복 토스트 방지 가능.

## Header

```tsx
<Header
  showBack
  showSettings
  progress={{ current: 5, total: 20 }}
  onBackConfirm={handleBack}
  backConfirmMessage={{ title: '학습을 중단할까요?', description: '진행 상황이 저장됩니다' }}
/>
```

## TTSButton

```tsx
<TTSButton text="こんにちは" label="발음 듣기" variant="outline" />
```

로딩/재생 상태 표시. 내부적으로 `useTTS` 사용.

## MascotAvatar

```tsx
<MascotAvatar size="md" reaction="bounce" showBorder />
```

`reaction`: `idle | wave | bounce | happy | sad | sleepy | encourage`.
프레이머 모션 v12 호환을 위해 keyframes/transition 분리해서 전달.

## 컨벤션

- named export만 사용 (default export 금지)
- Props 인터페이스는 컴포넌트 파일 내 정의
- 애니메이션은 모두 Framer Motion (CSS animation 금지)
- 색상은 `var(--color-*)` 또는 `text-primary` 등 토큰만 사용 (개별 색상 금지)
- catch 블록은 항상 toast(사용자) + `reportXxxError`(Sentry) 동시 호출
