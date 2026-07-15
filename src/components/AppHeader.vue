<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { fetchCategories } from '@/api/categories'
import { formatCategoryLabel } from '@/utils/format'
import type { Category } from '@/types'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useAuthStore } from '@/stores/auth'
import { gsap } from '@/composables/gsap'

const categories = ref<Category[]>([])

const cart = useCartStore()
const wishlist = useWishlistStore()
const auth = useAuthStore()
const router = useRouter()

const navRef = ref<HTMLElement | null>(null)
const menuOverlayRef = ref<HTMLElement | null>(null)
const navLogoRef = ref<HTMLElement | null>(null)
const menuBtnRef = ref<HTMLElement | null>(null)
const cartBtnRef = ref<HTMLElement | null>(null)
const overlayLogoRef = ref<HTMLElement | null>(null)
const closeBtnRef = ref<HTMLElement | null>(null)

let isAnimating = false

onMounted(async () => {
  const overlay = menuOverlayRef.value
  if (overlay) {
    gsap.set(overlay, {
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      pointerEvents: 'none',
    })
    gsap.set([overlayLogoRef.value, closeBtnRef.value], { y: '100%' })
    gsap.set(overlay.querySelectorAll('.menu-overlay-items .reveal-line'), { y: '100%' })
    gsap.set(overlay.querySelectorAll('.menu-footer .reveal-line'), { y: '100%' })
  }

  try {
    categories.value = await fetchCategories()
  } catch {
    categories.value = []
  }
})

function openMenu(): void {
  const overlay = menuOverlayRef.value
  if (isAnimating || !overlay) return
  isAnimating = true

  const tl = gsap.timeline({ onComplete: () => (isAnimating = false) })

  tl.to([navLogoRef.value, menuBtnRef.value, cartBtnRef.value], {
    y: '-100%',
    duration: 0.5,
    stagger: 0.1,
    ease: 'power3.out',
    onComplete: () => {
      if (navRef.value) navRef.value.style.pointerEvents = 'none'
      gsap.set([navLogoRef.value, menuBtnRef.value, cartBtnRef.value], { y: '100%' })
    },
  })

  tl.to(
    overlay,
    {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 1,
      ease: 'hop',
      onStart: () => (overlay.style.pointerEvents = 'all'),
    },
    '-=0.55',
  )

  tl.to(
    [overlayLogoRef.value, closeBtnRef.value],
    { y: '0%', duration: 1, stagger: 0.1, ease: 'power3.out' },
    '-=0.5',
  )

  tl.to(
    overlay.querySelectorAll('.menu-overlay-items .reveal-line'),
    { y: '0%', duration: 1, stagger: 0.075, ease: 'power3.out' },
    '<',
  )

  tl.to(
    overlay.querySelectorAll('.menu-footer .reveal-line'),
    { y: '0%', duration: 1, stagger: 0.1, ease: 'power3.out' },
    '<',
  )
}

function closeMenu(): void {
  const overlay = menuOverlayRef.value
  if (isAnimating || !overlay) return
  isAnimating = true

  const tl = gsap.timeline({ onComplete: () => (isAnimating = false) })

  tl.to([overlayLogoRef.value, closeBtnRef.value], {
    y: '-100%',
    duration: 0.5,
    stagger: 0.1,
    ease: 'power3.out',
  })

  tl.to(
    overlay.querySelectorAll('.menu-overlay-items .reveal-line'),
    { y: '-100%', duration: 0.5, stagger: 0.05, ease: 'power3.in' },
    '<',
  )

  tl.to(
    overlay.querySelectorAll('.menu-footer .reveal-line'),
    { y: '-100%', duration: 0.5, stagger: 0.05, ease: 'power3.in' },
    '<',
  )

  tl.to(
    overlay,
    {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      duration: 1,
      ease: 'hop',
      onComplete: () => {
        overlay.style.pointerEvents = 'none'
        gsap.set(overlay, {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        })
        gsap.set([overlayLogoRef.value, closeBtnRef.value], { y: '100%' })
        gsap.set(overlay.querySelectorAll('.menu-overlay-items .reveal-line'), { y: '100%' })
        gsap.set(overlay.querySelectorAll('.menu-footer .reveal-line'), { y: '100%' })
      },
    },
    '+=0.25',
  )

  tl.to(
    [navLogoRef.value, menuBtnRef.value, cartBtnRef.value],
    {
      y: '0%',
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out',
      onStart: () => {
        if (navRef.value) navRef.value.style.pointerEvents = 'all'
      },
    },
    '-=0.35',
  )
}

/** Close the overlay, then navigate (mirrors the FA delayed navigation). */
function navigateTo(to: string): void {
  if (router.currentRoute.value.fullPath === to) {
    closeMenu()
    return
  }
  closeMenu()
  window.setTimeout(() => router.push(to), 600)
}

function onLogout(): void {
  auth.logout()
  navigateTo('/')
}
</script>

