import { useEffect, useRef } from 'react'
import type { AnimationItem } from 'lottie-web/build/player/lottie_light'

interface LottieLightProps {
  animationData: object
  loop?: boolean
  autoplay?: boolean
  style?: React.CSSProperties
  className?: string
  onComplete?: () => void
}

// lottie-web 168KB chunk를 dynamic import — 컴포넌트 첫 마운트 시점에만 로드.
// LearningPage 진입 시점이 아닌 정답 효과 표시 시점에만 비용 발생.
export function LottieLight({
  animationData,
  loop = false,
  autoplay = true,
  style,
  className,
  onComplete,
}: LottieLightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationItem | null>(null)

  useEffect(() => {
    let cancelled = false
    if (!containerRef.current) return

    ;(async () => {
      const { default: lottie } = await import('lottie-web/build/player/lottie_light')
      if (cancelled || !containerRef.current) return
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop,
        autoplay,
        animationData,
      })
      if (onComplete) {
        animationRef.current.addEventListener('complete', onComplete)
      }
    })()

    return () => {
      cancelled = true
      animationRef.current?.destroy()
      animationRef.current = null
    }
  }, [animationData, loop, autoplay, onComplete])

  return <div ref={containerRef} style={style} className={className} />
}
