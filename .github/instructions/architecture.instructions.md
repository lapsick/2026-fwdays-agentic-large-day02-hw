---
description: "Architecture constraints for Excalidraw"
globs: packages/excalidraw/**
alwaysApply: false
---

# Excalidraw Architecture

## State Management

- Custom state via actionManager — NOT Redux/Zustand/MobX
- State updates: actionManager.dispatch() ONLY
- State type: AppState (packages/excalidraw/types.ts)

## Rendering

- Canvas 2D rendering — NOT React DOM for drawing
- Render pipeline: Scene → renderScene() → canvas context
- DO NOT use react-konva, fabric.js, pixi.js

## Dependencies

- No new npm packages without explicit approval
- Check packages/utils/ before adding external helpers

## How to verify

1. Run `yarn test:typecheck` — no TypeScript errors
2. Run `yarn test:update` — all tests pass
3. Search for disallowed state patterns: `grep -r "useState\|useReducer" packages/excalidraw/components/App.tsx` should return no new entries
4. Confirm no new entries in `package.json` dependencies without approval
5. Confirm all canvas drawing paths call `renderScene` — no direct `ctx.draw*` calls outside the render pipeline
