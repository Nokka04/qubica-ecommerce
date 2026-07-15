<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import ProductCard from '@/components/ProductCard.vue'
import AppFooter from '@/components/AppFooter.vue'

const wishlist = useWishlistStore()
const cart = useCartStore()
</script>

<template>
  <section class="wishlist">
    <div class="wishlist__head">
      <h1 class="wishlist__title">Wishlist</h1>
    </div>

    <div v-if="wishlist.count === 0" class="wishlist__empty">
      <p>Your wishlist is empty.</p>
      <RouterLink to="/" class="btn btn--primary">Browse products</RouterLink>
    </div>

    <ul v-else class="grid">
      <li v-for="product in wishlist.items" :key="product.id" class="grid__cell">
        <ProductCard :product="product" />
        <div class="wishlist__actions">
          <button type="button" class="btn btn--primary" @click="cart.addItem(product)">
            Add to cart
          </button>
          <button type="button" class="btn btn--ghost" @click="wishlist.remove(product.id)">
            Remove
          </button>
        </div>
      </li>
    </ul>

    <AppFooter />
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.wishlist {
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

  &__actions {
    display: flex;
    gap: var(--space-2);
    margin-top: var(--space-3);

    .btn {
      flex: 1;
      padding-inline: var(--space-2);
    }
  }
}

.grid {
  list-style: none;
  display: grid;
  gap: var(--space-6) var(--pad);
  padding-bottom: var(--space-8);
  grid-template-columns: repeat(2, 1fr);

  @include respond('md') {
    grid-template-columns: repeat(3, 1fr);
  }

  @include respond('lg') {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
