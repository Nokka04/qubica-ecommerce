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
  text-align: center;
  padding-block: var(--space-8);

  &__code {
    font-size: 4rem;
    color: var(--color-primary);
  }

  &__text {
    color: var(--color-text-muted);
    margin-block: var(--space-3) var(--space-6);
  }
}
</style>
