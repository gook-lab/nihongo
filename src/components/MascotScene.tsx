// 큰 마스코트 표시용 통합 씬 — 배경 그라데이션 + 마스코트 + sprite 오버레이 + 말풍선
// 사용처: ResultPage, StreakRewardModal, ErrorScreens, NotFoundPage, Onboarding,
//        LearningPage 정답/오답 피드백, 빈 상태 안내 등
//
// 작은 아바타(헤더, 칩)는 그대로 MascotAvatar 사용.
// 마스코트 본인은 store의 selectedMascotId를 따라가므로 설정 변경 시 일괄 반영.
import { m } from 'framer-motion'
import { useAppStore } from '@/store'
import { MASCOTS } from '@/data/mascots'
import type { Mascot } from '@/types'
import { REACTIONS, REACTION_MESSAGES, type MascotReaction } from '@/lib/mascotAnimations'
import { MASCOT_SCENE_SIZES, type MascotSceneSize } from '@/lib/mascotSizes'
import { MascotSprites, getReactionBackground, isReactionDark } from './MascotSprites'

interface MascotSceneProps {
  reaction?: MascotReaction
  mascot?: Mascot
  /** 의미 단위 사이즈 토큰. 권장. size/height 직접 지정보다 우선. */
  sizeToken?: MascotSceneSize
  /** @deprecated sizeToken 사용. 마스코트 이미지 가로 픽셀 */
  size?: number
  /** @deprecated sizeToken 사용. 씬 컨테이너 높이 */
  height?: number
  label?: string         // 하단 가운데 라벨 (예: "잘했어요!", "7일 연속!")
  bubble?: boolean | string // true: REACTION_MESSAGES 기본값 사용 / string: 그 텍스트 사용
  bubblePosition?: 'top-right' | 'top-left' // 기본 top-right. sleep/shock 등은 top-left가 자연스러움
  showBackground?: boolean
  showSprite?: boolean
  rounded?: boolean      // 둥근 카드 vs 직각
  className?: string
  onClick?: () => void
}

// 어두운 배경(sleep)에서는 말풍선 화이트, 라이트 배경에서는 카드 배경
function bubbleStyle(isDark: boolean): React.CSSProperties {
  if (isDark) {
    return {
      background: 'rgba(255,255,255,0.96)',
      color: '#1A1A1A',
    }
  }
  return {
    background: 'var(--color-card)',
    color: 'var(--color-text-primary)',
  }
}

export function MascotScene({
  reaction = 'happy',
  mascot: propMascot,
  sizeToken,
  size: sizeProp,
  height: heightProp,
  label,
  bubble,
  // sprite는 대부분 우상단에 위치 — 말풍선은 좌상단이 자연스러운 충돌 회피
  bubblePosition = 'top-left',
  showBackground = true,
  showSprite = true,
  rounded = true,
  className = '',
  onClick,
}: MascotSceneProps) {
  const selectedMascotId = useAppStore((s) => s.selectedMascotId)
  const mascot =
    propMascot ?? MASCOTS.find((m) => m.id === selectedMascotId) ?? MASCOTS[0]
  // sizeToken 우선 — size/height는 backward compat용. 둘 다 없으면 sm 기본.
  const resolvedToken = sizeToken
    ? MASCOT_SCENE_SIZES[sizeToken]
    : {
        size: sizeProp ?? MASCOT_SCENE_SIZES.sm.size,
        width: undefined as number | undefined,
        height: heightProp,
      }
  const size = resolvedToken.size
  const containerWidth = resolvedToken.width
  const containerHeight = resolvedToken.height ?? Math.round(size * 1.45)
  const isDark = isReactionDark(reaction)
  const background = showBackground
    ? getReactionBackground(reaction, mascot.id)
    : 'transparent'

  // bubble 텍스트 결정
  const bubbleText =
    typeof bubble === 'string'
      ? bubble
      : bubble === true
        ? REACTION_MESSAGES[reaction] || ''
        : ''

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`relative overflow-hidden ${rounded ? 'rounded-3xl' : ''} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        // sizeToken 사용 시 width 자동 적용 — 부모가 className으로 override 가능
        ...(containerWidth ? { width: containerWidth } : {}),
        height: containerHeight,
        // share/add-ani 원본 카드 그림자 톤 — 매우 미세하게
        boxShadow: isDark
          ? '0 8px 24px rgba(0,0,0,0.25)'
          : '0 1px 3px rgba(0,0,0,0.04)',
        // 마스코트가 카드 비율 안에서 정중앙에 자연스럽게 보이도록 가운데 정렬
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      {/* 배경 레이어 — 별도 div로 분리.
          motion.div의 transform이 stacking context를 만들어 img의 mix-blend-mode가
          motion.div 자체의 background와 안 섞이는 문제 회피. 이 배경 div가 backdrop이 됨. */}
      <div className="absolute inset-0" style={{ background }} />

      {/* sprite (배경 위 / 마스코트 아래) */}
      {showSprite && <MascotSprites reaction={reaction} />}

      {/* 마스코트 본체 — image 있으면 PNG, 없으면 emoji fallback */}
      <div
        className="absolute left-1/2"
        style={{
          bottom: 8,
          transform: 'translateX(-50%)',
          width: size,
          height: size,
        }}
      >
        {mascot.image ? (
          <img
            src={mascot.image}
            alt={mascot.nameKr}
            width={size}
            height={size}
            className="block w-full h-full object-contain"
            style={{
              animation: REACTIONS[reaction].css ?? undefined,
              transformOrigin: 'center bottom',
            }}
          />
        ) : (
          <div
            className="flex items-center justify-center w-full h-full"
            style={{
              fontSize: size * 0.75,
              lineHeight: 1,
              animation: REACTIONS[reaction].css ?? undefined,
              transformOrigin: 'center bottom',
            }}
            aria-label={mascot.nameKr}
            role="img"
          >
            {mascot.emoji ?? '🐾'}
          </div>
        )}
      </div>

      {/* 말풍선 — 마스코트 상단 모서리. 꼬리는 카드 중앙(마스코트)을 향함. */}
      {bubbleText && (
        <m.div
          initial={{ opacity: 0, y: -4, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="absolute"
          style={{
            top: 10,
            ...(bubblePosition === 'top-right'
              ? { right: 10 }
              : { left: 10 }),
            maxWidth: '75%',
            padding: '6px 10px',
            borderRadius: 14,
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            ...bubbleStyle(isDark),
          }}
        >
          {bubbleText}
          {/* 말풍선 꼬리 — 카드 중앙(마스코트) 쪽으로 향함:
              top-left 말풍선이면 꼬리는 우측 하단에, top-right면 좌측 하단에 */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: -6,
              ...(bubblePosition === 'top-right'
                ? { left: 18 }
                : { right: 18 }),
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: `6px solid ${isDark ? 'rgba(255,255,255,0.96)' : 'var(--color-card)'}`,
            }}
          />
        </m.div>
      )}

      {/* 라벨 (옵션 — bubble과 별개로 하단에 표시 가능) */}
      {label && (
        <div
          className="absolute left-0 right-0 bottom-3 text-center text-sm font-bold tracking-wide"
          style={{
            color: isDark ? 'rgba(255,255,255,0.92)' : 'var(--color-foreground)',
            textShadow: isDark ? '0 1px 2px rgba(0,0,0,0.3)' : undefined,
          }}
        >
          {label}
        </div>
      )}
    </m.div>
  )
}
