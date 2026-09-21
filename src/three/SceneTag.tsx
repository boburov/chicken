import { Html } from '@react-three/drei'
import type { SceneTag as Tag } from '../data/types'
import { StatValue } from '../components/StatValue'
import { useSceneSettings } from './sceneSettings'

interface Props {
  tag: Tag
  position: [number, number, number]
  active: boolean
  order?: number
  align?: 'center' | 'left' | 'right'
  variant?: 'default' | 'accent'
}

/** A floating data label anchored to an object in the 3D scene. */
export function SceneTag({ tag, position, active, order = 0, align = 'center', variant = 'default' }: Props) {
  const { showTags } = useSceneSettings()
  if (!showTags) return null
  return (
    <Html position={position} zIndexRange={[20, 10]} style={{ pointerEvents: 'none' }}>
      <div
        className={`scene-tag scene-tag--${align} scene-tag--${variant} ${active ? 'is-active' : ''}`}
        style={{ transitionDelay: active ? `${0.9 + order * 0.09}s` : '0s' }}
        aria-hidden={!active}
      >
        <span className="scene-tag__title">{tag.title}</span>
        {tag.caption && <span className="scene-tag__caption">{tag.caption}</span>}
        {tag.value && (
          <span className="scene-tag__value">
            <StatValue value={tag.value} play={active} delay={0.9 + order * 0.09} />
            {tag.unit && <small>{tag.unit}</small>}
          </span>
        )}
      </div>
    </Html>
  )
}
