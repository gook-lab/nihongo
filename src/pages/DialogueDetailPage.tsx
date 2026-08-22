// 대화 시나리오 상세 — 라인별 카드(좌/우 정렬) + 단어 토큰 + 한국어 토글
import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { m } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/card'
import { BottomNav } from '@/components/BottomNav'
import { TTSButton } from '@/components/TTSButton'
import { getDialogueById } from '@/data/dialogues'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'

export function DialogueDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const dialogue = useMemo(() => (id ? getDialogueById(id) : undefined), [id])
  const [showKorean, setShowKorean] = useState(true)

  if (!dialogue) {
    return (
      <div className="min-h-screen bg-background pb-nav flex flex-col items-center justify-center px-6 text-center gap-3">
        <p className="text-sm text-muted-foreground">시나리오를 찾을 수 없어요</p>
        <Button onClick={() => navigate('/dialogue')}>목록으로</Button>
        <BottomNav />
      </div>
    )
  }

  // 화자 ID(0/1)로 좌우 배치 — 첫 번째 화자=왼쪽, 두 번째=오른쪽
  const firstSpeaker = dialogue.lines[0]?.speaker

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader
        title={`${dialogue.emoji} ${dialogue.titleKo}`}
        back
        backTo="/dialogue"
        rightAction={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowKorean((v) => !v)}
            aria-label="한국어 토글"
          >
            {showKorean ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </Button>
        }
      />

      <m.div
        className="px-5 mt-3 space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-3" style={{ background: 'var(--color-muted)' }}>
          <p className="text-xs text-muted-foreground">{dialogue.context}</p>
        </Card>

        {dialogue.lines.map((line, idx) => {
          const isLeft = line.speaker === firstSpeaker
          return (
            <m.div
              key={idx}
              initial={{ opacity: 0, x: isLeft ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
              className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[88%] ${isLeft ? '' : 'items-end'}`}>
                <p className="text-[11px] text-muted-foreground mb-1 px-1">
                  {line.speakerKr} <span className="opacity-60">· {line.speaker}</span>
                </p>
                <Card
                  className="p-3"
                  style={{
                    background: isLeft ? 'var(--color-card)' : 'var(--color-primary)',
                    color: isLeft ? 'var(--color-foreground)' : 'var(--color-primary-foreground)',
                    borderColor: isLeft ? undefined : 'transparent',
                  }}
                >
                  <div className="flex flex-wrap items-end gap-x-1 gap-y-1.5">
                    {line.words.map((w, wi) => (
                      <div key={wi} className="inline-flex flex-col items-center">
                        <span className="text-[15px] font-medium leading-tight">{w.text}</span>
                        <span
                          className="text-[10px] leading-tight"
                          style={{
                            color: isLeft
                              ? 'var(--color-text-secondary)'
                              : 'rgba(255,255,255,0.85)',
                          }}
                        >
                          {w.reading}
                        </span>
                        <span
                          className="romaji text-[9px] leading-tight"
                          style={{
                            color: isLeft
                              ? 'var(--color-text-tertiary)'
                              : 'rgba(255,255,255,0.7)',
                          }}
                        >
                          {hiraganaToRomaji(w.reading)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {showKorean && (
                    <p
                      className="text-[12px] mt-2 pt-2 border-t leading-snug"
                      style={{
                        borderColor: isLeft
                          ? 'var(--color-border-light)'
                          : 'rgba(255,255,255,0.25)',
                        color: isLeft
                          ? 'var(--color-text-secondary)'
                          : 'rgba(255,255,255,0.9)',
                      }}
                    >
                      {line.korean}
                    </p>
                  )}
                  <div className="mt-2 -ml-2 -mb-1">
                    <TTSButton text={line.japanese} label="" variant="ghost" />
                  </div>
                </Card>
              </div>
            </m.div>
          )
        })}
      </m.div>

      <BottomNav />
    </div>
  )
}
