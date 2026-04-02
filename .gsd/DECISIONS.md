# DECISIONS.md

## ADR-01: Mobile-First Responsiveness
**Status**: `ACCEPTED`
**Date**: 2026-04-02
**Context**: Sites must support viewports down to 320px.
**Decision**: Adopt a mobile-first coding approach. Base classes (e.g., `flex-col`) will target the smallest screen (320px), and responsive prefixes (e.g., `sm:flex-row`) will handle upgrades for larger viewports.
**Consequences**: Some existing "desktop-only" styles must be refactored. Standardizes the layout pattern across all builder components.
