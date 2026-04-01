# Component Rulebook

This guide turns the `@beautifulMention` callout into a repeatable checklist whenever a new builder component is born. Every component section should live inside a `@beautifulMention` wrapper in the docs, and the implementation should honor the layout, text/link/image, theme, variant, and **premium design system** rules listed below.

---

## @beautifulMention Design System Setup

All styling is done with **Tailwind CSS utility classes** directly on elements — no CSS custom properties, no inline style objects for layout or color (theme tokens are the only exception, fed via `style` props from `useThemeQuery()`). This keeps the codebase scannable and consistent.

Always call `useThemeQuery()` near the top of the component and use `theme.colors.primary`, `theme.colors.primaryForeground`, `theme.colors.secondary`, `theme.fonts.heading`, and `theme.fonts.body` only where the builder must control the value. Everything else comes from the Tailwind classes below.

### Tailwind Token Reference

Use these classes as your palette. Pick from these stops only — don't reach for arbitrary values.

**Backgrounds**
| Role | Tailwind Class |
|------|----------------|
| Page background | `bg-white` |
| Card / surface | `bg-gray-50` |
| Subtle tint (hover, active) | `bg-gray-100` |
| Dark section (if variant requires) | `bg-gray-900` |

**Text**
| Role | Tailwind Class |
|------|----------------|
| Primary (headings, key content) | `text-gray-950` or `text-gray-900` |
| Secondary (supporting copy) | `text-gray-600` |
| Muted (placeholders, meta) | `text-gray-400` |
| On dark background | `text-white` / `text-gray-100` |

**Borders**
| Role | Tailwind Class |
|------|----------------|
| Default border | `border border-gray-200` |
| Subtle divider | `divide-y divide-gray-100` |
| Focus ring | `ring-2 ring-offset-2` + accent via `style` |

**Spacing (padding / gap / margin)**
| Scale | Tailwind Class |
|-------|----------------|
| xs | `p-1` / `gap-1` |
| sm | `p-2` / `gap-2` |
| md | `p-4` / `gap-4` |
| lg | `p-6` / `gap-6` |
| xl | `p-10` / `gap-10` |
| 2xl | `p-16` / `gap-16` |
| 3xl | `p-24` / `gap-24` |

**Border Radius**
| Role | Tailwind Class |
|------|----------------|
| Small (inputs, tags) | `rounded` (4px) |
| Medium (cards, buttons) | `rounded-lg` (8px) |
| Large (modals, panels) | `rounded-xl` (12px) |
| Full (avatars, pills) | `rounded-full` |

**Typography**
| Role | Tailwind Class |
|------|----------------|
| Hero heading | `text-4xl md:text-6xl font-bold leading-tight` |
| Section heading | `text-3xl md:text-5xl font-bold` |
| Subheading | `text-xl md:text-2xl font-semibold` |
| Body | `text-base leading-relaxed` (min `text-sm` = 14px) |
| Label / UI text | `text-sm font-medium` |
| Muted / meta | `text-sm text-gray-400` |

**Shadows**
| Role | Tailwind Class |
|------|----------------|
| Subtle card | `shadow-sm` |
| Raised card | `shadow` |
| Floating / dropdown | `shadow-md` |
| ❌ Never use | `shadow-xl`, `shadow-2xl` |

**Transitions**
| Role | Tailwind Class |
|------|----------------|
| Default hover | `transition-all duration-200` |
| Color only | `transition-colors duration-150` |
| ❌ Never use | `duration-500+` for simple hover states |

---

## @beautifulMention Layout Shell

- **Standard Layout Shell**: Always use a two-layer structure. The outer element (e.g., `section`) is full-width for backgrounds; the inner child is a content wrapper: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.
- Layer in the semantic `aria` role that matches the component. Keep the outer wrapper responsible for spacing, background, and full-width effects.
- Section vertical gaps: `80px–120px` between major sections (`py-20 md:py-32`).
- Max content width: `max-w-7xl` (typically 1280px), always centered.
- Inject `@beautifulMention` comments/descriptions in the doc version so the team can verify which guideline bullet each implementation follows.

---

## @beautifulMention Visual Hierarchy & Aesthetic Principles

These rules apply to every component, without exception.

### Whitespace & Layout

- **Be generous with whitespace.** Sections must breathe. More padding than you think is needed.
- Use a **boxy, grid-aligned layout**. Cards and panels should feel solid and structured.
- Minimum padding inside containers: `24px`; typical for sections: `32–48px`.
- Use **consistent horizontal rhythm** — align everything to the grid. No arbitrary positioning.

### Typography

