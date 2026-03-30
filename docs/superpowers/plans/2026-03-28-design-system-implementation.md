# Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the evolved design system from DESIGN.md — cool slate accent, DM Sans labels, bigger type, topo pattern, kinetic hero, glassy sidebar, light/dark toggle, transitions on all hovers.

**Architecture:** Systematic file-by-file migration. Start with the foundation (CSS tokens, fonts), then components bottom-up, then pages. Each task produces a buildable site. No test framework exists — verification is `npm run build` + visual check.

**Tech Stack:** Astro 5, Tailwind CSS v4, OKLCH colors, @fontsource

---

### Task 1: Install DM Sans font package

**Files:**
- Modify: `package.json`
- Modify: `src/styles/global.css:1-5` (font imports)

- [ ] **Step 1: Install the font**

Run: `npm install @fontsource-variable/dm-sans`

- [ ] **Step 2: Add DM Sans import to global.css**

In `src/styles/global.css`, add after the existing font imports (line 4):

```css
@import "@fontsource-variable/dm-sans";
```

- [ ] **Step 3: Add `--font-sans` to the `@theme` block**

In `src/styles/global.css`, inside the `@theme { }` block, add after the `--font-mono` line:

```css
  --font-sans: "DM Sans Variable", system-ui, sans-serif;
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/styles/global.css
git commit -m "feat: add DM Sans variable font for UI labels"
```

---

### Task 2: Update color tokens — cool slate accent + light/dark themes

**Files:**
- Modify: `src/styles/global.css` (full rewrite of `@theme` block + add dark/light custom properties)

- [ ] **Step 1: Replace the `@theme` block in global.css**

Replace the entire `@theme { ... }` block with:

```css
@theme {
  /* Typography */
  --font-serif: "Lora", Georgia, serif;
  --font-sans: "DM Sans Variable", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", "Fira Code", monospace;

  /* Spacing scale (4px base) */
  --spacing-2xs: 2px;
  --spacing-xs: 4px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Motion */
  --ease-enter: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-move: cubic-bezier(0.45, 0, 0.55, 1);
  --dur-micro: 75ms;
  --dur-short: 150ms;
  --dur-medium: 300ms;
  --dur-long: 500ms;

  /* Dark theme colors (default) */
  --color-base: oklch(10% 0.01 260);
  --color-surface: oklch(14% 0.012 260);
  --color-surface-hover: oklch(17% 0.015 260);
  --color-edge: oklch(20% 0.015 260);
  --color-edge-subtle: oklch(16% 0.01 260);
  --color-primary: oklch(93% 0.015 80);
  --color-secondary: oklch(65% 0.01 80);
  --color-muted: oklch(45% 0.008 260);
  --color-dim: oklch(30% 0.008 260);

  /* Cool slate accent */
  --color-accent: oklch(62% 0.04 260);
  --color-accent-bright: oklch(70% 0.05 260);
  --color-accent-dim: oklch(52% 0.03 260);
  --color-accent-glow: oklch(62% 0.04 260 / 0.1);
  --color-accent-subtle: oklch(62% 0.04 260 / 0.05);

  /* Status */
  --color-green: oklch(62% 0.14 150);
  --color-green-glow: oklch(62% 0.14 150 / 0.3);

  /* Semantic */
  --color-warning: oklch(72% 0.14 85);
  --color-error: oklch(62% 0.2 25);
  --color-info: oklch(62% 0.04 260);

  /* Topo pattern */
  --topo-opacity: 0.035;
  --gradient-intensity: 0.035;
}
```

- [ ] **Step 2: Add light theme overrides after the `@theme` block**

Add this CSS after the `@theme { }` block but before the `prefers-reduced-motion` media query:

