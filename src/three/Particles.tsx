import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { particleSprite } from './textures'
import { useSceneSettings } from './sceneSettings'

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vFade;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.25 + aPhase) * 0.35;
    p.y += sin(uTime * 0.4 + aPhase * 1.7) * 0.45;
    p.z += cos(uTime * 0.2 + aPhase) * 0.3;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (38.0 / -mv.z);
    vColor = aColor;
    vFade = 0.55 + 0.45 * sin(uTime * 0.8 + aPhase * 3.0);
  }
`

const fragment = /* glsl */ `
  uniform sampler2D uMap;
  varying vec3 vColor;
  varying float vFade;
  void main() {
    float a = texture2D(uMap, gl_PointCoord).a;
    gl_FragColor = vec4(vColor, a * 0.7 * vFade);
  }
`

/** Small deterministic PRNG so the particle field is identical on every mount. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Soft blue/purple glowing motes drifting around the scene. */
export function Particles() {
  const { layout, reducedMotion } = useSceneSettings()
  const count = layout === 'mobile' ? 90 : layout === 'tablet' ? 140 : 200
  const mat = useRef<THREE.ShaderMaterial>(null)

  const geometry = useMemo(() => {
    const rand = mulberry32(7)
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const size = new Float32Array(count)
    const phase = new Float32Array(count)
    const palette = [new THREE.Color('#176BFF'), new THREE.Color('#7B3FF2'), new THREE.Color('#BDA7FF'), new THREE.Color('#5C9BFF')]
    for (let i = 0; i < count; i++) {
      pos[i * 3] = -18 + rand() * 36
      pos[i * 3 + 1] = 0.5 + rand() * 9
      pos[i * 3 + 2] = -14 + rand() * 22
      const c = palette[i % palette.length]
      col.set([c.r, c.g, c.b], i * 3)
      size[i] = 1.2 + rand() * 3.2
      phase[i] = rand() * Math.PI * 2
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
    return g
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uMap: { value: particleSprite() },
    }),
    [],
  )

  useFrame((_, dt) => {
    if (!reducedMotion && mat.current) mat.current.uniforms.uTime.value += dt
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  )
}
