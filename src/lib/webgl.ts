/** True when WebGL is available and the user hasn't forced the 2D fallback (?no3d). */
export function canUseWebGL(): boolean {
  if (typeof window === 'undefined') return false
  if (new URLSearchParams(window.location.search).has('no3d')) return false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    const ok = !!gl
    ;(gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')?.loseContext()
    return ok
  } catch {
    return false
  }
}
