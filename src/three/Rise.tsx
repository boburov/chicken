import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import type * as THREE from 'three'
import type { ThreeElements } from '@react-three/fiber'
import { useSceneSettings } from './sceneSettings'

type Props = ThreeElements['group'] & {
  active: boolean
  /** Order within its group, used for staggering. */
  order?: number
  /** Seconds before the first item starts (camera is still travelling). */
  baseDelay?: number
  stagger?: number
  /** 'grow' scales up from the ground; 'drop' descends from above. */
  mode?: 'grow' | 'drop'
  children: ReactNode
}

/**
 * Animates its children into the scene when `active` becomes true and sinks them
 * away when it turns false. Hidden groups are set invisible to skip rendering.
 */
export function Rise({ active, order = 0, baseDelay = 0.55, stagger = 0.06, mode = 'grow', children, ...rest }: Props) {
  const ref = useRef<THREE.Group>(null)
  const { reducedMotion } = useSceneSettings()

  useEffect(() => {
    const g = ref.current
    if (!g) return
    gsap.killTweensOf([g.scale, g.position])
    const baseY = (rest.position as [number, number, number] | undefined)?.[1] ?? 0
    if (reducedMotion) {
      g.visible = active
      g.scale.set(1, 1, 1)
      g.position.y = baseY
      return
    }
    if (active) {
      g.visible = true
      const from = mode === 'grow' ? { y: 0.001 } : { y: 1 }
      g.scale.y = from.y
      if (mode === 'drop') g.position.y = baseY + 3
      gsap.to(g.scale, {
        y: 1,
        duration: 1.1,
        delay: baseDelay + order * stagger,
        ease: 'expo.out',
      })
      gsap.to(g.position, { y: baseY, duration: 1.2, delay: baseDelay + order * stagger, ease: 'power3.out' })
    } else {
      gsap.to(g.scale, { y: 0.001, duration: 0.55, delay: order * 0.02, ease: 'power2.in' })
      gsap.to(g.position, {
        y: baseY - 0.4,
        duration: 0.55,
        delay: order * 0.02,
        ease: 'power2.in',
        onComplete: () => {
          g.visible = false
          g.position.y = baseY
        },
      })
    }
  }, [active, reducedMotion])

  return (
    <group ref={ref} visible={false} scale={[1, 0.001, 1]} {...rest}>
      {children}
    </group>
  )
}
