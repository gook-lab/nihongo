// 마스코트 인트로 투어 — 로그인 후 첫 홈 진입 시 한 번만 표시.
// 3슬라이드 walkthrough: 인사 / 기능 소개 / 보상 시스템.
import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MascotScene } from '@/components/MascotScene'
import { BookOpen, MessageCircle, Sparkles, Award, ChevronRight } from 'lucide-react'
import { useAppStore } from '@/store'

interface Slide {
  reaction: 'wave' | 'happy' | 'celebrate'
  title: string
  description: string
  highlights?: { icon: React.ComponentType<{ className?: string }>; label: string }[]
}

const SLIDES: Slide[] = [
  {
    reaction: 'wave',
    title: '안녕하세요!',
    description: '저는 코타로예요. 매일 조금씩 일본어를 함께 학습할 친구입니다.',
  },
  {
    reaction: 'happy',
    title: '이런 기능이 있어요',
    description: '단어 학습부터 AI 튜터까지, 일본어 학습에 필요한 도구를 모두 모았어요.',
    highlights: [
      { icon: BookOpen, label: '단어 + 문법 + 한자' },
      { icon: MessageCircle, label: '회화 표현 280+ ' },
      { icon: Sparkles, label: 'AI 튜터 · 작문 첨삭' },
    ],
  },
  {
    reaction: 'celebrate',
    title: '꾸준하면 보상이 따라와요',
    description: '학습할 때마다 XP가 쌓이고, 레벨이 오르면 새로운 마스코트와 뱃지를 해금할 수 있어요.',
    highlights: [
      { icon: Award, label: '레벨 7단계 + 뱃지 11종' },
    ],
  },
]

interface MascotIntroTourProps {
  open: boolean
  onClose: () => void
}

export function MascotIntroTour({ open, onClose }: MascotIntroTourProps) {
  const [step, setStep] = useState(0)
  const markIntroTourSeen = useAppStore((s) => s.markIntroTourSeen)
  const slide = SLIDES[step]
  const isLast = step === SLIDES.length - 1

  const handleClose = () => {
    markIntroTourSeen()
    setStep(0)
    onClose()
  }

  const handleNext = () => {
    if (isLast) {
      handleClose()
    } else {
      setStep((s) => s + 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-32px)] max-w-[360px] p-0 overflow-hidden">
        <DialogTitle className="sr-only">마스코트 소개</DialogTitle>
        <DialogDescription className="sr-only">앱 기능 안내 투어</DialogDescription>

        {/* 마스코트 영역 */}
        <div
          className="relative px-6 pt-8 pb-4 flex items-center justify-center"
          style={{
            background:
              'linear-gradient(180deg, var(--color-sakura-100) 0%, var(--color-card) 100%)',
          }}
        >
          <AnimatePresence mode="wait">
            <m.div
              key={step}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <MascotScene reaction={slide.reaction} sizeToken="md" />
            </m.div>
          </AnimatePresence>
        </div>

        {/* 텍스트 영역 */}
        <div className="px-6 pt-4 pb-6 space-y-4">
          <AnimatePresence mode="wait">
            <m.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-2"
            >
              <h2 className="text-xl font-extrabold leading-tight">{slide.title}</h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {slide.description}
              </p>

              {slide.highlights && (
                <div className="mt-3 space-y-2">
                  {slide.highlights.map(({ icon: Icon, label }, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                      style={{ background: 'var(--color-sakura-100)' }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'var(--color-primary)' }}
                      >
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span
                        className="text-[13px] font-semibold"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </m.div>
          </AnimatePresence>

          {/* 진척 도트 */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {SLIDES.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === step ? 18 : 6,
                  background:
                    i === step ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 pt-1">
            {!isLast && (
              <Button variant="ghost" className="flex-1" onClick={handleClose}>
                건너뛰기
              </Button>
            )}
            <Button className="flex-1" onClick={handleNext}>
              {isLast ? '시작하기' : '다음'}
              {!isLast && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
