// 통합 Toast API: toast.success/error/warning/info({ message, title?, duration?, id? })
import { toast as hotToast } from 'react-hot-toast'
import { CustomToast, type ToastType } from '@/components/CustomToast'
import { createElement } from 'react'

export interface CustomToastOptions {
  title?: string
  message: string
  duration?: number
  id?: string // 같은 id로 호출하면 기존 토스트 교체 (중복 방지)
}

function showCustomToast(
  type: ToastType,
  { title, message, duration = 2400, id }: CustomToastOptions,
) {
  // 같은 id가 있으면 먼저 dismiss
  if (id) hotToast.dismiss(id)

  return hotToast.custom(
    (t) =>
      createElement(CustomToast, {
        t,
        type,
        title,
        message,
      }),
    {
      duration,
      id: id || undefined,
    },
  )
}

export const toast = {
  success: (opts: CustomToastOptions) => showCustomToast('success', opts),
  error: (opts: CustomToastOptions) => showCustomToast('error', opts),
  warning: (opts: CustomToastOptions) => showCustomToast('warning', opts),
  info: (opts: CustomToastOptions) => showCustomToast('info', opts),
  dismiss: (id?: string) => hotToast.dismiss(id),
}
