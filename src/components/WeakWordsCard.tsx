// 약점 단어 학습 진입 카드 — 홈에 표시.
// wrongWords 또는 ease<2.0 SRS 단어가 있을 때만 노출.
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { AlertCircle, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/store'
import { haptic } from '@/lib/haptic'

export function WeakWordsCard() {
  const navigate = useNavigate()
  const wrongIds = useAppStore((s) => s.wrongWordIds)
  const wordSrs = useAppStore((s) => s.wordSrs)

  const weakCount = useMemo(() => {
    const ids = new Set<string>(wrongIds)
    for (const s of Object.values(wordSrs)) {
      if (s.ease < 2.0 || s.wrongCount > s.correctCount) {
        ids.add(s.wordId)
      }
    }
    return ids.size
  }, [wrongIds, wordSrs])

  if (weakCount === 0) return null

  return (
    <m.button
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        haptic.tap()
        navigate('/learn', { state: { weakOnly: true } })
      }}
      className="w-full text-left"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-4 flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #FB923C, #F97316)',
              color: '#fff',
            }}
          >
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">약점 단어 집중 학습</p>
            <p
              className="text-[11px] mt-0.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {weakCount}개 단어 — 짧게 다시 풀어보기
            </p>
          </div>
          <ChevronRight
            className="w-4 h-4 shrink-0"
            style={{ color: 'var(--color-text-tertiary)' }}
          />
        </CardContent>
      </Card>
    </m.button>
  )
}
