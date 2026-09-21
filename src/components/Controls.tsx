import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { slides } from '../data/slides'
import { pad2 } from '../lib/number'
import { presentation, usePresentation } from '../state/presentation'

/** Prev/next arrows, clickable dots and an animated “01 / 07” counter. */
export function Controls() {
  const index = usePresentation((s) => s.index)
  const direction = usePresentation((s) => s.direction)
  const numRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = numRef.current
    if (el) {
      gsap.fromTo(
        el,
        { yPercent: direction * 70, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
      )
    }
    if (barRef.current) {
      gsap.to(barRef.current, { scaleX: (index + 1) / slides.length, duration: 0.9, ease: 'power3.inOut' })
    }
  }, [index, direction])

  return (
    <div className="controls" data-no-swipe>
      <div className="controls__arrows">
        <button className="arrow-btn" onClick={presentation.prev} disabled={index === 0} aria-label="Oldingi slayd">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          className="arrow-btn arrow-btn--primary"
          onClick={presentation.next}
          disabled={index === slides.length - 1}
          aria-label="Keyingi slayd"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="controls__dots" role="tablist" aria-label="Slaydlar">
        {slides.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === index}
            aria-label={`${pad2(i + 1)} · ${s.navLabel}`}
            className={`dot ${i === index ? 'is-active' : ''}`}
            onClick={() => presentation.goTo(i)}
          >
            <span className="dot__label">{s.navLabel}</span>
          </button>
        ))}
      </div>

      <div className="controls__progress" aria-live="off">
        <span className="progress-num">
          <span className="progress-num__cur" ref={numRef}>
            {pad2(index + 1)}
          </span>
          <span className="progress-num__sep">/</span>
          <span className="progress-num__total">{pad2(slides.length)}</span>
        </span>
        <span className="progress-bar">
          <span ref={barRef} className="progress-bar__fill" style={{ transform: `scaleX(${1 / slides.length})` }} />
        </span>
      </div>
    </div>
  )
}
