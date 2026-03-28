# Personal Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild robinvanbaalen.nl from a single-page Vite/HTML site into an Astro 5 content-driven personal brand site with dark OKLCH theme, floating sidebar, articles, projects, and Cloudflare-backed contact form.

**Architecture:** Astro 5 with Content Layer API for articles (MDX) and projects (YAML). Tailwind CSS v4 via Vite plugin with OKLCH color tokens defined in `@theme`. Static pages with one interactive island (contact form). Cloudflare Pages hosting with Functions for form handling.

**Tech Stack:** Astro 5, Tailwind CSS v4, MDX, Phosphor Icons (`@phosphor-icons/web`), Lora + IBM Plex Mono (via `@fontsource`), Cloudflare Pages + Functions + Turnstile

**Spec:** `docs/superpowers/specs/2026-03-27-website-redesign-design.md`

---

## File Map

### Files to Remove
- `index.html` — replaced by `src/pages/index.astro`
- `css/style.css` — replaced by `src/styles/global.css`
- `vite.config.js` — replaced by `astro.config.mjs`

### Files to Keep
- `CNAME` — custom domain
- `release-please-config.json` — versioning config
- `.release-please-manifest.json` — version tracking
- `LICENSE`, `README.md` — project docs
- `.github/workflows/release-please.yml` — will be modified

### Files to Create

**Root config:**
- `astro.config.mjs` — Astro config with Tailwind vite plugin, MDX, sitemap
- `DESIGN.md` — Design system source of truth
- `tsconfig.json` — TypeScript config for Astro

**Styles:**
- `src/styles/global.css` — Tailwind import, `@theme` OKLCH tokens, `@font-face`, reduced-motion reset

**Layouts:**
- `src/layouts/BaseLayout.astro` — HTML shell, meta, analytics, sidebar, dot pattern
- `src/layouts/ArticleLayout.astro` — Article-specific layout with reading time

**Components:**
- `src/components/Sidebar.astro` — Floating sidebar with photo, name, bio, nav
- `src/components/NavItem.astro` — Dot indicator nav item with pulsating dot
- `src/components/ArticleCard.astro` — Article preview card
- `src/components/ProjectRow.astro` — Project list row
- `src/components/ContactForm.astro` — Form with Turnstile (Astro island)
- `src/components/Availability.astro` — Green pulsating dot badge
- `src/components/DotPattern.astro` — SVG background with radial fade
- `src/components/MobileNav.astro` — Bottom nav bar for mobile
- `src/components/FadeIn.astro` — Scroll-triggered staggered fade-in wrapper

**Pages:**
- `src/pages/index.astro` — Home page
- `src/pages/articles/index.astro` — Article listing
- `src/pages/articles/[...slug].astro` — Individual article
- `src/pages/projects/index.astro` — Project listing
- `src/pages/about.astro` — About page
- `src/pages/contact.astro` — Contact page
- `src/pages/404.astro` — Custom 404
- `src/pages/rss.xml.ts` — RSS feed

**Content:**
- `src/content.config.ts` — Collection schemas (Astro 5 Content Layer API)
- `src/content/articles/hello-world.mdx` — Sample article
- `src/content/projects/*.yaml` — One YAML file per project (15 files)

**Backend:**
- `functions/api/contact.ts` — Cloudflare Function for form submission

---

### Task 1: Initialize Astro Project

**Files:**
- Remove: `index.html`, `css/style.css`, `vite.config.js`
- Create: `astro.config.mjs`, `tsconfig.json`, `src/styles/global.css`, `src/pages/index.astro`
- Modify: `package.json`, `.gitignore`

- [ ] **Step 1: Remove old files and install Astro**

```bash
rm -f index.html css/style.css vite.config.js
rmdir css 2>/dev/null || true
npm install astro @astrojs/mdx @astrojs/sitemap @tailwindcss/vite tailwindcss @tailwindcss/typography
```

Note: This replaces the old `vite` + `@tailwindcss/vite` devDependencies. Astro bundles Vite internally.

- [ ] **Step 2: Rewrite package.json**

Update the scripts and move deps from devDependencies to dependencies:

```json
{
  "name": "rvanbaalen.github.io",
  "version": "1.9.0",
  "description": "Personal website of Robin van Baalen",
  "homepage": "https://robinvanbaalen.nl/",
  "bugs": {
    "url": "https://github.com/rvanbaalen/rvanbaalen.github.io/issues"
  },
  "engines": {
    "node": ">=22"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/rvanbaalen/rvanbaalen.github.io.git"
  },
  "license": "MIT",
  "author": "Robin van Baalen <robin@stylr.nl>",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@astrojs/mdx": "^4.0.0",
    "@astrojs/sitemap": "^3.0.0",
    "@tailwindcss/typography": "^0.5.16",
    "@tailwindcss/vite": "^4.0.14",
    "astro": "^5.2.0",
    "tailwindcss": "^4.0.14"
  }
}
```

- [ ] **Step 3: Create astro.config.mjs**

```javascript
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://robinvanbaalen.nl",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

- [ ] **Step 5: Create minimal global.css**

Create `src/styles/global.css`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

- [ ] **Step 6: Create minimal index.astro**

Create `src/pages/index.astro`:

```astro
---
import "../styles/global.css";
---

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Robin van Baalen</title>
  </head>
  <body class="bg-black text-white">
    <h1 class="text-4xl p-8">Site rebuilding with Astro</h1>
  </body>
</html>
```

- [ ] **Step 7: Update .gitignore**

Append Astro-specific entries to `.gitignore`:

```
.astro/
```

- [ ] **Step 8: Install dependencies and verify build**

```bash
npm install
npm run build
```

Expected: Build succeeds, output in `dist/` directory.

- [ ] **Step 9: Verify dev server**

```bash
npm run dev
```

Expected: Dev server starts at `http://localhost:4321`, page shows "Site rebuilding with Astro" in white on black.

- [ ] **Step 10: Commit**

```bash
git add astro.config.mjs tsconfig.json src/ package.json package-lock.json .gitignore
git commit -m "feat: initialize astro 5 project with tailwind v4"
```

---

### Task 2: DESIGN.md + OKLCH Theme Tokens

**Files:**
- Create: `DESIGN.md`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create DESIGN.md**

Create `DESIGN.md` in project root:

