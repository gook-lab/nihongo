# TODOS

## TTS 캐시 히트/미스 계측

- **What:** 오프라인 TTS 재생 시 캐시 히트(IDB/memory)/미스(브라우저 TTS 폴백) 이벤트를 기록해 여행 후 "실제로 오프라인 재생이 일어났는가"를 분석 가능하게 한다.
- **Why:** Phase 2 게이트 판정(현지 실사용 확인)의 보조 데이터. 인터뷰 기억보다 정확.
- **Pros:** 검증 신호의 해상도 상승. 어느 카테고리/표현이 현지에서 쓰였는지 파악.
- **Cons:** 검증 전 과설계 위험. Firestore 쓰기 비용/오프라인 큐잉 고려 필요.
- **Context:** Phase 1(plans/feat-travel-reliability.md)에서 lib/murf.ts에 2계층 캐시(memory→IDB→API)가 들어감. 계측 포인트는 synthesizeSpeech의 각 분기. 검증 재가동 후 필요성이 확인되면 착수.
- **Depends on / blocked by:** Phase 1 출시 + 검증 시작.

## 비여행 카테고리 표현 확장 (검증 신호 후)

- **What:** 일하기·건강·공부·감정·가족·학교 등 비여행 9개 카테고리도 카테고리당 30개 수준으로 확장.
- **Why:** 2026-07-10 여행 코어 8개만 30개로 확장함(검증 우선 합의). 비여행은 20~25개 수준.
- **Context:** conversations-ext.ts에 추가(데이터 규칙), src/data/conversations.test.ts 무결성 테스트가 중복을 막아줌. 단어 예문 500개(N4/N3)도 같은 게이트 뒤.
- **Depends on / blocked by:** Phase 1 검증 신호 (3주 게이트).
