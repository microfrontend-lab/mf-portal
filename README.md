# mf-portal

Host shell in the `microfrontend-lab` micro frontend POC. Owns layout,
navigation, top-level routing, and design tokens. Knows **zero** remotes at
build time — it discovers and loads them at runtime from `registry.json`.

See [`CLAUDE.md`](./CLAUDE.md) for the architecture docs this app must
conform to.

## Run standalone

Requires Node 24 (`.nvmrc`).

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. In dev, the portal reads `public/registry.json`,
which points at `todo-app` (`:3001`) and `chart-app` (`:3002`) on localhost —
start those apps separately (see their own READMEs) to see widgets load.
With no remotes running, the nav still renders and each route shows an error
card instead of crashing the shell.

## How discovery works

1. Boots and renders its own shell using its own React.
2. Fetches the registry from `REGISTRY_URL` (env var; falls back to
   `/registry.json` for local dev).
3. Validates every entry with `zod`. A malformed or unknown entry is skipped
   with a console warning — never a crash.
4. Registers each valid entry's `remoteEntry.js` with the Module Federation
   runtime and builds nav items + `<Route path="${route}/*">` entries from
   the registry.
5. On navigation into a widget's route, lazily loads that remote's exposed
   module, negotiates shared React/React DOM/React Router against this
   portal's own instances, and mounts it inside a `<Suspense>` boundary and
   an error boundary.

Adding a third app to the portal = appending one object to `registry.json`
and republishing it from `mf-registry`. This app is never rebuilt or
redeployed for that to work.

## Environment variables

| Variable | Purpose | Default |
|---|---|---|
| `REGISTRY_URL` | Where to fetch the runtime registry from | `/registry.json` (local dev) |

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Dev server on :3000 |
| `pnpm build` | Production build → `dist/` |
| `pnpm preview` | Serve `dist/` locally |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` / `lint:fix` | ESLint |
| `pnpm stylelint` | Stylelint on `*.module.css` |
| `pnpm test` | Vitest |

## Deploy

Deployed to **Firebase Hosting** (`https://mf-portal.web.app`), not a GCS
bucket like the other repos — see `ARCHITECTURE.md` §11.1 for why. Config
lives in `firebase.json` + `.firebaserc`; `{"source": "**", "destination":
"/index.html"}` gives deep links (e.g. `/apps/chart`) a working SPA fallback
on refresh, which GCS's own bucket-hosting mode never provided here.

`.github/workflows/deploy.yml` builds (with `REGISTRY_URL` pointed at the
production `mf-registry` bucket) and runs `firebase deploy --only hosting`
on push to `main`, via Workload Identity Federation — the deploying service
account needs `roles/firebasehosting.admin`.

To deploy manually: `pnpm build && pnpm exec firebase deploy --only hosting`.

### One-time provisioning

Not managed by OpenTofu (see `ARCHITECTURE.md` §11.1 for why) — these
commands were run once, by hand, to stand up the Hosting site and CI's
permission to deploy to it. Recorded here so the setup is reproducible
without re-deriving it:

```bash
# Enable Firebase on the existing GCP project (idempotent; safe to re-run)
npx firebase-tools projects:addfirebase module-federation-lab

# Create the named Hosting site — this is what gives the mf-portal.web.app
# URL instead of the project's auto-created default site
npx firebase-tools hosting:sites:create mf-portal --project module-federation-lab

# Grant the CI deploy service account permission to publish to Hosting,
# alongside its existing roles/storage.objectAdmin (needed by the other
# four repos' bucket deploys)
gcloud projects add-iam-policy-binding module-federation-lab \
  --member="serviceAccount:gh-actions-deploy@module-federation-lab.iam.gserviceaccount.com" \
  --role="roles/firebasehosting.admin" \
  --condition=None
```

Local `pnpm exec firebase` commands authenticate via whatever Google
credentials are already active in the shell (`gcloud auth
application-default login` or an existing `firebase login`) — no separate
login step was needed here since `gcloud` was already authenticated.

One local-only step, unrelated to Firebase itself: `firebase-tools` pulls in
`protobufjs`, which has a postinstall script pnpm blocks by default. Run
`pnpm approve-builds protobufjs` once after `pnpm install` if you see an
`ERR_PNPM_IGNORED_BUILDS` warning.
