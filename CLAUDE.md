# CLAUDE.md — Real Me Project Guide

## What is Real Me?

A full-stack **digital twin metaverse platform** for virtual shopping. Users create a photorealistic 3D avatar matching their real body, explore an immersive virtual world with neon-lit shopping districts, try on clothes on their avatar, and buy real products that ship to their physical address. The core value prop: **never pick the wrong size again**.

Think: Metaverse + Ready Player One + MMO + real e-commerce — but the avatars are real people, not game characters.

---

## Project Structure

```
real-me/
├── client/                          # React 18 + TypeScript + Vite frontend
│   ├── public/
│   │   └── favicon.svg              # RM gradient logo favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── avatar/
│   │   │   │   ├── AppearanceCustomizer.tsx  # Skin tone, hair, eyes, body type selectors
│   │   │   │   ├── AvatarPreview.tsx         # 3D avatar renderer (Three.js Canvas, turntable, scales to measurements)
│   │   │   │   ├── BodyScanner.tsx           # Webcam 4-angle body capture with SVG overlay guides
│   │   │   │   └── MeasurementForm.tsx       # Manual entry for 10 body metrics + visual body map SVG
│   │   │   ├── layout/
│   │   │   │   ├── Layout.tsx                # App wrapper (Navbar + Outlet)
│   │   │   │   └── Navbar.tsx                # Top nav: logo, links, cart badge, profile avatar
│   │   │   ├── shop/
│   │   │   │   ├── ProductCard.tsx           # Product card with hover try-on, quick-add, color swatches
│   │   │   │   ├── ProductGrid.tsx           # Filterable/sortable product listing + 8 sample products
│   │   │   │   └── TryOnView.tsx             # 3D avatar wearing product, color picker, fit assessment
│   │   │   ├── ui/
│   │   │   │   └── LoadingScreen.tsx         # Spinning gradient loader with "RM" text
│   │   │   └── world/
│   │   │       ├── PlayerAvatar.tsx          # User's avatar in-world (scaled, nametag, highlight ring)
│   │   │       ├── ShoppingDistrict.tsx      # 11 procedural store buildings, neon signs, lamps, pathways
│   │   │       ├── VirtualWorldScene.tsx     # Main 3D scene: sky, ground, plaza, fountain, particles
│   │   │       └── WorldHUD.tsx              # Overlay UI: online count, location, quick-travel, controls
│   │   ├── hooks/
│   │   │   └── useStore.ts           # All Zustand stores (auth, avatar, cart, world) + TypeScript types
│   │   ├── pages/
│   │   │   ├── AuthPage.tsx          # Login/signup toggle, mock auth, redirects to avatar creator
│   │   │   ├── AvatarCreator.tsx     # 4-step wizard: Scan → Measurements → Appearance → Preview
│   │   │   ├── CartPage.tsx          # Cart items, quantity controls, order summary with tax/shipping
│   │   │   ├── LandingPage.tsx       # Hero with 3D wireframe avatar, features, stats, 3-step explainer, CTA
│   │   │   ├── ProductPage.tsx       # Product detail: try-on toggle, size/color picker, add-to-cart, fit guarantee
│   │   │   ├── ProfilePage.tsx       # Account info, avatar measurements summary, order history
│   │   │   ├── StorePage.tsx         # Store product listing wrapper around ProductGrid
│   │   │   └── VirtualWorld.tsx      # Full-viewport 3D world loader with HUD
│   │   ├── services/
│   │   │   └── api.ts                # Axios instance with JWT interceptor, all API endpoint functions
│   │   ├── styles/
│   │   │   └── globals.css           # Tailwind directives + custom components (glass, neon, btn, card)
│   │   ├── App.tsx                   # React Router config with lazy-loaded pages
│   │   ├── main.tsx                  # ReactDOM entry point
│   │   └── vite-env.d.ts            # Vite type reference
│   ├── index.html                    # HTML shell with Google Fonts preconnect
│   ├── tailwind.config.js            # Extended theme: colors, fonts, animations
│   ├── postcss.config.js             # PostCSS with Tailwind + Autoprefixer
│   ├── tsconfig.json                 # TypeScript config with path aliases
│   ├── tsconfig.node.json            # Node-side TS config for Vite
│   ├── vite.config.ts                # Vite config: port 3000, proxy /api to :5000
│   ├── .env.example                  # VITE_API_URL
│   └── package.json
├── server/                           # Node.js + Express + MongoDB backend
│   ├── src/
│   │   ├── config/
│   │   │   └── index.js              # Env-based config (port, mongo URI, JWT secret, Stripe key)
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT Bearer token verification, sets req.userId
│   │   │   ├── errorHandler.js       # Centralized error handler (validation, cast, duplicate)
│   │   │   └── upload.js             # Multer config: disk storage, UUID filenames, 10MB limit, image-only
│   │   ├── models/
│   │   │   ├── Avatar.js             # Measurements (10 fields with min/max), appearance, photos, getRecommendedSize()
│   │   │   ├── Order.js              # Items, shipping address, status enum, payment, tracking
│   │   │   ├── Product.js            # Name/brand/category/price/sizes/colors, text index, sizeChart map
│   │   │   ├── Store.js              # Brand, position in world, theme (color + style enum), categories
│   │   │   └── User.js               # Email/password (bcrypt pre-save), shipping addresses, preferences
│   │   ├── routes/
│   │   │   ├── auth.js               # POST register/login, GET/PUT profile
│   │   │   ├── avatars.js            # CRUD + photo upload + measurements + size recommendation
│   │   │   ├── orders.js             # Create order, list user orders, get by ID
│   │   │   ├── products.js           # List/filter/search/categories + sample data fallback
│   │   │   ├── stores.js             # List/get stores + sample data fallback (11 stores)
│   │   │   └── tryOn.js              # POST simulate: returns mock fit analysis with per-area scores
│   │   └── index.js                  # Express setup, Socket.IO (player:move, enterStore, users:count), MongoDB connect
│   ├── uploads/
│   │   └── .gitkeep
│   ├── .env.example                  # PORT, MONGODB_URI, JWT_SECRET, STRIPE_SECRET_KEY, CLIENT_URL
│   └── package.json
├── package.json                      # Root monorepo: concurrently runs client + server
├── .gitignore                        # node_modules, dist, .env, uploads/*, logs
├── LICENSE                           # MIT
└── README.md                         # Project overview, tech stack, architecture, getting started, roadmap
```

