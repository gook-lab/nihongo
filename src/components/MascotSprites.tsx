// 마스코트 reaction별 sprite (배경 위 파티클/장식 오버레이)
// share/add-ani 정의를 React로 포팅. CSS keyframes는 index.css에 정의.
// reaction → sprite/background 매핑은 lib/mascotAnimations.ts의 REACTIONS에서 가져옴.
import { REACTIONS, SPRITE_TIMING, type MascotReaction } from '@/lib/mascotAnimations'

// sprite 위치(%) 안전 영역 내로 clamp — 새 sprite 추가 시 가이드용.
// 현재는 MascotScene 컨테이너의 `overflow-hidden`이 가장자리 잘림을 처리.
export function clampSpritePct(value: number): string {
  return `${Math.min(95, Math.max(5, value))}%`
}

// 각 sprite를 inset-0 절대 위치 컨테이너에 자식으로 렌더
// 모든 span은 position: absolute (.sprites > * 규칙과 동일 의도)

function Sparkles() {
  // happy — 노란 별 5개가 깜빡임
  const points = [
    { x: '15%', y: '22%', d: 0, s: 14 },
    { x: '82%', y: '18%', d: 0.3, s: 18 },
    { x: '20%', y: '60%', d: 0.7, s: 12 },
    { x: '85%', y: '52%', d: 0.5, s: 16 },
    { x: '50%', y: '14%', d: 0.9, s: 10 },
  ]
  return (
    <>
      {points.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={p.s * 2}
          height={p.s * 2}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            transformOrigin: 'center',
            animation: `mascot-sparkle ${SPRITE_TIMING.sparkles.duration}s ${SPRITE_TIMING.sparkles.easing} ${p.d}s infinite`,
          }}
        >
          <path
            d="M12 1 L14 10 L23 12 L14 14 L12 23 L10 14 L1 12 L10 10 Z"
            fill="#FFD400"
            stroke="#FF8A00"
            strokeWidth="0.5"
          />
        </svg>
      ))}
    </>
  )
}

function Confetti() {
  // celebrate — 위에서 떨어지는 색 조각
  const colors = ['#FF3366', '#FFB400', '#2EBD6B', '#7FB8E6', '#E84992', '#F4B36A']
  return (
    <>
      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${(i * 6.3 + 3) % 100}%`,
            top: -10,
            width: 8,
            height: 12,
            borderRadius: 2,
            background: colors[i % 6],
            animation: `mascot-fall ${(SPRITE_TIMING.confetti.duration + i * 0.08).toFixed(2)}s ${SPRITE_TIMING.confetti.easing} ${(i * 0.12).toFixed(2)}s infinite`,
          }}
        />
      ))}
    </>
  )
}

function Ring() {
  // cheer — 마스코트 주위로 퍼지는 동심원
  // color-mix() 폴백: 미지원 브라우저(iOS Safari <16.4 등)는 primary 토큰을 그대로 사용
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    border: '4px solid var(--color-primary)',
    opacity: 0.6,
    borderRadius: '9999px',
  }
  return (
    <div style={{ position: 'absolute', left: '50%', top: '60%', width: 160, height: 160, transform: 'translate(-50%,-50%)' }}>
      <div style={{ ...baseStyle, animation: `mascot-pulse-ring ${SPRITE_TIMING.ring.duration}s ${SPRITE_TIMING.ring.easing} infinite` }} />
      <div style={{ ...baseStyle, animation: `mascot-pulse-ring ${SPRITE_TIMING.ring.duration}s ${SPRITE_TIMING.ring.easing} 0.5s infinite` }} />
      <div style={{ ...baseStyle, animation: `mascot-pulse-ring ${SPRITE_TIMING.ring.duration}s ${SPRITE_TIMING.ring.easing} 1.0s infinite` }} />
    </div>
  )
}

function Flames() {
  // streak — 하단에서 일렁이는 불꽃
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => {
        const w = 22 + (i % 3) * 6
        const h = 30 + (i % 3) * 8
        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: `${10 + i * 15}%`,
              bottom: '6%',
              animation: `mascot-flame ${SPRITE_TIMING.flames.duration}s ${SPRITE_TIMING.flames.easing} ${(i * 0.07).toFixed(2)}s infinite`,
            }}
          >
            <svg width={w} height={h} viewBox="0 0 30 40">
              <defs>
                <linearGradient id={`fl-${i}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FFD400" />
                  <stop offset="60%" stopColor="#FF8A4D" />
                  <stop offset="100%" stopColor="#FF3366" />
                </linearGradient>
              </defs>
              <path
                d="M15 4 C 22 14 26 18 24 28 C 22 36 18 38 15 39 C 12 38 8 36 6 28 C 4 18 8 14 15 4 Z"
                fill={`url(#fl-${i})`}
              />
            </svg>
          </span>
        )
      })}
    </>
  )
}

