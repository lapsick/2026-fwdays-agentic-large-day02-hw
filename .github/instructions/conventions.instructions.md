---
description: "Code conventions for Excalidraw components and utilities"
globs: packages/**/*.ts,packages/**/*.tsx
alwaysApply: false
---

# Code Conventions

## Components

- Functional components + hooks ONLY (no class components)
- Props interface: `{ComponentName}Props`
- Named exports only (no default exports)
- Colocated tests: `ComponentName.test.tsx`

## TypeScript

- Strict mode — no `any`, no `@ts-ignore`
- Prefer `type` over `interface` for simple types
- Import types: `import type { X } from "..."`

## Files

- kebab-case for files: `element-utils.ts`
- PascalCase for components: `LayerUI.tsx`

## How to verify

1. Run `yarn fix` — auto-fixes formatting/linting violations
2. Run `yarn test:typecheck` — strict mode catches `any` and `@ts-ignore`
3. Check for default exports: `grep -r "export default" packages/` should return no component files
4. Check for class components: `grep -r "extends React.Component\|extends Component" packages/` should return nothing
5. Confirm every new component has a colocated `ComponentName.test.tsx`
