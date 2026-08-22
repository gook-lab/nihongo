import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { Volume2, Grid3X3, Gamepad2, PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BottomNav } from '@/components/BottomNav'
import { MascotAvatar } from '@/components/MascotAvatar'
import { PageHeader } from '@/components/PageHeader'
import { useAppStore } from '@/store'
import {
  BASIC_KANA,
  DAKUON_KANA,
  HANDAKUON_KANA,
  COLUMN_HEADERS,
  ROW_HEADERS,
  DAKUON_ROW_HEADERS,
  HANDAKUON_ROW_HEADERS,
  type KanaChar,
} from '@/data/kana'

type KanaType = 'hiragana' | 'katakana'

// 브라우저 TTS 지원 여부
const isBrowserTTSSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window

export function KanaChartPage() {
  const navigate = useNavigate()
  const [kanaType, setKanaType] = useState<KanaType>('hiragana')
  const { ttsRate } = useAppStore()

  // 탭 변경 시 스크롤 최상단으로
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [kanaType])

  // 가나 발음은 브라우저 TTS만 사용 (단순 음절이라 API 호출 불필요)
  const handleSpeak = (char: KanaChar) => {
    if (!isBrowserTTSSupported || !char.hiragana) return

    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(char.hiragana)
    utterance.lang = 'ja-JP'
    utterance.rate = ttsRate
    speechSynthesis.speak(utterance)
  }

  const renderKanaCell = (char: KanaChar, rowIndex: number, colIndex: number) => {
    if (!char.hiragana) {
      return (
        <div
          key={`${rowIndex}-${colIndex}`}
          className="w-full aspect-square bg-muted/50 rounded-lg"
        />
      )
    }

    const displayChar = kanaType === 'hiragana' ? char.hiragana : char.katakana

    return (
      <m.button
        key={`${rowIndex}-${colIndex}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleSpeak(char)}
        className="w-full aspect-square bg-background border border-border rounded-lg p-1 flex flex-col items-center justify-center hover:bg-primary/5 hover:border-primary/30 transition-colors"
      >
        <span className="text-2xl sm:text-3xl font-bold">{displayChar}</span>
        <span className="text-[10px] sm:text-xs text-muted-foreground">{char.romaji}</span>
        <span className="text-[10px] sm:text-xs text-primary">{char.korean}</span>
      </m.button>
    )
  }

  const renderTable = (
    data: KanaChar[][],
    rowHeaders: string[],
    title: string,
    subtitle: string
  ) => (
    <Card className=" overflow-scroll">
      <div className="bg-primary/10 py-3 px-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Grid3X3 className="w-3 h-3 text-primary" />
          </div>
          <div className="text-center">
            <span className="font-semibold">{title}</span>
            <span className="text-sm text-muted-foreground ml-2">{subtitle}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-2 sm:p-4">
        {/* 열 헤더 */}
        <div className="grid grid-cols-6 gap-1 sm:gap-2 mb-2">
          <div /> {/* 빈 셀 */}
          {COLUMN_HEADERS.map((header, i) => (
            <div
              key={i}
              className="text-center text-xs sm:text-sm font-medium text-muted-foreground"
            >
              {header}
            </div>
          ))}
        </div>

        {/* 본문 */}
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-6 gap-1 sm:gap-2 mb-1 sm:mb-2">
            {/* 행 헤더 */}
            <div className="flex items-center justify-center text-xs sm:text-sm font-medium text-muted-foreground">
              {rowHeaders[rowIndex]}
            </div>
            {/* 가나 셀들 */}
            {row.map((char, colIndex) => renderKanaCell(char, rowIndex, colIndex))}
          </div>
        ))}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background pb-nav">
      <PageHeader
        title={kanaType === 'hiragana' ? 'ひらがな 히라가나' : 'カタカナ 가타카나'}
        icon={Grid3X3}
        back
        backTo="/dictionary"
        rightAction={
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={() => navigate('/kana/practice')} className="gap-1">
              <PenLine className="w-4 h-4" />
              연습
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/kana-game')} className="gap-1">
              <Gamepad2 className="w-4 h-4" />
              게임
            </Button>
          </div>
        }
      />
      <div className="px-5 pt-2">
        <m.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>

          {/* 큰 마스코트 (학습 친구 — 응원) */}
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mt-4"
          >
            <MascotAvatar size="2xl" reaction="cheer" />
          </m.div>

          {/* 타입 선택 */}
          <div className="flex gap-2 justify-center mt-3">
            <Button
              variant={kanaType === 'hiragana' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setKanaType('hiragana')}
            >
              히라가나
            </Button>
            <Button
              variant={kanaType === 'katakana' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setKanaType('katakana')}
            >
              가타카나
            </Button>
          </div>

          {isBrowserTTSSupported && (
            <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
              <Volume2 className="w-3 h-3" />
              글자를 터치하면 발음을 들을 수 있습니다
            </p>
          )}
        </m.div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* 기본 50음도 */}
        {renderTable(
          BASIC_KANA,
          ROW_HEADERS,
          '기본 50음도',
          '清音'
        )}

        {/* 탁음 */}
        {renderTable(
          DAKUON_KANA,
          DAKUON_ROW_HEADERS,
          '탁음',
          '濁音'
        )}

        {/* 반탁음 */}
        {renderTable(
          HANDAKUON_KANA,
          HANDAKUON_ROW_HEADERS,
          '반탁음',
          '半濁音'
        )}
      </div>

      <BottomNav />
    </div>
  )
}
