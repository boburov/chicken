import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'
import { slides } from '../data/slides'
import { pointer, presentation, stageRect, usePresentation } from '../state/presentation'
import { cameraPoses, groupX } from './layout'
import { useSceneSettings } from './sceneSettings'

/** Computes the camera position that fits a slide's frame inside the on-screen stage rect. */
function poseFor(index: number, cam: THREE.PerspectiveCamera, vw: number, vh: number) {
  const kind = slides[index].visual
  const p = cameraPoses[kind]
  const gx = groupX(kind)
  const target = new THREE.Vector3(p.target[0] + gx, p.target[1], p.target[2])
  const dir = new THREE.Vector3(...p.dir).normalize()
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))
  const rw = Math.max(0.2, stageRect.width / vw)
  const rh = Math.max(0.2, stageRect.height / vh)
  const aspect = vw / vh
  const dW = p.frame[0] / (2 * tanHalf * aspect * rw)
  const dH = p.frame[1] / (2 * tanHalf * rh)
  const d = Math.max(dW, dH)
  return { target, position: target.clone().add(dir.multiplyScalar(d)) }
}

export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)
  const invalidate = useThree((s) => s.invalidate)
  const index = usePresentation((s) => s.index)
  const { reducedMotion, layout } = useSceneSettings()
  const light = useRef<THREE.DirectionalLight>(null)

  const rig = useMemo(
    () => ({
      pos: new THREE.Vector3(0, 3, 14),
      target: new THREE.Vector3(0, 1.5, 0),
      lift: { v: 0 },
      smooth: new THREE.Vector2(),
      lastVersion: -1,
      initialised: false,
    }),
    [],
  )

  const applyViewOffset = () => {
    const w = size.width
    const h = size.height
    const cx = stageRect.x + stageRect.width / 2
    const cy = stageRect.y + stageRect.height / 2
    camera.setViewOffset(w, h, w / 2 - cx, h / 2 - cy, w, h)
    rig.lastVersion = stageRect.version
  }

  // Travel to the active slide.
  useEffect(() => {
    applyViewOffset()
    const next = poseFor(index, camera, size.width, size.height)
    gsap.killTweensOf([rig.pos, rig.target, rig.lift])
    if (reducedMotion || !rig.initialised) {
      rig.pos.copy(next.position)
      rig.target.copy(next.target)
      if (!rig.initialised && !reducedMotion) {
        // Entrance: start further back and higher, glide in.
        rig.pos.add(new THREE.Vector3(-2, 4, 9))
        gsap.to(rig.pos, { x: next.position.x, y: next.position.y, z: next.position.z, duration: 2.6, ease: 'expo.out', delay: 0.2 })
      }
      rig.initialised = true
      invalidate()
      return
    }
    const dur = 1.7
    gsap.to(rig.pos, { x: next.position.x, y: next.position.y, z: next.position.z, duration: dur, ease: 'power3.inOut' })
    gsap.to(rig.target, { x: next.target.x, y: next.target.y, z: next.target.z, duration: dur, ease: 'power3.inOut' })
    gsap.fromTo(rig.lift, { v: 0 }, { v: 1, duration: dur / 2, ease: 'sine.inOut', yoyo: true, repeat: 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, reducedMotion])

  // Re-fit on resize / stage change without animation.
  useEffect(() => {
    applyViewOffset()
    const p = poseFor(presentation.get().index, camera, size.width, size.height)
    gsap.killTweensOf([rig.pos, rig.target])
    rig.pos.copy(p.position)
    rig.target.copy(p.target)
    invalidate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height, layout])

  useFrame(() => {
    if (rig.lastVersion !== stageRect.version) {
      applyViewOffset()
      const p = poseFor(presentation.get().index, camera, size.width, size.height)
      if (!gsap.isTweening(rig.pos)) {
        rig.pos.copy(p.position)
        rig.target.copy(p.target)
      }
    }
    const k = reducedMotion ? 0 : 1
    rig.smooth.x += (pointer.x - rig.smooth.x) * 0.05
    rig.smooth.y += (pointer.y - rig.smooth.y) * 0.05
    camera.position.set(
      rig.pos.x + rig.smooth.x * 0.55 * k,
      rig.pos.y - rig.smooth.y * 0.3 * k + rig.lift.v * 2.2,
      rig.pos.z + rig.lift.v * 3,
    )
    camera.lookAt(rig.target)
    if (light.current) {
      light.current.position.set(rig.target.x + 7, 14, rig.target.z + 9)
      light.current.target.position.copy(rig.target)
      light.current.target.updateMatrixWorld()
    }
  })

  const shadowSize = layout === 'mobile' ? 1024 : 2048
  return (
    <directionalLight
      ref={light}
      intensity={1.9}
      color="#ffffff"
      castShadow
      shadow-mapSize={[shadowSize, shadowSize]}
      shadow-camera-left={-16}
      shadow-camera-right={16}
      shadow-camera-top={12}
      shadow-camera-bottom={-12}
      shadow-camera-near={1}
      shadow-camera-far={50}
      shadow-bias={-0.0004}
      shadow-radius={6}
    />
  )
}
