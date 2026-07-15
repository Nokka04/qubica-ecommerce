import { http } from './http'
import type { Category } from '@/types'

/** Fetch the list of product categories. */
export async function fetchCategories(): Promise<Category[]> {
  const { data } = await http.get<Category[]>('/products/categories')
  return data
}
