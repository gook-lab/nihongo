import { describe, it, expect } from 'vitest'
import { THEMES, getThemeById, DEFAULT_THEME_ID, migrateThemeId } from './themes'

describe('themes', () => {
  it('모든 테마가 필수 토큰 셋을 포함', () => {
    // 필수 키 — 빠지면 cascade에서 다른 테마의 값이 새어 들어옴
    const requiredKeys = [
      '--color-primary',
      '--color-primary-foreground',
      '--color-background',
      '--color-foreground',
      '--color-card',
      '--color-muted',
      '--color-border',
      '--color-text-primary',
      '--color-text-secondary',
      '--color-text-tertiary',
      '--font-sans',
      '--radius',
    ]
    for (const theme of THEMES) {
      for (const key of requiredKeys) {
        expect(theme.tokens[key], `테마 ${theme.id}: ${key} 누락`).toBeDefined()
      }
    }
  })

  it('preview 색상이 정의되어 있음 (테마 그리드 표시)', () => {
    for (const theme of THEMES) {
      expect(theme.preview.bg).toMatch(/^#[0-9A-F]{6}$/i)
      expect(theme.preview.accent).toMatch(/^#[0-9A-F]{6}$/i)
      expect(theme.preview.ink).toMatch(/^#[0-9A-F]{6}$/i)
    }
  })

  it('테마 ID가 모두 고유', () => {
    const ids = THEMES.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('getThemeById는 새 ID를 반환', () => {
    expect(getThemeById('default').id).toBe('default')
    expect(getThemeById('ink').id).toBe('ink')
    expect(getThemeById('editorial').id).toBe('editorial')
  })

  it('getThemeById는 레거시 ID를 자동 매핑', () => {
    expect(getThemeById('d6-ink').id).toBe('ink')
    expect(getThemeById('d4-editorial').id).toBe('editorial')
    expect(getThemeById('d1-pink').id).toBe('default')
    expect(getThemeById('d5-mascot').id).toBe('editorial')
  })

  it('getThemeById는 존재하지 않는 ID에 default fallback', () => {
    expect(getThemeById('non-existent').id).toBe('default')
  })

  it('migrateThemeId — 알 수 없는 값 → default', () => {
    expect(migrateThemeId(undefined)).toBe('default')
    expect(migrateThemeId(null)).toBe('default')
    expect(migrateThemeId('garbage')).toBe('default')
  })

  it('DEFAULT_THEME_ID는 THEMES에 존재', () => {
    expect(THEMES.find((t) => t.id === DEFAULT_THEME_ID)).toBeDefined()
  })
})