```css
/* Light theme overrides */
[data-theme="light"] {
  --color-base: oklch(97% 0.005 80);
  --color-surface: oklch(100% 0 0);
  --color-surface-hover: oklch(95% 0.005 80);
  --color-edge: oklch(85% 0.01 80);
  --color-edge-subtle: oklch(90% 0.005 80);
  --color-primary: oklch(15% 0.01 260);
  --color-secondary: oklch(35% 0.01 260);
  --color-muted: oklch(55% 0.008 260);
  --color-dim: oklch(70% 0.005 260);
  --color-accent: oklch(42% 0.04 260);
  --color-accent-bright: oklch(35% 0.05 260);
  --color-accent-dim: oklch(52% 0.03 260);
  --color-accent-glow: oklch(42% 0.04 260 / 0.08);
  --color-accent-subtle: oklch(42% 0.04 260 / 0.04);
  --color-green: oklch(50% 0.14 150);
  --color-green-glow: oklch(50% 0.14 150 / 0.2);
  --color-warning: oklch(60% 0.14 85);
  --color-error: oklch(52% 0.2 25);
  --color-info: oklch(42% 0.04 260);
  --topo-opacity: 0.05;
  --gradient-intensity: 0.025;
}
```

- [ ] **Step 3: Update keyframes**

Replace the existing keyframes in global.css with:

```css
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.5); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 6px var(--color-green-glow); }
  50% { box-shadow: 0 0 14px var(--color-green-glow); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes word-in {
  to { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds. Colors may look different in browser but no errors.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: cool slate accent, light/dark theme tokens, motion tokens"
```

---

### Task 3: Replace DotPattern with TopoPattern

**Files:**
- Delete: `src/components/DotPattern.astro`
- Create: `src/components/TopoPattern.astro`
- Modify: `src/layouts/BaseLayout.astro:4` (import change)

- [ ] **Step 1: Create TopoPattern.astro**

Create `src/components/TopoPattern.astro`:

```astro
---
// SVG topographic contour line background with radial fade mask
// Fixed position, behind all content, purely decorative
---

<div
  class="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
  style={`opacity: var(--topo-opacity); mask-image: radial-gradient(ellipse at 20% 15%, black 5%, transparent 50%); -webkit-mask-image: radial-gradient(ellipse at 20% 15%, black 5%, transparent 50%);`}
  aria-hidden="true"
>
  <svg viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" class="h-full w-full">
    <g fill="none" stroke="currentColor" stroke-width="0.5" class="text-primary">
      <ellipse cx="350" cy="300" rx="320" ry="200" />
      <ellipse cx="348" cy="298" rx="260" ry="160" />
      <ellipse cx="345" cy="295" rx="200" ry="120" />
      <ellipse cx="342" cy="290" rx="145" ry="85" />
      <ellipse cx="338" cy="285" rx="95" ry="54" />
      <ellipse cx="335" cy="280" rx="50" ry="28" />
      <ellipse cx="780" cy="500" rx="220" ry="150" />
      <ellipse cx="778" cy="498" rx="165" ry="110" />
      <ellipse cx="776" cy="495" rx="110" ry="72" />
      <ellipse cx="774" cy="492" rx="60" ry="38" />
      <path d="M 80,140 Q 200,110 340,130 Q 480,150 600,120" />
      <path d="M 550,700 Q 700,670 850,690 Q 1000,710 1150,680" />
    </g>
  </svg>
</div>
```

- [ ] **Step 2: Update BaseLayout.astro import**

In `src/layouts/BaseLayout.astro`, change line 4 from:
```
import DotPattern from "../components/DotPattern.astro";
```
to:
```
import TopoPattern from "../components/TopoPattern.astro";
```

And on line 59, change `<DotPattern />` to `<TopoPattern />`.

- [ ] **Step 3: Delete the old file**

