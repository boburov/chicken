import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useTexture } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { brand } from '../../data/slides'
import type { Financing, Slide, Tone } from '../../data/types'
import { toNumber } from '../../lib/number'
import { useSceneSettings } from '../sceneSettings'

const RING_R = 1.94
const TUBE_R = 0.17
const GAP = 0.07
const RADIAL_SEGMENTS = 20
const TONE_COLOR: Record<Tone, string> = { blue: '#176BFF', purple: '#7B3FF2' }

/** Circular arc in the XY plane, used as the path of a tube. */
class ArcCurve extends THREE.Curve<THREE.Vector3> {
  private start: number
  private sweep: number
  constructor(start: number, sweep: number) {
    super()
    this.start = start
    this.sweep = sweep
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const a = this.start + this.sweep * t
    return target.set(Math.cos(a) * RING_R, Math.sin(a) * RING_R, 0)
  }
}

interface Segment {
  tone: Tone
  label: string
  percent: number
  start: number
  sweep: number
  geometry: THREE.TubeGeometry
  tubular: number
}

/** Splits the ring clockwise from 12 o'clock in proportion to each financing part. */
function buildSegments(f: Financing): Segment[] {
  const values = f.parts.map((p) => toNumber(p.value))
  const sum = values.reduce((a, b) => a + b, 0)
  let angle = Math.PI / 2
  return f.parts.map((p, i) => {
    const share = values[i] / sum
    const sweep = -(share * Math.PI * 2 - GAP)
    const tubular = Math.max(8, Math.round(share * 160))
    const seg: Segment = {
      tone: p.tone,
      label: p.label,
      percent: Math.round(share * 100),
      start: angle - GAP / 2,
      sweep,
      geometry: new THREE.TubeGeometry(new ArcCurve(angle - GAP / 2, sweep), tubular, TUBE_R, RADIAL_SEGMENTS, false),
      tubular,
    }
    angle -= share * Math.PI * 2
    return seg
  })
}

/** Brand medallion inside a 3D financing ring (bank credit vs own funds). */
export function CoverGroup({ slide, active, x }: { slide: Slide; active: boolean; x: number }) {
  const root = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const orbit = useRef<THREE.Group>(null)
  const caps = useRef<(THREE.Mesh | null)[]>([])
  const { reducedMotion, showTags } = useSceneSettings()
  const logo = useTexture(brand.logo, (t) => {
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
  })
  const segments = useMemo(() => buildSegments(slide.financing!), [slide.financing])
  const materials = useMemo(
    () =>
      segments.map(
        (s) =>
          new THREE.MeshPhysicalMaterial({
            color: TONE_COLOR[s.tone],
            metalness: 0.25,
            roughness: 0.22,
            clearcoat: 1,
            clearcoatRoughness: 0.08,
            emissive: new THREE.Color(TONE_COLOR[s.tone]),
            emissiveIntensity: 0.12,
          }),
      ),
    [segments],
  )
  // Ring sweep progress 0..1 — drives each tube's draw range and its moving end cap.
  const sweep = useRef({ p: reducedMotion ? 1 : 0 })

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
    gsap.killTweensOf([g.scale, g.rotation, g.position, sweep.current])
    if (reducedMotion) {
      g.visible = active
      sweep.current.p = 1
      return
    }
    if (active) {
      g.visible = true
      gsap.fromTo(g.position, { z: -6 }, { z: 0, duration: 1.8, delay: 0.35, ease: 'expo.out' })
      gsap.fromTo(g.rotation, { y: -1.1, x: 0.35 }, { y: 0, x: 0, duration: 2.1, delay: 0.35, ease: 'expo.out' })
      gsap.fromTo(g.scale, { x: 0.6, y: 0.6, z: 0.6 }, { x: 1, y: 1, z: 1, duration: 1.6, delay: 0.35, ease: 'expo.out' })
      gsap.fromTo(sweep.current, { p: 0 }, { p: 1, duration: 1.6, delay: 0.9, ease: 'power3.inOut' })
    } else {
      gsap.to(g.position, { z: -4, duration: 0.7, ease: 'power2.in' })
      gsap.to(g.scale, { x: 0.7, y: 0.7, z: 0.7, duration: 0.7, ease: 'power2.in', onComplete: () => void (g.visible = false) })
    }
  }, [active, reducedMotion])

  useFrame((state) => {
    // Segments fill one after another around the ring.
    const total = segments.reduce((a, s) => a + Math.abs(s.sweep), 0)
    let covered = 0
    segments.forEach((s, i) => {
      const len = Math.abs(s.sweep)
      const local = THREE.MathUtils.clamp((sweep.current.p * total - covered) / len, 0, 1)
      covered += len
      const quads = Math.round(local * s.tubular)
      s.geometry.setDrawRange(0, quads * RADIAL_SEGMENTS * 6)
      const cap = caps.current[i]
      if (cap) {
        const a = s.start + s.sweep * local
        cap.visible = local > 0
        cap.position.set(Math.cos(a) * RING_R, Math.sin(a) * RING_R, 0)
      }
    })
    if (reducedMotion) return
    const t = state.clock.elapsedTime
    if (spin.current) {
      spin.current.rotation.y = Math.sin(t * 0.45) * 0.2
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
          {layers.map((l, i) => (
            <mesh key={i} position={[0.02, 0, l.z]} material={l.m} renderOrder={10 - i}>
              <planeGeometry args={[1.95 * aspect, 1.95]} />
            </mesh>
          ))}

          {/* financing ring: one tube per part, proportional to its share */}
          {segments.map((s, i) => (
            <group key={s.label}>
              <mesh geometry={s.geometry} material={materials[i]} castShadow />
              {/* rounded start + moving end caps */}
              <mesh
                position={[Math.cos(s.start) * RING_R, Math.sin(s.start) * RING_R, 0]}
                material={materials[i]}
              >
                <sphereGeometry args={[TUBE_R, 20, 14]} />
              </mesh>
              <mesh ref={(m) => void (caps.current[i] = m)} material={materials[i]}>
                <sphereGeometry args={[TUBE_R, 20, 14]} />
              </mesh>
              {showTags && (
                <Html
                  position={[
                    Math.cos(s.start + s.sweep / 2) * (RING_R + 0.62),
                    Math.sin(s.start + s.sweep / 2) * (RING_R + 0.62),
                    0.2,
                  ]}
                  center
                  zIndexRange={[20, 10]}
                  style={{ pointerEvents: 'none' }}
                >
                  <div
                    className={`ring-label ring-label--${s.tone} ${active ? 'is-active' : ''}`}
                    style={{ transitionDelay: active ? `${1.5 + i * 0.45}s` : '0s' }}
                  >
                    <strong>{s.percent}%</strong>
                    <span>{s.label}</span>
                  </div>
                </Html>
              )}
            </group>
          ))}
        </group>
        {/* orbiting accent rings */}
        <group ref={orbit} rotation-x={0.3}>
          <mesh rotation-y={0.5}>
            <torusGeometry args={[2.7, 0.012, 8, 160]} />
            <meshBasicMaterial color="#176BFF" transparent opacity={0.45} />
          </mesh>
          <mesh rotation-y={-0.6} rotation-x={0.4}>
            <torusGeometry args={[3, 0.008, 8, 160]} />
            <meshBasicMaterial color="#7B3FF2" transparent opacity={0.35} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
