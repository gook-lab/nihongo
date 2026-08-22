// 재사용 가능한 확인 다이얼로그 — native confirm() 대체
// 컴포넌트 props 방식 + Hook 방식 모두 제공
import { useState, useCallback, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export type ConfirmTone = 'default' | 'destructive'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  tone?: ConfirmTone
  onConfirm: () => void
  onCancel?: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  tone = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-32px)] max-w-[360px]">
        <DialogHeader>
          <div className="flex items-center gap-2 justify-center mb-2">
            {tone === 'destructive' && (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-error-light)' }}
              >
                <AlertTriangle
                  className="w-5 h-5"
                  style={{ color: 'var(--color-destructive)' }}
                />
              </div>
            )}
          </div>
          <DialogTitle className="text-center type-h3">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-center">{description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              onCancel?.()
              onOpenChange(false)
            }}
            className="flex-1 h-11"
          >
            {cancelText}
          </Button>
          <Button
            variant={tone === 'destructive' ? 'destructive' : 'default'}
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className="flex-1 h-11"
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Hook 방식 ─────────────────────────────────────
// 사용 예:
//   const { confirm, dialog } = useConfirm()
//   const ok = await confirm({ title: '...', description: '...', tone: 'destructive' })
//   if (ok) doSomething()
//
//   return (<>{dialog}<button onClick={handler}>...</button></>)

interface ConfirmOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  tone?: ConfirmTone
}

interface ConfirmState extends ConfirmOptions {
  open: boolean
  resolve?: (ok: boolean) => void
}

export function useConfirm() {
  const [state, setState] = useState<ConfirmState>({
    open: false,
    title: '',
  })

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setState({ ...opts, open: true, resolve })
    })
  }, [])

  const handleConfirm = () => {
    state.resolve?.(true)
    setState((s) => ({ ...s, open: false }))
  }
  const handleCancel = () => {
    state.resolve?.(false)
    setState((s) => ({ ...s, open: false }))
  }

  const dialog: ReactNode = (
    <ConfirmDialog
      open={state.open}
      onOpenChange={(v) => {
        if (!v) handleCancel()
      }}
      title={state.title}
      description={state.description}
      confirmText={state.confirmText}
      cancelText={state.cancelText}
      tone={state.tone}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  )

  return { confirm, dialog }
}
