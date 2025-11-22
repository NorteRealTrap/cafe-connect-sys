import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from './use-mobile'

// Mock window.matchMedia
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

import { beforeEach, describe, it, expect, vi } from 'vitest';

describe('useIsMobile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return true for mobile viewport', () => {
    mockMatchMedia(true)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    })

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('should return false for desktop viewport', () => {
    mockMatchMedia(false)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('should update when viewport changes', () => {
    let matchesValue = false
    let changeHandler: () => void

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: matchesValue,
        addEventListener: vi.fn().mockImplementation((event, handler) => {
          if (event === 'change') {
            changeHandler = handler
          }
        }),
        removeEventListener: vi.fn(),
      })),
    })

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    act(() => {
      matchesValue = true
      Object.defineProperty(window, 'innerWidth', {
        value: 500,
      })
      changeHandler()
    })

    expect(result.current).toBe(true)
  })
})