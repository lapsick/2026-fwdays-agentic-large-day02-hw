---
description: "Review selected code for correctness, conventions, performance, and security"
agent: ask
---

Review the code in #selection (or `#file:${input:file}` if no selection) against the following criteria:

## 1. Correctness
- Logic errors, off-by-one, null/undefined access
- Incorrect use of async/await or missing error handling

## 2. Conventions (`#file:.github/instructions/conventions.instructions.md`)
- Functional components + hooks only — no class components
- Named exports only — no default exports
- Props typed as `{ComponentName}Props`
- No `any`, no `@ts-ignore`
- `import type` for type-only imports

## 3. Architecture (`#file:.github/instructions/architecture.instructions.md`)
- State via `actionManager.dispatch()` — not `useState` on App
- Canvas drawing via `renderScene` — not React DOM
- No new npm dependencies without approval

## 4. Performance (`#file:.github/instructions/performance.instructions.md`)
- No inline object/array literals in JSX props
- No `requestAnimationFrame` calls outside `AnimationFrameHandler`
- No `Array.find` in tight loops — use `Map` lookups
- No speculative `useMemo`/`useCallback`

## 5. Security (`#file:.github/instructions/security.instructions.md`)
- URLs sanitized via `normalizeLink` / `toValidURL`
- No `dangerouslySetInnerHTML` without sanitized input
- `window.crypto.getRandomValues` for IDs — not `Math.random()`

## Output format
For each issue found:
```
[SEVERITY: critical|high|medium|low] <short title>
Line: <line number or range>
Issue: <what is wrong>
Fix: <what to change>
```
End with: **PASS** (no issues) or **FAIL** (list count by severity).
