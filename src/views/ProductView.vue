<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchProductById, fetchProductsByCategory } from '@/api/products'
import { useAsyncData } from '@/composables/useAsyncData'
import type { Product } from '@/types'
import { formatPrice } from '@/utils/format'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { gsap } from '@/composables/gsap'
import SplitType from 'split-type'
import BaseSpinner from '@/components/BaseSpinner.vue'
import ErrorModal from '@/components/ErrorModal.vue'
import AppFooter from '@/components/AppFooter.vue'

const props = defineProps<{ id: string }>()
const router = useRouter()
const cart = useCartStore()
const wishlist = useWishlistStore()

const { data: product, loading, error, run } = useAsyncData<Product>()
const related = ref<Product[]>([])
const added = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const descriptionRef = ref<HTMLElement | null>(null)
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

async function loadRelated(current: Product): Promise<void> {
  try {
    const list = await fetchProductsByCategory(current.category)
    related.value = list.filter((p) => p.id !== current.id).slice(0, 4)
  } catch {
    related.value = []
  }
}

watch(() => props.id, load, { immediate: true })

watch(
  () => product.value,
  async (p) => {
    if (!p) return
    void loadRelated(p)
    await nextTick()
    animateIn()
  },
)

function animateIn(): void {
  const root = containerRef.value
  if (!root) return

  gsap.set(root.querySelectorAll('.info-item .reveal-line'), { y: '105%' })

  const tl = gsap.timeline({ defaults: { ease: 'power3.out', delay: 0.4 } })
  tl.to(root.querySelectorAll('.info-item .reveal-line'), {
    y: '0%',
    duration: 0.75,
    stagger: 0.05,
  })

  if (descriptionRef.value) {
    const split = new SplitType(descriptionRef.value, { types: 'lines', lineClass: 'line' })
    split.lines?.forEach((line) => {
      line.innerHTML = `<span>${line.innerHTML}</span>`
    })
    gsap.set('#product-description .line span', { y: '100%', display: 'block' })
    // Lines are now masked, so it's safe to reveal the paragraph itself
    // (it starts at opacity 0 to avoid a flash of raw, unmasked text).
    gsap.set(descriptionRef.value, { opacity: 1 })
    tl.to(
      '#product-description .line span',
      { y: '0%', duration: 0.75, stagger: 0.08 },
      '-=1.5',
    )
  }

  tl.fromTo(
    root.querySelectorAll('.product-detail-img'),
    { y: 200, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.1 },
    '-=1.5',
  )
}
</script>

<template>
  <section ref="containerRef" class="product">
    <button type="button" class="product__back" @click="router.back()">← Back</button>

    <BaseSpinner v-if="loading" label="Loading product…" />

    <template v-else-if="product">
      <div class="product-detail-container">
        <div class="product-detail-copy">
          <div class="info-row">
            <div class="info-item">
              <div class="revealer"><p class="reveal-line label-muted">ID</p></div>
              <div class="revealer"><p class="reveal-line">{{ String(product.id).padStart(3, '0') }}</p></div>
            </div>
            <div class="info-item">
              <div class="revealer"><p class="reveal-line label-muted">Category</p></div>
              <div class="revealer"><p class="reveal-line">{{ product.category }}</p></div>
            </div>
            <div class="info-item">
              <div class="revealer"><p class="reveal-line label-muted">Rating</p></div>
              <div class="revealer"><p class="reveal-line">{{ product.rating.rate }} / 5</p></div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <div class="revealer"><p class="reveal-line label-muted">Name</p></div>
              <div class="revealer"><p class="reveal-line">{{ product.title }}</p></div>
            </div>
            <div class="info-item">
              <div class="revealer"><p class="reveal-line label-muted">Reviews</p></div>
              <div class="revealer"><p class="reveal-line">{{ product.rating.count }}</p></div>
            </div>
            <div class="info-item">
              <div class="revealer"><p class="reveal-line label-muted">Price</p></div>
              <div class="revealer"><p class="reveal-line">{{ formatPrice(product.price) }}</p></div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item info-item--wide">
              <div class="revealer"><p class="reveal-line label-muted">Info</p></div>
              <p id="product-description" ref="descriptionRef" class="product__description">
                {{ product.description }}
              </p>
            </div>
          </div>

          <div class="info-row product__actions">
            <button type="button" class="btn btn--primary" @click="addToCart(product)">
              {{ added ? 'Added ✓' : 'Add to cart' }}
            </button>
            <button
              type="button"
              class="btn btn--ghost"
              :aria-pressed="wishlist.has(product.id)"
              @click="wishlist.toggle(product)"
            >
              {{ wishlist.has(product.id) ? '♥ In wishlist' : '♡ Wishlist' }}
            </button>
          </div>
        </div>

        <div class="product-detail-images">
          <div class="product-detail-img">
            <img :src="product.image" :alt="product.title" />
          </div>
        </div>
      </div>

      <div v-if="related.length" class="more-products">
        <div class="more-products__header">
          <p class="label-muted">Related products</p>
        </div>
        <ul class="more-products__list">
          <li v-for="rel in related" :key="rel.id">
            <RouterLink :to="{ name: 'product', params: { id: rel.id } }" class="related">
              <div class="related__media"><img :src="rel.image" :alt="rel.title" /></div>
              <div class="related__info">
                <p class="related__name">{{ rel.title }}</p>
                <p class="related__price">{{ formatPrice(rel.price) }}</p>
              </div>
            </RouterLink>
          </li>
        </ul>
      </div>

      <AppFooter />
    </template>

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
  padding: var(--pad);
  background-color: var(--color-bg);
}

