# Portfolio — Next.js + Tailwind

## Goal
Job applications + freelance clients. Minimal, maintainable portfolio that displays projects and career development.

## Current status
- Next.js (App Router) + TypeScript scaffolded.  
- MDX pipeline implemented (`src/lib/mdx.ts`) and hardened (path safety, frontmatter validation, basic cache).  
- Example MDX page at `/projects/example`.  
- Projects index and `ProjectCard` component added; homepage links to `/projects`.  
- Tailwind + typography, brown-first tokens in `src/styles/globals.css`.  
- Unit tests (Vitest) added for core MDX functions.

## Next priorities
- Project detail: thumbnails, summaries, and better MDX embeds.  
- Contact API
- Theme refactor (tokens → module) and add class toggle.  
- SEO: meta/OG, sitemap, robots.txt, custom 404.  
- CI (tests + build) and deploy to Debian droplet.
