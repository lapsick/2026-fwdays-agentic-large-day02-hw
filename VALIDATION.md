## A/B Test 1 - architecture.instructions.md:

- **Prompt**: "Create a new component for displaying element coordinates"
- **Result A (rule ON)**: pure props (no local state), named export (`export const ElementCoordinates`), strict types (`ElementCoordinatesProps`, `CoordRowProps`, `GlobalPoint`), `getElementAbsoluteCoords()` from `@excalidraw/element`, extracted `CoordRow` sub-component, null safety enforced by caller types
- **Result B (rule OFF)**: `useState` + `useEffect`, default export (`export default CoordinatesDisplay`), `any` on props, manual arithmetic on `element.x/y/width/height`, inline JSX rows, runtime `if (!element) return` guard
- **Conclusion**: Rule effectively prevents Zustand/Redux suggestions and enforces strict typing, proper element API usage, and named exports

### Comparison

| Aspect | Result A (`ElementCoordinates.tsx`) | Result B (`CoordinatesDisplay.tsx`) |
|---|---|---|
| State management | Pure props, no local state | `useState` + `useEffect` |
| Exports | `export const ElementCoordinates` (named) | `export default CoordinatesDisplay` (default) |
| Types | `ElementCoordinatesProps`, `CoordRowProps`, `GlobalPoint` | `any` on props |
| Coordinates | `getElementAbsoluteCoords()` from `@excalidraw/element` | Manual arithmetic on `element.x/y/width/height` |
| Sub-components | Extracted `CoordRow` component | Inline JSX rows |
| Null safety | N/A — types enforced by caller | Guarded with `if (!element) return` |

---

## A/B Test 2: enabled/disabled all rules

- **Prompt**: "Create element properties panel component"
- **Result A (rule ON)**: `useExcalidrawAppState()` (no local state), named export (`export const ElementPropertiesPanel`), strict types (`ElementPropertiesPanelProps`, `NonDeletedExcalidrawElement`), `round()` from `@excalidraw/math`, extracted sub-components (`ColorRow`, `PropRow`, `SectionTitle`, `SingleElementProperties`, `MultiElementProperties`), `t()` for all labels, `Island` component + `CloseIcon`, null safety enforced by caller types
- **Result B (rule OFF)**: `useState` + `useEffect` to sync selection, default export (`export default ElementPropertiesPanelAlt`), `any` on props, manual `.toFixed(2)` on element properties, inline `<p>` rows, hardcoded English strings, plain `<div>` / `<button>✕</button>`, runtime `if (!selected || selected.length === 0)` guard
- **Conclusion**: Rule effectively prevents local state anti-patterns and enforces strict typing, proper Excalidraw API usage, named exports, i18n, and consistent layout components

### Comparison

| Aspect | Result A (`ElementPropertiesPanel.tsx`) | Result B (`ElementPropertiesPanelAlt.tsx`) |
|---|---|---|
| State management | `useExcalidrawAppState()` — no local state | `useState` + `useEffect` to sync selection |
| Exports | `export const ElementPropertiesPanel` (named) | `export default ElementPropertiesPanelAlt` (default) |
| Types | `ElementPropertiesPanelProps`, `NonDeletedExcalidrawElement` | `any` on props |
| Number formatting | `round()` from `@excalidraw/math` | Manual `.toFixed(2)` on element properties |
| Sub-components | `ColorRow`, `PropRow`, `SectionTitle`, `SingleElementProperties`, `MultiElementProperties` | Inline `<p>` rows, no extracted components |
| i18n | `t()` for all labels | Hardcoded English strings |
| Layout | `Island` component, `CloseIcon` | Plain `<div>` / `<button>✕</button>` |
| Null safety | N/A — types enforced by caller | Runtime `if (!selected \|\| selected.length === 0)` guard |

---
