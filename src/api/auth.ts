import { http } from './http'
import type { AuthResponse, LoginCredentials } from '@/types'

/**
 * Authenticate against the Fake Store API.
 * Returns a JWT-like token on success.
 * Demo credentials: username `mor_2314`, password `83r5^_`.
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>('/auth/login', credentials)
  return data
}
