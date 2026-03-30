# Intentional Craft — Homepage, Writing & About Level-Up

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make three pages (homepage, writing, about) feel like one authored experience with intentional craft — view transitions, ledger-format writing page, sarcastic empty state, concise about page, project hover reveals.

**Architecture:** Incremental improvements to existing Astro 5 + Tailwind CSS v4 site. No new dependencies. Extends existing view transitions with `transition:name` directives. Adds optional `hover_detail` field to project content schema. Replaces card-based writing layout with editorial ledger format.

**Tech Stack:** Astro 5.x, Tailwind CSS v4, OKLCH color tokens, Phosphor Icons

**Design Doc:** `~/.gstack/projects/rvanbaalen-website/robin-main-design-20260329-225309.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/content.config.ts` | Modify | Add optional `hover_detail` field to project schema |
| `src/components/ProjectRow.astro` | Modify | Add hover detail reveal |
| `src/components/ArticleCard.astro` | Modify | Fix link path from `/articles/` to `/writing/` |
| `src/components/ArticleLedgerRow.astro` | Create | New ledger-format article row component |
| `src/pages/writing/index.astro` | Modify | Ledger format + sarcastic empty state |
| `src/pages/index.astro` | Modify | Writing section empty state + ledger format, transition:name on section labels |
| `src/pages/about.astro` | Modify | Concise thesis-style statements |
| `src/pages/open-source/index.astro` | Modify | Add transition:name to heading |
| `src/pages/articles/index.astro` | Delete | Redirect to /writing |
| `src/pages/articles/[...slug].astro` | Delete | Redirect to /writing |
| `DESIGN.md` | Modify | Add view transition motion rules |
| `src/content/projects/*.yaml` | Modify | Add hover_detail to featured projects |

---

### Task 1: Route Cleanup — Remove duplicate /articles routes

**Files:**
- Delete: `src/pages/articles/index.astro`
- Delete: `src/pages/articles/[...slug].astro`
- Modify: `src/components/ArticleCard.astro:20`

The site has both `/articles/` and `/writing/` routes. `/writing/` is canonical. ArticleCard currently links to `/articles/${slug}` which is wrong.

- [ ] **Step 1: Fix ArticleCard link path**

In `src/components/ArticleCard.astro`, change the href from `/articles/` to `/writing/`:

```astro
<!-- Line 20: change this -->
<a
  href={`/writing/${slug}`}
```

- [ ] **Step 2: Delete the /articles route files**

Remove:
- `src/pages/articles/index.astro`
- `src/pages/articles/[...slug].astro`

The `/writing/` versions already exist and are identical in functionality.

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with no errors about missing routes.

- [ ] **Step 4: Commit**

```bash
git add src/components/ArticleCard.astro
git add src/pages/articles/
git commit -m "fix: remove duplicate /articles routes, fix ArticleCard links to /writing"
```

---

### Task 2: Add hover_detail to project content schema

**Files:**
- Modify: `src/content.config.ts:17-27`
- Modify: `src/content/projects/hashparser.yaml` (and other featured projects)

- [ ] **Step 1: Add optional hover_detail field to schema**

In `src/content.config.ts`, add `hover_detail` to the projects schema:

```typescript
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
    hover_detail: z.string().optional(),
  }),
});
```

- [ ] **Step 2: Add hover_detail to featured project YAML files**

Add `hover_detail` to each featured project. Read each featured project's YAML to understand what it does, then write a short, specific detail line. Examples:

`src/content/projects/hashparser.yaml` — add:
```yaml
hover_detail: "Zero dependencies · 1.2KB gzipped"
```

Check which projects have `featured: true` and add a `hover_detail` to each one. Keep it short (under 50 chars), specific, and factual. If you can't determine a good detail, skip that project — the field is optional.

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds. No schema validation errors.

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/content/projects/
git commit -m "feat: add optional hover_detail field to project content schema"
```

---

### Task 3: ProjectRow hover reveal

**Files:**
- Modify: `src/components/ProjectRow.astro`

Add the signature micro-interaction: on hover, reveal one additional line of context below the description. Only shows if `hover_detail` prop is provided.

- [ ] **Step 1: Add hover_detail prop and reveal element**

Replace the full content of `src/components/ProjectRow.astro`:

```astro
---
interface Props {
  name: string;
  description: string;
  tech: string[];
  url?: string;
  repo: string;
  hoverDetail?: string;
}

const { name, description, tech, url, repo, hoverDetail } = Astro.props;
const href = url || repo;
const isExternal = href.startsWith("http");
---