---

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `dark-900` | `#101113` | Page background |
| `dark-800` | `#141517` | Elevated surfaces |
| `dark-700` | `#1a1b1e` | Cards, inputs |
| `dark-600` | `#25262b` | Hover states |
| `dark-500` | `#2c2e33` | Borders |
| `dark-400` | `#373a40` | Muted borders |
| `dark-300` | `#5c5f66` | Tertiary text |
| `dark-200` | `#909296` | Secondary text |
| `dark-100` | `#a6a7ab` | Body text |
| `dark-50`  | `#c1c2c5` | Primary text |
| `primary-600` | `#4c6ef5` | Primary buttons, active states |
| `primary-400` | `#748ffc` | Brand labels, links |
| `neon-blue` | `#00d4ff` | Main accent, glows, scanning effects |
| `neon-purple` | `#b249f8` | Secondary accent, holographic elements |
| `neon-pink` | `#ff6bcb` | Badges, cart count, fashion district |
| `neon-green` | `#05ffa1` | Success, "perfect fit", online status |

**Gradients used:**
- Primary button: `linear-gradient(135deg, #4c6ef5, #b249f8)`
- Gradient text: `linear-gradient(135deg, #00d4ff, #b249f8, #ff6bcb)`
- Logo/avatar bg: `from-neon-blue to-neon-purple`

### Typography

| Font | Usage | Weights |
|------|-------|---------|
| **Inter** | Body text, UI, inputs | 300, 400, 500, 600, 700 |
| **Space Grotesk** | Headings, display text, titles | 400, 500, 600, 700 |

Loaded from Google Fonts via `<link>` in `index.html`.

### UI Components (CSS Classes)

| Class | Effect |
|-------|--------|
| `.glass` | Frosted glass: `rgba(26,27,30,0.8)` + `backdrop-filter: blur(20px)` + subtle border |
| `.glass-hover` | Hover: lighter bg + blue-tinted border |
| `.neon-text` | Cyan text-shadow glow |
| `.neon-border` | Cyan box-shadow glow (inner + outer) |
| `.gradient-text` | 3-color gradient text (cyan → purple → pink) |
| `.btn-primary` | Gradient bg, shadow, hover lift (-2px) |
| `.btn-secondary` | Semi-transparent dark bg, border, hover glow |
| `.card` | Rounded 2xl, subtle border, hover lift (-4px) + shadow |
| `.scan-line` | Animated horizontal gradient line (scanning effect) |
| `.avatar-glow` | Dual-color box-shadow (cyan + purple) |
| `.world-grid` | CSS grid-line pattern background |

