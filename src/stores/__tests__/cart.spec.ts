import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../cart'
import type { Product } from '@/types'

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    title: 'Test product',
    price: 10,
    description: 'A product used for testing.',
    category: 'electronics',
    image: 'https://example.com/img.jpg',
    rating: { rate: 4.5, count: 10 },
    ...overrides,
  }
}

describe('cart store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('starts empty', () => {
    const cart = useCartStore()
    expect(cart.isEmpty).toBe(true)
    expect(cart.count).toBe(0)
    expect(cart.totalPrice).toBe(0)
  })

  it('adds new products and increments quantity for duplicates', () => {
    const cart = useCartStore()
    const product = makeProduct()

    cart.addItem(product)
    cart.addItem(product, 2)

    expect(cart.items).toHaveLength(1)
    expect(cart.count).toBe(3)
    expect(cart.totalPrice).toBe(30)
  })

  it('computes totals across different products', () => {
    const cart = useCartStore()
    cart.addItem(makeProduct({ id: 1, price: 10 }))
    cart.addItem(makeProduct({ id: 2, price: 25 }), 2)

    expect(cart.count).toBe(3)
    expect(cart.totalPrice).toBe(60)
  })

  it('removes an item entirely when its quantity drops to zero', () => {
    const cart = useCartStore()
    const product = makeProduct()
    cart.addItem(product, 2)

    cart.updateQuantity(product.id, 0)

    expect(cart.isEmpty).toBe(true)
  })

  it('clears the cart', () => {
    const cart = useCartStore()
    cart.addItem(makeProduct({ id: 1 }))
    cart.addItem(makeProduct({ id: 2 }))

    cart.clear()

    expect(cart.items).toHaveLength(0)
  })
})
