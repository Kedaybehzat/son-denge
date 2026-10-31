// =============================================================
//  OYUN DURUMU VE KURALLAR
//  Oyunun tüm sayısal mantığı burada. Phaser'dan bağımsızdır,
//  yani denge ayarı yapan kişi sahneye dokunmadan burayı değiştirir.
// =============================================================
import { ILK_OLAY, OLAYLAR } from './data/events.js';
import { ZIYARETCILER, KURUCULAR } from './data/visitors.js';
import { PANELLER } from './data/panels.js';
import { BILGILER, GENEL_BILGILER } from './data/facts.js';
import { ARASTIRMALAR, GOREVLER, MASA_ARASTIRMA, BATARYA_KAPASITE, BATARYA_SARJ_ESIGI, OYUNCU_CALISMA_MALIYETI } from './data/research.js';

export const AYAR = {
  maxGun: 5,            // demo kaç gün sürer
  eylemHakki: 3,        // her gün yapılabilecek panel eylemi sayısı
  baslangicNufus: 4,
  // Her gece sabit değişim (negatif = azalır). Makine üretimleri (panels.js → makine)
  // bunu dengeler: dört makine de çalışırsa net etki eski -15/-4/-4/+10 ile aynıdır.
  gunSonuDegisim: { enerji: -21, su: -9, gida: -9, atik: +15, karbon: -3 },
  // Her gece kişi başı ek tüketim (nüfus arttıkça artar)
  kisiBasiTuketim: { su: -2, gida: -2 },
  ziyaretciBaslangicGunu: 2,
  kapidaBeklemeCezasi: 8,  // karar verilmeden gün biterse insanlık kaybı
  cokusEsigi: 10,          // denge bunun altına inerse oyun erken biter
  dengeEsigi: 60,          // sonlar: denge bu ve üstü = "ayakta"
  insanlikEsigi: 50,       // sonlar: insanlık bu ve üstü = "kapı açık"
  baslangicInsanlik: 50,
  // Yorgunluk: her gece çalışırsa +1, dinlenirse -2. 3+ uyarı, 4+ ayrılma riski.
  yorgunlukUyari: 3,       // bu puandan itibaren pano'da uyarı
  yorgunlukAyrilmaEsigi: 4,// bu puandan itibaren ayrılma şansı
  yorgunlukAyrilmaPay: 0.25, // şans = (yorgunluk - esik + 1) * pay
  ayrilmaInsanlikCezasi: 8,
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
  state.katki = {};          // sakinlerin görevlerinden her gece gelen (koşulsuz, tahmin için)
  state.ekEylem = 0;         // kalıcı ek eylem hakkı (Üretim görevindeki uzmanlardan)
  state.sakinler = [];       // kurucular + içeri alınanlar: { uid, id, gorev }
  state.oyuncuMakineler = []; // oyuncunun bugün kendisi çalıştığı boş makineler
  state.arastirma = { aktif: 'batarya', puan: {}, acik: [] };
  state.batarya = 0;         // depodaki enerji (Batarya Deposu açıldıysa)
  state.kabulEdilen = 0;     // içeri alınan kişi sayısı
  state.reddedilen = 0;      // geri çevrilen kişi sayısı
  state.ayrilan = 0;         // yorgunluktan ayrılan kişi sayısı
  state.eylem = AYAR.eylemHakki;
  state.kullanilanOlaylar = [];
  state.kullanilanZiyaretciler = [];
  state.bugunBilgi = [];     // bugünkü seçimlerin bilgi anahtarları
  state.gosterilenBilgiler = [];
  state.bitti = false;
  for (const k of KURUCULAR) state.sakinler.push({ uid: state.sakinler.length + 1, id: k.id, gorev: k.varsayilan, yorgunluk: 0 });
  katkiGuncelle();
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

// Ziyaretçi içeri alınırsa (varsayılan görevine giderse) her gece NET etkisi.
// Boş bir makineye giderse o makinenin üretimi de buna dahildir.
export function ziyaretciNetEtki(z) {
  const gorev = varsayilanGorev(z);
  return topla(nufusTuketimi(z.kisi), sakinCiktisi({ id: z.id, gorev }, false).etki);
}

// ---------------------------------------------------------------
//  SAKİNLER VE GÖREVLER (GDD bölüm 5)
// ---------------------------------------------------------------
export const MAKINELER = Object.fromEntries(
  Object.entries(PANELLER).filter(([, p]) => p.makine).map(([id, p]) => [id, p.makine]),
);
export const sakinTanimi = (id) => ZIYARETCILER.find((z) => z.id === id) || KURUCULAR.find((k) => k.id === id);
export const gorevBilgisi = (gorev) => MAKINELER[gorev] || GOREVLER[gorev] || GOREVLER.bosta;
export const makineOperatoru = (makine) => state.sakinler.find((s) => s.gorev === makine) || null;
export const makineCalisiyorMu = (makine) => !!makineOperatoru(makine) || state.oyuncuMakineler.includes(makine);
export const bosMakineler = () => Object.keys(MAKINELER).filter((m) => !makineCalisiyorMu(m));

function kosulAktif(z, gorev) {
  const k = z.kosul;
  if (!k) return false;
  if (k.gorev && k.gorev !== gorev) return false;
  if (k.olay) return state.olay?.id === k.olay;
  if (k.enerjiAlti != null) return state.kaynak.enerji < k.enerjiAlti;
  return false;
}

// Bir sakinin bu gece görevinden ne verdiği. kosullar=false -> nominal değer
export function sakinCiktisi(s, kosullar = true) {
  const z = sakinTanimi(s.id);
  const sonuc = { etki: { ...(z.ekTuketim || {}) }, puan: 0, eylem: 0, kosul: false };
  if (!s.gorev || s.gorev === 'bosta') return sonuc;
  let etki = {};
  if (MAKINELER[s.gorev]) etki = { ...MAKINELER[s.gorev].uretim };
  else if (s.gorev === 'arastirma') sonuc.puan = GOREVLER.arastirma.puan * (z.uzman === 'arastirma' ? 2 : 1);
  // Uzmanlık yerinde (ya da '*' her yerde) kişisel katkı eklenir
  if (z.uzman === s.gorev || z.uzman === '*') {
    etki = topla(etki, z.gunlukKatki);
    sonuc.eylem = z.eylemArtisi || 0;
  }
  if (kosullar && kosulAktif(z, s.gorev)) {
    sonuc.kosul = true;
    const c = z.kosul.carpan ?? 1;
    for (const ad of Object.keys(etki)) etki[ad] = Math.round(etki[ad] * c);
    sonuc.puan = Math.round(sonuc.puan * c);
    etki = topla(etki, z.kosul.ek);
  }
  sonuc.etki = topla(sonuc.etki, etki);
  return sonuc;
}

function sakinlerToplami(kosullar = true) {
  let etki = {};
  let puan = 0;
  let eylem = 0;
  for (const s of state.sakinler) {
    const c = sakinCiktisi(s, kosullar);
    etki = topla(etki, c.etki);
    puan += c.puan;
    eylem += c.eylem;
  }
  // Oyuncunun bugün kendisi çalıştığı makineler de üretir
  for (const m of state.oyuncuMakineler) etki = topla(etki, MAKINELER[m].uretim);
  return { etki, puan, eylem };
}

function katkiGuncelle() {
  const t = sakinlerToplami(false);
  state.katki = t.etki;
  state.ekEylem = t.eylem;
}

// Bir sakini göreve gönderir. Makine doluysa eski operatör dinlenmeye geçer.
export function gorevAta(uid, gorev) {
  const s = state.sakinler.find((x) => x.uid === uid);
  if (!s || state.bitti || sakinTanimi(s.id).calisir === false) return;
  if (!MAKINELER[gorev] && !GOREVLER[gorev]) return;
  if (MAKINELER[gorev]) {
    const eski = makineOperatoru(gorev);
    if (eski && eski !== s) eski.gorev = 'bosta';
  }
  s.gorev = gorev;
  katkiGuncelle();
  bildir();
}

// Yeni gelen için varsayılan görev: uzmanlık makinesi boşsa orası, değilse boş makine, yoksa laboratuvar
function varsayilanGorev(z) {
  if (z.calisir === false) return null;
  if (MAKINELER[z.uzman] && !makineOperatoru(z.uzman)) return z.uzman;
  if (z.uzman === 'arastirma') return 'arastirma';
  return Object.keys(MAKINELER).find((m) => !makineOperatoru(m)) || 'arastirma';
}

// Oyuncu operatörü olmayan bir makinede bugün kendisi çalışır (bu gece üretir)
export function kendinCalisabilirMi(makine) {
  return !state.bitti && !!MAKINELER[makine] && !makineCalisiyorMu(makine)
    && state.eylem >= OYUNCU_CALISMA_MALIYETI;
}

export function kendinCalis(makine) {
  if (!kendinCalisabilirMi(makine)) return false;
  state.eylem -= OYUNCU_CALISMA_MALIYETI;
  state.oyuncuMakineler.push(makine);
  katkiGuncelle();
  bildir();
  return true;
}

// ---------------------------------------------------------------
//  ARAŞTIRMA (GDD bölüm 6)
// ---------------------------------------------------------------
export const arastirmaAcik = (id) => state.arastirma.acik.includes(id);

export function arastirmaSec(id) {
  if (!ARASTIRMALAR[id] || arastirmaAcik(id) || state.bitti) return;
  state.arastirma.aktif = id;
  bildir();
}

// Puanı aktif projeye ekler; tamamlanan projenin id'sini döndürür
function puanEkle(puan) {
  const a = state.arastirma;
  if (!a.aktif || puan <= 0) return null;
  a.puan[a.aktif] = (a.puan[a.aktif] || 0) + puan;
  if (a.puan[a.aktif] < ARASTIRMALAR[a.aktif].maliyet) return null;
  const biten = a.aktif;
  a.acik.push(biten);
  a.aktif = Object.keys(ARASTIRMALAR).find((id) => !a.acik.includes(id)) || null;
  return biten;
}

export function masadaArastirabilirMi() {
  return !state.bitti && !!state.arastirma.aktif && state.eylem >= MASA_ARASTIRMA.maliyet;
}

export function masadaArastir() {
  if (!masadaArastirabilirMi()) return null;
  state.eylem -= MASA_ARASTIRMA.maliyet;
  const biten = puanEkle(MASA_ARASTIRMA.puan);
  if (biten) state.bugunBilgi.push({ anahtar: ARASTIRMALAR[biten].bilgi, kirli: false });
  bildir();
  return biten;
}

// ---------------------------------------------------------------
//  GECE HESABI (gunuBitir ve geceTahmini aynı hesabı kullanır)
// ---------------------------------------------------------------
function geceHesapla() {
  const sakin = sakinlerToplami(true);
  const teknoloji = state.arastirma.acik.map((id) => ARASTIRMALAR[id].geceEtki);
  const degisim = topla(AYAR.gunSonuDegisim, nufusTuketimi(), sakin.etki, state.olay?.gunSonu, ...teknoloji);

  // Batarya: açık varsa önce depodan karşıla, fazla varsa depoya aktar
  let batarya = state.batarya;
  let bataryaKullanim = 0;
  let bataryaSarj = 0;
  if (arastirmaAcik('batarya')) {
    const sonra = state.kaynak.enerji + (degisim.enerji || 0);
    if (sonra > BATARYA_SARJ_ESIGI) {
      bataryaSarj = Math.min(BATARYA_KAPASITE - batarya, Math.min(100, sonra) - BATARYA_SARJ_ESIGI);
    } else if ((degisim.enerji || 0) < 0) {
      bataryaKullanim = Math.min(batarya, -degisim.enerji, Math.max(0, BATARYA_SARJ_ESIGI - Math.max(0, sonra)));
    }
    batarya += bataryaSarj - bataryaKullanim;
    degisim.enerji = (degisim.enerji || 0) + bataryaKullanim - bataryaSarj;
  }
  return { degisim, puan: sakin.puan, batarya, bataryaKullanim, bataryaSarj };
}

// Gün bitirilirse bu gece ne olacağının tahmini (durumu değiştirmez)
export function geceTahmini() {
  const g = geceHesapla();
  const sonra = { ...state.kaynak };
  for (const [ad, d] of Object.entries(g.degisim)) if (ad in sonra) sonra[ad] = sinirla(sonra[ad] + d);
  const denge = dengeHesapla(sonra);
  return {
    ...g,
    denge,
    cokus: denge <= AYAR.cokusEsigi,
    sonGun: state.gun >= AYAR.maxGun,
    kapidaBekleyen: state.ziyaretci,
    riskliler: state.sakinler
      .map((s) => ({ s, y: yarinkiYorgunluk(s) }))
      .filter(({ y }) => ayrilmaSansi(y) > 0)
      .map(({ s, y }) => ({ ad: sakinTanimi(s.id).ad, yorgunluk: y, sans: ayrilmaSansi(y) })),
  };
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
  state.sakinler.push({ uid: state.sakinler.length + 1, id: z.id, gorev: varsayilanGorev(z), yorgunluk: 0 });
  katkiGuncelle();
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

// ---------------------------------------------------------------
//  YORGUNLUK (Faz 2 / M2)
//  Çalışan (makine ya da laboratuvar) her gece +1, dinlenen -2 (en az 0).
//  yorgunlukAyrilmaEsigi ve üstünde: ayrılma şansı = (y - esik + 1) * pay.
// ---------------------------------------------------------------
const calisiyor = (s) => !!s.gorev && s.gorev !== 'bosta';

// Bu gecenin sonunda sakinin yorgunluğu ne olur
export function yarinkiYorgunluk(s) {
  if (!s.gorev) return s.yorgunluk || 0; // çalışmayanlar (çocuklar) değişmez
  return calisiyor(s) ? (s.yorgunluk || 0) + 1 : Math.max(0, (s.yorgunluk || 0) - 2);
}

export function ayrilmaSansi(yorgunluk) {
  if (yorgunluk < AYAR.yorgunlukAyrilmaEsigi) return 0;
  return Math.min(1, (yorgunluk - AYAR.yorgunlukAyrilmaEsigi + 1) * AYAR.yorgunlukAyrilmaPay);
}

// Gece sonunda yorgunluğu günceller, sınırı aşanlar için ayrılma zarı atar.
// Ayrılanların listesini döndürür.
function yorgunlukGecesi() {
  const ayrilanlar = [];
  for (const s of state.sakinler) {
    s.yorgunluk = yarinkiYorgunluk(s);
    if (rastgele() < ayrilmaSansi(s.yorgunluk)) ayrilanlar.push(s);
  }
  for (const s of ayrilanlar) {
    const z = sakinTanimi(s.id);
    state.sakinler.splice(state.sakinler.indexOf(s), 1);
    state.nufus -= z.kisi;
    state.ayrilan += z.kisi;
    state.insanlik = sinirla(state.insanlik - AYAR.ayrilmaInsanlikCezasi);
  }
  if (ayrilanlar.length) katkiGuncelle();
  return ayrilanlar.map((s) => ({ ...sakinTanimi(s.id), yorgunluk: s.yorgunluk }));
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
  const gece = geceHesapla();
  etkiUygula(gece.degisim);
  state.batarya = gece.batarya;
  const arastirmaBitti = puanEkle(gece.puan);
  if (arastirmaBitti) state.bugunBilgi.push({ anahtar: ARASTIRMALAR[arastirmaBitti].bilgi, kirli: false });
  state.denge = dengeHesapla();
  const rapor = {};
  for (const ad of Object.keys(once)) rapor[ad] = state.kaynak[ad] - once[ad];
  const ayrilanlar = yorgunlukGecesi();
  if (ayrilanlar.length) state.denge = dengeHesapla();
  const ek = { arastirmaPuani: gece.puan, arastirmaBitti, bataryaKullanim: gece.bataryaKullanim, bataryaSarj: gece.bataryaSarj, ayrilanlar };
  const bilgi = bilgiSec();
  state.bugunBilgi = [];

  let tip = 'devam';
  if (state.denge <= AYAR.cokusEsigi || state.gun >= AYAR.maxGun) tip = sonucBelirle();

  if (tip !== 'devam') {
    state.bitti = true;
    bildir();
    return { tip, rapor, bilgi, gidenZiyaretci, ...ek };
  }

  state.gun += 1;
  state.olay = havuzdanSec(OLAYLAR, state.kullanilanOlaylar);
  state.ziyaretci = state.gun >= AYAR.ziyaretciBaslangicGunu
    ? havuzdanSec(ZIYARETCILER, state.kullanilanZiyaretciler)
    : null;
  state.oyuncuMakineler = [];
  katkiGuncelle();
  state.eylem = Math.max(0, AYAR.eylemHakki + state.ekEylem + (state.olay.eylem || 0));
  etkiUygula(state.olay.anlik);
  state.denge = dengeHesapla();
  bildir();
  return { tip, rapor, bilgi, gidenZiyaretci, ...ek };
}
