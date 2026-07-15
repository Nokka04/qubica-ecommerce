<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Product } from '@/types'
import { formatPrice } from '@/utils/format'

defineProps<{ product: Product }>()
</script>

<template>
  <article class="card">
    <RouterLink
      :to="{ name: 'product', params: { id: product.id } }"
      class="card__link"
    >
      <div class="card__media">
        <img
          :src="product.image"
          :alt="product.title"
          class="card__image"
          loading="lazy"
          width="240"
          height="240"
        />
      </div>
      <div class="card__body">
        <span class="card__category">{{ product.category }}</span>
        <h3 class="card__title">{{ product.title }}</h3>
        <div class="card__footer">
          <span class="card__price">{{ formatPrice(product.price) }}</span>
          <span
            class="card__rating"
            :aria-label="`Rated ${product.rating.rate} out of 5`"
          >
            ★ {{ product.rating.rate }}
          </span>
        </div>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.card {
  height: 100%;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition:
    transform var(--transition-base),
    box-shadow var(--transition-base),
    border-color var(--transition-base);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary);
  }

  &__link {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__media {
    aspect-ratio: 1 / 1;
    background-color: #ffffff;
    padding: var(--space-5);
    display: grid;
    place-items: center;
  }

  &__image {
    max-height: 100%;
    width: auto;
    object-fit: contain;
    mix-blend-mode: multiply;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-4);
    flex: 1;
  }

  &__category {
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
  }

  &__title {
    font-size: var(--font-size-sm);
    font-weight: 600;
    @include line-clamp(2);
    flex: 1;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: var(--space-2);
  }

  &__price {
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--color-primary);
  }

  &__rating {
    font-size: var(--font-size-sm);
    color: var(--color-accent);
  }
}
</style>
