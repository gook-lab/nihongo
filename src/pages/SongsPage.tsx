import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { Music, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BottomNav } from '@/components/BottomNav'
import { PageHeader } from '@/components/PageHeader'
import { SONGS, SONG_ERAS, getSongsByEra, type SongEra } from '@/data/songs'

type EraFilter = 'all' | SongEra

export function SongsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<EraFilter>('all')
  const songs = useMemo(() => getSongsByEra(filter), [filter])

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader
        title="동요로 배우기"
        subtitle={`${SONGS.length}곡`}
        icon={Music}
        back
        backTo="/"
      />

      <div className="px-5 mt-3">
        {/* 시대 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['all', 'warabe', 'meiji', 'minyo'] as EraFilter[]).map((mode) => {
            const count =
              mode === 'all' ? SONGS.length : SONGS.filter((s) => s.era === mode).length
            const label =
              mode === 'all' ? '전체' : SONG_ERAS[mode].label
            return (
              <Button
                key={mode}
                variant={filter === mode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(mode)}
                className="shrink-0"
              >
                {label} ({count})
              </Button>
            )
          })}
        </div>

        {/* 목록 */}
        <m.div
          className="mt-4 space-y-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
        >
          {songs.map((song) => (
            <m.div
              key={song.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card
                onClick={() => navigate(`/songs/${song.id}`)}
                className="cursor-pointer transition-transform active:scale-[0.98]"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'var(--color-sakura-100)' }}
                    >
                      <Music className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            background: 'var(--color-muted)',
                            color: 'var(--color-text-secondary)',
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
                      <h3 className="font-bold text-base leading-tight">
                        {song.title}
                      </h3>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {song.titleKo}
                      </p>
                      <p
                        className="text-xs mt-2 line-clamp-2"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {song.description}
                      </p>
                    </div>
                    <ChevronRight
                      className="w-5 h-5 shrink-0 mt-1"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </m.div>
          ))}
        </m.div>

        {/* 라이선스 안내 */}
        <p
          className="mt-5 text-center text-[10px]"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          모든 곡은 저작권이 만료된 전통/메이지·다이쇼 시대 작품입니다
        </p>
      </div>

      <BottomNav />
    </div>
  )
}
