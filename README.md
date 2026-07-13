# Lemuel De Castro — Portfolio

A static one-page portfolio site (plain HTML/CSS/JS, no build step) built from Lemuel De Castro's resume.
Design concept: work history as a `git log`, skills as a `stack.json` package file, hero and contact as terminal windows.

## Files
- `index.html` — page content
- `style.css` — design system (terminal / diff / package-file theme)
- `script.js` — mobile nav + scroll-reveal animation

## Deploy to Vercel (updating this repo)

```bash
git add .
git commit -m "Rebuild portfolio for Lemuel De Castro"
git push origin main
```

Vercel is already connected to `sasori13L/Vercel-Portfolio` (live at loriejean-portfolio.vercel.app per the repo's About link) — pushing to `main` will trigger a redeploy automatically.

If you'd rather deploy this as a separate site instead of overwriting the existing one:
```bash
npm i -g vercel
cd path/to/this/folder
vercel --prod
```
This creates a new Vercel project without touching the existing deployment.

## Editing later
- Update text directly in `index.html`.
- Colors, type, and spacing are all defined as CSS variables at the top of `style.css` under `:root`.