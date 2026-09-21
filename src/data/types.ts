export type IconName =
  | 'money'
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

/** A single number as printed in the brochure. `value` is kept as a string so the
 *  original formatting (decimals, separators) is preserved exactly. */
export interface Stat {
  value: string
  unit?: string
  label: string
  icon?: IconName
}

export interface Photo {
  src: string
  alt: string
  /** Named position in the stage; see PhotoLayer for the slot map. */
  slot: 'hero' | 'a' | 'b' | 'c' | 'd'
  /** Relative depth: 0 = front, 1 = far back. Drives parallax and entrance. */
  depth: number
}

/** A floating tag attached to an object in the 3D scene. */
export interface SceneTag {
  id: string
  title: string
  value?: string
  unit?: string
  caption?: string
}

export interface ResultPair {
  label: string
  unit: string
  before: string
  after: string
}

export interface InvestmentNode {
  value: string
  unit: string
  label?: string
  children?: InvestmentNode[]
}

export type VisualKind =
  | 'cover'
  | 'current'
  | 'eggProject'
  | 'broiler12'
  | 'broiler6'
  | 'investment'
  | 'results'

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
  tags?: SceneTag[]
  photos?: Photo[]
  results?: { beforeYear: string; afterYear: string; pairs: ResultPair[] }
  investment?: InvestmentNode
  footnote?: string
}
