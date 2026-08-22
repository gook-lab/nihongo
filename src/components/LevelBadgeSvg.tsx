// share/Level Badges.html의 SVG 뱃지 7종 — React로 포팅.
// 레벨별로 frame(외곽), center(심볼), spinning ring(lv5+) 조합.
// 애니메이션: badgeIdle 떠다니기(전 레벨), rotateSlow ring 회전(lv5+).
import { getLevelBadge } from '@/lib/levelBadges'

interface LevelBadgeSvgProps {
  level: number
  /** 픽셀 크기. 기본 88 */
  size?: number
  /** false면 떠다니기 애니메이션 비활성 (작은 인라인 사용 시) */
  animated?: boolean
  /** lock 상태 — 그레이스케일 + opacity */
  locked?: boolean
  className?: string
}

// 다섯꼭지 별 좌표 생성 — HTML 원본 star() 함수 포팅
function starPoints(cx: number, cy: number, r: number, rot = 0): string {
  let pts = ''
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI * i) / 5 - Math.PI / 2 + (rot * Math.PI) / 180
    const rr = i % 2 === 0 ? r : r * 0.45
    const x = cx + Math.cos(a) * rr
    const y = cy + Math.sin(a) * rr
    pts += `${x.toFixed(1)},${y.toFixed(1)} `
  }
  return pts.trim()
}

// 레벨별 외곽 프레임 SVG
function Frame({ level, color }: { level: number; color: string }) {
  switch (level) {
    case 1: // soft circle
      return <circle cx={50} cy={50} r={38} fill="#fff" stroke={color} strokeWidth={2} />
    case 2: // hexagon
      return (
        <path
          d="M50 12 L84 32 L84 68 L50 88 L16 68 L16 32 Z"
          fill="#fff"
          stroke={color}
          strokeWidth={2}
        />
      )
    case 3: // shield
      return (
        <path
          d="M50 12 L84 22 L82 58 C 82 76 70 84 50 90 C 30 84 18 76 18 58 L16 22 Z"
          fill="#fff"
          stroke={color}
          strokeWidth={2}
        />
      )
    case 4: // octagon
      return (
        <path
          d="M30 14 L70 14 L86 30 L86 70 L70 86 L30 86 L14 70 L14 30 Z"
          fill="#fff"
          stroke={color}
          strokeWidth={2}
        />
      )
    case 5: // sunburst + inner circle
      return (
        <>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI) / 6
            return (
              <line
                key={i}
                x1={50}
                y1={50}
                x2={50 + Math.cos(a) * 44}
                y2={50 + Math.sin(a) * 44}
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.4}
              />
            )
          })}
          <circle cx={50} cy={50} r={36} fill="#fff" stroke={color} strokeWidth={2.5} />
        </>
      )
    case 6: // double ring
      return (
        <>
          <circle
            cx={50}
            cy={50}
            r={44}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeDasharray="4 4"
          />
          <circle cx={50} cy={50} r={38} fill="#fff" stroke={color} strokeWidth={3} />
        </>
      )
    case 7: // ornate black + gold
      return (
        <>
          <circle cx={50} cy={50} r={44} fill="none" stroke="#FFD400" strokeWidth={1.5} />
          <circle cx={50} cy={50} r={40} fill={color} stroke="#FFD400" strokeWidth={2} />
          {[0, 90, 180, 270].map((a) => (
            <circle
              key={a}
              cx={50 + Math.cos((a * Math.PI) / 180) * 44}
              cy={50 + Math.sin((a * Math.PI) / 180) * 44}
              r={2.6}
              fill="#FFD400"
            />
          ))}
        </>
      )
    default:
      return null
  }
}