<a
  href={href}
  {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
  class="group flex items-center justify-between rounded-md px-4 py-4 transition-[background,transform] duration-150 hover:bg-surface-hover"
>
  <div>
    <span class="text-lg font-medium text-primary transition-colors duration-150 group-hover:text-accent-bright">
      {name}
    </span>
    <p class="mt-0.5 font-sans text-base text-muted transition-colors duration-150 group-hover:text-secondary">
      {description}
    </p>
    {hoverDetail && (
      <p class="mt-1 max-h-0 overflow-hidden font-sans text-[13px] text-dim opacity-0 translate-y-1 transition-[max-height,opacity,transform] duration-150 group-hover:max-h-8 group-hover:opacity-100 group-hover:translate-y-0">
        {hoverDetail}
      </p>
    )}
  </div>
  <div class="flex items-center gap-4 shrink-0">
    <span class="font-sans text-[13px] text-dim">
      {tech.join(" · ")}
    </span>
    <i class="ph ph-arrow-right text-dim opacity-0 -translate-x-1 transition-[opacity,transform] duration-150 group-hover:opacity-100 group-hover:translate-x-0" aria-hidden="true" />
  </div>
</a>
```

- [ ] **Step 2: Pass hover_detail from homepage and open-source page**

In `src/pages/index.astro`, update the ProjectRow usage (around line 71-77):

```astro
<ProjectRow
  name={project.data.name}
  description={project.data.description}
  tech={project.data.tech}
  url={project.data.url}
  repo={project.data.repo}
  hoverDetail={project.data.hover_detail}
/>
```

In `src/pages/open-source/index.astro`, update the ProjectRow usage (around line 31-36):

```astro
<ProjectRow
  name={project.data.name}
  description={project.data.description}
  tech={project.data.tech}
  url={project.data.url}
  repo={project.data.repo}
  hoverDetail={project.data.hover_detail}
/>
```

- [ ] **Step 3: Verify build passes and test locally**

Run: `npm run build`
Then: `npm run dev` — hover over project rows with hover_detail to verify the reveal animation works. Projects without hover_detail should look unchanged.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectRow.astro src/pages/index.astro src/pages/open-source/index.astro
git commit -m "feat: add subtle hover detail reveal to project rows"
```

---

### Task 4: ArticleLedgerRow component

**Files:**
- Create: `src/components/ArticleLedgerRow.astro`

Create the ledger-format article row: date left, title right, description below. Editorial, like a table of contents.

- [ ] **Step 1: Create the component**

Create `src/components/ArticleLedgerRow.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
  date: Date;
  slug: string;
}

const { title, description, date, slug } = Astro.props;

const formattedDate = date.toLocaleDateString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
---

<a
  href={`/writing/${slug}`}
  class="group grid grid-cols-[auto_1fr] gap-x-6 rounded-md px-4 py-4 transition-[background] duration-150 hover:bg-surface-hover max-sm:grid-cols-1 max-sm:gap-x-0"
>
  <span class="font-sans text-[14px] text-dim transition-colors duration-150 group-hover:text-muted whitespace-nowrap pt-0.5">
    {formattedDate}
  </span>
  <div>
    <span class="text-lg font-medium text-primary transition-colors duration-150 group-hover:text-accent-bright">
      {title}
    </span>
    <p class="mt-0.5 font-sans text-base text-muted transition-colors duration-150 group-hover:text-secondary">
      {description}
    </p>
  </div>
</a>
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds (component exists but is not yet used — that's fine).

- [ ] **Step 3: Commit**

```bash
git add src/components/ArticleLedgerRow.astro
git commit -m "feat: add ArticleLedgerRow component for editorial ledger format"
```

---

### Task 5: Writing page — ledger format + sarcastic empty state

**Files:**
- Modify: `src/pages/writing/index.astro`

Replace the card grid with the ledger format. Add a sarcastic empty state for when no real articles exist.

- [ ] **Step 1: Rewrite the writing page**

Replace the full content of `src/pages/writing/index.astro`:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import ArticleLedgerRow from "../../components/ArticleLedgerRow.astro";
import FadeIn from "../../components/FadeIn.astro";

const articles = await getCollection("articles", ({ data }) => !data.draft);
const sorted = articles.sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime(),
);

// Filter out placeholder articles (no real content)
const realArticles = sorted.filter(
  (a) => a.body && a.body.trim().length > 100
);
---

<BaseLayout title="Writing — Robin van Baalen" description="Things I find interesting enough to write about.">
  <section>
    <h1 class="mb-2 text-3xl font-normal tracking-tight text-primary" transition:name="writing-heading">Writing</h1>
    {realArticles.length > 0 ? (
      <>
        <p class="mb-10 text-lg text-muted">I only write when something's worth reading.</p>
        <div>
          {realArticles.map((article, i) => (
            <FadeIn delay={i * 80}>
              <ArticleLedgerRow
                title={article.data.title}
                description={article.data.description}
                date={article.data.date}
                slug={article.id}
              />
            </FadeIn>
          ))}
        </div>
      </>
    ) : (
      <div class="mt-16 mb-16">
        <p class="text-lg text-muted">
          Nothing here yet. I only publish things I'd actually want to read.
        </p>
        <p class="mt-2 font-sans text-[14px] text-dim">
          The bar is high. Check back later.
        </p>
      </div>
    )}
  </section>
</BaseLayout>
```

- [ ] **Step 2: Verify build and check locally**

Run: `npm run build`
Then: `npm run dev` — navigate to /writing. With only a placeholder article (body < 100 chars), you should see the sarcastic empty state.

- [ ] **Step 3: Commit**

```bash
git add src/pages/writing/index.astro
git commit -m "feat: writing page ledger format with sarcastic empty state"
```

---

### Task 6: Homepage writing section — empty state + ledger format

**Files:**
- Modify: `src/pages/index.astro`

Update the homepage writing section to use the same empty-state logic and ledger format. Add `transition:name` to section labels.

- [ ] **Step 1: Rewrite the homepage**

Replace the full content of `src/pages/index.astro`:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import ArticleLedgerRow from "../components/ArticleLedgerRow.astro";
import ProjectRow from "../components/ProjectRow.astro";
import ContactForm from "../components/ContactForm.astro";
import FadeIn from "../components/FadeIn.astro";

const allArticles = await getCollection("articles", ({ data }) => !data.draft);
const realArticles = allArticles
  .filter((a) => a.body && a.body.trim().length > 100)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 4);