Run: `rm src/components/DotPattern.astro`

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/TopoPattern.astro src/layouts/BaseLayout.astro
git rm src/components/DotPattern.astro
git commit -m "feat: replace dot grid with topographic SVG contour pattern"
```

---

### Task 4: Update BaseLayout — wider grid, theme support, gradient atmosphere

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add theme script and update html tag**

In `src/layouts/BaseLayout.astro`, change the `<html>` tag (line 25) from:
```html
<html lang="en" class="scroll-smooth">
```
to:
```html
<html lang="en" class="scroll-smooth" data-theme="dark">
```

Add this inline script inside `<head>` before `<ViewTransitions />` to prevent flash on load:

```html
<script is:inline>
  (function() {
    var theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

- [ ] **Step 2: Update body and grid classes**

Change the body tag (line 58) from:
```html
<body class="bg-base text-secondary font-serif leading-relaxed pb-16 md:pb-0">
```
to:
```html
<body class="bg-base text-secondary font-serif text-lg leading-relaxed pb-16 md:pb-0 transition-colors duration-300">
```

Change the grid div (line 60) from:
```html
<div class="relative z-10 mx-auto grid min-h-screen md:grid-cols-[280px_1fr]">
```
to:
```html
<div class="relative z-10 mx-auto grid min-h-screen md:grid-cols-[260px_1fr]">
```

Change the main tag (line 62) from:
```html
<main class="max-w-[820px] px-6 py-12 md:px-16 md:py-12">
```
to:
```html
<main class="max-w-[820px] px-6 py-12 md:px-16 md:py-12 [&>section]:relative [&>section]:z-[1]">
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add light/dark theme support and wider grid to BaseLayout"
```

---

### Task 5: Update Sidebar — glassy, theme toggle, DM Sans

**Files:**
- Modify: `src/components/Sidebar.astro`

- [ ] **Step 1: Rewrite Sidebar.astro**

Replace the entire content of `src/components/Sidebar.astro` with:

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
  { href: "/about", icon: "user-circle", label: "About" },
  { href: "/contact", icon: "envelope-simple", label: "Contact" },
];

function isActive(href: string, current: string): boolean {
  if (href === "/") return current === "/";
  return current.startsWith(href);
}
---

<div class="sticky top-0 h-screen p-4 pr-0 hidden md:block" transition:persist>
  <aside class="flex h-full flex-col rounded-xl border border-edge bg-surface/70 backdrop-blur-[16px] p-8 pb-6 transition-colors duration-300">
    <img
      src="/images/avatar.png"
      alt="Robin van Baalen"
      class="mb-3.5 h-14 w-14 rounded-full border-2 border-edge"
      width="56"
      height="56"
    />
    <p class="text-[15px] font-semibold text-primary">Robin van Baalen</p>
    <p class="mb-7 font-sans text-[13px] leading-snug text-muted">
      Software engineer &amp; consultant. Building tools, writing code, solving problems.
    </p>
    <nav class="relative flex flex-1 flex-col gap-0.5" aria-label="Main navigation" data-sidebar-nav>
      <span
        class="absolute left-0 h-1 w-1 rounded-full bg-accent-bright animate-[pulse-dot_2s_ease-in-out_infinite] transition-[top] duration-300 ease-out"
        data-nav-dot
        aria-hidden="true"
      />
      {navItems.map((item) => (
        <NavItem
          href={item.href}
          icon={item.icon}
          label={item.label}
          active={isActive(item.href, currentPath)}
        />
      ))}
    </nav>

    <script>
      function updateActiveNav() {
        const path = window.location.pathname;
        const items = document.querySelectorAll("[data-nav-item]");
        items.forEach((item) => {
          const href = item.getAttribute("href") || "";
          const isActive = href === "/" ? path === "/" : path.startsWith(href);
          if (isActive) {
            item.setAttribute("data-active", "true");
            item.classList.remove("text-muted", "hover:text-primary");
            item.classList.add("text-accent-bright", "active");
          } else {
            item.removeAttribute("data-active");
            item.classList.remove("text-accent-bright", "active");
            item.classList.add("text-muted", "hover:text-primary");
          }
        });
      }

      function positionNavDot() {
        updateActiveNav();
        const nav = document.querySelector("[data-sidebar-nav]");
        const dot = document.querySelector("[data-nav-dot]") as HTMLElement;
        const active = document.querySelector("[data-nav-item][data-active]") as HTMLElement;
        if (!nav || !dot || !active) {
          if (dot) dot.style.opacity = "0";
          return;
        }
        const navRect = nav.getBoundingClientRect();
        const activeRect = active.getBoundingClientRect();
        const top = activeRect.top - navRect.top + activeRect.height / 2 - 2;
        dot.style.top = `${top}px`;
        dot.style.opacity = "1";
      }
      positionNavDot();
      document.addEventListener("astro:after-swap", positionNavDot);
    </script>
    <div class="mt-auto border-t border-edge pt-4">
      <button
        class="mb-3 flex items-center gap-2 font-sans text-[13px] text-dim transition-colors duration-150 hover:text-secondary"
        data-theme-toggle
        aria-label="Toggle theme"
      >
        <i class="ph ph-sun-dim text-base" data-theme-icon aria-hidden="true" />
        <span data-theme-label>Light mode</span>
      </button>
      <script>
        function initThemeToggle() {
          const btn = document.querySelector("[data-theme-toggle]");
          const icon = document.querySelector("[data-theme-icon]");
          const label = document.querySelector("[data-theme-label]");
          if (!btn || !icon || !label) return;

          function updateUI() {
            const current = document.documentElement.getAttribute("data-theme") || "dark";
            icon.className = current === "dark" ? "ph ph-sun-dim text-base" : "ph ph-moon text-base";
            label.textContent = current === "dark" ? "Light mode" : "Dark mode";
          }
          updateUI();

          btn.addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme") || "dark";
            const next = current === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
            updateUI();
          });
        }
        initThemeToggle();
        document.addEventListener("astro:after-swap", initThemeToggle);
      </script>
      <div class="mb-2.5 flex gap-3.5">
        <a href="https://github.com/rvanbaalen" class="text-dim text-lg transition-colors duration-150 hover:text-accent-bright" aria-label="GitHub">
          <i class="ph ph-github-logo" />
        </a>
        <a href="https://www.linkedin.com/in/robinvanbaalen/" class="text-dim text-lg transition-colors duration-150 hover:text-accent-bright" aria-label="LinkedIn">
          <i class="ph ph-linkedin-logo" />
        </a>
      </div>
      <p class="font-sans text-[10px] text-dim">&copy; 2026 Robin van Baalen</p>
    </div>
  </aside>
