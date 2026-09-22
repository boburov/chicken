import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import type { Slide } from '../data/types'
import { presentation, usePresentation } from '../state/presentation'
import { StatChip } from './StatChip'
import { StatValue } from './StatValue'

/** Mobile-only glass sheet holding the secondary numbers (“Batafsil”). */
export function DetailsSheet({ slide }: { slide: Slide }) {
  const open = usePresentation((s) => s.detailsOpen)
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open) {
      el.hidden = false
      gsap.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: 'power3.out' })
      closeRef.current?.focus()
    } else if (!el.hidden) {
      gsap.to(el, { yPercent: 100, duration: 0.35, ease: 'power2.in', onComplete: () => void (el.hidden = true) })
    }
  }, [open])

  const hasTags = !!slide.tags?.length
  return (
    <div className="sheet glass" ref={ref} hidden role="dialog" aria-modal="true" aria-label="Batafsil" data-no-swipe>
      <div className="sheet__head">
        <strong>Batafsil</strong>
        <button ref={closeRef} className="icon-btn" onClick={() => presentation.set({ detailsOpen: false })} aria-label="Yopish">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="sheet__body">
        {hasTags && (
          <ul className="sheet__tags">
            {slide.tags!.map((t) => (
              <li key={t.id}>
                <span>{t.title}</span>
                <strong>
                  <StatValue value={t.value ?? ''} play={false} /> <small>{t.unit}</small>
                </strong>
              </li>
            ))}
          </ul>
        )}
        <div className="sheet__stats">
          {slide.strip.map((s) => (
            <StatChip key={s.label + s.value} stat={s} play={false} size="sm" />
          ))}
        </div>
      </div>
    </div>
  )
}
