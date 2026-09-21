import { useEffect, useState } from 'react'
import { brand, slides } from '../data/slides'
import { presentation, usePresentation } from '../state/presentation'

export function TopNav() {
  const index = usePresentation((s) => s.index)
  const [fs, setFs] = useState(false)

  useEffect(() => {
    const on = () => setFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', on)
    return () => document.removeEventListener('fullscreenchange', on)
  }, [])

  const toggleFs = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.().catch(() => {})
  }

  return (
    <header className="topnav glass">
      <button className="brand" onClick={() => presentation.goTo(0)} aria-label={`${brand.name} — boshiga qaytish`}>
        <span className="brand__mark">
          <img src={brand.logo} alt="" width={22} height={24} />
        </span>
        <span className="brand__text">
          <strong>{brand.name}</strong>
          <small>{brand.byline}</small>
        </span>
      </button>

      <nav className="topnav__sections" aria-label="Boʻlimlar">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`topnav__link ${i === index ? 'is-active' : ''}`}
            aria-current={i === index ? 'step' : undefined}
            onClick={() => presentation.goTo(i)}
          >
            <span className="topnav__num">{String(i + 1).padStart(2, '0')}</span>
            {s.navLabel}
          </button>
        ))}
      </nav>

      <button className="icon-btn" onClick={toggleFs} aria-label={fs ? 'Toʻliq ekrandan chiqish' : 'Toʻliq ekran'}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {fs ? (
            <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          ) : (
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          )}
        </svg>
      </button>
    </header>
  )
}
