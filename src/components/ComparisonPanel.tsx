import type { Comparison } from '../data/types'
import { display, toNumber } from '../lib/number'
import { StatValue } from './StatValue'

/** “Now → after the new project” rows, each with an animated before/after bar. */
export function ComparisonPanel({ data, delay = 0.8 }: { data: Comparison; delay?: number }) {
  return (
    <div className="compare" role="table" aria-label={`${data.beforeLabel} va ${data.afterLabel}`}>
      <div className="compare__head js-stat" role="row">
        <span role="columnheader" className="sr-only">
          Koʻrsatkich
        </span>
        <span role="columnheader" className="compare__legend compare__legend--before">
          <i aria-hidden="true" />
          {data.beforeLabel}
        </span>
        <span role="columnheader" className="compare__legend compare__legend--after">
          <i aria-hidden="true" />
          {data.afterLabel}
        </span>
      </div>
      {data.rows.map((r, i) => {
        const ratio = toNumber(r.before) / toNumber(r.after)
        return (
          <div key={r.label} className="compare__row js-stat" role="row">
            <span className="compare__label" role="rowheader">
              <strong>{r.label}</strong>
              <small>
                {r.unit}
                {r.note && ` · ${r.note}`}
              </small>
            </span>
            <span className="compare__before" role="cell">
              {display(r.before)}
            </span>
            <span className="compare__after" role="cell">
              <StatValue value={r.after} play delay={delay + i * 0.1} />
            </span>
            <span
              className="compare__bar"
              aria-hidden="true"
              style={{ '--ratio': ratio, '--d': `${delay + 0.2 + i * 0.1}s` } as React.CSSProperties}
            >
              <span className="compare__bar-after" />
              <span className="compare__bar-before" />
            </span>
          </div>
        )
      })}
    </div>
  )
}
