import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { login as loginRequest } from '@/api/auth'
import { createUser, findUserByUsername } from '@/api/users'
import type { LoginCredentials, NewUser, User } from '@/types'

const TOKEN_KEY = 'qubica-token'
const USER_KEY = 'qubica-user'
const PROFILE_KEY = 'qubica-profile'

function readProfile(): User | null {
  const raw = localStorage.getItem(PROFILE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const username = ref<string | null>(localStorage.getItem(USER_KEY))
  const user = ref<User | null>(readProfile())

  const isAuthenticated = computed(() => token.value !== null)
  const displayName = computed(() =>
    user.value ? user.value.name.firstname : (username.value ?? ''),
  )

  async function login(credentials: LoginCredentials): Promise<void> {
    const { token: newToken } = await loginRequest(credentials)
    token.value = newToken
    username.value = credentials.username
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, credentials.username)

    // Resolve the full profile (best-effort — a failure must not break login).
    try {
      const profile = await findUserByUsername(credentials.username)
      user.value = profile
      if (profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
      else localStorage.removeItem(PROFILE_KEY)
    } catch {
      user.value = null
      localStorage.removeItem(PROFILE_KEY)
    }
  }

  /** Register a new account (demo — see api/users.createUser caveat). */
  async function register(payload: NewUser): Promise<{ id: number }> {
    return createUser(payload)
  }

  function logout(): void {
    token.value = null
    username.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(PROFILE_KEY)
  }

  return { token, username, user, isAuthenticated, displayName, login, register, logout }
})
