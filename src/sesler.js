// =============================================================
//  SES YÖNETİCİSİ — aynı anda tek müzik, iptal edilebilir fade-in.
//  Kapatma tüm müzik/efektleri anında susturur. Geciken play()
//  yanıtları ve autoplay denemeleri eski parçayı canlandıramaz.
//  Dosyalar ve kullanım noktaları: SOUNDS.md
// =============================================================
const SES_YOLU = `${import.meta.env?.BASE_URL ?? './'}sounds/`;
const DEPO_ANAHTAR = 'sondenge:ses';
const FADE_ADIM_MS = 70;
const FADE_ADIM = 0.05;

let sesAcik = true;
try { sesAcik = localStorage.getItem(DEPO_ANAHTAR) !== 'kapali'; } catch {}
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
  audio.pause();
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
  parca.audio.muted = false;
  parca.audio.play().then(() => {
    if (!sesAcik || aktifLoop !== parca) { sustur(parca.audio); return; }
    if (parca.deneme !== deneme) return;
    fade(parca);
  }).catch((hata) => {
    if (!sesAcik || aktifLoop !== parca || parca.deneme !== deneme) return;
    // Yalnız autoplay engeli kullanıcı etkileşimiyle yeniden denenir.
    if (hata?.name === 'NotAllowedError') bekleyen = parca;
  });
}

export function muzikCal(ad, { hedefSes = 0.55, loop = true } = {}) {
  if (!ad || aktifLoop?.ad === ad) return;
  muzikDurdur(); // Yeni play çağrısından önce eski parçayı kesin olarak durdur.
  const audio = new Audio(yol(ad));
  audio.loop = loop;
  audio.volume = 0;
  audio.muted = !sesAcik;
  aktifLoop = { ad, audio, hedefSes: Math.max(0, Math.min(1, hedefSes)), loop, deneme: 0 };
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
  audio.volume = Math.max(0, Math.min(1, ses));
  birDefa.add(audio);
  audio.addEventListener('ended', () => birDefa.delete(audio), { once: true });
  audio.addEventListener('error', () => birDefa.delete(audio), { once: true });
  audio.play().then(() => {
    if (!sesAcik || !birDefa.has(audio)) sustur(audio);
  }).catch(() => { sustur(audio); birDefa.delete(audio); });
}

export function sesAcikMi() { return sesAcik; }

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
