// =============================================================
//  i18n — Dil durumu + çeviri yardımcıları
//  Ayarlar menüsünden toggle edilir, localStorage'da saklanır.
//  Oyun adı Apoclimate; şehir adı Yeşilvadi (TR) / Greenvale (EN).
//
//  Kullanım:
//   - UI metinleri: `t('key.path')` → src/i18n/sozluk.js'ten
//   - Veri alanları (öneri: `{ tr: '...', en: '...' }` object'leri): `cev(obj)`
//   - Dil değişince yenilenmesi gereken yerler: 'oyun:dilDegisti' event
// =============================================================
import { SOZLUK } from './i18n/sozluk.js';

const DEPO = 'sondenge:dil';
const DILLER = ['tr', 'en'];
let dil = 'tr';
try {
  const d = localStorage.getItem(DEPO);
  if (DILLER.includes(d)) dil = d;
} catch {}

function cozerDerin(sozluk, yol) {
  return yol.split('.').reduce((o, k) => (o == null ? undefined : o[k]), sozluk);
}

// 't(anahtar, ...args)' — args ile {0}, {1} gibi placeholder'ları doldurur.
export function t(anahtar, ...args) {
  let m = cozerDerin(SOZLUK[dil], anahtar);
  if (m == null) m = cozerDerin(SOZLUK.tr, anahtar);
  if (m == null) return anahtar;
  if (typeof m === 'function') return m(...args);
  if (args.length) return args.reduce((s, a, i) => s.replace(new RegExp(`\\{${i}\\}`, 'g'), String(a)), m);
  return m;
}

// Veri alanları `{ tr, en }` object olabilir; string ise olduğu gibi döner.
export function cev(deger) {
  if (deger == null) return '';
  if (typeof deger === 'string' || typeof deger === 'number') return String(deger);
  return deger[dil] ?? deger.tr ?? deger.en ?? '';
}

export function dilAktif() { return dil; }

export function dilAyarla(y) {
  if (!DILLER.includes(y) || y === dil) return dil;
  dil = y;
  try { localStorage.setItem(DEPO, y); } catch {}
  if (typeof document !== 'undefined') document.documentElement.lang = y;
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('oyun:dilDegisti', { detail: { dil } }));
  return dil;
}

export function dilTogglelat() {
  return dilAyarla(dil === 'tr' ? 'en' : 'tr');
}

if (typeof document !== 'undefined') document.documentElement.lang = dil;
