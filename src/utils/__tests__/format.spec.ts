import { describe, it, expect } from 'vitest'
import { formatPrice, formatCategoryLabel } from '../format'

describe('formatPrice', () => {
  it('formats a number as a USD currency string', () => {
    expect(formatPrice(109.95)).toBe('$109.95')
  })

  it('rounds to two decimals and adds the thousands separator', () => {
    expect(formatPrice(1999.9)).toBe('$1,999.90')
  })

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0.00')
  })
})

describe('formatCategoryLabel', () => {
  it('capitalizes each word of a multi-word category', () => {
    expect(formatCategoryLabel("men's clothing")).toBe("Men's Clothing")
  })

  it('capitalizes a single word', () => {
    expect(formatCategoryLabel('electronics')).toBe('Electronics')
  })
})
