declare module 'lottie-web/build/player/lottie_light' {
  export interface AnimationItem {
    play(): void
    stop(): void
    pause(): void
    destroy(): void
    addEventListener(name: string, callback: () => void): void
    removeEventListener(name: string, callback: () => void): void
  }

  export interface AnimationConfig {
    container: HTMLElement
    renderer: 'svg' | 'canvas' | 'html'
    loop?: boolean
    autoplay?: boolean
    animationData?: object
    path?: string
  }

  interface LottiePlayer {
    loadAnimation(config: AnimationConfig): AnimationItem
  }

  const lottie: LottiePlayer
  export default lottie
}
