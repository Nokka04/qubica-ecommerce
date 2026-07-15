import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { CartItem, Product } from '@/types'

const STORAGE_KEY = 'qubica-cart'

function loadInitial(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadInitial())

  const count = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  )
  const isEmpty = computed(() => items.value.length === 0)

  function addItem(product: Product, quantity = 1): void {
    const existing = items.value.find((item) => item.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
  }

  function removeItem(productId: number): void {
    items.value = items.value.filter((item) => item.product.id !== productId)
  }

  function updateQuantity(productId: number, quantity: number): void {
    const item = items.value.find((entry) => entry.product.id === productId)
    if (!item) return
    if (quantity <= 0) {
      removeItem(productId)
    } else {
      item.quantity = quantity
    }
  }

  function clear(): void {
    items.value = []
  }

  // Persist cart across reloads.
  watch(
    items,
    (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)),
    { deep: true },
  )

  return { items, count, totalPrice, isEmpty, addItem, removeItem, updateQuantity, clear }
})
