# Development Guide for rvanbaalen.github.io

## Commands
- `npm run dev` - Start Astro dev server with hot reloading
- `npm run build` - Build for production (output: `dist/`)
- `npm run preview` - Preview production build locally

## Deployment
- **Cloudflare auto-deploys on push to `main`** via its native git integration. There is no GitHub Actions deploy step — do not add one.
- The `release-please` workflow only creates/merges release PRs and tags; it does not deploy.
- Flow: merge release-please PR → push lands on `main` → Cloudflare builds and deploys within ~60s.

### Monitoring deployments
Use the wrangler CLI (already authenticated locally):

```bash
npx wrangler deployments list | tail -30   # most recent deployments
npx wrangler deployments status             # current active deployment
```

To watch for a new deployment after pushing, use the Monitor tool with a poll loop that emits when a new deployment ID appears:

```bash
LAST=$(npx wrangler deployments list 2>/dev/null | grep -oE '[a-f0-9-]{36}' | tail -1)
while true; do
  CUR=$(npx wrangler deployments list 2>/dev/null | grep -oE '[a-f0-9-]{36}' | tail -1)
  [ "$CUR" != "$LAST" ] && echo "NEW DEPLOYMENT: $CUR" && break
  sleep 15
done
```

After the new deployment appears, verify live URLs with `curl -sfL -o /dev/null -w "%{http_code}\n" <url>`.

## Tech Stack
- **Framework:** Astro 5.x with Content Layer API
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin
- **Content:** MDX articles + YAML project data via Content Collections
- **Icons:** Phosphor Icons (`@phosphor-icons/web`, regular weight)
- **Fonts:** Lora (serif, via @fontsource) + DM Sans (sans, labels/nav/UI) + IBM Plex Mono (mono, code blocks only, via @fontsource)
- **Hosting:** Cloudflare Workers with static assets binding (`wrangler.jsonc`)
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

## Project Pages
- When updating a project's `.mdx` page in `src/pages/projects/`, always verify the `version` frontmatter is still correct
- Check the latest version via: `gh api repos/rvanbaalen/<repo>/releases/latest --jq '.tag_name'`
- Update the frontmatter if the version is outdated

## Conventions
- Use conventional commits (feat, fix, docs, etc.) for Git history
- Release process handled by release-please
- Node v22+ required
- Respect `prefers-reduced-motion` for all animations

## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, motion, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
Key rules: cool slate accent (not blue), DM Sans for UI labels (never monospace outside code blocks), all hover states must have transitions, glassy sidebar (no box-shadow).
In QA mode, flag any code that doesn't match DESIGN.md.
