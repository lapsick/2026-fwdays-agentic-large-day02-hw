---
description: "Performance guidelines for Excalidraw — apply when writing or reviewing rendering, state, React, or canvas code."
globs: packages/**/*.ts,packages/**/*.tsx,excalidraw-app/**/*.ts,excalidraw-app/**/*.tsx
alwaysApply: false
applyTo: "packages/**/*.ts,packages/**/*.tsx,excalidraw-app/**/*.ts,excalidraw-app/**/*.tsx"
---

# Performance Guidelines

## Canvas rendering

- All scene rendering goes through `renderScene` — never draw to a canvas outside this pipeline
- Split static (non-interactive) and interactive layers: `StaticCanvas` / `InteractiveCanvas` — avoid causing the static layer to re-render during pan/zoom/hover
- Use `shouldCacheIgnoreZoom` (`appState`) to skip zoom-adjusted cache invalidation during viewport changes
- Use `imageCache` (`App.imageCache: Map`) for decoded image elements — never decode the same image twice
- Schedule canvas redraws through `AnimationFrameHandler` (`packages/excalidraw/animation-frame-handler.ts`) — never call `requestAnimationFrame` directly in rendering code
- Prefer allocation-free paths in hot render loops (no array spread, no `Object.assign`, no new objects per frame)

## React

- Wrap expensive pure components with `React.memo` + a custom `areEqual` comparator (see `Excalidraw` in `packages/excalidraw/index.tsx`)
- Use `useMemo` for derived data computed from large element arrays; use `useCallback` for stable handler references passed as props
- Do NOT add `useMemo`/`useCallback` speculatively — only where a measurable re-render cost exists
- Avoid inline object/array literals in JSX props — they break reference equality and defeat `React.memo`

## State updates

- Dispatch state changes via `actionManager.dispatch()` — never `setState` directly on `App`
- Batch related state mutations into a single dispatch to prevent cascading re-renders
- Use `useRef` for values that change frequently but do not need to trigger re-renders (e.g., pointer position during drag)

## Algorithmic / data

- Prefer in-place mutation over allocating new arrays in tight loops (trade RAM for CPU cycles)
- Use `window.crypto.getRandomValues` for ID generation — not `Math.random()` (also a security requirement)
- Throttle or debounce event handlers (pointer move, resize, scroll) that trigger state updates or re-renders
- Index elements by `id` (`Map<string, ExcalidrawElement>`) when doing frequent lookups — avoid repeated `Array.find`

## What NOT to do

- Do NOT call `requestAnimationFrame` directly for rendering — use `AnimationFrameHandler`
- Do NOT decode images outside `imageCache`
- Do NOT trigger a full `StaticCanvas` repaint from interactive-only state changes (cursor, selection highlights)
- Do NOT use `Math.random()` for element or room IDs
- Do NOT add `key={Math.random()}` to force re-mounts as a workaround

## How to verify

1. Run `yarn test:update` — no new failures in canvas/rendering tests
2. Run `yarn test:typecheck` — no type errors
3. Check for direct RAF calls: `grep -r "requestAnimationFrame" packages/` — only `animation-frame-handler.ts` and `debug.ts` should contain it
4. Check for `Math.random()` in element/ID paths: `grep -r "Math.random" packages/` should return no hits in element creation or ID generation code
5. Profile with React DevTools Profiler after changes to rendering-adjacent components — confirm no unexpected `StaticCanvas` re-renders during hover/drag
