import { onBeforeUnmount, onMounted } from 'vue'
import Lenis from 'lenis'

/**
 * Mounts a global Lenis smooth-scroll instance (as used in Format Archive)
 * and drives it with a single requestAnimationFrame loop. The instance is
 * exposed so callers can scroll to top / stop / start on route changes.
 */
export function useSmoothScroll() {
  let lenis: Lenis | null = null
  let rafId = 0

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  onMounted(() => {
    if (prefersReducedMotion) return

    lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    })

    const raf = (time: number) => {
      lenis?.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(rafId)
    lenis?.destroy()
    lenis = null
  })

  const scrollToTop = () => {
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }

  return { scrollToTop }
}
