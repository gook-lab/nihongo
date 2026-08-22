// 로딩 스피너 — share/Loading Spinners.html에서 자주 쓸 6종 + 풀스크린 변형 포팅
// CSS keyframes는 index.css의 spinner-* 정의를 사용 (별도 import 없음)
//
// 사용 매핑 가이드:
// - ring     : 일반 데이터 fetch, 버튼 안 (Loader2 대체)
// - dots     : 짧은 작업 대기 (3-5초)
// - typing   : AI/채팅 응답 대기 (말풍선 안 점)
// - hiragana : 단어 데이터 로딩 (브랜드 톤)
// - skeleton : 카드/리스트 자리 채움
// - mascot   : 풀스크린/대형 로딩 (앱 첫 진입, 동기화)
import { m } from 'framer-motion'
import { useAppStore } from '@/store'
import { MASCOTS } from '@/data/mascots'

export type SpinnerVariant = 'ring' | 'dots' | 'typing' | 'hiragana' | 'skeleton' | 'mascot'

interface SpinnerProps {
  variant?: SpinnerVariant
  /** ring/dots/hiragana 크기. 기본값: variant별 적절 */
  size?: number
  /** primary 색상 override. CSS 변수 또는 직접 값 */
  color?: string
  className?: string
}

/** 1) Ring — 클래식 링 (가장 범용) */
function Ring({ size = 32, color }: { size?: number; color?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `${Math.max(2, size / 14)}px solid var(--color-muted)`,
        borderTopColor: color ?? 'var(--color-primary)',
        animation: 'spinner-spin 0.9s linear infinite',
      }}
    />
  )
}

/** 2) Dots — 3개 점이 순차로 바운스 (코타로/유키/소라 색) */
function Dots({ size = 12 }: { size?: number }) {
  const colors = [
    'var(--color-primary)',
    'var(--reaction-bg-streak-accent, #F4B36A)', // kotaro orange
    '#7FB8E6', // yuki blue
  ]
  return (
    <div className="flex" style={{ gap: size * 0.7 }}>
      {colors.map((c, i) => (
        <span
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: c,
            animation: `spinner-dot-bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
            display: 'inline-block',
          }}
        />
      ))}
    </div>
  )
}

/** 3) Typing — 말풍선 안 점 3개 (AI 응답 대기) */
function Typing() {
  return (
    <div
      style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border-light)',
        borderRadius: 16,
        padding: '8px 12px',
        display: 'inline-flex',
        gap: 4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {[0, 0.15, 0.3].map((d, i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--color-text-tertiary)',
            animation: `spinner-typing-dot 1.2s ease-in-out ${d}s infinite`,
            display: 'inline-block',
          }}
        />
      ))}
    </div>
  )
}

/** 4) Hiragana — 핑크 박스 안에서 あいうえお 사이클 */
function Hiragana({ size = 56 }: { size?: number }) {
  // framer-motion으로 텍스트 사이클 — CSS content cycle은 React에서 다루기 어려움
  const chars = ['あ', 'い', 'う', 'え', 'お']
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: 'linear-gradient(135deg, var(--color-primary), #FF8FB1)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.5,
        fontWeight: 800,
        fontFamily: '"Hiragino Sans", "Noto Sans JP", serif',
        boxShadow: '0 6px 16px rgba(255,51,102,0.25)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {chars.map((ch, i) => (
        <m.span
          key={ch}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 2,
            times: [0, 0.05, 0.95, 1],
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'linear',
          }}
          style={{ position: 'absolute' }}
        >
          {ch}
        </m.span>
      ))}
    </div>
  )
}

/** 5) Skeleton — 카드 행 3개 시머 */
function Skeleton({ width = 180 }: { width?: number }) {
  const rowWidths = ['100%', '75%', '50%']
  return (
    <div style={{ width }}>
      {rowWidths.map((w, i) => (
        <div
          key={i}
          style={{
            height: 12,
            width: w,
            borderRadius: 6,
            marginBottom: 8,
            background:
              'linear-gradient(90deg, var(--color-muted) 0%, var(--color-card) 50%, var(--color-muted) 100%)',
            backgroundSize: '400px 100%',
            animation: 'spinner-shimmer 1.4s linear infinite',
          }}
        />
      ))}
    </div>
  )
}

/** 6) Mascot — 큰 마스코트 바운스 + 그림자 (풀스크린/대형) */
function MascotBounce({ size = 84 }: { size?: number }) {
  const selectedMascotId = useAppStore((s) => s.selectedMascotId)
  const mascot = MASCOTS.find((m) => m.id === selectedMascotId) ?? MASCOTS[0]
  return (
    <div className="flex flex-col items-center gap-1">
      <img
        src={mascot.image}
        alt={mascot.nameKr}
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          animation: 'spinner-mascot-bob 1.4s ease-in-out infinite',
        }}
      />
      <div
        style={{
          width: size * 0.7,
          height: 6,
          borderRadius: '50%',
          background: '#000',
          animation: 'spinner-shadow-pulse 1.4s ease-in-out infinite',
        }}
      />
    </div>
  )
}

export function Spinner({ variant = 'ring', size, color, className = '' }: SpinnerProps) {
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      aria-busy="true"
      aria-live="polite"
    >
      {variant === 'ring' && <Ring size={size} color={color} />}
      {variant === 'dots' && <Dots size={size} />}
      {variant === 'typing' && <Typing />}
      {variant === 'hiragana' && <Hiragana size={size} />}
      {variant === 'skeleton' && <Skeleton width={size} />}
      {variant === 'mascot' && <MascotBounce size={size} />}
    </span>
  )
}
