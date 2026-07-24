# mf-portal infra

OpenTofu for the `gs://mf-portal` bucket only.

```bash
cp terraform.tfvars.example terraform.tfvars
# edit terraform.tfvars
tofu init
tofu plan
tofu apply
```

Remote state lives in `gs://module-federation-lab-tfstate` under the `mf-portal` prefix.

No CORS configuration here — the portal's own assets are always loaded
same-origin. CORS matters on the *other* buckets this portal fetches
cross-origin from at runtime: `mf-registry` (for `registry.json`) and every
remote bucket (for `remoteEntry.js` and CSS chunks). See those repos'
`infra/README.md` for that half of the story.