</div>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Sidebar.astro
git commit -m "feat: glassy sidebar with theme toggle, DM Sans labels"
```

---

### Task 6: Update NavItem and MobileNav — DM Sans, transitions

**Files:**
- Modify: `src/components/NavItem.astro`
- Modify: `src/components/MobileNav.astro`

- [ ] **Step 1: Rewrite NavItem.astro**

Replace the entire content of `src/components/NavItem.astro` with:

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
    "nav-item relative flex items-center gap-2.5 py-2 pl-5 font-sans text-[13px] font-[450] transition-[color,background] duration-150",
    active ? "text-accent-bright active" : "text-muted hover:text-primary hover:bg-surface-hover rounded-sm",
  ]}
  data-nav-item
  data-active={active ? "true" : undefined}
>
  <i class={`ph ph-${icon} text-[17px] w-[18px] text-center`} aria-hidden="true" />
  <span>{label}</span>
</a>
```

- [ ] **Step 2: Rewrite MobileNav.astro**

Replace the entire content of `src/components/MobileNav.astro` with:

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
  { href: "/about", icon: "user-circle", label: "About" },
  { href: "/contact", icon: "envelope-simple", label: "Contact" },
];

function isActive(href: string, current: string): boolean {
  if (href === "/") return current === "/";
  return current.startsWith(href);
}
---

<nav
  class="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-edge bg-surface/95 px-2 py-2 backdrop-blur-sm transition-colors duration-300 md:hidden"
  aria-label="Mobile navigation"
