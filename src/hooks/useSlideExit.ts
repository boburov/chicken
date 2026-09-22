import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { presentation, usePresentation } from '../state/presentation'
import { useReducedMotion } from './useMedia'

/** Elements that take part in the slide's exit/entrance choreography. */
export const OUT_SELECTOR = '.js-line, .js-in, .js-stat'

/** Plays the exit animation of the current slide, then swaps in the next one. */
export function useSlideExit(container: React.RefObject<HTMLDivElement | null>) {
  const index = usePresentation((s) => s.index)
  const shown = usePresentation((s) => s.shown)
  const reduced = useReducedMotion()
  const running = useRef(false)

  useEffect(() => {
    if (index === shown || running.current) return
    const el = container.current?.querySelector('.slide')
    const finish = () => {
      running.current = false
      presentation.set({ shown: presentation.get().index })
    }
    if (!el) return finish()
    running.current = true
    const dir = presentation.get().direction
    const q = gsap.utils.selector(el)
    const tl = gsap.timeline({ onComplete: finish })
    if (reduced) {
      tl.to(q(`${OUT_SELECTOR}, .js-photo, .js-in-kicker`), { opacity: 0, duration: 0.15 })
      return
    }
    tl.to(q(`${OUT_SELECTOR}, .js-in-kicker`), {
      opacity: 0,
      y: -12,
      z: -120,
      scale: 0.97,
      filter: 'blur(6px)',
      duration: 0.42,
      stagger: 0.015,
      ease: 'power2.in',
    })
    const photos = q('.js-photo')
    if (!photos.length) return
    tl.to(
      photos,
      {
        opacity: 0,
        z: -320,
        xPercent: -12 * dir,
        rotateY: 10 * dir,
        filter: 'blur(10px)',
        duration: 0.5,
        stagger: 0.03,
        ease: 'power2.in',
      },
      0,
    )
  }, [index, shown, reduced, container])
}
