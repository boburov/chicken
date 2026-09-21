import type { IconName } from '../data/types'

/** Minimal line icons echoing the brochure's pictograms. */
const paths: Record<IconName, string> = {
  money: 'M9 4h6l-1.5 3h-3zM7 9.5C5 11.5 4 14 4 16a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5c0-2-1-4.5-3-6.5zM12 11v7M14 12.5h-3a1.2 1.2 0 0 0 0 2.5h2a1.2 1.2 0 0 1 0 2.5h-3',
  factory: 'M3 21V11l5 3v-3l5 3v-3l5 3V4h3v17zM7 17h2M11 17h2M15 17h2',
  machine: 'M3 17h18v3H3zM6 17v-4h4v4M13 17v-7h5v7M8 13V9M15 10V6h2',
  bird: 'M7 20c0-4 1-6 3-8-2-1-3-3-2-5 1.5-2 4-1.5 5 0l3-1-2 2.5c2 1 4 3.5 4 6.5 0 3-2 5-5 5zM12 20v2M15 20v2',
  area: 'M4 4h16v16H4zM8 16l8-8M8 8h0M16 8v4M16 8h-4M8 16v-4M8 16h4',
  workers: 'M5 20v-2a4 4 0 0 1 8 0v2M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 20v-2a4 4 0 0 1 4-4M17 11a2.5 2.5 0 1 0 0-5',
  export: 'M4 20V8a2 2 0 0 1 2-2h7M4 20h12a2 2 0 0 0 2-2v-4M14 3l6 4-6 4M20 7h-7a4 4 0 0 0-4 4v2',
  import: 'M4 6h16v14H4zM12 3v10M8 9l4 4 4-4',
  capacity: 'M4 20h16M6 20v-6M10 20V9M14 20v-8M18 20V5',
  tech: 'M3 21h18M5 21V10h14v11M8 21v-6M12 21v-6M16 21v-6M12 10V4l4 1.5L12 7',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v5M16 3v5M8 14h2M12 14h2M16 14h0M8 17h2M12 17h2',
  tax: 'M3 14h3l4 3h5a1.5 1.5 0 0 0 0-3h-3M6 14v6M16 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM6 20l6 1 8-4',
  growth: 'M3 20h18M5 16l5-5 3 3 7-7M15 7h5v5',
}

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="icon">
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
