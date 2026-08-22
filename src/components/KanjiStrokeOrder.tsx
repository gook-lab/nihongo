// 한자 획순 표시 — KanjiVG SVG를 CDN에서 fetch 후 inline 렌더
// inline으로 가져오면 stroke 색상/번호를 우리 토큰으로 스타일링 가능
import { useEffect, useState } from 'react'
import { m } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { getKanjiVgUrl } from '@/data/kanji'

interface Props {
  kanji: string
  size?: number
  showNumbers?: boolean // 획 순서 번호 표시
  className?: string
}

// 메모리 캐시 — 같은 한자 재요청 방지
const svgCache = new Map<string, string>()
const failedSet = new Set<string>()

export function KanjiStrokeOrder({
  kanji,
  size = 200,
  showNumbers = true,
  className = '',
}: Props) {
  const [svg, setSvg] = useState<string | null>(svgCache.get(kanji) ?? null)
  const [error, setError] = useState(failedSet.has(kanji))

  useEffect(() => {
    if (svgCache.has(kanji)) {
      setSvg(svgCache.get(kanji)!)
      setError(false)
      return
    }
    if (failedSet.has(kanji)) {
      setError(true)
      return
    }
    const url = getKanjiVgUrl(kanji)
    if (!url) {
      setError(true)
      return
    }
    let cancelled = false
    fetch(url)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((text) => {
        if (cancelled) return
        svgCache.set(kanji, text)
        setSvg(text)
        setError(false)
      })
      .catch(() => {
        if (cancelled) return
        failedSet.add(kanji)
        setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [kanji])

  if (error) {
    // KanjiVG에 없거나 네트워크 실패 — 폴백으로 한자만 크게 표시
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <span
          className="font-bold"
          style={{ fontSize: size * 0.7, color: 'var(--color-foreground)' }}
        >
          {kanji}
        </span>
      </div>
    )
  }

  if (!svg) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-text-tertiary)' }} />
      </div>
    )
  }

  return (
    <m.div
      key={kanji}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`kanjivg-wrap ${className}`}
      style={{ width: size, height: size }}
      // KanjiVG SVG 구조에 우리 색상 토큰 주입
      dangerouslySetInnerHTML={{ __html: scopeKanjiVgSvg(svg, size, showNumbers) }}
    />
  )
}

// KanjiVG SVG 원본에 width/height + stroke 색상 + 번호 표시 토글
// 원본은 stroke와 numbers가 별도 group으로 들어있음 (id에 -StrokeNumbers 포함)
function scopeKanjiVgSvg(rawSvg: string, size: number, showNumbers: boolean): string {
  let out = rawSvg

  // <svg ...>의 width/height 갱신
  out = out.replace(
    /<svg([^>]*?)>/i,
    (_m, attrs: string) => {
      const cleaned = attrs
        .replace(/\swidth="[^"]*"/, '')
        .replace(/\sheight="[^"]*"/, '')
      return `<svg${cleaned} width="${size}" height="${size}" style="--kvg-stroke: var(--color-foreground); --kvg-numbers: var(--color-primary);">`
    },
  )

  // stroke 색상: kvg:Stroke 그룹은 기본 black, 우리 foreground 토큰으로 변경
  // 원본은 style="fill:none;stroke:#000000;..." 형태
  out = out.replace(/stroke:#000000/g, 'stroke:var(--kvg-stroke)')

  // 획 번호(StrokeNumbers) 표시 토글
  if (!showNumbers) {
    out = out.replace(
      /<g[^>]*StrokeNumbers[^>]*>([\s\S]*?)<\/g>/g,
      '',
    )
  } else {
    // 번호 색상도 primary로
    out = out.replace(/fill:#808080/g, 'fill:var(--kvg-numbers)')
  }

  return out
}
