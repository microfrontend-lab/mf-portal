terraform {
  backend "gcs" {
    bucket = "mf-tfstate"
    prefix = "mf-portal"
  }
}
