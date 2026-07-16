import { http } from './http'
import type { NewUser, User } from '@/types'

/** Fetch all users. */
export async function fetchUsers(): Promise<User[]> {
  const { data } = await http.get<User[]>('/users')
  return data
}

/** Fetch a single user by id. */
export async function fetchUserById(id: number): Promise<User> {
  const { data } = await http.get<User>(`/users/${id}`)
  return data
}

/**
 * Find a user by username. The Fake Store API `/auth/login` only returns a
 * token, so we resolve the full profile from the users list after login.
 */
export async function findUserByUsername(username: string): Promise<User | null> {
  const users = await fetchUsers()
  return users.find((u) => u.username === username) ?? null
}

/**
 * Create a new user (POST /users).
 * Note: the Fake Store API is read-only in practice — it echoes back a new id
 * but does not actually persist the account, so it cannot be logged into.
 */
export async function createUser(payload: NewUser): Promise<{ id: number }> {
  const { data } = await http.post<{ id: number }>('/users', payload)
  return data
}
