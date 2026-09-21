import type { InvestmentNode, Slide } from '../data/types'
import { brand } from '../data/slides'
import { StatValue } from './StatValue'
import { ResultsList } from './ResultsList'

/**
 * Non-3D rendering of a slide's visual: used when WebGL is unavailable (or ?no3d).
 * It carries exactly the same data as the 3D scene tags.
 */
export function FallbackVisual({ slide, play }: { slide: Slide; play: boolean }) {
  if (slide.visual === 'cover') {
    return (
      <div className="fallback fallback--cover">
        <div className="fallback-medallion">
          <img src={brand.logo} alt={brand.logoAlt} />
        </div>
      </div>
    )
  }
  if (slide.visual === 'results') {
    return (
      <div className="fallback">
        <ResultsList slide={slide} play={play} />
      </div>
    )
  }
  if (slide.visual === 'investment') {
    return (
      <div className="fallback">
        <InvestmentTree node={slide.investment!} play={play} />
      </div>
    )
  }
  return (
    <div className="fallback">
      <ul className="fallback-tags">
        {slide.tags?.map((t) => (
          <li key={t.id} className="scene-tag is-active js-stat">
            <span className="scene-tag__title">{t.title}</span>
            {t.caption && <span className="scene-tag__caption">{t.caption}</span>}
            {t.value && (
              <span className="scene-tag__value">
                <StatValue value={t.value} play={play} delay={0.4} />
                {t.unit && <small>{t.unit}</small>}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function InvestmentTree({ node, play }: { node: InvestmentNode; play: boolean }) {
  return (
    <div className="tree">
      <div className="tree__node tree__node--root js-stat">
        <StatValue value={node.value} play={play} /> <small>{node.unit}</small>
      </div>
      <div className="tree__branches">
        {node.children?.map((c) => (
          <div key={c.value} className="tree__branch">
            <div className="tree__node tree__node--mid js-stat">
              <StatValue value={c.value} play={play} delay={0.2} /> <small>{c.unit}</small>
            </div>
            <ul className="tree__leaves">
              {c.children?.map((l) => (
                <li key={l.label} className="tree__node tree__node--leaf js-stat">
                  <span>
                    <StatValue value={l.value} play={play} delay={0.35} /> <small>{l.unit}</small>
                  </span>
                  <span className="tree__label">{l.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
