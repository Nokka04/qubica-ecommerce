<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { fetchCategories } from '@/api/categories'
import { formatCategoryLabel } from '@/utils/format'
import type { Category } from '@/types'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from './ThemeToggle.vue'

const categories = ref<Category[]>([])
const loading = ref(true)

const cart = useCartStore()
const wishlist = useWishlistStore()
const auth = useAuthStore()
const router = useRouter()

function onLogout(): void {
  auth.logout()
  router.push('/')
}

onMounted(async () => {
  try {
    categories.value = await fetchCategories()
  } catch {
    // A failed category fetch should not crash the header; nav simply stays minimal.
    categories.value = []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <RouterLink to="/" class="header__brand" aria-label="QubicaStore home">
        <span class="header__logo" aria-hidden="true">Q</span>
        <span class="header__name">QubicaStore</span>
      </RouterLink>

      <nav class="header__nav" aria-label="Product categories">
        <ul class="header__nav-list">
          <li>
            <RouterLink
              to="/"
              class="header__nav-link"
              :class="{ 'is-active': !$route.query.category }"
            >
              All
            </RouterLink>
          </li>
          <li v-for="category in categories" :key="category">
            <RouterLink
              :to="{ path: '/', query: { category } }"
              class="header__nav-link"
              :class="{ 'is-active': $route.query.category === category }"
            >
              {{ formatCategoryLabel(category) }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="header__actions">
        <RouterLink
          to="/wishlist"
          class="header__icon-btn"
          :aria-label="`Wishlist, ${wishlist.count} items`"
        >
          <span aria-hidden="true">♥</span>
          <span v-if="wishlist.count" class="header__badge">{{ wishlist.count }}</span>
        </RouterLink>

        <RouterLink
          to="/cart"
          class="header__icon-btn"
          :aria-label="`Cart, ${cart.count} items`"
        >
          <span aria-hidden="true">🛒</span>
          <span v-if="cart.count" class="header__badge">{{ cart.count }}</span>
        </RouterLink>

        <ThemeToggle />

        <template v-if="auth.isAuthenticated">
          <span class="header__user">Hi, {{ auth.username }}</span>
          <button type="button" class="btn btn--ghost header__auth-btn" @click="onLogout">
            Logout
          </button>
        </template>
        <RouterLink v-else to="/login" class="btn btn--primary header__auth-btn">
          Login
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);

  &__inner {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    min-height: var(--header-height);
    flex-wrap: wrap;
    padding-block: var(--space-2);
  }

  &__brand {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-weight: 700;
    font-size: var(--font-size-lg);
  }

  &__logo {
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    background-color: var(--color-primary);
    color: var(--color-primary-contrast);
    border-radius: var(--radius-md);
  }

  &__nav {
    flex: 1 1 100%;
    order: 3;
    overflow-x: auto;

    @include respond('lg') {
      flex: 1 1 auto;
      order: 0;
    }
  }

  &__nav-list {
    display: flex;
    gap: var(--space-2);
    list-style: none;
    padding-bottom: var(--space-1);
  }

  &__nav-link {
    display: inline-block;
    white-space: nowrap;
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-text-muted);
    border-radius: var(--radius-full);
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast);

    &:hover {
      background-color: var(--color-surface-alt);
      color: var(--color-text);
    }

    &.is-active {
      background-color: var(--color-primary);
      color: var(--color-primary-contrast);
    }
  }

  &__actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  &__icon-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    font-size: var(--font-size-lg);
    border-radius: var(--radius-full);
    transition: background-color var(--transition-fast);

    &:hover {
      background-color: var(--color-surface-alt);
    }
  }

  &__badge {
    position: absolute;
    top: -2px;
    right: -2px;
    min-width: 1.15rem;
    height: 1.15rem;
    padding: 0 0.25rem;
    display: grid;
    place-items: center;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--color-primary-contrast);
    background-color: var(--color-primary);
    border-radius: var(--radius-full);
  }

  &__user {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);

    @media (max-width: 767px) {
      display: none;
    }
  }

  &__auth-btn {
    padding: var(--space-2) var(--space-4);
  }
}
</style>
