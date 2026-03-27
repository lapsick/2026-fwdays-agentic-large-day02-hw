---
description: "Protected files that should not be modified"
globs: "packages/excalidraw/**"
alwaysApply: true
---

# Protected Files

NEVER modify these files without explicit approval:

- `packages/excalidraw/scene/renderer.ts` — render pipeline
- `packages/excalidraw/data/restore.ts` — file format compat
- `packages/excalidraw/actions/manager.ts` — action system
- `packages/excalidraw/types.ts` — core types

Changes to protected files require:

1. Full understanding of dependencies
2. Running complete test suite
3. Manual QA verification

## How to verify

1. Run `git diff --name-only` — confirm none of the protected files appear in the diff
2. If a protected file was intentionally modified, run `yarn test:update` and confirm all tests still pass
3. Run `yarn test:typecheck` — no regressions in core types
4. For changes to `types.ts`: verify all consumers compile without casting workarounds
5. For changes to `renderer.ts`: perform manual canvas QA (zoom, pan, export to PNG/SVG)
