// =============================================================
//  SES YÖNETİCİSİ — aynı anda tek müzik, iptal edilebilir fade-in.
//  Müzik ve efekt seviyeleri ayrı; her çağrı kendi seviyesiyle çarpılır.
//  Kapatma tüm müzik/efektleri anında susturur. Geciken play()
//  yanıtları ve autoplay denemeleri eski parçayı canlandıramaz.
//  Dosyalar ve kullanım noktaları: SOUNDS.md
// =============================================================
const SES_YOLU = `${import.meta.env?.BASE_URL ?? './'}sounds/`;
const DEPO_ANAHTAR = 'sondenge:ses';
const DEPO_MUZIK = 'sondenge:ses-muzik';
const DEPO_EFEKT = 'sondenge:ses-efekt';
const FADE_ADIM_MS = 70;
const FADE_ADIM = 0.05;
const sinirla01 = (v) => Math.max(0, Math.min(1, v));

let sesAcik = true;
let muzikSeviye = 0.7;
let efektSeviye = 0.8;
try {
  sesAcik = localStorage.getItem(DEPO_ANAHTAR) !== 'kapali';
  const m = parseFloat(localStorage.getItem(DEPO_MUZIK));
  const e = parseFloat(localStorage.getItem(DEPO_EFEKT));
  if (!Number.isNaN(m)) muzikSeviye = sinirla01(m);
  if (!Number.isNaN(e)) efektSeviye = sinirla01(e);
} catch {}
let aktifLoop = null;
let bekleyen = null;
const birDefa = new Set();
const fadeZamanlayicilari = new Map();
const yol = (ad) => SES_YOLU + ad + '.mp3';

function fadeIptal(audio) {
  clearTimeout(fadeZamanlayicilari.get(audio));
  fadeZamanlayicilari.delete(audio);
}

function sustur(audio) {
  fadeIptal(audio);
  audio.muted = true;
  audio.volume = 0;
  audio.loop = false; // loop açık kalırsa src temizlense bile hazır olduğunda tekrar başlar
  // play() Promise'i async: pause tek başına yetmez, async play tamamlanınca
  // ses tekrar başlayabilir. src'yi boşaltıp load() ile tüm playback'i iptal et.
  try { audio.pause(); } catch {}
  try { audio.currentTime = 0; } catch {}
  try { audio.removeAttribute('src'); audio.load(); } catch {}
}

function fade(parca) {
  const { audio, hedefSes } = parca;
  fadeIptal(audio);
  const adim = () => {
    if (!sesAcik || aktifLoop !== parca || audio.paused) {
      fadeIptal(audio);
      return;
    }
    audio.volume = Math.min(hedefSes, audio.volume + FADE_ADIM);
    if (audio.volume < hedefSes) fadeZamanlayicilari.set(audio, setTimeout(adim, FADE_ADIM_MS));
    else fadeZamanlayicilari.delete(audio);
  };
  adim();
}

function muzikBaslat(parca) {
  if (!sesAcik || aktifLoop !== parca) return;
  const deneme = ++parca.deneme;
  bekleyen = null;
  // Önce muted + volume 0 ile başla. Play Promise resolve olurken parça hâlâ
  // aktif ise unmute+fade. Böylece play() async aralığında eski parça durdurulsa
  // bile sessiz başlar; iki ses asla üst üste duyulmaz.
  parca.audio.muted = true;
  parca.audio.volume = 0;
  parca.audio.play().then(() => {
    if (!sesAcik || aktifLoop !== parca) { sustur(parca.audio); return; }
    if (parca.deneme !== deneme) return;
    parca.audio.muted = false;
    fade(parca);
  }).catch((hata) => {
    if (!sesAcik || aktifLoop !== parca || parca.deneme !== deneme) return;
    if (hata?.name === 'NotAllowedError') bekleyen = parca;
  });
}

const efektifMuzik = (mix) => sinirla01(mix) * muzikSeviye;
const efektifEfekt = (mix) => sinirla01(mix) * efektSeviye;

export function muzikCal(ad, { hedefSes = 0.55, loop = true } = {}) {
  if (!ad || aktifLoop?.ad === ad) return;
  muzikDurdur(); // Yeni play çağrısından önce eski parçayı kesin olarak durdur.
  const audio = new Audio(yol(ad));
  audio.loop = loop;
  audio.volume = 0;
  audio.muted = !sesAcik;
  aktifLoop = { ad, audio, mix: sinirla01(hedefSes), hedefSes: efektifMuzik(hedefSes), loop, deneme: 0 };
  muzikBaslat(aktifLoop);
}

export function muzikDurdur() {
  bekleyen = null;
  const eski = aktifLoop;
  aktifLoop = null;
  if (eski) sustur(eski.audio);
}

export function sesCal(ad, { ses = 0.7 } = {}) {
  if (!sesAcik || !ad) return;
  const audio = new Audio(yol(ad));
  audio.volume = efektifEfekt(ses);
  birDefa.add(audio);
  audio.addEventListener('ended', () => birDefa.delete(audio), { once: true });
  audio.addEventListener('error', () => birDefa.delete(audio), { once: true });
  audio.play().then(() => {
    if (!sesAcik || !birDefa.has(audio)) sustur(audio);
  }).catch(() => { sustur(audio); birDefa.delete(audio); });
}

export function sesAcikMi() { return sesAcik; }
export const muzikSeviyesi = () => muzikSeviye;
export const efektSeviyesi = () => efektSeviye;

export function muzikSeviyeAyarla(v) {
  muzikSeviye = sinirla01(v);
  try { localStorage.setItem(DEPO_MUZIK, String(muzikSeviye)); } catch {}
  if (aktifLoop) {
    aktifLoop.hedefSes = efektifMuzik(aktifLoop.mix);
    if (sesAcik && !aktifLoop.audio.paused) {
      fadeIptal(aktifLoop.audio);
      aktifLoop.audio.volume = aktifLoop.hedefSes;
    }
  }
  return muzikSeviye;
}

export function efektSeviyeAyarla(v) {
  efektSeviye = sinirla01(v);
  try { localStorage.setItem(DEPO_EFEKT, String(efektSeviye)); } catch {}
  return efektSeviye;
}

export function sesToggle() {
  sesAcik = !sesAcik;
  try { localStorage.setItem(DEPO_ANAHTAR, sesAcik ? 'acik' : 'kapali'); } catch {}
  bekleyen = null;
  if (!sesAcik) {
    if (aktifLoop) sustur(aktifLoop.audio);
    for (const audio of birDefa) sustur(audio);
    birDefa.clear();
  } else if (aktifLoop) muzikBaslat(aktifLoop);
  return sesAcik;
}

function etkilesimCozucu() {
  const parca = bekleyen;
  if (sesAcik && parca && aktifLoop === parca) muzikBaslat(parca);
}
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', etkilesimCozucu, { capture: true });
  window.addEventListener('keydown', etkilesimCozucu, { capture: true });
}

// Vite canlı yenilemesi eski modülün seslerini ve dinleyicilerini bırakmamalı.
if (import.meta.hot) import.meta.hot.dispose(() => {
  sesAcik = false;
  muzikDurdur();
  for (const audio of birDefa) sustur(audio);
  birDefa.clear();
  window.removeEventListener('pointerdown', etkilesimCozucu, { capture: true });
  window.removeEventListener('keydown', etkilesimCozucu, { capture: true });
});