<template>
  <div class="menu">
    <div ref="navRef" class="nav">
      <div class="nav-logo">
        <div class="revealer">
          <a ref="navLogoRef" href="/" class="reveal-line brand" @click.prevent="router.push('/')">
            QubicaStore
          </a>
        </div>
      </div>
      <div class="nav-items">
        <div class="nav-toggle" @click="openMenu">
          <div class="revealer">
            <p ref="menuBtnRef" class="reveal-line">Menu</p>
          </div>
        </div>
        <RouterLink to="/cart" class="nav-cart">
          <div class="revealer">
            <p ref="cartBtnRef" class="reveal-line">Cart ({{ cart.count }})</p>
          </div>
        </RouterLink>
      </div>
    </div>

    <div ref="menuOverlayRef" class="menu-overlay">
      <div class="menu-overlay-nav">
        <div class="menu-overlay-nav-logo">
          <div class="revealer">
            <a ref="overlayLogoRef" href="/" class="reveal-line brand" @click.prevent="navigateTo('/')">
              QubicaStore
            </a>
          </div>
        </div>
        <div class="menu-overlay-nav-close" @click="closeMenu">
          <div class="revealer">
            <p ref="closeBtnRef" class="reveal-line">Close</p>
          </div>
        </div>
      </div>

      <nav class="menu-overlay-items" aria-label="Primary">
        <div class="revealer">
          <a href="/" class="reveal-line" @click.prevent="navigateTo('/')">Index</a>
        </div>
        <div v-for="category in categories" :key="category" class="revealer">
          <a
            :href="`/?category=${category}`"
            class="reveal-line"
            @click.prevent="navigateTo(`/?category=${category}`)"
          >
            {{ formatCategoryLabel(category) }}
          </a>
        </div>
        <div class="revealer">
          <a href="/wishlist" class="reveal-line" @click.prevent="navigateTo('/wishlist')">
            Wishlist ({{ wishlist.count }})
          </a>
        </div>
        <div class="revealer">
          <a href="/cart" class="reveal-line" @click.prevent="navigateTo('/cart')">Cart</a>
        </div>
        <div v-if="auth.isAuthenticated" class="revealer">
          <a href="/" class="reveal-line" @click.prevent="onLogout">Logout</a>
        </div>
        <div v-else class="revealer">
          <a href="/login" class="reveal-line" @click.prevent="navigateTo('/login')">Login</a>
        </div>
      </nav>

      <div class="menu-footer">
        <div class="menu-footer-col">
          <div class="revealer">
            <p class="reveal-line">&copy;2026 QubicaStore — All rights reserved</p>
          </div>
          <div v-if="auth.isAuthenticated" class="revealer">
            <p class="reveal-line">Signed in as {{ auth.username }}</p>
          </div>
        </div>
        <div class="menu-footer-col">
          <div class="socials">
            <div class="revealer">
              <a class="reveal-line" href="https://fakestoreapi.com/docs" target="_blank" rel="noopener">
                Fake Store API
              </a>
            </div>
            <div class="revealer">
              <a class="reveal-line" href="https://vuejs.org" target="_blank" rel="noopener">Vue</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.menu {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100svh;
  pointer-events: none;
  z-index: 20;
}

.nav {
  pointer-events: all;
}

.nav,
.menu-overlay-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  padding: var(--pad);
  display: flex;
  gap: var(--pad);
}

.nav-logo,
.menu-overlay-nav-logo {
  flex: 2;
}

.nav-items {
  flex: 1;
  display: flex;
}

.nav-toggle,
.nav-cart,
.menu-overlay-nav-close {
  flex: 1;
}

.revealer .reveal-line {
  transform: translateY(0);
}

.brand {
  font-weight: 700;
}

.nav-toggle .revealer,
.nav-cart .revealer,
.menu-overlay-nav-logo .revealer,
.menu-overlay-nav-close .revealer {
  cursor: pointer;
}

p,
a {
  text-transform: uppercase;
  font-size: var(--font-size-label);
  font-weight: 600;
  letter-spacing: var(--letter-label);
  line-height: 1;
}

.menu-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100svh;
  overflow: hidden;
  background-color: var(--color-inverse-bg);
  clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  will-change: transform, clip-path;
  pointer-events: none;
  z-index: 20;

  a,
  p {
    color: var(--color-inverse-fg);
  }
}

.menu-overlay-items {
  padding: 25vh var(--pad) var(--pad);

  a {
    font-size: 2.5rem;

    @media (min-width: 768px) {
      font-size: 3rem;
    }
  }
}

.menu-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: var(--pad);
  display: flex;
  align-items: flex-end;
  gap: var(--pad);
}

.menu-footer-col:nth-child(1) {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.menu-footer-col:nth-child(2) {
  flex: 1;
}

.socials {
  display: flex;
  gap: var(--pad);
}
</style>
