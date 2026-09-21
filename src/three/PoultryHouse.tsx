import { forwardRef, useMemo } from 'react'
import * as THREE from 'three'
import type { ThreeElements } from '@react-three/fiber'
import { roofTexture, wallTexture } from './textures'

/** Shared geometry/material for every poultry house (one draw-call set, reused ~40×). */
const L = 6
const H = 1.05
const D = 2.3
const RISE = 0.62
const OVER = 0.16

let shared: ReturnType<typeof build> | null = null
function build() {
  const body = new THREE.BoxGeometry(L, H, D)
  body.translate(0, H / 2, 0)

  const half = D / 2 + OVER
  const slope = Math.hypot(half, RISE)
  const angle = Math.atan2(RISE, half)
  const plank = new THREE.BoxGeometry(L + OVER * 2, 0.05, slope)

  const gable = new THREE.Shape()
  gable.moveTo(-D / 2, 0)
  gable.lineTo(D / 2, 0)
  gable.lineTo(0, RISE * (D / 2 / half))
  gable.closePath()
  const gableGeo = new THREE.ShapeGeometry(gable)

  const roofMap = roofTexture().clone()
  roofMap.repeat.set(28, 1)
  roofMap.needsUpdate = true

  const wallMat = new THREE.MeshStandardMaterial({ map: wallTexture(), roughness: 0.7, metalness: 0.05 })
  const endMat = new THREE.MeshStandardMaterial({ color: '#eef2f8', roughness: 0.75, side: THREE.DoubleSide })
  const roofMat = new THREE.MeshStandardMaterial({ map: roofMap, roughness: 0.38, metalness: 0.35 })
  const doorMat = new THREE.MeshStandardMaterial({ color: '#8fa1bd', roughness: 0.6 })
  const door = new THREE.BoxGeometry(0.02, 0.55, 0.5)
  door.translate(0, 0.275, 0)

  return { body, plank, gableGeo, angle, half, slope, wallMat, endMat, roofMat, doorMat, door }
}

export const PoultryHouse = forwardRef<THREE.Group, ThreeElements['group']>(function PoultryHouse(
  props,
  ref,
) {
  const g = useMemo(() => (shared ??= build()), [])
  const zOff = (Math.cos(g.angle) * g.slope) / 2
  const yOff = H + (Math.sin(g.angle) * g.slope) / 2 - 0.02
  return (
    <group ref={ref} {...props}>
      <mesh geometry={g.body} material={g.wallMat} castShadow receiveShadow />
      <mesh
        geometry={g.plank}
        material={g.roofMat}
        position={[0, yOff, -zOff + OVER / 2]}
        rotation={[g.angle, 0, 0]}
        castShadow
      />
      <mesh
        geometry={g.plank}
        material={g.roofMat}
        position={[0, yOff, zOff - OVER / 2]}
        rotation={[-g.angle, 0, 0]}
        castShadow
      />
      <mesh geometry={g.gableGeo} material={g.endMat} position={[L / 2, H, 0]} rotation={[0, Math.PI / 2, 0]} />
      <mesh geometry={g.gableGeo} material={g.endMat} position={[-L / 2, H, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <mesh geometry={g.door} material={g.doorMat} position={[L / 2 + 0.01, 0, 0]} />
    </group>
  )
})

export const HOUSE_SIZE = { L, D, H: H + RISE }
