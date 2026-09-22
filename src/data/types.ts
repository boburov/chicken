export type IconName =
  | 'money'
  | 'egg'
  | 'bank'
  | 'wallet'
  | 'factory'
  | 'machine'
  | 'bird'
  | 'area'
  | 'workers'
  | 'export'
  | 'import'
  | 'capacity'
  | 'tech'
  | 'calendar'
  | 'tax'
  | 'growth'

/** Brand accent used to link a stat to its segment in a chart. */
export type Tone = 'blue' | 'purple'

/** A single number exactly as provided. `value` is kept as a string so the original
 *  formatting (decimals, separators) is preserved exactly. */
export interface Stat {
  value: string
  unit?: string
  label: string
  icon?: IconName
  tone?: Tone
}

export interface Photo {
  src: string
  alt: string
  /** Named position in the stage; see PhotoLayer for the slot map. */
  slot: 'hero'
  /** Relative depth: 0 = front, 1 = far back. Drives parallax and entrance. */
  depth: number
}

/** Project financing: total plus its parts, drawn as a ring around the brand medallion. */
export interface Financing {
  total: Stat
  parts: (Stat & { tone: Tone })[]
}

export interface ComparisonRow {
  label: string
  icon?: IconName
  unit: string
  note?: string
  before: string
  after: string
}

/** “Now → after the new project” comparison. */
export interface Comparison {
  beforeLabel: string
  afterLabel: string
  rows: ComparisonRow[]
}

export type VisualKind = 'cover'

export interface Slide {
  id: string
  /** Short label for navigation dots / top nav. */
  navLabel: string
  kicker: string
  /** Headline, one entry per line (revealed line by line). */
  title: string[]
  subtitle?: string
  /** Large floating stats next to the headline. */
  hero: Stat[]
  /** Secondary stats shown in the thin data strip (desktop) / details sheet (mobile). */
  strip: Stat[]
  visual: VisualKind
  photos?: Photo[]
  financing?: Financing
  comparison?: Comparison
  footnote?: string
}
