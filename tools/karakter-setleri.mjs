// Karakter setlerini denetler. node tools/karakter-setleri.mjs --kontrol
import fs from 'node:fs';
import crypto from 'node:crypto';
import { KURUCULAR, ZIYARETCILER } from '../src/data/visitors.js';
import { ASSETLER, sakinGorselTanimi } from '../src/data/assets.js';
import { ANIMASYONLAR } from '../src/data/animations.js';
const kok = new URL('../public/assets/', import.meta.url);
const varMi = (f) => fs.existsSync(new URL(f, kok));
const korunan = JSON.parse(fs.readFileSync(new URL('../docs/korunan-assetler.json', import.meta.url)));
let hata = 0;
for (const [f, hash] of Object.entries(korunan)) {
  if (crypto.createHash('sha256').update(fs.readFileSync(new URL(f, kok))).digest('hex') !== hash) { console.error('Değişmiş mevcut asset:', f); hata++; }
}
for (const k of [...KURUCULAR, ...ZIYARETCILER]) {
  const portre = `${KURUCULAR.includes(k) ? 'kurucu' : 'ziyaretci'}-${k.id}.png`;
  const sahip = `sakin-${k.id}`;
  const dosyalar = [portre, `rozet-${k.id}.png`, `${sahip}.png`];
  for (const [tur, n] of [['bekle', 2], ['yuru', 4]]) {
    const a = ANIMASYONLAR[`${sahip}-${tur}`];
    if (!a || a.sahip !== sahip || a.kare !== n || !ASSETLER[sahip]) { console.error('Animasyon eşleme hatası:', k.id, tur); hata++; }
    for (let i=1; i<=n; i++) dosyalar.push(`anim/${sahip}-${tur}-${i}.png`);
  }
  const eksik = dosyalar.filter(f => !varMi(f));
  const secim = sakinGorselTanimi(k.id, varMi);
  if (secim.anahtar !== sahip || !secim.ozel) { console.error('Sahne eşleme hatası:', k.id); hata++; }
  for (const f of dosyalar.filter(f => varMi(f))) {
    const b = fs.readFileSync(new URL(f,kok));
    const w=b.readUInt32BE(16),h=b.readUInt32BE(20);
    if (f.startsWith('anim/') && (w!==512 || h!==512)) { console.error('Kare boyutu:',f,w,h);hata++; }
    if (f===portre && (w!==512 || h!==512)) { console.error('Portre boyutu:',f,w,h);hata++; }
  }
  console.log(`${eksik.length ? 'EKSİK' : 'TAM'} ${k.id}: ${secim.anahtar} · ${portre} · ${dosyalar.length-eksik.length}/${dosyalar.length}`);
  hata += eksik.length;
}
if (!varMi('portre-oyuncu.png')) hata++;
console.log(`Korunan ${Object.keys(korunan).length} mevcut asset, 10 sakin seti. Hata: ${hata}`);
if (process.argv.includes('--kontrol') && hata) process.exitCode=1;
