import type { MarketShare } from '../data/types'
import { display, toNumber } from '../lib/number'
import { Icon } from './Icon'
import { StatValue } from './StatValue'

/**
 * Region demand vs our output, one row per product. The bar spans the larger figure:
 * below 100% it fills our share of the demand; above 100% the demand is fully covered
 * (blue) and the surplus shows in purple. Percent and surplus are computed from the data.
 */
export function MarketShareBlock({ data, delay = 1.9 }: { data: MarketShare; delay?: number }) {
  return (
    <section className="market js-stat" aria-label={data.title}>
      <h2 className="market__title">{data.title}</h2>
      <ul className="market__rows">
        {data.rows.map((r, i) => {
          const demand = toNumber(r.demand)
          const output = toNumber(r.output)
          const share = demand ? output / demand : 0
          const percent = Math.round(share * 100)
          const over = output > demand
          const surplus = Math.round((output - demand) * 10) / 10
          // widths relative to the larger of the two figures
          const scale = Math.max(demand, output) || 1
          const covered = Math.min(output, demand) / scale
          const extra = over ? (output - demand) / scale : 0
          const d = delay + i * 0.2
          return (
            <li key={r.label} className="market__row">
              <div className="market__head">
                <span className="market__name">
                  {r.icon && (
                    <span className="market__icon">
                      <Icon name={r.icon} size={15} />
                    </span>
                  )}
                  <strong>{r.label}</strong>
                </span>
                <span className="market__fig">
                  <small>{data.demandLabel}</small>
                  <b>
                    {display(r.demand)} <em>{r.unit}</em>
                  </b>
                </span>
                <span className="market__fig market__fig--ours">
                  <small>{data.outputLabel}</small>
                  <b>
                    <StatValue value={r.output} play delay={d} /> <em>{r.unit}</em>
                  </b>
                </span>
              </div>
              <div className="market__meter">
                <div className="market__bar" aria-hidden="true" style={{ '--d': `${d + 0.2}s` } as React.CSSProperties}>
                  <span className="market__bar-fill" style={{ width: `${covered * 100}%` }} />
                  {over && <span className="market__bar-extra" style={{ left: `${covered * 100}%`, width: `${extra * 100}%` }} />}
                </div>
                <p className="market__caption">
                  <strong>
                    <StatValue value={`${percent}%`} play delay={d + 0.2} />
                  </strong>{' '}
                  {over ? (
                    <>
                      talab toʻliq qoplanadi · <span className="market__surplus">+{display(String(surplus))} {r.unit} ortiqcha</span>
                    </>
                  ) : (
                    'viloyat talabini biz taʼminlaymiz'
                  )}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
