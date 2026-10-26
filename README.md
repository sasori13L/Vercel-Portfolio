# Lemuel De Castro — Portfolio

A responsive portfolio built with Next.js 14, React, and TypeScript. It includes an interactive experience timeline, a filterable technology stack, and a keyboard accessible command palette.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site. Create a production build with `npm run build`, then serve it with `npm start`.

## Branding

The header logo is `public/logo.svg`. The browser favicon is `public/favicon.svg`; both use the site's LD monogram and blue and orange palette. Update these SVG files together to keep the header mark and favicon in sync.

## Project structure

- `app/page.tsx` — portfolio content and interactive elements
- `app/page.module.css` — page layout and component styles
- `app/globals.css` — global styles and color palette
- `app/layout.tsx` — site metadata, including the favicon reference
- `public/assets/avatar.png` — portrait displayed in the hero section
