import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// public/assets/ içindeki dosyaların listesi -> 'virtual:asset-listesi' modülü.
// Oyun yalnızca gerçekten var olan görselleri yükler (eksik dosya için 404 olmaz).
// Dev sunucusunda klasöre dosya eklenip silinince sayfa kendiliğinden yenilenir.
function assetListesi() {
  const ID = 'virtual:asset-listesi';
  const RID = '\0' + ID;
  const kok = path.resolve('public/assets');
  const tara = () => {
    const dosyalar = [];
    const gez = (klasor, onek) => {
      if (!fs.existsSync(klasor)) return;
      for (const f of fs.readdirSync(klasor, { withFileTypes: true })) {
        if (f.name.startsWith('.')) continue;
        if (f.isDirectory()) gez(path.join(klasor, f.name), `${onek}${f.name}/`);
        else dosyalar.push(onek + f.name);
      }
    };
    gez(kok, '');
    return dosyalar;
  };
  return {
    name: 'asset-listesi',
    resolveId: (id) => (id === ID ? RID : null),
    load: (id) => (id === RID ? `export default ${JSON.stringify(tara())};` : null),
    configureServer(server) {
      server.watcher.add(kok);
      const yenile = (f) => {
        if (!path.resolve(f).startsWith(kok)) return;
        const m = server.moduleGraph.getModuleById(RID);
        if (m) server.moduleGraph.invalidateModule(m);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', yenile);
      server.watcher.on('unlink', yenile);
    },
  };
}

// npm run build      -> dist/      (itch.io, GitHub Pages, Vercel için)
// npm run build:tek  -> dist-tek/  (her şey tek bir index.html içinde)
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [assetListesi(), ...(mode === 'tek' ? [viteSingleFile()] : [])],
  build: { outDir: mode === 'tek' ? 'dist-tek' : 'dist' },
}));
