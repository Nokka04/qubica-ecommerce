<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/format'

const cart = useCartStore()
</script>

<template>
  <section class="cart">
    <h1 class="cart__title">Your cart</h1>

    <div v-if="cart.isEmpty" class="cart__empty">
      <p>Your cart is empty.</p>
      <RouterLink to="/" class="btn btn--primary">Browse products</RouterLink>
    </div>

    <div v-else class="cart__layout">
      <ul class="cart__items">
        <li v-for="item in cart.items" :key="item.product.id" class="cart-item">
          <img
            :src="item.product.image"
            :alt="item.product.title"
            class="cart-item__image"
            width="80"
            height="80"
          />
          <div class="cart-item__info">
            <RouterLink
              :to="{ name: 'product', params: { id: item.product.id } }"
              class="cart-item__name"
            >
              {{ item.product.title }}
            </RouterLink>
            <span class="cart-item__price">{{ formatPrice(item.product.price) }}</span>
          </div>

          <div class="cart-item__qty">
            <button
              type="button"
              class="qty-btn"
              aria-label="Decrease quantity"
              @click="cart.updateQuantity(item.product.id, item.quantity - 1)"
            >
              −
            </button>
            <span class="cart-item__count" aria-live="polite">{{ item.quantity }}</span>
            <button
              type="button"
              class="qty-btn"
              aria-label="Increase quantity"
              @click="cart.updateQuantity(item.product.id, item.quantity + 1)"
            >
              +
            </button>
          </div>

          <span class="cart-item__subtotal">
            {{ formatPrice(item.product.price * item.quantity) }}
          </span>

          <button
            type="button"
            class="cart-item__remove"
            aria-label="Remove item"
            @click="cart.removeItem(item.product.id)"
          >
            ✕
          </button>
        </li>
      </ul>

      <aside class="cart__summary">
        <h2 class="cart__summary-title">Summary</h2>
        <div class="cart__summary-row">
          <span>Items</span>
          <span>{{ cart.count }}</span>
        </div>
        <div class="cart__summary-row cart__summary-row--total">
          <span>Total</span>
          <span>{{ formatPrice(cart.totalPrice) }}</span>
        </div>
        <button type="button" class="btn btn--primary cart__checkout" @click="cart.clear()">
          Checkout
        </button>
        <button type="button" class="btn btn--ghost" @click="cart.clear()">Clear cart</button>
      </aside>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.cart {
  &__title {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-5);
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
    padding-block: var(--space-8);
    color: var(--color-text-muted);
  }

  &__layout {
    display: grid;
    gap: var(--space-6);

    @include respond('lg') {
      grid-template-columns: 1fr 320px;
      align-items: start;
    }
  }

  &__items {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  &__summary {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    position: sticky;
    top: calc(var(--header-height) + var(--space-4));
  }

  &__summary-title {
    font-size: var(--font-size-lg);
  }

  &__summary-row {
    display: flex;
    justify-content: space-between;
    color: var(--color-text-muted);

    &--total {
      color: var(--color-text);
      font-weight: 700;
      font-size: var(--font-size-lg);
      border-top: 1px solid var(--color-border);
      padding-top: var(--space-3);
    }
  }

  &__checkout {
    margin-top: var(--space-2);
  }
}

.cart-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);

  @include respond('md') {
    grid-template-columns: auto 1fr auto auto auto;
  }

  &__image {
    width: 64px;
    height: 64px;
    object-fit: contain;
    background-color: #fff;
    border-radius: var(--radius-sm);
    padding: var(--space-1);
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    min-width: 0;
  }

  &__name {
    font-weight: 600;
    font-size: var(--font-size-sm);
    @include line-clamp(2);

    &:hover {
      color: var(--color-primary);
    }
  }

  &__price {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  &__qty {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
  }

  &__count {
    min-width: 1.5rem;
    text-align: center;
    font-weight: 600;
  }

  &__subtotal {
    font-weight: 700;
    color: var(--color-primary);
    grid-column: 2 / 3;

    @include respond('md') {
      grid-column: auto;
    }
  }

  &__remove {
    background: transparent;
    border: none;
    color: var(--color-text-muted);
    font-size: var(--font-size-base);
    padding: var(--space-2);

    &:hover {
      color: var(--color-danger);
    }
  }
}

.qty-btn {
  width: 1.75rem;
  height: 1.75rem;
  display: grid;
  place-items: center;
  background-color: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  line-height: 1;

  &:hover {
    border-color: var(--color-primary);
  }
}
</style>
