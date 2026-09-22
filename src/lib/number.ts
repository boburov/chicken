export interface ParsedValue {
  numeric: boolean
  target: number
  decimals: number
  separator: '.' | ','
  /** Thousands grouped with spaces, e.g. "1 400". */
  grouped: boolean
  suffix: string
}

/** Parses a value like "20,6", "1400.0", "1 400" or "100%" while remembering its format. */
export function parseValue(raw: string): ParsedValue {
  const m = raw.trim().match(/^(\d{1,3}(?:[  ]\d{3})+|\d+)(?:([.,])(\d+))?(%?)$/)
  if (!m) return { numeric: false, target: 0, decimals: 0, separator: '.', grouped: false, suffix: '' }
  const int = m[1].replace(/[  ]/g, '')
  return {
    numeric: true,
    target: Number(`${int}.${m[3] ?? '0'}`),
    decimals: m[3]?.length ?? 0,
    separator: (m[2] as '.' | ',') ?? '.',
    grouped: int !== m[1],
    suffix: m[4] ?? '',
  }
}

export function formatValue(n: number, p: ParsedValue): string {
  let [int, frac] = n.toFixed(p.decimals).split('.')
  if (p.grouped) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return int + (frac ? (p.separator === ',' ? ',' : '.') + frac : '') + p.suffix
}

export function toNumber(raw: string): number {
  const p = parseValue(raw)
  return p.numeric ? p.target : 0
}

/** Displays a value with non-breaking group spaces so "1 400" never wraps. */
export const display = (raw: string) => raw.replace(/(\d) (\d)/g, '$1 $2')

export const pad2 = (n: number) => String(n).padStart(2, '0')
