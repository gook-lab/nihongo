// 손글씨 캔버스 답안 vs 정답 글자 비교 타일 — 학습 퀴즈 캔버스 모드 결과용
interface CanvasCompareProps {
  /** 사용자가 그린 캔버스 PNG data URL */
  userImage: string
  /** 정답 글자 (한자 또는 히라가나) */
  target: string
  /** 0~100 필체 정확도 점수 */
  score: number
}

// 글자 수에 따라 정답 타일 폰트 크기 조정 (다자 단어는 작게)
function targetFontSize(len: number): string {
  if (len <= 1) return '5rem'
  if (len === 2) return '3.2rem'
  return '2.2rem'
}

export function CanvasCompare({ userImage, target, score }: CanvasCompareProps) {
  const pass = score >= 60

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        {/* 내가 쓴 글씨 */}
        <div className="flex flex-col items-center gap-1.5">
          <div
            className="w-full rounded-2xl border-[1.5px] overflow-hidden"
            style={{
              aspectRatio: '1 / 1',
              background: '#FFFFFF',
              borderColor: 'var(--color-border)',
            }}
          >
            <img
              src={userImage}
              alt="내가 쓴 글씨"
              className="w-full h-full object-contain"
            />
          </div>
          <span
            className="text-[11px] font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            내가 쓴 글씨
          </span>
        </div>

        {/* 정답 글씨 */}
        <div className="flex flex-col items-center gap-1.5">
          <div
            className="w-full rounded-2xl border-[1.5px] flex items-center justify-center overflow-hidden"
            style={{
              aspectRatio: '1 / 1',
              background: '#FFFFFF',
              borderColor: 'color-mix(in srgb, var(--color-primary) 40%, transparent)',
              padding: '0.5rem',
            }}
          >
            <span
              style={{
                fontFamily: '"Hiragino Sans", "Noto Sans JP", serif',
                fontWeight: 700,
                fontSize: targetFontSize(target.length),
                lineHeight: 1,
                color: '#1A1A1A',
                whiteSpace: 'nowrap',
              }}
            >
              {target}
            </span>
          </div>
          <span
            className="text-[11px] font-medium"
            style={{ color: 'var(--color-primary)' }}
          >
            정답 글씨
          </span>
        </div>
      </div>

      {/* 필체 정확도 */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-1">
          <span
            className="text-[11px]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            필체 정확도
          </span>
          <span
            className="text-[11px] font-bold"
            style={{ color: pass ? '#10B981' : '#EF4444' }}
          >
            {score}점
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: 'var(--color-border)' }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.max(score, 4)}%`,
              background: pass ? '#10B981' : '#EF4444',
            }}
          />
        </div>
      </div>
    </div>
  )
}
