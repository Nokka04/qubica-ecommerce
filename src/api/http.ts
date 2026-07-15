import axios, { type AxiosInstance } from 'axios'

/**
 * Shared Axios instance pointing at the Fake Store API.
 * Centralizing the client keeps base URL, timeout and interceptors in one place.
 */
export const http: AxiosInstance = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})
