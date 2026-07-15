<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchProducts, fetchProductsByCategory } from '@/api/products'
import { useAsyncData } from '@/composables/useAsyncData'
import type { Product } from '@/types'
import { formatCategoryLabel } from '@/utils/format'
import ProductCard from '@/components/ProductCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import ErrorModal from '@/components/ErrorModal.vue'

const route = useRoute()
const { data: products, loading, error, run } = useAsyncData<Product[]>()

/** Active category comes straight from the URL query, enabling deep links & refresh. */
const activeCategory = computed(() =>
  typeof route.query.category === 'string' ? route.query.category : null,
)

const heading = computed(() =>
  activeCategory.value ? formatCategoryLabel(activeCategory.value) : 'All products',
)

function load(): void {
  run(() =>
    activeCategory.value
      ? fetchProductsByCategory(activeCategory.value)
      : fetchProducts(),
  )
}

// Re-fetch whenever the category in the URL changes (incl. initial load).
watch(activeCategory, load, { immediate: true })

function dismissError(): void {
  error.value = null
}
</script>

<template>
  <section class="home">
    <header class="home__header">
      <h1 class="home__title">{{ heading }}</h1>
      <p v-if="!loading && products" class="home__count">
        {{ products.length }} product{{ products.length === 1 ? '' : 's' }}
      </p>
    </header>

    <!-- Loading state: skeleton grid -->
    <ul v-if="loading" class="grid" aria-hidden="true">
      <li v-for="n in 8" :key="n">
        <SkeletonCard />
      </li>
    </ul>

    <!-- Empty state -->
    <p v-else-if="products && products.length === 0" class="home__empty">
      No products found for this category.
    </p>

    <!-- Loaded grid -->
    <ul v-else-if="products" class="grid">
      <li v-for="product in products" :key="product.id">
        <ProductCard :product="product" />
      </li>
    </ul>

    <ErrorModal
      :open="!!error && !loading"
      :message="error ?? undefined"
      @retry="load"
      @close="dismissError"
    />
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.home {
  &__header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-3);
    margin-bottom: var(--space-5);
  }

  &__title {
    font-size: var(--font-size-2xl);
  }

  &__count {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
  }

  &__empty {
    padding-block: var(--space-8);
    text-align: center;
    color: var(--color-text-muted);
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
