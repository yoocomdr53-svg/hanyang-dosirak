import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function buildServer() {
  console.log('[Build Server] Bundling server.ts with esbuild (ESM)...');
  await esbuild.build({
    entryPoints: [path.join(projectRoot, 'server.ts')],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm',
    outfile: path.join(projectRoot, 'dist-server', 'server.mjs'),
    packages: 'external',
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });
  console.log('[Build Server] Successfully bundled server into dist-server/server.mjs');
}

buildServer().catch((err) => {
  console.error('[Build Server] Error:', err);
  process.exit(1);
});
