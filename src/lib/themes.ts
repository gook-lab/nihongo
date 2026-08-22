// 테마 정의 — share/fianl/UI Tone Board 기준 3개 테마로 통합.
//   default   · Airbnb Coral 친근한 기본
//   editorial · 매거진 큰 세리프 + 베이지 (구 d4-editorial)
//   ink       · 미니멀 모노톤 + 검정 CTA (구 d6-ink)
// 레거시 ID는 migrateThemeId()로 자동 매핑됨.

export type ThemeId = 'default' | 'editorial' | 'ink'

/** 레거시 테마 ID — persist 데이터에 남아있을 수 있어 마이그레이션 매핑 필요 */
export type LegacyThemeId = 'd1-pink' | 'd2-mono' | 'd3-ios' | 'd4-editorial' | 'd5-mascot' | 'd6-ink'

/** 저장된 (구) 테마 ID를 새 ID로 매핑. 알 수 없으면 default. */
export function migrateThemeId(id: string | undefined | null): ThemeId {
  if (!id) return 'default'
  const legacyMap: Record<LegacyThemeId, ThemeId> = {
    'd1-pink': 'default',
    'd2-mono': 'ink',
    'd3-ios': 'default',
    'd4-editorial': 'editorial',
    'd5-mascot': 'editorial',
    'd6-ink': 'ink',
  }
  if (id === 'default' || id === 'editorial' || id === 'ink') return id
  if (id in legacyMap) return legacyMap[id as LegacyThemeId]
  return 'default'
}

export interface ThemeDefinition {
  id: ThemeId
  name: string
  nameJa: string
  description: string
  preview: {
    bg: string
    accent: string
    ink: string
  }
  tokens: Record<string, string>
}

const SHARED_FONT_SANS =
  '"Pretendard Variable", "Pretendard", -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", "Inter", "Noto Sans JP", "Hiragino Sans", system-ui, sans-serif'

