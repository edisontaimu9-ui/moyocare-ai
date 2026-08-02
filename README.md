# MoyoCare AI

A real, installable PWA — not a phone-frame mockup. It fills the actual
viewport (capped at a comfortable mobile width, centered on wider screens)
and is installable via the browser's "Add to Home Screen" / install prompt,
with an offline-capable service worker via `vite-plugin-pwa`.

`src/App.jsx` is the app shell (theme state, tab routing, bottom nav).
Screens live in `src/screens/`, reusable UI in `src/components/`, design
tokens in `src/theme/`, and mock data in `src/data/` — replace the data
layer with real Chakudya API calls as you wire up each screen.

## Termux setup

```
pkg install nodejs-lts -y
cd ~/moyocare-ai
npm install
npm run dev
```

`npm run dev` starts a local server (prints a URL like `http://localhost:5173`)
— open it in the Termux browser or any browser on the same device.

Note: the PWA install prompt and service worker only activate on a built
`npm run preview` or the deployed site — `npm run dev` doesn't register
the service worker by default.

## Deploy to GitHub Pages (via GitHub Actions)

One-time:

```
cd ~/moyocare-ai
git init
git add .
git commit -m "Initial MoyoCare AI PWA"
git branch -M main
git remote add origin https://github.com/edisontaimu9-ui/moyocare-ai.git
git push -u origin main
```

Then in the repo on GitHub: **Settings → Pages** → under "Build and
deployment," set **Source** to **GitHub Actions**.

From then on, every `git push` to `main` triggers `.github/workflows/deploy.yml`,
which installs dependencies, runs `npm run build`, and publishes `dist/` to
Pages automatically. No local build step needed — just push. Check the
**Actions** tab on GitHub to watch a deploy in progress or see why one failed.

If you want a custom domain, add a `CNAME` file inside `public/` containing
just the domain — Vite copies anything in `public/` into `dist/` unchanged.

## PWA icons

`public/icons/` holds the generated app icons (192, 512, maskable, and
Apple touch icon), derived from the MoyoMark logo. Swap these for real
branded artwork whenever you're ready — same filenames, same sizes, and
`vite.config.js` picks them up automatically.

## Adding features step by step

Everything in `src/data/` is static mock data (fake AI responses, fake
disease/medicine detail, fake search results). As you wire up real
functionality — Chakudya API food search, the AI assistant, auth, etc. —
replace the data-layer calls in the relevant screen with real `fetch()`
calls to your Chakudya endpoints. The design tokens (`TOKENS`) and
primitives (`Card`, `Chip`, `SectionLabel`, `TopBar`, `BottomNav`) in
`src/theme/` and `src/components/` are the styling backbone — reuse them
for any new UI so everything stays visually consistent.
