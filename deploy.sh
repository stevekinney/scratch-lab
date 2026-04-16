#!/usr/bin/env bash
set -euo pipefail

# Configuration
BUCKET="my-frontend-app-assets"
DISTRIBUTION_ID="E1A2B3C4D5E6F7"
REGION="us-east-1"
BUILD_DIR="./build"

# Verify the build directory exists
if [ ! -d "$BUILD_DIR" ]; then
  echo "Error: Build directory '$BUILD_DIR' not found. Run your build command first."
  exit 1
fi

echo "Deploying to s3://$BUCKET from $BUILD_DIR..."

# Step 1: Sync hashed assets with long-lived cache headers
echo "Uploading hashed assets..."
aws s3 sync "$BUILD_DIR/assets" "s3://$BUCKET/assets" \
  --cache-control "public, max-age=31536000, immutable" \
  --region "$REGION" \
  --delete \
  --output json

# Step 2: Upload index.html with a short cache TTL
echo "Uploading index.html..."
aws s3 cp "$BUILD_DIR/index.html" "s3://$BUCKET/index.html" \
  --cache-control "public, max-age=60" \
  --content-type "text/html" \
  --region "$REGION" \
  --output json

# Step 3: Sync everything else (favicon, robots.txt, etc.) with default cache
echo "Uploading remaining files..."
aws s3 sync "$BUILD_DIR" "s3://$BUCKET" \
  --exclude "assets/*" \
  --exclude "index.html" \
  --region "$REGION" \
  --delete \
  --output json

# Step 4: Invalidate the CloudFront cache
echo "Creating CloudFront invalidation..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --region "$REGION" \
  --query 'Invalidation.Id' \
  --output text)
echo "Invalidation created: $INVALIDATION_ID"

echo "Deploy complete."
