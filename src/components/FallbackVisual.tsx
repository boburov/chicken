import type { Slide } from '../data/types'
import { brand } from '../data/slides'
import { toNumber } from '../lib/number'
import { StatValue } from './StatValue'

/**
 * Non-3D rendering of a slide's visual: used when WebGL is unavailable (or ?no3d).
 * It carries exactly the same data as the 3D scene.
 */
export function FallbackVisual({ slide, play }: { slide: Slide; play: boolean }) {
  if (slide.visual === 'cover') {
    const parts = slide.financing?.parts ?? []
    const sum = parts.reduce((a, p) => a + toNumber(p.value), 0)
    const first = parts[0] ? Math.round((toNumber(parts[0].value) / sum) * 100) : 100
    return (
      <div className="fallback fallback--cover">
        <div className="fallback-medallion" style={{ '--share': `${first}%` } as React.CSSProperties}>
          <img src={brand.logo} alt={brand.logoAlt} />
        </div>
      </div>
    )
  }
  return (
    <div className="fallback">
      <ul className="fallback-tags">
        {slide.tags?.map((t) => (
          <li key={t.id} className="scene-tag is-active js-stat">
            <span className="scene-tag__title">{t.title}</span>
            {t.caption && <span className="scene-tag__caption">{t.caption}</span>}
            {t.value && (
              <span className="scene-tag__value">
                <StatValue value={t.value} play={play} delay={0.4} />
                {t.unit && <small>{t.unit}</small>}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
