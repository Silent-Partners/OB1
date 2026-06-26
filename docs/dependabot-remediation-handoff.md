# Dependabot Remediation Handoff — Silent-Partners/OB1

**Created:** 2026-06-25 · **Status:** open · **Alerts:** 38 open (1 critical · 17 high · 14 medium · 6 low)
**Live alert list:** https://github.com/Silent-Partners/OB1/security/dependabot

This is a self-contained handoff to clear the 38 open Dependabot alerts. It can be
executed by a teammate or a fresh agent session with no prior context. Work is
grouped by manifest; each group is an independent PR.

---

## TL;DR — the 38 collapse into ~5 actions

| # | Action | Manifest | Clears |
|---|--------|----------|--------|
| 1 | Bump **`next`** `16.2.1` → latest `16.2.x` (≥ **16.2.6**) | `dashboards/open-brain-dashboard-next` | 16 high + 6 low (and several mediums via transitive) |
| 2 | `npm audit fix` to patch transitive **picomatch** (→2.3.2), **postcss** (→8.5.10) | `dashboards/open-brain-dashboard-next` | 3 medium |
| 3 | Patch **`shell-quote`** → `1.8.4` (**CRITICAL**) + **vite**→7.3.5, **ws**→8.21.0, **qs**→6.15.2, **esbuild**→0.28.1 | `recipes/repo-learning-coach` | 1 critical + 2 high + 4 medium/low |
| 4 | Bump **`ai`** → `^5.0.52` | `recipes/vercel-neon-telegram` | 1 low |
| 5 | Re-scan & confirm 0 open | repo-wide | — |

> **The single most important fix is #1.** It is a patch-level Next.js bump that
> closes a cluster including an **SSRF in Next's WebSocket upgrade handling**,
> multiple **middleware/proxy-bypass** advisories, and several **DoS** vectors —
> on the dashboard we just shipped to `brain.silent.partners`. Prioritize it.

---

## Affected manifests (where the 38 live)

| Manifest | npm alerts |
|----------|-----------|
| `dashboards/open-brain-dashboard-next/package.json` + `package-lock.json` | 30 (next ×most, picomatch, postcss) |
| `recipes/repo-learning-coach/package-lock.json` | 7 (shell-quote ⚠, vite, ws, qs, esbuild) |
| `recipes/vercel-neon-telegram/package.json` | 1 (ai) |

All are npm. No other ecosystems.

---

## Action 1 — Dashboard: bump Next.js (highest priority)

Current: `next@16.2.1`. Target: latest `16.2.x` (≥ `16.2.6`). This is a **patch**
bump within the same minor — low risk, no codemods expected.

Advisories cleared (all `>= 16.0.0, < 16.2.6`):
- **SSRF** in apps using WebSocket upgrades (high)
- Middleware/Proxy bypass — App Router segment-prefetch (high, incl. follow-up fix in 16.2.6)
- Middleware/Proxy bypass — Pages Router i18n (high)
- Middleware/Proxy bypass — dynamic route parameter injection (high)
- DoS via Server Components (high)
- DoS via connection exhaustion with Cache Components (high)
- 6 × low Next advisories

```bash
cd dashboards/open-brain-dashboard-next
npm install next@^16.2.6           # also bump eslint-config-next to match
npm install -D eslint-config-next@^16.2.6
npx tsc --noEmit                    # must stay 0 errors (ignoreBuildErrors was removed)
npm run build                       # must stay green
```

> ⚠ **Verify in production after deploy.** This project does **not** auto-deploy
> on push — production ships via an explicit `vercel deploy --prod --yes` from
> `dashboards/open-brain-dashboard-next` (see the deploy note at the bottom).
> The dashboard relies on Middleware (`middleware.ts`) for auth, so smoke-test
> `/login` (200) and `/` (307 → login) on the preview before promoting.

## Action 2 — Dashboard: transitive (picomatch, postcss)

These come in through the build toolchain (tailwind/postcss + next). After Action 1:

```bash
cd dashboards/open-brain-dashboard-next
npm audit fix          # pulls picomatch ≥2.3.2, postcss ≥8.5.10
npm audit              # confirm 0 remaining
```

If `npm audit fix` can't reach them (peer pinning), add to `package.json`:

```jsonc
"overrides": { "picomatch": "^2.3.2", "postcss": "^8.5.10" }
```
then `npm install` and re-`npm audit`.

## Action 3 — recipes/repo-learning-coach (incl. the only CRITICAL)

All transitive (lockfile only). Fixes: `shell-quote`→1.8.4 (**critical**: `quote()`
fails to escape newlines), `vite`→7.3.5, `ws`→8.21.0, `qs`→6.15.2, `esbuild`→0.28.1.

```bash
cd recipes/repo-learning-coach
npm audit fix
npm audit            # if shell-quote/esbuild persist, force or override:
# npm audit fix --force        # may bump a major — review the diff
# or in package.json: "overrides": { "shell-quote": "^1.8.4", "esbuild": "^0.28.1" }
```
Re-run whatever build/test this recipe defines (check its `package.json` scripts).

## Action 4 — recipes/vercel-neon-telegram

`ai` is a **direct** dependency (low severity).

```bash
cd recipes/vercel-neon-telegram
npm install ai@^5.0.52
```

## Action 5 — Verify repo-wide

```bash
gh api 'repos/Silent-Partners/OB1/dependabot/alerts?state=open&per_page=100' -q 'length'
# expect: 0  (or only accepted/won't-fix exceptions, documented below)
```

---

## How to ship (repo conventions)

Per `CONTRIBUTING.md` / `CLAUDE.md`:
- One PR per manifest group, branch `contrib/<github-username>/deps-<area>`.
- PR title `[category] …`, e.g. `[dashboards] Bump Next.js to 16.2.6 (security)`,
  `[recipes] Patch shell-quote/vite/ws (security)`.
- Each PR must pass `ob1-gate.yml` + CodeQL + an approval (branch protection on `main`).
- Dashboard PR also needs the explicit prod deploy after merge (no git auto-deploy).

Suggested order: **Action 1 first** (ship + deploy the dashboard Next bump on its
own — highest impact, isolated), then 2, then the recipes (3, 4) together.

---

## Notes / cautions

- The `js/request-forgery` finding we already fixed in `lib/api.ts` (`safeId`) is
  **separate** from the Next SSRF advisory; Action 1 closes the framework-level one.
- `npm audit fix --force` can introduce major bumps — always review the resulting
  `package.json`/lock diff and re-run the build before committing.
- If any alert is intentionally deferred (e.g., a recipe that's archived), dismiss
  it in the GitHub UI with a reason and record it here so the count reconciles.
- Production deploy mechanism for the dashboard (for whoever ships Action 1):
  `cd dashboards/open-brain-dashboard-next && vercel deploy --prod --yes`
  (project `open-brain-dashboard`, team `silentpartners`; aliased to
  `brain.silent.partners`).