```markdown
# Design System — robinvanbaalen.nl

## Color Palette (OKLCH)

All colors use the OKLCH color space for perceptual uniformity.

### Backgrounds
| Token | Value | Usage |
|-------|-------|-------|
| `base` | `oklch(10% 0.01 260)` | Page background |
| `surface` | `oklch(14% 0.012 260)` | Cards, sidebar, raised elements |
| `surface-hover` | `oklch(17% 0.015 260)` | Hover state for surfaces |

### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `edge` | `oklch(20% 0.015 260)` | Primary borders |
| `edge-subtle` | `oklch(16% 0.01 260)` | Faint separators |

### Text
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `oklch(93% 0.015 80)` | Headings, emphasis (warm off-white) |
| `secondary` | `oklch(65% 0.01 80)` | Body text |
| `muted` | `oklch(45% 0.008 260)` | Subdued text, descriptions |
| `dim` | `oklch(30% 0.008 260)` | Very quiet, meta info |

### Accent
| Token | Value | Usage |
|-------|-------|-------|
| `accent` | `oklch(58.8% 0.158 241.966)` | Links, active states, CTAs |
| `accent-bright` | `oklch(65% 0.158 241.966)` | Hover on accent elements |
| `accent-dim` | `oklch(50% 0.12 241.966)` | Quieter accent |
| `accent-glow` | `oklch(58.8% 0.158 241.966 / 0.1)` | Background tint |
| `accent-subtle` | `oklch(58.8% 0.158 241.966 / 0.05)` | Very faint tint |

### Status
| Token | Value | Usage |
|-------|-------|-------|
| `green` | `oklch(62% 0.14 150)` | Availability dot |
| `green-glow` | `oklch(62% 0.14 150 / 0.3)` | Dot glow shadow |

## Typography

- **Serif (body + headings):** Lora, weights 400/500/600/italic-400
- **Mono (UI + labels):** IBM Plex Mono, weights 400/500
- **Base size:** 16px (1rem)
- **Scale:** 1.25 (major third)
- **Body line-height:** 1.7
- **Heading line-height:** 1.3
- **Heading letter-spacing:** -0.01em
- **Mono label letter-spacing:** 0.06em-0.1em, uppercase

## Icons

- **Library:** Phosphor Icons (`@phosphor-icons/web` v2.x)
- **Weight:** Regular (not bold, not fill)
- **Sizes:** 16px nav/inline, 13px meta, 18px social

## Spacing

- Sidebar width: 280px (with 16px wrapper padding)
- Sidebar padding: 32px 24px
- Main content padding: 48px 64px (desktop), 24px (mobile)
- Section gap: 48-64px
- Card padding: 24px, gap: 14px, radius: 8px
- Sidebar radius: 12px

## Animations

All animations respect `prefers-reduced-motion: reduce`.

- **Nav dot:** Pulsating scale+opacity, 2s infinite
- **Availability dot:** Pulsating glow, 2s infinite
- **Article cards:** border-color + box-shadow on hover, 0.2s ease
- **Project rows:** background on hover, 0.15s ease
- **Scroll fade-in:** Staggered 0.3s delay via IntersectionObserver
- **Send button:** accent -> accent-bright on hover, 0.15s

## Responsive

- Below 768px: sidebar collapses to bottom nav (icon-only)
- Photo/bio/social move to slide-out drawer (hamburger trigger)
- Main content becomes full-width, padding reduces to 24px

## Background Pattern

SVG dot grid: 32px spacing, 0.6px circles, 3% white opacity.
Masked with radial-gradient (ellipse at 20% 15%, transparent at 60%).
Fixed position, behind all content.
```

- [ ] **Step 2: Set up full global.css with theme tokens**

Replace `src/styles/global.css`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  /* Backgrounds */
  --color-base: oklch(10% 0.01 260);
  --color-surface: oklch(14% 0.012 260);
  --color-surface-hover: oklch(17% 0.015 260);

  /* Borders */
  --color-edge: oklch(20% 0.015 260);
  --color-edge-subtle: oklch(16% 0.01 260);

  /* Text */
  --color-primary: oklch(93% 0.015 80);
  --color-secondary: oklch(65% 0.01 80);
  --color-muted: oklch(45% 0.008 260);
  --color-dim: oklch(30% 0.008 260);

  /* Accent */
  --color-accent: oklch(58.8% 0.158 241.966);
  --color-accent-bright: oklch(65% 0.158 241.966);
  --color-accent-dim: oklch(50% 0.12 241.966);
  --color-accent-glow: oklch(58.8% 0.158 241.966 / 0.1);
  --color-accent-subtle: oklch(58.8% 0.158 241.966 / 0.05);

  /* Status */
  --color-green: oklch(62% 0.14 150);
  --color-green-glow: oklch(62% 0.14 150 / 0.3);

  /* Typography */
  --font-serif: "Lora", Georgia, serif;
  --font-mono: "IBM Plex Mono", "Fira Code", monospace;
}

/* Reduced motion: disable all animations and transitions */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Pulsating dot animation for nav active state */
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

/* Pulsating glow for availability dot */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 6px var(--color-green-glow); }
  50% { box-shadow: 0 0 12px var(--color-green-glow); }
}

/* Fade-in for scroll-triggered elements */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 3: Verify build with theme tokens**

```bash
npm run build
```

Expected: Build succeeds. Tailwind processes the `@theme` block and generates utility classes like `bg-base`, `text-primary`, `border-edge`, `font-serif`, `font-mono`.

- [ ] **Step 4: Commit**

```bash
git add DESIGN.md src/styles/global.css
git commit -m "feat: add design system and OKLCH theme tokens"
```

---

### Task 3: Font + Icon Setup

**Files:**
- Modify: `src/styles/global.css`, `package.json`

- [ ] **Step 1: Install font and icon packages**

```bash
npm install @fontsource-variable/lora @fontsource/ibm-plex-mono @phosphor-icons/web
```

- [ ] **Step 2: Add font and icon imports to global.css**

Add these imports at the very top of `src/styles/global.css`, before the `@import "tailwindcss"` line:

```css
/* Fonts — self-hosted via fontsource */
@import "@fontsource-variable/lora";
@import "@fontsource-variable/lora/wght-italic.css";
@import "@fontsource/ibm-plex-mono/400.css";
@import "@fontsource/ibm-plex-mono/500.css";

/* Icons */
@import "@phosphor-icons/web/regular/style.css";
```

- [ ] **Step 3: Update index.astro to verify fonts render**

Replace `src/pages/index.astro`:

```astro
---
import "../styles/global.css";
---

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Robin van Baalen</title>
  </head>
  <body class="bg-base text-secondary font-serif">
    <div class="p-12 max-w-2xl">
      <h1 class="text-4xl text-primary mb-4">Lora Serif Heading</h1>
      <p class="mb-4">This body text should render in Lora serif font with secondary text color on the dark OKLCH background.</p>
      <p class="font-mono text-sm text-muted mb-4">IBM Plex Mono for UI labels and code</p>
      <p class="text-accent mb-4">Accent color text: oklch(58.8% 0.158 241.966)</p>
      <div class="flex gap-4 text-2xl text-dim">
        <i class="ph ph-house"></i>
        <i class="ph ph-article"></i>
        <i class="ph ph-code"></i>
        <i class="ph ph-user"></i>
        <i class="ph ph-envelope"></i>
      </div>
    </div>
  </body>
</html>
```

- [ ] **Step 4: Verify fonts and icons render**

```bash
npm run dev
```

