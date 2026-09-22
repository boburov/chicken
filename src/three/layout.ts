import type { VisualKind } from '../data/types'

export interface CameraPose {
  /** Look-at point relative to the group origin. */
  target: [number, number, number]
  /** Direction from target to camera (normalised at runtime). */
  dir: [number, number, number]
  /** World-space width/height that must fit inside the stage rect. */
  frame: [number, number]
}

export const cameraPoses: Record<VisualKind, CameraPose> = {
  cover: { target: [1.9, 1.6, 0], dir: [0.18, 0.12, 1], frame: [10.6, 9] },
}
