// =============================================================
//  OYUN DURUMU VE KURALLAR
//  Oyunun tüm sayısal mantığı burada. Phaser'dan bağımsızdır,
//  yani denge ayarı yapan kişi sahneye dokunmadan burayı değiştirir.
// =============================================================
import { ILK_OLAY, OLAYLAR } from './data/events.js';

export const AYAR = {
  maxGun: 5,            // demo kaç gün sürer
  eylemHakki: 3,        // her gün yapılabilecek panel eylemi sayısı
  // Her gece otomatik olan değişim (negatif = azalır)
  gunSonuDegisim: { enerji: -15, su: -12, gida: -12, atik: +10, karbon: -3 },
  cokusEsigi: 10,       // denge bunun altına inerse oyun erken biter
  utopyaEsigi: 60,      // 5. gün sonunda bu ve üstü: ütopya sonu
  yaraliEsigi: 30,      // bu ve üstü: "ayakta ama yaralı" sonu
};

const BASLANGIC = { enerji: 50, su: 50, gida: 50, atik: 35, karbon: 35 };

// Enerji/su/gıda yüksek = iyi, atık/karbon yüksek = kötü
export const KAYNAKLAR = {
  enerji: { ad: 'Enerji', ikon: '⚡', yuksekIyi: true },
  su:     { ad: 'Su',     ikon: '💧', yuksekIyi: true },
  gida:   { ad: 'Gıda',   ikon: '🌾', yuksekIyi: true },
  atik:   { ad: 'Atık',   ikon: '🗑️', yuksekIyi: false },
  karbon: { ad: 'Karbon', ikon: '☁️', yuksekIyi: false },
};

export const state = {};

// --- Basit abonelik: state değişince HUD ve sahne güncellenir ---
const dinleyiciler = new Set();
export function abone(fn) {
  dinleyiciler.add(fn);
  return () => dinleyiciler.delete(fn);
}
function bildir() {
  dinleyiciler.forEach((fn) => fn(state));
}

const sinirla = (v) => Math.max(0, Math.min(100, Math.round(v)));

export function sifirla() {
  state.gun = 1;
  state.kaynak = { ...BASLANGIC };
  state.olay = ILK_OLAY;
  state.eylem = AYAR.eylemHakki;
  state.kullanilanOlaylar = [];
  state.bitti = false;
  state.denge = dengeHesapla();
  bildir();
}

// Denge = 0 (distopya) ... 100 (ütopya)
// - Her kaynak 80'de "tam puan" sayılır: fazla enerji kirliliği telafi edemez.
// - Karbon iki kat ağırlıklı: kirli seçenekler dengeyi gerçekten bozar.
const AGIRLIK = { enerji: 1, su: 1, gida: 1, atik: 1, karbon: 2 };
export function dengeHesapla(k = state.kaynak) {
  let toplam = 0;
  let agirlik = 0;
  for (const [ad, w] of Object.entries(AGIRLIK)) {
    const iyilik = KAYNAKLAR[ad].yuksekIyi ? k[ad] : 100 - k[ad];
    toplam += Math.min(100, (iyilik / 80) * 100) * w;
    agirlik += w;
  }
  let sonuc = toplam / agirlik;
  // Temel bir kaynak tamamen biterse ağır ceza
  if (k.enerji === 0 || k.su === 0 || k.gida === 0) sonuc -= 15;
  return sinirla(sonuc);
}

function etkiUygula(etki) {
  for (const [ad, deger] of Object.entries(etki || {})) {
    if (ad in state.kaynak) state.kaynak[ad] = sinirla(state.kaynak[ad] + deger);
  }
}

function topla(a, b) {
  const sonuc = { ...a };
  for (const [ad, d] of Object.entries(b || {})) sonuc[ad] = (sonuc[ad] || 0) + d;
  return sonuc;
}

export function eylemYapabilirMi(eylem) {
  if (state.bitti) return false;
  return state.eylem >= (eylem.maliyet ?? 1);
}

export function eylemYap(eylem) {
  if (!eylemYapabilirMi(eylem)) return false;
  state.eylem -= eylem.maliyet ?? 1;
  etkiUygula(eylem.etki);
  state.denge = dengeHesapla();
  bildir();
  return true;
}

function yeniOlaySec() {
  let havuz = OLAYLAR.filter((o) => !state.kullanilanOlaylar.includes(o.id));
  if (havuz.length === 0) {
    state.kullanilanOlaylar = [];
    havuz = OLAYLAR;
  }
  const olay = havuz[Math.floor(Math.random() * havuz.length)];
  state.kullanilanOlaylar.push(olay.id);
  return olay;
}

function sonucBelirle() {
  if (state.denge >= AYAR.utopyaEsigi) return 'utopya';
  if (state.denge >= AYAR.yaraliEsigi) return 'yarali';
  return 'cokus';
}

/**
 * Günü bitirir: gece tüketimi uygulanır, sonra yeni gün ve olay başlar.
 * Dönüş: { tip: 'devam' | 'utopya' | 'yarali' | 'cokus', rapor }
 */
export function gunuBitir() {
  const once = { ...state.kaynak };
  etkiUygula(topla(AYAR.gunSonuDegisim, state.olay?.gunSonu));
  state.denge = dengeHesapla();
  const sonra = { ...state.kaynak };
  const rapor = {};
  for (const ad of Object.keys(once)) rapor[ad] = sonra[ad] - once[ad];

  let tip = 'devam';
  if (state.denge <= AYAR.cokusEsigi) tip = 'cokus';
  else if (state.gun >= AYAR.maxGun) tip = sonucBelirle();

  if (tip !== 'devam') {
    state.bitti = true;
    bildir();
    return { tip, rapor };
  }

  state.gun += 1;
  state.olay = yeniOlaySec();
  state.eylem = Math.max(0, AYAR.eylemHakki + (state.olay.eylem || 0));
  etkiUygula(state.olay.anlik);
  state.denge = dengeHesapla();
  bildir();
  return { tip, rapor };
}
