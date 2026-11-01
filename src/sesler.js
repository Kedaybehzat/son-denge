// =============================================================
//  SES YÖNETİCİSİ (müzikler + tek seferlik sesler)
//  Döngülü müzikler crossfade ile değişir, tek sefer sesler play.
//  Ses açık/kapalı localStorage'da; ayarlar menüsünden toggle edilir.
//  Tarayıcı autoplay engeline karşı ilk kullanıcı etkileşiminde
//  bekleyen müzik tekrar dener.
//
//  Dosya listesi, kullanım yerleri ve isimlendirme: SOUNDS.md
// =============================================================

const SES_YOLU = '/sounds/';
const DEPO_ANAHTAR = 'sondenge:ses';
const FADE_ADIM_MS = 70;
const FADE_ADIM = 0.05;

let sesAcik = typeof localStorage !== 'undefined' ? localStorage.getItem(DEPO_ANAHTAR) !== 'kapali' : true;
let aktifLoop = null;      // { ad, audio, hedefSes }
let bekleyen = null;       // autoplay engeli olunca ilk tıklamada denenecek
const birDefa = new Set(); // önceden yüklenmiş ses nesneleri

function yol(ad) {
  return SES_YOLU + ad + '.mp3';
}

function fade(audio, hedef, bitince) {
  if (!audio) return bitince?.();
  const adim = () => {
    const fark = hedef - audio.volume;
    if (Math.abs(fark) < FADE_ADIM + 0.001) {
      audio.volume = Math.max(0, Math.min(1, hedef));
      if (hedef === 0) audio.pause();
      bitince?.();
      return;
    }
    audio.volume = Math.max(0, Math.min(1, audio.volume + Math.sign(fark) * FADE_ADIM));
    setTimeout(adim, FADE_ADIM_MS);
  };
  adim();
}

export function muzikCal(ad, { hedefSes = 0.55, loop = true } = {}) {
  if (!ad) return;
  if (aktifLoop?.ad === ad) return;
  const yeni = new Audio(yol(ad));
  yeni.loop = loop;
  yeni.volume = 0;
  if (sesAcik) {
    yeni.play().then(() => fade(yeni, hedefSes)).catch(() => { bekleyen = { ad, hedefSes, loop }; });
  }
  const eski = aktifLoop;
  aktifLoop = { ad, audio: yeni, hedefSes, loop };
  if (eski) fade(eski.audio, 0);
}

export function muzikDurdur() {
  if (!aktifLoop) return;
  const eski = aktifLoop;
  aktifLoop = null;
  fade(eski.audio, 0);
}

// Tek seferlik ses (tıklama, panel bip, kapı çalma gibi). Aynı anda
// birden fazla kez çalabilir; önce yüklendiyse yeniden kullanılır.
export function sesCal(ad, { ses = 0.7 } = {}) {
  if (!sesAcik || !ad) return;
  const a = new Audio(yol(ad));
  a.volume = ses;
  a.play().catch(() => {});
  birDefa.add(a);
  a.addEventListener('ended', () => birDefa.delete(a));
}

export function sesAcikMi() { return sesAcik; }

export function sesToggle() {
  sesAcik = !sesAcik;
  try { localStorage.setItem(DEPO_ANAHTAR, sesAcik ? 'acik' : 'kapali'); } catch {}
  if (!sesAcik) {
    if (aktifLoop) fade(aktifLoop.audio, 0);
  } else if (aktifLoop) {
    aktifLoop.audio.play().then(() => fade(aktifLoop.audio, aktifLoop.hedefSes)).catch(() => {});
  }
  return sesAcik;
}

// Autoplay engeline karşı ilk kullanıcı etkileşiminde bekleyeni dene
function etkilesimCozucu() {
  if (bekleyen && sesAcik && aktifLoop?.ad === bekleyen.ad) {
    aktifLoop.audio.play().then(() => fade(aktifLoop.audio, aktifLoop.hedefSes)).catch(() => {});
  }
  bekleyen = null;
}
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', etkilesimCozucu, { capture: true });
  window.addEventListener('keydown', etkilesimCozucu, { capture: true });
}
