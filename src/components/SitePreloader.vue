<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from '@/composables/gsap'

const emit = defineEmits<{ (e: 'complete'): void }>()

const visible = ref(true)
const count = ref(0)
const loaderRef = ref<HTMLElement | null>(null)
const loaderBgRef = ref<HTMLElement | null>(null)
const countRef = ref<HTMLElement | null>(null)

function runCounter(): void {
  const totalSteps = 11
  const totalDuration = 2000
  const timePerStep = totalDuration / totalSteps
  let currentStep = 0

  const tick = () => {
    currentStep++
    if (currentStep > totalSteps) return
    if (currentStep === totalSteps) {
      count.value = 100
    } else {
      const exact = (currentStep / totalSteps) * 100
      const min = Math.max(Math.floor(exact - 5), 1)
      const max = Math.min(Math.floor(exact + 5), 99)
      count.value = Math.floor(Math.random() * (max - min + 1)) + min
    }
    if (currentStep < totalSteps) window.setTimeout(tick, timePerStep)
  }

  window.setTimeout(tick, timePerStep)
}

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) {
    visible.value = false
    emit('complete')
    return
  }

  runCounter()

  const tl = gsap.timeline({
    onComplete: () => {
      visible.value = false
      emit('complete')
    },
  })

  tl.to(countRef.value, { opacity: 0, delay: 2.4, duration: 0.25 })
  tl.to(loaderRef.value, { height: 0, ease: 'hop2', duration: 1 }, '-=0.4')
  tl.to(loaderBgRef.value, { height: 0, ease: 'hop2', duration: 1 }, '-=0.6')
})
</script>

<template>
  <div v-if="visible" class="preloader" aria-hidden="true">
    <div ref="loaderRef" class="loader">
      <div ref="countRef" class="count">
        <p>{{ count }}</p>
      </div>
    </div>
    <div ref="loaderBgRef" class="loader-bg" />
  </div>
</template>

<style scoped lang="scss">
.preloader {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100svh;
  overflow: hidden;
  pointer-events: none;
  z-index: 1000;
}

.loader {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: var(--color-inverse-bg);
  color: var(--color-inverse-fg);
  overflow: hidden;
  z-index: 2;
}

.loader-bg {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: var(--color-loader-bg);
  z-index: 1;
}

.count {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  p {
    color: var(--color-inverse-fg);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: var(--letter-label);
  }
}
</style>
