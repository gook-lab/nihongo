import { useState } from 'react'
import { m } from 'framer-motion'
import { ChevronLeft, Trophy, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  title?: string
  showBack?: boolean
  progress?: { current: number; total: number }
  showSettings?: boolean
  // 설정 버튼 커스텀 핸들러. 지정하면 /settings 이동 대신 이 콜백 실행.
  onSettingsClick?: () => void
  onBackConfirm?: () => void // 뒤로가기 전 확인 필요한 경우
  backConfirmMessage?: {
    title: string
    description: string
    highlight?: string
  }
}

export function Header({
  title,
  showBack = false,
  progress,
  showSettings = false,
  onSettingsClick,
  onBackConfirm,
  backConfirmMessage
}: HeaderProps) {
  const navigate = useNavigate()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleBack = () => {
    if (onBackConfirm) {
      setShowConfirmDialog(true)
    } else {
      // CLAUDE.md: navigate(-1) 금지 — 명시적 홈으로 폴백
      navigate('/')
    }
  }

  const handleConfirmLeave = () => {
    setShowConfirmDialog(false)
    if (onBackConfirm) {
      onBackConfirm()
    } else {
      navigate('/')
    }
  }

  const handleContinue = () => {
    setShowConfirmDialog(false)
  }

  // 학습 페이지용 헤더 (프로그레스 바 포함)
  if (progress) {
    const progressPercent = (progress.current / progress.total) * 100
    const percentLabel = Math.round(progressPercent)

    return (
      <>
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border-light">
          <div className="flex items-center gap-3 h-16 px-3">
            {/* 뒤로가기 버튼 */}
            <m.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              aria-label="뒤로가기"
            >
              <ChevronLeft className="w-6 h-6" />
            </m.button>

            {/* 트로피 아이콘 */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'var(--color-primary)' }}
            >
              <Trophy className="w-4 h-4" style={{ color: 'var(--color-primary-foreground)' }} />
            </div>

            {/* 진행도 라벨 + 굵은 프로그레스 바 (2행 구성) */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between mb-1.5">
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  {progress.current}{' '}
                  <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 500 }}>
                    / {progress.total}
                  </span>
                </span>
                <span
                  className="text-[11px] tabular-nums font-semibold"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {percentLabel}%
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: 'var(--color-muted)' }}
              >
                <m.div
                  // width 대신 transform (레이아웃 재계산 회피, 시각 동일)
                  initial={{ x: '-100%' }}
                  animate={{ x: `-${100 - progressPercent}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="h-full w-full rounded-full"
                  style={{ background: 'var(--color-primary)' }}
                />
              </div>
            </div>

            {/* 설정 버튼: onSettingsClick 있으면 콜백, 없으면 /settings로 이동 */}
            {showSettings ? (
              <m.button
                whileTap={{ scale: 0.9 }}
                onClick={() => (onSettingsClick ? onSettingsClick() : navigate('/settings'))}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                aria-label="설정"
              >
                <Settings className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
              </m.button>
            ) : (
              <div className="w-10" />
            )}
          </div>
        </header>

        {/* 뒤로가기 확인 다이얼로그 */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="w-[calc(100vw-32px)] max-w-[320px] p-6" hideCloseButton>
            <DialogTitle className="text-center text-xl font-semibold">
              {backConfirmMessage?.title || '이대로 가시게요?'}
            </DialogTitle>
            <div className="text-center space-y-2 mt-2">
              {backConfirmMessage?.highlight && (
                <p className="text-base">
                  <span className="text-primary font-bold">{backConfirmMessage.highlight}</span>
                  {backConfirmMessage?.description || ''}
                </p>
              )}
              {!backConfirmMessage?.highlight && backConfirmMessage?.description && (
                <p className="text-base text-muted-foreground">
                  {backConfirmMessage.description}
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleConfirmLeave}
                className="flex-1 h-12"
              >
                나가기
              </Button>
              <Button
                onClick={handleContinue}
                className="flex-1 h-12"
              >
                이어서 하기
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // 기본 헤더
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border-light">
      <div className="flex items-center h-14 px-4">
        {showBack && (
          <m.button
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className="w-10 h-10 -ml-2 flex items-center justify-center hover:bg-muted rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </m.button>
        )}

        {title && (
          <h1 className="flex-1 type-h3 text-center">{title}</h1>
        )}

        {/* 오른쪽 여백 맞추기 */}
        {showBack && <div className="w-10" />}
      </div>
    </header>
  )
}
