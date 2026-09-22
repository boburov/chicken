import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import type { Slide } from '../data/types'
import { presentation, usePresentation } from '../state/presentation'
import { useLayout, useReducedMotion } from '../hooks/useMedia'
import { StatChip } from './StatChip'
import { PhotoLayer } from './PhotoLayer'
import { FallbackVisual } from './FallbackVisual'
import { FinancingBlock } from './FinancingBlock'
import { ComparisonPanel } from './ComparisonPanel'
import { OUT_SELECTOR } from '../hooks/useSlideExit'

interface Props {
  slide: Slide
  index: number
  use3D: boolean
  /** First slide shown after page load: waits for the backdrop + camera entrance. */
  first: boolean
}

/**
 * One slide's HTML layer (text, stats, photos, data strip). Mounted per slide; the
 * parent swaps it after the outgoing animation, and this component plays the entrance.
 */
export function SlideView({ slide, index, use3D, first }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const layout = useLayout()
  const direction = usePresentation((s) => s.direction)
  const isMobile = layout === 'mobile'

  // Entrance
  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      const d0 = first ? 0.9 : 0.15
      if (reduced) {
        // Explicit end value: a plain from() can capture a mid-fade opacity on remount.
        gsap.fromTo(
          gsap.utils.selector(el)(`${OUT_SELECTOR}, .js-photo, .js-in-kicker`),
          { opacity: 0 },
          { opacity: 1, duration: 0.3, delay: first ? 0.2 : 0 },
        )
        return
      }
      const q = gsap.utils.selector(el)
      const tl = gsap.timeline({ delay: d0 })
      tl.from(q('.js-in-kicker'), { opacity: 0, x: -16 * direction, duration: 0.6, ease: 'power3.out' })
        .from(
          q('.js-line'),
          { yPercent: 115, rotateX: -35, opacity: 0, duration: 0.95, stagger: 0.09, ease: 'expo.out' },
          '<0.05',
        )
      const ins = q('.js-in')
      if (ins.length)
        tl.from(ins, { opacity: 0, y: 14, filter: 'blur(6px)', duration: 0.7, stagger: 0.06, ease: 'power3.out', clearProps: 'filter' }, '<0.35')
      const stats = q('.js-stat')
      if (stats.length)
        tl.from(
          stats,
          { opacity: 0, y: 22, z: -80, scale: 0.94, filter: 'blur(8px)', duration: 0.8, stagger: 0.07, ease: 'power3.out', clearProps: 'filter' },
          '<0.1',
        )
      gsap.utils.toArray<HTMLElement>('.js-photo', el).forEach((ph, i) => {
        const depth = Number(ph.dataset.depth ?? 0.5)
        gsap.from(ph, {
          opacity: 0,
          z: -260 - depth * 200,
          xPercent: 18 * direction * (1 + depth),
          rotateY: -14 * direction,
          filter: 'blur(10px)',
          duration: 1.4,
          delay: d0 + 0.25 + i * 0.12,
          ease: 'expo.out',
          clearProps: 'filter',
        })
      })
    }, el)
    return () => ctx.revert()
    // Direction is read at mount time only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // On phones, secondary numbers (strip + 3D tags) move into the “Batafsil” sheet.
  const extras = slide.strip.length > 0 || (!!slide.tags?.length && use3D)

  return (
    <div
      className={`slide slide--${slide.visual}`}
      ref={root}
      role="group"
      aria-roledescription="slayd"
      aria-label={`${index + 1} / ${presentation.count}: ${slide.navLabel}`}
    >
      <div className="slide__text">
        <p className="kicker js-in-kicker">
          <span className="kicker__bar" aria-hidden="true" />
          {slide.kicker}
        </p>
        <h1 className="title">
          {slide.title.map((line) => (
            <span className="title__line" key={line}>
              <span className="title__inner js-line">{line}</span>
            </span>
          ))}
        </h1>
        {slide.subtitle && <p className="subtitle js-in">{slide.subtitle}</p>}
        {slide.financing && <FinancingBlock data={slide.financing} delay={first ? 1.5 : 0.75} />}
        {slide.comparison && <ComparisonPanel data={slide.comparison} delay={first ? 1.5 : 0.8} />}

        {slide.hero.length > 0 && (
          <div className="hero-stats">
            {slide.hero.map((s, i) => (
              <StatChip
                key={s.label + s.value}
                stat={s}
                play
                delay={(first ? 1.5 : 0.75) + i * 0.08}
                size={i === 0 ? 'xl' : 'lg'}
                className={`js-stat float-${i % 3}`}
              />
            ))}
          </div>
        )}

        {isMobile && extras && (
          <button className="details-btn js-in" onClick={() => presentation.set({ detailsOpen: true })}>
            Batafsil
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        )}

        {slide.footnote && <p className="footnote js-in">{slide.footnote}</p>}
      </div>

      <div className="slide__stage">
        {slide.photos && <PhotoLayer photos={isMobile ? slide.photos.slice(0, 1) : slide.photos} eager={index === 0} />}
        {!use3D && <FallbackVisual slide={slide} play />}
      </div>

      {slide.strip.length > 0 && !isMobile && (
        <div className="strip js-in" aria-label="Qoʻshimcha koʻrsatkichlar">
          {slide.strip.map((s) => (
            <StatChip key={s.label + s.value} stat={s} play delay={first ? 1.9 : 1.1} size="sm" className="js-stat" />
          ))}
        </div>
      )}
    </div>
  )
}
