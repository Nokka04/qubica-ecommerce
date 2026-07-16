<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import AppFooter from '@/components/AppFooter.vue'

const auth = useAuthStore()
const wishlist = useWishlistStore()
const cart = useCartStore()
const router = useRouter()

const user = computed(() => auth.user)
const fullName = computed(() =>
  user.value ? `${user.value.name.firstname} ${user.value.name.lastname}` : (auth.username ?? '—'),
)
const address = computed(() => {
  const a = user.value?.address
  if (!a) return '—'
  return `${a.number} ${a.street}, ${a.city} ${a.zipcode}`
})

function onLogout(): void {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <section class="account">
    <div class="account__head">
      <h1 class="account__title">Account</h1>
    </div>

    <div class="account__grid">
      <div class="field">
        <p class="field__label">Name</p>
        <p class="field__value">{{ fullName }}</p>
      </div>
      <div class="field">
        <p class="field__label">Username</p>
        <p class="field__value">{{ user?.username ?? auth.username ?? '—' }}</p>
      </div>
      <div class="field">
        <p class="field__label">Email</p>
        <p class="field__value">{{ user?.email ?? '—' }}</p>
      </div>
      <div class="field">
        <p class="field__label">Phone</p>
        <p class="field__value">{{ user?.phone ?? '—' }}</p>
      </div>
      <div class="field field--wide">
        <p class="field__label">Address</p>
        <p class="field__value">{{ address }}</p>
      </div>
      <div class="field">
        <p class="field__label">Wishlist</p>
        <p class="field__value">{{ wishlist.count }} item{{ wishlist.count === 1 ? '' : 's' }}</p>
      </div>
      <div class="field">
        <p class="field__label">Bag</p>
        <p class="field__value">{{ cart.count }} item{{ cart.count === 1 ? '' : 's' }}</p>
      </div>
    </div>

    <div class="account__actions">
      <RouterLink to="/wishlist" class="btn btn--ghost">View wishlist</RouterLink>
      <RouterLink to="/cart" class="btn btn--ghost">View bag</RouterLink>
      <button type="button" class="btn btn--primary" @click="onLogout">Logout</button>
    </div>

    <AppFooter />
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/mixins' as *;

.account {
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

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-5) var(--pad);

    @include respond('md') {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-top: var(--space-8);
  }
}

.field {
  border-top: 1px solid var(--color-line);
  padding-top: var(--space-3);

  &--wide {
    @include respond('md') {
      grid-column: span 2;
    }
  }

  &__label {
    text-transform: uppercase;
    font-size: var(--font-size-label);
    font-weight: 600;
    letter-spacing: var(--letter-label);
    color: var(--color-muted);
    margin-bottom: 0.5em;
  }

  &__value {
    text-transform: uppercase;
    font-size: var(--font-size-label);
    font-weight: 600;
    letter-spacing: var(--letter-label);
  }
}
</style>
