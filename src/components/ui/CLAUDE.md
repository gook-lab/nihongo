# UI Components (shadcn/ui)

shadcn/ui 기반 기본 UI 컴포넌트 (수동 설치)

## 컴포넌트 목록

| 컴포넌트 | 파일 | 설명 |
|---------|------|------|
| Button | button.tsx | 버튼 (Airbnb 그라데이션 스타일) |
| Card | card.tsx | 카드 컨테이너 |
| Input | input.tsx | 텍스트 입력 |
| Progress | progress.tsx | 진행 바 |
| Dialog | dialog.tsx | 모달 다이얼로그 |
| Switch | switch.tsx | 토글 스위치 |

## Button Variants

```tsx
// 기본 (Airbnb 그라데이션)
<Button>확인</Button>

// 아웃라인
<Button variant="outline">취소</Button>

// 고스트
<Button variant="ghost">더보기</Button>

// 위험 액션
<Button variant="destructive">삭제</Button>

// 아이콘만
<Button variant="ghost" size="icon">
  <Settings className="w-5 h-5" />
</Button>
```

## Card 사용법

```tsx
<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardContent>내용</CardContent>
  <CardFooter>푸터</CardFooter>
</Card>
```

## Dialog 사용법

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="w-[calc(100vw-32px)] max-w-[360px]">
    <DialogHeader>
      <DialogTitle>제목</DialogTitle>
      <DialogDescription>설명</DialogDescription>
    </DialogHeader>
    {/* 내용 */}
  </DialogContent>
</Dialog>
```

## 주의사항

- Tailwind CSS v4와 shadcn CLI 호환 문제로 수동 설치됨
- `@/lib/utils`의 `cn()` 함수로 클래스 병합
- 모든 Dialog에는 접근성을 위해 DialogTitle 필수
- 색상은 CSS 변수 사용 (`--color-primary` 등)
