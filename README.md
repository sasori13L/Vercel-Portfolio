# Lyla Chairein Quintana — Portfolio

A static one-page portfolio site (plain HTML/CSS/JS, no build step) built from Lyla Chairein Quintana's resume — Construction Estimator / Quantity Surveyor.

## Files
- `index.html` — page content
- `style.css` — design system ("employment ledger" theme, reused from an earlier build)
- `script.js` — mobile nav + scroll-reveal animation

## Projects section
The `#projects` section currently uses placeholder thumbnails (dashed pattern + "Image coming soon" icon) for three sample projects. To swap in real photos:

1. Drop your image files into the project folder (e.g. `images/project-1.jpg`).
2. In `index.html`, find each `<div class="project-thumb placeholder-thumb">` block and replace it with:
   ```html
   <img class="project-thumb" src="images/project-1.jpg" alt="Short description of the project">
   ```
3. Optionally delete the now-unused `.placeholder-thumb` styles in `style.css` once every project has a real image.

## Deploy to Vercel

### Option A — push to a GitHub repo, then import
```bash
git init
git remote add origin https://github.com/<your-username>/<your-repo>.git
git add .
git commit -m "Initial portfolio site"
git branch -M main
git push -u origin main
```
Then in Vercel: **Add New → Project → Import** your repo.
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