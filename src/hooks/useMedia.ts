import { useSyncExternalStore } from 'react'

function subscribeQuery(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query)
    mql.addEventListener('change', cb)
    return () => mql.removeEventListener('change', cb)
  }
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribeQuery(query),
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export type Layout = 'mobile' | 'tablet' | 'desktop'

/** Layout tier shared by CSS (same breakpoints in app.css) and the 3D scene. */
export function useLayout(): Layout {
  const mobile = useMediaQuery('(max-width: 699px)')
  const tablet = useMediaQuery('(min-width: 700px) and (max-width: 1099px)')
  return mobile ? 'mobile' : tablet ? 'tablet' : 'desktop'
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function usePageVisible(): boolean {
  return useSyncExternalStore(
    (cb) => {
      document.addEventListener('visibilitychange', cb)
      return () => document.removeEventListener('visibilitychange', cb)
    },
    () => !document.hidden,
    () => true,
  )
}
