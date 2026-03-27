---
description: Security review, audit, and hardening for the Excalidraw codebase. Use when the user asks to audit security, fix vulnerabilities, review unsafe code, or ensure OWASP Top 10 compliance.
globs: packages/**/*.ts,packages/**/*.tsx
alwaysApply: true
applyTo: "**"
---

# Security Review & Hardening

## When to use

When the user asks to:
- Audit or review code for security issues
- Fix a vulnerability (XSS, injection, insecure crypto, etc.)
- Check OWASP Top 10 compliance
- Review Firebase rules, collab/WebSocket handling, or URL sanitization
- Handle user-supplied data safely

## Inputs

- File(s) or area under review
- Optional: specific concern (e.g., "XSS in SVG export", "Firestore rules")

## Steps

### 1. Identify scope

Determine which category applies:

| Category | Files / Areas |
|---|---|
| URL / link sanitization | `packages/common/src/url.ts`, element `href` props |
| SVG / HTML injection | `excalidraw-app/share/QRCode.tsx`, SVG export paths |
| Encryption / key handling | `excalidraw-app/data/index.ts`, `packages/excalidraw/data/encryption` |
| Collab / WebSocket data | `excalidraw-app/collab/` |
| Firebase rules | `firebase-project/firestore.rules`, `storage.rules` |
| Dependency vulnerabilities | `package.json` files, `yarn audit` |
| iframe / postMessage | `excalidraw-app/ExcalidrawPlusIframeExport.tsx` |

### 2. Audit checklist

For each area in scope, verify:

#### XSS / Injection
- [ ] All `dangerouslySetInnerHTML` uses have sanitized input (SVG data, user content)
- [ ] No unsanitized `innerHTML` assignments
- [ ] User-controlled strings passed to SVG or HTML are escaped
- [ ] `normalizeLink` / `toValidURL` from `packages/common/src/url.ts` is called before any URL is rendered in `href`, `src`, or `iframe src`
- [ ] `@braintree/sanitize-url` is the canonical URL sanitizer — do NOT replace with custom regex

#### Cryptography
- [ ] Use `Web Crypto API` (`window.crypto.subtle`) only — never third-party crypto for encryption
- [ ] `generateEncryptionKey()` from `@excalidraw/excalidraw/data/encryption` is used to generate room/share keys
- [ ] Encryption keys are passed only in the URL fragment (`#key=...`), never in query params or request bodies
- [ ] IV is unique per encryption operation (random, not reused)
- [ ] `window.crypto.getRandomValues` is used for nonces/IDs, never `Math.random()`

#### Firebase / Firestore
- [ ] `allow list: if false` is maintained in `firestore.rules` — this prevents enumeration of all documents
- [ ] `allow write` rules are scoped as tightly as possible for production
- [ ] Storage rules restrict file types and sizes

#### Collab / WebSocket
- [ ] Incoming collab messages are validated and typed before being applied to canvas state
- [ ] No eval or dynamic code execution on received data
- [ ] Room IDs and keys are generated server-side or with `crypto.getRandomValues`

#### iframe / postMessage
- [ ] `postMessage` listeners validate `event.origin` before processing
- [ ] Signature verification uses `crypto.subtle.verify` (already implemented in `ExcalidrawPlusIframeExport.tsx`)
- [ ] `iframe` embeds use `sandbox` attributes where applicable

#### Dependencies
- [ ] Run `yarn audit` to surface known CVEs
- [ ] Flag any dependency with a HIGH or CRITICAL severity for immediate update

### 3. Fix vulnerabilities

Priority order:
1. **Critical**: XSS via unsanitized HTML/SVG injection → sanitize immediately
2. **High**: Missing origin check on `postMessage`, weak/missing encryption → fix before merge
3. **Medium**: Overly permissive Firestore rules, exposed keys in URLs (non-fragment) → fix before deploy
4. **Low**: Missing `sandbox` on iframes, `Math.random()` for IDs → fix in follow-up

### 4. Report findings

For each finding report:
```
[SEVERITY] <short title>
File: <path>#L<line>
Issue: <what is wrong>
Fix: <what was changed or must be changed>
```

## Outputs

- List of findings with severity, file reference, and fix
- Summary: PASS (no issues) / FAIL (issues found, list them)
- Optionally: patched files

## Safety

- Do NOT weaken existing sanitization or remove `sanitizeUrl` calls
- Do NOT move encryption keys from URL fragments to query params or storage
- Do NOT set `allow list: if true` in `firestore.rules`
- Do NOT use `Math.random()` for security-sensitive IDs or tokens
- Do NOT add `@ts-ignore` to suppress type errors in security-critical code
- READ the file before editing — never assume content matches a pattern

## How to verify

1. Run `yarn audit` — no HIGH or CRITICAL CVEs in dependencies
2. Run `yarn test:typecheck` — no type errors in security-critical files
3. Check URL sanitization coverage: `grep -r "href\|src=" packages/ excalidraw-app/` — every dynamic value must pass through `normalizeLink` or `toValidURL`
4. Check for unsanitized HTML: `grep -r "dangerouslySetInnerHTML\|innerHTML" packages/ excalidraw-app/` — review every hit manually
5. Confirm `firestore.rules` still contains `allow list: if false`
6. Confirm encryption keys appear only in URL fragments: `grep -r "encryptionKey\|roomKey" excalidraw-app/` — no query param or localStorage usage
7. Check for `Math.random()` in ID/nonce generation: `grep -r "Math.random" packages/ excalidraw-app/` — should return no security-sensitive hits
