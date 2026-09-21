import type { Stat } from '../data/types'
import { Icon } from './Icon'
import { StatValue } from './StatValue'

interface Props {
  stat: Stat
  play: boolean
  delay?: number
  size?: 'xl' | 'lg' | 'sm'
  className?: string
}

/** One statistic: icon, animated value, unit and label. */
export function StatChip({ stat, play, delay = 0, size = 'lg', className = '' }: Props) {
  return (
    <div className={`stat stat--${size} ${className}`}>
      {stat.icon && (
        <span className="stat__icon">
          <Icon name={stat.icon} size={size === 'sm' ? 16 : 20} />
        </span>
      )}
      <span className="stat__body">
        <span className="stat__value">
          <StatValue value={stat.value} play={play} delay={delay} />
          {stat.unit && <small className="stat__unit">{stat.unit}</small>}
        </span>
        <span className="stat__label">{stat.label}</span>
      </span>
    </div>
  )
}
