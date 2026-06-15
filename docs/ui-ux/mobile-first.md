# Mobile First Design Standards

> Parent: [DEVELOPMENT_STANDARDS.md §1](../DEVELOPMENT_STANDARDS.md#1-mobile-first-design)

## Principle

Design for mobile first, then enhance for tablet, laptop, and desktop. **No desktop-only features.**

## Layout

| Pattern | Mobile | Tablet+ |
|---------|--------|---------|
| Navigation | Hamburger + bottom nav | Sidebar |
| Tables | Card list or horizontal scroll | Full data table |
| Forms | Single column, full width | Multi-column where appropriate |
| Dashboard | Stacked widgets | Grid layout |
| Modals | Full-screen sheet | Centered dialog |

## Touch Targets

- Minimum tap target: **44 × 44 px**
- Spacing between interactive elements: **8px minimum**
- Swipe gestures for dismissible panels where appropriate

## Screen Doc Requirement

Every `Menus/*.md` file must include a **Page Layout** section describing mobile behavior.

## Testing

Test on real devices or emulators for: iPhone (Safari), Android (Chrome), iPad, 1366px laptop, 1920px desktop.
