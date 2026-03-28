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
