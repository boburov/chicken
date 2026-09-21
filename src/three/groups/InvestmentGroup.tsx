import { Html, Line, RoundedBox } from '@react-three/drei'
import type { InvestmentNode, Slide } from '../../data/types'
import { StatValue } from '../../components/StatValue'
import { useGlassMaterial } from '../Props'
import { Rise } from '../Rise'
import { useSceneSettings } from '../sceneSettings'

interface Placed {
  node: InvestmentNode
  pos: [number, number, number]
  level: 0 | 1 | 2
  parent?: [number, number, number]
}

const LEAF_GAP = 3

/** Lays the tree out: leaves evenly spaced, parents centred over their children. */
function place(root: InvestmentNode): Placed[] {
  const out: Placed[] = []
  const leaves = root.children!.flatMap((c) => c.children ?? [])
  const start = -((leaves.length - 1) / 2) * LEAF_GAP
  let li = 0
  const rootChildren: Placed[] = []
  root.children!.forEach((mid) => {
    const kids = (mid.children ?? []).map((leaf) => {
      const p: Placed = { node: leaf, pos: [start + li++ * LEAF_GAP, 0.9, 0.6], level: 2 }
      return p
    })
    const cx = kids.reduce((s, k) => s + k.pos[0], 0) / kids.length
    const m: Placed = { node: mid, pos: [cx, 3.2, 0.3], level: 1 }
    kids.forEach((k) => (k.parent = m.pos))
    rootChildren.push(m)
    out.push(...kids)
  })
  const rx = rootChildren.reduce((s, k) => s + k.pos[0], 0) / rootChildren.length
  const r: Placed = { node: root, pos: [rx, 5.4, 0], level: 0 }
  rootChildren.forEach((m) => (m.parent = r.pos))
  return [r, ...rootChildren, ...out]
}

function elbow(from: [number, number, number], to: [number, number, number]): [number, number, number][] {
  const midY = (from[1] + to[1]) / 2
  return [
    [from[0], from[1] - 0.5, from[2]],
    [from[0], midY, (from[2] + to[2]) / 2],
    [to[0], midY, (from[2] + to[2]) / 2],
    [to[0], to[1] + 0.5, to[2]],
  ]
}

export function InvestmentGroup({ slide, active, x }: { slide: Slide; active: boolean; x: number }) {
  const glass = useGlassMaterial('#f4f7ff')
  const { showTags } = useSceneSettings()
  const nodes = place(slide.investment!)

  return (
    <group position={[x, 0, 0]}>
      {nodes.map((p, i) => {
        const size: [number, number, number] =
          p.level === 0 ? [3.3, 1.25, 0.3] : p.level === 1 ? [2.9, 1.05, 0.26] : [2.6, 0.95, 0.22]
        return (
          <group key={i}>
            {p.parent && (
              <Rise active={active} order={i} baseDelay={0.8} mode="drop" position={[0, 0, 0]}>
                <Line points={elbow(p.parent, p.pos)} color={p.level === 1 ? '#176BFF' : '#8FA9E8'} lineWidth={1.6} transparent opacity={0.85} />
              </Rise>
            )}
            <Rise active={active} order={i} baseDelay={0.6} stagger={0.08} position={p.pos}>
              {p.level === 2 ? (
                <RoundedBox args={size} radius={0.1} smoothness={4} material={glass} castShadow />
              ) : (
                <RoundedBox args={size} radius={0.12} smoothness={4} castShadow>
                  <meshPhysicalMaterial
                    color={p.level === 0 ? '#176BFF' : '#123B8F'}
                    metalness={0.2}
                    roughness={0.25}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                  />
                </RoundedBox>
              )}
            </Rise>
            {showTags && (
              <Html position={[p.pos[0], p.pos[1], p.pos[2] + size[2] / 2 + 0.01]} center zIndexRange={[20, 10]} style={{ pointerEvents: 'none' }}>
                <div
                  className={`invest-node invest-node--l${p.level} ${active ? 'is-active' : ''}`}
                  style={{ transitionDelay: active ? `${0.9 + i * 0.08}s` : '0s' }}
                >
                  <span className="invest-node__value">
                    <StatValue value={p.node.value} play={active} delay={0.9 + i * 0.08} />
                    <small>{p.node.unit}</small>
                  </span>
                  {p.node.label && <span className="invest-node__label">{p.node.label}</span>}
                </div>
              </Html>
            )}
          </group>
        )
      })}
    </group>
  )
}
