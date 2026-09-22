import type { Slide } from '../../data/types'
import { PoultryHouse } from '../PoultryHouse'
import { EggCluster, Silo } from '../Props'
import { Rise } from '../Rise'
import { SceneTag } from '../SceneTag'

/** Today’s production chain: parent flock → hatchery → rearing, feed mill, eggs, meat. */
export function CurrentGroup({ slide, active, x }: { slide: Slide; active: boolean; x: number }) {
  const tag = (id: string) => slide.tags!.find((t) => t.id === id)!
  const houses: { id: string; pos: [number, number, number] }[] = [
    { id: 'parent', pos: [-7, 0, -4.2] },
    { id: 'hatch', pos: [0, 0, -4.2] },
    { id: 'rearing', pos: [7, 0, -4.2] },
    { id: 'eggs', pos: [-5, 0, 4.4] },
    { id: 'meat', pos: [5, 0, 4.4] },
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
      <Rise active={active} order={5} position={[0, 0, 1]} stagger={0.08}>
        <Silo scale={0.78} />
      </Rise>
      <SceneTag tag={tag('feed')} position={[0, 2.85, 1]} active={active} order={5} variant="accent" />
      <Rise active={active} order={6} position={[-5, 0, 6.8]}>
        <EggCluster />
      </Rise>
    </group>
  )
}
