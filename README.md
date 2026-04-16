# Scratch Lab

Scratch Lab is the example application and companion repository for the [AWS for Frontend Engineers](https://stevekinney.com/courses/aws) course. It's a simple React + TypeScript notepad app built with Vite that you'll deploy to AWS throughout the course.

## What's in This Repository

### The Application

The core application is a notes app that lives in `src/`. You'll use it as the frontend that connects to the AWS backend you build during the course.

```bash
npm install
npm run dev
```

### Static Site Files (`playground/`)

The `playground/build/` directory contains a minimal static site (HTML, CSS, JavaScript) used in the early S3 lessons. You'll upload these files to S3 to practice bucket creation, static website hosting, and deployment.

- `playground/build/index.html` — Main page
- `playground/build/styles.css` — Stylesheet
- `playground/build/app.js` — JavaScript
- `playground/build/error.html` — Custom 404 page

### IAM and Bucket Policies (`policies/`)

Every policy document from the course is available as a standalone JSON file so you don't have to copy them out of code blocks.

**Bucket Policies** (`policies/bucket-policies/`)

| File | Used In |
| --- | --- |
| `public-read.json` | Bucket Policies and Public Access |
| `public-read-restrictive.json` | Bucket Policies and Public Access |
| `cloudfront-oac.json` | Origin Access Control for S3, CloudFront Distribution |

**IAM Policies** (`policies/iam-policies/`)

| File | Used In |
| --- | --- |
| `s3-read-only.json` | Writing Your First IAM Policy |
| `deploy-permissions.json` | Writing Your First IAM Policy |
| `deploy-bot-policy.json` | IAM Policy for a Deploy Bot (solution) |
| `deploy-bot-policy-with-deny.json` | IAM Policy for a Deploy Bot (stretch goal) |
| `region-restricted.json` | Writing Your First IAM Policy |
| `lambda-trust-policy.json` | Lambda Execution Roles and Permissions |
| `lambda-s3-read.json` | Lambda Execution Roles and Permissions |
| `lambda-dynamodb.json` | Connecting DynamoDB to Lambda |
| `lambda-dynamodb-with-update.json` | DynamoDB Lambda (stretch goal with UpdateItem) |
| `parameter-store.json` | Secrets in Lambda |
| `parameter-store-by-path.json` | Secrets in Lambda (stretch goal) |
| `scratch-lab-api.json` | End-to-End Scratch Lab API (capstone) |
| `github-actions-trust-policy.json` | CI/CD with GitHub Actions |

**S3 Lifecycle Configuration** (`policies/`)

| File | Used In |
| --- | --- |
| `s3-lifecycle.json` | S3 Static Site (stretch goal) |

### Lambda Handlers (`lambda/`)

Complete TypeScript Lambda handlers for every exercise in the course.

| File | Used In |
| --- | --- |
| `src/greeting-handler.ts` | Build and Deploy a Lambda Function |
| `src/items-handler.ts` | API Gateway and Lambda |
| `src/dynamodb-handler.ts` | DynamoDB CRUD API |
| `src/secrets-handler.ts` | Secrets in Lambda |
| `src/scratch-lab-handler.ts` | End-to-End Scratch Lab API (capstone) |

**Test Events** (`lambda/test-events/`)

JSON payloads for testing Lambda functions with `aws lambda invoke`:

- `greeting.json` / `greeting-no-name.json` — Greeting handler tests
- `dynamodb-create.json` / `dynamodb-list.json` / `dynamodb-delete.json` — DynamoDB handler tests

### CloudFront Functions (`cloudfront/`)

Edge functions and the distribution configuration used in the CloudFront section.

| File | Used In |
| --- | --- |
| `functions/security-headers.js` | CloudFront Function exercise |
| `functions/security-headers-with-csp.js` | CloudFront Function (stretch goal) |
| `functions/legacy-redirect.js` | CloudFront Function exercise |
| `functions/redirect-map.js` | CloudFront Function (stretch goal) |
| `functions/url-rewrite.js` | Writing a CloudFront Function |
| `distribution-config.json` | CloudFront Distribution exercise |

### Deploy Scripts

| File | Used In |
| --- | --- |
| `deploy.sh` | Automating Deploys with the AWS CLI |
| `.github/workflows/deploy.yml` | CI/CD with GitHub Actions |

## Placeholder Values

The policy files and configs use placeholder values that you'll need to replace with your own:

- `my-frontend-app-assets` — Your S3 bucket name
- `123456789012` — Your AWS account ID
- `E1A2B3C4D5E6F7` — Your CloudFront distribution ID
- `E1OAC2EXAMPLE` — Your Origin Access Control ID
- `your-org/your-repo` — Your GitHub organization and repository

## Course

This repository is part of the [AWS for Frontend Engineers](https://stevekinney.com/courses/aws) course. The course covers deploying and managing frontend applications on AWS, from S3 static hosting through CloudFront, Lambda, API Gateway, DynamoDB, and CI/CD with GitHub Actions.
