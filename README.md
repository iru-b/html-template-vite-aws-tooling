# HTML Template

This repository provides a **production-ready HTML frontend template** together with **infrastructure as code for AWS deployment**.

It is designed as a starting point for building static or SPA-style web applications using a modern frontend toolchain.

---

# 🧱 Tech Stack

- Frontend build tool: Vite
- Package manager: pnpm  
- Code quality: Biome (lint + format)  
- Infrastructure: AWS CDK  
- Hosting: AWS S3 + CloudFront  
- CI/CD: GitHub Actions

---

## 🏗 Purpose of this repository

This template intentionally **does not enforce application-level architecture decisions**.

You are expected to define and extend the application layer based on your project needs, such as:

- React or other frontend framework selection
- TypeScript integration
- Testing strategy (unit / E2E)
- Environment variable handling
- API integration patterns
- State management approach

---

## ⚙️ Design philosophy

This repository focuses on:

- Clean and minimal baseline setup
- Reproducible infrastructure deployment
- Consistent developer tooling
- CI/CD-first workflow
- Easy extensibility for production use

---

 ## 🚀 Next steps

When using this template, you should define your application architecture early, including:

- Framework choice (if any)
- Folder structure conventions
- Runtime configuration strategy
- Testing and quality gates
- Deployment environments (staging / production) 

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

---

## 7. Getting Started

### 1. Setup root-level tooling

Install the shared repository tooling and Git hooks:

```bash
pnpm install
pnpm run prepare
```

---

### 2. Setup infrastructure

Follow the instructions in the **Infrastructure Setup** section above to deply the infrastructure and configure GitHub Secrets.

---

### 3. Start the frontend application

```bash
cd app
pnpm install
pnpm run dev
```

The Vite development server will start locally.
