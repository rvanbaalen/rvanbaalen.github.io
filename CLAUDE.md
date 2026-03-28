# Development Guide for rvanbaalen.github.io

## Commands
- `npm run dev` - Start Astro dev server with hot reloading
- `npm run build` - Build for production (output: `dist/`)
- `npm run preview` - Preview production build locally

## Tech Stack
- **Framework:** Astro 5.x with Content Layer API
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin
- **Content:** MDX articles + YAML project data via Content Collections
- **Icons:** Phosphor Icons (`@phosphor-icons/web`, regular weight)
- **Fonts:** Lora (serif, via @fontsource) + IBM Plex Mono (mono, via @fontsource)
- **Hosting:** Cloudflare Pages with Functions
- **Analytics:** Google Analytics + PostHog

## Code Style
- **IMPORTANT**: NEVER use standard CSS or inline CSS. Only use Tailwind utility classes
- Exception: `src/styles/global.css` for `@theme` tokens and `prefers-reduced-motion` reset
- All colors use OKLCH color space (defined in `@theme` block in global.css)
- Design system reference: `DESIGN.md`
- Use kebab-case for filenames
- Always fill in all meta tags in HTML for SEO

## Project Structure
- `src/pages/` - Astro pages (file-based routing)
- `src/layouts/` - Page layouts (BaseLayout, ArticleLayout)
- `src/components/` - Reusable Astro components
- `src/content/articles/` - MDX article files
- `src/content/projects/` - YAML project data files
- `src/content.config.ts` - Content collection schemas
- `src/styles/global.css` - Tailwind imports + OKLCH theme tokens
- `functions/api/` - Cloudflare Functions (contact form)
- `public/` - Static assets (images, CNAME)

## Content
- **Articles:** Create `.mdx` files in `src/content/articles/` with frontmatter: title, description, date, tags, draft
- **Projects:** Create `.yaml` files in `src/content/projects/` with fields: name, description, url, repo, tech, category, featured, archived, order

## Conventions
- Use conventional commits (feat, fix, docs, etc.) for Git history
- Release process handled by release-please
- Node v22+ required
- Respect `prefers-reduced-motion` for all animations
