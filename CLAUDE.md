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
├── mobile/                             # React Native Expo mobile scanner app
│   ├── src/
│   │   ├── screens/                    # 12 screens (splash, auth, scan flow, profile, settings)
│   │   ├── components/
│   │   │   ├── scan/                   # 8 scan overlay components (body outline, face oval, capture btn, etc.)
│   │   │   ├── ui/                     # 8 reusable UI components (button, input, glass card, etc.)
│   │   │   └── onboarding/            # Onboarding slide component
│   │   ├── services/                   # API client + scanner processing service
│   │   ├── store/                      # Zustand stores (auth + scan)
│   │   ├── hooks/                      # Camera, animation, haptics hooks
│   │   ├── utils/                      # Measurements + helpers
│   │   └── constants/                  # Theme + app constants
│   ├── App.tsx                         # Entry point with font loading
│   ├── app.json                        # Expo config with permissions
│   ├── package.json                    # Expo SDK 51 dependencies
│   └── eas.json                        # EAS Build profiles
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

### Mobile Scanner App

```bash
cd real-me/mobile
npm install             # Install Expo + RN dependencies
npx expo start          # Start Expo dev server
# Then: press 'i' for iOS simulator, 'a' for Android emulator, or scan QR with Expo Go
```

---

## Mobile Scanner App (React Native + Expo)

### Overview

A dedicated **React Native (Expo SDK 51)** mobile app for body and face scanning. Uses smartphone cameras (higher res, LiDAR/depth sensors, ARKit/ARCore) instead of webcams for superior 3D body capture. Scan data syncs to the user's Real Me account and generates their avatar on the web platform.

**Flow**: Sign up → Onboarding → Prepare (scan guide) → Body Scan (4 angles) → Face Scan (3 expressions) → Processing → Results → Upload to server → Avatar appears on web

### Mobile Folder Structure

```
mobile/
├── App.tsx                              # Expo Router entry, font loading, providers
├── app.json                             # Expo config: permissions, splash, plugins
├── package.json                         # Expo SDK 51 + all RN dependencies
├── babel.config.js                      # Expo preset + reanimated plugin
├── metro.config.js                      # Default Expo metro config
├── tsconfig.json                        # Strict TS, path aliases (@/*)
├── eas.json                             # EAS Build profiles (dev/preview/production)
├── .env.example                         # API_URL, ENVIRONMENT
├── assets/
│   ├── fonts/                           # Inter + Space Grotesk .ttf files (to be added)
│   └── images/                          # App icon, splash (to be added)
└── src/
    ├── constants/
    │   ├── theme.ts                     # Full design system (colors, typography, spacing, shadows, gradients, glass)
    │   └── index.ts                     # Scan steps, measurement defs, API endpoints, storage keys, app config
    ├── screens/
    │   ├── _layout.tsx                  # Stack navigator with all 11 screens, dark headers, animated transitions
    │   ├── index.tsx                    # Splash/Welcome: animated RM logo, particles, grid bg, "Get Started" CTA
    │   ├── onboarding.tsx              # 3-step swiper: Scan Body → Digital Twin → Shop With Confidence
    │   ├── login.tsx                    # Email/password form in glass card, JWT auth
    │   ├── signup.tsx                   # Full registration with password strength indicator
    │   ├── home.tsx                     # Dashboard: greeting, avatar status, quick actions, stats
    │   ├── scan-guide.tsx              # Pre-scan checklist: tips, camera permission, lighting check
    │   ├── body-scan.tsx               # CORE: 4-angle camera capture (front/right/back/left) with SVG body overlay
    │   ├── face-scan.tsx               # 3-phase selfie capture (neutral/smile/profile) with face oval overlay
    │   ├── scan-processing.tsx         # Animated processing: wireframe rotation, scan line, particles, progress
    │   ├── scan-results.tsx            # Results: confetti, measurements grid (editable), accuracy score, save CTA
    │   ├── profile.tsx                 # User profile, digital twin card, scan history, size reference
    │   └── settings.tsx                # Account, preferences (units/quality/haptics), privacy, about, sign out
    ├── components/
    │   ├── scan/
    │   │   ├── BodyOutline.tsx          # SVG body silhouette (front/side/back) with marching-ants animation
    │   │   ├── FaceOval.tsx             # SVG face oval with color states (blue/green/red) + corner markers
    │   │   ├── ScanProgressBar.tsx      # Step progress with gradient fill, checkmarks, pulse animation
    │   │   ├── CaptureButton.tsx        # 70px circular button with glow ring, progress ring, haptics
    │   │   ├── ScanInstruction.tsx      # Animated pill overlay with icon + instruction text crossfade
    │   │   ├── AlignmentGuide.tsx       # Directional arrows + "Perfect!" feedback, color-coded
    │   │   ├── ProcessingOverlay.tsx    # Full-screen: rotating wireframe, scan line, particles, progress %
    │   │   ├── MeasurementCard.tsx      # Glass card: label, value, unit, confidence dot, tap-to-edit
    │   │   └── index.ts                # Barrel export
    │   ├── ui/
    │   │   ├── Button.tsx               # Primary (gradient)/secondary (outline)/ghost, 3 sizes, loading, haptics
    │   │   ├── Input.tsx                # Dark input with animated focus glow, error state, icons
    │   │   ├── GlassCard.tsx            # Semi-transparent card with optional neon border, blur (iOS)
    │   │   ├── Header.tsx               # Screen header: back button, title, optional right action
    │   │   ├── ProgressRing.tsx         # SVG circular progress with color shifts (red→yellow→blue→green)
    │   │   ├── Badge.tsx                # Status pill: success/warning/error/info/purple + optional pulse
    │   │   ├── Toggle.tsx               # Custom switch: dark track, neon-blue active, spring animation
    │   │   └── SettingsRow.tsx          # Settings list item: icon, label, description, right action
    │   └── onboarding/
    │       └── OnboardingSlide.tsx      # Slide with gradient icon, masked gradient title, description
    ├── services/
    │   ├── api.ts                       # Axios client: JWT from SecureStore, auth/scan/avatar endpoints
    │   └── scanner.ts                   # Mock scanner: processScanImages, calculateMeasurements, validateQuality, generateMesh
    ├── store/
    │   ├── authStore.ts                 # Zustand: user, token, login/register/logout, SecureStore persistence
    │   ├── scanStore.ts                 # Zustand: scan workflow, photos, steps, processing, measurements
    │   └── index.ts                     # Barrel export
    ├── hooks/
    │   ├── useCamera.ts                 # Camera wrapper: permissions, takePicture, flash, switch front/back
    │   ├── useScanAnimation.ts          # Reanimated shared values: scan line, pulse, progress, flash
    │   └── useHaptics.ts                # Haptic feedback: light/medium/heavy tap, success/error/warning
    └── utils/
        ├── measurements.ts              # Unit conversion, validation, body type estimation, size mapping
        └── helpers.ts                   # formatDate, getGreeting, generateId, delay, clamp, interpolateColor
```

