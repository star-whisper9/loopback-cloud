# Loopback Cloud

A satirical "cloud computing" platform that runs entirely on `127.0.0.1`. Provision your own loopback instance, run speed tests against localhost at "quantum-grade" speeds, and manage firewall rules that protect absolutely nothing.

## Tech Stack

- **Framework**: React Router v8 (SSR mode)
- **UI**: HeroUI v3 + Tailwind CSS v4
- **Animation**: Motion (Framer Motion)
- **Language**: TypeScript
- **Testing**: Vitest
- **Runtime**: Node.js (production server via `@react-router/serve`)

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Project Structure

```
app/
├── components/
│   ├── Hero/              # Landing hero with spotlight + beams effects
│   ├── Navbar/            # Sticky navigation bar
│   ├── Pricing/           # Pricing cards (Community / Enterprise)
│   ├── SellingPoints/     # Feature cards with glare effect
│   ├── CTA/               # Call-to-action section
│   ├── ProvisioningForm/  # Modal form to create a loopback instance
│   ├── LangSwitch/        # Language toggle (zh / en)
│   └── console/
│       ├── ConsoleLayout.tsx      # Console shell (tabs, header, power controls)
│       ├── Dashboard/             # Instance overview + metrics
│       ├── SpeedTest/             # Simulated speed test (respects bandwidth tier)
│       ├── Firewall/              # Firewall rule management
│       └── ProvisioningAnimation.tsx  # Boot/shutdown step animation
├── i18n/
│   ├── zh.ts              # Chinese translations
│   └── en.ts              # English translations
├── lib/
│   ├── machineTypes.ts    # Machine data model + constants
│   ├── machineStore.ts    # localStorage persistence
│   ├── useMachine.tsx     # Machine state context + actions
│   └── utils.ts           # Utility functions (cn, etc.)
└── routes/
    ├── home.tsx           # Landing page route (/)
    └── console.tsx        # Console route (/console)
components/               # shadcn/ui-inspired components
├── ui/
│   ├── background-beams.tsx
│   ├── spotlight.tsx
│   ├── hover-border-gradient.tsx
│   ├── moving-border.tsx
│   ├── evervault-card.tsx
│   └── ...
public/                   # Static assets (OS icons, images)
```

## Scripts

| Command             | Description               |
| ------------------- | ------------------------- |
| `npm run dev`       | Start dev server with HMR |
| `npm run build`     | Production build          |
| `npm start`         | Start production server   |
| `npm test`          | Run Vitest tests          |
| `npm run typecheck` | TypeScript type checking  |

## SSR Notes

This project uses React Router v8's SSR mode (`ssr: true`). Key considerations:

- **`useHydratedMachine()`**: Home page components use this hook to avoid hydration mismatches. It returns `null` until client-side hydration completes, ensuring server and client render identical HTML.
- **`useMachine()`**: Console-side components use this directly since `clientLoader` guards the route and sync-initializes from `localStorage`.
- **`clientLoader` + `HydrateFallback`**: The `/console` route uses these to redirect unauthenticated users and show a loading spinner during hydration.

## Docker

```bash
docker build -t loopback-cloud .
docker run -p 3000:3000 loopback-cloud
```
