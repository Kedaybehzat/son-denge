import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// npm run build      -> dist/      (itch.io, GitHub Pages, Vercel için)
// npm run build:tek  -> dist-tek/  (her şey tek bir index.html içinde)
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: mode === 'tek' ? [viteSingleFile()] : [],
  build: { outDir: mode === 'tek' ? 'dist-tek' : 'dist' },
}));
