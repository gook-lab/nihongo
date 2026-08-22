import { describe, it, expect } from 'vitest'
import { resolveHomeLayout } from './homeLayout'

describe('resolveHomeLayout', () => {
  it("'auto'(기본값)는 여행 홈으로 resolve된다", () => {
    expect(resolveHomeLayout('auto')).toBe('travel')
  })

  it('명시적으로 고른 레이아웃은 그대로 passthrough된다', () => {
    expect(resolveHomeLayout('mono')).toBe('mono')
    expect(resolveHomeLayout('ios')).toBe('ios')
    expect(resolveHomeLayout('editorial')).toBe('editorial')
    expect(resolveHomeLayout('mascot')).toBe('mascot')
    expect(resolveHomeLayout('default')).toBe('default')
    expect(resolveHomeLayout('travel')).toBe('travel')
  })
})
