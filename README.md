# Systems to Scale

> **Understand the mechanism, not just the steps.**

A modern engineering platform and technical publication that deconstructs scaled software architectures, distributed workflows, and execution mechanisms down to their foundational principles.

[![React](https://img.shields.io/badge/React-19.2-black?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-black?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-black?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-black?style=flat-square&logo=greensock)](https://greensock.com/)
[![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-black?style=flat-square)](https://github.com/darkroomengineering/lenis)

---

## Overview

Most technical content describes *what* to do. **Systems to Scale** deconstructs *how systems physically execute* — the distributed locks, state reconciliation, second-price auction clearings, DOM tree compilation passes, and tokenization protocols that power scalable software.

The platform marries a stealth, high-contrast monochrome blueprint aesthetic with hardware-accelerated WebGL visuals and interactive sandboxes that allow engineers to observe execution mechanisms in real time.

---

## Key Features

### 1. 🌌 Interactive 3D Galaxy Hub
- Built with **Three.js** and procedural shader geometry.
- Interactive constellation model mapping disciplines in 3D coordinate space.
- Mouse-driven gravitational parallax, focal convergence, and kinetic raycasting.

### 2. ⚡ Cinematic Blueprint Topic Cards
- **Stealth Standby Mode:** Subdued monochrome blueprint aesthetic with faint hairline borders, low-alpha typography (`opacity: 0.22`), and subtle inset breathing glow.
- **Dynamic Ignition Sequence:** Moving over a card triggers a synchronized sequence:
  - Topline laser streak & specular scanline sweep.
  - Cryptographic status decryption scrambler.
  - Word-safe letter-by-letter kinetic text reveal (`--ci` hardware-accelerated CSS variables).
  - Multi-node pipeline shockwaves and spring overshoots.
  - Live telemetry counters and dynamic progress bar fills.
  - Canvas constellation particle links and packet transfer streams.
- **Mutual Exclusivity:** Fluid transitions between cards with zero layout shift and instant cleanup on pointer exit.

### 3. 🔬 Interactive Mechanism Sandboxes
- Step-by-step workflow simulators for mission-critical engineering pipelines.
- Real-time technical execution logs, state mutations, and throughput metrics.
- Visual demonstration of bottlenecks, idempotent retries, and failure recoveries.

### 4. 📚 Eight Core Engineering Disciplines
- **AI & Automation:** Webhook intake, schema validation, worker mutex locks, and WAL settlement.
- **Marketing & Ads:** Sub-15ms RTB ingress, consent graph lookup, Vickrey second-price auctions, and paint telemetry.
- **Web Design:** Critical rendering path, lexical tokenization, CSSOM/DOM layout, and GPU compositor textures.
- **E-commerce:** Zero-knowledge tokenization, 3-D Secure biometric vaults, ML anomaly scoring, and 2-phase capture.
- **Customer Service:** Omnichannel triage, vector intent NLP, self-service deflection, and SLA escalation.
- **Virtual Assistance:** Follow-the-sun timezone orbits, SOP rubric matching, and asynchronous context preservation.
- **Pitch Decks:** Structural narrative pacing, mechanism clarity, unit economics, and investor conviction.
- **Personal Assistance:** Constraint-solver arbiters, protected calendar freezes, and inbox zero protocols.

### 5. 🔍 Client-Side Fuzzy Search Overlay
- Instant modal overlay powered by **Fuse.js**.
- Keyboard-accessible trigger (`⌘K` / `Ctrl+K` or `/`).
- Multi-field search across titles, slugs, categories, hooks, and mechanism tags.

### 6. 📜 Fluid Momentum Scrolling
- Integrated **Lenis** smooth scrolling coupled with **GSAP ScrollTrigger**.
- Native scroll physics preservation with GPU-accelerated layer transitions.
- Full accessibility support honoring `prefers-reduced-motion`.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React 19 + TypeScript | Component architecture & strict type safety |
| **Bundler** | Vite 8 + Rolldown | Sub-second HMR and production bundle optimization |
| **3D & Canvas** | Three.js + Canvas 2D | Interactive galaxy hero & constellation particle engines |
| **Animation** | GSAP 3 + ScrollTrigger | Timeline choreography & scroll-driven activations |
| **Smooth Scroll** | Lenis | Inertial momentum scrolling |
| **Search Engine**| Fuse.js | Client-side weighted fuzzy search |
| **Icons** | Lucide React | High-legibility monochrome engineering icons |
| **Routing** | React Router v7 | Seamless client-side page routing |
| **Linter** | Oxlint | High-speed Rust-based linting |

---

## Project Structure

```
systems-to-scale/
├── public/                 # Static assets & favicon
├── src/
│   ├── assets/             # Brand logos & imagery
│   ├── components/
│   │   ├── galaxy/         # Three.js 3D Galaxy hero engine
│   │   │   └── GalaxyHero.tsx
│   │   ├── layout/         # Header, Footer, and Search modal
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── SearchOverlay.tsx
│   │   ├── sections/       # Primary landing page sections
│   │   │   ├── TopicTrailers.tsx      # Blueprint topics grid
│   │   │   ├── CaseStudies.tsx        # Mechanism sandbox simulators
│   │   │   ├── FeaturedArticles.tsx   # Curated architectural articles
│   │   │   ├── Misconceptions.tsx     # Common industry myths debunked
│   │   │   └── NewsletterCta.tsx      # Dispatch subscription
│   │   └── ui/             # Reusable UI primitives
│   │       ├── TopicCinematicCard.tsx # Kinetic card component
│   │       ├── TopicCinematicCard.css # Precision keyframes & delays
│   │       ├── TopicSchematics.tsx    # Technical node diagrams
│   │       ├── Button.tsx
│   │       ├── BrandLogos.tsx
│   │       └── StsLogo.tsx
│   ├── data/               # Structured data & registries
│   │   ├── topics.ts                  # Topics metadata
│   │   ├── case-studies.ts            # Simulation step data
│   │   ├── slug-registry.ts           # Unified cross-linking registry
│   │   └── misconceptions.ts          # Technical teardowns
│   ├── pages/              # Routed views
│   │   ├── HomePage.tsx
│   │   ├── TopicsHubPage.tsx
│   │   ├── TopicDetailPage.tsx
│   │   ├── ArticlesPage.tsx
│   │   ├── ArticleDetailPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── CommunityPage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── SubscribePage.tsx
│   │   └── LegalPage.tsx
│   ├── styles/             # Global tokens & CSS variables
│   │   └── design-system.css
│   ├── App.tsx             # Root router & layout wrapper
│   ├── main.tsx            # Vite entry point
│   └── index.css           # Global typography & base resets
├── index.html              # HTML shell & SEO meta tags
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build & plugin settings
```

---

## Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher) or **pnpm** / **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/taoqeersarwerco-arch/systems-to-scale.git
   cd systems-to-scale
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

6. **Lint the codebase:**
   ```bash
   npm run lint
   ```

---

## Design System & Principles

- **Monochrome Precision:** Uses deep `#080808` dark backgrounds, crisp `#FFFFFF` flares, and calibrated grayscale tones (`rgba(255, 255, 255, 0.035)` to `0.85`).
- **Typography Tokens:**
  - `var(--sts-font-display)`: Clean modern sans-serif for impact headers.
  - `var(--sts-font-body)`: Highly legible sans-serif for editorial content.
  - `var(--sts-font-mono)`: Tabular monospace font for code, timestamps, and metrics.
- **Hardware Acceleration:** All micro-animations use `transform` and `opacity` exclusively to ensure consistent 60 FPS performance.
- **Reduced Motion Support:** All animations gracefully step down when `prefers-reduced-motion` is detected in system settings.

---

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).
