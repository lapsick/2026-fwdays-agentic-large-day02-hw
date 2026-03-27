---
description: "Testing conventions for Excalidraw packages — apply when writing or modifying tests"
globs: "packages/**/*.test.ts,packages/**/*.test.tsx,excalidraw-app/tests/**"
alwaysApply: false
---

# Testing Conventions

## Context

Excalidraw uses Vitest with jsdom and `@testing-library/react`. Tests live either colocated with source (e.g. `packages/math/tests/`) or in a dedicated `tests/` subfolder (e.g. `packages/excalidraw/tests/`). Consistent conventions prevent flaky tests, snapshot drift, and misleading test failures across the monorepo.

## Rule

- Use `describe` / `it` blocks — never use bare `test()` calls at the top level
- Name `it` blocks as behaviour statements starting with `"should ..."` (e.g. `it("should rotate over origin")`)
- Import `vi` from `vitest` for all mocking — NEVER use `jest.*` APIs
- Use `vi.spyOn` for side-effect observability; use `vi.mock` only at module level (top of file, never inside `describe`/`it`)
- Reset mocks in `beforeEach` — call `mockClear()` / `mockReset()` per spy, not globally via config
- Use `render` / `queryByTestId` / `unmountComponent` from `../tests/test-utils` for component tests — NEVER import directly from `@testing-library/react`
- Call `unmountComponent()` and `localStorage.clear()` in `beforeEach` for every component test suite
- Use `reseed(n)` from `@excalidraw/common` before each test that exercises randomised element IDs to ensure deterministic output
- Prefer `toMatchSnapshot()` for DOM/canvas output assertions; run `yarn test:update` when snapshots change intentionally
- Assert pure math/utility functions with `toEqual` or `toBeCloseTo` — NEVER snapshots for scalar values
- Use `import type` for type-only imports inside test files
- NEVER use `@ts-ignore` in test files — fix the type error instead
- AVOID testing implementation details (internal method calls, private state); test observable outputs only
- DO NOT add `console.log` statements to committed test files
- Place test files in `<package>/tests/` for `packages/math` and `packages/utils`; colocate as `ComponentName.test.tsx` for `packages/excalidraw`

## How to verify

1. Run `yarn test:app` from the project root — all tests must pass with no new failures
2. Run `yarn test:typecheck` — no TypeScript errors in test files
3. Check that any new snapshot files are committed alongside the test change (`yarn test:update` generates them)
4. Confirm `vi.mock(...)` calls appear at the module top level (not inside `describe`/`it`/`beforeEach`)
5. Confirm no `jest.*` references exist: `grep -r "jest\." packages/` should return no test-file hits
