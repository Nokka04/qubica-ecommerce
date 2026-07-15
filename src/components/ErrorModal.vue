<script setup lang="ts">
defineProps<{
  open: boolean
  message?: string
}>()

const emit = defineEmits<{
  (e: 'retry'): void
  (e: 'close'): void
}>()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="open"
      class="modal"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="error-title"
      @click.self="emit('close')"
    >
      <div class="modal__dialog">
        <h2 id="error-title" class="modal__title">Something went wrong</h2>
        <p class="modal__message">
          {{ message || 'We could not complete your request. Please try again.' }}
        </p>
        <div class="modal__actions">
          <button type="button" class="btn btn--ghost" @click="emit('close')">Dismiss</button>
          <button type="button" class="btn btn--primary" @click="emit('retry')">Retry</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: grid;
  place-items: center;
  padding: var(--space-4);
  background-color: rgba(0, 0, 0, 0.6);

  &__dialog {
    width: 100%;
    max-width: 420px;
    background-color: var(--color-bg);
    border: 1px solid var(--color-fg);
    border-radius: 0;
    padding: var(--space-6);
    text-align: center;
  }

  &__title {
    text-transform: uppercase;
    font-size: var(--font-size-xl);
    letter-spacing: -0.01em;
    margin-bottom: var(--space-3);
  }

  &__message {
    text-transform: uppercase;
    font-size: var(--font-size-label);
    letter-spacing: var(--letter-label);
    color: var(--color-muted);
    margin-bottom: var(--space-6);
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: var(--space-3);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-base);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
