import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GROUP_SPACING, groupOrder } from './layout'
import { useSceneSettings } from './sceneSettings'

function paneTexture(a: string, b: string) {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, 256, 256)
  g.addColorStop(0, a)
  g.addColorStop(1, b)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  // bright edge highlight = glass reflection
  const e = ctx.createLinearGradient(0, 0, 256, 0)
  e.addColorStop(0, 'rgba(255,255,255,0.45)')
  e.addColorStop(0.08, 'rgba(255,255,255,0)')
  ctx.fillStyle = e
  ctx.fillRect(0, 0, 256, 256)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** Large translucent glass sheets at several depths behind each group — gives layered depth. */
export function BackdropPanes() {
  const { layout, reducedMotion } = useSceneSettings()
  const group = useRef<THREE.Group>(null)
  const panes = useMemo(() => {
    const blue = paneTexture('rgba(23,107,255,0.10)', 'rgba(189,167,255,0.04)')
    const violet = paneTexture('rgba(123,63,242,0.08)', 'rgba(23,107,255,0.03)')
    const perGroup = layout === 'mobile' ? 1 : layout === 'tablet' ? 2 : 3
    const out: { pos: [number, number, number]; rot: number; size: [number, number]; map: THREE.Texture; phase: number }[] = []
    groupOrder.forEach((kind, gi) => {
      if (kind === 'cover') return // keep the cover photo clean
      for (let k = 0; k < perGroup; k++) {
        const s = (gi * 7 + k * 3) % 5
        out.push({
          pos: [gi * GROUP_SPACING + (k - 1) * 11 + s, 3 + s * 0.7, -12 - k * 5],
          rot: (k % 2 ? -1 : 1) * (0.18 + s * 0.04),
          size: [9 + s * 2, 5 + s],
          map: k % 2 ? violet : blue,
          phase: gi + k,
        })
      }
    })
    return out
  }, [layout])

  useFrame((state) => {
    if (reducedMotion || !group.current) return
    const t = state.clock.elapsedTime
    group.current.children.forEach((m, i) => {
      m.position.y = panes[i].pos[1] + Math.sin(t * 0.3 + panes[i].phase) * 0.35
    })
  })

  return (
    <group ref={group}>
      {panes.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={[0, p.rot, 0.04]}>
          <planeGeometry args={p.size} />
          <meshBasicMaterial map={p.map} transparent depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}
