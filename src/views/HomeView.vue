<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchProducts, fetchProductsByCategory } from '@/api/products'
import { fetchCategories } from '@/api/categories'
import { useAsyncData } from '@/composables/useAsyncData'
import type { Category, Product } from '@/types'
import { formatCategoryLabel } from '@/utils/format'
import { gsap } from '@/composables/gsap'
import ProductCard from '@/components/ProductCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import ErrorModal from '@/components/ErrorModal.vue'
import AppFooter from '@/components/AppFooter.vue'

const route = useRoute()
const { data: products, loading, error, run } = useAsyncData<Product[]>()
const categories = ref<Category[]>([])
const gridRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

function revealHeading(): void {
  const line = titleRef.value?.querySelector('.reveal-line')
  if (!line) return
  gsap.fromTo(
    line,
    { y: '110%' },
    { y: '0%', duration: 1.2, ease: 'hop', delay: 0.35 },
  )
}

onMounted(revealHeading)

/** Active category comes straight from the URL query, enabling deep links & refresh. */
const activeCategory = computed(() =>
  typeof route.query.category === 'string' ? route.query.category : null,
)

const heading = computed(() =>
  activeCategory.value ? formatCategoryLabel(activeCategory.value) : 'All Products',
)

function load(): void {
  run(() =>
    activeCategory.value
      ? fetchProductsByCategory(activeCategory.value)
      : fetchProducts(),
  )
}

watch(activeCategory, load, { immediate: true })

// Replay the heading reveal whenever the (category) title changes.
watch(heading, async () => {
  await nextTick()
  revealHeading()
})

// Reveal the product grid once data has rendered.
watch(
  () => products.value,
  async (list) => {
    if (!list || list.length === 0) return
    await nextTick()
    const cards = gridRef.value?.querySelectorAll('.grid__cell')
    if (!cards?.length) return
    gsap.fromTo(
      cards,
      { y: 120, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.06,
        delay: 0.3,
      },
    )
  },
)

;(async () => {
  try {
    categories.value = await fetchCategories()
  } catch {
    categories.value = []
  }
})()

function dismissError(): void {
  error.value = null
}
</script>

<template>
  <section class="home">
    <header class="home__hero">
      <h1 ref="titleRef" class="home__title revealer">
        <span class="reveal-line">{{ heading }}</span>
      </h1>

      <nav class="home__filters" aria-label="Filter by category">
        <RouterLink
          to="/"
          class="home__filter"
          :class="{ 'is-active': !activeCategory }"
        >
          All
        </RouterLink>
        <RouterLink
          v-for="category in categories"
          :key="category"
          :to="{ path: '/', query: { category } }"
          class="home__filter"
          :class="{ 'is-active': activeCategory === category }"
        >
          {{ formatCategoryLabel(category) }}
        </RouterLink>
      </nav>
    </header>

    <!-- Loading state -->
    <ul v-if="loading" class="grid" aria-hidden="true">
      <li v-for="n in 8" :key="n" class="grid__cell">
        <SkeletonCard />
      </li>
    </ul>

    <!-- Empty state -->
    <p v-else-if="products && products.length === 0" class="home__empty">
      No products found for this category.
    </p>

    <!-- Loaded grid -->
    <ul v-else-if="products" ref="gridRef" class="grid">
      <li v-for="product in products" :key="product.id" class="grid__cell">
        <ProductCard :product="product" />
      </li>
    </ul>

    <AppFooter />

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
  background-color: var(--color-bg);

  &__hero {
    padding: 25vh var(--pad) var(--space-6);
  }

  &__title {
    // Fill the available width (overrides .revealer's max-content) so long
    // category labels wrap instead of forcing a horizontal scroll.
    width: 100%;
    max-width: 100%;
    font-size: clamp(2rem, 8vw, 7rem);
    line-height: 0.9;
    letter-spacing: -0.03em;
    margin-bottom: var(--space-5);
    overflow-wrap: break-word;
  }

  &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
    border-top: 1px solid var(--color-line);
    padding-top: var(--space-4);
  }

  &__filter {
    text-transform: uppercase;
    font-size: var(--font-size-label);
    font-weight: 600;
    letter-spacing: var(--letter-label);
    color: var(--color-muted);
    padding-bottom: 2px;
    border-bottom: 1px solid transparent;
    transition: color var(--transition-fast);

    &:hover {
      color: var(--color-fg);
    }

    &.is-active {
      color: var(--color-fg);
      border-bottom-color: var(--color-fg);
    }
  }

  &__empty {
    padding: var(--space-8) var(--pad);
    text-transform: uppercase;
    font-size: var(--font-size-label);
    letter-spacing: var(--letter-label);
    color: var(--color-muted);
  }
}

.grid {
  list-style: none;
  display: grid;
  gap: var(--space-5) var(--pad);
  padding: 0 var(--pad) var(--space-8);
  grid-template-columns: repeat(2, 1fr);

  @include respond('md') {
    grid-template-columns: repeat(3, 1fr);
  }

  @include respond('lg') {
    grid-template-columns: repeat(4, 1fr);
  }

  &__cell {
    will-change: transform, opacity;
  }
}
</style>
