# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
Transform the Nepdora Site Builder into a truly responsive, mobile-first platform, ensuring all site components (About, Hero, Services, etc.) render perfectly down to a 320px screen width without horizontal scrolling or layout breakage.

## Goals
1. **Full Mobile Support (320px+):** Implement responsive layouts for all builder components in `src/components/site-owners/builder`.
2. **Standardized Breakpoints:** Use consistent Tailwind CSS v4 breakpoints (`sm:`, `md:`, `lg:`, `xl:`) for all components.
3. **Refactor Core Layout:** Ensure `builder-layout.tsx` and related wrappers support small-screen editing/previewing.
4. **Zero Layout Regressions:** Maintain desktop visual excellence while improving mobile usability.

## Non-Goals (Out of Scope)
- **New Components:** We are refactoring existing ones, not adding new styles.
- **Backend Changes:** No changes to API endpoints or data schemas.
- **Design Overhaul:** Only layout/responsiveness changes, not aesthetic redesigns.

## Users
- **Site Owners:** Using the builder to create sites.
- **Site Visitors:** Viewing the published sites on various mobile devices (e.g., iPhone SE/12/13/14, Samsung Galaxy S series).

## Constraints
- **Framework:** Next.js 16 (App Router) & React 19.
- **Styling:** Tailwind CSS v4.
- **Interaction:** Must handle both click (desktop) and touch (mobile) interactions where applicable.

## Success Criteria
- [ ] No horizontal scrollbars on 320px width for all components.
- [ ] All interactive elements (buttons, inputs) are easily clickable on mobile.
- [ ] Typography and spacing scale appropriately for small screens.
- [ ] Consistent stacking patterns implemented for multi-column sections.
