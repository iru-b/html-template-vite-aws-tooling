# Digital Business Card

This repository contains the web representation of the founder **Ingo Ruck** and the associated professional network.

---

# 🧱 Tech Stack

- Frontend build tool: :contentReference[oaicite:0]{index=0}  
- Package manager: pnpm  
- Code quality: Biome (lint + format)  
- Infrastructure: AWS CDK  
- Hosting: AWS S3 + CloudFront  
- CI/CD: GitHub Actions  

---

# 🏗 Architecture Overview

## High-level structure

- `app/` → frontend application (Vite)
- `infra/` → infrastructure as code (AWS CDK)

---

# ☁️ Infrastructure Setup

The infrastructure is provisioned using AWS CDK and must be bootstrapped once per AWS account/region.

## 1. Prerequisites

- Node.js installed
- pnpm installed
- AWS CLI configured
- AWS account with IAM permissions

---

## 2. Create Deployment User (one-time setup)

In AWS Console:

1. Go to **IAM → Users → Create user**
2. Enable **programmatic access (CLI)**
3. Attach the IAM policy after running `pnpm run deploy`
4. Create **Access Key** for user and set action secrets to the repository: with names: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY

---

## 3. Build and deploy infrastructure

Before deploying, verify configuration values:

`infra/config.ts`

Make sure all AWS-related settings match your environment.

---

### Install and deploy infrastructure

```bash
cd infra
pnpm install
pnpm run build

# one-time per AWS account/region
cdk bootstrap aws://{aws-account-id}/eu-north-1

# deploy infrastructure
pnpm run deploy
```

---

## 4. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

| Key | Value | Description |
|-----|------|-------------|
| AWS_ACCESS_KEY_ID | access key | IAM deployment user |
| AWS_SECRET_ACCESS_KEY | secret key | IAM deployment user |
| AWS_REGION | e.g. `eu-north-1` | AWS deployment region |
| AWS_BUCKET_NAME | bucket name | from CDK output |
| CLOUDFRONT_DISTRIBUTION_ID | distribution id | from CDK output |

---

## 5. Destroy infrastructure (only if needed)

If you need to fully reset the infrastructure:

### Step 1 — detach IAM policies (manual step)

In AWS Console:
- Go to IAM → Users
- Find the deployment user
- Detach the dynamically created CDK-managed IAM policy

---

### Step 2 — destroy infrastructure

```bash
cd infra
pnpm run destroy
```

---

## 6. CI / CD

### CI (Continuous Integration)

CI runs on every push and pull request to any branch.

It performs:
- linting (Biome)
- dependency checks
- build validation

CI ensures that the codebase is always in a deployable state.

---

### CD (Continuous Deployment)

CD runs only after a successful CI run on the `main` branch.

It performs:
- deployment of the build artifact
- upload to AWS S3
- CloudFront cache invalidation

CD ensures that only validated and production-ready changes are deployed.
