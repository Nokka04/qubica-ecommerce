import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Theme } from '@/types'

const STORAGE_KEY = 'qubica-theme'

function readInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(readInitialTheme())

  function apply(): void {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  function set(next: Theme): void {
    theme.value = next
    localStorage.setItem(STORAGE_KEY, next)
    apply()
  }

  function toggle(): void {
    set(theme.value === 'dark' ? 'light' : 'dark')
  }

  // Keep the DOM in sync with the initial value (the inline script in
  // index.html already handles the very first paint to avoid a flash).
  apply()

  return { theme, set, toggle }
})
