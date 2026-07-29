# mf-portal

Host shell in the `microfrontend-lab` micro frontend POC.

## Required reading

Before generating or modifying code, read:
- `../mf-registry/ARCHITECTURE.md` — system architecture, runtime discovery, federation config, shared deps
- `../mf-registry/SCAFFOLD.md` — conventions for remote apps (for context on what this host loads)

Source: https://github.com/microfrontend-lab/mf-registry

## This app

- Owns layout, navigation, top-level routing, design tokens
- Knows **zero** remotes at build time — fetches `registry.json` at boot (see `ARCHITECTURE.md` §5)
- Dev port: 3000
- Deployed to Firebase Hosting: `https://mf-portal.web.app` (exception to the GCS-bucket pattern other repos use — see `ARCHITECTURE.md` §11.1)
