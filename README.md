# Portfolio — Next.js + Tailwind

## Goal
Job applications + freelance clients. Minimal, maintainable portfolio that displays projects and career development.

## Current status
- Next.js (App Router) + TypeScript + Tailwind
- MDX-based project system:
  - Path-safe content loading with caching
  - Zod-validated frontmatter
  - Projects index with card components
- Contact form API with email integration:
  - Input validation and sanitization
  - SMTP email delivery with error handling
  - Comprehensive test coverage
- Dark-first theme with brown accents
- Unit tests for core MDX and mail functions

## Next priorities
- Project detail improvements:
  - Image gallery support
  - Better MDX component embeds
  - Rich metadata display
- Theme system:
  - Add theme toggle
- SEO optimization:
  - Meta/OG tags
  - Sitemap + robots.txt
  - Custom 404
- CI/CD:
  - GitHub Actions for tests
  - Deploy to Debian droplet