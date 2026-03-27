---
description: "Scaffold a new Excalidraw React component following project conventions"
agent: agent
tools: [codebase, read_file, create_file]
---

Create a new React component named **${input:componentName}** in `${input:location:packages/excalidraw/components}`.

Follow these rules:

## File & naming
- File: `${input:location}/${input:componentName}.tsx`
- PascalCase component name, kebab-case filename if multi-word
- Colocated test: `${input:componentName}.test.tsx` (create a minimal smoke test)

## Component structure
```tsx
import type { ReactNode } from "react";

type ${input:componentName}Props = {
  // props here
};

export const ${input:componentName} = ({ ... }: ${input:componentName}Props) => {
  return (...);
};
```
- Functional component + hooks only — no class components
- Named export only — no default export
- Props typed as `${input:componentName}Props`
- No `any`, no `@ts-ignore`

## State & actions
- If the component reads or mutates app state, use `actionManager.dispatch()` — not `useState` on App
- Read app state from props or context — do not import `App` directly

## Styling
- Use CSS Modules (`.module.scss`) for component-specific styles
- Import as `import styles from "./${input:componentName}.module.scss"`

## Performance
- Avoid inline object/array literals in JSX props
- Wrap with `React.memo` only if the component renders frequently with stable props

## After creating the files
1. Show the created file contents
2. Confirm the test file was created
3. List any manual wiring needed (e.g., adding to a parent component or exporting from `index.tsx`)
