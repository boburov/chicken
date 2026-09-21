import { useEffect, useRef } from 'react'
import type { Photo } from '../data/types'
import { pointer } from '../state/presentation'
import { useReducedMotion } from '../hooks/useMedia'

/**
 * Reference photos arranged at different depths around the 3D object. They drift with the
 * cursor (parallax scaled by depth) and tilt toward it on hover.
 */
export function PhotoLayer({ photos, eager }: { photos: Photo[]; eager: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    let raf = 0
    const sm = { x: 0, y: 0 }
    const loop = () => {
      sm.x += (pointer.x - sm.x) * 0.06
      sm.y += (pointer.y - sm.y) * 0.06
      root.current?.style.setProperty('--px', sm.x.toFixed(4))
      root.current?.style.setProperty('--py', sm.y.toFixed(4))
      raf = requestAnimationFrame(loop)
    }
    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduced])

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType === 'touch') return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--rx', `${(((e.clientY - r.top) / r.height - 0.5) * -10).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 12).toFixed(2)}deg`)
  }
  const onLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg')
    e.currentTarget.style.setProperty('--ry', '0deg')
  }

  return (
    <div className="photo-layer" ref={root}>
      {photos.map((p) => (
        <figure
          key={p.src + p.slot}
          className={`photo photo--${p.slot} js-photo`}
          style={{ '--depth': p.depth } as React.CSSProperties}
          data-depth={p.depth}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          <div className="photo__tilt">
            <img src={p.src} alt={p.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} />
            <span className="photo__sheen" aria-hidden="true" />
          </div>
        </figure>
      ))}
    </div>
  )
}
