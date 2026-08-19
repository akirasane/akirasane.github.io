# TODO — Fixes from project audit (2026-08-19)

Source: full-project audit (Opus). Items grouped by severity, each with file:line and suggested fix.

## Critical

- [ ] **Contact form always fails.** `config.json` → `contact.formEndpoint` is `""`. `ContactSection.tsx:181` POSTs to it, gets a non-OK response from the static host, throws at `:186`, and the UI always shows the error state.
  - Fix: set a real form endpoint (Formspree/Getform/etc.) in `config.json`, or fall back to a `mailto:` link when `formEndpoint` is empty.

- [ ] **Page renders no crawlable content — SEO fix is incomplete.** `app/page.tsx:5` uses `dynamic(() => import('@/components/HomeClient'), { ssr: false })`, so the exported static HTML has an empty body; all content arrives via client-side `fetch('/config.json')` (`lib/store.ts:19`). The only `<h1>` (`HeroSection.tsx:69-73`) stays empty/`opacity-0` until a glitch animation completes.
  - Fix: enable SSR for `HomeClient` (or statically import the config data at build time) so the exported HTML has real heading/content markup.

- [ ] **`npm run lint` fails: 35 errors, 26 warnings.**
  - `CertificationsSection.tsx:43` — `Date.now()` called during render (`react-hooks/purity`).
  - `SoftAurora.tsx:188,189` — `prefer-const`.
  - `lib/commands.tsx:83,427,485,486,1312`, `lib/pdf.ts:90` — `no-explicit-any`.
  - `lib/commands.tsx:46,711,1283` — `react/no-unescaped-entities`.
  - `lib/commands.tsx:544` — missing `steps` in `exhaustive-deps`.
  - Fix: resolve each, then keep `npm run lint` green going forward.

## Moderate

- [ ] **About section content fully hidden on mobile.** `AboutSection.tsx:230` wraps bio, all social links, and both resume buttons in `hidden md:flex`. Contradicts the "mobile responsive fixes" commit.
  - Fix: make the block responsive instead of hidden below `md`.

- [ ] **Custom hook (`useIsMobile`) defined inside `AboutSection` component body** (`AboutSection.tsx:170-183`). Move to module scope or a shared `hooks/` file; redundant with existing `md:` breakpoints.

- [ ] **AI code-review GitHub workflow is broken.** `.github/workflows/code-review.yml` is `workflow_dispatch`-only but references PR context (`:19` diff against `origin/${{ github.base_ref }}`, `:26` `PR_NUMBER`) that doesn't exist on manual dispatch → `ai-review.js:62` throws.
  - Fix: either wire it to `pull_request` trigger properly, or remove/park the workflow until it's finished.

- [ ] **Self-hosted LLM hostname hardcoded** in `.github/scripts/ai-review.js:113,150` (`llmapi.omelettesalmon.com`), same domain as the public profile link in `config.json:13`. Move to a repo secret/variable instead of hardcoding.

- [ ] **Rotate/verify the old admin password isn't live anywhere.** History shows `NEXT_PUBLIC_ADMIN_PASSWORD` was inlined into public JS in past builds (before `d8072ff` removed it from `deploy.yml`). No literal value found in current history/bundle, but treat any password used there as burned — rotate if it's reused elsewhere.

- [ ] **Remove dead code / unused deps** to cut bundle size (currently 5.2MB, largest chunk 418KB):
  - `lib/validation.ts` — zero callers, delete.
  - `lib/defaults.ts:3` `STORAGE_KEY` — unused; `localStorage['portfolio_data']` in `lib/store.ts:28,33` is written but never read — remove or wire up properly.
  - Unused components: `GlassIcons`, `LetterGlitch`, `Particles`, `PixelBlast` (700 lines), `SoftAurora`, `SplitText`.
  - Unused deps in `package.json`: `class-variance-authority`, `lucide-react`, `radix-ui`, `react-icons`, `postprocessing`.
  - `components.json:12` points `ui` at `@/components/ui`, which doesn't exist — fix or remove.
  - `AboutSection.tsx:123` imports `FloatingLines` (three.js) but only usage (`:194-204`) is commented out — remove import or restore usage.
  - Empty `scripts/` directory left over from `d8072ff` — remove.

- [ ] **Wire up or remove test infrastructure.** `vitest.config.ts`/`vitest.setup.ts` + devDeps are installed, but there's no `test` script in `package.json`, no test files, and `.gitignore:38` excludes `__tests__/` so tests could never be committed as-is.

## Minor / nitpicks

- [ ] Rewrite `README.md` — currently untouched `create-next-app` boilerplate referencing Vercel, but the site deploys to GitHub Pages.
- [ ] Remove dead dark-mode CSS in `globals.css` (`:5`, `.dark` block `:198-230`) — never activates since `layout.tsx:59` hardcodes `data-theme="dark"` and nothing applies `.dark`.
- [ ] Remove unreachable `[data-theme="light"]` block (`globals.css:61-70`) or wire up the terminal's theme toggle (`HomeClient.tsx:180`) to actually set it.
- [ ] Convert desktop-first media queries (`globals.css:118`, `@media (max-width: 768px)`) to mobile-first, per the project's own `ai-review-rules.md:19`.
- [ ] Trim fabricated fallback data in `lib/defaults.ts` (fake AWS cert at `:110`, placeholder projects, `your.email@example.com`) — this renders if `config.json` fetch fails transiently.
- [ ] `config.json:275` phone is masked (`+6694xxxx515`) but `ContactSection.tsx:356` renders it as if real — decide whether to unmask or drop the field from display.
- [ ] `lib/commands.tsx:83` — drop unnecessary `as any` cast; `twitter` is already declared on `Profile['social']` (`lib/types.ts:22`).
- [ ] Add explicit return types to exported functions in `lib/utils.ts:4,14` per `ai-review-rules.md:16`.
- [ ] `ProjectsSection.tsx:305` — move `<style dangerouslySetInnerHTML>` scrollbar hiding into a CSS class instead of re-injecting on every render.
- [ ] `app/sitemap.ts:9` — `lastModified: new Date()` churns `lastmod` on every deploy while `changeFrequency` claims monthly; use actual content update time.
- [ ] Remove or fill `.vscode/settings.json` (currently just `{}`).
- [ ] `app/layout.tsx:19` meta description is identical to the placeholder bio in `defaults.ts:9` — write a distinct one.

## Housekeeping (untracked files)

- [ ] The AI-code-review coursework docs (IRIS BOI Course 7 materials) that were sitting untracked in repo root should live outside this repo — they document private infra (self-hosted LLM tunnel, port, auth scheme) and are already stale relative to `d8072ff`. If they reappear, move them to a separate folder and add a `.gitignore` entry (e.g. `*-ai-code-review*.md`, `*.pptx.txt`).
- [ ] Keep `ai-review-rules.md` tracked — it's read at runtime by `.github/scripts/ai-review.js` — but bring the codebase into compliance with it (see mobile-first and `any`-usage items above).