// 레벨별 중심 심볼 SVG (lv7는 다크 배경이라 색 반전)
function CenterSymbol({ level, color }: { level: number; color: string }) {
  const dark = '#1A1A1A'
  // lv7는 검정 배경이라 dark/color를 모두 골드로 치환
  const stroke = level === 7 ? '#FFD400' : dark
  const fill = level === 7 ? '#FFD400' : color

  switch (level) {
    case 1: // 새싹
      return (
        <>
          <path
            d="M50 70 C 50 60 42 54 36 56 C 38 64 44 68 50 70 Z M50 70 C 50 60 58 54 64 56 C 62 64 56 68 50 70 Z M50 70 L50 48"
            fill={fill}
            stroke={stroke}
            strokeWidth={1.2}
          />
          <path
            d="M50 70 L50 48"
            stroke={stroke}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />
        </>
      )
    case 2: // 별
      return (
        <>
          <polygon points={starPoints(50, 50, 16)} fill={fill} />
          <polygon points={starPoints(50, 50, 8, 36)} fill="#fff" />
        </>
      )
    case 3: // 책
      return (
        <>
          <path
            d="M30 36 L50 32 L70 36 L70 64 L50 60 L30 64 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={1.5}
          />
          <line x1={50} y1={32} x2={50} y2={60} stroke={stroke} strokeWidth={1.5} />
          {[42, 48].map((y) => (
            <line
              key={`l-${y}`}
              x1={36}
              y1={y + 2}
              x2={46}
              y2={y}
              stroke="#fff"
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          ))}
          {[42, 48].map((y) => (
            <line
              key={`r-${y}`}
              x1={54}
              y1={y}
              x2={64}
              y2={y + 2}
              stroke="#fff"
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          ))}
        </>
      )
    case 4: // 다이아
      return (
        <>
          <path
            d="M50 28 L72 50 L50 72 L28 50 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={1.5}
          />
          <path d="M50 36 L64 50 L50 64 L36 50 Z" fill="#fff" opacity={0.85} />
          <path
            d="M50 36 L50 64 M36 50 L64 50"
            stroke={fill}
            strokeWidth={1.2}
          />
        </>
      )
    case 5: // 불꽃
      return (
        <>
          <path
            d="M50 28 C 60 38 64 44 62 56 C 60 66 56 70 50 72 C 44 70 40 66 38 56 C 36 44 40 38 50 28 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={1.4}
          />
          <path
            d="M50 44 C 54 48 56 52 55 58 C 54 64 52 66 50 67 C 48 66 46 64 45 58 C 44 52 46 48 50 44 Z"
            fill="#FFE38A"
          />
        </>
      )
    case 6: // 토리이
      return (
        <>
          <g stroke={stroke} strokeWidth={1.5} strokeLinecap="round">
            <line x1={28} y1={34} x2={72} y2={34} />
            <line x1={30} y1={40} x2={70} y2={40} />
            <line x1={36} y1={40} x2={36} y2={70} />
            <line x1={64} y1={40} x2={64} y2={70} />
            <line x1={40} y1={48} x2={60} y2={48} />
          </g>
          <rect x={28} y={34} width={44} height={6} fill={fill} />
          <rect x={36} y={40} width={28} height={3} fill={fill} opacity={0.7} />
        </>
      )
    case 7: // 왕관 + 별
      return (
        <>
          <path
            d="M28 56 L34 36 L42 50 L50 30 L58 50 L66 36 L72 56 L28 56 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <rect
            x={28}
            y={56}
            width={44}
            height={8}
            fill={fill}
            stroke={stroke}
            strokeWidth={1.5}
          />
          {[34, 50, 66].map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={i === 1 ? 30 : 36}
              r={2.4}
              fill="#FFD400"
              stroke={stroke}
              strokeWidth={0.8}
            />
          ))}
          <polygon points={starPoints(50, 52, 4)} fill="#FFD400" />
        </>
      )
    default:
      return null
  }
}

// lv5+ 회전 ring (dashed 8개 원이 회전)
function SpinningRing({ color }: { color: string }) {
  return (
    <g style={{ transformOrigin: 'center', animation: 'badge-spin 18s linear infinite' }}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <circle
          key={i}
          cx={50}
          cy={50}
          r={46}
          fill="none"
          stroke={color}
          strokeWidth={1}
          strokeDasharray="2 6"
          opacity={0.6}
          transform={`rotate(${i * 45} 50 50)`}
        />
      ))}
    </g>
  )
}

export function LevelBadgeSvg({
  level,
  size = 88,
  animated = true,
  locked = false,
  className = '',
}: LevelBadgeSvgProps) {
  const meta = getLevelBadge(level)
  const hasSpinRing = meta.id >= 5

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        ...(animated ? { animation: 'badge-idle 3s ease-in-out infinite' } : {}),
        ...(locked ? { filter: 'grayscale(0.8) brightness(0.95)', opacity: 0.55 } : {}),
      }}
    >
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        {hasSpinRing && <SpinningRing color={meta.color} />}
        <Frame level={meta.id} color={meta.color} />
        <CenterSymbol level={meta.id} color={meta.color} />
      </svg>
    </div>
  )
}
