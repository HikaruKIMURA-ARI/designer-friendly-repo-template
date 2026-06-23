# design-sync NOTES — design-work

Storybook shape. **8 storied components, 24 stories total:**
- `shared/ui` (group `ui`): Button (5 — Primary/Danger/Ghost/**Outline**/Disabled), Checkbox (2), TextInput (2)
- `features/todos` (group `todos`): TodoForm (2), TodoItem (2), TodoList (2), TodoDetailView (6)
- page View (group `pages`): TodoPageView (3)

React 19, Tailwind v4, Storybook `@storybook/nextjs-vite`.
This repo IS the DS's own source repo (a Next.js app) — there is no published `dist/`, so the bundle is
built directly from `cfg.entry = .design-sync/ds-entry.ts` (a hand-written re-export barrel). `--node-modules`
is the repo-root `node_modules` (has react/react-dom).

**Scope = ALL storied components, including page/feature Views** (user directive 2026-06-22: "常に全部追加で
いいです"). When a new `*.stories.tsx` appears, add its export to `ds-entry.ts`. If the story title's leaf
≠ the export name, add a `cfg.titleMap` entry — e.g. TodoPageView's title is `pages/Todo` (leaf `Todo`),
so `titleMap: {"Todo": "TodoPageView"}`. TodoDetailView's title leaf `TodoDetailView` matches its export,
no map needed.

## Build learnings

- `[GENERAL]` **CSS comes from the storybook build, not a dist sidecar.** No `_ds_bundle.css` exists in
  source (Tailwind v4 is compiled by Next at app-build time). The converter's `[CSS_FROM_STORYBOOK]`
  catch-all scrapes the compiled CSS out of `.design-sync/sb-reference`.
  → Consequence: `.design-sync/sb-reference` MUST be rebuilt (`buildCmd`) whenever components or
  `shared/styles/globals.css` change, BEFORE the driver — otherwise the shipped CSS is stale or misses
  utilities a new component uses. The §7 driver flow already rebuilds it; don't skip it.
- `[GENERAL]` **Tailwind v4 emits only utilities actually used.** The static `_ds_bundle.css` (now ~14KB)
  contains exactly the classes the 8 components reference (+ theme vars in `:root`). Utilities no component
  uses are absent. The design agent gets this static CSS (Tailwind is not re-run at design time), so only
  pre-compiled utilities + `var(--*)` tokens resolve. This drives conventions.md.
  → 2026-06-22: TodoDetailView introduced `rounded-card`/`rounded-lg`/`rounded-xl` (radius tokens now have
  utilities), `min-h-screen`, `grid`+`grid-cols-[…]`, `flex-wrap`, `self-start`, `resize-y`, and arbitrary
  values (`bg-[#ffb020]`, `max-w-[1120px]`, `border-danger/45`). conventions.md was corrected — the prior
  "`rounded-card` is NOT in the CSS" claim is now false because TodoDetailView uses it.
- `[GENERAL]` **The `.storybook/preview` decorator does NOT bundle** — `! preview decorator bundle failed:
  Could not resolve "tailwindcss"` (the decorator imports `globals.css`, which has Tailwind v4's
  `@import "tailwindcss"` that esbuild can't resolve). So previews are NOT wrapped in the storybook
  decorator's `min-h-screen bg-surface-muted` dark surface — **preview cards frame on white** while the
  storybook reference frames on the DS dark surface. This is a DARK-themed DS. Consequence: components that
  carry their own surface (TodoForm/List/Item, TodoDetailView's `min-h-screen bg-surface`, filled Buttons)
  look correct on white; **transparent Button variants (ghost/outline) and bare `text-foreground` text
  (e.g. TodoPageView's `<h1>`) wash out on the white card** — but are faithful on the app's `bg-surface`.
  Graded `match` per the §4 framing rubric ("judge the component, not its surroundings"). Documented in
  conventions.md's dark-theme note. `cfg.provider` is NOT set: it requires a bundle-exported wrapper
  component (the decorator is a plain `<div>`), and switching it would clear all 8 grades for a cosmetic
  card-only gain. Leave unset unless a future need justifies the full re-grade.
- No custom fonts — theme `--font-sans` is the default system stack; no `[FONT_MISSING]`.

## Component-specific

- `Checkbox`: validate flags `[RENDER_THIN]` ("mounts paint nothing"). Benign — it's a 20px native
  checkbox that legitimately paints little; renders identically to storybook on both Unchecked/Checked.
  Do NOT author an owned preview to "fix" the thinness — that would diverge from the real component.
- `TodoDetailView`: 6 stories. Image-judged primary (`In Progress`) `match`; the other 5
  (Completed/MediumPriority/LowPriority/WithoutMeta/Deleted) are `sibling-trusted` (pure, warning-free,
  same pipeline). If a future change adds portals/overlays or theme sensitivity, grade exhaustively.

## Re-sync risks (watch-list for the next run)

- **Stale sb-reference → stale/missing CSS.** The single biggest risk. Rebuild sb-reference whenever
  source changed; `[REFERENCE_STALE?]` in the capture log means you forgot.
- **New utility classes.** A new component using a not-previously-compiled utility only reaches the shipped
  CSS via a fresh sb-reference build. Re-grade any component whose story changed.
- **Anchor healthy as of 2026-06-22.** The project carries `_ds_sync.json` (8 render hashes + sourceKeys,
  `keyRecipe: 7`); re-syncs run with `--remote`. The 2026-06-22 run: Button `changed` (Outline variant
  added), TodoPageView + TodoDetailView `added`, the other 5 `verified-by-upload` (skipped). All graded
  `match`. The closing receipt carried all 3 forward (0 captured) — next sync stays fast.
- **White-framing is expected, not a regression.** ghost/outline Buttons and `text-foreground` headings
  look faint on the white preview card (see decorator learning). Don't "fix" it per-component.
- **User-authored project content is preserved.** The remote project also holds `templates/`
  (neon-theme, todo-detail), `_ds_manifest.json`, `Canvas.dc.html`, `support.js` etc. — designs built in
  the Claude Design tool. The anchored diff's `deletePaths` was empty; never hand-add deletes that would
  remove these.
- **Recovery note (historical):** transient `*.log` files under `.design-sync/` were untracked in commit
  bb01efe; keep build logs out of git.
