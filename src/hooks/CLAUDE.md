# Hooks

커스텀 React 훅

## 파일 목록

| 훅 | 설명 |
|----|------|
| `useTTS` | 일본어 TTS (Murf.ai → 브라우저 폴백) |
| `useAIChat` | Gemini 스트리밍 채팅 상태 관리 |
| `useConfirm` | Promise 기반 확인 다이얼로그 (`components/ConfirmDialog.tsx`) |
| `useHomeData` | 홈 화면 공통 데이터 (xp/level/streak/savedLearning/calendar) |
| `useFirestoreSync` | Zustand 변경 감지 → Firestore 4-카테고리 디바운스 저장 |

## useTTS

```tsx
const { speak, stop, isLoading, isSpeaking, isSupported } = useTTS({ rate: 0.9 })
await speak('こんにちは')
```

| 상태 | 의미 |
|------|------|
| `isLoading` | API 호출 중 (Murf 응답 대기) |
| `isSpeaking` | 오디오 재생 중 |
| `isSupported` | 브라우저 TTS 사용 가능 여부 (Murf 미설정 시) |

우선순위: **Murf.ai** (설정 + 활성화) → **브라우저 Web Speech**. Murf 실패 시 자동 폴백.

## useAIChat

```tsx
const {
  messages,        // ChatMessage[]
  sendMessage,     // (text: string) => Promise<void>
  stopGeneration,
  clearMessages,
  isStreaming,
  error,           // RATE_LIMIT 안내 등
} = useAIChat()
```

- 스트리밍 chunk를 마지막 assistant 메시지에 누적
- `AbortController`로 중단 가능
- 에러는 hook 내부 state로 전달 — `RATE_LIMIT:30` 같은 메시지는 UI에서 가공
- localStorage 저장 안 함 (세션 종료 시 휘발)

## useConfirm

```tsx
const { confirm, dialog } = useConfirm()

const ok = await confirm({
  title: '시험을 중단할까요?',
  description: '진행 상황은 사라져요.',
  tone: 'destructive',
})
if (ok) handleExit()

return <>{dialog}<button onClick={…}>…</button></>
```

`tone`: `'default' | 'destructive'`. destructive면 ⚠ 아이콘 + 빨간 CTA.

## useHomeData / useFirestoreSync

홈 화면 변형들이 같은 데이터를 공유하기 위한 컬렉트 훅. `useFirestoreSync`는 `App.tsx`에서 1회만 호출 — 4개 카테고리(`profile/state/srs/library`)별 dirty flag로 1.5초 디바운스 후 저장.
