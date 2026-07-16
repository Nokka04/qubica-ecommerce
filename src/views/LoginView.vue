<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getErrorMessage } from '@/composables/useAsyncData'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

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
      <p class="login__hint">Demo account (pre-filled): mor_2314 / 83r5^_</p>

      <form class="login__form" @submit.prevent="onSubmit">
        <div class="login__field">
          <label for="username">Username</label>
          <input id="username" v-model="username" type="text" autocomplete="username" required />
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

        <p class="login__register">
          No account?
          <RouterLink to="/register" class="login__link">Create one</RouterLink>
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.login {
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 8rem var(--pad) var(--space-6);
  background-color: var(--color-bg);

  &__card {
    width: 100%;
    max-width: 420px;
    border: 1px solid var(--color-fg);
    padding: var(--space-6);
  }

  &__title {
    font-size: var(--font-size-3xl);
    letter-spacing: -0.02em;
    margin-bottom: var(--space-3);
  }

  &__hint {
    text-transform: uppercase;
    font-size: var(--font-size-label);
    letter-spacing: var(--letter-label);
    color: var(--color-muted);
    margin-bottom: var(--space-6);
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
      text-transform: uppercase;
      font-size: var(--font-size-label);
      font-weight: 600;
      letter-spacing: var(--letter-label);
    }

    input {
      padding: var(--space-3);
      font-size: var(--font-size-base);
      color: var(--color-fg);
      background-color: var(--color-bg);
      border: 1px solid var(--color-line);
      border-radius: 0;

      &:focus-visible {
        border-color: var(--color-fg);
        outline: none;
      }
    }
  }

  &__error {
    text-transform: uppercase;
    font-size: var(--font-size-label);
    letter-spacing: var(--letter-label);
    color: var(--color-fg);
    border-left: 2px solid var(--color-fg);
    padding-left: var(--space-2);
  }

  &__submit {
    margin-top: var(--space-2);
  }

  &__register {
    text-transform: uppercase;
    font-size: var(--font-size-label);
    letter-spacing: var(--letter-label);
    color: var(--color-muted);
  }

  &__link {
    color: var(--color-fg);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
