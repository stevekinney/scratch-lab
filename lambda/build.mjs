import { build } from 'esbuild';
import { readdirSync } from 'node:fs';

const handlers = process.argv.slice(2);

// If no specific handler is given, build all of them.
const entryPoints =
  handlers.length > 0
    ? handlers.map((h) => `src/${h}.ts`)
    : readdirSync('src')
        .filter((f) => f.endsWith('.ts'))
        .map((f) => `src/${f}`);

await build({
  entryPoints,
  bundle: true,
  platform: 'node',
  target: 'node22',
  outdir: 'dist',
  format: 'cjs',
  external: ['@aws-sdk/*'],
  sourcemap: true,
  minify: false, // Keep readable for the course
});

console.log(`Built ${entryPoints.length} handler(s) to dist/`);