const allProjects = await getCollection("projects");
const featuredProjects = allProjects
  .filter((p) => p.data.featured && !p.data.archived)
  .sort((a, b) => a.data.order - b.data.order);
---

<BaseLayout title="Robin van Baalen">
  <!-- Hero with subtle gradient atmosphere -->
  <section class="relative mb-16">
    <div class="pointer-events-none absolute -inset-x-40 -inset-y-20 z-[-1]" style={`background: radial-gradient(ellipse at 8% 15%, oklch(62% 0.04 260 / var(--gradient-intensity)), transparent 50%);`} aria-hidden="true" />
    <h1 class="mb-6 text-[60px] font-normal leading-[1.1] tracking-tight text-primary" data-kinetic-hero>
      SaaS founder and software architect. Building with AI every day.
    </h1>
  </section>

  <script>
    function initKineticHero() {
      const hero = document.querySelector("[data-kinetic-hero]");
      if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (hero.hasAttribute("data-kinetic-done")) return;
      hero.setAttribute("data-kinetic-done", "");

      const text = hero.textContent || "";
      const words = text.trim().split(/\s+/);
      while (hero.firstChild) hero.removeChild(hero.firstChild);

      words.forEach((word, i) => {
        const span = document.createElement("span");
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "translateY(10px)";
        span.style.animation = `word-in 500ms cubic-bezier(0.22, 1, 0.36, 1) ${150 + i * 100}ms forwards`;
        span.textContent = word + "\u00A0";
        hero.appendChild(span);
      });
    }
    initKineticHero();
    document.addEventListener("astro:page-load", initKineticHero);
  </script>

  <div class="h-px bg-gradient-to-r from-edge to-transparent" />

  <!-- Open Source -->
  <section class="py-12">
    <div class="mb-6 flex items-center justify-between font-sans text-[14px] font-medium text-dim">
      <span class="flex items-center gap-1.5" transition:name="opensource-heading">
        <i class="ph ph-git-branch text-[15px]" aria-hidden="true" />
        Open source
      </span>
      <a href="/open-source" class="flex items-center gap-1 text-accent transition-[color,gap] duration-150 hover:text-accent-bright hover:gap-2">
        View all <i class="ph ph-arrow-right text-[13px]" aria-hidden="true" />
      </a>
    </div>
    <div>
      {featuredProjects.map((project, i) => (
        <FadeIn delay={i * 80}>
          <ProjectRow
            name={project.data.name}
            description={project.data.description}
            tech={project.data.tech}
            url={project.data.url}
            repo={project.data.repo}
            hoverDetail={project.data.hover_detail}
          />
        </FadeIn>
      ))}
    </div>
  </section>

  <div class="h-px bg-gradient-to-r from-edge to-transparent" />

  <!-- Writing -->
  <section class="py-12">
    <div class="mb-6 flex items-center justify-between font-sans text-[14px] font-medium text-dim">
      <span class="flex items-center gap-1.5" transition:name="writing-heading">
        <i class="ph ph-notebook text-[15px]" aria-hidden="true" />
        Writing
      </span>
      <a href="/writing" class="flex items-center gap-1 text-accent transition-[color,gap] duration-150 hover:text-accent-bright hover:gap-2">
        View all <i class="ph ph-arrow-right text-[13px]" aria-hidden="true" />
      </a>
    </div>
    {realArticles.length > 0 ? (
      <div>
        {realArticles.map((article, i) => (
          <FadeIn delay={i * 80}>
            <ArticleLedgerRow
              title={article.data.title}
              description={article.data.description}
              date={article.data.date}
              slug={article.id}
            />
          </FadeIn>
        ))}
      </div>
    ) : (
      <p class="px-4 text-muted">
        Nothing here yet. I only publish things I'd actually want to read.
      </p>
    )}
  </section>

  <!-- Contact -->
  <section id="contact" class="relative mt-14 rounded-xl border border-edge bg-surface p-10 transition-colors duration-300">
    <div class="pointer-events-none absolute -inset-x-20 -inset-y-10 z-[-1]" style={`background: radial-gradient(ellipse at 50% 40%, oklch(62% 0.04 260 / calc(var(--gradient-intensity) * 0.5)), transparent 40%);`} aria-hidden="true" />
    <h2 class="mb-2 flex items-center gap-2.5 text-[28px] font-normal text-primary">
      <i class="ph ph-coffee text-accent transition-colors duration-150" aria-hidden="true" />
      Grab a coffee?
    </h2>
    <p class="mb-6 font-sans text-base text-muted">
      No pitch, no pressure. Just a conversation. You'll walk away with fresh
      perspectives on whatever you're working on... and I'll probably learn
      something too.
    </p>
    <ContactForm />
  </section>
