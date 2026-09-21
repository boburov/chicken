import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Grid, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { slides } from '../data/slides'
import { usePresentation } from '../state/presentation'
import { useLayout, usePageVisible, useReducedMotion } from '../hooks/useMedia'
import { SceneSettingsContext } from './sceneSettings'
import { CameraRig } from './CameraRig'
import { Particles } from './Particles'
import { BackdropPanes } from './BackdropPanes'
import { GROUP_SPACING, groupOrder, groupX } from './layout'
import { CoverGroup } from './groups/CoverGroup'
import { CurrentGroup } from './groups/CurrentGroup'
import { EggProjectGroup } from './groups/EggProjectGroup'
import { BroilerGroup } from './groups/BroilerGroup'
import { InvestmentGroup } from './groups/InvestmentGroup'
import { ResultsGroup } from './groups/ResultsGroup'

const bySlide = (kind: string) => slides.find((s) => s.visual === kind)!

/** Only groups adjacent to the active slide are mounted, so far-away scenes cost nothing. */
function Groups() {
  const index = usePresentation((s) => s.index)
  const active = slides[index].visual
  const near = (kind: (typeof groupOrder)[number]) => Math.abs(groupOrder.indexOf(kind) - index) <= 1
  return (
    <>
      {near('cover') && <CoverGroup active={active === 'cover'} x={groupX('cover')} />}
      {near('current') && <CurrentGroup slide={bySlide('current')} active={active === 'current'} x={groupX('current')} />}
      {near('eggProject') && (
        <EggProjectGroup slide={bySlide('eggProject')} active={active === 'eggProject'} x={groupX('eggProject')} />
      )}
      {near('broiler12') && (
        <BroilerGroup slide={bySlide('broiler12')} active={active === 'broiler12'} x={groupX('broiler12')} count={12} />
      )}
      {near('broiler6') && (
        <BroilerGroup slide={bySlide('broiler6')} active={active === 'broiler6'} x={groupX('broiler6')} count={6} />
      )}
      {near('investment') && (
        <InvestmentGroup slide={bySlide('investment')} active={active === 'investment'} x={groupX('investment')} />
      )}
      {near('results') && <ResultsGroup slide={bySlide('results')} active={active === 'results'} x={groupX('results')} />}
    </>
  )
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
  const span = (groupOrder.length - 1) * GROUP_SPACING

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

          {/* Ground: shadow catcher + a faint technical grid. */}
          <mesh rotation-x={-Math.PI / 2} position={[span / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[span + 120, 120]} />
            <shadowMaterial transparent opacity={0.11} color="#123B8F" />
          </mesh>
          {layout !== 'mobile' && (
            <Grid
              position={[span / 2 + GROUP_SPACING / 2, 0.002, 0]}
              args={[span, 70]}
              cellSize={1}
              cellThickness={0.6}
              cellColor="#d3def5"
              sectionSize={5}
              sectionThickness={0.9}
              sectionColor="#b7c8ee"
              fadeDistance={48}
              fadeStrength={2.2}
            />
          )}

          <BackdropPanes />
          <Particles />
          <Suspense fallback={null}>
            <Groups />
          </Suspense>
        </SceneSettingsContext.Provider>
      </Canvas>
    </div>
  )
}
