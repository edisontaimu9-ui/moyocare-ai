# MoyoCare AI — mockup

Vite + React mockup. `src/MoyoCareAI.jsx` is the design file, untouched from
the original — all screens (Home, Assistant, Nutrition, Medical, Profile)
render from it via `src/main.jsx`.

## Termux setup

```
pkg install nodejs-lts -y
cd ~/moyocare-ai
npm install
npm run dev
```

`npm run dev` starts a local server (prints a URL like `http://localhost:5173`)
— open it in the Termux browser or any browser on the same device.

## Deploy to GitHub Pages (via GitHub Actions)

One-time:

```
cd ~/moyocare-ai
git init
git add .
git commit -m "Initial MoyoCare AI mockup"
git branch -M main
git remote add origin https://github.com/edisontaimu9-ui/moyocare-ai.git
git push -u origin main
```

Then in the repo on GitHub: **Settings → Pages** → under "Build and
deployment," set **Source** to **GitHub Actions**.

From then on, every `git push` to `main` triggers `.github/workflows/deploy.yml`,
which installs dependencies, runs `npm run build`, and publishes `dist/` to
Pages automatically. No local build or `npm run deploy` step needed — just
push. Check the **Actions** tab on GitHub to watch a deploy in progress or see
why one failed.

If you want a custom domain, add a `CNAME` file inside `public/` containing
just the domain — Vite copies anything in `public/` into `dist/` unchanged.

## Adding features step by step

Everything currently in `src/MoyoCareAI.jsx` is static mock data (fake
messages, fake macros, fake search results). As you wire up real
functionality — Chakudya API food search, the AI assistant, auth, etc. — you
can either edit this file directly or split screens out into their own files
under `src/` and import them back into `MoyoCareAI.jsx`. The design tokens
(`TOKENS` object) and primitives (`Card`, `Pill`, `SectionLabel`, `TopBar`,
`BottomNav`) at the top of the file are the styling backbone — reuse them for
any new UI so everything stays visually consistent.
