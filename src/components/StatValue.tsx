import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { formatValue, parseValue } from '../lib/number'
import { useReducedMotion } from '../hooks/useMedia'

interface Props {
  value: string
  /** When true the number counts from 0 to its printed value. */
  play: boolean
  delay?: number
  duration?: number
}

/**
 * Renders a printed value and animates numeric ones from 0. The final text is always
 * exactly the source string, so formatting is never altered by the animation.
 */
export function StatValue({ value, play, delay = 0, duration = 1.3 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const p = parseValue(value)
    if (!p.numeric || reduced || !play) {
      el.textContent = value
      return
    }
    const o = { n: 0 }
    el.textContent = formatValue(0, p)
    const tw = gsap.to(o, {
      n: p.target,
      duration,
      delay,
      ease: 'power3.out',
      onUpdate: () => {
        el.textContent = formatValue(o.n, p)
      },
      onComplete: () => {
        el.textContent = value
      },
    })
    return () => {
      tw.kill()
      el.textContent = value
    }
  }, [value, play, delay, duration, reduced])

  return (
    <span ref={ref} className="stat-value" aria-label={value}>
      {value}
    </span>
  )
}
