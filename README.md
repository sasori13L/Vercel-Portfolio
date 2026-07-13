# Lorie Jean Estrera De Castro — Portfolio

A static one-page portfolio site (plain HTML/CSS/JS, no build step) built from Lorie Jean Estrera De Castro's resume.

## Files
- `index.html` — page content
- `style.css` — design system ("employment ledger" theme)
- `script.js` — mobile nav + scroll-reveal animation

## Deploy to Vercel

### Option A — push to your existing GitHub repo, then import
```bash
git init
git remote add origin https://github.com/sasori13L/lorie-jean-portfolio.git
git add .
git commit -m "Initial portfolio site"
git branch -M main
git push -u origin main
```
Then in Vercel: **Add New → Project → Import** the `lorie-jean-portfolio` repo.
Framework preset: **Other** (static site) — no build command, no output directory needed.
Click **Deploy**.

### Option B — deploy directly from this folder with Vercel CLI
```bash
npm i -g vercel
cd path/to/this/folder
vercel
```
Follow the prompts (link/create project, accept defaults) and it will give you a live URL.

## Editing later
- Update text directly in `index.html`.
- Colors, type, and spacing are all defined as CSS variables at the top of `style.css` under `:root`.
