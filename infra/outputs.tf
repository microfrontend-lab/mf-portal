output "bucket_url" {
  value = "https://storage.googleapis.com/${google_storage_bucket.app.name}/index.html"
}
