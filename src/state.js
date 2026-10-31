// =============================================================
//  OYUN DURUMU VE KURALLAR
//  Oyunun tüm sayısal mantığı burada. Phaser'dan bağımsızdır,
//  yani denge ayarı yapan kişi sahneye dokunmadan burayı değiştirir.
// =============================================================
import { ILK_OLAY, OLAYLAR } from './data/events.js';
import { ZIYARETCILER } from './data/visitors.js';
import { BILGILER, GENEL_BILGILER } from './data/facts.js';

export const AYAR = {
  maxGun: 5,            // demo kaç gün sürer
  eylemHakki: 3,        // her gün yapılabilecek panel eylemi sayısı
  baslangicNufus: 4,
  // Her gece sabit değişim (negatif = azalır)
  gunSonuDegisim: { enerji: -15, su: -4, gida: -4, atik: +10, karbon: -3 },
  // Her gece kişi başı ek tüketim (nüfus arttıkça artar)
  kisiBasiTuketim: { su: -2, gida: -2 },
  ziyaretciBaslangicGunu: 2,
  kapidaBeklemeCezasi: 8,  // karar verilmeden gün biterse insanlık kaybı
  cokusEsigi: 10,          // denge bunun altına inerse oyun erken biter
  dengeEsigi: 60,          // sonlar: denge bu ve üstü = "ayakta"
  insanlikEsigi: 50,       // sonlar: insanlık bu ve üstü = "kapı açık"
  baslangicInsanlik: 50,
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

const sinirla = (v, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(v)));

// Oyunu rastgele sayı üreteciyle başlatır (simülasyon kendi üretecini verebilir)
let rastgele = Math.random;
export function rastgeleAyarla(fn) {
  rastgele = fn;
}

