import type { Financing } from '../data/types'
import { toNumber } from './number'

/** Each funding part's share of the total, rounded to whole percent (35/48 → 73). */
export function financingShares(f: Financing) {
  const sum = f.parts.reduce((a, p) => a + toNumber(p.value), 0)
  return f.parts.map((p) => ({ ...p, share: sum ? toNumber(p.value) / sum : 0, percent: sum ? Math.round((toNumber(p.value) / sum) * 100) : 0 }))
}
