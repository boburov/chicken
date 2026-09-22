import { useEffect } from 'react'
import { pointer, presentation } from '../state/presentation'

/** Keyboard (arrows, PageUp/Down for clickers, Home/End), swipe and pointer tracking. */
export function useNavigationInput() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(t.tagName))) return
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault()
          presentation.next()
          break
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          presentation.prev()
          break
        case 'Home':
          presentation.goTo(0)
          break
        case 'End':
          presentation.goTo(presentation.count - 1)
          break
      }
    }

    let sx = 0
    let sy = 0
    let tracking = false
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const target = e.target as HTMLElement
      if (target.closest('[data-no-swipe]')) return
      tracking = true
      sx = e.touches[0].clientX
      sy = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking) return
      tracking = false
      const dx = e.changedTouches[0].clientX - sx
      const dy = e.changedTouches[0].clientY - sy
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) presentation.next()
        else presentation.prev()
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])
}
