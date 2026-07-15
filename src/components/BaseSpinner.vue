<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), {
  label: 'Loading…',
})
</script>

<template>
  <div class="spinner" role="status" aria-live="polite">
    <span class="spinner__circle" aria-hidden="true" />
    <span class="visually-hidden">{{ label }}</span>
  </div>
</template>

<style scoped lang="scss">
.spinner {
  display: flex;
  justify-content: center;
  padding: var(--space-6);

  &__circle {
    width: 2.5rem;
    height: 2.5rem;
    border: 3px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: var(--radius-full);
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
