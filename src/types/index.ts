// =============================================================
// Domain types — strongly typed Fake Store API contracts
// https://fakestoreapi.com/docs
// =============================================================

export interface ProductRating {
  rate: number
  count: number
}

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: ProductRating
}

/** Categories are returned by the API as a plain list of strings. */
export type Category = string

export interface CartItem {
  product: Product
  quantity: number
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
}

export type Theme = 'light' | 'dark'