export const THEMES: ThemeDefinition[] = [
  {
    id: 'default',
    name: '기본',
    nameJa: 'スタンダード',
    description: 'Airbnb Coral 친근한 기본',
    preview: { bg: '#FFFFFF', accent: '#FF5A5F', ink: '#222222' },
    tokens: {
      '--color-primary': '#FF5A5F',
      '--color-primary-hover': '#E04E52',
      '--color-primary-foreground': '#FFFFFF',
      '--color-background': '#FFFFFF',
      '--color-foreground': '#222222',
      '--color-card': '#FFFFFF',
      '--color-card-foreground': '#222222',
      '--color-muted': '#F7F7F7',
      '--color-muted-foreground': '#717171',
      '--color-border': '#DDDDDD',
      '--color-border-light': '#EBEBEB',
      '--color-text-primary': '#222222',
      '--color-text-secondary': '#717171',
      '--color-text-tertiary': '#B0B0B0',
      '--color-sakura-100': '#FFF0F0',
      '--color-sakura-200': '#FFE0E1',
      '--color-sakura-500': '#FF5A5F',
      '--color-sakura-700': '#C13515',
      '--radius': '12px',
      '--radius-lg': '16px',
      '--radius-xl': '24px',
      '--shadow-primary-glow': '0 6px 20px rgba(255, 90, 95, 0.30)',
      '--font-sans': SHARED_FONT_SANS,
    },
  },
  {
    id: 'editorial',
    name: '에디토리얼',
    nameJa: 'エディトリアル',
    description: '매거진 큰 세리프 + 넓은 여백',
    preview: { bg: '#FAF8F5', accent: '#E83E7A', ink: '#1A1612' },
    tokens: {
      '--color-primary': '#E83E7A',
      '--color-primary-hover': '#C92C66',
      '--color-primary-foreground': '#FFFFFF',
      '--color-background': '#FAF8F5',
      '--color-foreground': '#1A1612',
      '--color-card': '#FFFFFF',
      '--color-card-foreground': '#1A1612',
      '--color-muted': '#F2EDE3',
      '--color-muted-foreground': '#6B6360',
      '--color-border': '#E6DED5',
      '--color-border-light': '#EFE9E2',
      '--color-text-primary': '#1A1612',
      '--color-text-secondary': '#6B6360',
      '--color-text-tertiary': '#A89E99',
      '--color-sakura-100': '#F2EDE3',
      '--color-sakura-200': '#EBE3D2',
      '--color-sakura-500': '#E83E7A',
      '--color-sakura-700': '#C92C66',
      '--radius': '6px',
      '--radius-lg': '10px',
      '--radius-xl': '14px',
      '--shadow-primary-glow': '0 3px 12px rgba(232, 62, 122, 0.16)',
      '--font-sans': SHARED_FONT_SANS,
      // 에디토리얼만 display 폰트 — H1+ 큰 헤딩에 italic serif 적용 (KO/JP 폴백)
      '--font-display':
        '"Instrument Serif", "Hiragino Mincho ProN", "Noto Serif KR", "Noto Serif JP", Georgia, serif',
    },
  },
  {
    id: 'ink',
    name: '잉크',
    nameJa: 'インク',
    description: '미니멀 모노톤 + 검정 CTA',
    preview: { bg: '#FFFFFF', accent: '#0E0E10', ink: '#0E0E10' },
    tokens: {
      '--color-primary': '#0E0E10',
      '--color-primary-hover': '#2D2D2D',
      '--color-primary-foreground': '#FFFFFF',
      '--color-background': '#FFFFFF',
      '--color-foreground': '#0E0E10',
      '--color-card': '#FFFFFF',
      '--color-card-foreground': '#0E0E10',
      '--color-muted': '#F5F5F3',
      '--color-muted-foreground': '#6B6B6E',
      '--color-border': '#E8E8E5',
      '--color-border-light': '#F0EFEC',
      '--color-text-primary': '#0E0E10',
      '--color-text-secondary': '#6B6B6E',
      '--color-text-tertiary': '#A0A0A3',
      '--color-sakura-100': '#F5F5F3',
      '--color-sakura-200': '#EBEAE7',
      '--color-sakura-500': '#0E0E10',
      '--color-sakura-700': '#0E0E10',
      '--radius': '14px',
      '--radius-lg': '18px',
      '--radius-xl': '22px',
      '--shadow-primary-glow': '0 6px 20px rgba(14, 14, 16, 0.22)',
      '--font-sans': SHARED_FONT_SANS,
    },
  },
]

export const DEFAULT_THEME_ID: ThemeId = 'default'

export function getThemeById(id: ThemeId | string): ThemeDefinition {
  const safe = migrateThemeId(id as string)
  return THEMES.find((t) => t.id === safe) ?? THEMES[0]
}

// 다크 모드에서도 유지할 토큰 (액센트만 테마 따라 변경, 나머지는 .dark 규칙이 작동하도록)
const DARK_ALLOWED_TOKENS: ReadonlyArray<string> = [
  '--color-primary',
  '--color-primary-hover',
  '--color-primary-foreground',
  '--color-sakura-500',
  '--color-sakura-700',
  '--radius',
  '--radius-lg',
  '--radius-xl',
  '--font-sans',
  '--font-display',
  '--shadow-primary-glow',
]

// editorial 외 테마들의 --font-display 폴백 (--font-sans와 동일)
function withDisplayFallback(tokens: Record<string, string>): Record<string, string> {
  if (tokens['--font-display']) return tokens
  return { ...tokens, '--font-display': tokens['--font-sans'] ?? 'inherit' }
}

/** CSS 변수를 :root에 주입. data-theme 속성 동기화. */
export function applyTheme(id: ThemeId | string, isDark: boolean = false) {
  const safe = migrateThemeId(id as string)
  const theme = getThemeById(safe)
  const tokens = withDisplayFallback(theme.tokens)
  const root = document.documentElement
  for (const [key, value] of Object.entries(tokens)) {
    if (isDark && !DARK_ALLOWED_TOKENS.includes(key)) {
      root.style.removeProperty(key)
    } else {
      root.style.setProperty(key, value)
    }
  }
  root.setAttribute('data-theme', safe)
}
