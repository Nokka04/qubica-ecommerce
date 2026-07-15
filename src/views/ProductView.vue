<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchProductById } from '@/api/products'
import { useAsyncData } from '@/composables/useAsyncData'
import type { Product } from '@/types'
import { formatPrice } from '@/utils/format'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import BaseSpinner from '@/components/BaseSpinner.vue'
import ErrorModal from '@/components/ErrorModal.vue'

const props = defineProps<{ id: string }>()
const router = useRouter()
const cart = useCartStore()
const wishlist = useWishlistStore()

const { data: product, loading, error, run } = useAsyncData<Product>()

// Brief confirmation shown after adding to cart.
const added = ref(false)
let addedTimer: ReturnType<typeof setTimeout> | undefined

function addToCart(item: Product): void {
  cart.addItem(item)
  added.value = true
  clearTimeout(addedTimer)
  addedTimer = setTimeout(() => (added.value = false), 1800)
}

function load(): void {
  run(() => fetchProductById(Number(props.id)))
}

watch(() => props.id, load, { immediate: true })
</script>

<template>
  <section class="product">
    <button type="button" class="product__back btn btn--ghost" @click="router.back()">
      ← Back
    </button>

    <BaseSpinner v-if="loading" label="Loading product…" />

    <article v-else-if="product" class="product__detail">
      <div class="product__media">
        <img
          :src="product.image"
          :alt="product.title"
          class="product__image"
          width="400"
          height="400"
        />
      </div>

      <div class="product__info">
        <span class="product__category">{{ product.category }}</span>
        <h1 class="product__title">{{ product.title }}</h1>
        <div class="product__meta">
          <span class="product__price">{{ formatPrice(product.price) }}</span>
          <span class="product__rating">
            ★ {{ product.rating.rate }}
            <span class="product__rating-count">({{ product.rating.count }} reviews)</span>
          </span>
        </div>
        <p class="product__description">{{ product.description }}</p>

        <div class="product__actions">
          <button type="button" class="btn btn--primary" @click="addToCart(product)">
            {{ added ? 'Added ✓' : 'Add to cart' }}
          </button>
          <button
            type="button"
            class="btn btn--ghost"
            :aria-pressed="wishlist.has(product.id)"
            @click="wishlist.toggle(product)"
          >
            {{ wishlist.has(product.id) ? '♥ In wishlist' : '♡ Add to wishlist' }}
          </button>
        </div>
      </div>
    </article>

    <ErrorModal
      :open="!!error && !loading"
      :message="error ?? undefined"
      @retry="load"
      @close="router.push('/')"
    />
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.product {
  &__back {
    margin-bottom: var(--space-5);
  }

  &__detail {
    display: grid;
    gap: var(--space-6);

    @include respond('md') {
      grid-template-columns: 1fr 1fr;
      align-items: start;
    }
  }

  &__media {
    background-color: #ffffff;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    display: grid;
    place-items: center;
  }

  &__image {
    max-height: 420px;
    width: auto;
    object-fit: contain;
    mix-blend-mode: multiply;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  &__category {
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
  }

  &__title {
    font-size: var(--font-size-2xl);
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: var(--space-5);
  }

  &__price {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--color-primary);
  }

  &__rating {
    color: var(--color-accent);
    font-weight: 600;
  }

  &__rating-count {
    color: var(--color-text-muted);
    font-weight: 400;
    font-size: var(--font-size-sm);
  }

  &__description {
    color: var(--color-text-muted);
    line-height: 1.7;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-top: var(--space-2);
  }
}
</style>
