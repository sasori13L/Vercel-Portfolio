# Lemuel De Castro — Portfolio (v2, light & interactive)

A static one-page portfolio. No build step, no dependencies — just `index.html`, `style.css`, `script.js`, and `icons-data.js` (brand logo data, sourced from the simple-icons library and inlined so the page has zero runtime dependencies).

## What's interactive here

- **Command palette** — click "Jump to…" in the nav, or press `/` anywhere on the page, to jump to a section, copy the email, or open LinkedIn.
- **Stack section** — filter by category with the chips, and hover any logo to see it light up in its real brand color.
- **Experience** — click a role to expand its details; the bar next to each date is a rough visual of how long that role lasted relative to the others.
- **Contact card** — click the email card to copy the address to your clipboard.

## Deploy to Vercel

**Option A — Vercel dashboard (no install needed)**
1. Go to https://vercel.com/new
2. Drag and drop this folder (or a zip of it)
3. Framework preset: "Other" — no build command needed
4. Click Deploy

**Option B — Vercel CLI**
```bash
npm i -g vercel
cd portfolio-v2
vercel
```

**Option C — GitHub**
1. Push this folder to a GitHub repo
2. In Vercel, "Add New Project" → import the repo → deploy (preset "Other")

## Editing content

All visible text lives in `index.html`, inside each `<section>`. The stack logos are generated from the `STACK` array at the top of `script.js` — add or remove a `{ slug: "..." }` entry to change what shows (the slug must exist as a key in `icons-data.js`), or use `{ text: "..." }` for a plain chip when there's no logo.

Colors, type, and spacing are CSS custom properties at the top of `style.css` under `:root`.
