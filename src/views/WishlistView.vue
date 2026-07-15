<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import ProductCard from '@/components/ProductCard.vue'

const wishlist = useWishlistStore()
const cart = useCartStore()
</script>

<template>
  <section class="wishlist">
    <h1 class="wishlist__title">Your wishlist</h1>

    <div v-if="wishlist.count === 0" class="wishlist__empty">
      <p>Your wishlist is empty.</p>
      <RouterLink to="/" class="btn btn--primary">Browse products</RouterLink>
    </div>

    <ul v-else class="grid">
      <li v-for="product in wishlist.items" :key="product.id" class="wishlist__cell">
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
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.wishlist {
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

  &__cell {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  &__actions {
    display: flex;
    gap: var(--space-2);

    .btn {
      flex: 1;
      padding-inline: var(--space-2);
    }
  }
}

.grid {
  list-style: none;
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(2, 1fr);

  @include respond('md') {
    grid-template-columns: repeat(3, 1fr);
  }

  @include respond('lg') {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
