import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { brand } from '../../data/slides'
import { useGlassMaterial } from '../Props'
import { useSceneSettings } from '../sceneSettings'

/** Brand emblem: navy medallion with the tan “S” mark, faux-extruded, wrapped in a glass ring. */
export function CoverGroup({ active, x }: { active: boolean; x: number }) {
  const root = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const orbit = useRef<THREE.Group>(null)
  const { reducedMotion } = useSceneSettings()
  const logo = useTexture(brand.logo)
  logo.colorSpace = THREE.SRGBColorSpace
  logo.anisotropy = 8
  const glass = useGlassMaterial('#f2f6ff')

  const aspect = logo.image ? (logo.image as HTMLImageElement).width / (logo.image as HTMLImageElement).height : 1
  const layers = useMemo(() => {
    // Stacked copies of the mark, darkened toward the back, read as a solid extrusion.
    return Array.from({ length: 9 }, (_, i) => {
      const m = new THREE.MeshBasicMaterial({ map: logo, transparent: true, alphaTest: 0.4, depthWrite: true })
      m.color = new THREE.Color().setHSL(0.08, 0.35, i === 0 ? 1 : 0.62 - i * 0.02)
      return { z: 0.16 - i * 0.012, m }
    })
  }, [logo])

  useEffect(() => {
    const g = root.current
    if (!g) return
    gsap.killTweensOf([g.scale, g.rotation, g.position])
    if (reducedMotion) {
      g.visible = active
      return
    }
    if (active) {
      g.visible = true
      gsap.fromTo(g.position, { z: -6 }, { z: 0, duration: 1.8, delay: 0.35, ease: 'expo.out' })
      gsap.fromTo(g.rotation, { y: -1.1, x: 0.35 }, { y: 0, x: 0, duration: 2.1, delay: 0.35, ease: 'expo.out' })
      gsap.fromTo(g.scale, { x: 0.6, y: 0.6, z: 0.6 }, { x: 1, y: 1, z: 1, duration: 1.6, delay: 0.35, ease: 'expo.out' })
    } else {
      gsap.to(g.position, { z: -4, duration: 0.7, ease: 'power2.in' })
      gsap.to(g.scale, { x: 0.7, y: 0.7, z: 0.7, duration: 0.7, ease: 'power2.in', onComplete: () => void (g.visible = false) })
    }
  }, [active, reducedMotion])

  useFrame((state) => {
    if (reducedMotion) return
    const t = state.clock.elapsedTime
    if (spin.current) {
      spin.current.rotation.y = Math.sin(t * 0.45) * 0.22
      spin.current.rotation.x = Math.sin(t * 0.33) * 0.06
      spin.current.position.y = Math.sin(t * 0.8) * 0.12
    }
    if (orbit.current) orbit.current.rotation.z = t * 0.12
  })

  return (
    <group position={[x, 1.6, 0]}>
      <group ref={root}>
        <group ref={spin}>
          {/* navy medallion */}
          <mesh rotation-x={Math.PI / 2} castShadow>
            <cylinderGeometry args={[1.62, 1.62, 0.22, 96]} />
            <meshPhysicalMaterial color="#123B8F" metalness={0.35} roughness={0.28} clearcoat={1} clearcoatRoughness={0.12} />
          </mesh>
          {/* glass bezel */}
          <mesh material={glass}>
            <torusGeometry args={[1.78, 0.2, 32, 128]} />
          </mesh>
          {layers.map((l, i) => (
            <mesh key={i} position={[0.02, 0, l.z]} material={l.m} renderOrder={10 - i}>
              <planeGeometry args={[1.95 * aspect, 1.95]} />
            </mesh>
          ))}
        </group>
        {/* orbiting accent rings */}
        <group ref={orbit} rotation-x={0.3}>
          <mesh rotation-y={0.5}>
            <torusGeometry args={[2.45, 0.012, 8, 160]} />
            <meshBasicMaterial color="#176BFF" transparent opacity={0.55} />
          </mesh>
          <mesh rotation-y={-0.6} rotation-x={0.4}>
            <torusGeometry args={[2.75, 0.008, 8, 160]} />
            <meshBasicMaterial color="#7B3FF2" transparent opacity={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
