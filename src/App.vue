<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <a class="skip-link" href="#main">Skip to main content</a>
  <AppHeader />

  <main id="main" class="main">
    <div class="container">
      <RouterView v-slot="{ Component }">
        <Transition name="view" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
  </main>

  <footer class="footer">
    <div class="container">
      <p>Built with Vue 3 &amp; TypeScript · Data from Fake Store API</p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.skip-link {
  position: absolute;
  left: var(--space-4);
  top: -3rem;
  z-index: 200;
  padding: var(--space-2) var(--space-4);
  background-color: var(--color-primary);
  color: var(--color-primary-contrast);
  border-radius: var(--radius-md);
  transition: top var(--transition-fast);

  &:focus {
    top: var(--space-2);
  }
}

.main {
  padding-block: var(--space-6);
  min-height: calc(100vh - var(--header-height) - 60px);
}

.footer {
  border-top: 1px solid var(--color-border);
  padding-block: var(--space-5);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  text-align: center;
}

.view-enter-active,
.view-leave-active {
  transition:
    opacity var(--transition-base),
    transform var(--transition-base);
}
.view-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.view-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
