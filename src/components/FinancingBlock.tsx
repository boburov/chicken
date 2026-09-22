import type { Financing } from '../data/types'
import { financingShares } from '../lib/financing'
import { Icon } from './Icon'
import { StatValue } from './StatValue'

/**
 * Funding as a small flow diagram: the total project cost at the top, with arrows
 * branching down to each funding source (labelled with its share).
 */
export function FinancingBlock({ data, delay = 1.5 }: { data: Financing; delay?: number }) {
  const parts = financingShares(data)
  return (
    <div className="funding" aria-label={`${data.total.label}: ${data.total.value} ${data.total.unit ?? ''}`}>
      <div className="funding__total js-stat">
        {data.total.icon && (
          <span className="funding__icon">
            <Icon name={data.total.icon} size={20} />
          </span>
        )}
        <span className="funding__total-body">
          <span className="funding__total-label">{data.total.label}</span>
          <span className="funding__total-value">
            <StatValue value={data.total.value} play delay={delay} />
            <small>{data.total.unit}</small>
          </span>
        </span>
      </div>

      {/* branching arrows: total → each source */}
      <svg className="funding__arrows js-in" viewBox="0 0 400 64" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <marker id="fund-head-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="#176BFF" />
          </marker>
          <marker id="fund-head-purple" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="#7B3FF2" />
          </marker>
        </defs>
        <path className="funding__path" d="M200 0 V22 Q200 32 190 32 H110 Q100 32 100 42 V58" stroke="#176BFF" markerEnd="url(#fund-head-blue)" vectorEffect="non-scaling-stroke" />
        <path className="funding__path" d="M200 0 V22 Q200 32 210 32 H290 Q300 32 300 42 V58" stroke="#7B3FF2" markerEnd="url(#fund-head-purple)" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="funding__shares js-in" aria-hidden="true">
        {parts.map((p) => (
          <span key={p.label} className={`funding__share funding__share--${p.tone}`}>
            {p.percent}%
          </span>
        ))}
      </div>

      <div className="funding__parts">
        {parts.map((p, i) => (
          <div key={p.label} className={`funding__part funding__part--${p.tone} js-stat`}>
            {p.logo ? (
              <span className="funding__logo">
                <img src={p.logo.src} alt={p.logo.alt} width={24} height={24} />
              </span>
            ) : p.icon && (
              <span className="funding__icon funding__icon--sm">
                <Icon name={p.icon} size={16} />
              </span>
            )}
            <span className="funding__part-body">
              <span className="funding__part-label">{p.label}</span>
              <span className="funding__part-value">
                <StatValue value={p.value} play delay={delay + 0.3 + i * 0.1} />
                <small>{p.unit}</small>
                <span className="sr-only"> ({p.percent}%)</span>
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
