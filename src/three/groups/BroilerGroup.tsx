import type { Slide } from '../../data/types'
import { PoultryHouse } from '../PoultryHouse'
import { Rise } from '../Rise'
import { SceneTag } from '../SceneTag'

const S = 0.6
const COL = 4.1
const ROW = 2.05

/** A grid of broiler houses. Same spacing/scale for 12 and 6 so the size difference reads at a glance. */
export function BroilerGroup({ slide, active, x, count }: { slide: Slide; active: boolean; x: number; count: 12 | 6 }) {
  const cols = count === 12 ? 4 : 3
  const rows = count / cols
  const cells = Array.from({ length: count }, (_, i) => {
    const c = i % cols
    const r = Math.floor(i / cols)
    return [(c - (cols - 1) / 2) * COL, 0, (r - (rows - 1) / 2) * ROW] as [number, number, number]
  })
  const tag = slide.tags![0]
  return (
    <group position={[x, 0, 0]}>
      {cells.map((p, i) => (
        <Rise key={i} active={active} order={i} stagger={0.05} position={p}>
          <PoultryHouse scale={S} />
        </Rise>
      ))}
      {/* ground pad outlining the site */}
      <Rise active={active} order={0} baseDelay={0.4} position={[0, 0.005, 0]}>
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[cols * COL + 1.4, rows * ROW + 1.6]} />
          <meshStandardMaterial color="#e6eeff" transparent opacity={0.65} roughness={1} />
        </mesh>
      </Rise>
      <SceneTag
        tag={tag}
        position={[(-(cols - 1) / 2) * COL - 1.2, 1.6, ((rows - 1) / 2) * ROW + 1.4]}
        active={active}
        order={count}
        variant="accent"
      />
    </group>
  )
}
