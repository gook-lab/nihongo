// share/Level Badges (1).html STREAKS + MILESTONES SVG 11종 React 포팅.
// 잠금 상태는 grayscale + blur 처리. earned면 그대로.
interface AchievementBadgeSvgProps {
  id: string
  size?: number
  locked?: boolean
  animated?: boolean
  className?: string
}

// id별 SVG 정의
const ART: Record<string, (uid: string) => React.ReactNode> = {
  // ── STREAKS
  'streak-3': (uid) => (
    <>
      <defs>
        <linearGradient id={`${uid}-grad`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FFD400" />
          <stop offset="100%" stopColor="#FF8A4D" />
        </linearGradient>
      </defs>
      <circle cx={50} cy={50} r={42} fill="#fff" stroke="#FF8A4D" strokeWidth={3} />
      <path
        d="M50 28 C 60 38 64 44 62 56 C 60 66 56 70 50 72 C 44 70 40 66 38 56 C 36 44 40 38 50 28 Z"
        fill={`url(#${uid}-grad)`}
      />
      <text x={50} y={86} textAnchor="middle" fontSize={10} fontWeight={800} fill="#FF8A4D">
        3
      </text>
    </>
  ),
  'streak-7': (uid) => (
    <>
      <defs>
        <linearGradient id={`${uid}-grad`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FFD400" />
          <stop offset="100%" stopColor="#FF3366" />
        </linearGradient>
      </defs>
      <g style={{ transformOrigin: '50px 50px', animation: 'badge-spin 18s linear infinite' }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const a = (i * Math.PI * 2) / 7 - Math.PI / 2
          return (
            <path
              key={i}
              d={`M50 50 L${50 + Math.cos(a) * 42} ${50 + Math.sin(a) * 42}`}
              stroke="#FF8A4D"
              strokeWidth={2}
              opacity={0.45}
              strokeLinecap="round"
            />
          )
        })}
      </g>
      <circle cx={50} cy={50} r={32} fill="#fff" stroke="#FF8A4D" strokeWidth={3} />
      <path
        d="M50 32 C 58 40 60 46 58 56 C 56 62 53 64 50 65 C 47 64 44 62 42 56 C 40 46 42 40 50 32 Z"
        fill={`url(#${uid}-grad)`}
      />
      <text x={50} y={56} textAnchor="middle" fontSize={10} fontWeight={900} fill="#fff">
        7
      </text>
    </>
  ),
  'streak-30': (uid) => (
    <>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#FFE38A" />
          <stop offset="100%" stopColor="#E8A722" />
        </linearGradient>
        <linearGradient id={`${uid}-inner`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FFB400" />
          <stop offset="100%" stopColor="#D97000" />
        </linearGradient>
      </defs>
      <path
        d="M50 8 L62 18 L78 16 L82 32 L94 42 L88 56 L92 72 L78 78 L70 92 L54 88 L42 94 L30 84 L14 80 L18 64 L8 52 L18 38 L14 22 L30 18 Z"
        fill={`url(#${uid}-bg)`}
        stroke="#9C6500"
        strokeWidth={1.5}
      />
      <circle cx={50} cy={50} r={26} fill="#fff" stroke="#9C6500" strokeWidth={2} />
      <text
        x={50}
        y={48}
        textAnchor="middle"
        fontSize={22}
        fontWeight={900}
        fill={`url(#${uid}-inner)`}
        letterSpacing={-1}
      >
        30
      </text>
      <text x={50} y={62} textAnchor="middle" fontSize={8} fontWeight={800} fill="#9C6500" letterSpacing={2}>
        DAYS
      </text>
    </>
  ),
  'streak-90': (uid) => (
    <>
      <defs>
        <radialGradient id={`${uid}-bg`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFC0D6" />
          <stop offset="100%" stopColor="#7A4DD8" />
        </radialGradient>
      </defs>
      <g style={{ transformOrigin: '50px 50px', animation: 'badge-spin 20s linear infinite' }}>
        {[0, 72, 144, 216, 288].map((a) => (
          <g key={a} transform={`rotate(${a} 50 50)`}>
            <path d="M50 6 Q56 14 50 22 Q44 14 50 6 Z" fill="#FFB6CE" />
            <circle cx={50} cy={14} r={2} fill="#FFD400" />
          </g>
        ))}
      </g>
      <circle cx={50} cy={50} r={32} fill={`url(#${uid}-bg)`} stroke="#4F2A98" strokeWidth={2} />
      <text x={50} y={48} textAnchor="middle" fontSize={20} fontWeight={900} fill="#fff" letterSpacing={-1}>
        90
      </text>
      <text x={50} y={62} textAnchor="middle" fontSize={7} fontWeight={800} fill="rgba(255,255,255,0.85)" letterSpacing={2}>
        SEASON
      </text>
    </>
  ),
  'streak-365': (uid) => (
    <>
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#FFD64A" />
          <stop offset="35%" stopColor="#FF8A4D" />
          <stop offset="70%" stopColor="#E84992" />
          <stop offset="100%" stopColor="#7A4DD8" />
        </linearGradient>
        <radialGradient id={`${uid}-c`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#FFFBEE" />
          <stop offset="100%" stopColor="#FFE38A" />
        </radialGradient>
      </defs>
      <g style={{ transformOrigin: '50px 50px', animation: 'badge-spin 14s linear infinite' }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <path
            key={i}
            d={`M50 50 L${50 + Math.cos((i * Math.PI) / 6) * 46} ${50 + Math.sin((i * Math.PI) / 6) * 46} L${50 + Math.cos(((i + 0.5) * Math.PI) / 6) * 38} ${50 + Math.sin(((i + 0.5) * Math.PI) / 6) * 38} Z`}
            fill={`url(#${uid}-g)`}
            opacity={0.65 + (i % 2) * 0.25}
          />
        ))}
      </g>
      <circle cx={50} cy={50} r={30} fill={`url(#${uid}-c)`} stroke="#9C6500" strokeWidth={2} />
      <text x={50} y={46} textAnchor="middle" fontSize={18} fontWeight={900} fill="#9C2256" letterSpacing={-1}>
        365
      </text>
      <text x={50} y={60} textAnchor="middle" fontSize={7} fontWeight={800} fill="#9C2256" letterSpacing={2}>
        YEAR
      </text>
      <path d="M40 22 L46 14 L50 20 L54 14 L60 22 Z" fill="#FFD400" stroke="#9C6500" strokeWidth={1} />
    </>
  ),

  // ── MILESTONES
  'first-step': () => (
    <>
      <circle cx={50} cy={50} r={38} fill="#FFF8E5" stroke="#F4B36A" strokeWidth={3} />
      <path d="M30 60 L42 60 L42 76 L30 76 Z M58 38 L70 38 L70 54 L58 54 Z" fill="#F4B36A" />
      <path d="M38 28 L26 40 M62 64 L74 76" stroke="#F4B36A" strokeWidth={3} strokeLinecap="round" fill="none" />
    </>
  ),
  'word-hunter': () => (
    <>
      <circle cx={50} cy={50} r={38} fill="#EAF3FB" stroke="#7FB8E6" strokeWidth={3} />
      <rect x={30} y={34} width={40} height={32} rx={4} fill="#fff" stroke="#7FB8E6" strokeWidth={2} />
      <line x1={36} y1={42} x2={64} y2={42} stroke="#7FB8E6" strokeWidth={2} strokeLinecap="round" />
      <line x1={36} y1={48} x2={58} y2={48} stroke="#7FB8E6" strokeWidth={2} strokeLinecap="round" />
      <line x1={36} y1={54} x2={62} y2={54} stroke="#7FB8E6" strokeWidth={2} strokeLinecap="round" />
      <text x={50} y={86} textAnchor="middle" fontSize={11} fontWeight={900} fill="#7FB8E6">
        100
      </text>
    </>
  ),
  perfectionist: () => (
    <>
      <circle cx={50} cy={50} r={40} fill="#FFFBEE" stroke="#FFB400" strokeWidth={3} />
      <path
        d="M50 18 L57 38 L78 40 L62 54 L67 75 L50 64 L33 75 L38 54 L22 40 L43 38 Z"
        fill="#FFD400"
        stroke="#9C6500"
        strokeWidth={1.5}
      />
      <text x={50} y={56} textAnchor="middle" fontSize={10} fontWeight={900} fill="#9C6500">
        PERFECT
      </text>
    </>
  ),
  'xp-collector': () => (
    <>
      <circle cx={50} cy={50} r={40} fill="#F1ECF8" stroke="#7A4DD8" strokeWidth={3} />
      <g style={{ transformOrigin: '50px 50px', animation: 'badge-spin 18s linear infinite' }}>
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <circle
            key={a}
            cx={50 + Math.cos((a * Math.PI) / 180) * 28}
            cy={50 + Math.sin((a * Math.PI) / 180) * 28}
            r={3}
            fill="#7A4DD8"
          />
        ))}
      </g>
      <text x={50} y={48} textAnchor="middle" fontSize={16} fontWeight={900} fill="#7A4DD8">
        XP
      </text>
      <text x={50} y={64} textAnchor="middle" fontSize={9} fontWeight={800} fill="#7A4DD8" letterSpacing={1}>
        1000
      </text>
    </>
  ),
  'kanji-starter': () => (
    <>
      <rect x={14} y={14} width={72} height={72} rx={10} fill="#FFEBF1" stroke="#E84992" strokeWidth={3} />
      <text
        x={50}
        y={62}
        textAnchor="middle"
        fontSize={36}
        fontWeight={800}
        fill="#E84992"
        fontFamily='"Hiragino Sans","Noto Sans JP",serif'
      >
        字
      </text>
      <line x1={20} y1={78} x2={80} y2={78} stroke="#E84992" strokeWidth={2} strokeLinecap="round" opacity={0.5} />
      <line x1={20} y1={74} x2={40} y2={74} stroke="#E84992" strokeWidth={2} strokeLinecap="round" />
    </>
  ),
  flawless: (uid) => (
    <>
      <defs>
        <linearGradient id={`${uid}-grad`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#FFD64A" />
          <stop offset="50%" stopColor="#FF3366" />
          <stop offset="100%" stopColor="#7A4DD8" />
        </linearGradient>
      </defs>
      <g style={{ transformOrigin: '50px 50px', animation: 'badge-spin 18s linear infinite' }}>
        <circle
          cx={50}
          cy={50}
          r={44}
          fill="none"
          stroke={`url(#${uid}-grad)`}
          strokeWidth={3}
          strokeDasharray="6 4"
        />
      </g>
      <circle cx={50} cy={50} r={34} fill="#fff" stroke="#1A1A1A" strokeWidth={2} />
      <path
        d="M32 50 L44 62 L68 38"
        stroke="#1A1A1A"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
}

export function AchievementBadgeSvg({
  id,
  size = 64,
  locked = false,
  animated = true,
  className = '',
}: AchievementBadgeSvgProps) {
  const render = ART[id]
  if (!render) return null

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        ...(animated && !locked
          ? { animation: 'badge-idle 3s ease-in-out infinite' }
          : {}),
        ...(locked
          ? { filter: 'grayscale(1) blur(3px)', opacity: 0.6 }
          : {}),
      }}
    >
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        {render(id)}
      </svg>
    </div>
  )
}
