# REQUIREMENTS.md

## Format
| ID | Requirement | Source | Status |
|----|-------------|--------|--------|
| REQ-01 | **320px Base Support:** All components MUST render without horizontal overflow at 320px viewport width. | SPEC Goal 1 | Pending |
| REQ-02 | **Mobile-First Stacking:** Multi-column layouts MUST stack vertically (`flex-col`) on viewports < 640px. | SPEC Goal 2 | Pending |
| REQ-03 | **Responsive Spacing:** Global and component-level margins/paddings MUST scale down for small viewports. | SPEC Goal 4 | Pending |
| REQ-04 | **Touch-Friendly Targets:** Buttons and links MUST have at least 44x44px touch targets on mobile. | SPEC Goal 1 | Pending |
| REQ-05 | **Image Scaling:** Images MUST use `w-full` and `h-auto` or `aspect-ratio` to prevent layout shift on small screens. | SPEC Goal 4 | Pending |
| REQ-06 | **Typography Scaling:** Text sizes MUST use responsive utility classes (e.g., `text-sm sm:text-base md:text-lg`). | SPEC Goal 1 | Pending |
| REQ-07 | **Builder Preview Support:** The `builder-layout.tsx` MUST correctly render the mobile preview without clipping. | SPEC Goal 3 | Pending |
