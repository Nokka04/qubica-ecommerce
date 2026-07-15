import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { login as loginRequest } from '@/api/auth'
import type { LoginCredentials } from '@/types'

const TOKEN_KEY = 'qubica-token'
const USER_KEY = 'qubica-user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const username = ref<string | null>(localStorage.getItem(USER_KEY))

  const isAuthenticated = computed(() => token.value !== null)

  async function login(credentials: LoginCredentials): Promise<void> {
    const { token: newToken } = await loginRequest(credentials)
    token.value = newToken
    username.value = credentials.username
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, credentials.username)
  }

  function logout(): void {
    token.value = null
    username.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return { token, username, isAuthenticated, login, logout }
})
