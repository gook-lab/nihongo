import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { m } from 'framer-motion'
import { BookOpen, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TTSButton } from '@/components/TTSButton'
import { BottomNav } from '@/components/BottomNav'
import { getReadingById, type ReadingVocabulary } from '@/data/reading'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'
import { useAppStore } from '@/store'

export function ReadingDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const getAiReadingById = useAppStore((s) => s.getAiReadingById)
  // 정적 콘텐츠 우선, 없으면 AI 생성 라이브러리에서 조회
  const piece = useMemo(
    () => (id ? getReadingById(id) ?? getAiReadingById(id) : undefined),
    [id, getAiReadingById],
  )

  const [showReading, setShowReading] = useState(true)
  const [showTranslation, setShowTranslation] = useState(true)
  const [selectedWord, setSelectedWord] = useState<ReadingVocabulary | null>(null)

  if (!piece) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">글을 찾을 수 없습니다</p>
          <Button onClick={() => navigate('/reading')}>목록으로</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader title="짧은 글" icon={BookOpen} tone="content" back backTo="/reading" />

      <div className="px-5 mt-4">
        {/* 글 메타 */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style={{
                background: 'var(--color-sakura-100)',
                color: 'var(--color-primary)',
              }}
            >
              {piece.level}
            </span>
            <span
              className="text-[10px]"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {piece.estimatedMinutes}분 분량
            </span>
          </div>
          <h1 className="text-2xl font-bold leading-tight">{piece.title}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {piece.titleKo}
          </p>
        </m.div>

        {/* 표시 토글 */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={showReading ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowReading((v) => !v)}
            className="flex-1"
          >
            {showReading ? <Eye className="w-3.5 h-3.5 mr-1.5" /> : <EyeOff className="w-3.5 h-3.5 mr-1.5" />}
            후리가나
          </Button>
          <Button
            variant={showTranslation ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowTranslation((v) => !v)}
            className="flex-1"
          >
            {showTranslation ? <Eye className="w-3.5 h-3.5 mr-1.5" /> : <EyeOff className="w-3.5 h-3.5 mr-1.5" />}
            번역
          </Button>
        </div>

        {/* 본문 단락들 */}
        <m.div
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          {piece.paragraphs.map((para, idx) => (
            <m.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <span
                      className="text-[10px] font-bold mt-1.5 shrink-0"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-base leading-relaxed font-medium">
                        {para.ja}
                      </p>
                      {showReading && (
                        <>
                          <p
                            className="text-xs mt-1.5"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {para.reading}
                          </p>
                          <p
                            className="romaji text-[10px] mt-0.5"
                            style={{ color: 'var(--color-text-tertiary)' }}
                          >
                            {hiraganaToRomaji(para.reading)}
                          </p>
                        </>
                      )}
                      {showTranslation && (
                        <p
                          className="text-sm mt-2 pt-2 border-t"
                          style={{
                            color: 'var(--color-text-secondary)',
                            borderColor: 'var(--color-border-light)',
                          }}
                        >
                          {para.ko}
                        </p>
                      )}
                      <div className="mt-2">
                        <TTSButton text={para.ja} label="듣기" variant="ghost" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </m.div>
          ))}
        </m.div>

        {/* 핵심 단어 */}
        {piece.vocabulary.length > 0 && (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <h2
              className="text-[11px] uppercase tracking-wider font-semibold mb-2 px-1"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              핵심 단어 · 탭하여 자세히
            </h2>
            <Card>
              <CardContent className="p-2 divide-y divide-border-light">
                {piece.vocabulary.map((vocab) => (
                  <button
                    key={vocab.kanji}
                    onClick={() => setSelectedWord(vocab)}
                    className="w-full flex items-center justify-between py-2.5 px-2 text-left hover:bg-muted/40 rounded transition-colors"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold">{vocab.kanji}</span>
                      <span
                        className="text-xs"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {vocab.reading}
                      </span>
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {vocab.meaning}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </m.div>
        )}

        {/* 출처 */}
        <div
          className="mt-5 px-1 text-[11px]"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          출처: {piece.sourceLabel}
          {piece.sourceUrl && (
            <a
              href={piece.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 ml-2 underline"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              원문 보기
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* 단어 상세 모달 */}
      <Dialog open={selectedWord !== null} onOpenChange={(v) => !v && setSelectedWord(null)}>
        <DialogContent className="w-[calc(100vw-32px)] max-w-[360px]">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-bold">
              {selectedWord?.kanji}
            </DialogTitle>
          </DialogHeader>
          {selectedWord && (
            <div className="text-center space-y-3 pt-2">
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {selectedWord.reading}
              </p>
              <p
                className="romaji text-xs"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {hiraganaToRomaji(selectedWord.reading)}
              </p>
              <p
                className="text-lg font-semibold"
                style={{ color: 'var(--color-primary)' }}
              >
                {selectedWord.meaning}
              </p>
              <div className="pt-2 flex justify-center">
                <TTSButton
                  text={selectedWord.kanji}
                  label="발음 듣기"
                  variant="outline"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  )
}
