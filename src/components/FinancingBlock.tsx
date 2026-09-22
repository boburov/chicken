import type { Financing } from '../data/types'
import { StatChip } from './StatChip'

/** Project cost with its funding sources; part colours match the 3D ring segments. */
export function FinancingBlock({ data, delay = 1.5 }: { data: Financing; delay?: number }) {
  return (
    <div className="hero-stats financing">
      <StatChip stat={data.total} play delay={delay} size="xl" className="js-stat float-0" />
      {data.parts.map((p, i) => (
        <StatChip
          key={p.label}
          stat={p}
          play
          delay={delay + 0.2 + i * 0.1}
          size="lg"
          className={`js-stat float-${i + 1} stat--tone-${p.tone}`}
        />
      ))}
    </div>
  )
}