### Animations (Tailwind config)

| Name | Duration | Effect |
|------|----------|--------|
| `glow` | 2s infinite alternate | Pulsing cyan box-shadow |
| `float` | 6s infinite ease | Vertical floating (±20px) |
| `scan` | 2s linear infinite | Vertical translate -100% to 100% |

---

## User Preferences & Decisions

- **Dark theme only** — entire app uses dark-900 background, no light mode
- **Neon cyberpunk aesthetic** — glowing accents, wireframe effects, glass morphism
- **"Real, not game characters"** — avatars must replicate real bodies, not stylized game characters
- **Shopping focus on wearables/clothing** — the core use case is trying on clothes with accurate fit
- **No real-world location mimicry required** — virtual world can be fantastical/futuristic
- **Combines metaverse + MMO + e-commerce** — social, immersive, but with real product delivery
- **User does not code** — everything must be built and explained simply
- **Minimal permissions asked** — avoid interrupting with choices when possible

---

## Pages & Routes

| Route | Page | Layout | Description |
|-------|------|--------|-------------|
| `/` | LandingPage | None (standalone) | Marketing hero with 3D avatar, features, stats, CTA |
| `/auth` | AuthPage | None (standalone) | Login/signup toggle form |
| `/create-avatar` | AvatarCreator | Navbar | 4-step wizard (Scan → Measurements → Appearance → Preview) |
| `/world` | VirtualWorld | Navbar | Full-viewport 3D world with HUD overlay |
| `/store/:storeId` | StorePage | Navbar | Product grid for a store (`:storeId` = `all` for everything) |
| `/product/:productId` | ProductPage | Navbar | Product detail with 3D try-on |
| `/cart` | CartPage | Navbar | Shopping cart with order summary |
| `/profile` | ProfilePage | Navbar | User dashboard, avatar info, orders |

All pages are **lazy-loaded** with `React.lazy()` and wrapped in `<Suspense>` with `LoadingScreen`.

---

## State Management (Zustand)

### `useAuthStore`
- `user`, `token`, `isAuthenticated`
- `login(user, token)` — stores JWT in localStorage
- `logout()` — clears localStorage
- `updateUser(partial)` — merges user updates

### `useAvatarStore`
- `avatar`, `scanStep` (0–3), `isScanning`, `measurements`
- `updateMeasurements(partial)` — merges measurement fields
- `resetScan()` — resets to step 0

### `useCartStore`
- `items: CartItem[]` — product + size + color + quantity
- `addItem` — merges quantity if same product/size/color exists
- `removeItem`, `updateQuantity`, `clearCart`
- `total()` — computed sum

### `useWorldStore`
- `currentLocation`, `playerPosition`, `isLoading`, `connectedUsers`
- Simple setters for each field

---

## API Endpoints

**Base**: `/api` (proxied from client port 3000 → server port 5000)

### Auth (`/api/auth`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Create user, return JWT |
| POST | `/login` | No | Verify credentials, return JWT |
| GET | `/profile` | Yes | Get user with populated avatar |
| PUT | `/profile` | Yes | Update name, addresses, preferences |

### Avatars (`/api/avatars`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Yes | Create avatar with photo upload (up to 4 images) |
| GET | `/:id` | Yes | Get avatar |
| PUT | `/:id` | Yes | Update measurements/appearance |
| GET | `/:id/measurements` | Yes | Get measurements only |
| GET | `/:avatarId/size-recommendation/:productId` | Yes | Get recommended size + confidence |

### Products (`/api/products`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | List with ?category, ?brand, ?page, ?limit |
| GET | `/:id` | No | Get by ID |
| GET | `/search` | No | Full-text search (?q=) |
| GET | `/categories` | No | Returns category enum list |

### Stores (`/api/stores`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | List all active stores |
| GET | `/:id` | No | Get store by ID |

### Orders (`/api/orders`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Yes | Create order (auto-calculates tax 8%, free shipping >$100) |
| GET | `/` | Yes | List user's orders |
| GET | `/:id` | Yes | Get order detail |

### Try-On (`/api/try-on`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/simulate` | Yes | Returns fit analysis per body area (chest/waist/hips/shoulders/length/sleeves) |

### Other
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Server health check |

