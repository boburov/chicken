import { useMemo } from 'react'
import * as THREE from 'three'
import type { ThreeElements } from '@react-three/fiber'

/** Feed-mill silo cluster (three bins + conveyor bridge). */
export function Silo(props: ThreeElements['group']) {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#dfe6f1', metalness: 0.75, roughness: 0.28 }),
    [],
  )
  const ring = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b9c6da', metalness: 0.6, roughness: 0.35 }), [])
  return (
    <group {...props}>
      {[-1.15, 0, 1.15].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 1.4, 0]} material={mat} castShadow receiveShadow>
            <cylinderGeometry args={[0.52, 0.52, 2.8, 40]} />
          </mesh>
          <mesh position={[0, 3.05, 0]} material={mat} castShadow>
            <coneGeometry args={[0.54, 0.5, 40]} />
          </mesh>
          {[0.7, 1.4, 2.1].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation-x={Math.PI / 2} material={ring}>
              <torusGeometry args={[0.525, 0.018, 8, 40]} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 3.35, 0]} material={ring} castShadow>
        <boxGeometry args={[2.9, 0.1, 0.18]} />
      </mesh>
      <mesh position={[1.75, 1.7, 0]} material={ring} castShadow>
        <boxGeometry args={[0.1, 3.4, 0.1]} />
      </mesh>
    </group>
  )
}

/** A small cluster of brown eggs. */
export function EggCluster({ count = 7, ...props }: ThreeElements['group'] & { count?: number }) {
  const mat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#d9a16b', roughness: 0.55, clearcoat: 0.4, clearcoatRoughness: 0.4 }),
    [],
  )
  const eggs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + i * 0.4
        const r = i === 0 ? 0 : 0.34 + (i % 2) * 0.12
        return {
          pos: [Math.cos(a) * r, 0.24, Math.sin(a) * r] as [number, number, number],
          rot: [(i % 3) * 0.3 - 0.3, a, Math.PI / 2 - 0.35 + (i % 2) * 0.2] as [number, number, number],
        }
      }),
    [count],
  )
  return (
    <group {...props}>
      {eggs.map((e, i) => (
        <mesh key={i} position={e.pos} rotation={e.rot} scale={[0.19, 0.25, 0.19]} material={mat} castShadow>
          <sphereGeometry args={[1, 24, 18]} />
        </mesh>
      ))}
    </group>
  )
}
