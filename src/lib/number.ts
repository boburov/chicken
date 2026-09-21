export interface ParsedValue {
  numeric: boolean
  target: number
  decimals: number
  separator: '.' | ','
  suffix: string
}

/** Parses a printed value like "20,6", "1400.0" or "100%" while remembering its format. */
export function parseValue(raw: string): ParsedValue {
  const m = raw.trim().match(/^(\d+)(?:([.,])(\d+))?(%?)$/)
  if (!m) return { numeric: false, target: 0, decimals: 0, separator: '.', suffix: '' }
  const decimals = m[3]?.length ?? 0
  const separator = (m[2] as '.' | ',') ?? '.'
  return {
    numeric: true,
    target: Number(`${m[1]}.${m[3] ?? '0'}`),
    decimals,
    separator,
    suffix: m[4] ?? '',
  }
}

export function formatValue(n: number, p: ParsedValue): string {
  const s = n.toFixed(p.decimals)
  return (p.separator === ',' ? s.replace('.', ',') : s) + p.suffix
}

export function toNumber(raw: string): number {
  const p = parseValue(raw)
  return p.numeric ? p.target : 0
}

export const pad2 = (n: number) => String(n).padStart(2, '0')
