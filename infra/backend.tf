terraform {
  backend "gcs" {
    bucket = "module-federation-lab-tfstate"
    prefix = "mf-portal"
  }
}
