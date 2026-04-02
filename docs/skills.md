---
name: pro-frontend-design-skill
description: 'Design and build premium, production-grade frontend interfaces in the style of Stripe, Apple, Linear, or Vercel — clean, user-focused, generous whitespace, restrained color use. Use this skill whenever the user asks to build a website, SaaS UI, landing page, dashboard, component, or any web interface where design quality matters. ALWAYS use this skill even if the user just says "build me a landing page", "make a dashboard", "create a SaaS UI", or any similar request. Before designing, ask the user a short set of clarifying questions defined in this skill.'
---

# Pro Frontend Design Skill

Build premium web interfaces that feel like Stripe, Apple, Linear, or Vercel — clean, intentional, user-focused, and production-grade.

---

## Step 1: Ask Clarifying Questions First

**Before writing any code**, ask the user these questions. Keep it friendly and conversational — you can group them in one message. Do not skip this step.

```
1. **Brand / Accent Color** — What's your primary brand color? (hex, name, or vibe like "deep blue" or "forest green") If unsure, I'll suggest one.

2. **Neutral Tone** — Should the UI lean warm (creamy whites, warm greys), cool (pure white, cool greys), or pure neutral?

3. **Corner Roundness** — Pick a feel:
   - Sharp (0–2px) — very boxy, almost no rounding
   - Subtle (4–6px) — slightly softened corners (Stripe-style)
   - Moderate (8–12px) — rounded but structured (Linear-style)
   - Soft (16px+) — friendly and rounded

4. **Borders** — Should borders be used to define sections/cards, or should separation come from spacing and shadow instead? Or a mix?

5. **Dark or Light mode** — Or both?

6. **Any reference sites or vibes** — Stripe, Apple, Notion, Vercel, Linear, etc.?

7. **Typography feel** — Clean sans-serif (default), editorial/serif accents, or mono/technical?
```

Wait for the user's answers before proceeding.

---

## Step 2: Design System Setup — shadcn/ui Color Token System

Based on answers, establish a design system using a **shadcn-style semantic color token system**. Colors are defined as HSL values in CSS variables, then surfaced as **Tailwind-style utility classes** (`bg-primary`, `text-primary`, `text-muted-foreground`, etc.) so they read naturally in HTML and JSX.

---

### The Token Model

Every semantic token follows a **background + foreground pair** pattern:

| CSS Variable               | Tailwind Class                          | Role                                            |
| -------------------------- | --------------------------------------- | ----------------------------------------------- |
| `--background`             | `bg-background`                         | Page background                                 |
| `--foreground`             | `text-foreground`                       | Default body text                               |
| `--card`                   | `bg-card`                               | Card / panel background                         |
| `--card-foreground`        | `text-card-foreground`                  | Text inside cards                               |
| `--primary`                | `bg-primary`                            | Brand color — buttons, active states, key links |
| `--primary-foreground`     | `text-primary-foreground`               | Text/icons ON a primary background              |
| `--secondary`              | `bg-secondary`                          | Secondary buttons, chips, tags                  |
| `--secondary-foreground`   | `text-secondary-foreground`             | Text on secondary bg                            |
| `--muted`                  | `bg-muted`                              | Subtle fills, disabled surfaces                 |
| `--muted-foreground`       | `text-muted-foreground`                 | Helper text, timestamps, placeholders           |
| `--accent`                 | `bg-accent`                             | Hover tints, highlight fills                    |
| `--accent-foreground`      | `text-accent-foreground`                | Text on accent bg                               |
| `--destructive`            | `bg-destructive`                        | Error, delete, danger                           |
| `--destructive-foreground` | `text-destructive-foreground`           | Text on destructive bg                          |
| `--border`                 | `border-border`                         | All borders — cards, inputs, dividers           |
| `--input`                  | `border-input`                          | Input field borders specifically                |
| `--ring`                   | `ring-ring`                             | Focus ring — always matches primary             |
| `--radius`                 | `rounded` / `rounded-md` / `rounded-lg` | Base radius unit                                |

> **Rule:** Always pair tokens correctly. `bg-primary` → use `text-primary-foreground` on top. Never mix unpaired tokens.

---

### How to Use in HTML / JSX

