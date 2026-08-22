// 한자 손글씨 연습 — 사용자 캔버스와 타겟 한자(텍스트) 픽셀 비교로 정확도 계산.
// 정확도 = 사용자가 타겟 위에 그린 픽셀 비율 + 타겟 밖 노이즈 페널티.

/** 타겟 한자를 hidden canvas에 렌더해서 흑백 픽셀 마스크로 반환. */
function renderTargetMask(
  kanji: string,
  size: number,
): Uint8Array {
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = '#000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `bold ${size * 0.85}px "Hiragino Sans", "Noto Sans JP", serif`
  ctx.fillText(kanji, size / 2, size / 2 + size * 0.04)

  const data = ctx.getImageData(0, 0, size, size).data
  const mask = new Uint8Array(size * size)
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    // 어두운 픽셀이면 1
    mask[j] = data[i] < 180 ? 1 : 0
  }
  return mask
}

/** 사용자 캔버스의 픽셀 마스크. alpha > 0 픽셀을 1로 처리. */
function userCanvasMask(canvas: HTMLCanvasElement, size: number): Uint8Array {
  // 캔버스가 size와 다르면 임시 scale
  let src: HTMLCanvasElement
  if (canvas.width === size && canvas.height === size) {
    src = canvas
  } else {
    src = document.createElement('canvas')
    src.width = size
    src.height = size
    src.getContext('2d')!.drawImage(canvas, 0, 0, size, size)
  }
  const ctx = src.getContext('2d')!
  const data = ctx.getImageData(0, 0, size, size).data
  const mask = new Uint8Array(size * size)
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    mask[j] = data[i + 3] > 30 ? 1 : 0
  }
  return mask
}

export interface PracticeScore {
  /** 0~100 — 종합 점수 */
  total: number
  /** 타겟 안에 그린 비율 (recall) */
  coverage: number
  /** 타겟 밖에 그린 노이즈 비율 (lower = better) */
  noise: number
}

/**
 * 사용자 캔버스와 타겟 한자 비교.
 * 점수: coverage(70%) + (1 - noise penalty)(30%)
 *   - coverage = 타겟 픽셀 중 사용자가 덮은 비율
 *   - noise = 사용자 픽셀 중 타겟 밖에 있는 비율 (0=완벽, 클수록 페널티)
 */
export function scoreKanjiDrawing(
  userCanvas: HTMLCanvasElement,
  targetKanji: string,
  size = 200,
): PracticeScore {
  const target = renderTargetMask(targetKanji, size)
  const user = userCanvasMask(userCanvas, size)

  let targetPixels = 0
  let userPixels = 0
  let intersection = 0
  let userOutsideTarget = 0

  // 타겟 마스크 dilation — 사용자 손글씨가 살짝 비뚤어져도 허용 (5px tolerance)
  const tolerance = Math.max(3, Math.floor(size / 40))
  const dilated = dilateMask(target, size, tolerance)

  for (let i = 0; i < user.length; i++) {
    if (target[i]) targetPixels++
    if (user[i]) {
      userPixels++
      if (dilated[i]) intersection++
      else userOutsideTarget++
    }
  }

  if (targetPixels === 0) {
    return { total: 0, coverage: 0, noise: 0 }
  }

  const coverage = intersection / targetPixels
  const noise = userPixels === 0 ? 0 : userOutsideTarget / userPixels

  // 종합 점수
  const coverageScore = Math.min(1, coverage)
  const noisePenalty = Math.min(1, noise)
  const total = Math.round((coverageScore * 0.7 + (1 - noisePenalty) * 0.3) * 100)

  return {
    total,
    coverage: Math.round(coverage * 100),
    noise: Math.round(noise * 100),
  }
}

/** Box dilation — 마스크를 r 픽셀만큼 확장. 비뚤어진 손글씨 허용용. */
function dilateMask(mask: Uint8Array, size: number, r: number): Uint8Array {
  const out = new Uint8Array(size * size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (mask[y * size + x]) {
        for (let dy = -r; dy <= r; dy++) {
          const yy = y + dy
          if (yy < 0 || yy >= size) continue
          for (let dx = -r; dx <= r; dx++) {
            const xx = x + dx
            if (xx < 0 || xx >= size) continue
            out[yy * size + xx] = 1
          }
        }
      }
    }
  }
  return out
}

/** 점수 → 한국어 피드백 + 마스코트 reaction 매핑 */
export function feedbackForScore(score: number): {
  message: string
  level: 'great' | 'good' | 'try-again'
} {
  if (score >= 80) {
    return { message: '훌륭해요! 정확하게 따라 썼어요.', level: 'great' }
  }
  if (score >= 55) {
    return { message: '잘 그렸어요. 조금만 더 정확하게.', level: 'good' }
  }
  return { message: '다시 한 번 천천히 따라 써볼까요?', level: 'try-again' }
}
