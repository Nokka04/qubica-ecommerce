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
  z-index: 100;
  display: grid;
  place-items: center;
  padding: var(--space-4);
  background-color: rgba(0, 0, 0, 0.5);

  &__dialog {
    width: 100%;
    max-width: 420px;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    padding: var(--space-6);
    text-align: center;
  }

  &__title {
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-3);
  }

  &__message {
    color: var(--color-text-muted);
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
