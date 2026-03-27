# AGENTS.md

## Project Structure

Excalidraw is a **monorepo** with a clear separation between the core library and the application:

- **`packages/excalidraw/`** - Main React component library published to npm as `@excalidraw/excalidraw`
- **`excalidraw-app/`** - Full-featured web application (excalidraw.com) that uses the library
- **`packages/`** - Core packages: `@excalidraw/common`, `@excalidraw/element`, `@excalidraw/math`, `@excalidraw/utils`
- **`examples/`** - Integration examples (NextJS, browser script)

## Development Workflow

1. **Package Development**: Work in `packages/*` for editor features
2. **App Development**: Work in `excalidraw-app/` for app-specific features
3. **Testing**: Always run `yarn test:update` before committing
4. **Type Safety**: Use `yarn test:typecheck` to verify TypeScript

## Development Commands


<CodeBlockWrapper v-bind="{}" :ranges='[]'>

```bash
yarn test:typecheck  # TypeScript type checking
yarn test:update     # Run all tests (with snapshot updates)
yarn fix             # Auto-fix formatting and linting issues
```

</CodeBlockWrapper>

## Architecture Notes

### Package System

- Uses Yarn workspaces for monorepo management
- Internal packages use path aliases (see `vitest.config.mts`)
- Build system uses esbuild for packages, Vite for the app
- TypeScript throughout with strict configuration

## Tech Stack

- **TypeScript** — all source code is strictly typed
- **Yarn** — package manager and workspace orchestration
- **Vite** — dev server and app bundler (`excalidraw-app/`)
- **Vitest** — unit and integration test runner
- **React** — UI framework (functional components + hooks)

## Conventions

See [.cursor/rules/conventions.instructions.md](.cursor/rules/conventions.instructions.md) for naming, component, and code style rules.

## Do-Not-Touch / Constraints

See [.cursor/rules/do-not-touch.instructions.md](.cursor/rules/do-not-touch.instructions.md) for files and areas that must not be modified.

## References
- For details see the Memory Bank `docs/memory/techContext.md` and `docs/memory/systemPatterns.md` which contains technical context, and system patterns.
