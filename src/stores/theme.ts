import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Theme } from '@/types'

const STORAGE_KEY = 'qubica-theme'

/** Resolve the initial theme: persisted choice > OS preference > light. */
function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === 'light' || stored === 'dark') return stored
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('light')

  function apply(next: Theme): void {
    theme.value = next
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  function init(): void {
    apply(getInitialTheme())
  }

  function toggle(): void {
    apply(theme.value === 'dark' ? 'light' : 'dark')
  }

  return { theme, init, toggle }
})
