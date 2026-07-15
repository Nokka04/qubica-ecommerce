import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { Product } from '@/types'

const STORAGE_KEY = 'qubica-wishlist'

function loadInitial(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Product[]) : []
  } catch {
    return []
  }
}

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<Product[]>(loadInitial())

  const count = computed(() => items.value.length)

  function has(productId: number): boolean {
    return items.value.some((product) => product.id === productId)
  }

  function toggle(product: Product): void {
    if (has(product.id)) {
      items.value = items.value.filter((entry) => entry.id !== product.id)
    } else {
      items.value.push(product)
    }
  }

  function remove(productId: number): void {
    items.value = items.value.filter((entry) => entry.id !== productId)
  }

  watch(
    items,
    (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)),
    { deep: true },
  )

  return { items, count, has, toggle, remove }
})
