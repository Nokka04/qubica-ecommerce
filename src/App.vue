<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import SitePreloader from './components/SitePreloader.vue'
import { useSmoothScroll } from './composables/useSmoothScroll'
import { gsap } from './composables/gsap'

const { scrollToTop } = useSmoothScroll()

const HIDDEN_CLIP = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
const SHOWN_CLIP = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

function onEnter(el: Element, done: () => void): void {
  scrollToTop()
  gsap.fromTo(
    el,
    { clipPath: HIDDEN_CLIP },
    { clipPath: SHOWN_CLIP, duration: 0.8, ease: 'hop', onComplete: done },
  )
}

function onLeave(el: Element, done: () => void): void {
  gsap.to(el, {
    opacity: 0.2,
    y: '-8%',
    duration: 0.4,
    ease: 'power2.in',
    onComplete: done,
  })
}
</script>

<template>
  <a class="skip-link" href="#main">Skip to main content</a>
  <SitePreloader />
  <AppHeader />

  <main id="main" class="main">
    <RouterView v-slot="{ Component }">
      <Transition mode="out-in" :css="false" @enter="onEnter" @leave="onLeave">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>

<style scoped lang="scss">
.skip-link {
  position: absolute;
  left: var(--pad);
  top: -3rem;
  z-index: 2000;
  padding: var(--space-2) var(--space-4);
  background-color: var(--color-fg);
  color: var(--color-bg);
  text-transform: uppercase;
  font-size: var(--font-size-label);
  transition: top var(--transition-fast);

  &:focus {
    top: var(--space-2);
  }
}

.main {
  min-height: 100svh;
}
</style>
