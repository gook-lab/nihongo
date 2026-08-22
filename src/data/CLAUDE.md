# Data

앱에서 사용하는 정적 데이터

## 파일 목록

| 파일 | 설명 |
|------|------|
| words.ts | 단어 사전 (N5~N3 + 머지 로직, 최종 `WORDS` 1,487개) |
| words-n2.ts / words-n1.ts | N2/N1 단어 목록 |
| words-ext.ts | 일부 단어 예문 머지 (`WORD_EXAMPLES_EXT`) |
| words.test.ts | 단어 무결성 테스트 (id 유일·필드·완전 중복 0 강제) |
| kana.ts | 히라가나/카타카나 (청음·탁음·반탁음·요음) |
| mascots.ts | 마스코트 3종 (코타로/유키/소라) |
| conversations.ts | 회화 base 데이터 (BASE_CATEGORIES 11개) + 머지 로직 |
| conversations-ext.ts | 회화 확장 1차 — 표현 추가 + 신규 카테고리 3개 |
| conversations-ext2.ts | 회화 확장 2차 (V2) — 표현 추가 + 신규 카테고리 3개 |
| conversations.test.ts | 회화 무결성 테스트 (카테고리 내 문장 중복 금지 등) |
| dialogues.ts | 대화 시나리오 15개 (4~6턴 상황극) |
| reading.ts | 짧은 글 읽기 10편 |
| songs.ts | 동요 8곡 |

## words.ts

### 단어 구조
```tsx
interface Word {
  id: string
  kanji: string
  hiragana: string
  meaning: string
  level: 'N5' | 'N4' | 'N3'
  example?: { japanese: string; korean: string; targetWord: string; reading: string }
}
```

### 수량 (2026-07-10 완전 중복 71건 정리 후)

최종 `WORDS` = JLPT 단어(N5~N1, words.ts + words-n2.ts + words-n1.ts) + 회화 토큰
자동 추출(`CONV_WORDS`, JLPT와 kanji+hiragana 겹치면 제외) = **총 1,487개**.
예문은 N5 전수 + `words-ext.ts` 머지분.

**같은 단어(한자+히라가나+뜻)는 하나의 항목·하나의 레벨로만 존재해야 한다** —
`words.test.ts`가 완전 중복 0을 강제. 단어 추가 전 기존 목록과 기계 대조할 것.

`example.reading`은 단어별 띄어쓰기 필수 (`ほんを かいます。`) — `hiraganaToRomaji`가 음절 구분에 의존.

## conversations.ts + conversations-ext.ts + conversations-ext2.ts

**17 카테고리 · 총 421표현** (2026-07-10 기준). 여행 코어 8개
(travel/accommodation/restaurant/cafe/convenience/shopping/transport/weather)는
각 **정확히 30표현** — `conversations.test.ts`가 30개 하한을 검사.

### 구조
- `conversations.ts`: `BASE_CATEGORIES` 11개 + 머지 로직
- `conversations-ext.ts`: `EXTRA_PHRASES` + `NEW_CATEGORIES`(감정·기분/가족·친구/학교생활)
- `conversations-ext2.ts`: `EXTRA_PHRASES_V2` + `NEW_CATEGORIES_V2`(인사·예의/자기소개/응급·도움)
- 최종 export `CONVERSATION_CATEGORIES` = base + ext + ext2 머지

### 회화 데이터 확장 패턴 (필수 준수)
- 신규 표현은 `conversations-ext.ts`(또는 ext2)에 추가. base 직접 수정 지양.
- **카테고리 내 일본어 문장 중복 금지** — TTS 캐시 키(`text:voiceId`)를 공유해
  미리받기 완료 판정이 왜곡됨. 확장 전 기존 문장 목록과 기계 대조할 것
  (2026-07 확장 웨이브 누적으로 중복 30건이 쌓였던 전례).
- 제거한 표현의 id는 **재사용 금지** (진행도/즐겨찾기 오귀속 방지).
- `conversations.test.ts`가 중복·id 유일·reading 누락을 막는다.

### 카테고리 (17개)
| id | nameKo | icon (lucide) |
|----|--------|--------------|
| work | 일하기 | Briefcase |
| accommodation | 숙소 | Hotel |
| weather | 날씨 | Cloud |
| restaurant | 식당 | UtensilsCrossed |
| travel | 여행 | Plane |
| health | 건강 | Heart |
| study | 공부 | GraduationCap |
| shopping | 쇼핑 | ShoppingBag |
| cafe | 카페 | Coffee |
| convenience | 편의점 | Store |
| transport | 대중교통 | Train |
| **emotion** | **감정·기분** | **Smile** |
| **family** | **가족·친구** | **Users** |
| **school** | **학교생활** | **School** |
| **greeting** | **인사·예의** | (ext2) |
| **introduction** | **자기소개** | (ext2) |
| **emergency** | **응급·도움** | (ext2) |

`ConversationPage`의 `ICON_MAP`에 lucide 이름을 등록해야 그리드에 표시됨.

## dialogues.ts

대화 시나리오 15개 — 카페 주문, 공항 입국, 호텔 체크인, 병원, 편의점 결제, 길 묻기,
자기소개, 식당 전화 예약, 쇼핑 환불, 택시, 약속 잡기, **전철 표 사기, 약국,
온천 입장, 이자카야 주문~계산**(2026-07 여행 코어 추가분). 4~6턴, 화자 전환 포함.
`DialoguePage`에서 사용. 라인 토큰 구조는 회화 표현과 동일 (reading 필수).

## reading.ts / songs.ts

- **reading**: 짧은 글 10편 (N5~N4 위주). 단어 토큰 + 한국어 해석 포함
- **songs**: 동요 8곡. 가사 라인별 토큰화

## kana.ts

```tsx
interface KanaChar {
  hiragana: string; katakana: string; romaji: string; korean: string; row: string
}
```

- 청음 46자 + 탁음/반탁음/요음
- `getRandomKana(n)`: KanaGamePage용 무작위 추출

## mascots.ts

```tsx
interface Mascot {
  id: 'kotaro' | 'yuki' | 'sora'
  name: string       // 일본어
  nameKr: string     // 한국어
  image: string      // /mascots/{id}.png
  personality: string
}
```
