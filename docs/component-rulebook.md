# Component Rulebook

This guide turns the `@beautifulMention` callout into a repeatable checklist whenever a new builder component is born. Every component section should live inside a `@beautifulMention` wrapper in the docs, and the implementation should honor the layout, text/link/image, theme, and variant rules listed below.

## @beautifulMention Layout Shell
- Start each component with a `section` or `div` that mirrors the builder frame: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` inside `container` as needed so nothing stretches uncomfortably on large screens.
- Layer in the semantic `aria` role that matches the component (example: `section` for content blocks, `nav` for menus) and keep the outer wrapper responsible for spacing, background, and any `max-w-7xl` constraint.
- Inject `@beautifulMention` comments/descriptions in the doc version so the team can see which guideline bullet the implementation follows.

## @beautifulMention Text Strategy
- Use `EditableText` when text is expected to change; fall back to plain markup when the text is permanent. Pass `as` to keep semantics, e.g., `as="h1"` for hero headings.
- **Never wrap `EditableText` in a semantic tag (like `h1`, `h2`, `p`) for styling.** Instead, pass the styling classes directly to the `EditableText` component's `className` prop and use the `as` prop for the tag.
  - **Bad**: `<h2 className="text-2xl"><EditableText ... /></h2>`
  - **Good**: `<EditableText as="h2" className="text-2xl" ... />`
- Keep typography tight: headline classes should be bold, subheadings sized proportionally, and every text element should live inside the `max-w-7xl` column width so the line-length stays readable.
- Document the text slot under `@beautifulMention` in the guide so designers know what content is editable versus fixed.
- Prefer the `as` prop values that match your content (supported types: `"p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span"`), and let `EditableText` own the semantics instead of wrapping bare tags.
- Inject theme tokens through `style` or `className` (colors from `theme.colors.secondary`, fonts from `theme.fonts.heading`) so the UI matches the designer intent.
- Base the background on white and text on black unless a specific variant explicitly requires another shade; avoid scattering other colors through typography or layout so the only accent color usage occurs inside the `EditableLink` buttons where we already rely on `theme.colors.primary`/`primaryForeground`.

## @beautifulMention Link Strategy
- Prefer `EditableLink` for buttons and CTAs. Always set `href`, `aria-label` when the link text is ambiguous, and `rel="noreferrer"` for external destinations.
- Guards: Check `link.target` defaults to `_self`, and only reach for `_blank` when the experience explicitly requires it; cite that decision in the `@beautifulMention` note.
- Link containers should stay within the `max-w-7xl` grid and receive the same vertical rhythm as the text around them.
- When links double as buttons, use the theme primary color for the background/border and `theme.colors.primaryForeground` for the label so editing states stay consistent with the overall palette.
- If the `EditableLink` contains inline icons (e.g., `<ChevronRight/>`), embed them inside the link body and make sure hover/transition classes (like `group-hover`) share the same wrapper so the icon respects the primary palette described in `@beautifulMention`.

## @beautifulMention Image Strategy
- Wrap imagery inside `EditableImage`, supply sensible `alt` text, and pass `priority` only when the hero image really matters for the first paint.
- Restrict width via `max-w-[650px]` or similar utilities when the image sits beside text inside the `max-w-7xl` column.
- Mention fallback behavior in the `@beautifulMention` doc so the builder can swap assets without needing a code change.

## @beautifulMention Theme Strategy
- Always call `useThemeQuery()` near the top of the component, fall back to the default theme object, and spread the colors/fonts into styles rather than hard-coding values inside the JSX.
- Keep theming within the same `max-w-7xl` wrapper: colors feed `style` props, fonts flow through `className`, and important tokens are documented under `@beautifulMention: Theme`. Avoid inline colors unless they are part of the template design.

## @beautifulMention Aesthetic Guidelines
- **Avoid Excessive Shadows**: Use subtle shadows (`shadow-sm` or `shadow`) sparingly. Deep or heavy shadows can make the UI feel dated.
- **Subtle Hover Effects**: Hover states should be professional and understated. Avoid overly aggressive scaling or intense color changes. Prefer smooth, short transitions (e.g., `transition-all duration-200`).
- **Clean Flow**: Ensure components follow a logical flow, maintaining consistent vertical rhythm and whitespace. Align elements to the grid defined in the Layout Shell.

## @beautifulMention Variant + Prefers
- Define a `template` literal type (for example, `hero-17`) and add it to the union in the shared `types` file along with the default data, type guard, and map entry. Capture this registration process in the `@beautifulMention` variant note.
- The new style must appear in the `add-section-dialog` templates list so the builder can prefer that variant from the UI. Note the preferred placement (hero, feature, testimonial) inside `@beautifulMention` so the next person can follow the intent.

## @beautifulMention Prefer Section Notes
- Before coding, inspect similar sections in the repo and write a short “Prefer” paragraph under `@beautifulMention` that lists the closest existing components and their distinguishing features.
- Use that note to decide whether to reuse, extend, or replace component logic; if reuse wins, mention how the text/link/image/theme rules above still apply inside the borrow.

## Implementation Flow
1. Analyze the target component area and write the `@beautifulMention` checklist in this document before touching code.
2. Draft the data type+default record, add `max-w-7xl` skeleton, and document the text/link/image/theme approach inside `@beautifulMention` so the review can verify compliance quickly.
3. Wire the component into the renderer and `add-section-dialog`, calling out the registration steps inside the final `@beautifulMention` block.

Keep every future component aligned with these `@beautifulMention` anchors so we get consistent builder behavior and predictable renders.

## Next Steps
- Share this rulebook inside the `@beautifulMention` wrapper for each new component so reviewers and builders can quickly verify layout, typography, links, images, theme usage, and variant registration before the code lands.
