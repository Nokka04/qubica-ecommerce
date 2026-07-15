<script setup lang="ts">
// Placeholder card shown while product data is loading.
</script>

<template>
  <div class="skeleton" aria-hidden="true">
    <div class="skeleton__image" />
    <div class="skeleton__line skeleton__line--title" />
    <div class="skeleton__line skeleton__line--short" />
    <div class="skeleton__line skeleton__line--price" />
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);

  &__image {
    aspect-ratio: 1 / 1;
    border-radius: var(--radius-md);
    margin-bottom: var(--space-4);
  }

  &__line {
    height: 0.75rem;
    border-radius: var(--radius-sm);
    margin-bottom: var(--space-3);

    &--title {
      width: 90%;
    }
    &--short {
      width: 60%;
    }
    &--price {
      width: 35%;
      margin-bottom: 0;
    }
  }

  &__image,
  &__line {
    background: linear-gradient(
      90deg,
      var(--color-surface-alt) 25%,
      var(--color-border) 37%,
      var(--color-surface-alt) 63%
    );
    background-size: 400% 100%;
    animation: shimmer 1.4s ease infinite;
  }
}

@keyframes shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
