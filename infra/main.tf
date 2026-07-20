terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}

provider "google" {
  project = var.project_id
}

# No CORS block: the browser loads this bucket's assets same-origin (the
# user navigates directly to the portal). Cross-origin fetches only happen
# the other way — the portal fetching registry.json and remoteEntry.js from
# other buckets, which is those buckets' CORS concern, not this one's.
resource "google_storage_bucket" "app" {
  name                        = "mf-portal"
  location                    = var.region
  uniform_bucket_level_access = true
  force_destroy               = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }
}

resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.app.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}