>
  {navItems.map((item) => (
    <a
      href={item.href}
      class:list={[
        "flex flex-col items-center gap-1 px-3 py-1 font-sans text-[11px] transition-colors duration-150",
        isActive(item.href, currentPath) ? "text-accent-bright" : "text-muted",
      ]}
    >
      <i class={`ph ph-${item.icon} text-lg`} aria-hidden="true" />
      <span>{item.label}</span>
    </a>
  ))}
</nav>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/NavItem.astro src/components/MobileNav.astro
git commit -m "feat: DM Sans nav labels, remove monospace from navigation"
```

---

### Task 7: Update ArticleCard — DM Sans metadata, bigger fonts, transitions

**Files:**
- Modify: `src/components/ArticleCard.astro`

- [ ] **Step 1: Rewrite ArticleCard.astro**

Replace the entire content of `src/components/ArticleCard.astro` with:

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
  class="group block rounded-lg border border-edge-subtle bg-surface p-6 transition-[border-color,box-shadow,transform] duration-200 hover:border-accent-dim hover:shadow-[0_4px_20px_var(--color-accent-glow)] hover:-translate-y-0.5"
>
  <div class="mb-2.5 flex items-center gap-1.5 font-sans text-[13px] text-dim transition-colors duration-150 group-hover:text-muted">
    <i class="ph ph-calendar-blank text-sm" aria-hidden="true" />
    <span>{formattedDate}</span>
    {readingTime && (
      <>
        <span>&middot;</span>
        <span>{readingTime}</span>
      </>
    )}
  </div>
  <h3 class="mb-2 text-lg font-medium leading-snug tracking-tight text-primary">
    {title}
  </h3>
  <p class="text-base leading-relaxed text-muted">{description}</p>
  {tags.length > 0 && (
    <span class="mt-2.5 inline-block rounded bg-accent-subtle px-2.5 py-0.5 font-sans text-[12px] font-medium text-accent-bright transition-colors duration-150 group-hover:bg-accent-glow">
      {tags[0]}
    </span>
  )}
</a>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/ArticleCard.astro
git commit -m "feat: DM Sans metadata, bigger type, hover transitions on article cards"
```

---

### Task 8: Update Availability, ContactForm, ProjectRow — DM Sans, transitions

**Files:**
- Modify: `src/components/Availability.astro`
- Modify: `src/components/ContactForm.astro`
- Modify: `src/components/ProjectRow.astro`

- [ ] **Step 1: Rewrite Availability.astro**

Replace the entire content of `src/components/Availability.astro` with:

```astro
<div class="inline-flex items-center gap-2.5 rounded-full border border-edge bg-surface px-4 py-2 font-sans text-[13px] font-[450] text-muted transition-colors duration-300">
  <span
    class="h-2 w-2 rounded-full bg-green animate-[pulse-glow_2.5s_ease-in-out_infinite]"
    aria-hidden="true"
  />
  Available for consulting
</div>
```

- [ ] **Step 2: Rewrite ContactForm.astro**

Replace the entire content of `src/components/ContactForm.astro` with:

