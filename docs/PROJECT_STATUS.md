# 프로젝트 현황 및 할 일

## 현재 상태: MVP 완료 ✅

### 완료된 기능

#### 1. 인증 시스템 ✅
- [x] Firebase Auth 설정
- [x] Google 로그인
- [x] 카카오/네이버 OIDC 로그인 (Firebase Console 설정 필요)
- [x] 로그인/로그아웃 상태 persist
- [x] 개발용 데모 모드
- [x] Protected Route / Guest Route

#### 2. 로그인 페이지 (`LoginPage.tsx`) ✅
- [x] 소셜 로그인 버튼 3개 (카카오, 네이버, 구글)
- [x] 로딩 스피너
- [x] 에러 메시지 표시
- [x] 애니메이션 (Framer Motion)

#### 3. 홈 페이지 (`HomePage.tsx`) ✅
- [x] 사용자 프로필 영역
- [x] 레벨 배지 표시
- [x] 7일 학습 캘린더
- [x] 연속 학습 스트릭
- [x] XP 프로그레스 바
- [x] 오늘의 학습 시작 버튼
- [x] 오답 노트 링크 (조건부)
- [x] 하단 탭 네비게이션

#### 4. 학습 페이지 (`LearningPage.tsx`) ✅
- [x] 20문제 랜덤 출제
- [x] 진행 상황 표시 (헤더)
- [x] 한자 + 히라가나 표시
- [x] 예문 및 한국어 번역
- [x] 타겟 단어 하이라이트
- [x] TTS 발음 재생 (Web Speech API)
- [x] 답 입력 + 확인
- [x] 힌트 기능
- [x] 정답/오답 피드백 UI
- [x] 자동 다음 문제 이동

#### 5. 결과 페이지 (`ResultPage.tsx`) ✅
- [x] 점수 표시 (%)
- [x] 획득 XP 표시
- [x] 점수별 메시지 (이모지)
- [x] 다시 학습하기 버튼
- [x] 홈으로 버튼

#### 6. 공통 컴포넌트 ✅
- [x] Header (뒤로가기, 진행바)
- [x] BottomNav (4탭)
- [x] LevelBadge
- [x] WeekCalendar

---

## 차후 구현 예정 (Phase 2)

### 사전 페이지 (`DictionaryPage.tsx`)
- [ ] 단어 검색 기능
- [ ] 히라가나/한자/한글 검색
- [ ] 검색 결과 리스트
- [ ] 단어 상세 보기
- [ ] OCR 사진 촬영 검색 (카메라 API)
- [ ] 최근 검색어

### 통계 페이지 (`StatsPage.tsx`)
- [ ] 총 학습 일수
- [ ] 총 학습 단어 수
- [ ] 정답률 차트
- [ ] 주간/월간 학습 그래프
- [ ] 레벨 진행 상황

### 설정 페이지 (`SettingsPage.tsx`)
- [ ] 프로필 편집
- [ ] 알림 설정
- [ ] TTS 속도 조절
- [ ] 다크 모드
- [ ] 로그아웃 버튼
- [ ] 계정 삭제

### 오답 노트 페이지 (`WrongWordsPage.tsx`)
- [ ] 틀린 단어 리스트
- [ ] 개별 단어 복습
- [ ] 오답 단어 삭제
- [ ] 오답 노트 학습 모드

---

## 개선 사항 (Backlog)

### UX 개선
- [ ] 스켈레톤 로딩
- [ ] 페이지 전환 애니메이션
- [ ] Pull to refresh
- [ ] 스와이프 제스처
- [ ] 키보드 단축키

### 데이터
- [ ] 단어 데이터 확장 (JSON 파일 or API)
- [ ] JLPT 레벨별 단어
- [ ] 카테고리별 단어 (음식, 여행 등)
- [ ] 사용자별 학습 기록 저장 (Firestore)

### 게이미피케이션
- [ ] 연속 학습 보너스 XP
- [ ] 퍼펙트 세션 보너스
- [ ] 업적 시스템
- [ ] 일일 목표 설정

### 기술적 개선
- [ ] PWA 설정 (오프라인 지원)
- [ ] 코드 스플리팅 (번들 크기 최적화)
- [ ] E2E 테스트 (Playwright)
- [ ] 에러 바운더리
- [ ] 분석 (Firebase Analytics)

---

## 알려진 이슈

1. **번들 크기 경고**: 515KB (500KB 초과)
   - 해결: 동적 import로 코드 스플리팅

2. **TTS 음성 품질**: Web Speech API 기본 음성
   - 해결: 고품질 TTS API 연동 (Google Cloud TTS 등)

3. **카카오/네이버 OIDC**: Firebase Console 설정 필요
   - 해결: 각 플랫폼 앱 등록 후 OIDC 설정

---

## 파일별 구현 상세

### `src/store.ts`
```typescript
// 상태 구조
{
  user: User | null,
  isAuthenticated: boolean,
  xp: number,
  level: number,
  streak: number,
  lastStudyDate: string | null,
  wrongWordIds: string[],
  currentSession: Session | null,  // persist 제외
  isLoading: boolean,              // persist 제외
  error: string | null,            // persist 제외
}
```

### `src/constants.ts`
```typescript
// 레벨 시스템
LEVELS = [
  { level: 1, name: '입문자', minXP: 0 },
  { level: 2, name: '초보자', minXP: 100 },
  { level: 3, name: '학습자', minXP: 300 },
  { level: 4, name: '중급자', minXP: 600 },
  { level: 5, name: '숙련자', minXP: 1000 },
  { level: 6, name: '전문가', minXP: 1500 },
  { level: 7, name: '마스터', minXP: 2000 },
]

// XP 규칙
XP_RULES = {
  CORRECT_ANSWER: 10,
  CORRECT_NO_HINT: 15,
  PERFECT_SESSION: 50,
  STREAK_BONUS: 5,
}

QUESTIONS_PER_SESSION = 20
```

### `src/data/words.ts`
- 현재 25개 샘플 단어입니다
- Word 인터페이스: id, kanji, hiragana, meaning, example
- `getLearningWords(count)`: 랜덤 셔플 후 count개를 반환합니다
