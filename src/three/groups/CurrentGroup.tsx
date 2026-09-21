import type { Slide } from '../../data/types'
import { PoultryHouse } from '../PoultryHouse'
import { EggCluster, Silo } from '../Props'
import { Rise } from '../Rise'
import { SceneTag } from '../SceneTag'

/** Today’s production chain: parent flock → hatchery → rearing, feed mill, eggs, meat. */
export function CurrentGroup({ slide, active, x }: { slide: Slide; active: boolean; x: number }) {
  const tag = (id: string) => slide.tags!.find((t) => t.id === id)!
  const houses: { id: string; pos: [number, number, number] }[] = [
    { id: 'parent', pos: [-7, 0, -3.4] },
    { id: 'hatch', pos: [0, 0, -3.4] },
    { id: 'rearing', pos: [7, 0, -3.4] },
    { id: 'eggs', pos: [-4.6, 0, 3.6] },
    { id: 'meat', pos: [4.6, 0, 3.6] },
  ]
  return (
    <group position={[x, 0, 0]}>
      {houses.map((h, i) => (
        <group key={h.id}>
          <Rise active={active} order={i} position={h.pos}>
            <PoultryHouse scale={0.95} />
          </Rise>
          <SceneTag tag={tag(h.id)} position={[h.pos[0], 2.1, h.pos[2]]} active={active} order={i} />
        </group>
      ))}
      <Rise active={active} order={5} position={[0, 0, 0.4]} stagger={0.08}>
        <Silo scale={0.78} />
      </Rise>
      <SceneTag tag={tag('feed')} position={[1.25, 1.9, 0.4]} active={active} order={5} variant="accent" align="left" />
      <Rise active={active} order={6} position={[-4.6, 0, 6]}>
        <EggCluster />
      </Rise>
    </group>
  )
}