```astro
---
// Static form component. Posts to /api/contact (Cloudflare Function).
// Turnstile widget loads from Cloudflare CDN.
---

<form
  action="/api/contact"
  method="POST"
  class="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
>
  <label class="flex items-center gap-2 rounded-md border border-edge-subtle bg-base px-3.5 py-3 font-sans text-base text-muted transition-[border-color,box-shadow,color] duration-200 focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--color-accent-glow)] focus-within:text-secondary">
    <i class="ph ph-user text-sm text-dim transition-colors duration-200" aria-hidden="true" />
    <input
      type="text"
      name="name"
      placeholder="Name"
      required
      class="w-full bg-transparent text-secondary placeholder:text-dim outline-none"
    />
  </label>
  <label class="flex items-center gap-2 rounded-md border border-edge-subtle bg-base px-3.5 py-3 font-sans text-base text-muted transition-[border-color,box-shadow,color] duration-200 focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--color-accent-glow)] focus-within:text-secondary">
    <i class="ph ph-at text-sm text-dim transition-colors duration-200" aria-hidden="true" />
    <input
      type="email"
      name="email"
      placeholder="Email"
      required
      class="w-full bg-transparent text-secondary placeholder:text-dim outline-none"
    />
  </label>
  <label class="flex items-center gap-2 rounded-md border border-edge-subtle bg-base px-3.5 py-3 font-sans text-base text-muted transition-[border-color,box-shadow,color] duration-200 focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--color-accent-glow)] focus-within:text-secondary sm:col-span-2">
    <i class="ph ph-text-aa text-sm text-dim transition-colors duration-200" aria-hidden="true" />
    <input
      type="text"
      name="subject"
      placeholder="Subject"
      required
      class="w-full bg-transparent text-secondary placeholder:text-dim outline-none"
    />
  </label>
  <label class="flex gap-2 rounded-md border border-edge-subtle bg-base px-3.5 pt-3 pb-3 font-sans text-base text-muted transition-[border-color,box-shadow,color] duration-200 focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--color-accent-glow)] focus-within:text-secondary sm:col-span-2">
    <i class="ph ph-pencil-simple mt-0.5 text-sm text-dim transition-colors duration-200" aria-hidden="true" />
    <textarea
      name="message"
      placeholder="Your message..."
      required
      rows="5"
      class="w-full resize-y bg-transparent text-secondary placeholder:text-dim outline-none"
    />
  </label>

  <div class="cf-turnstile sm:col-span-2" data-sitekey="0x4AAAAAACxDAFMK251wjSdQ"></div>
  <script is:inline src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

  <button
    type="submit"
    class="flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-sans text-base font-medium text-base transition-[background,transform,box-shadow] duration-150 hover:bg-accent-bright hover:-translate-y-px hover:shadow-[0_4px_12px_var(--color-accent-glow)] active:translate-y-0 sm:col-span-2"
  >
    <i class="ph ph-paper-plane-tilt" aria-hidden="true" />
    Send message
  </button>
</form>
```

- [ ] **Step 3: Rewrite ProjectRow.astro**

Replace the entire content of `src/components/ProjectRow.astro` with:

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
  class="group flex items-center justify-between rounded-md px-4 py-4 transition-[background,transform] duration-150 hover:bg-surface-hover"
>
  <div>
    <span class="text-lg font-medium text-primary transition-colors duration-150 group-hover:text-accent-bright">
      {name}
    </span>
    <p class="mt-0.5 font-sans text-base text-muted transition-colors duration-150 group-hover:text-secondary">
      {description}
    </p>
  </div>
  <div class="flex items-center gap-4 shrink-0">
    <span class="font-sans text-[13px] text-dim">
      {tech.join(" · ")}
    </span>
    <i class="ph ph-arrow-right text-dim opacity-0 -translate-x-1 transition-[opacity,transform] duration-150 group-hover:opacity-100 group-hover:translate-x-0" aria-hidden="true" />
  </div>
