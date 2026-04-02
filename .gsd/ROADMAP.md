# ROADMAP.md

> **Current Phase**: Phase 0: INITIALIZATION
> **Milestone**: v1.0 - Responsive Site Builder

## Must-Haves (from SPEC)
- [ ] Support viewports down to 320px for all builder sections.
- [ ] Mobile-first responsive patterns implemented via Tailwind CSS v4.
- [ ] Correct builder UI/Preview rendering on small screens.
- [ ] No regression on desktop layout.

## Phases

### Phase 1: Foundation (Current Orientation)
**Status**: ⬜ Not Started
**Objective**: Establish common responsive patterns and fix core builder layout.
**Requirements**: REQ-01, REQ-03, REQ-07
- Fix `builder-layout.tsx` to prevent clipping at 320px.
- Create a `ResponsiveContainer` or update existing wrappers for mobile settings.

### Phase 2: About Styles (High Priority)
**Status**: ⬜ Not Started
**Objective**: Fix all `about-style-*` components—the most common site sections.
**Requirements**: REQ-02, REQ-04, REQ-06
- Focus on the 10+ identified "broken" About styles.
- Switch 2-column designs to vertical stacking.

### Phase 3: Category & Grid Sections
**Status**: ⬜ Not Started
**Objective**: Ensure grid-heavy sections (Categories, Teams, Services) adapt to screen size.
**Requirements**: REQ-02, REQ-05
- Refactor `category-style-*` and `team-style-*` grids.
- Implement responsive card scaling.

### Phase 4: Forms & Special UI
**Status**: ⬜ Not Started
**Objective**: Optimize Appointments, Auth, and Interactive forms for mobile.
**Requirements**: REQ-01, REQ-04, REQ-06
- Fix `appointment-style-*` and `login/signup` forms.
- Ensure large buttons and inputs are usable at 320px.

### Phase 5: Verification & Polish
**Status**: ⬜ Not Started
**Objective**: Audit the entire builder for consistency and 320px support.
**Requirements**: ALL
- Systematic review of all remaining styles.
- Final visual polish and cross-browser/device testing.