```html
<!-- Primary button -->
<button
  class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium"
>
  Get started
</button>

<!-- Secondary button -->
<button
  class="bg-secondary text-secondary-foreground border-border rounded-md border px-4 py-2"
>
  Learn more
</button>

<!-- Ghost button -->
<button
  class="text-primary hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2"
>
  Cancel
</button>

<!-- Destructive button -->
<button class="bg-destructive text-destructive-foreground rounded-md px-4 py-2">
  Delete
</button>

<!-- Card -->
<div
  class="bg-card text-card-foreground border-border rounded-lg border p-6 shadow-sm"
>
  Card content
</div>

<!-- Muted helper text -->
<p class="text-muted-foreground text-sm">Last updated 3 days ago</p>

<!-- Input -->
<input
  class="border-input bg-background text-foreground focus:ring-ring rounded-md border px-3 py-2 focus:ring-2 focus:ring-offset-2 focus:outline-none"
/>

<!-- Label -->
<label class="text-foreground text-sm font-medium">Email address</label>

<!-- Subtle accent hover row -->
<div
  class="hover:bg-accent hover:text-accent-foreground cursor-pointer rounded px-3 py-2"
>
  Nav item
</div>

<!-- Subtle primary tint (opacity variant) -->
<div class="bg-primary/10 text-primary rounded-md px-3 py-1 text-sm">Badge</div>
```

---

### CSS Variable Definitions

Define these in `:root` — the Tailwind classes above map directly to them:

```css
:root {
  /* ── Color Tokens (HSL — no hsl() wrapper here) ── */
  --background: 0 0% 100%;
  --foreground: 222 84% 5%;

  --card: 0 0% 100%;
  --card-foreground: 222 84% 5%;

  --popover: 0 0% 100%;
  --popover-foreground: 222 84% 5%;

  --primary: 221 83% 53%; /* ← override with brand color */
  --primary-foreground: 210 40% 98%;

  --secondary: 210 40% 96%;
  --secondary-foreground: 222 47% 11%;

  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;

  --accent: 210 40% 94%;
  --accent-foreground: 222 47% 11%;

  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;

  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 221 83% 53%;

  /* ── Radius ── */
  --radius: 0.5rem; /* base unit; sm = -2px, lg = +4px */

  /* ── Spacing ── */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 40px;
  --space-2xl: 64px;
  --space-3xl: 96px;

  /* ── Typography ── */
  --font-sans: /* chosen font */;
  --font-size-sm: 13px;
  --font-size-base: 15px;
  --font-size-md: 17px;
  --font-size-lg: 22px;
  --font-size-xl: 30px;
  --font-size-2xl: 42px;
  --font-size-3xl: 56px;

  /* ── Shadows ── */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.04);
}

/* Wire up CSS variables → Tailwind utilities (add to your global CSS) */
.bg-background {
  background-color: hsl(var(--background));
}
.bg-foreground {
  background-color: hsl(var(--foreground));
}
.bg-card {
  background-color: hsl(var(--card));
}
.bg-primary {
  background-color: hsl(var(--primary));
}
.bg-secondary {
  background-color: hsl(var(--secondary));
}
.bg-muted {
  background-color: hsl(var(--muted));
}
.bg-accent {
  background-color: hsl(var(--accent));
}
.bg-destructive {
  background-color: hsl(var(--destructive));
}

.text-foreground {
  color: hsl(var(--foreground));
}
.text-card-foreground {
  color: hsl(var(--card-foreground));
}
.text-primary {
  color: hsl(var(--primary));
}
.text-primary-foreground {
  color: hsl(var(--primary-foreground));
}
.text-secondary-foreground {
  color: hsl(var(--secondary-foreground));
}
.text-muted-foreground {
  color: hsl(var(--muted-foreground));
}
.text-accent-foreground {
  color: hsl(var(--accent-foreground));
}
.text-destructive {
  color: hsl(var(--destructive));
}
.text-destructive-foreground {
  color: hsl(var(--destructive-foreground));
}

.border-border {
  border-color: hsl(var(--border));
}
.border-input {
  border-color: hsl(var(--input));
}
.ring-ring {
  --tw-ring-color: hsl(var(--ring));
}

.rounded {
  border-radius: var(--radius);
}
.rounded-sm {
  border-radius: calc(var(--radius) - 2px);
}
.rounded-md {
  border-radius: var(--radius);
}
.rounded-lg {
  border-radius: calc(var(--radius) + 4px);
}
```

