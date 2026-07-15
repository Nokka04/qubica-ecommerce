<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="not-found">
    <h1 class="not-found__code">404</h1>
    <p class="not-found__text">The page you are looking for does not exist.</p>
    <RouterLink to="/" class="btn btn--primary">Back to home</RouterLink>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--pad);
  text-align: center;
  background-color: var(--color-bg);

  &__code {
    font-size: clamp(6rem, 30vw, 20rem);
    line-height: 0.8;
    letter-spacing: -0.05em;
  }

  &__text {
    text-transform: uppercase;
    font-size: var(--font-size-label);
    letter-spacing: var(--letter-label);
    color: var(--color-muted);
  }
}
</style>
