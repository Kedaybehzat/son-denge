// =============================================================
//  DENGE SİMÜLASYONU
//  Oyunu farklı oyun tarzlarıyla binlerce kez oynatır ve sonların
//  dağılımını gösterir. state.js / data dosyalarında sayı değiştirince
//  çalıştırın:   node tools/simulasyon.mjs
// =============================================================
import { state, sifirla, eylemYap, gunuBitir, ziyaretciKabul, ziyaretciReddet,
  dengeHesapla, nufusTuketimi, AYAR, rastgeleAyarla, bosMakineler, kendinCalis,
  masadaArastirabilirMi, masadaArastir, arastirmaSec, arastirmaAcik, gorevAta,
  makineOperatoru, sakinTanimi, MAKINELER } from '../src/state.js';
import { PANELLER } from '../src/data/panels.js';
import { ARASTIRMALAR } from '../src/data/research.js';

const N = 4000;
const TUM_EYLEMLER = Object.values(PANELLER).flatMap((p) => p.eylemler);

// Basit tohumlu rastgele sayı üreteci (sonuçlar tekrarlanabilir olsun)
function tohumlu(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const sinirla = (v) => Math.max(0, Math.min(100, Math.round(v)));
function uygula(k, etki) {
  const y = { ...k };
  for (const [ad, d] of Object.entries(etki || {})) y[ad] = sinirla(y[ad] + d);
  return y;
}
// Bir eylemden sonra, bu gecenin tüketimi de düşünülerek tahmini denge
function tahmin(etki, nufus = state.nufus, katki = state.katki) {
  let k = uygula(state.kaynak, etki);
  for (const e of [AYAR.gunSonuDegisim, nufusTuketimi(nufus), katki, state.olay?.gunSonu]) k = uygula(k, e);
  return dengeHesapla(k);
}

const STILLER = {
  // Her eylemde dengeyi en çok artıracak seçeneği seçer
  akilli: (r) => TUM_EYLEMLER.reduce((a, b) => (tahmin(b.etki) > tahmin(a.etki) ? b : a)),
  // Rastgele seçer
  rastgele: (r) => TUM_EYLEMLER[Math.floor(r() * TUM_EYLEMLER.length)],
  // Mümkünse hep kirli/hızlı seçeneği seçer
  kirli: (r) => {
    const kirliler = TUM_EYLEMLER.filter((e) => e.kirli);
    return r() < 0.7 ? kirliler[Math.floor(r() * kirliler.length)] : TUM_EYLEMLER[Math.floor(r() * TUM_EYLEMLER.length)];
  },
};

const KAPI = {
  hepsiniAl: () => true,
  kimseyiAlma: () => false,
  yarisi: (r) => r() < 0.5,
};

// Akıllı atama: Araştırma uzmanı (bilim) laboratuvara gönderilir;
// aksi halde varsayılan görev (uzmanlık makinesi) zaten iyi.
function akilliAtamalariYap() {
  for (const s of state.sakinler) {
    const z = sakinTanimi(s.id);
    if (!z || z.calisir === false) continue;
    if (z.uzman === 'arastirma' && s.gorev !== 'arastirma') {
      gorevAta(s.uid, 'arastirma');
    }
  }
}

// Akıllı araştırma kuyruğu: batarya varsa önce, sonra grisu
function akilliArastirmaSec() {
  if (!arastirmaAcik('batarya')) arastirmaSec('batarya');
  else if (!arastirmaAcik('grisu')) arastirmaSec('grisu');
}

function oyna(stilAd, stil, kapi, r) {
  rastgeleAyarla(r);
  sifirla();
  for (;;) {
    if (state.ziyaretci) (kapi(r) ? ziyaretciKabul : ziyaretciReddet)();
    if (stilAd === 'akilli') {
      akilliAtamalariYap();
      akilliArastirmaSec();
    }
    // Operatörü olmayan makinelerde önce oyuncu kendisi çalışır
    for (const m of bosMakineler()) kendinCalis(m);
    while (state.eylem > 0) eylemYap(stil(r));
    const s = gunuBitir();
    if (s.tip !== 'devam') {
      return {
        tip: s.tip, gun: state.gun, denge: state.denge,
        insanlik: state.insanlik, nufus: state.nufus,
        acilan: state.arastirma.acik.length,
      };
    }
  }
}

const SONLAR = ['gercekUtopya', 'yalnizUtopya', 'kapimizAcikti', 'cokus'];
console.log(`Her satır ${N} oyun. Sonların yüzdesi:\n`);
console.log('stil      kapı         ' + SONLAR.map((s) => s.padEnd(14)).join('') + 'ort.denge  erken bitiş  ort.arş');
for (const [sAd, stil] of Object.entries(STILLER)) {
  for (const [kAd, kapi] of Object.entries(KAPI)) {
    const say = Object.fromEntries(SONLAR.map((s) => [s, 0]));
    let denge = 0, erken = 0, acilan = 0;
    const r = tohumlu(42);
    for (let i = 0; i < N; i++) {
      const s = oyna(sAd, stil, kapi, r);
      say[s.tip]++;
      denge += s.denge;
      acilan += s.acilan;
      if (s.gun < AYAR.maxGun) erken++;
    }
    console.log(sAd.padEnd(10) + kAd.padEnd(13) +
      SONLAR.map((s) => ((say[s] / N) * 100).toFixed(0).padStart(4) + '%'.padEnd(10)).join('') +
      (denge / N).toFixed(1).padStart(8) + ((erken / N) * 100).toFixed(0).padStart(10) + '%' +
      (acilan / N).toFixed(2).padStart(9));
  }
}