</a>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/Availability.astro src/components/ContactForm.astro src/components/ProjectRow.astro
git commit -m "feat: DM Sans + transitions on availability badge, contact form, project rows"
```

---

### Task 9: Update index.astro — kinetic hero, bigger fonts, DM Sans labels, gradient atmosphere

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Rewrite index.astro**

Replace the entire content of `src/pages/index.astro` with:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import Availability from "../components/Availability.astro";
import ArticleCard from "../components/ArticleCard.astro";
import ProjectRow from "../components/ProjectRow.astro";
import ContactForm from "../components/ContactForm.astro";
import FadeIn from "../components/FadeIn.astro";

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
  <!-- Intro with subtle gradient atmosphere -->
  <section class="relative mb-16">
    <div class="pointer-events-none absolute -inset-x-40 -inset-y-20 z-[-1]" style={`background: radial-gradient(ellipse at 8% 15%, oklch(62% 0.04 260 / var(--gradient-intensity)), transparent 50%);`} aria-hidden="true" />
    <p class="mb-5 flex items-center gap-2 font-sans text-[14px] font-medium text-accent">
      <i class="ph ph-hand-waving" aria-hidden="true" />
      Welcome
    </p>
    <h1 class="mb-5 text-[60px] font-normal leading-[1.1] tracking-tight text-primary" data-kinetic-hero>
      I'm Robin. I build software and help teams ship better products.
    </h1>
    <p class="max-w-xl text-lg leading-relaxed">
      Almost two decades of shipping software across roles from lead developer to
      software architect to senior consultant. I write about what I learn and
      open-source what I build.
    </p>
    <div class="mt-6">
      <Availability />
    </div>
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

  <!-- Recent Articles -->
  <section class="py-12">
    <div class="mb-6 flex items-center justify-between font-sans text-[14px] font-medium text-dim">
      <span class="flex items-center gap-1.5">
        <i class="ph ph-article text-[15px]" aria-hidden="true" />
        Recent writing
      </span>
      <a href="/articles" class="flex items-center gap-1 text-accent transition-[color,gap] duration-150 hover:text-accent-bright hover:gap-2">
        View all <i class="ph ph-arrow-right text-[13px]" aria-hidden="true" />
      </a>
    </div>
    {recentArticles.length > 0 ? (
      <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
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
      </div>
    ) : (
      <p class="text-muted">Articles coming soon.</p>
    )}
  </section>

  <div class="h-px bg-gradient-to-r from-edge to-transparent" />

  <!-- Selected Projects -->
  <section class="py-12">
    <div class="mb-6 flex items-center justify-between font-sans text-[14px] font-medium text-dim">
      <span class="flex items-center gap-1.5">
        <i class="ph ph-code text-[15px]" aria-hidden="true" />
        Open source
      </span>
      <a href="/projects" class="flex items-center gap-1 text-accent transition-[color,gap] duration-150 hover:text-accent-bright hover:gap-2">
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
          />
        </FadeIn>
      ))}
    </div>
  </section>

  <!-- Contact -->
  <section class="relative mt-14 rounded-xl border border-edge bg-surface p-10 transition-colors duration-300">
    <div class="pointer-events-none absolute -inset-x-20 -inset-y-10 z-[-1]" style={`background: radial-gradient(ellipse at 50% 40%, oklch(62% 0.04 260 / calc(var(--gradient-intensity) * 0.5)), transparent 40%);`} aria-hidden="true" />
    <h2 class="mb-2 flex items-center gap-2.5 text-[28px] font-normal text-primary">
      <i class="ph ph-chat-circle text-accent transition-colors duration-150" aria-hidden="true" />
      Let's talk
    </h2>
    <p class="mb-6 font-sans text-base text-muted">
      Available for consulting, architecture reviews, and technical leadership. Tell me about your project.
    </p>
    <ContactForm />
  </section>
</BaseLayout>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: kinetic hero, DM Sans labels, gradient atmosphere, bigger type on homepage"
```

---

### Task 10: Update remaining pages — DM Sans, bigger fonts

**Files:**
- Modify: `src/pages/about.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/404.astro`
- Modify: `src/pages/articles/index.astro`
- Modify: `src/pages/projects/index.astro`
- Modify: `src/layouts/ArticleLayout.astro`

- [ ] **Step 1: Update about.astro**

Replace the entire content of `src/pages/about.astro` with:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="About — Robin van Baalen" description="About Robin van Baalen — software engineer, consultant, and builder with almost two decades of experience.">
  <h1 class="mb-6 text-3xl font-normal tracking-tight text-primary">About</h1>
  <div class="max-w-xl space-y-5 text-lg leading-relaxed">
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
      class="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-sans text-base font-medium text-base transition-[background,transform,box-shadow] duration-150 hover:bg-accent-bright hover:-translate-y-px hover:shadow-[0_4px_12px_var(--color-accent-glow)] active:translate-y-0"
    >
      <i class="ph ph-envelope" aria-hidden="true" />
      Get in touch
    </a>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Update 404.astro**

