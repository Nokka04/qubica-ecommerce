# QubicaStore — Vue 3 + TypeScript E-commerce

A responsive e-commerce single-page application built with **Vue 3**, **TypeScript** and **Vite**, consuming the [Fake Store API](https://fakestoreapi.com/docs). It lets users browse products, filter by category, view product details, manage a shopping cart and wishlist, authenticate against the backend API, and view their account profile. The UI follows a strict black & white, motion-led monochrome design language.

This project was built as the technical exercise for the **Junior Web Engineer** role at QubicaAmf.

---

## Features

### Core requirements

- **Global layout** — sticky `Header` + `Main` content area + footer, using semantic HTML5.
- **Responsive & accessible** — mobile-first design (tablet & smartphone friendly), keyboard navigation, visible focus states, `alt` text on every product image, a "skip to content" link, and `aria` attributes.
- **Header** — store name, textual logo, and a category navigation fetched **dynamically** from the API.
- **Home** — responsive grid of product cards (image, name, price, rating). Cards are clickable and lead to the detail view.
- **Category filtering via URL** — clicking a category updates the URL query string (`/?category=electronics`). The filter is **deep-link & refresh safe**: loading a filtered URL directly initializes the interface with the correct filter applied.
- **Product detail** — name, image, price, full description and rating.

### Bonus features implemented

- **Git workflow** — feature branches merged into `main` via non-fast-forward "PR" merges, keeping a clean, linear-per-feature history.
- **Vue 3 + strict TypeScript** — API responses and domain models are fully typed (`src/types`).
- **Design system with SCSS** — CSS Custom Properties for colors, spacing, typography and radii, centralized in `src/styles/_tokens.scss`.
- **Unit tests** — Vitest tests for the price/label formatting utilities and the cart store logic.
- **State management** — Pinia stores for cart, wishlist and auth.
- **Polish** — route transitions, skeleton loaders and spinners for loading states, and an error modal ("something went wrong") with retry for network failures.
- **monochrome redesign** — monochrome design system (PP Neue Montreal), GSAP reveal animations, Lenis smooth scrolling, a site preloader and clip-path page transitions.
- **Add to cart** — from the product detail page, with a live counter badge in the header.
- **Wishlist** — protected feature with its own view and header counter.
- **Login / logout** — via the Fake Store API `POST /auth/login`, with `requiresAuth` route guards protecting the Cart, Wishlist and Account views.
- **User & account system** — the full profile is resolved from `/users` after login and shown on a protected Account page (name, email, phone, address). A registration page posts to `/users` (demo-only, as the API does not persist new accounts).

---

## Tech stack

| Concern           | Choice                          |
| ----------------- | ------------------------------- |
| Framework         | Vue 3 (Composition API)         |
| Language          | TypeScript (strict)             |
| Build tool        | Vite                            |
| Routing           | Vue Router                      |
| State management  | Pinia                           |
| Styling           | SCSS + CSS Custom Properties    |
| HTTP client       | Axios                           |
| Animation         | GSAP + Lenis + SplitType        |
| Testing           | Vitest + @vue/test-utils        |
| Linting           | ESLint + oxlint                 |

---

## Prerequisites

- **Node.js** `>= 20.19` (or `>= 22.12`)
- **npm** `>= 10`

> The project was developed and tested on Node `20.19.6`.

## Local setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd qubica-ecommerce

# 2. Install dependencies
npm install

# 3. Start the dev server (http://localhost:5173)
npm run dev
```

## Available scripts

```bash
npm run dev         # Start the Vite dev server with HMR
npm run build       # Type-check and build for production (output in dist/)
npm run preview     # Preview the production build locally
npm run test:unit   # Run unit tests (Vitest)
npm run lint        # Lint & auto-fix with oxlint + ESLint
```

### Demo credentials

The login form is pre-filled with a valid Fake Store API account:

- **Username:** `mor_2314`
- **Password:** `83r5^_`

---

## Project structure

```
src/
├── api/            # Axios instance & typed API services (products, categories, auth, users)
├── components/     # Reusable UI components (AppHeader, AppFooter, SitePreloader, ProductCard…)
├── composables/    # Reusable logic (useAsyncData, gsap setup, useSmoothScroll)
├── router/         # Route definitions + auth guard
├── stores/         # Pinia stores (cart, wishlist, auth)
├── styles/         # SCSS design system (tokens, mixins, global styles)
├── types/          # Shared TypeScript interfaces
├── utils/          # Pure helpers (formatting) + unit tests
└── views/          # Route-level views (Home, Product, Login, Register, Account, Cart, Wishlist…)
```

---

## Git workflow

Each feature was developed on a dedicated branch and merged into `main` through a
non-fast-forward merge, simulating a Pull Request based workflow:

- `feat/foundation-layout` — design system, typed API layer, global layout & routing
- `feat/catalog` — home grid, category filtering & product detail
- `feat/cart-auth` — cart, wishlist & authentication
- `feat/tests-docs` — unit tests & documentation
- `feat/monochrome-redesign` — black & white redesign, animations & smooth scroll
- `feat/user-account-system` — user profile, account page & registration
- `chore/ui-polish` — metadata, docs & detail refinements

Run `git log --oneline --graph` to see the branching history.
