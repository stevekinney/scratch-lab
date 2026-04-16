#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUILD_DIR = resolve(ROOT, 'dist');

loadDotEnv(resolve(ROOT, '.env'));

const BUCKET = process.env.S3_BUCKET;
const REGION = process.env.AWS_REGION ?? 'us-east-1';
const DISTRIBUTION_ID = process.env.CLOUDFRONT_DISTRIBUTION_ID;

if (!BUCKET) {
  console.error('Error: S3_BUCKET is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

run('npm', ['run', 'build'], { cwd: ROOT });

if (!existsSync(BUILD_DIR)) {
  console.error(`Error: build directory '${BUILD_DIR}' was not produced.`);
  process.exit(1);
}

console.log(`\nDeploying to s3://${BUCKET} from ${BUILD_DIR}...\n`);

// Hashed assets — immutable, long-lived cache.
console.log('Uploading hashed assets...');
run('aws', [
  's3', 'sync', resolve(BUILD_DIR, 'assets'), `s3://${BUCKET}/assets`,
  '--cache-control', 'public, max-age=31536000, immutable',
  '--region', REGION,
  '--delete',
]);

// index.html — short cache so new deploys show up quickly.
console.log('Uploading index.html...');
run('aws', [
  's3', 'cp', resolve(BUILD_DIR, 'index.html'), `s3://${BUCKET}/index.html`,
  '--cache-control', 'public, max-age=60',
  '--content-type', 'text/html',
  '--region', REGION,
]);

// Everything else (favicon, robots.txt, etc.) — default cache, prune removed files.
console.log('Uploading remaining files...');
run('aws', [
  's3', 'sync', BUILD_DIR, `s3://${BUCKET}`,
  '--exclude', 'assets/*',
  '--exclude', 'index.html',
  '--region', REGION,
  '--delete',
]);

if (DISTRIBUTION_ID) {
  console.log('Creating CloudFront invalidation...');
  run('aws', [
    'cloudfront', 'create-invalidation',
    '--distribution-id', DISTRIBUTION_ID,
    '--paths', '/*',
    '--region', REGION,
  ]);
}

console.log('\nDeploy complete.');

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (result.status !== 0) {
    console.error(`\n${cmd} ${args.join(' ')} exited with ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

function loadDotEnv(path) {
  if (!existsSync(path)) return;
  const lines = readFileSync(path, 'utf8').split('\n');
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}
