<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const time = ref('')
let intervalId: ReturnType<typeof setInterval> | undefined

function updateTime(): void {
  time.value = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: 'Europe/Rome',
  }).format(new Date())
}

onMounted(() => {
  updateTime()
  intervalId = setInterval(updateTime, 1000)
})

onBeforeUnmount(() => clearInterval(intervalId))
</script>

<template>
  <footer class="footer">
    <div class="footer-col">
      <p>&copy;2026 QubicaStore — All rights reserved</p>
    </div>
    <div class="footer-col">
      <div class="footer-clock">
        <p>Bologna, IT {{ time }}</p>
      </div>
      <div class="footer-author">
        <p>
          Data from&nbsp;
          <a href="https://fakestoreapi.com/docs" target="_blank" rel="noopener">Fake Store API</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  position: relative;
  width: 100%;
  display: flex;
  align-items: flex-end;
  gap: var(--pad);
  padding: var(--pad);
  background-color: var(--color-bg);
}

.footer-col:nth-child(1) {
  flex: 2;
}

.footer-col:nth-child(2) {
  flex: 1;
  display: flex;
  justify-content: space-between;
}

.footer-author a {
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: var(--color-fg);
  }
}

@media (max-width: 767px) {
  .footer-clock {
    display: none;
  }

  .footer-col:nth-child(1),
  .footer-col:nth-child(2) {
    flex: 1;
  }

  .footer-author {
    display: flex;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
