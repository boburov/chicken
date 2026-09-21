import * as THREE from 'three'

/** All textures are generated procedurally — no network, no image decoding cost. */

function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d')!)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

let roof: THREE.CanvasTexture | null = null
/** Corrugated blue roofing, like the brochure illustrations. */
export function roofTexture() {
  if (roof) return roof
  roof = canvasTexture(64, 8, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 64, 0)
    g.addColorStop(0, '#1d5fe0')
    g.addColorStop(0.45, '#3f86ff')
    g.addColorStop(0.55, '#8cb8ff')
    g.addColorStop(1, '#1d5fe0')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 8)
  })
  roof.wrapS = roof.wrapT = THREE.RepeatWrapping
  return roof
}

let wall: THREE.CanvasTexture | null = null
/** Light sandwich-panel wall with a row of small vents. */
export function wallTexture() {
  if (wall) return wall
  wall = canvasTexture(512, 96, (ctx) => {
    ctx.fillStyle = '#f3f6fb'
    ctx.fillRect(0, 0, 512, 96)
    ctx.fillStyle = '#e1e7f1'
    for (let x = 0; x < 512; x += 32) ctx.fillRect(x, 0, 2, 96)
    ctx.fillStyle = '#c3cddd'
    for (let x = 18; x < 512; x += 64) ctx.fillRect(x, 26, 16, 12)
    ctx.fillStyle = '#9fb0c9'
    ctx.fillRect(0, 88, 512, 8)
  })
  return wall
}

let sprite: THREE.CanvasTexture | null = null
/** Soft round sprite for particles. */
export function particleSprite() {
  if (sprite) return sprite
  sprite = canvasTexture(64, 64, (ctx) => {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.35, 'rgba(255,255,255,0.55)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
  })
  return sprite
}

let barGrad: THREE.CanvasTexture | null = null
/** Vertical blue → purple gradient used on 2027 bars. */
export function barGradient() {
  if (barGrad) return barGrad
  barGrad = canvasTexture(4, 256, (ctx) => {
    const g = ctx.createLinearGradient(0, 256, 0, 0)
    g.addColorStop(0, '#176BFF')
    g.addColorStop(0.65, '#5a55f7')
    g.addColorStop(1, '#7B3FF2')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 4, 256)
  })
  return barGrad
}
