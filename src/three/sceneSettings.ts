import { createContext, useContext } from 'react'
import type { Layout } from '../hooks/useMedia'

export interface SceneSettings {
  layout: Layout
  reducedMotion: boolean
  /** Show HTML tags anchored in 3D (off on mobile — values move to the details sheet). */
  showTags: boolean
  /** Use physically-based transmission for glass (desktop only). */
  highQuality: boolean
}

export const SceneSettingsContext = createContext<SceneSettings>({
  layout: 'desktop',
  reducedMotion: false,
  showTags: true,
  highQuality: true,
})

export const useSceneSettings = () => useContext(SceneSettingsContext)