</BaseLayout>
```

Key changes from original:
- Replaced `ArticleCard` import with `ArticleLedgerRow`
- Added `realArticles` filter (body > 100 chars) to hide placeholder articles
- Writing section always shows (not conditional on article count) — empty state has personality
- Section label changed from "Recent writing" to "Writing" for transition:name consistency
- Added `transition:name="opensource-heading"` and `transition:name="writing-heading"` to section labels
- Passed `hoverDetail` to ProjectRow
- Removed `Availability` import (not used on homepage)

- [ ] **Step 2: Add transition:name to open-source page heading**

In `src/pages/open-source/index.astro`, add `transition:name` to the h1:

```astro
<h1 class="mb-2 text-3xl font-normal tracking-tight text-primary" transition:name="opensource-heading">Open Source</h1>
```

- [ ] **Step 3: Verify build and test locally**

Run: `npm run build`
Then: `npm run dev` — check:
1. Homepage shows writing section with empty state message
2. Navigate between homepage and /writing — observe view transition on "Writing" heading
3. Navigate between homepage and /open-source — observe view transition on "Open source" heading
4. If label-to-heading morph looks jarring (different text sizes), note this for a follow-up fix (fall back to crossfade)

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/pages/open-source/index.astro
git commit -m "feat: homepage writing section with empty state, view transition names on section labels"
```

---

### Task 7: About page — concise thesis-style statements

**Files:**
- Modify: `src/pages/about.astro`

Replace the four generic paragraphs with 3-4 concise, opinionated statements. This task requires copy workshopping with the user — present drafts and iterate.

- [ ] **Step 1: Rewrite the about page structure**

