<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getErrorMessage } from '@/composables/useAsyncData'
import type { NewUser } from '@/types'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({
  firstname: '',
  lastname: '',
  email: '',
  username: '',
  password: '',
  phone: '',
  city: '',
  street: '',
  number: '',
  zipcode: '',
})

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

async function onSubmit(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const payload: NewUser = {
      email: form.email,
      username: form.username,
      password: form.password,
      name: { firstname: form.firstname, lastname: form.lastname },
      phone: form.phone,
      address: {
        city: form.city,
        street: form.street,
        number: Number(form.number) || 0,
        zipcode: form.zipcode,
      },
    }
    await auth.register(payload)
    success.value = true
  } catch (err) {
    error.value = getErrorMessage(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="register">
    <div class="register__card">
      <h1 class="register__title">Create account</h1>

      <div v-if="success" class="register__success">
        <p>Account created successfully.</p>
        <p class="register__note">
          Note: the Fake Store API is a demo and does not persist new accounts, so use the seeded
          demo credentials to sign in.
        </p>
        <button type="button" class="btn btn--primary" @click="router.push('/login')">
          Go to sign in
        </button>
      </div>

      <form v-else class="register__form" @submit.prevent="onSubmit">
        <div class="register__row">
          <div class="register__field">
            <label for="firstname">First name</label>
            <input id="firstname" v-model="form.firstname" type="text" required />
          </div>
          <div class="register__field">
            <label for="lastname">Last name</label>
            <input id="lastname" v-model="form.lastname" type="text" required />
          </div>
        </div>

        <div class="register__field">
          <label for="email">Email</label>
          <input id="email" v-model="form.email" type="email" autocomplete="email" required />
        </div>

        <div class="register__row">
          <div class="register__field">
            <label for="r-username">Username</label>
            <input id="r-username" v-model="form.username" type="text" autocomplete="username" required />
          </div>
          <div class="register__field">
            <label for="r-password">Password</label>
            <input
              id="r-password"
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              required
            />
          </div>
        </div>

        <div class="register__field">
          <label for="phone">Phone</label>
          <input id="phone" v-model="form.phone" type="tel" autocomplete="tel" />
        </div>

        <div class="register__row">
          <div class="register__field">
            <label for="city">City</label>
            <input id="city" v-model="form.city" type="text" />
          </div>
          <div class="register__field">
            <label for="zipcode">Zip code</label>
            <input id="zipcode" v-model="form.zipcode" type="text" />
          </div>
        </div>

        <div class="register__row">
          <div class="register__field register__field--grow">
            <label for="street">Street</label>
            <input id="street" v-model="form.street" type="text" />
          </div>
          <div class="register__field">
            <label for="number">No.</label>
            <input id="number" v-model="form.number" type="number" min="0" />
          </div>
        </div>

        <p v-if="error" class="register__error" role="alert">{{ error }}</p>

        <button type="submit" class="btn btn--primary register__submit" :disabled="loading">
          {{ loading ? 'Creating…' : 'Create account' }}
        </button>

        <p class="register__login">
          Already have an account?
          <RouterLink to="/login" class="register__link">Sign in</RouterLink>
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.register {
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 8rem var(--pad) var(--space-6);
  background-color: var(--color-bg);

  &__card {
    width: 100%;
    max-width: 520px;
    border: 1px solid var(--color-fg);
    padding: var(--space-6);
  }

  &__title {
    font-size: var(--font-size-3xl);
    letter-spacing: -0.02em;
    margin-bottom: var(--space-6);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  &__row {
    display: flex;
    gap: var(--space-4);

    @media (max-width: 560px) {
      flex-direction: column;
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    flex: 1;

    &--grow {
      flex: 3;
    }

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

  &__login,
  &__note {
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

  &__success {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
    text-transform: uppercase;
    font-size: var(--font-size-label);
    letter-spacing: var(--letter-label);
  }
}
</style>
