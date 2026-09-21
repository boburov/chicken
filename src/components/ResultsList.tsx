import type { Slide } from '../data/types'
import { toNumber } from '../lib/number'
import { StatValue } from './StatValue'

/** Accessible 2D version of the 2016 → 2027 comparison (mobile, fallback, screen readers). */
export function ResultsList({ slide, play }: { slide: Slide; play: boolean }) {
  const r = slide.results!
  return (
    <table className="results-list">
      <caption className="sr-only">
        {r.beforeYear} va {r.afterYear} yillar taqqoslamasi
      </caption>
      <thead>
        <tr>
          <th scope="col">Koʻrsatkich</th>
          <th scope="col">{r.beforeYear}</th>
          <th scope="col">{r.afterYear}</th>
        </tr>
      </thead>
      <tbody>
        {r.pairs.map((p, i) => (
          <tr key={p.label} className="js-stat">
            <th scope="row">
              {p.label}
              <small>{p.unit}</small>
            </th>
            <td className="results-list__before">{p.before}</td>
            <td className="results-list__after">
              <span className="results-list__bar" style={{ '--w': toNumber(p.before) / toNumber(p.after) } as React.CSSProperties} />
              <StatValue value={p.after} play={play} delay={0.5 + i * 0.06} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function ResultsLegend({ slide }: { slide: Slide }) {
  const r = slide.results!
  return (
    <div className="legend js-stat" aria-hidden="true">
      <span className="legend__item">
        <i className="legend__swatch legend__swatch--before" />
        {r.beforeYear}
      </span>
      <span className="legend__item">
        <i className="legend__swatch legend__swatch--after" />
        {r.afterYear}
      </span>
    </div>
  )
}