Replace the entire content of `src/pages/404.astro` with:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="Not Found — Robin van Baalen">
  <div class="flex flex-col items-start py-20">
    <p class="mb-4 font-sans text-base text-accent">404</p>
    <h1 class="mb-4 text-3xl font-normal tracking-tight text-primary">Page not found</h1>
    <p class="mb-8 text-lg text-muted">The page you're looking for doesn't exist or has been moved.</p>
    <a
      href="/"
      class="inline-flex items-center gap-2 font-sans text-[14px] text-accent transition-colors duration-150 hover:text-accent-bright"
    >
      <i class="ph ph-arrow-left text-[13px]" aria-hidden="true" />
      Back to home
    </a>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Update articles/index.astro**

In `src/pages/articles/index.astro`, update the heading and description text sizes. Replace lines 14-15:

```html
    <h1 class="mb-2 text-3xl font-normal tracking-tight text-primary">Articles</h1>
    <p class="mb-10 text-muted">Thoughts on software, engineering, and building things that work.</p>
```
with:
```html
    <h1 class="mb-2 text-3xl font-normal tracking-tight text-primary">Articles</h1>
    <p class="mb-10 text-lg text-muted">Thoughts on software, engineering, and building things that work.</p>
```

- [ ] **Step 4: Update projects/index.astro**

In `src/pages/projects/index.astro`, change the category header (line 28) from:
```html
        <h2 class="mb-1 border-b border-edge-subtle pb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-dim">{label}</h2>
```
to:
```html
        <h2 class="mb-1 border-b border-edge-subtle pb-3 font-sans text-[14px] font-medium text-dim">{label}</h2>
```

Also update the page description (line 19) from `text-muted` to `text-lg text-muted`.

- [ ] **Step 5: Update ArticleLayout.astro**

In `src/layouts/ArticleLayout.astro`, change the back link (lines 23-28) from `font-mono text-xs` to `font-sans text-[14px]`:

```html
      <a
        href="/articles"
        class="mb-6 inline-flex items-center gap-1.5 font-sans text-[14px] text-muted transition-colors duration-150 hover:text-accent"
      >
        <i class="ph ph-arrow-left text-[13px]" aria-hidden="true" />
        All articles
      </a>
```

Change the date/tags div (lines 33-43) from `font-mono text-[11px]` to `font-sans text-[13px]`:

```html
      <div class="flex flex-wrap items-center gap-3 font-sans text-[13px] text-dim">
        <span class="flex items-center gap-1">
          <i class="ph ph-calendar-blank text-sm" aria-hidden="true" />
          {formattedDate}
        </span>
        {tags.map((tag) => (
          <span class="rounded bg-accent-subtle px-2.5 py-0.5 font-medium text-accent-bright">
            {tag}
          </span>
        ))}
      </div>
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/pages/about.astro src/pages/404.astro src/pages/articles/index.astro src/pages/projects/index.astro src/layouts/ArticleLayout.astro
git commit -m "feat: DM Sans labels, bigger type across all pages and article layout"
```

---

### Task 11: Final build verification and visual check

**Files:** None (verification only)

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: Build succeeds with zero errors.

- [ ] **Step 2: Start dev server and visually verify**

Run: `npm run dev`

Check in browser:
- Dark mode: cool slate accent visible on nav, links, buttons, tags
- Light mode toggle works (click in sidebar)
- Topo pattern visible in top-left corner at low opacity
- Hero text animates word-by-word on first load
- Font sizes are comfortable (body 20px, hero 60px)
- All section labels use DM Sans (no monospace outside code blocks)
- Cards lift on hover with glow
- Project rows show arrow slide-in on hover
- Contact form inputs glow on focus
- Gradient atmosphere visible behind hero and contact sections
- Sidebar is glassy (semi-transparent with blur)
- Mobile nav works below 768px

- [ ] **Step 3: Commit contact.astro if unchanged**

`src/pages/contact.astro` needs no changes — it uses `ContactForm` component which was already updated. Verify it renders correctly.