> **If using Tailwind CSS v3:** Add these to `tailwind.config.js` under `theme.extend.colors` instead, referencing the CSS variables. If using plain CSS or HTML artifacts, use the `.bg-*` / `.text-*` class definitions above.

---

### Dark Mode

Add `.dark` overrides — every component inherits automatically because all classes read from the same variables:

```css
.dark {
  --background: 222 84% 5%;
  --foreground: 210 40% 98%;
  --card: 222 84% 7%;
  --card-foreground: 210 40% 98%;
  --primary: 217 91% 60%;
  --primary-foreground: 222 47% 11%;
  --secondary: 217 33% 17%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;
  --accent: 217 33% 17%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62% 30%;
  --destructive-foreground: 210 40% 98%;
  --border: 217 33% 17%;
  --input: 217 33% 17%;
  --ring: 224 76% 48%;
}
```

Toggle with: `document.documentElement.classList.toggle('dark')`

---

### Opacity Variants

For subtle tints, use `/opacity` — no new tokens needed:

```html
<div class="bg-primary/10 text-primary">← 10% primary tint badge</div>
<div class="bg-destructive/10 text-destructive">← error tint</div>
<div class="border-border/50 border">← lighter border</div>
```

---

### Warm Neutral Palette (alternative preset)

```css
:root {
  --background: 40 30% 98%;
  --foreground: 20 14% 10%;
  --card: 40 20% 99%;
  --card-foreground: 20 14% 10%;
  --muted: 38 20% 94%;
  --muted-foreground: 24 8% 48%;
  --border: 35 18% 88%;
  --input: 35 18% 88%;
  /* Set --primary to brand color */
}
```

---

---

## Step 3: Core Design Principles

### Visual Hierarchy Over Decoration

- **White space and typography are your strongest tools** — not graphics, icons, or fills.
- Use **bold, high-contrast labels** (near-black on white) instead of muted grey text. The user's eye must immediately find where data starts — no hunting through visual noise.
- Apply the concept of **Information Scent**: every element should signal its purpose through weight, size, and position — not color or decoration.
- Ask yourself: "Could I remove this decorative element and lose nothing?" If yes, remove it.
- Avoid background fills on informational components (timelines, lists, data rows) unless the fill carries semantic meaning (e.g., active state, status).

### Layout & Spacing

- **Be generous with whitespace.** More space than you think. Sections should breathe.
- Use a **boxy, grid-aligned layout**. Cards, panels, and sections should feel solid and structured.
- Prefer **large padding inside containers** — minimum 24px, often 32–48px for sections.
- Use **consistent horizontal rhythm** — align everything to a grid, never arbitrary positioning.
- Section vertical gaps should be large: `80px–120px` between major sections.
- Max content width: typically `1100–1280px`, centered.

### Typography

- **NEVER use uppercase text** for anything — headings, labels, buttons, nav items. None.
- **NEVER use wide letter-spacing** (`letter-spacing > 0.02em`). Keep tracking natural.
- Font weights: use `400` (body), `500` (UI labels), `600` (emphasis), `700` (headings). Avoid `800+` unless for a single hero number.
- Line heights: `1.2–1.3` for headings, `1.6–1.7` for body text.
- Keep font sizes purposeful — don't use more than 5–6 distinct sizes.
- Body text should be comfortable: `15–16px` minimum.

### Color Usage — shadcn Utility Classes

- **Restrained color** — color is used to highlight, not decorate.
- Use `bg-primary text-primary-foreground` for: primary CTA buttons, active states, key highlights.
- Use `text-primary` (no background) for: links, icon accents, active nav items.
- Use `bg-secondary text-secondary-foreground` for: secondary buttons, chips, subtle tags — never decoration.
- Use `text-muted-foreground` for: helper text, timestamps, placeholders, disabled labels.
- Use `bg-muted` for: subtle surface fills, code blocks, disabled inputs.
- Use `bg-accent text-accent-foreground` for: hover row tints, subtle highlight fills.
- Use `bg-destructive text-destructive-foreground` only for: delete, error, danger actions.
- **No rainbow UI** — don't assign different bg tokens to every card as decoration.
- Page bg: `bg-background text-foreground`. Panels/cards: `bg-card text-card-foreground`.
- For a subtle tint without a new token: `bg-primary/10 text-primary` (opacity variant).
- **Never hardcode hex/rgb** — always use a utility class backed by a CSS variable.

