<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getErrorMessage } from '@/composables/useAsyncData'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

// Fake Store API demo account, pre-filled to make the flow easy to test.
const username = ref('mor_2314')
const password = ref('83r5^_')
const loading = ref(false)
const error = ref<string | null>(null)

async function onSubmit(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    await auth.login({ username: username.value, password: password.value })
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.push(redirect)
  } catch (err) {
    error.value = getErrorMessage(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="login">
    <div class="login__card">
      <h1 class="login__title">Sign in</h1>
      <p class="login__hint">
        Use the demo account (pre-filled): <code>mor_2314</code> / <code>83r5^_</code>
      </p>

      <form class="login__form" @submit.prevent="onSubmit">
        <div class="login__field">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            required
          />
        </div>

        <div class="login__field">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
          />
        </div>

        <p v-if="error" class="login__error" role="alert">{{ error }}</p>

        <button type="submit" class="btn btn--primary login__submit" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.login {
  display: grid;
  place-items: center;
  padding-block: var(--space-6);

  &__card {
    width: 100%;
    max-width: 400px;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    padding: var(--space-6);
  }

  &__title {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-2);
  }

  &__hint {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    margin-bottom: var(--space-5);

    code {
      background-color: var(--color-surface-alt);
      padding: 0 var(--space-1);
      border-radius: var(--radius-sm);
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);

    label {
      font-size: var(--font-size-sm);
      font-weight: 600;
    }

    input {
      padding: var(--space-3);
      font-size: var(--font-size-base);
      color: var(--color-text);
      background-color: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);

      &:focus-visible {
        border-color: var(--color-primary);
      }
    }
  }

  &__error {
    color: var(--color-danger);
    font-size: var(--font-size-sm);
  }

  &__submit {
    margin-top: var(--space-2);
  }
}
</style>