Replace the full content of `src/pages/about.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Availability from "../components/Availability.astro";
---

<BaseLayout title="About — Robin van Baalen" description="Software engineer, architect, consultant. Building tools, writing code, solving problems.">
  <h1 class="mb-10 text-3xl font-normal tracking-tight text-primary">About</h1>

  <div class="max-w-xl space-y-10">
    <div>
      <p class="text-lg text-primary font-medium leading-snug">
        I build software. I've been doing it since I was eight.
      </p>
      <p class="mt-2 text-base text-muted">
        Developer, architect, consultant. The title changes, the work doesn't: make things that work well, solve real problems, ship.
      </p>
    </div>

    <div>
      <p class="text-lg text-primary font-medium leading-snug">
        Good software is simple software.
      </p>
      <p class="mt-2 text-base text-muted">
        Zero-dependency packages. Single-purpose tools. Code that does one thing and does it well. The best architecture is the one you don't have to think about.
      </p>
    </div>

    <div>
      <p class="text-lg text-primary font-medium leading-snug">
        Right now, I'm building with AI every day.
      </p>
      <p class="mt-2 text-base text-muted">
        Not because it's trendy. Because it fundamentally changes what a single person can build. I read every changelog, try every new tool, and care about the craft of making software.
      </p>
    </div>

    <div>
      <p class="text-lg text-primary font-medium leading-snug">
        If you're working through something, let's talk.
      </p>
      <p class="mt-2 text-base text-muted">
        Architecture decisions, team scaling, AI integration, or something else entirely. No pitch, no pressure. Just a conversation.
      </p>
    </div>
  </div>

  <div class="mt-10">
    <Availability />
  </div>
  <div class="mt-8">
    <a
      href="/contact"
      class="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-sans text-[16px] font-medium text-[var(--color-base)] transition-[background,transform,box-shadow] duration-150 hover:bg-accent-bright hover:-translate-y-px hover:shadow-[0_4px_12px_var(--color-accent-glow)] active:translate-y-0"
    >
      <i class="ph ph-coffee" aria-hidden="true" />
      Let's talk
    </a>
  </div>
</BaseLayout>
```

Key changes:
- Removed "nearly thirty years ago" phrasing (violates voice rule: no counting)
- Structured as 4 thesis statements with context below each
- Smart, warm, direct voice
- No corporate speak, no resume energy
- Kept Availability badge and CTA

**NOTE:** This copy is a starting point. Present it to the user and iterate based on their feedback. The design doc explicitly says hero and about copy must be workshopped with Robin.

- [ ] **Step 2: Verify build**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: about page as concise thesis-style statements"
```

---

### Task 8: Extend DESIGN.md with view transition motion rules

**Files:**
- Modify: `DESIGN.md`

Add view transition entries to the existing Motion section, using the existing token vocabulary.

- [ ] **Step 1: Add view transition rules to DESIGN.md**

After the existing "### Animations" section in DESIGN.md (around line 143), add:

```markdown

### View Transitions
All view transitions use Astro's built-in View Transitions API. Progressive enhancement — browsers without support fall back to instant page swap.
- **Page crossfade:** `var(--dur-short)` (150ms), ease-out
- **Shared elements (sidebar, section labels):** `var(--dur-medium)` (300ms), enter easing
- **Hover reveal (project rows):** `var(--dur-short)` (150ms), ease-out, opacity + translateY(4px)
- **Reduced motion:** Instant swap, no animation (handled by global prefers-reduced-motion reset)

No new duration tokens. No new easing curves. Consistency is craft.
```

- [ ] **Step 2: Commit**

```bash
git add DESIGN.md
git commit -m "docs: add view transition motion rules to DESIGN.md"
```

---

### Task 9: Final verification

- [ ] **Step 1: Full build check**

Run: `npm run build`
Expected: Clean build, no errors, no warnings about missing routes.

- [ ] **Step 2: Dev server visual check**

Run: `npm run dev`

Check each page:
1. **Homepage:** Hero, open source section with hover reveals, writing section with empty state, contact form with `id="contact"`
2. **Navigate to /writing:** View transition on "Writing" heading. Sarcastic empty state centered.
3. **Navigate to /open-source:** View transition on heading. Hover reveals work on project rows.
4. **Navigate to /about:** Thesis-style statements, no "thirty years" phrasing, availability badge + CTA
5. **Navigate to /articles:** Should 404 (routes removed)
6. **Hover over project rows:** Detail line fades in smoothly where hover_detail exists
7. **Check reduced motion:** Enable prefers-reduced-motion in browser devtools, verify no animations play

- [ ] **Step 3: Note any view transition issues**

If the section label → page heading morph transition looks jarring (different text sizes producing a glitchy mid-state), the fix is to change from morph to a named crossfade. This is a known risk from the design doc — prototype first, fall back if needed.

- [ ] **Step 4: Commit any fixes from verification**

```bash
git add -A
git commit -m "fix: post-verification adjustments"
```