### Socket.IO Events
- `player:move` → broadcasts `player:moved` to others
- `player:enterStore` → joins room, emits `store:userCount`
- `users:count` — broadcast on connect/disconnect

---

## Database (MongoDB + Mongoose)

**Connection**: Falls back gracefully if MongoDB is unavailable — all product/store routes return hardcoded sample data.

### Measurement Fields (Avatar)
`height`, `weight`, `chest`, `waist`, `hips`, `shoulders`, `inseam`, `armLength`, `neckCircumference`, `shoeSize` — all in metric (cm/kg/EU shoe).

### Size Recommendation Algorithm
Averages chest + waist + hips, maps to: <78→XS, <85→S, <93→M, <101→L, <110→XL, else→XXL.

---

## Virtual World Layout

The 3D world is organized in a compass layout around a **central plaza**:

- **Center**: Plaza with holographic fountain (3 glowing rings), beacon pillar, directional signs
- **North**: Fashion District — AETHON, NOVA STYLE, CIPHER
- **East**: Luxury Avenue — OBSIDIAN, PRISM, AURELIUS
- **South**: Streetwear Hub — FLUX, RIOT, VORTEX
- **West**: Shoe Gallery — SOLE, STRIDE

Each store has: neon sign, glass front, accent light strips, entrance glow, floating particles. Connected by pathways with street lamps.

**Visual effects**: Star sky, fog (30–150 range), reflective ground plane, neon grid, sparkle particles (200 count), point lights per district with unique colors.

---

## 11 Virtual Stores

| Store | Accent Color | Style | Categories |
|-------|-------------|-------|------------|
| AETHON | #ff6bcb (pink) | Modern | Outerwear, Tops |
| NOVA STYLE | #00d4ff (cyan) | Modern | Dresses, Tops |
| CIPHER | #b249f8 (purple) | Street | Bottoms, Tops |
| OBSIDIAN | #d4af37 (gold) | Luxury | Tops, Accessories |
| PRISM | #e0e0e0 (silver) | Luxury | Tops, Bottoms |
| AURELIUS | #c9a96e (bronze) | Luxury | Outerwear |
| FLUX | #05ffa1 (green) | Street | Tops, Shoes |
| RIOT | #ff4444 (red) | Street | Tops, Outerwear |
| VORTEX | #ffaa00 (orange) | Street | Tops, Bottoms, Shoes |
| SOLE | #00d4ff (cyan) | Modern | Shoes |
| STRIDE | #b249f8 (purple) | Modern | Shoes |

---

## 8 Sample Products

| Product | Brand | Category | Price |
|---------|-------|----------|-------|
| Neo Horizon Jacket | AETHON | Outerwear | $289 |
| Flux Runner Tee | FLUX | Tops | $68 |
| Prism Tailored Suit | PRISM | Tops | $1,250 |
| Cipher Street Joggers | CIPHER | Bottoms | $95 |
| Aurora Flow Dress | NOVA STYLE | Dresses | $420 |
| Sole Quantum Runner | SOLE | Shoes | $195 |
| Aurelius Cashmere Coat | AURELIUS | Outerwear | $1,800 |
| Riot Graphic Hoodie | RIOT | Tops | $120 |

---

## Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | React + TypeScript | 18.2 / 5.3 |
| Build Tool | Vite | 5.0 |
| 3D Engine | Three.js + React Three Fiber + Drei | 0.160 / 8.15 / 9.92 |
| Styling | Tailwind CSS | 3.4 |
| State | Zustand | 4.5 |
| HTTP | Axios | 1.6 |
| Backend | Express | 4.18 |
| Database | MongoDB + Mongoose | 8.1 |
| Auth | JWT + bcrypt | 9.0 / 2.4 |
| Realtime | Socket.IO | 4.7 |
| Payments (planned) | Stripe | 14.14 |
| Body Tracking (planned) | MediaPipe Pose + Face Mesh | 0.5 / 0.4 |
| Physics (planned) | cannon-es | 0.20 |
| File Upload | Multer + Sharp | 1.4 / 0.33 |

---

## How to Run

```bash
cd real-me
npm install             # Root deps (concurrently)
npm run install:all     # Client + server deps
npm run dev             # Starts client (:3000) + server (:5000)
```

MongoDB is optional — the app falls back to sample data if unavailable.

---

## GitHub

- **Repo**: https://github.com/LukeCode-dev/real-me
- **Owner**: LukeCode-dev (gsuperiorth@gmail.com)
- **Branch**: master
- **License**: MIT