- **Never use `text-transform: uppercase`** on any element — headings, labels, buttons, nav items.
- **Never use `letter-spacing > 0.02em`** (wide tracking). Keep tracking natural.
- Font weights: `400` (body), `500` (UI labels), `600` (emphasis), `700` (headings). Avoid `800+` except for single hero numbers.
- Line heights: `1.2–1.3` for headings, `1.6–1.7` for body text.
- Responsive headings: `text-3xl md:text-5xl font-bold` — readable on small screens.
- Body text minimum: `15px`. Never go below `14px`.
- Keep font sizes purposeful — no more than 5–6 distinct sizes per component.

### Color

- **Restrained color** — the accent color appears in: primary CTA buttons, active states, links, key highlights only.
- Everything else is neutral: white, off-white, light grey, dark grey, near-black.
- No rainbow UI. Don't assign different colors to every card or section decoratively.
- Backgrounds: white or very light grey by default. Avoid heavy-colored sections unless explicitly required by variant.
- If using a tinted section, use `--accent-subtle` (10–15% opacity) — never a saturated wash.
- Base background on white and text on near-black unless a variant explicitly overrides. Accent color lives in `EditableLink` buttons via `theme.colors.primary` and `theme.colors.primaryForeground`.

### Shadows

- Use `var(--shadow-sm)` or `var(--shadow-md)` only. Deep or heavy shadows feel dated.
- Choose between border-based and shadow-based separation consistently — don't mix arbitrarily.

### Hover & Motion

- Hover states must be **subtle and professional**. No aggressive scaling or intense color changes.
- Standard transition: `transition-all duration-200` (150–200ms).
- Avoid `group` + `group-hover` for complex synchronized animations across multiple children (scaling image + moving icon + expanding text simultaneously = too busy).
- Prefer single-element hover effects or very subtle independent transitions.
- Avoid bouncy or springy animations unless the product is playful by design.

---

## @beautifulMention Text Strategy

- Use `EditableText` when text is expected to change; fall back to plain markup for permanent text.
- **Never wrap `EditableText` in a semantic tag for styling.** Pass styling directly to `className` and use the `as` prop for semantics.
  - **Bad**: `<h2 className="text-2xl"><EditableText ... /></h2>`
  - **Good**: `<EditableText as="h2" className="text-2xl" ... />`
- Supported `as` values: `"p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span"`.
- Keep typography tight: headline classes bold, subheadings sized proportionally, everything within `max-w-7xl`.
- Inject theme tokens via `style` or `className`: colors from `theme.colors.secondary`, fonts from `theme.fonts.heading`.
- All text elements must have sufficient contrast — primary data labels should be high-contrast (near-black on white), never muted grey.
- Document each text slot under `@beautifulMention` so designers know what is editable vs. fixed.

---

## @beautifulMention Link Strategy

- Prefer `EditableLink` for all buttons and CTAs.
- Always set `href`, `aria-label` when link text is ambiguous, and `rel="noreferrer"` for external destinations.
- Check `link.target`: default to `_self`; only use `_blank` when the UX explicitly requires it — cite the decision in the `@beautifulMention` note.
- Link containers stay within the `max-w-7xl` grid and share the same vertical rhythm as surrounding text.
- When links act as buttons: use `theme.colors.primary` for background/border and `theme.colors.primaryForeground` for the label.
- Button sizing: `padding: 10px 20px`, `font-weight: 500`, `border-radius: var(--radius-md)`. Never uppercase.
- For `EditableLink` with inline icons (e.g., `<ArrowRight />`), embed the icon inside the link body as children:
  ```tsx
  <EditableLink text={data.buttonText} ...>
    {data.buttonText}
    <ArrowRight className="ml-2 w-4 h-4" />
  </EditableLink>
  ```

---

## @beautifulMention Image Strategy

- Wrap all imagery inside `EditableImage`. Supply sensible `alt` text. Pass `priority` only for above-the-fold hero images.
- Restrict width via `max-w-[650px]` or similar when the image sits beside text inside `max-w-7xl`.
- Use `w-full` on mobile for proper responsive scaling.
- Mention fallback behavior in the `@beautifulMention` doc so assets can be swapped without a code change.

---

## @beautifulMention Theme Strategy

- Always call `useThemeQuery()` near the top of the component. Fall back to the default theme object.
- Map theme tokens into CSS variables or `style` props — never hardcode color or font values inside JSX.
- Colors flow into `style` props; fonts flow through `className`.
- Keep all theming within the `max-w-7xl` wrapper. Document key tokens under `@beautifulMention: Theme`.

---

## @beautifulMention Component Patterns

### Cards

- Background: `bg-gray-50` or `bg-white`.
- Border: `border border-gray-200` or `shadow-sm` — pick one approach and stay consistent within the section.
- Padding: `p-6` (24px) minimum, `p-8` (32px) for spacious layouts.
- Radius: `rounded-lg` or `rounded-xl` — consistent within a section.

