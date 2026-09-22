import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { slides } from '../data/slides'
import { usePresentation } from '../state/presentation'
import { useLayout, usePageVisible, useReducedMotion } from '../hooks/useMedia'
import { SceneSettingsContext } from './sceneSettings'
import { CameraRig } from './CameraRig'
import { Particles } from './Particles'
import { CoverGroup } from './groups/CoverGroup'

/** The single scene: the brand medallion inside the financing ring. */
function Scene() {
  const index = usePresentation((s) => s.index)
  const slide = slides[index]
  return <CoverGroup slide={slide} active x={0} />
}

/** Keeps a 'demand' frameloop fresh while GSAP tweens run (reduced-motion mode). */
function DemandTicker({ enabled }: { enabled: boolean }) {
  const invalidate = useThree((s) => s.invalidate)
  const index = usePresentation((s) => s.index)
  useEffect(() => {
    if (!enabled) return
    let raf = 0
    const until = performance.now() + 600
    const tick = () => {
      invalidate()
      if (performance.now() < until) raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [enabled, index, invalidate])
  return null
}

export default function Stage() {
  const layout = useLayout()
  const reducedMotion = useReducedMotion()
  const visible = usePageVisible()
  const settings = {
    layout,
    reducedMotion,
    showTags: layout !== 'mobile',
    highQuality: layout === 'desktop',
  }

  return (
    <div className="stage-canvas" aria-hidden="true">
      <Canvas
        shadows="percentage"
        dpr={layout === 'desktop' ? [1, 1.75] : [1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 30, near: 0.5, far: 160, position: [0, 4, 18] }}
        frameloop={!visible ? 'never' : reducedMotion ? 'demand' : 'always'}
        onCreated={(state) => {
          const { gl } = state
          if (import.meta.env.DEV) (window as unknown as { __r3f: unknown }).__r3f = state
          gl.setClearColor(0x000000, 0)
          gl.toneMapping = THREE.NeutralToneMapping
          gl.toneMappingExposure = 1
        }}
      >
        <SceneSettingsContext.Provider value={settings}>
          <fog attach="fog" args={['#F8FAFF', 30, 78]} />
          <hemisphereLight args={['#ffffff', '#dbe4ff', 1.15]} />
          <pointLight position={[-6, 6, 6]} color="#176BFF" intensity={18} distance={30} />
          <CameraRig />
          <DemandTicker enabled={reducedMotion} />

          {/* Local, offline environment for glass & metal reflections: blue + purple softboxes. */}
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 6, 4]} scale={[12, 4, 1]} />
            <Lightformer form="rect" intensity={2.4} color="#176BFF" position={[-8, 2, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
            <Lightformer form="rect" intensity={2} color="#7B3FF2" position={[8, 2, -2]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
            <Lightformer form="ring" intensity={1.4} color="#BDA7FF" position={[0, 3, -8]} scale={4} />
          </Environment>

          {/* Ground shadow catcher */}
          <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[120, 120]} />
            <shadowMaterial transparent opacity={0.11} color="#123B8F" />
          </mesh>

          <Particles />
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </SceneSettingsContext.Provider>
      </Canvas>
    </div>
  )
}
