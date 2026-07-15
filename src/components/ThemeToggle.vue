<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.theme === 'dark')
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-pressed="isDark"
    :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="themeStore.toggle()"
  >
    <span aria-hidden="true">{{ isDark ? '☀️' : '🌙' }}</span>
    <span class="visually-hidden">Toggle color theme</span>
  </button>
</template>

<style scoped lang="scss">
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  font-size: var(--font-size-lg);
  background-color: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  transition:
    background-color var(--transition-fast),
    transform var(--transition-fast);

  &:hover {
    background-color: var(--color-surface-alt);
  }

  &:active {
    transform: scale(0.92);
  }
}
</style>
