import type { Comparison } from '../data/types'
import { display } from '../lib/number'
import { Icon } from './Icon'
import { StatValue } from './StatValue'

/** Result cards read top-to-bottom: “now” value → arrow → value after the new project. */
export function ComparisonPanel({ data, delay = 0.8 }: { data: Comparison; delay?: number }) {
  return (
    <section className="results js-in" aria-label={data.title}>
      <h2 className="results__title">{data.title}</h2>
      <ul className="results__grid">
        {data.rows.map((r, i) => (
          <li key={r.label} className="result js-stat">
            <div className="result__top">
              {r.icon && (
                <span className="result__icon">
                  <Icon name={r.icon} size={18} />
                </span>
              )}
              <span className="result__label">
                <strong>{r.label}</strong>
                {r.note && <small>{r.note}</small>}
              </span>
            </div>

            <div className="result__flow">
              <div className="result__box result__box--before">
                <span className="result__box-label">{data.beforeLabel}</span>
                <span className="result__box-value">
                  {display(r.before)} <small>{r.unit}</small>
                </span>
              </div>

              <div className="result__arrow" aria-hidden="true" style={{ '--d': `${delay + 0.15 + i * 0.1}s` } as React.CSSProperties}>
                <svg viewBox="0 0 24 30" width="22" height="26">
                  <path d="M12 2 V22" />
                  <path d="M5 16 L12 24 L19 16" />
                </svg>
              </div>

              <div className="result__box result__box--after">
                <span className="result__box-label">{data.afterLabel}</span>
                <span className="result__box-value">
                  <StatValue value={r.after} play delay={delay + 0.3 + i * 0.1} /> <small>{r.afterUnit ?? r.unit}</small>
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
