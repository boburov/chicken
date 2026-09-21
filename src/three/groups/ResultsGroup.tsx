import { useMemo } from 'react'
import { Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { Slide } from '../../data/types'
import { toNumber } from '../../lib/number'
import { StatValue } from '../../components/StatValue'
import { barGradient } from '../textures'
import { Rise } from '../Rise'
import { useSceneSettings } from '../sceneSettings'
import { useGlassMaterial } from '../Props'

const MAX_H = 4.6
const PAIR_GAP = 2.95
const BAR_W = 0.86

/** 2016 vs 2027 comparison as paired 3D bars; each pair is scaled to its own 2027 value. */
export function ResultsGroup({ slide, active, x }: { slide: Slide; active: boolean; x: number }) {
  const { showTags } = useSceneSettings()
  const glass = useGlassMaterial('#f1f5ff')
  const r = slide.results!
  const beforeMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#9aabc6', roughness: 0.45, metalness: 0.1, clearcoat: 0.6 }),
    [],
  )
  const afterMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: barGradient(),
        roughness: 0.25,
        metalness: 0.15,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        emissive: new THREE.Color('#2a3cff'),
        emissiveIntensity: 0.08,
      }),
    [],
  )

  const n = r.pairs.length
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, -0.06, 0]} receiveShadow material={glass}>
        <boxGeometry args={[n * PAIR_GAP + 0.6, 0.1, 2.2]} />
      </mesh>
      {r.pairs.map((p, i) => {
        const cx = (i - (n - 1) / 2) * PAIR_GAP
        const a = toNumber(p.after)
        const hAfter = MAX_H
        const hBefore = Math.max(0.12, (toNumber(p.before) / a) * MAX_H)
        const bars = [
          { h: hBefore, x: cx - BAR_W / 2 - 0.06, mat: beforeMat, value: p.before, year: r.beforeYear, after: false },
          { h: hAfter, x: cx + BAR_W / 2 + 0.06, mat: afterMat, value: p.after, year: r.afterYear, after: true },
        ]
        return (
          <group key={p.label}>
            {bars.map((b, j) => (
              <group key={j}>
                <Rise active={active} order={i * 2 + j} stagger={0.07} baseDelay={0.7} position={[b.x, 0, 0]}>
                  <RoundedBox
                    args={[BAR_W, b.h, BAR_W]}
                    radius={0.06}
                    smoothness={3}
                    position={[0, b.h / 2, 0]}
                    material={b.mat}
                    castShadow
                  />
                </Rise>
                {showTags && (
                  <Html position={[b.x, b.h + 0.05, 0]} center zIndexRange={[20, 10]} style={{ pointerEvents: 'none' }}>
                    <div
                      className={`bar-label ${b.after ? 'bar-label--after' : ''} ${active ? 'is-active' : ''}`}
                      style={{ transitionDelay: active ? `${1.1 + (i * 2 + j) * 0.07}s` : '0s' }}
                    >
                      <StatValue value={b.value} play={active} delay={1.1 + (i * 2 + j) * 0.07} />
                    </div>
                  </Html>
                )}
              </group>
            ))}
            {showTags && (
              <Html position={[cx, -0.2, 1.25]} center zIndexRange={[20, 10]} style={{ pointerEvents: 'none' }}>
                <div className={`bar-caption ${active ? 'is-active' : ''}`} style={{ transitionDelay: active ? `${1 + i * 0.06}s` : '0s' }}>
                  <strong>{p.label}</strong>
                  <span>{p.unit}</span>
                </div>
              </Html>
            )}
          </group>
        )
      })}
    </group>
  )
}
