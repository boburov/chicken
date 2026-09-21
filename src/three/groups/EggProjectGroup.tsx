import type { Slide } from '../../data/types'
import { PoultryHouse } from '../PoultryHouse'
import { EggCluster } from '../Props'
import { Rise } from '../Rise'
import { SceneTag } from '../SceneTag'

const S = 0.62
const COL = 4.05
const ROW = 1.95
const CLUSTER_X = 5.1

/** Two separate sites of layer houses — 6 and 5 buildings — plus the parent-flock rearing house. */
export function EggProjectGroup({ slide, active, x }: { slide: Slide; active: boolean; x: number }) {
  const tag = (id: string) => slide.tags!.find((t) => t.id === id)!
  // 2 columns × 3 rows per site; the “five” site leaves its last slot empty.
  const site = (cx: number, n: number) =>
    Array.from({ length: n }, (_, i) => [cx + ((i % 2) - 0.5) * COL, 0, -2.9 + Math.floor(i / 2) * ROW] as [number, number, number])
  const six = site(-CLUSTER_X, 6)
  const five = site(CLUSTER_X, 5)
  return (
    <group position={[x, 0, 0]}>
      {[...six, ...five].map((p, i) => (
        <Rise key={i} active={active} order={i} stagger={0.05} position={p}>
          <PoultryHouse scale={S} />
        </Rise>
      ))}
      {/* site pads */}
      {[-CLUSTER_X, CLUSTER_X].map((cx) => (
        <Rise key={cx} active={active} order={0} baseDelay={0.4} position={[cx, 0.005, -0.95]}>
          <mesh rotation-x={-Math.PI / 2} receiveShadow>
            <planeGeometry args={[2 * COL + 0.6, 3 * ROW + 0.8]} />
            <meshStandardMaterial color="#e6eeff" transparent opacity={0.65} roughness={1} />
          </mesh>
        </Rise>
      ))}
      <Rise active={active} order={11} position={[0, 0, 3.9]}>
        <PoultryHouse scale={0.78} />
      </Rise>
      <Rise active={active} order={12} position={[-4.2, 0, 4.1]}>
        <EggCluster count={9} scale={1.3} />
      </Rise>
      <SceneTag tag={tag('six')} position={[-CLUSTER_X, 1.5, -3.3]} active={active} order={0} />
      <SceneTag tag={tag('five')} position={[CLUSTER_X, 1.5, -3.3]} active={active} order={1} />
      <SceneTag tag={tag('rearing')} position={[0, 1.7, 3.9]} active={active} order={2} variant="accent" />
    </group>
  )
}