### Buttons

- **Primary**: solid accent background via `style={{ background: theme.colors.primary, color: theme.colors.primaryForeground }}`, `rounded-lg px-5 py-2.5 font-medium text-sm`.
- **Secondary**: `bg-white border border-gray-200 text-gray-700 rounded-lg px-5 py-2.5 font-medium text-sm`.
- **Ghost**: `bg-transparent text-gray-600 hover:text-gray-900 px-5 py-2.5 font-medium text-sm`.
- All hover states: `transition-colors duration-150`. Focus: `focus-visible:ring-2 focus-visible:ring-offset-2`.

### Forms & Inputs

- Border: `border border-gray-200 rounded-lg`.
- Focus: `focus:ring-2 focus:ring-offset-1` with accent ring via `style` — never just a fill.
- Labels: above the input, `text-sm font-medium text-gray-700`, NOT uppercase.

### Timelines & Activity Feeds

- Use **dot + vertical line** treatment — no filled background boxes on rows.
- Plain text carries the narrative; decoration should not compete.

### Tables & Data

- Clean rows with `1px solid var(--border)` dividers.
- Column headers: `font-weight: 600`, normal case (never uppercase).
- Row hover: very subtle background shift (`var(--surface)`).

### Icons

- Use line icons consistently (Lucide, Phosphor, or Heroicons).
- Sizes: `16px` inline, `20px` UI, `24px` feature icons.
- Never use emoji as UI icons.

---

## @beautifulMention Mobile Responsiveness Strategy

- **Mobile-First**: Prefix-free classes for mobile; `md:` / `lg:` for larger screens.
- **Stacking**: Multi-column desktop layouts stack vertically on mobile — use `flex-col md:flex-row` or `grid-cols-1 md:grid-cols-2`.
- **Spacing**: `py-12 md:py-24`, always `px-4` minimum on mobile.
- **Typography**: `text-3xl md:text-5xl` — scale headings responsively.
- **Images**: Use `w-full` on mobile with proper aspect ratios.
- **Touch targets**: `EditableLink` buttons must meet minimum touch target sizes for mobile.

---

## @beautifulMention Design Quality Checklist

Before shipping, verify every item:

- [ ] No `text-transform: uppercase` anywhere
- [ ] No `letter-spacing > 0.02em` (no wide tracking)
- [ ] Whitespace is generous — sections breathe
- [ ] Color is restrained — accent used purposefully, not decoratively
- [ ] All body text ≥ 15px with sufficient contrast
- [ ] Primary data labels are high-contrast — not muted grey
- [ ] Border radius consistent — `rounded-lg` / `rounded-xl` used uniformly within a section
- [ ] Shadows are subtle (`shadow-sm` or `shadow`) — never `shadow-xl` or `shadow-2xl`
- [ ] Hover transitions are subtle — `duration-200`, no aggressive scaling
- [ ] No complex `group-hover` animations across multiple children simultaneously
- [ ] Typography scale purposeful — max 5–6 distinct sizes
- [ ] Mobile considered — layout stacks, type scales, touch targets accessible
- [ ] `EditableText` never wrapped in a semantic tag — uses `as` prop instead
- [ ] `EditableLink` buttons use `theme.colors.primary` / `primaryForeground`
- [ ] `EditableImage` has sensible `alt` text
- [ ] `useThemeQuery()` called at top; no hardcoded color/font values in JSX
- [ ] All colors/fonts from `useThemeQuery()` only where builder control is needed — rest is Tailwind
- [ ] Interactive states exist for all buttons, links, and rows (hover, focus, active)
- [ ] Content stays within `max-w-7xl` wrapper
- [ ] Component registered in `add-section-dialog` and dispatcher

---

## @beautifulMention Anti-Patterns — Never Do These

- ❌ `text-transform: uppercase` on any element
- ❌ `letter-spacing: 0.1em` or wider tracking
- ❌ Using 6+ different colors decoratively in one component
- ❌ Colored cards for decoration (blue card, green card, yellow card in a row)
- ❌ Tiny body text (`< 14px`)
- ❌ Cramped padding (`< 16px` in cards)
- ❌ Heavy drop shadows on everything (`shadow-xl`, `shadow-2xl` as defaults)
- ❌ Gradient-heavy sections with clashing colors
- ❌ Inconsistent corner rounding — mixing `rounded-none` and `rounded-3xl` arbitrarily
- ❌ Borders that are too dark or visually heavy
- ❌ Bright colored backgrounds stacked against each other
- ❌ More than one competing hero CTA button
- ❌ Emoji used as navigation icons or feature bullets
- ❌ Complex `group-hover` chains (scale image + move icon + expand text simultaneously)
- ❌ Muted grey for primary data labels — use high-contrast text
- ❌ `<h2><EditableText /></h2>` — wrap via `as` prop, never with a parent semantic tag
- ❌ Hardcoded hex colors or font names in `className` — use Tailwind neutrals or `style` with theme tokens

