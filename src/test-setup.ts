import '@testing-library/jest-dom'

// Polyfill matchMedia for jsdom environment (used by next-themes, sonner, etc.)
(() => {
  const mm = (query: string) => ({
    matches: false,
    media: query,
    onchange: null as any,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })

  if (typeof window !== 'undefined' && typeof (window as any).matchMedia !== 'function') {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mm,
    })
  }
  if (typeof globalThis !== 'undefined' && typeof (globalThis as any).matchMedia !== 'function') {
    Object.defineProperty(globalThis as any, 'matchMedia', {
      writable: true,
      value: mm,
    })
  }
})()