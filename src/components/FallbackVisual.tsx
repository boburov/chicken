import type { Slide } from '../data/types'
import { brand } from '../data/slides'
import { financingShares } from '../lib/financing'

/**
 * Non-3D rendering of the stage visual, used when WebGL is unavailable (or ?no3d):
 * the brand medallion inside a CSS financing ring with the same proportions as the 3D one.
 */
export function FallbackVisual({ slide }: { slide: Slide }) {
  const first = slide.financing ? financingShares(slide.financing)[0]?.percent ?? 100 : 100
  return (
    <div className="fallback fallback--cover">
      <div className="fallback-medallion" style={{ '--share': `${first}%` } as React.CSSProperties}>
        <img src={brand.logo} alt={brand.logoAlt} />
      </div>
    </div>
  )
}
