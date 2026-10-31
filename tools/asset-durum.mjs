// =============================================================
//  ASSET DURUMU
//  src/data/assets.js'teki her dosyanın public/assets/ içinde olup
//  olmadığını gösterir. PROJECT_LOG.md → Asset Listesi'ndeki "Durum" sütununu
//  güncellerken kullanın:   node tools/asset-durum.mjs
// =============================================================
import fs from 'node:fs';
import { ASSETLER } from '../src/data/assets.js';

const klasor = new URL('../public/assets/', import.meta.url);
let var_ = 0;
for (const [anahtar, a] of Object.entries(ASSETLER)) {
  const mevcut = fs.existsSync(new URL(a.dosya, klasor));
  if (mevcut) var_++;
  console.log(`${mevcut ? '✅' : '⏳'} ${a.dosya.padEnd(22)} ${String(a.yukseklik).padStart(4)} px  (${anahtar}${a.yedek ? `, yoksa ${a.yedek}` : ''})`);
}
console.log(`\n${var_} / ${Object.keys(ASSETLER).length} oyuna bağlı görsel hazır.`);

// assets.js'te olmayan ama klasöre konmuş dosyalar (yanlış ad olabilir)
const bilinen = new Set(Object.values(ASSETLER).map((a) => a.dosya));
const fazla = fs.readdirSync(klasor).filter((f) => !f.startsWith('.') && f !== 'anim' && !bilinen.has(f));
if (fazla.length) console.log(`⚠ Tanınmayan dosyalar (adı yanlış ya da henüz koda bağlı değil): ${fazla.join(', ')}`);

// ---------------------------------------------------------------
//  ANİMASYONLAR: public/assets/anim/<ad>-<n>.png
// ---------------------------------------------------------------
const { ANIMASYONLAR, animKareDosyasi } = await import('../src/data/animations.js');
console.log('\nAnimasyonlar (tüm kareler gerekli; eksik kare varsa animasyon kurulmaz):');
let tamam = 0;
const bilinenKare = new Set();
for (const [ad, a] of Object.entries(ANIMASYONLAR)) {
  const eksik = [];
  for (let n = 1; n <= a.kare; n++) {
    bilinenKare.add(animKareDosyasi(ad, n).replace('anim/', ''));
    if (!fs.existsSync(new URL(animKareDosyasi(ad, n), klasor))) eksik.push(n);
  }
  const hazir = a.kare - eksik.length;
  if (!eksik.length) tamam++;
  const isaret = !eksik.length ? '✅' : hazir ? '⚠️' : '⏳';
  console.log(`${isaret} ${ad.padEnd(15)} ${hazir}/${a.kare} kare  ${a.fps} fps ${a.dongu ? 'döngü' : 'bir kez'}${eksik.length && hazir ? `  eksik kare: ${eksik.join(', ')}` : ''}`);
}
console.log(`\n${tamam} / ${Object.keys(ANIMASYONLAR).length} animasyon hazır.`);
const animKlasor = new URL('anim/', klasor);
if (fs.existsSync(animKlasor)) {
  const fazlaKare = fs.readdirSync(animKlasor).filter((f) => !f.startsWith('.') && !bilinenKare.has(f));
  if (fazlaKare.length) console.log(`⚠ anim/ içinde tanınmayan dosyalar: ${fazlaKare.join(', ')}`);
}
