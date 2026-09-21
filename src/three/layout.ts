import type { VisualKind } from '../data/types'

/** Each visual group lives at its own spot along the campus; the camera travels between them. */
export const GROUP_SPACING = 40

export const groupOrder: VisualKind[] = [
  'cover',
  'current',
  'eggProject',
  'broiler12',
  'broiler6',
  'investment',
  'results',
]

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
  cover: { target: [1.9, 1.6, 0], dir: [0.18, 0.12, 1], frame: [10, 8.6] },
  current: { target: [0, 0.6, 0.6], dir: [0.08, 0.95, 1], frame: [21.5, 13.5] },
  eggProject: { target: [0, 0.5, 0.2], dir: [-0.1, 1.05, 1], frame: [25, 14.5] },
  broiler12: { target: [0, 0.4, 0.3], dir: [-0.3, 0.85, 1], frame: [24, 14] },
  broiler6: { target: [0, 0.4, 0.3], dir: [-0.3, 0.85, 1], frame: [24, 14] },
  investment: { target: [0, 3.1, 0], dir: [0.05, 0.1, 1], frame: [19, 7.8] },
  results: { target: [0, 2, 0], dir: [0.14, 0.3, 1], frame: [18, 7.4] },
}