### Mobile Design System

Same cyberpunk neon aesthetic as the web client:
- **Colors**: Same dark palette (dark-900 #101113 through dark-50), same neon accents (blue/purple/pink/green)
- **Fonts**: Inter (body) + Space Grotesk (headings) — loaded via expo-font
- **Glass morphism**: iOS uses backdrop blur; Android uses solid dark fallback
- **Gradients**: Same blue→purple primary gradient via expo-linear-gradient
- **Haptics**: Integrated throughout (button presses, captures, toggles, navigation)

### Mobile Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React Native + Expo | SDK 51 |
| Navigation | Expo Router (file-based) | 3.5 |
| Camera | expo-camera | ~15.0 |
| ML/Vision | react-native-vision-camera | ~4.0 |
| Drawing | @shopify/react-native-skia | ~1.0 |
| SVG | react-native-svg | 15.2 |
| Animation | react-native-reanimated | ~3.10 |
| Gestures | react-native-gesture-handler | ~2.16 |
| State | Zustand | ^4.5 |
| HTTP | Axios | ^1.6 |
| Secure Storage | expo-secure-store | ~13.0 |
| Sensors | expo-sensors (light/gyro) | ~13.0 |
| Haptics | expo-haptics | ~13.0 |
| Gradient | expo-linear-gradient | ~13.0 |
| Build | EAS Build | latest |

### Body Scan Flow (4 phases)

| Phase | Camera | Overlay | Instruction |
|-------|--------|---------|-------------|
| 1. Front | Back | Full body silhouette (front) | "Stand facing the camera" |
| 2. Right | Back | Body silhouette (side) | "Turn to your right side" |
| 3. Back | Back | Body silhouette (back) | "Turn around, back to camera" |
| 4. Left | Back | Body silhouette (side) | "Turn to your left side" |

Each phase: 3-second alignment timer → auto-capture → haptic feedback → green checkmark → next phase.

### Face Scan Flow (3 phases)

| Phase | Camera | Overlay | Instruction |
|-------|--------|---------|-------------|
| 1. Neutral | Front | Face oval | "Look straight, neutral expression" |
| 2. Smile | Front | Face oval | "Give a natural smile" |
| 3. Profile | Front | Face oval | "Slowly turn head to your right" |

Includes: face detection indicator, distance feedback, lighting quality bar.

### Mobile ↔ Web Integration

- Same JWT auth system — login on mobile, token works on web
- Scan photos upload to server via `/api/avatars` (FormData, up to 4 body + 3 face photos)
- Measurements sync to the same Avatar model in MongoDB
- Avatar appears in the web Virtual World after mobile scan completes
- Deep link `realme://` scheme for web↔mobile navigation

---

## GitHub

- **Repo**: https://github.com/LukeCode-dev/real-me
- **Owner**: LukeCode-dev (gsuperiorth@gmail.com)
- **Branch**: master
- **License**: MIT