---

## @beautifulMention Variant + Prefers

- Define a `template` literal type (e.g., `hero-17`) and add it to the union in the shared `types` file along with the default data, type guard, and map entry.
- The new style must appear in the `add-section-dialog` templates list.
- Capture the registration process and preferred placement (hero, feature, testimonial) in the `@beautifulMention` variant note.

---

## @beautifulMention Prefer Section Notes

- Before coding, inspect similar sections in the repo and write a short "Prefer" paragraph under `@beautifulMention` listing the closest existing components and their distinguishing features.
- Use that note to decide whether to reuse, extend, or replace logic; if reuse wins, confirm that all text/link/image/theme/design rules still apply.

---

## Implementation Flow

1. **Plan**: Analyze the component area. Write the `@beautifulMention` checklist in this document before touching code. Confirm design tokens and reference aesthetic (Stripe-like precision, Apple-like whitespace, Linear-like density).
2. **Design System**: Define or reference the CSS variable tokens (`--accent`, `--surface`, `--border`, `--radius-*`, `--shadow-*`) before writing any component styles.
3. **Draft**: Write the data type + default record, add the `max-w-7xl` skeleton, and document the text/link/image/theme approach inside `@beautifulMention`.
4. **Build**: Wire component logic. All colors and fonts flow from theme tokens — nothing hardcoded.
5. **Register**: Wire into the renderer and `add-section-dialog`; call out the registration steps in the final `@beautifulMention` block.
6. **Verify Responsiveness**: Test across mobile, tablet, and desktop. Check layout, typography, and touch targets at each breakpoint.
7. **Quality Gate**: Run through the Design Quality Checklist above. All items must pass before the component lands.

---

## Reference Aesthetic Targets

| Brand      | What to borrow                                                                           |
| ---------- | ---------------------------------------------------------------------------------------- |
| **Stripe** | Crisp grid, generous padding, elegant card shadows, precise typography, restrained color |
| **Apple**  | Extreme whitespace, large type, photography-first, minimal UI chrome                     |
| **Linear** | Tight information density without clutter, excellent nav, dark mode mastery              |
| **Vercel** | Boxy cards, sharp radius, data-dense but clean, monospace accents                        |
| **Notion** | Simple hierarchy, loads of breathing room, neutral palette                               |

---

## Font Recommendations

| Tone             | Heading                           | Body                    |
| ---------------- | --------------------------------- | ----------------------- |
| Clean / Modern   | Geist, DM Sans, Plus Jakarta Sans | Same or Inter           |
| Editorial        | Fraunces, Playfair Display        | DM Sans, Lato           |
| Technical        | IBM Plex Sans, Geist Mono         | IBM Plex Sans           |
| Friendly / SaaS  | Nunito, Figtree                   | Figtree, DM Sans        |
| Premium / Luxury | Cormorant, Editorial New          | Helvetica Neue, DM Sans |

Never default to `system-ui` or `Arial`. Always load from Google Fonts or Fontsource and map into `--font-heading` / `--font-body` tokens.

---

## @beautifulMention: Others Style 12 (Exclusive Tours) — Reference Example

- **Template Registration**: Added `OthersTemplate12Data` and default map in `types/owner-site/components/others.ts`.
- **Text Approach**: `EditableText` with semantic `as` props (`h2`, `h3`, `p`, `span`). Theme heading font injected via `--font-heading`.
- **Link Strategy**: `EditableLink` with `theme.primary` background and `theme.primaryForeground` label. `rel="noreferrer"` on external links.
- **Image Strategy**: Framer Motion animated cards use `EditableImage` for `mainImage` and `subImage` — swappable natively in the builder.
- **Theme Approach**: `useThemeQuery()` destructured into CSS variable assignments. No hardcoded colors in JSX.
- **Design Notes**: Cards use `var(--shadow-sm)`, `var(--radius-md)`. Hover is a single subtle `opacity` + `translateY` — no complex `group-hover` chains. Body text 15px+, headings responsive.
- **Variant Note**: Registered as `others-12` in `add-section-dialog.tsx` and the component dispatcher.

---

## Next Steps

Share this rulebook inside the `@beautifulMention` wrapper for each new component so reviewers and builders can quickly verify layout, typography, links, images, theme usage, design system tokens, and variant registration before the code lands.
