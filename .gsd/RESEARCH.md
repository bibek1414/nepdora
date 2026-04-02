# RESEARCH.md — Responsiveness Audit

> **Status**: `COMPLETED`
> **Date**: 2026-04-02

## Overview
A automated scan of the `src/components/site-owners/builder` directory was performed to identify components that lack Tailwind CSS responsive prefixes (`sm:`, `md:`, `lg:`). These components are high-risk for layout breakage on 320px+ screens.

## Key Findings

### 1. High-Priority "Broken" Components
The following components have **zero** occurrences of the `sm:` prefix, suggesting they likely use desktop-fixed layouts:

| Component Category | Filenames (examples) | Risk Level |
|-------------------|----------------------|------------|
| **About Styles** | `about-style-1, 5, 6, 8, 9, 13, 16, 17, 18, 19` | High (Multi-column layouts) |
| **Appointment** | `appointment-style-1, 2`, `appointment-form.tsx` | High (Forms and tables) |
| **Auth** | `login-form-component.tsx`, `signup-form-component.tsx` | Medium (Standard forms) |
| **Banner** | `banner-component.tsx` | Medium (Hero images/text) |
| **Category** | `category-style-1, 2, 3, 4, 5, 6, 7, 8` | High (Grid layouts) |

### 2. Common Patterns of Non-Responsiveness
- **Fixed Widths:** Use of `w-[400px]` or similar without responsive overrides.
- **Flex Direction:** Many sections use `flex-row` but never switch to `flex-col` for smaller screens.
- **Grid Systems:** Static grid columns (e.g., `grid-cols-3`) that don't adapt to `grid-cols-1` on mobile.
- **Paddings:** Large desktop paddings (e.g., `px-20`) that compress content too much on 320px screens.

## Technical Context
- **Tailwind Version:** v4.
- **Breakpoints Target:** 320px (base), 640px (sm), 768px (md), 1024px (lg).
- **Strategy:** Adopt a mobile-first approach where base classes target 320px and prefixes handle larger screens.

## Next Steps
1. Define **Phase 1** in `ROADMAP.md` to address the "Foundation" (shared Layout/Wrapper and high-priority About styles).
2. Create responsive templates for common patterns (Grid, Flex, Form).