### Borders & Dividers

- Based on user preference (from Step 1):
  - **Border-based**: use `border border-border` on cards and sections. Keep subtle — one pixel only.
  - **Shadow-based**: use `shadow-sm` / `shadow-md` to define elevation, omit borders.
  - **Mixed**: `border border-border` on flat surfaces, shadow on interactive/floating elements.
- For inputs specifically: `border border-input`.
- Never use decorative borders or thick dividers as ornamentation.
- Avoid `hr` tags unless genuinely needed as a content divider.

### Components & UI Patterns

**Timelines & Activity Feeds (Minimalist Brutalism):**

- Prefer **plain text with dot + vertical line** over boxed timeline cards.
- No background fills on timeline rows — let the line and dot carry the structure.
- This creates a "Global Thread" feel: a continuous story, not disconnected boxes.
- The timeline feels like narrative, not a series of tasks.
- Only add a card/box treatment if the item requires heavy interaction (expand, edit, link).

**Repeatable Sections (Structural Scalability):**

- Stack repeatable items (work history, tasks, entries) as **individual cards**, not collapsed into one block.
- Design for **worst-case data volume** (10 jobs, 20 tasks) — not best-case (1–2 items).
- Each card should be independently scannable: label, date, detail visible without expanding.
- This is the hallmark of senior product design: **easy scanning of long-form data**.

**Todo Lists & Task Items:**

- Use **checkboxes over event cards** for task-oriented items.
- A checkbox communicates "interact with me" (affordance). A card communicates "look at me" (display).
- Align the UI component with user intent: if the goal is crossing things off, the checkbox is the right component.
- Keep checkbox rows minimal: checkbox + label + optional metadata. No heavy card chrome.

**Buttons:**

- Primary: `bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium`
- Secondary: `bg-secondary text-secondary-foreground border border-border rounded-md px-4 py-2`
- Ghost: `text-primary hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2`
- Destructive: `bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-4 py-2`
- Focus state on all buttons: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
- Never uppercase. Font weight `500` (medium). Padding minimum `10px 20px`.

**Cards:**

- Base: `bg-card text-card-foreground rounded-lg p-6`
- With border: add `border border-border`
- With shadow: add `shadow-sm` or `shadow-md`
- Padding minimum `24px` (`p-6`), prefer `32px` (`p-8`) for content-heavy cards.

**Forms & Inputs:**

- Input: `border border-input bg-background text-foreground rounded-md px-3 py-2`
- Focus: `focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`
- Label: `text-foreground text-sm font-medium` — above the input, never uppercase.
- Placeholder: `placeholder:text-muted-foreground` — never a substitute for labels.
- Error state: `border-destructive text-destructive` on the input + helper text.

**Navigation:**

- Nav bar: `bg-background border-b border-border` — flat, no gradients.
- Nav item: `text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-3 py-2`
- Active nav item: `text-primary font-medium` or add a subtle underline indicator.
- Mobile: hamburger or drawer pattern, no overflow.

**Tables & Data:**

- Clean rows with subtle dividers.
- Column headers: `font-weight: 600`, normal case (no uppercase).
- Row hover: very subtle background shift.

**Icons:**

- Use line icons consistently — Lucide, Phosphor, or Heroicons.
- Size to text: `16px` inline, `20px` UI, `24px` feature icons.
- Never use emoji as UI icons.

---

## Step 4: Interaction & Motion

- Keep animations **subtle and functional**, not decorative.
- Standard transitions: `transition: all 0.15s ease` for hover states.
- Page load: simple fade-in for content sections (`opacity 0 → 1`, `translateY(8px) → 0`).
- Avoid bouncy, springy, or dramatic animations unless product is playful by nature.
- Scroll animations: subtle reveal, not jarring entrance effects.

---

## Step 5: Quality Checklist

Before finalizing, verify:

