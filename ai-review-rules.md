# Custom Coding Conventions & Review Rules

Please use the following rules to audit the codebase. If any CRITICAL rule is violated, mark it as `[BLOCKER]`.

## 1. Security & Secrets (CRITICAL)
- **Rule**: Never allow hardcoded API keys, authorization tokens, passwords, or credentials in any file.
- **Rule**: Reject any direct inline script execution without proper sanitation (XSS prevention).

## 2. React & Next.js Conventions
- **Rule**: Enforce proper React hook dependency arrays (`useEffect`, `useCallback`, `useMemo`).
- **Rule**: Enforce proper component hydration (avoid mismatching server/client output by checking `window` or local storage inside hydration-unsafe hooks).
- **Rule**: Avoid direct DOM manipulation (`document.getElementById`) where React `useRef` is more appropriate.

## 3. TypeScript Guidelines
- **Rule**: Avoid using the `any` type where explicit type definitions or Generics are achievable.
- **Rule**: Ensure all exported functions have explicit parameter types and return type annotations.

## 4. CSS & Layouts (Tailwind)
- **Rule**: Enforce mobile-first responsive layouts (use mobile-first utility classes, e.g., default styles are mobile and use `md:` or `lg:` for desktop).
- **Rule**: Ensure no text overflows or layout shifts occur on responsive screens.
