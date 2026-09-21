import { useSyncExternalStore } from 'react'
import { slides } from '../data/slides'

/**
 * Minimal external store for presentation state.
 * `index`  – the slide being navigated to (drives camera + 3D groups immediately).
 * `shown`  – the slide whose HTML content is currently mounted (switches after the
 *            outgoing text animation finishes).
 */
export interface PresentationState {
  index: number
  shown: number
  direction: 1 | -1
  detailsOpen: boolean
}

type Listener = () => void

let state: PresentationState = { index: 0, shown: 0, direction: 1, detailsOpen: false }
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((l) => l())
}

export const presentation = {
  get: () => state,
  set(patch: Partial<PresentationState>) {
    state = { ...state, ...patch }
    emit()
  },
  subscribe(l: Listener) {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  count: slides.length,
  goTo(i: number) {
    const next = Math.max(0, Math.min(slides.length - 1, i))
    if (next === state.index) return
    presentation.set({ index: next, direction: next > state.index ? 1 : -1, detailsOpen: false })
  },
  next() {
    presentation.goTo(state.index + 1)
  },
  prev() {
    presentation.goTo(state.index - 1)
  },
}

export function usePresentation<T>(selector: (s: PresentationState) => T): T {
  return useSyncExternalStore(
    presentation.subscribe,
    () => selector(state),
    () => selector(state),
  )
}

/** Normalised pointer position (-1..1), shared without re-rendering React. */
export const pointer = { x: 0, y: 0 }

/** Screen rect of the stage area; the 3D camera centres the scene inside it. */
export const stageRect = { x: 0, y: 0, width: 1, height: 1, version: 0 }