Expected: Dev server at `http://localhost:4321`. Page shows:
- Lora serif heading in warm off-white
- Lora body text in muted tone
- IBM Plex Mono text in monospace
- Blue accent text
- Five Phosphor icons (house, article, code, user, envelope)
- Dark background with OKLCH colors

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/styles/global.css src/pages/index.astro
git commit -m "feat: add self-hosted fonts and phosphor icons"
```

---

### Task 4: Content Collections + Project Data Migration

**Files:**
- Create: `src/content.config.ts`, `src/content/projects/*.yaml` (15 files), `src/content/articles/hello-world.mdx`

- [ ] **Step 1: Create content collection schemas**

Create `src/content.config.ts` (note: Astro 5 uses this path, NOT `src/content/config.ts`):

```typescript
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/projects" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().optional(),
    repo: z.string(),
    tech: z.array(z.string()),
    category: z.enum(["standalone", "package", "template", "cli", "archived"]),
    featured: z.boolean().default(false),
    archived: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { articles, projects };
```

- [ ] **Step 2: Create project YAML files**

Create directory `src/content/projects/` and add these files:

`src/content/projects/validform-builder.yaml`:
```yaml
name: ValidForm Builder
description: PHP and JavaScript library for creating standards-based web forms with client and server-side validation.
url: https://validformbuilder.org
repo: https://github.com/validformbuilder/validformbuilder
tech: [PHP, JavaScript]
category: standalone
featured: true
order: 1
```

`src/content/projects/hashparser.yaml`:
```yaml
name: HashParser
description: Lightweight JavaScript library for managing URL hash parameters, with support for encoding and decoding.
url: https://hashparser.js.org
repo: https://github.com/rvanbaalen/hashparser
tech: [TypeScript, npm]
category: package
featured: true
order: 2
```

`src/content/projects/eslint-config.yaml`:
```yaml
name: ESLint Config
description: A custom extension of the popular antfu/eslint-config package based on personal preferences.
url: https://robinvanbaalen.nl/eslint-config/
repo: https://github.com/rvanbaalen/eslint-config
tech: [JavaScript, ESLint]
category: package
order: 3
```

`src/content/projects/transitionjs.yaml`:
```yaml
name: TransitionJS
description: Dead simple JavaScript functions to use TailwindCSS transitions without libraries.
url: https://robinvanbaalen.nl/transitionjs
repo: https://github.com/rvanbaalen/transitionjs
tech: [JavaScript, Tailwind CSS]
category: package
featured: true
order: 4
```

`src/content/projects/signals.yaml`:
```yaml
name: Signals
description: Lightweight, decoupled pub/sub signal system for building reactive web applications with organized state management.
repo: https://github.com/rvanbaalen/signals
tech: [JavaScript]
category: package
order: 5
```

`src/content/projects/custom-scroll.yaml`:
```yaml
name: Custom Scroll
description: Lightweight, customizable scrollbar replacement for web applications with easy implementation and extensive styling options.
url: https://robinvanbaalen.nl/custom-scroll
repo: https://github.com/rvanbaalen/custom-scroll
tech: [JavaScript]
category: package
order: 6
```

`src/content/projects/domjs.yaml`:
```yaml
name: DomJS
description: Zero-dependency core DOM manipulation utilities in vanilla JavaScript.
url: https://robinvanbaalen.nl/domjs
repo: https://github.com/rvanbaalen/domjs
tech: [JavaScript]
category: package
order: 7
```

`src/content/projects/source-to-llm.yaml`:
```yaml
name: Source to LLM
description: Utility to convert source code to a format suitable for LLM processing, making it easier to include code snippets in AI prompts.
url: https://robinvanbaalen.nl/source-to-llm
repo: https://github.com/rvanbaalen/source-to-llm
tech: [TypeScript, CLI]
category: package
featured: true
order: 8
```

`src/content/projects/portals.yaml`:
```yaml
name: Portals
description: Lightweight, framework-agnostic portal system for creating modals, tooltips, and other overlay components.
url: https://robinvanbaalen.nl/portals
repo: https://github.com/rvanbaalen/portals
tech: [JavaScript]
category: package
order: 9
```

`src/content/projects/template-npm-package.yaml`:
```yaml
name: NPM Package Template
description: Template repository for quickly creating new NPM packages with TypeScript, testing setup, and CI/CD workflows pre-configured.
repo: https://github.com/rvanbaalen/template-npm-package
tech: [TypeScript, GitHub Actions]
category: template
order: 10
```

`src/content/projects/template-static-html.yaml`:
```yaml
name: Static HTML Template
description: Starter template for creating static HTML websites with modern tooling, including Tailwind CSS, and automatic deployment to GitHub Pages.
repo: https://github.com/rvanbaalen/template-static-html
tech: [HTML, Tailwind CSS]
category: template
order: 11
```

`src/content/projects/readme-to-html.yaml`:
```yaml
name: README to HTML
description: Transforms README.md files into responsive, customizable HTML pages for GitHub Pages with minimal configuration.
url: https://robinvanbaalen.nl/readme-to-html/
repo: https://github.com/rvanbaalen/readme-to-html
tech: [TypeScript, CLI]
category: cli
featured: true
order: 12
```

`src/content/projects/runner-manager.yaml`:
```yaml
name: GitHub Runner Manager
description: CLI to easily control GitHub self-hosted runners locally. Add, remove, start and stop runners without manually copying commands.
url: https://robinvanbaalen.nl/runner-manager/
repo: https://github.com/rvanbaalen/runner-manager
tech: [JavaScript, CLI]
category: cli
order: 13
```

`src/content/projects/pdf-renamer.yaml`:
```yaml
name: PDF Renamer
description: Command-line tool to automatically rename PDF files based on their content. Point it to a directory and it analyzes and renames your PDFs.
repo: https://github.com/rvanbaalen/pdf-renamer
tech: [TypeScript, CLI]
category: cli
order: 14
```

`src/content/projects/curacao-election-2025.yaml`:
```yaml
name: "Cura\xE7ao Election 2025"
description: Multi-lingual website presenting summarized information about Curacao's 2025 election political parties, created using ChatGPT Deep Research.
url: https://robinvanbaalen.nl/curacao-election-2025
repo: https://github.com/rvanbaalen/curacao-election-2025
tech: [HTML, JavaScript]
category: archived
archived: true
order: 15
```

- [ ] **Step 3: Create sample article**

Create `src/content/articles/hello-world.mdx`:

```mdx
---
title: "Hello World"
description: "The first post on the new site. A fresh start with Astro, Tailwind, and a design system built from scratch."
date: 2026-03-27
tags: ["meta", "astro"]
draft: true
---

This is a placeholder article to verify the content collection works. It will be replaced with real content.
```

- [ ] **Step 4: Verify content collections load**

Update `src/pages/index.astro` to query collections:

```astro
---
import { getCollection } from "astro:content";
import "../styles/global.css";

const projects = await getCollection("projects");
const articles = await getCollection("articles");
---

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Robin van Baalen</title>
  </head>
  <body class="bg-base text-secondary font-serif p-12">
    <h1 class="text-3xl text-primary mb-8">Content Collections Test</h1>
    <h2 class="text-xl text-accent font-mono mb-4">Projects ({projects.length})</h2>
    <ul class="mb-8 space-y-2">
      {projects.sort((a, b) => a.data.order - b.data.order).map((p) => (
        <li class="text-muted">{p.data.name} — {p.data.tech.join(", ")}</li>
      ))}
    </ul>
    <h2 class="text-xl text-accent font-mono mb-4">Articles ({articles.length})</h2>
    <ul>
      {articles.map((a) => (
        <li class="text-muted">{a.data.title} — {a.data.date.toLocaleDateString()}</li>
      ))}
    </ul>
  </body>
</html>
```

- [ ] **Step 5: Build and verify**

```bash
npm run build
```

Expected: Build succeeds. All 15 projects and 1 article are loaded from content collections.

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/content/ src/pages/index.astro
git commit -m "feat: add content collections with project data and sample article"
```

---

### Task 5: BaseLayout + DotPattern Components

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/DotPattern.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create DotPattern component**

Create `src/components/DotPattern.astro`:

```astro
---
// SVG dot grid background with radial fade mask
// Fixed position, behind all content, purely decorative
---

<div
  class="pointer-events-none fixed inset-0 z-0"
  style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.6' fill='%23ffffff' fill-opacity='0.03'/%3E%3C/svg%3E&quot;); background-size: 32px 32px; mask-image: radial-gradient(ellipse at 20% 15%, black 0%, transparent 60%); -webkit-mask-image: radial-gradient(ellipse at 20% 15%, black 0%, transparent 60%);"
  aria-hidden="true"
/>
```

- [ ] **Step 2: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import "../styles/global.css";
import DotPattern from "../components/DotPattern.astro";

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const {
  title,
  description = "Robin van Baalen — Software engineer, consultant, and builder.",
  ogImage = "https://github.com/rvanbaalen.png",
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />

    <!-- Favicon -->
    <link
      rel="icon"
      type="image/svg+xml"
      href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%23161620' stroke='%23333' stroke-width='2'/%3E%3Ctext x='32' y='42' font-family='Georgia,serif' font-size='32' font-weight='bold' text-anchor='middle' fill='%23eae6dc'%3ER%3C/text%3E%3C/svg%3E"
    />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="400" />
    <meta property="og:image:height" content="400" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:type" content="website" />

    <!-- Google Analytics -->
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-DY4RKECQCF"
    ></script>
    <script is:inline>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "G-DY4RKECQCF", {
        language: document.documentElement.lang || "en",
      });
    </script>

    <!-- RSS -->
    <link
      rel="alternate"
      type="application/rss+xml"
      title="Robin van Baalen"
      href="/rss.xml"
    />
  </head>
  <body class="bg-base text-secondary font-serif leading-relaxed">
    <DotPattern />
    <div class="relative z-10">
      <slot />
    </div>
  </body>
</html>
```

- [ ] **Step 3: Update index.astro to use BaseLayout**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="Robin van Baalen">
  <div class="p-12 max-w-2xl">
    <h1 class="text-4xl text-primary mb-4">Robin van Baalen</h1>
    <p>Layout, dot pattern, and analytics working.</p>
  </div>
</BaseLayout>
```

- [ ] **Step 4: Build and verify**

```bash
npm run build
```

Expected: Build succeeds. Page renders with dark background, dot pattern visible in top-left corner, GA script in head.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/DotPattern.astro src/pages/index.astro
git commit -m "feat: add base layout with dot pattern background and analytics"
```

---

### Task 6: NavItem + Sidebar Components

**Files:**
- Create: `src/components/NavItem.astro`, `src/components/Sidebar.astro`

- [ ] **Step 1: Create NavItem component**

Create `src/components/NavItem.astro`:

```astro
---
interface Props {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}

const { href, icon, label, active = false } = Astro.props;
---

<a
  href={href}
  class:list={[
    "relative flex items-center gap-2.5 py-2 pl-5 font-mono text-xs transition-colors duration-150",
    active ? "text-accent" : "text-muted hover:text-primary",
  ]}
>
  <span
    class:list={[
      "absolute left-0 top-1/2 -translate-y-1/2 h-1 w-1 rounded-full",
      active
        ? "bg-accent animate-[pulse-dot_2s_ease-in-out_infinite]"
        : "bg-transparent",
    ]}
    aria-hidden="true"
  />
  <i class={`ph ph-${icon} text-base w-[18px] text-center`} aria-hidden="true" />
  <span>{label}</span>
</a>
```

- [ ] **Step 2: Create Sidebar component**

Create `src/components/Sidebar.astro`:

```astro
---
import NavItem from "./NavItem.astro";

interface Props {
  currentPath: string;
}

const { currentPath } = Astro.props;

const navItems = [
  { href: "/", icon: "house", label: "Home" },
  { href: "/articles", icon: "article", label: "Articles" },
  { href: "/projects", icon: "code", label: "Projects" },
  { href: "/about", icon: "user", label: "About" },
  { href: "/contact", icon: "envelope", label: "Contact" },
];

function isActive(href: string, current: string): boolean {
  if (href === "/") return current === "/";
  return current.startsWith(href);
}
---

<div class="sticky top-0 h-screen p-4 pr-0 hidden md:block">
  <aside class="flex h-full flex-col rounded-xl border border-edge bg-surface p-8 pb-6 shadow-[0_8px_32px_oklch(0%_0_0/0.4)]">
    <!-- Photo -->
    <img
      src="https://github.com/rvanbaalen.png"
      alt="Robin van Baalen"
      class="mb-3.5 h-14 w-14 rounded-full border-2 border-edge"
      width="56"
      height="56"
    />

    <!-- Identity -->
    <p class="text-[15px] font-semibold text-primary">Robin van Baalen</p>
    <p class="mb-7 text-[13px] leading-snug text-muted">
      Software engineer &amp; consultant. Building tools, writing code, solving problems.
    </p>

    <!-- Navigation -->
    <nav class="flex flex-1 flex-col gap-0.5" aria-label="Main navigation">
      {navItems.map((item) => (
        <NavItem
          href={item.href}
          icon={item.icon}
          label={item.label}
          active={isActive(item.href, currentPath)}
        />
      ))}
    </nav>

    <!-- Footer -->
    <div class="mt-auto border-t border-edge pt-4">
      <div class="mb-2.5 flex gap-3.5">
        <a href="https://github.com/rvanbaalen" class="text-dim text-lg transition-colors duration-150 hover:text-accent" aria-label="GitHub">
          <i class="ph ph-github-logo" />
        </a>
        <a href="https://www.linkedin.com/in/robinvanbaalen/" class="text-dim text-lg transition-colors duration-150 hover:text-accent" aria-label="LinkedIn">
          <i class="ph ph-linkedin-logo" />
        </a>
      </div>
      <p class="font-mono text-[10px] text-dim">&copy; 2026 Robin van Baalen</p>
    </div>
  </aside>
</div>
```

- [ ] **Step 3: Add sidebar to BaseLayout**

In `src/layouts/BaseLayout.astro`, import the Sidebar and update the body:

Replace the `<div class="relative z-10">` block:

```astro
---
import "../styles/global.css";
import DotPattern from "../components/DotPattern.astro";
import Sidebar from "../components/Sidebar.astro";

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const {
  title,
  description = "Robin van Baalen — Software engineer, consultant, and builder.",
  ogImage = "https://github.com/rvanbaalen.png",
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const currentPath = Astro.url.pathname;
---
```

And update the body content to use the sidebar layout grid:

```html
<body class="bg-base text-secondary font-serif leading-relaxed">
  <DotPattern />
  <div class="relative z-10 mx-auto grid min-h-screen md:grid-cols-[280px_1fr]">
    <Sidebar currentPath={currentPath} />
    <main class="max-w-[820px] px-6 py-12 md:px-16 md:py-12">
      <slot />
    </main>
  </div>
</body>
```

- [ ] **Step 4: Build and verify**

```bash
npm run dev
```

Expected: Floating sidebar on the left with photo, name, bio, navigation with dot indicators, social icons. Active state shows pulsating blue dot. Main content area on the right.

- [ ] **Step 5: Commit**

```bash
git add src/components/NavItem.astro src/components/Sidebar.astro src/layouts/BaseLayout.astro
git commit -m "feat: add floating sidebar with dot indicator navigation"
```

---

### Task 7: Availability Component + Home Page Intro

**Files:**
- Create: `src/components/Availability.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Availability component**

Create `src/components/Availability.astro`:

```astro
<div class="inline-flex items-center gap-2.5 rounded-full border border-edge bg-surface px-4 py-2 font-mono text-xs text-muted">
  <span
    class="h-2 w-2 rounded-full bg-green animate-[pulse-glow_2s_ease-in-out_infinite]"
    aria-hidden="true"
  />
  Available for consulting
</div>
```

- [ ] **Step 2: Build home page intro section**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Availability from "../components/Availability.astro";
---

<BaseLayout title="Robin van Baalen">
  <!-- Intro -->
  <section class="mb-16">
    <p class="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
      <i class="ph ph-hand-waving" aria-hidden="true" />
      Welcome
    </p>
    <h1 class="mb-5 text-[34px] font-normal leading-tight tracking-tight text-primary">
      I'm Robin. I build software and help teams ship better products.
    </h1>
    <p class="mb-1 max-w-xl text-[17px] leading-relaxed">
      Almost two decades of shipping software across roles from lead developer to
      software architect to senior consultant. I write about what I learn and
      open-source what I build.
    </p>
    <div class="mt-6">
      <Availability />
    </div>
  </section>

  <!-- Divider -->
  <div class="h-px bg-gradient-to-r from-edge to-transparent" />

  <p class="py-12 text-muted">More sections coming soon.</p>
</BaseLayout>
```

- [ ] **Step 3: Build and verify**

```bash
npm run dev
```

Expected: Home page shows greeting with wave icon, heading, description, and availability badge with pulsating green dot.

- [ ] **Step 4: Commit**

```bash
git add src/components/Availability.astro src/pages/index.astro
git commit -m "feat: add availability badge and home page intro section"
```

---

### Task 8: ArticleCard Component

**Files:**
- Create: `src/components/ArticleCard.astro`

- [ ] **Step 1: Create ArticleCard component**

Create `src/components/ArticleCard.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
  date: Date;
  slug: string;
  tags: string[];
  readingTime?: string;
}

const { title, description, date, slug, tags, readingTime } = Astro.props;

const formattedDate = date.toLocaleDateString("en-US", {
  month: "short",
  year: "numeric",
});
---

<a
  href={`/articles/${slug}`}
  class="group block rounded-lg border border-edge bg-surface p-6 transition-[border-color,box-shadow] duration-200 hover:border-accent-dim hover:shadow-[0_0_24px_oklch(58.8%_0.158_241.966/0.05)]"
>
  <div class="mb-2.5 flex items-center gap-1.5 font-mono text-[11px] text-dim">
    <i class="ph ph-calendar-blank text-xs" aria-hidden="true" />
    <span>{formattedDate}</span>
    {readingTime && (
      <>
        <span>&middot;</span>
        <span>{readingTime}</span>
      </>
    )}
  </div>
  <h3 class="mb-2 text-[17px] font-medium leading-snug tracking-tight text-primary">
    {title}
  </h3>
  <p class="text-sm leading-relaxed text-muted">{description}</p>
  {tags.length > 0 && (
    <span class="mt-2.5 inline-block rounded bg-accent-glow px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-accent">
      {tags[0]}
    </span>
  )}
</a>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ArticleCard.astro
git commit -m "feat: add article card component"
```

---

### Task 9: ProjectRow Component

**Files:**
- Create: `src/components/ProjectRow.astro`

- [ ] **Step 1: Create ProjectRow component**

Create `src/components/ProjectRow.astro`:

```astro
---
interface Props {
  name: string;
  description: string;
  tech: string[];
  url?: string;
  repo: string;
}

const { name, description, tech, url, repo } = Astro.props;
const href = url || repo;
---

<a
  href={href}
  target="_blank"
  rel="noopener noreferrer"
  class="group grid grid-cols-[1fr_auto] items-center gap-6 rounded-md border-b border-edge-subtle px-3.5 py-4 transition-colors duration-150 hover:bg-surface"
>
  <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3.5">
    <span class="text-[15px] font-medium text-primary transition-colors duration-150 group-hover:text-accent-bright">
      {name}
    </span>
    <span class="text-sm text-muted">{description}</span>
  </div>
  <span class="hidden font-mono text-[10px] uppercase tracking-widest text-dim sm:block">
    {tech.join(" · ")}
  </span>
</a>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectRow.astro
git commit -m "feat: add project row component"
```

---

### Task 10: ContactForm Component

**Files:**
- Create: `src/components/ContactForm.astro`

- [ ] **Step 1: Create ContactForm component**

Create `src/components/ContactForm.astro`:

```astro
---
// Static form component. Turnstile widget will be added when Cloudflare is configured.
// The form POSTs to /api/contact (Cloudflare Function).
---

<form
  action="/api/contact"
  method="POST"
  class="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
>
  <label class="flex items-center gap-2 rounded-md border border-edge bg-base px-3.5 py-3 font-mono text-xs text-muted focus-within:border-accent-dim">
    <i class="ph ph-user text-sm text-dim" aria-hidden="true" />
    <input
      type="text"
      name="name"
      placeholder="Name"
      required
      class="w-full bg-transparent text-secondary placeholder:text-muted outline-none"
    />
  </label>
  <label class="flex items-center gap-2 rounded-md border border-edge bg-base px-3.5 py-3 font-mono text-xs text-muted focus-within:border-accent-dim">
    <i class="ph ph-at text-sm text-dim" aria-hidden="true" />
    <input
      type="email"
      name="email"
      placeholder="Email"
      required
      class="w-full bg-transparent text-secondary placeholder:text-muted outline-none"
    />
  </label>
  <label class="flex items-center gap-2 rounded-md border border-edge bg-base px-3.5 py-3 font-mono text-xs text-muted focus-within:border-accent-dim sm:col-span-2">
    <i class="ph ph-text-aa text-sm text-dim" aria-hidden="true" />
    <input
      type="text"
      name="subject"
      placeholder="Subject"
      required
      class="w-full bg-transparent text-secondary placeholder:text-muted outline-none"
    />
  </label>
  <label class="flex gap-2 rounded-md border border-edge bg-base px-3.5 pt-3 pb-3 font-mono text-xs text-muted focus-within:border-accent-dim sm:col-span-2">
    <i class="ph ph-pencil-simple mt-0.5 text-sm text-dim" aria-hidden="true" />
    <textarea
      name="message"
      placeholder="Your message..."
      required
      rows="5"
      class="w-full resize-y bg-transparent text-secondary placeholder:text-muted outline-none"
    />
  </label>

  <!-- Turnstile widget placeholder — will render when sitekey is configured -->
  <div class="cf-turnstile sm:col-span-2" data-sitekey="TURNSTILE_SITE_KEY_PLACEHOLDER"></div>

  <button
    type="submit"
    class="flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-mono text-xs font-medium uppercase tracking-wide text-base transition-colors duration-150 hover:bg-accent-bright sm:col-span-2"
  >
    <i class="ph ph-paper-plane-tilt" aria-hidden="true" />
    Send message
  </button>
</form>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ContactForm.astro
git commit -m "feat: add contact form component with turnstile placeholder"
```

---

### Task 11: Complete Home Page Assembly

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Assemble full home page**

Replace `src/pages/index.astro`:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import Availability from "../components/Availability.astro";
import ArticleCard from "../components/ArticleCard.astro";
import ProjectRow from "../components/ProjectRow.astro";
import ContactForm from "../components/ContactForm.astro";

const allArticles = await getCollection("articles", ({ data }) => !data.draft);
const recentArticles = allArticles
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 4);

const allProjects = await getCollection("projects");
const featuredProjects = allProjects
  .filter((p) => p.data.featured && !p.data.archived)
  .sort((a, b) => a.data.order - b.data.order);
---

<BaseLayout title="Robin van Baalen">
  <!-- Intro -->
  <section class="mb-16">
    <p class="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
      <i class="ph ph-hand-waving" aria-hidden="true" />
      Welcome
    </p>
    <h1 class="mb-5 text-[34px] font-normal leading-tight tracking-tight text-primary">
      I'm Robin. I build software and help teams ship better products.
    </h1>
    <p class="max-w-xl text-[17px] leading-relaxed">
      Almost two decades of shipping software across roles from lead developer to
      software architect to senior consultant. I write about what I learn and
      open-source what I build.
    </p>
    <div class="mt-6">
      <Availability />
    </div>
  </section>

  <div class="h-px bg-gradient-to-r from-edge to-transparent" />

  <!-- Recent Articles -->
  <section class="py-12">
    <div class="mb-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-dim">
      <span class="flex items-center gap-1">
        <i class="ph ph-article text-[13px]" aria-hidden="true" />
        Recent writing
      </span>
      <a href="/articles" class="flex items-center gap-1 text-accent">
        View all <i class="ph ph-arrow-right text-[11px]" aria-hidden="true" />
      </a>
    </div>
    {recentArticles.length > 0 ? (
      <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {recentArticles.map((article) => (
          <ArticleCard
            title={article.data.title}
            description={article.data.description}
            date={article.data.date}
            slug={article.id}
            tags={article.data.tags}
          />
        ))}
      </div>
    ) : (
      <p class="text-muted">Articles coming soon.</p>
    )}
  </section>

  <div class="h-px bg-gradient-to-r from-edge to-transparent" />

  <!-- Selected Projects -->
  <section class="py-12">
    <div class="mb-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-dim">
      <span class="flex items-center gap-1">
        <i class="ph ph-code text-[13px]" aria-hidden="true" />
        Open source
      </span>
      <a href="/projects" class="flex items-center gap-1 text-accent">
        View all <i class="ph ph-arrow-right text-[11px]" aria-hidden="true" />
      </a>
    </div>
    <div>
      {featuredProjects.map((project) => (
        <ProjectRow
          name={project.data.name}
          description={project.data.description}
          tech={project.data.tech}
          url={project.data.url}
          repo={project.data.repo}
        />
      ))}
    </div>
  </section>

  <!-- Contact -->
  <section class="mt-14 rounded-xl border border-edge bg-surface p-10">
    <h2 class="mb-2 flex items-center gap-2.5 text-[22px] font-normal text-primary">
      <i class="ph ph-chat-circle text-accent" aria-hidden="true" />
      Let's talk
    </h2>
    <p class="mb-6 text-[15px] text-muted">
      Available for consulting, architecture reviews, and technical leadership. Tell me about your project.
    </p>
    <ContactForm />
  </section>
</BaseLayout>
```

- [ ] **Step 2: Build and verify**

```bash
npm run dev
```

Expected: Full home page with intro, recent articles (may be empty if only draft articles), featured projects list, and contact form. All sections styled with OKLCH colors, Lora/IBM Plex Mono fonts, proper spacing.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: assemble complete home page with articles, projects, and contact"
```

---

### Task 12: Article Pages

**Files:**
- Create: `src/layouts/ArticleLayout.astro`, `src/pages/articles/index.astro`, `src/pages/articles/[...slug].astro`
- Modify: `src/content/articles/hello-world.mdx` (remove draft flag)

- [ ] **Step 1: Create ArticleLayout**

Create `src/layouts/ArticleLayout.astro`:

```astro
---
import BaseLayout from "./BaseLayout.astro";

interface Props {
  title: string;
  description: string;
  date: Date;
  tags: string[];
}

const { title, description, date, tags } = Astro.props;

const formattedDate = date.toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});
---

<BaseLayout title={`${title} — Robin van Baalen`} description={description}>
  <article>
    <!-- Header -->
    <header class="mb-10">
      <a
        href="/articles"
        class="mb-6 inline-flex items-center gap-1 font-mono text-xs text-muted transition-colors duration-150 hover:text-accent"
      >
        <i class="ph ph-arrow-left text-[11px]" aria-hidden="true" />
        All articles
      </a>
      <h1 class="mb-4 text-3xl font-normal leading-tight tracking-tight text-primary md:text-4xl">
        {title}
      </h1>
      <div class="flex flex-wrap items-center gap-3 font-mono text-[11px] text-dim">
        <span class="flex items-center gap-1">
          <i class="ph ph-calendar-blank text-xs" aria-hidden="true" />
          {formattedDate}
        </span>
        {tags.map((tag) => (
          <span class="rounded bg-accent-glow px-2 py-0.5 uppercase tracking-wide text-accent">
            {tag}
          </span>
        ))}
      </div>
    </header>

    <!-- Content -->
    <div class="prose prose-invert max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-primary prose-p:text-secondary prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-code:text-accent-bright prose-pre:bg-surface prose-pre:border prose-pre:border-edge prose-strong:text-primary prose-blockquote:border-accent-dim prose-blockquote:text-muted">
      <slot />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Create article listing page**

Create `src/pages/articles/index.astro`:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import ArticleCard from "../../components/ArticleCard.astro";

const articles = await getCollection("articles", ({ data }) => !data.draft);
const sorted = articles.sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime(),
);
---

<BaseLayout title="Articles — Robin van Baalen" description="Articles about software engineering, architecture, and building products.">
  <section>
    <h1 class="mb-2 text-3xl font-normal tracking-tight text-primary">Articles</h1>
    <p class="mb-10 text-muted">Thoughts on software, engineering, and building things that work.</p>

    {sorted.length > 0 ? (
      <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {sorted.map((article) => (
          <ArticleCard
            title={article.data.title}
            description={article.data.description}
            date={article.data.date}
            slug={article.id}
            tags={article.data.tags}
          />
        ))}
      </div>
    ) : (
      <p class="text-muted">Articles coming soon.</p>
    )}
  </section>
</BaseLayout>
```

- [ ] **Step 3: Create dynamic article page**

Create `src/pages/articles/[...slug].astro`:

```astro
---
import { getCollection, render } from "astro:content";
import ArticleLayout from "../../layouts/ArticleLayout.astro";

export async function getStaticPaths() {
  const articles = await getCollection("articles", ({ data }) => !data.draft);
  return articles.map((article) => ({
    params: { slug: article.id },
    props: { article },
  }));
}

const { article } = Astro.props;
const { Content } = await render(article);
---

<ArticleLayout
  title={article.data.title}
  description={article.data.description}
  date={article.data.date}
  tags={article.data.tags}
>
  <Content />
</ArticleLayout>
```

- [ ] **Step 4: Publish the sample article**

Update `src/content/articles/hello-world.mdx` — change `draft: true` to `draft: false`.

- [ ] **Step 5: Build and verify**

```bash
npm run build
```

Expected: Build succeeds. `/articles` page lists the article. `/articles/hello-world` renders the article with proper prose typography.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/ArticleLayout.astro src/pages/articles/ src/content/articles/hello-world.mdx
git commit -m "feat: add article listing and individual article pages"
```

---

### Task 13: Projects, About, Contact, and 404 Pages

**Files:**
- Create: `src/pages/projects/index.astro`, `src/pages/about.astro`, `src/pages/contact.astro`, `src/pages/404.astro`

- [ ] **Step 1: Create projects listing page**

Create `src/pages/projects/index.astro`:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import ProjectRow from "../../components/ProjectRow.astro";

const allProjects = await getCollection("projects");

const categories = [
  { key: "standalone", label: "Standalone Projects" },
  { key: "package", label: "NPM Packages" },
  { key: "cli", label: "CLI Tools" },
  { key: "template", label: "Project Templates" },
  { key: "archived", label: "Archived" },
] as const;
---

<BaseLayout title="Projects — Robin van Baalen" description="Open source projects, NPM packages, CLI tools, and templates.">
  <h1 class="mb-2 text-3xl font-normal tracking-tight text-primary">Projects</h1>
  <p class="mb-10 text-muted">Open source tools, packages, and templates I've built.</p>

  {categories.map(({ key, label }) => {
    const projects = allProjects
      .filter((p) => p.data.category === key)
      .sort((a, b) => a.data.order - b.data.order);
    if (projects.length === 0) return null;
    return (
      <section class="mb-12">
        <h2 class="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-dim">{label}</h2>
        <div>
          {projects.map((project) => (
            <ProjectRow
              name={project.data.name}
              description={project.data.description}
              tech={project.data.tech}
              url={project.data.url}
              repo={project.data.repo}
            />
          ))}
        </div>
      </section>
    );
  })}
</BaseLayout>
```

- [ ] **Step 2: Create about page**

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="About — Robin van Baalen" description="About Robin van Baalen — software engineer, consultant, and builder with almost two decades of experience.">
  <h1 class="mb-6 text-3xl font-normal tracking-tight text-primary">About</h1>

  <div class="max-w-xl space-y-5 text-[17px] leading-relaxed">
    <p>
      I'm Robin van Baalen, a software engineer and business owner with almost two decades
      of experience in the industry. I've worked with a variety of companies in roles varying
      from lead developer, software architect, and senior consultant.
    </p>
    <p>
      I have a passion for using technology to solve real-world problems and create
      innovative solutions. I develop a strong skill set in a range of programming
      languages and frameworks, but I believe in reaching for the simplest tool that
      gets the job done.
    </p>
    <p>
      I write about what I learn and open-source what I build. Most of my packages
      are zero-dependency utilities that solve one problem well.
    </p>
    <p>
      Currently available for consulting engagements, architecture reviews, and
      technical leadership.
    </p>
  </div>

  <div class="mt-10">
    <a
      href="/contact"
      class="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-mono text-xs font-medium uppercase tracking-wide text-base transition-colors duration-150 hover:bg-accent-bright"
    >
      <i class="ph ph-envelope" aria-hidden="true" />
      Get in touch
    </a>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Create contact page**

Create `src/pages/contact.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import ContactForm from "../components/ContactForm.astro";
---

<BaseLayout title="Contact — Robin van Baalen" description="Get in touch for consulting, architecture reviews, and technical leadership.">
  <h1 class="mb-2 text-3xl font-normal tracking-tight text-primary">Contact</h1>
  <p class="mb-10 max-w-lg text-muted">
    Available for consulting, architecture reviews, and technical leadership.
    Tell me about your project and I'll get back to you.
  </p>

  <div class="max-w-lg">
    <ContactForm />
  </div>
</BaseLayout>
```

- [ ] **Step 4: Create 404 page**

Create `src/pages/404.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="Not Found — Robin van Baalen">
  <div class="flex flex-col items-start py-20">
    <p class="mb-4 font-mono text-sm text-accent">404</p>
    <h1 class="mb-4 text-3xl font-normal tracking-tight text-primary">Page not found</h1>
    <p class="mb-8 text-muted">The page you're looking for doesn't exist or has been moved.</p>
    <a
      href="/"
      class="inline-flex items-center gap-2 font-mono text-xs text-accent transition-colors duration-150 hover:text-accent-bright"
    >
      <i class="ph ph-arrow-left text-[11px]" aria-hidden="true" />
      Back to home
    </a>
  </div>
</BaseLayout>
```

- [ ] **Step 5: Build and verify**

```bash
npm run build
```

Expected: Build succeeds. All four pages render correctly with proper layouts, navigation active states, and OKLCH styling.

- [ ] **Step 6: Commit**

```bash
git add src/pages/projects/ src/pages/about.astro src/pages/contact.astro src/pages/404.astro
git commit -m "feat: add projects, about, contact, and 404 pages"
```

---

### Task 14: RSS Feed + Sitemap

**Files:**
- Create: `src/pages/rss.xml.ts`
- Modify: `package.json` (add `@astrojs/rss`)

- [ ] **Step 1: Install RSS package**

```bash
npm install @astrojs/rss
```

- [ ] **Step 2: Create RSS feed endpoint**

Create `src/pages/rss.xml.ts`:

```typescript
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const articles = await getCollection("articles", ({ data }) => !data.draft);

  return rss({
    title: "Robin van Baalen",
    description:
      "Articles about software engineering, architecture, and building products.",
    site: context.site!,
    items: articles
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map((article) => ({
        title: article.data.title,
        pubDate: article.data.date,
        description: article.data.description,
        link: `/articles/${article.id}/`,
      })),
  });
}
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Expected: Build succeeds. `dist/rss.xml` exists and contains valid RSS XML. `dist/sitemap-index.xml` exists (auto-generated by `@astrojs/sitemap`).

- [ ] **Step 4: Commit**

```bash
git add src/pages/rss.xml.ts package.json package-lock.json
git commit -m "feat: add rss feed and sitemap generation"
```

---

### Task 15: Scroll Animations (FadeIn)

**Files:**
- Create: `src/components/FadeIn.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create FadeIn wrapper component**

Create `src/components/FadeIn.astro`:

```astro
---
// Wraps children in a container that fades in when scrolled into view.
// Uses IntersectionObserver. Respects prefers-reduced-motion via CSS.
interface Props {
  delay?: number; // delay in ms, for staggering
  class?: string;
}

const { delay = 0, class: className = "" } = Astro.props;
---

<div
  class:list={["fade-in-target opacity-0 translate-y-3", className]}
  style={delay ? `transition-delay: ${delay}ms` : undefined}
>
  <slot />
</div>

<script>
  // Only run once — observes all .fade-in-target elements
  if (!document.querySelector("[data-fade-init]")) {
    const style = document.createElement("style");
    style.textContent = `.fade-in-visible { opacity: 1 !important; transform: translateY(0) !important; transition: opacity 0.5s ease, transform 0.5s ease; }`;
    style.setAttribute("data-fade-init", "");
    document.head.appendChild(style);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".fade-in-target").forEach((el) => {
      observer.observe(el);
    });
  }
</script>
```

- [ ] **Step 2: Add FadeIn wrappers to home page sections**

In `src/pages/index.astro`, import FadeIn and wrap the article cards and project rows with staggered delays. Add this import at the top:

```astro
import FadeIn from "../components/FadeIn.astro";
```

Wrap each `ArticleCard` inside the articles grid:

```astro
{recentArticles.map((article, i) => (
  <FadeIn delay={i * 100}>
    <ArticleCard
      title={article.data.title}
      description={article.data.description}
      date={article.data.date}
      slug={article.id}
      tags={article.data.tags}
    />
  </FadeIn>
))}
```

Wrap each `ProjectRow` inside the projects section:

```astro
{featuredProjects.map((project, i) => (
  <FadeIn delay={i * 80}>
    <ProjectRow
      name={project.data.name}
      description={project.data.description}
      tech={project.data.tech}
      url={project.data.url}
      repo={project.data.repo}
    />
  </FadeIn>
))}
```

- [ ] **Step 3: Build and verify**

```bash
npm run dev
```

Expected: Article cards and project rows fade in with staggered timing as you scroll down. Animation is disabled when `prefers-reduced-motion` is set (elements appear immediately due to the CSS reset in global.css).

- [ ] **Step 4: Commit**

```bash
git add src/components/FadeIn.astro src/pages/index.astro
git commit -m "feat: add scroll-triggered fade-in animations"
```

---

### Task 16: Mobile Responsive Layout

**Files:**
- Create: `src/components/MobileNav.astro`
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create MobileNav component**

Create `src/components/MobileNav.astro`:

```astro
---
interface Props {
  currentPath: string;
}

const { currentPath } = Astro.props;

const navItems = [
  { href: "/", icon: "house", label: "Home" },
  { href: "/articles", icon: "article", label: "Articles" },
  { href: "/projects", icon: "code", label: "Projects" },
  { href: "/about", icon: "user", label: "About" },
  { href: "/contact", icon: "envelope", label: "Contact" },
];

function isActive(href: string, current: string): boolean {
  if (href === "/") return current === "/";
  return current.startsWith(href);
}
---

<!-- Bottom navigation bar for mobile -->
<nav
  class="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-edge bg-surface/95 px-2 py-2 backdrop-blur-sm md:hidden"
  aria-label="Mobile navigation"
>
  {navItems.map((item) => (
    <a
      href={item.href}
      class:list={[
        "flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-mono transition-colors duration-150",
        isActive(item.href, currentPath) ? "text-accent" : "text-muted",
      ]}
    >
      <i class={`ph ph-${item.icon} text-lg`} aria-hidden="true" />
      <span>{item.label}</span>
    </a>
  ))}
</nav>
```

- [ ] **Step 2: Add MobileNav to BaseLayout**

In `src/layouts/BaseLayout.astro`, import MobileNav:

```astro
import MobileNav from "../components/MobileNav.astro";
```

Add it after the closing `</div>` of the layout grid but before `</body>`:

```astro
<MobileNav currentPath={currentPath} />
```

Also add bottom padding to the body on mobile to prevent content from being hidden behind the bottom nav:

Update the body class to:
```html
<body class="bg-base text-secondary font-serif leading-relaxed pb-16 md:pb-0">
```

- [ ] **Step 3: Build and verify**

```bash
npm run dev
```

Expected: On desktop (768px+), the sidebar is visible and MobileNav is hidden. On mobile (<768px), the sidebar is hidden (`hidden md:block` on the sidebar wrapper), the MobileNav appears fixed at the bottom with icon-only links, and the main content is full-width.

- [ ] **Step 4: Commit**

```bash
git add src/components/MobileNav.astro src/layouts/BaseLayout.astro
git commit -m "feat: add responsive mobile bottom navigation"
```

---

### Task 17: Cloudflare Function for Contact Form

**Files:**
- Create: `functions/api/contact.ts`

- [ ] **Step 1: Create the Cloudflare Function**

Create `functions/api/contact.ts`:

```typescript
interface Env {
  TURNSTILE_SECRET_KEY: string;
  CONTACT_EMAIL: string;
  RESEND_API_KEY?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const turnstileToken = formData.get("cf-turnstile-response") as string;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response("All fields are required.", { status: 400 });
    }

    // Validate Turnstile token
    if (env.TURNSTILE_SECRET_KEY && env.TURNSTILE_SECRET_KEY !== "TURNSTILE_SITE_KEY_PLACEHOLDER") {
      const turnstileResponse = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: env.TURNSTILE_SECRET_KEY,
            response: turnstileToken || "",
          }),
        },
      );
      const turnstileResult =
        (await turnstileResponse.json()) as { success: boolean };
      if (!turnstileResult.success) {
        return new Response("Spam check failed. Please try again.", {
          status: 403,
        });
      }
    }

    // Send email via Resend (if configured)
    if (env.RESEND_API_KEY && env.CONTACT_EMAIL) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "website@robinvanbaalen.nl",
          to: env.CONTACT_EMAIL,
          subject: `[Website] ${subject}`,
          text: `From: ${name} (${email})\n\n${message}`,
        }),
      });
    }

    // Redirect back to contact page with success message
    return Response.redirect(
      new URL("/contact?success=true", request.url).toString(),
      303,
    );
  } catch {
    return new Response("Something went wrong. Please try again.", {
      status: 500,
    });
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add functions/
git commit -m "feat: add cloudflare function for contact form handling"
```

---

### Task 18: Update CLAUDE.md + CI/CD

**Files:**
- Modify: `CLAUDE.md`, `.github/workflows/release-please.yml`

- [ ] **Step 1: Update CLAUDE.md**

Replace the entire contents of `CLAUDE.md`:

```markdown
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
```

- [ ] **Step 2: Update release-please workflow for Astro**

In `.github/workflows/release-please.yml`, update the build step to work with Astro. The build command (`npm run build`) and output directory (`dist/`) are already correct. Update the `node-version-file` to use `package.json` (already set). The workflow should also copy the CNAME to dist:

In the build job, after the `npm run build` step, add:

```yaml
      - name: Copy CNAME to dist
        run: cp CNAME dist/CNAME
```

Note: When migrating to Cloudflare Pages, this GitHub Pages deployment workflow will be replaced. For now, keep it working so the existing deployment isn't broken during the transition.

- [ ] **Step 3: Build final verification**

```bash
npm run build
```

Expected: Full site builds successfully with all pages, content collections, RSS feed, and sitemap.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md .github/workflows/release-please.yml
git commit -m "docs: update CLAUDE.md and CI/CD for astro project structure"
```

---

## Post-Implementation Notes

### Open items requiring user input:
1. **PostHog tokens** — Add PostHog script to `src/layouts/BaseLayout.astro` once tokens are provided
2. **Turnstile site key** — Replace `TURNSTILE_SITE_KEY_PLACEHOLDER` in `ContactForm.astro` with real Cloudflare Turnstile site key
3. **Cloudflare env vars** — Set `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_EMAIL` in Cloudflare Pages dashboard
4. **DNS migration** — Follow the staged cutover plan in the design spec
5. **Real articles** — Replace/supplement the sample article with real content

### Verification checklist:
- [ ] `npm run dev` starts without errors
- [ ] Home page renders all sections (intro, articles, projects, contact)
- [ ] Sidebar navigation highlights correct active page
- [ ] Pulsating dot animation on active nav item
- [ ] Availability badge has pulsating green glow
- [ ] Article cards fade in on scroll
- [ ] Project rows highlight on hover with accent color
- [ ] Contact form fields have focus states
- [ ] Mobile bottom nav appears below 768px
- [ ] Sidebar hidden on mobile
- [ ] RSS feed at `/rss.xml` contains article entries
- [ ] Sitemap generated at `/sitemap-index.xml`
- [ ] 404 page renders for unknown routes
- [ ] All colors are OKLCH (no hex/hsl values)
- [ ] `prefers-reduced-motion: reduce` disables all animations
- [ ] `npm run build` succeeds with zero errors
