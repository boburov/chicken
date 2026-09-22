import type { Comparison } from '../data/types'
import { display, toNumber } from '../lib/number'
import { Icon } from './Icon'
import { StatValue } from './StatValue'

/** “Now → after the new project” as a row of result cards with animated bars. */
export function ComparisonPanel({ data, delay = 0.8 }: { data: Comparison; delay?: number }) {
  return (
    <section className="results js-in" aria-label={`${data.beforeLabel} va ${data.afterLabel}`}>
      <header className="results__head">
        <span className="results__legend results__legend--before">
          <i aria-hidden="true" />
          {data.beforeLabel}
        </span>
        <span className="results__arrow" aria-hidden="true">
          →
        </span>
        <span className="results__legend results__legend--after">
          <i aria-hidden="true" />
          {data.afterLabel}
        </span>
      </header>
      <ul className="results__grid">
        {data.rows.map((r, i) => {
          const ratio = toNumber(r.before) / toNumber(r.after)
          return (
            <li key={r.label} className="result js-stat">
              <div className="result__top">
                {r.icon && (
                  <span className="result__icon">
                    <Icon name={r.icon} size={18} />
                  </span>
                )}
                <span className="result__label">
                  <strong>{r.label}</strong>
                  <small>
                    {r.unit}
                    {r.note && ` · ${r.note}`}
                  </small>
                </span>
              </div>
              <div className="result__values">
                <span className="result__before">
                  <span className="sr-only">{data.beforeLabel}: </span>
                  {display(r.before)}
                </span>
                <span className="result__to" aria-hidden="true">
                  →
                </span>
                <span className="result__after">
                  <span className="sr-only">{data.afterLabel}: </span>
                  <StatValue value={r.after} play delay={delay + i * 0.1} />
                </span>
              </div>
              <span
                className="result__bar"
                aria-hidden="true"
                style={{ '--ratio': ratio, '--d': `${delay + 0.2 + i * 0.1}s` } as React.CSSProperties}
              >
                <span className="result__bar-after" />
                <span className="result__bar-before" />
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
