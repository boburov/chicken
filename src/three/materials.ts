import { useMemo } from 'react'
import * as THREE from 'three'
import { useSceneSettings } from './sceneSettings'

/** Glass material shared by the medallion bezel, investment nodes and chart base. */
export function useGlassMaterial(tint = '#eef3ff') {
  const { highQuality } = useSceneSettings()
  return useMemo(() => {
    // Transmission would sample the transparent canvas and turn white, so glass is a
    // clear-coated translucent surface with an iridescent blue/purple sheen instead.
    return new THREE.MeshPhysicalMaterial({
      color: tint,
      transparent: true,
      opacity: highQuality ? 0.5 : 0.6,
      roughness: 0.06,
      metalness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      iridescence: highQuality ? 0.6 : 0,
      iridescenceIOR: 1.4,
      envMapIntensity: 1.6,
      depthWrite: false,
    })
  }, [highQuality, tint])
}