- [ ] No uppercase text anywhere
- [ ] No wide letter-spacing
- [ ] Whitespace is generous — sections breathe
- [ ] Color is restrained — accent used purposefully, not decoratively
- [ ] All text is readable — minimum 15px body, sufficient contrast
- [ ] Primary data labels are high-contrast (not muted grey) — Information Scent is clear
- [ ] Timeline / activity components use dot+line, not filled background boxes
- [ ] Repeatable data sections (work history, tasks) are individual cards — designed for scale
- [ ] Todo/task items use checkboxes, not event cards
- [ ] Border-radius is consistent via CSS variables
- [ ] Borders follow user preference
- [ ] Typography scale is purposeful — no arbitrary sizes
- [ ] Mobile is considered — layout responds correctly
- [ ] Interactive states exist (hover, focus, active)
- [ ] No grey soup — neutrals are limited to 4–5 intentional stops
- [ ] Padding inside components is generous
- [ ] Hover States: All buttons, links, and table rows have subtle feedback.
- [ ] CSS variables defined in `:root` — no hardcoded hex/rgb values anywhere
- [ ] All colors applied via utility classes (`bg-primary`, `text-muted-foreground`, `border-border`, etc.)
- [ ] Every surface uses the correct bg+foreground pair — `bg-primary` always paired with `text-primary-foreground`
- [ ] Focus states use `focus:ring-2 focus:ring-ring` consistently on all interactive elements
- [ ] Dark mode: if requested, `.dark` class token overrides defined and all utility classes inherit automatically
- [ ] Opacity variants used for subtle tints instead of inventing new tokens (`bg-primary/10`, `border-border/50`)

---

## Anti-Patterns — Never Do These

- ❌ `text-transform: uppercase` on any element
- ❌ `letter-spacing: 0.1em` or wider tracking
- ❌ Using 10+ different colors in one UI
- ❌ Colored cards for decoration (blue card, green card, yellow card in a row)
- ❌ Tiny body text (`< 14px`)
- ❌ Cramped padding (`< 16px` in cards)
- ❌ Heavy drop shadows on everything
- ❌ Gradient-heavy hero sections with clashing colors
- ❌ Inconsistent corner rounding (mixing sharp and very round arbitrarily)
- ❌ Borders that are too dark or prominent
- ❌ Bright colored section backgrounds stacked on each other
- ❌ More than one "hero" CTA button competing for attention
- ❌ Emoji used as navigation icons or feature bullets
- ❌ Background fills on timeline rows used purely for decoration (no semantic value)
- ❌ Collapsing repeatable data (job history, tasks) into a single block — design for scale
- ❌ Using event cards for simple todo/task items — use checkboxes instead
- ❌ Muted grey for primary data labels — use high-contrast text so the eye lands immediately
- ❌ Boxed timeline items when a dot+line treatment would create a cleaner narrative flow
- ❌ Hardcoded hex/rgb colors — always use a utility class backed by a CSS variable
- ❌ Inventing new color tokens — use opacity variants instead (`bg-primary/10`, `bg-destructive/20`)
- ❌ Mismatched token pairs — `bg-primary` must always be paired with `text-primary-foreground`, not `text-foreground`
- ❌ Skipping focus rings — every interactive element needs `focus:ring-2 focus:ring-ring`
- ❌ Writing `color: hsl(var(--primary))` inline — use `text-primary` class instead; keeps markup consistent

---

## Reference Aesthetic Targets

| Brand      | What to borrow                                                                           |
| ---------- | ---------------------------------------------------------------------------------------- |
| **Stripe** | Crisp grid, generous padding, elegant card shadows, precise typography, restrained color |
| **Apple**  | Extreme whitespace, large type, photography-first, minimal UI chrome                     |
| **Linear** | Dark mode mastery, tight information density without clutter, excellent nav              |
| **Vercel** | Boxy cards, sharp radius, data-dense but clean, monospace accents                        |
| **Notion** | Simple hierarchy, loads of breathing room, neutral palette                               |

---

## Font Recommendations (by user preference)

| Tone                 | Heading                           | Body                    |
| -------------------- | --------------------------------- | ----------------------- |
| Clean / Modern       | Geist, DM Sans, Plus Jakarta Sans | Same or Inter           |
| Editorial            | Fraunces, Playfair Display        | DM Sans, Lato           |
| Technical / Dev tool | IBM Plex Sans, Geist Mono accents | IBM Plex Sans           |
| Friendly / SaaS      | Nunito, Figtree                   | Figtree, DM Sans        |
| Premium / Luxury     | Cormorant, Editorial New          | Helvetica Neue, DM Sans |

Load from Google Fonts or Fontsource. Never default to system-ui or Arial.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
