/**
 * 스마트 정답 매칭 유틸리티
 * - 쉼표로 구분된 복수 의미 처리 (예: "낮, 점심" → ["낮", "점심"])
 * - "~하다" 접미사 변형 처리 (예: "편리" = "편리하다")
 * - 공백 정규화
 */

/**
 * 정답 문자열을 개별 의미로 분리
 * @param meaning "낮, 점심" → ["낮", "점심"]
 */
function splitMeanings(meaning: string): string[] {
  return meaning
    .split(/[,،、\/]/) // 쉼표, 아랍 쉼표, 일본어 쉼표, 슬래시
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

/**
 * 한국어 동사/형용사 변형 생성
 * "편리하다" → ["편리하다", "편리"]
 * "크다" → ["크다"]
 * "사용하다" → ["사용하다", "사용"]
 */
function getKoreanVariants(word: string): string[] {
  const variants = [word]

  // "~하다" 제거 버전 추가
  if (word.endsWith('하다')) {
    variants.push(word.slice(0, -2))
  }

  // "~하다" 추가 버전
  if (!word.endsWith('하다') && !word.endsWith('다')) {
    variants.push(word + '하다')
  }

  return variants
}

/**
 * 사용자 입력이 정답과 일치하는지 확인
 * @param userAnswer 사용자 입력
 * @param correctMeaning 정답 (쉼표로 구분된 복수 의미 가능)
 * @returns true if match
 */
export function isAnswerCorrect(
  userAnswer: string,
  correctMeaning: string
): boolean {
  const trimmedAnswer = userAnswer.trim().toLowerCase()

  if (!trimmedAnswer) return false

  // 정답을 개별 의미로 분리
  const meanings = splitMeanings(correctMeaning)

  for (const meaning of meanings) {
    const normalizedMeaning = meaning.toLowerCase()

    // 정확히 일치
    if (trimmedAnswer === normalizedMeaning) {
      return true
    }

    // 변형 체크 (하다 접미사)
    const meaningVariants = getKoreanVariants(normalizedMeaning)
    const answerVariants = getKoreanVariants(trimmedAnswer)

    for (const mv of meaningVariants) {
      for (const av of answerVariants) {
        if (mv === av) {
          return true
        }
      }
    }
  }

  return false
}

/**
 * 히라가나/카타카나 입력도 정답으로 처리
 */
export function isJapaneseAnswerCorrect(
  userAnswer: string,
  hiragana: string,
  kanji: string
): boolean {
  const trimmedAnswer = userAnswer.trim()

  return trimmedAnswer === hiragana || trimmedAnswer === kanji
}