export function sifirla() {
  state.gun = 1;
  state.kaynak = { ...BASLANGIC };
  state.olay = ILK_OLAY;
  state.nufus = AYAR.baslangicNufus;
  state.insanlik = AYAR.baslangicInsanlik;
  state.ziyaretci = null;
  state.katki = {};          // kabul edilenlerin her gece getirdiği
  state.ekEylem = 0;         // kalıcı ek eylem hakkı
  state.kabulEdilen = 0;     // içeri alınan kişi sayısı
  state.reddedilen = 0;      // geri çevrilen kişi sayısı
  state.eylem = AYAR.eylemHakki;
  state.kullanilanOlaylar = [];
  state.kullanilanZiyaretciler = [];
  state.bugunBilgi = [];     // bugünkü seçimlerin bilgi anahtarları
  state.gosterilenBilgiler = [];
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

function topla(...etkiler) {
  const sonuc = {};
  for (const e of etkiler) {
    for (const [ad, d] of Object.entries(e || {})) sonuc[ad] = (sonuc[ad] || 0) + d;
  }
  return sonuc;
}

// Gece kişi başı tüketim
export function nufusTuketimi(nufus = state.nufus) {
  const t = {};
  for (const [ad, d] of Object.entries(AYAR.kisiBasiTuketim)) t[ad] = d * nufus;
  return t;
}

// ---------------------------------------------------------------
//  PANEL EYLEMLERİ
// ---------------------------------------------------------------
export function eylemYapabilirMi(eylem) {
  if (state.bitti) return false;
  return state.eylem >= (eylem.maliyet ?? 1);
}

export function eylemYap(eylem) {
  if (!eylemYapabilirMi(eylem)) return false;
  state.eylem -= eylem.maliyet ?? 1;
  etkiUygula(eylem.etki);
  if (eylem.bilgi) state.bugunBilgi.push({ anahtar: eylem.bilgi, kirli: !!eylem.kirli });
  state.denge = dengeHesapla();
  bildir();
  return true;
}

// ---------------------------------------------------------------
//  KAPI
// ---------------------------------------------------------------
export function ziyaretciKabul() {
  const z = state.ziyaretci;
  if (!z) return;
  state.nufus += z.kisi;
  state.kabulEdilen += z.kisi;
  state.insanlik = sinirla(state.insanlik + (z.insanlik ?? 10));
  etkiUygula(z.anlik);
  state.katki = topla(state.katki, z.gunlukKatki);
  state.ekEylem += z.eylemArtisi || 0;
  state.bugunBilgi.push({ anahtar: 'goc', kirli: false });
  state.ziyaretci = null;
  state.denge = dengeHesapla();
  bildir();
}

export function ziyaretciReddet() {
  const z = state.ziyaretci;
  if (!z) return;
  state.reddedilen += z.kisi;
  state.insanlik = sinirla(state.insanlik - (z.retCeza ?? 15));
  state.bugunBilgi.push({ anahtar: 'goc', kirli: false });
  state.ziyaretci = null;
  bildir();
}

function havuzdanSec(liste, kullanilan) {
  let havuz = liste.filter((o) => !kullanilan.includes(o.id));
  if (havuz.length === 0) {
    kullanilan.length = 0;
    havuz = liste;
  }
  const secilen = havuz[Math.floor(rastgele() * havuz.length)];
  kullanilan.push(secilen.id);
  return secilen;
}

// ---------------------------------------------------------------
//  BİLİYOR MUYDUN?
//  Öncelik: bugün yapılan kirli seçim > diğer seçimler > genel bilgi.
//  Aynı bilgi bir oyunda iki kez gösterilmez.
// ---------------------------------------------------------------
function bilgiSec() {
  const yeni = (a) => !state.gosterilenBilgiler.includes(a);
  const adaylar = [
    ...state.bugunBilgi.filter((b) => b.kirli).map((b) => b.anahtar),
    ...[...state.bugunBilgi].reverse().filter((b) => !b.kirli).map((b) => b.anahtar),
    ...GENEL_BILGILER,
  ].filter(yeni);
  const anahtar = adaylar[0];
  if (!anahtar) return null;
  state.gosterilenBilgiler.push(anahtar);
  return BILGILER[anahtar];
}

function sonucBelirle() {
  const ayakta = state.denge >= AYAR.dengeEsigi;
  const acik = state.insanlik >= AYAR.insanlikEsigi;
  if (ayakta) return acik ? 'gercekUtopya' : 'yalnizUtopya';
  return acik ? 'kapimizAcikti' : 'cokus';
}

/**
 * Günü bitirir: gece tüketimi uygulanır, sonra yeni gün, olay ve ziyaretçi gelir.
 * Dönüş: { tip: 'devam' | son tipi, rapor, bilgi, gidenZiyaretci }
 */
export function gunuBitir() {
  // Kapıda bekleyen biri varsa ve karar verilmediyse gider
  let gidenZiyaretci = null;
  if (state.ziyaretci) {
    gidenZiyaretci = state.ziyaretci;
    state.reddedilen += gidenZiyaretci.kisi;
    state.insanlik = sinirla(state.insanlik - AYAR.kapidaBeklemeCezasi);
    state.ziyaretci = null;
  }

  const once = { ...state.kaynak };
  etkiUygula(topla(AYAR.gunSonuDegisim, nufusTuketimi(), state.katki, state.olay?.gunSonu));
  state.denge = dengeHesapla();
  const rapor = {};
  for (const ad of Object.keys(once)) rapor[ad] = state.kaynak[ad] - once[ad];
  const bilgi = bilgiSec();
  state.bugunBilgi = [];

  let tip = 'devam';
  if (state.denge <= AYAR.cokusEsigi || state.gun >= AYAR.maxGun) tip = sonucBelirle();

  if (tip !== 'devam') {
    state.bitti = true;
    bildir();
    return { tip, rapor, bilgi, gidenZiyaretci };
  }

  state.gun += 1;
  state.olay = havuzdanSec(OLAYLAR, state.kullanilanOlaylar);
  state.ziyaretci = state.gun >= AYAR.ziyaretciBaslangicGunu
    ? havuzdanSec(ZIYARETCILER, state.kullanilanZiyaretciler)
    : null;
  state.eylem = Math.max(0, AYAR.eylemHakki + state.ekEylem + (state.olay.eylem || 0));
  etkiUygula(state.olay.anlik);
  state.denge = dengeHesapla();
  bildir();
  return { tip, rapor, bilgi, gidenZiyaretci };
}