.product__back {
  position: fixed;
  top: 3.25rem;
  right: var(--pad);
  z-index: 15;
  text-transform: uppercase;
  font-size: var(--font-size-label);
  letter-spacing: var(--letter-label);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.label-muted {
  color: var(--color-muted);
}

.product-detail-container {
  margin: 25vh 0 var(--space-8);
  display: flex;
  gap: var(--pad);

  @media (max-width: 767px) {
    flex-direction: column;
  }
}

.product-detail-copy {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: var(--pad);
}

.product-detail-images {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--pad);
}

.product-detail-img {
  width: 100%;
  aspect-ratio: 5 / 7;
  background-color: #fff;
  overflow: hidden;
  will-change: transform, opacity;

  img {
    object-fit: contain;
    padding: 8%;
    mix-blend-mode: multiply;
  }
}

.info-row {
  display: flex;
  gap: var(--pad);

  @media (max-width: 767px) {
    flex-direction: column;
  }
}

.info-item {
  flex: 1;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35em;

  &--wide {
    flex: 2;
  }

  // Let long values wrap inside a full-width mask instead of overflowing.
  .revealer {
    width: 100%;
    max-width: 100%;
  }

  .reveal-line {
    text-transform: uppercase;
    font-size: var(--font-size-label);
    font-weight: 600;
    letter-spacing: var(--letter-label);
    white-space: normal;
  }
}

.product__description {
  opacity: 0; // revealed by GSAP once split into masked lines
  text-transform: uppercase;
  font-size: var(--font-size-label);
  font-weight: 600;
  letter-spacing: var(--letter-label);
  line-height: 1.5;
  max-width: 60ch;

  :deep(.line) {
    position: relative;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }

  :deep(.line span) {
    display: block;
    will-change: transform;
  }
}

.product__actions {
  margin-top: var(--space-5);
  gap: var(--space-3);
  flex-wrap: wrap;
}

.more-products {
  margin-top: var(--space-8);

  &__header {
    margin-bottom: var(--pad);
  }

  &__list {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-5) var(--pad);
    padding-bottom: 15vh;

    @include respond('md') {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

.related {
  display: block;

  &__media {
    width: 100%;
    aspect-ratio: 5 / 7;
    background-color: #fff;
    overflow: hidden;
    margin-bottom: 0.5em;

    img {
      object-fit: contain;
      padding: 8%;
      mix-blend-mode: multiply;
    }
  }

  &__info {
    display: flex;
    justify-content: space-between;
    gap: var(--space-2);
  }

  &__name {
    text-transform: uppercase;
    font-size: var(--font-size-label);
    font-weight: 600;
    letter-spacing: var(--letter-label);
    @include line-clamp(1);
  }

  &__price {
    text-transform: uppercase;
    font-size: var(--font-size-label);
    font-weight: 600;
    letter-spacing: var(--letter-label);
  }
}
</style>
