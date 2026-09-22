import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { slides } from './data/slides'
import { presentation, stageRect, usePresentation } from './state/presentation'
import { useNavigationInput } from './hooks/useNavigationInput'
import { canUseWebGL } from './lib/webgl'
import { pad2 } from './lib/number'
import { TopNav } from './components/TopNav'
import { Controls } from './components/Controls'
import { SlideView } from './components/SlideView'
import { useSlideExit } from './hooks/useSlideExit'
import { DetailsSheet } from './components/DetailsSheet'
import { useLayout } from './hooks/useMedia'

// The 3D bundle (three + r3f + drei) loads in parallel with first paint.
const Stage = lazy(() => import('./three/Stage'))

/** Keeps stageRect in sync with the on-screen stage area (the 3D camera centres on it). */
function useStageRect(ref: React.RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      stageRect.x = r.left
      stageRect.y = r.top
      stageRect.width = r.width
      stageRect.height = r.height
      stageRect.version++
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [ref])
}

/** Preloads photos of neighbouring slides so they're ready before navigation. */
function usePreloadNeighbours(index: number) {
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 400))
    const id = idle(() => {
      ;[index - 1, index + 1].forEach((i) => {
        slides[i]?.photos?.forEach((p) => {
          const img = new Image()
          img.decoding = 'async'
          img.src = p.src
        })
      })
    })
    return () => {
      if (typeof id === 'number') (window.cancelIdleCallback ?? window.clearTimeout)(id)
    }
  }, [index])
}

export default function App() {
  const shown = usePresentation((s) => s.shown)
  const index = usePresentation((s) => s.index)
  const [use3D] = useState(canUseWebGL)
  const layout = useLayout()
  const stageAnchor = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  // The very first slide waits for the backdrop + camera entrance; later ones don't.
  const hasNavigated = usePresentation((s) => s.hasNavigated)
  const [ready, setReady] = useState(false)

  useNavigationInput()
  useStageRect(stageAnchor)
  useSlideExit(content)
  usePreloadNeighbours(index)

  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(t)
  }, [])

  // Close the mobile sheet if the layout grows past mobile.
  useEffect(() => {
    if (layout !== 'mobile') presentation.set({ detailsOpen: false })
  }, [layout])

  const slide = slides[shown]

  return (
    <div className={`app ${ready ? 'is-ready' : ''} ${use3D ? 'has-3d' : 'no-3d'}`}>
      <div className="backdrop" aria-hidden="true">
        <span className="backdrop__glow backdrop__glow--blue" />
        <span className="backdrop__glow backdrop__glow--violet" />
        <span className="backdrop__glow backdrop__glow--soft" />
      </div>

      {use3D && (
        <Suspense fallback={null}>
          <Stage />
        </Suspense>
      )}

      <TopNav />

      <div className="stage-anchor" ref={stageAnchor} aria-hidden="true" />

      <main className="content" ref={content}>
        <SlideView key={slide.id} slide={slide} index={shown} use3D={use3D} first={!hasNavigated} />
      </main>

      <Controls />
      {layout === 'mobile' && <DetailsSheet slide={slide} />}

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {`${pad2(shown + 1)} / ${pad2(slides.length)} — ${slide.kicker}. ${slide.title.join(' ')}`}
      </p>
    </div>
  )
}
