import type { VisualKind } from '../data/types'

/** Each visual group lives at its own spot along the campus; the camera travels between them. */
export const GROUP_SPACING = 40

export const groupOrder: VisualKind[] = ['cover', 'current']

export const groupX = (kind: VisualKind) => groupOrder.indexOf(kind) * GROUP_SPACING

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
  current: { target: [0, 1.2, 0.8], dir: [0.08, 0.95, 1], frame: [21.5, 17] },
}
