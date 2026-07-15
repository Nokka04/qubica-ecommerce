import { http } from './http'
import type { Product } from '@/types'

/** Fetch every product in the catalog. */
export async function fetchProducts(): Promise<Product[]> {
  const { data } = await http.get<Product[]>('/products')
  return data
}

/** Fetch a single product by its id. */
export async function fetchProductById(id: number): Promise<Product> {
  const { data } = await http.get<Product>(`/products/${id}`)
  return data
}

/** Fetch the products belonging to a specific category. */
export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const { data } = await http.get<Product[]>(
    `/products/category/${encodeURIComponent(category)}`,
  )
  return data
}
