<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Product } from '@/types'
import { formatPrice } from '@/utils/format'

defineProps<{ product: Product }>()
</script>

<template>
  <article class="card">
    <RouterLink :to="{ name: 'product', params: { id: product.id } }" class="card__link">
      <div class="card__media">
        <img
          :src="product.image"
          :alt="product.title"
          class="card__image"
          loading="lazy"
          width="300"
          height="420"
        />
      </div>
      <div class="card__info">
        <p class="card__name">{{ product.title }}</p>
        <p class="card__price">{{ formatPrice(product.price) }}</p>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.card {
  &__link {
    display: block;
  }

  &__media {
    width: 100%;
    aspect-ratio: 5 / 7;
    margin-bottom: 0.5em;
    overflow: hidden;
    background-color: #fff;

    @media (max-width: 767px) {
      aspect-ratio: 4 / 3;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 8%;
    mix-blend-mode: multiply;
    transition: transform var(--transition-base);

    .card__link:hover & {
      transform: scale(1.04);
    }
  }

  &__info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-3);
    width: 100%;
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
}
</style>
