# Module Federation PoC — Vue + Vite, runtime-resolved remote

Validates: dynamic (runtime) remote URL registration with `@module-federation/vite`,
and whether static vs dynamic import syntax works for consuming exposed modules.

## Structure
```
mf-poc/
├── remote/     Vue app exposing a component + a Pinia store
└── host/       Vue app that registers the remote's URL at runtime, then consumes it
```

## Setup
```bash
cd remote && npm install
cd ../host && npm install
```

## Phase 1 — verify remote standalone (do this first)
```bash
cd remote
npm run build
npm run serve     # serves dist/ on :5001
```
Open http://localhost:5001/remoteEntry.js — must return real JS, not a 404,
before you touch the host at all.

## Phase 2 — run host against the live remote
Remote must already be running (previous step) on :5001.
```bash
cd host
npm install
npm run dev        # :3000, dev mode
# or, for a production-parity check:
npm run build && npm run serve   # :3000, static build
```
Open http://localhost:3000.

`host/public/runtime-config.json` is what tells the host where the remote
lives — it is NOT baked into `host/module-federation.config.ts` (that file's
`remotes` is intentionally empty). Edit that JSON file and reload to prove
the URL really is resolved at runtime, not build time.

## What to check (see App.vue for the numbered tests in the UI)

1. **Dynamic import** (`defineAsyncComponent(() => import('remoteApp/ExposedButton'))`)
   — expected to work; this is the confirmed pattern.
2. **Static import** (commented out in `host/src/App.vue` — uncomment to test)
   — unconfirmed claim from the original design doc. Record what actually happens.
3. **Shared Pinia store singleton** — click increment on both the host's and
   the remote's buttons, confirm the count is shared, not duplicated.
4. **Kill the remote** while host is running, reload host — record the failure mode.
5. **Double bootstrap** — run `window.__mfPocRebootstrap()` in devtools console
   on the host page, confirm it warns/no-ops instead of double-registering.
6. **Version mismatch** — bump `vue` version in one app's `package.json`,
   reinstall, rebuild, reload — confirm `singleton: true` fails loudly or
   silently picks a version.

## Deployment (Phase 4)
Deploy `remote/dist` and `host/dist` to two **separate origins** (not the
same domain/subpath) — same-origin deploys don't test the actual
cross-origin scenario this pattern exists for.

After deploying the remote, update `host/public/runtime-config.json` (or
better: serve it from a small edge function) with the live remote URL and
redeploy *only that file* — not the host's JS bundle. That's the actual
point being validated: changing the remote's location shouldn't require
rebuilding the host.

Checklist once both are live on separate origins:
- CORS headers on the remote's `remoteEntry.js` and chunks allow the host's origin
- Both origins are HTTPS (mixed content silently blocks the fetch otherwise)
- CSP `connect-src`/`script-src` on either app allow the other's origin
- `remoteEntry.js` is NOT aggressively cached / hash-named, or redeploys won't be picked up
- Re-run tests 1–6 above against the deployed URLs, not just localhost —
  dev server and production Rollup output can behave differently for
  federation-rewritten imports.

## Known open questions this PoC exists to answer
- Does literal static import syntax actually work, or only dynamic `import()`?
- Is `singleton: true` enforced, or silently ignored on mismatch?
- Does dts/type generation work on your pinned `@module-federation/vite`
  version, or do you need the hand-written `src/remotes.d.ts` long-term?
  (Community reports on this are contradictory — test against your version.)
