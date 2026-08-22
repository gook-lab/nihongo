import { m, AnimatePresence } from 'framer-motion'
import { Volume2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTTS } from '@/hooks/useTTS'
import { useAppStore } from '@/store'

interface TTSButtonProps {
  text: string
  label?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'icon'
  className?: string
  forceBrowser?: boolean // Murf.ai 무시하고 브라우저 TTS 강제 사용
}

export function TTSButton({
  text,
  label,
  variant = 'outline',
  size = 'sm',
  className = '',
  forceBrowser = false,
}: TTSButtonProps) {
  const { ttsRate } = useAppStore()
  const { speak, isLoading, isSpeaking, isSupported } = useTTS({ rate: ttsRate, forceBrowser })

  if (!isSupported) return null

  const isActive = isLoading || isSpeaking

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => speak(text)}
      disabled={isActive}
      className={className}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <m.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
          </m.div>
        ) : isSpeaking ? (
          <m.div
            key="speaking"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1"
          >
            <SoundWaveIcon />
          </m.div>
        ) : (
          <m.div
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <Volume2 className="w-4 h-4" />
          </m.div>
        )}
      </AnimatePresence>
      {label && <span className="ml-2">{label}</span>}
    </Button>
  )
}

// 재생 중 애니메이션 아이콘
function SoundWaveIcon() {
  return (
    <div className="flex items-center gap-0.5 h-4">
      {[0, 1, 2].map((i) => (
        <m.div
          key={i}
          className="w-1 bg-current rounded-full"
          animate={{
            height: ['8px', '16px', '8px'],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