function Hearts() {
  // wave — 마스코트 옆에서 떠오르는 하트
  const hearts = ['❤️', '💛', '💖']
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${65 + (i % 2) * 8}%`,
            top: `${30 + i * 8}%`,
            fontSize: 16 + i * 2,
            animation: `mascot-drift-up ${SPRITE_TIMING.hearts.duration}s ${SPRITE_TIMING.hearts.easing} ${(i * 0.4).toFixed(2)}s infinite`,
          }}
        >
          {hearts[i % 3]}
        </span>
      ))}
    </>
  )
}

function Questions() {
  // think — 둥둥 떠오르는 물음표
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${60 + i * 8}%`,
            top: `${24 + i * 8}%`,
            fontSize: 22 + i * 4,
            color: '#A89BBA',
            fontWeight: 900,
            animation: `mascot-z-float ${SPRITE_TIMING.questions.duration}s ${SPRITE_TIMING.questions.easing} ${(i * 0.6).toFixed(2)}s infinite`,
          }}
        >
          ?
        </span>
      ))}
    </>
  )
}

function Exclaim() {
  // shock — 빨간 느낌표
  return (
    <>
      <span
        style={{
          position: 'absolute',
          left: '62%',
          top: '18%',
          fontSize: 42,
          color: '#FF3366',
          fontWeight: 900,
          animation: `mascot-z-float ${SPRITE_TIMING.exclaim.duration}s ${SPRITE_TIMING.exclaim.easing} infinite`,
        }}
      >
        !
      </span>
      <span
        style={{
          position: 'absolute',
          left: '72%',
          top: '34%',
          fontSize: 28,
          color: '#FF8A4D',
          fontWeight: 900,
          animation: `mascot-z-float ${SPRITE_TIMING.exclaim.duration}s ${SPRITE_TIMING.exclaim.easing} 0.3s infinite`,
        }}
      >
        !
      </span>
    </>
  )
}

function Tears() {
  // sad — 작은 비구름 + 떨어지는 눈물 방울
  return (
    <>
      <svg
        viewBox="0 0 80 42"
        width={80}
        height={42}
        style={{ position: 'absolute', left: '50%', top: '6%', transform: 'translateX(-50%)' }}
      >
        <ellipse cx="40" cy="26" rx="34" ry="14" fill="#8C9CAD" />
        <ellipse cx="22" cy="22" rx="14" ry="12" fill="#8C9CAD" />
        <ellipse cx="58" cy="22" rx="14" ry="12" fill="#8C9CAD" />
      </svg>
      {Array.from({ length: 6 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${30 + (i % 2) * 40}%`,
            top: `${42 + Math.floor(i / 2) * 4}%`,
            width: 8,
            height: 14,
            borderRadius: '50% 50% 50% 50%/60% 60% 40% 40%',
            background: 'linear-gradient(180deg, #A6CDE8, #5B9BD4)',
            animation: `mascot-tear ${SPRITE_TIMING.tears.duration}s ${SPRITE_TIMING.tears.easing} ${(i * 0.3).toFixed(2)}s infinite`,
          }}
        />
      ))}
    </>
  )
}

function ZZZs() {
  // sleep — Z 문자가 둥둥 + 달
  return (
    <>
      <svg
        viewBox="0 0 36 36"
        width={36}
        height={36}
        style={{ position: 'absolute', left: '14%', top: '14%' }}
      >
        <path d="M28 22 A 14 14 0 1 1 14 8 A 11 11 0 0 0 28 22 Z" fill="#FFE38A" />
      </svg>
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${64 + i * 4}%`,
            top: `${24 - i * 4}%`,
            fontSize: 22 + i * 6,
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 900,
            fontFamily: 'ui-serif, Georgia, serif',
            animation: `mascot-z-float ${SPRITE_TIMING.zs.duration}s ${SPRITE_TIMING.zs.easing} ${(i * 0.6).toFixed(2)}s infinite`,
          }}
        >
          Z
        </span>
      ))}
    </>
  )
}

// sprite 이름 → 컴포넌트 (REACTIONS[reaction].sprite로 lookup)
const SPRITE_COMPONENTS = {
  sparkles: Sparkles,
  confetti: Confetti,
  ring: Ring,
  flames: Flames,
  hearts: Hearts,
  questions: Questions,
  exclaim: Exclaim,
  tears: Tears,
  zs: ZZZs,
} as const

interface MascotSpritesProps {
  reaction: MascotReaction
}

export function MascotSprites({ reaction }: MascotSpritesProps) {
  const spriteKind = REACTIONS[reaction].sprite
  if (!spriteKind) return null
  const Sprite = SPRITE_COMPONENTS[spriteKind]
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <Sprite />
    </div>
  )
}

// reaction → 배경 그라데이션
// REACTIONS[reaction].background가 정의되어 있으면 그것(CSS 변수 — 다크 모드 자동 대응),
// 없으면 마스코트별 기본 배경
export function getReactionBackground(
  reaction: MascotReaction,
  mascotId?: string,
): string {
  const override = REACTIONS[reaction].background
  if (override) return override

  // 마스코트별 기본 배경
  switch (mascotId) {
    case 'kotaro':
      return 'linear-gradient(180deg, #FFF5E5 0%, #FFE9CC 100%)'
    case 'yuki':
      return 'linear-gradient(180deg, #EEF6FD 0%, #DCEAF7 100%)'
    case 'sora':
      return 'linear-gradient(180deg, #F4F0F8 0%, #E6DEF0 100%)'
    default:
      return 'linear-gradient(180deg, var(--color-sakura-100) 0%, var(--color-sakura-200) 100%)'
  }
}

// sleep 모드는 어두운 배경이라 라벨 텍스트는 흰색이 어울림
export function isReactionDark(reaction: MascotReaction): boolean {
  return reaction === 'sleep' || reaction === 'sleepy'
}
