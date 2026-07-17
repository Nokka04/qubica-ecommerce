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

/** UI colour scheme. */
export type Theme = 'light' | 'dark'

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

// ----- Users (Fake Store API /users) -----
export interface UserName {
  firstname: string
  lastname: string
}

export interface Geolocation {
  lat: string
  long: string
}

export interface UserAddress {
  city: string
  street: string
  number: number
  zipcode: string
  geolocation: Geolocation
}

export interface User {
  id: number
  email: string
  username: string
  password: string
  name: UserName
  address: UserAddress
  phone: string
}

/** Payload for creating a user (POST /users). */
export interface NewUser {
  email: string
  username: string
  password: string
  name: UserName
  phone: string
  address: Omit<UserAddress, 'geolocation'>
}
