<script setup lang="ts">
// Placeholder card shown while product data is loading.
</script>

<template>
  <div class="skeleton" aria-hidden="true">
    <div class="skeleton__image" />
    <div class="skeleton__row">
      <div class="skeleton__line skeleton__line--title" />
      <div class="skeleton__line skeleton__line--price" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  &__image {
    aspect-ratio: 5 / 7;
    margin-bottom: 0.5em;

    @media (max-width: 767px) {
      aspect-ratio: 4 / 3;
    }
  }

  &__row {
    display: flex;
    justify-content: space-between;
    gap: var(--space-3);
  }

  &__line {
    height: 0.7rem;

    &--title {
      width: 60%;
    }
    &--price {
      width: 20%;
    }
  }

  &__image,
  &__line {
    background: linear-gradient(
      90deg,
      #f2f2f2 25%,
      #e0e0e0 37%,
      #f2f2f2 63%
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
