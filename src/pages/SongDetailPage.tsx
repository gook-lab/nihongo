import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { m } from 'framer-motion'
import { Music, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { TTSButton } from '@/components/TTSButton'
import { BottomNav } from '@/components/BottomNav'
import { getSongById, SONG_ERAS } from '@/data/songs'
import { hiraganaToRomaji } from '@/lib/hiraganaToRomaji'

export function SongDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const song = useMemo(() => (id ? getSongById(id) : undefined), [id])

  const [showReading, setShowReading] = useState(true)
  const [showRomaji, setShowRomaji] = useState(true)
  const [showTranslation, setShowTranslation] = useState(true)

  if (!song) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">곡을 찾을 수 없습니다</p>
          <Button onClick={() => navigate('/songs')}>목록으로</Button>
        </div>
      </div>
    )
  }

  // 전곡 TTS용 텍스트
  const fullLyrics = song.verses.map((v) => v.ja).join('。 ')

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader title="동요" icon={Music} tone="content" back backTo="/songs" />

      <div className="px-5 mt-4">
        {/* 곡 메타 */}
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
              {SONG_ERAS[song.era].label}
            </span>
            {song.year && (
              <span
                className="text-[10px]"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {song.year}년
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold leading-tight">{song.title}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {song.titleKo}
          </p>
        </m.div>

        {/* 배경 설명 */}
        <Card
          className="mb-4"
          style={{ background: 'var(--color-muted)', border: 'none' }}
        >
          <CardContent className="p-4">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-foreground)' }}>
              {song.description}
            </p>
          </CardContent>
        </Card>

        {/* 전곡 듣기 */}
        <div className="mb-4">
          <TTSButton
            text={fullLyrics}
            label="전곡 듣기"
            variant="default"
            className="w-full h-11"
          />
        </div>

        {/* 표시 토글 */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <Button
            variant={showReading ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowReading((v) => !v)}
            className="flex-1 min-w-[80px]"
          >
            {showReading ? <Eye className="w-3.5 h-3.5 mr-1" /> : <EyeOff className="w-3.5 h-3.5 mr-1" />}
            후리가나
          </Button>
          <Button
            variant={showRomaji ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowRomaji((v) => !v)}
            className="flex-1 min-w-[80px]"
          >
            {showRomaji ? <Eye className="w-3.5 h-3.5 mr-1" /> : <EyeOff className="w-3.5 h-3.5 mr-1" />}
            로마자
          </Button>
          <Button
            variant={showTranslation ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowTranslation((v) => !v)}
            className="flex-1 min-w-[80px]"
          >
            {showTranslation ? <Eye className="w-3.5 h-3.5 mr-1" /> : <EyeOff className="w-3.5 h-3.5 mr-1" />}
            번역
          </Button>
        </div>

        {/* 절(verse)들 */}
        <m.div
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          {song.verses.map((verse, idx) => (
            <m.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span
                      className="text-[10px] font-bold mt-1.5 shrink-0"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      ♪ {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-base leading-relaxed font-medium">
                        {verse.ja}
                      </p>
                      {showReading && (
                        <p
                          className="text-xs mt-1.5"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {verse.reading}
                        </p>
                      )}
                      {showRomaji && (
                        <p
                          className="romaji text-[10px] mt-0.5"
                          style={{ color: 'var(--color-text-tertiary)' }}
                        >
                          {hiraganaToRomaji(verse.reading)}
                        </p>
                      )}
                      {showTranslation && (
                        <p
                          className="text-sm mt-2 pt-2 border-t"
                          style={{
                            color: 'var(--color-text-secondary)',
                            borderColor: 'var(--color-border-light)',
                          }}
                        >
                          {verse.ko}
                        </p>
                      )}
                      <div className="mt-2">
                        <TTSButton text={verse.ja} label="이 절" variant="ghost" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </m.div>
          ))}
        </m.div>

        {/* 위키 링크 */}
        {song.wikiUrl && (
          <a
            href={song.wikiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm underline px-1"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            위키피디아에서 더 알아보기
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        <p
          className="mt-3 px-1 text-[10px]"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {SONG_ERAS[song.era].sublabel} · Public Domain
        </p>
      </div>

      <BottomNav />
    </div>
  )
}
