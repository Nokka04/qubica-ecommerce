<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/format'
import AppFooter from '@/components/AppFooter.vue'

const cart = useCartStore()
const ordered = ref(false)

// Demo checkout: the exercise has no real payment flow, so we confirm the
// order and empty the bag (rather than silently clearing it).
function checkout(): void {
  if (cart.isEmpty) return
  cart.clear()
  ordered.value = true
}
</script>

<template>
  <section class="cart">
    <div class="cart__head">
      <h1 class="cart__title">Bag</h1>
    </div>

    <div v-if="ordered" class="cart__empty">
      <p>Order placed — thank you for your purchase.</p>
      <RouterLink to="/" class="btn btn--primary">Continue shopping</RouterLink>
    </div>

    <div v-else-if="cart.isEmpty" class="cart__empty">
      <p>Your bag is empty.</p>
      <RouterLink to="/" class="btn btn--primary">Browse products</RouterLink>
    </div>

    <div v-else class="cart__layout">
      <ul class="cart__items">
        <li v-for="item in cart.items" :key="item.product.id" class="cart-item">
          <div class="cart-item__img">
            <img :src="item.product.image" :alt="item.product.title" />
          </div>
          <div class="cart-item__info">
            <div class="cart-item__row">
              <RouterLink
                :to="{ name: 'product', params: { id: item.product.id } }"
                class="cart-item__name"
              >
                {{ item.product.title }}
              </RouterLink>
              <span class="cart-item__price">{{ formatPrice(item.product.price) }}</span>
            </div>
            <div class="cart-item__row">
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
              <button
                type="button"
                class="cart-item__remove"
                @click="cart.removeItem(item.product.id)"
              >
                Remove
              </button>
            </div>
          </div>
        </li>
      </ul>

      <aside class="cart__summary">
        <div class="cart__summary-row">
          <span>Items</span>
          <span>{{ cart.count }}</span>
        </div>
        <div class="cart__summary-row">
          <span>Shipping</span>
          <span>At checkout</span>
        </div>
        <div class="cart__summary-row cart__summary-row--total">
          <span>Subtotal</span>
          <span>{{ formatPrice(cart.totalPrice) }}</span>
        </div>
        <button type="button" class="btn btn--primary cart__checkout" @click="checkout">
          Checkout
        </button>
        <button type="button" class="btn btn--ghost" @click="cart.clear()">Clear bag</button>
      </aside>
    </div>

    <AppFooter />
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.cart {
  padding: 8rem var(--pad) 0;
  background-color: var(--color-bg);

  &__head {
    border-bottom: 1px solid var(--color-line);
    padding-bottom: var(--pad);
    margin-bottom: var(--space-6);
  }

  &__title {
    font-size: clamp(2.5rem, 8vw, 5rem);
    line-height: 0.9;
    letter-spacing: -0.02em;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
    padding-block: var(--space-8);
    text-transform: uppercase;
    font-size: var(--font-size-label);
    letter-spacing: var(--letter-label);
    color: var(--color-muted);
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
  }

  &__summary {
    border: 1px solid var(--color-fg);
    padding: var(--pad);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    position: sticky;
    top: 6rem;
  }

  &__summary-row {
    display: flex;
    justify-content: space-between;
    text-transform: uppercase;
    font-size: var(--font-size-label);
    font-weight: 600;
    letter-spacing: var(--letter-label);

    &--total {
      border-top: 1px solid var(--color-line);
      padding-top: var(--space-3);
    }
  }

  &__checkout {
    margin-top: var(--space-2);
  }
}

.cart-item {
  display: flex;
  gap: var(--pad);
  padding: var(--pad) 0;
  border-bottom: 1px solid var(--color-line);

  &__img {
    width: 84px;
    height: 84px;
    flex-shrink: 0;
    background-color: #fff;
    overflow: hidden;

    img {
      object-fit: contain;
      padding: 8%;
      mix-blend-mode: multiply;
    }
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--space-3);
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--pad);
  }

  &__name {
    text-transform: uppercase;
    font-size: var(--font-size-label);
    font-weight: 600;
    letter-spacing: var(--letter-label);
    @include line-clamp(2);
  }

  &__price {
    text-transform: uppercase;
    font-size: var(--font-size-label);
    font-weight: 600;
    letter-spacing: var(--letter-label);
    white-space: nowrap;
  }

  &__qty {
    display: inline-flex;
    align-items: center;
    gap: var(--space-3);
  }

  &__count {
    min-width: 1.5rem;
    text-align: center;
    font-size: var(--font-size-label);
    font-weight: 600;
  }

  &__remove {
    text-transform: uppercase;
    font-size: var(--font-size-label);
    font-weight: 600;
    letter-spacing: var(--letter-label);
    text-decoration: underline;
    color: var(--color-muted);

    &:hover {
      color: var(--color-fg);
    }
  }
}

.qty-btn {
  width: 1.75rem;
  height: 1.75rem;
  display: grid;
  place-items: center;
  border: 1px solid var(--color-fg);
  font-size: var(--font-size-base);
  line-height: 1;

  &:hover {
    background-color: var(--color-fg);
    color: var(--color-bg);
  }
}
</style>
