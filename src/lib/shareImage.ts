// 결과 공유용 PNG 생성 — Canvas로 점수+닉네임+스트릭이 들어간 1080×1080 정사각 이미지.
// Web Share API Level 2(files) 지원 시 파일로 공유, 아니면 download 폴백.

export interface ShareImageParams {
  nickname?: string
  score: number
  correctCount: number
  totalCount: number
  xpEarned: number
  streak: number
  level: string
  badge: string
}

/** 1080×1080 정사각 PNG Blob 생성 (인스타·카카오 호환) */
export async function generateShareImage(p: ShareImageParams): Promise<Blob | null> {
  const SIZE = 1080
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // 1) 핑크 그라데이션 배경
  const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE)
  grad.addColorStop(0, '#FF5A5F')
  grad.addColorStop(1, '#FF8FB1')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, SIZE, SIZE)

  // 2) 우상단 원형 글로우 (sakura)
  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  ctx.beginPath()
  ctx.arc(SIZE - 100, 80, 280, 0, Math.PI * 2)
  ctx.fill()

  // 3) 좌하단 거품
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  ctx.beginPath()
  ctx.arc(120, SIZE - 100, 200, 0, Math.PI * 2)
  ctx.fill()

  // 4) "QUIZ RESULT" eyebrow
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Q U I Z   R E S U L T', SIZE / 2, 200)

  // 5) 닉네임 + 메시지
  const who = p.nickname ? `${p.nickname}님` : '저'
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 56px -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", system-ui, sans-serif'
  ctx.fillText(`${who}의 학습 결과`, SIZE / 2, 290)

  // 6) 큰 점수
  ctx.font = 'bold 240px -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
  ctx.fillText(`${p.score}`, SIZE / 2, 530)
  ctx.font = 'bold 48px system-ui, sans-serif'
  ctx.fillText('점', SIZE / 2 + 200, 530)

  // 7) 부가 정보 라인 1: N문제 중 N개 정답
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = '600 36px -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
  ctx.fillText(`${p.totalCount}문제 중 ${p.correctCount}개 정답`, SIZE / 2, 620)

  // 8) 통계 칩 3개 — XP / 스트릭 / 레벨
  const chips: { label: string; value: string }[] = [
    { label: 'XP', value: `+${p.xpEarned}` },
    { label: 'STREAK', value: `${p.streak}일` },
    { label: 'LV', value: `${p.level} · ${p.badge}` },
  ]
  const chipY = 740
  const chipW = 280
  const chipH = 130
  const gap = 30
  const totalW = chipW * chips.length + gap * (chips.length - 1)
  const startX = (SIZE - totalW) / 2

  chips.forEach((c, i) => {
    const x = startX + i * (chipW + gap)
    // 칩 배경
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    roundRect(ctx, x, chipY, chipW, chipH, 28)
    ctx.fill()
    // 칩 label
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = 'bold 22px -apple-system, system-ui, sans-serif'
    ctx.fillText(c.label, x + chipW / 2, chipY + 48)
    // 칩 값
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 44px -apple-system, system-ui, sans-serif'
    ctx.fillText(c.value, x + chipW / 2, chipY + 105)
  })

  // 9) 하단 브랜드
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = 'bold 40px -apple-system, "Apple SD Gothic Neo", system-ui, sans-serif'
  ctx.fillText('니혼고 앱 · KOTOBA', SIZE / 2, SIZE - 100)
  ctx.font = '500 24px -apple-system, system-ui, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.fillText('nihan-go-test.netlify.app', SIZE / 2, SIZE - 60)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 0.92)
  })
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** 생성한 Blob을 Web Share Level 2(files)로 공유. 미지원 시 download. */
export async function shareImageOrDownload(blob: Blob, filename: string, text: string, url: string) {
  const file = new File([blob], filename, { type: 'image/png' })

  if (typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text, url, title: '니혼고 학습 결과' })
      return 'shared'
    } catch (e) {
      if ((e as Error).name === 'AbortError') return 'cancelled'
      // 일부 OS에서 권한 거부 → download 폴백
    }
  }

  // 다운로드 폴백
  const objUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objUrl
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(objUrl), 100)
  return 'downloaded'
}
