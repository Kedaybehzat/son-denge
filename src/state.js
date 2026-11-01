// =============================================================
//  OYUN DURUMU VE KURALLAR
//  Oyunun tüm sayısal mantığı burada. Phaser'dan bağımsızdır,
//  yani denge ayarı yapan kişi sahneye dokunmadan burayı değiştirir.
// =============================================================
import { ILK_OLAY, OLAYLAR, HAZIRLIK_MALIYETI } from './data/events.js';
import { KARTLAR } from './data/cards.js';
import { KESIF_NOKTALARI } from './data/exploration.js';
import { ZIYARETCILER, KURUCULAR } from './data/visitors.js';
import { CALISMA_MODLARI, MOD_EK_ETKILERI, BAKIM, HAVA_URETIMI } from './data/production.js';
export { CALISMA_MODLARI, BAKIM };
import { gunBasiniKaydet, kayitGecerliMi, kaydiSil } from './kayit.js';
import { SENARYO_HEDEFLERI } from './data/scenario.js';
export { SENARYO_HEDEFLERI };
import { PANELLER } from './data/panels.js';
import { BILGILER, GENEL_BILGILER } from './data/facts.js';
import { ARASTIRMALAR, GOREVLER, MASA_ARASTIRMA, BATARYA_KAPASITE, BATARYA_SARJ_ESIGI, OYUNCU_CALISMA_MALIYETI } from './data/research.js';
import { YAPILAR } from './data/structures.js';
export { YAPILAR };

export const AYAR = {
  maxGun: 5,            // demo kaç gün sürer
  eylemHakki: 3,        // her gün yapılabilecek panel eylemi sayısı
  baslangicNufus: 4,
  baslangicMalzeme: 8,
  malzemeKapasite: 100,
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
  // Yorgunluk: her gece çalışırsa +1, dinlenirse -2. 4+ uyarı, 5+ ayrılma riski.
  yorgunlukUyari: 4,       // bu puandan itibaren pano'da uyarı
  yorgunlukAyrilmaEsigi: 5,// bu puandan itibaren ayrılma şansı
  yorgunlukAyrilmaPay: 0.20, // şans = (yorgunluk - esik + 1) * pay
  ayrilmaInsanlikCezasi: 8,
  // Uzman olmayan sakin makineyi daha az verimli kullanır (makine üretimine çarpan).
  // Uzman '*' (her yerde) ve uzmanlık yerindeki sakin tam verim alır.
  uzmanOlmayanVerim: 0.90,
  // Enerji düşükken makineler kademeli olarak kapanır. Kapatma sırası:
  // en kritik olmayan önce (geriDonusum → sera → su → enerji). Eşikler kaynak enerjisi
  // bu değerin ALTINDAYSA listedeki makineler o gece çalışmaz; operatör dinlenmiş sayılır.
  makineKapatmaEsikleri: [
    { enerji: 10, kapali: ['geriDonusum', 'sera'] },
    { enerji: 25, kapali: ['geriDonusum'] },
  ],
  // Hafif siyaset (GDD bölüm 11): memnuniyet yalnızca sürdürülebilirlik kararlarına bağlı
  baslangicMemnuniyet: 60,
  itirazEsigi: 35,          // altında itiraz kartı çıkabilir
  guvenOylamasiEsigi: 10,   // üst üste guvenOylamasiGece gece bu ve altında kalırsa: güven oylaması (son)
  guvenOylamasiGece: 2,
  memnuniyet: {
    kitlikEsigi: 20, kitlik: -6,       // enerji/su/gıda bu değerin altındaysa (her biri)
    yorgun: -2, yorgunEnFazla: -6,     // yorgunluğu uyarı eşiğinde olan her çalışan için (toplam sınırlı)
    kirli: -3,                         // o gün kirli bir seçim yapıldıysa (bir kez)
    dengeYuksek: 70, dengeYuksekDeger: +5,
    dengeDusuk: 40, dengeDusukDeger: -4,
    hazirlik: +3,                      // yarının olayına hazırlanıldıysa
    kesifBasari: +5,                   // keşif başarıyla dönerse
  },
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

export function sifirla({ gun0 = false } = {}) {
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
  state.malzeme = AYAR.baslangicMalzeme;
  state.makineModlari = Object.fromEntries(Object.keys(PANELLER).map((id) => [id, 'normal']));
  state.makineAsinma = Object.fromEntries(Object.keys(PANELLER).map((id) => [id, 0]));
  state.sohbetEdilenler = [];
  state.planlar = [];
  state.sozler = [];
  state.sozGecmisi = [];
  state.hedefler = SENARYO_HEDEFLERI.map((h) => ({ id: h.id, durum: 'bekliyor' }));
  state.batarya = 0;         // depodaki enerji (Batarya Deposu açıldıysa)
  state.kabulEdilen = 0;     // içeri alınan kişi sayısı
  state.reddedilen = 0;      // geri çevrilen kişi sayısı
  state.ayrilan = 0;         // yorgunluktan ayrılan kişi sayısı
  state.eylem = AYAR.eylemHakki;
  state.kullanilanOlaylar = [];
  state.kullanilanZiyaretciler = [];
  state.kararGecmisi = [];   // Gerçekleşmiş seçimler; gün başı kayda dahil
  state.bugunBilgi = [];     // bugünkü seçimlerin bilgi anahtarları
  state.gosterilenBilgiler = [];
  state.bitti = false;
  state.tahmin = havuzdanSec(OLAYLAR, state.kullanilanOlaylar); // yarının olayı (radyo duyurur)
  state.hazirlik = false;       // yarının olayına bugün hazırlanıldı mı
  state.olayHazirlikli = false; // bugünün olayına dün hazırlanılmış mıydı
  state.kart = null;            // bekleyen karar kartı (sabah çıkar)
  state.gosterilenKartlar = [];
  state.kartGeceEtki = {};      // karar kartından bu geceye eklenen etki
  state.memnuniyet = AYAR.baslangicMemnuniyet; // sakinlerin yönetime güveni (görünür)
  state.guvenDusukGece = 0;     // memnuniyetin üst üste kaç gece eşiğin altında kaldığı
  state.sefer = null;           // { yer, uid, kalan } aktif keşif seferi
  state.kesfedilenler = [];     // bu oyunda gidilmiş keşif noktaları
  state.insaat = null;           // { id, kalan }: aynı anda tek inşaat
  state.yapilar = [];           // inşa edilen yapılar (data/structures.js)
  state.gun0 = null;            // Gün 0 öğreticisi: { sira, kapida }
  for (const k of KURUCULAR) state.sakinler.push({ uid: state.sakinler.length + 1, id: k.id, gorev: k.varsayilan, yorgunluk: 0 });
  if (gun0) {
    // Sığınak boş: kurucular kapıya teker teker gelir, makineler operatörsüz.
    state.gun = 0;
    state.sakinler = [];
    state.nufus = 0;
    state.eylem = 0;
    state.gun0 = { sira: 0, kapida: false, incelenen: [], panoGoruldu: false };
  }
  katkiGuncelle();
  state.denge = dengeHesapla();
  bildir();
}

// Test paneli: durumu doğrudan değiştirir, türetilmiş değerleri yeniler ve arayüze yayar.
// Yalnız geliştirme/test içindir; oyun kuralları bunu kullanmaz.
export function testDegistir(fn) {
  fn(state);
  state.nufus = state.sakinler.reduce((t, s) => t + (sakinTanimi(s.id)?.kisi || 1), 0);
  katkiGuncelle();
  state.denge = dengeHesapla();
  bildir();
}

// ---------------------------------------------------------------
//  GÜN 0 · HAZIRLIK (öğretici; kaynak/denge değiştirmez)
// ---------------------------------------------------------------
export const gun0Aktif = () => state.gun === 0 && !!state.gun0;
export const gun0EkipTamam = () => gun0Aktif() && state.gun0.sira >= KURUCULAR.length;
// Son gelen kurucunun paneli henüz incelenmediyse o makine (sıradaki kişi bunu bekler)
export function gun0BekleyenPanel() {
  if (!gun0Aktif() || state.gun0.sira === 0) return null;
  const m = KURUCULAR[state.gun0.sira - 1].varsayilan;
  return state.gun0.incelenen.includes(m) ? null : m;
}
export const gun0Tamam = () => gun0EkipTamam() && !gun0BekleyenPanel() && state.gun0.panoGoruldu;
export const gun0KapidakiKurucu = () => (gun0Aktif() && state.gun0.kapida ? KURUCULAR[state.gun0.sira] || null : null);
export function gun0PanelIncele(makine) {
  if (!gun0Aktif() || !makineOperatoru(makine) || state.gun0.incelenen.includes(makine)) return false;
  state.gun0.incelenen.push(makine);
  bildir();
  return true;
}
export function gun0PanoGor() {
  if (!gun0EkipTamam() || gun0BekleyenPanel() || state.gun0.panoGoruldu) return false;
  state.gun0.panoGoruldu = true;
  bildir();
  return true;
}
export function gun0KapiyaGel() {
  if (!gun0Aktif() || state.gun0.kapida || gun0EkipTamam() || gun0BekleyenPanel()) return false;
  state.gun0.kapida = true;
  bildir();
  return true;
}
// Kapıdaki kurucuyu içeri alıp kendi makinesine yönlendirir
export function gun0Karsila() {
  const k = gun0KapidakiKurucu();
  if (!k) return null;
  state.sakinler.push({ uid: state.gun0.sira + 1, id: k.id, gorev: k.varsayilan, yorgunluk: 0 });
  state.nufus = state.sakinler.length;
  state.gun0.sira += 1;
  state.gun0.kapida = false;
  bildir();
  return k;
}
// Gün 1'e geçiş: her zamanki başlangıç durumu (kararGecmisi Gün 0'da boş kalır)
export function gun0Bitir() {
  if (!gun0Aktif()) return false;
  sifirla();
  gunBasiniKaydet(state);
  return true;
}

export function kayittanDevamEt(kayit) {
  if (!kayitGecerliMi(kayit)) return false;
  const k = JSON.parse(JSON.stringify(kayit.durum));
  const kimlikler = new Set([...KURUCULAR, ...ZIYARETCILER].map(s => s.id));
  if (k.sakinler.some(s => !kimlikler.has(s.id)) || new Set(k.sakinler.map(s => s.uid)).size !== k.sakinler.length) return false;
  if (k.sefer && (!KESIF_NOKTALARI[k.sefer.yer] || !k.sakinler.some(s => s.uid === k.sefer.uid))) return false;
  if (k.insaat && (!YAPILAR[k.insaat.id] || !Number.isFinite(k.insaat.kalan))) return false;
  if (k.sakinler.some(s => s.gorev && !MAKINELER[s.gorev] && !GOREVLER[s.gorev] && s.gorev !== 'kesif')) return false;
  if (k.arastirma.acik.some(id => !ARASTIRMALAR[id]) || k.yapilar.some(id => !YAPILAR[id])) return false;
  const olaylar = [ILK_OLAY, ...OLAYLAR];
  if (!olaylar.some(o => o.id === k.olay?.id) || (k.tahmin && !OLAYLAR.some(o => o.id === k.tahmin.id))) return false;
  k.olay = olaylar.find(o => o.id === k.olay.id);
  k.tahmin = k.tahmin ? OLAYLAR.find(o => o.id === k.tahmin.id) : null;
  k.kart = k.kart ? KARTLAR.find(c => c.id === k.kart.id) || null : null;
  k.ziyaretci = k.ziyaretci ? ZIYARETCILER.find(z => z.id === k.ziyaretci.id) || null : null;
  sifirla();
  for (const ad of Object.keys(state)) if (Object.hasOwn(k, ad)) state[ad] = k[ad];
  katkiGuncelle(); state.denge = dengeHesapla(); bildir(); return true;
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
    if (ad === 'malzeme') state.malzeme = sinirla(state.malzeme + deger, 0, AYAR.malzemeKapasite);
    else if (ad in state.kaynak) state.kaynak[ad] = sinirla(state.kaynak[ad] + deger);
  }
}

function topla(...etkiler) {
  const sonuc = {};
  for (const e of etkiler) {
    for (const [ad, d] of Object.entries(e || {})) sonuc[ad] = (sonuc[ad] || 0) + d;
  }
  return sonuc;
}

// ---------------------------------------------------------------
//  HAZIRLIKLI OLAYLAR (GDD Faz 2: uyarı → hazırlık → etki)
//  Yapılar (GDD Faz 7, data/structures.js) olayAzalt ile aynı
//  carpan sistemine entegre: hazırlık ile çarpılır (çarpanlar birleşir).
// ---------------------------------------------------------------
function olayCarpani(olay = state.olay, hazirlikli = state.olayHazirlikli) {
  let c = 1;
  if (hazirlikli && olay?.hazirlik) c *= olay.hazirlik.carpan;
  if (olay) for (const y of state.yapilar || []) {
    const az = YAPILAR[y]?.olayAzalt;
    if (az && az[olay.id] != null) c *= az[olay.id];
  }
  return c;
}

// Bugünün olayına hazırlanıldıysa veya yapı varsa kötü yöndeki etkiler küçülür
export function olayEtkisi(etki, olay = state.olay, hazirlikli = state.olayHazirlikli) {
  if (!etki) return etki;
  const c = olayCarpani(olay, hazirlikli);
  if (c === 1) return etki;
  const sonuc = {};
  for (const [ad, d] of Object.entries(etki)) {
    const kotu = (d < 0) === KAYNAKLAR[ad].yuksekIyi;
    sonuc[ad] = kotu ? Math.round(d * c) : d;
  }
  return sonuc;
}

// Kaynak harcayan işlemler sıfırın altında kaynak tüketemez.
export function kaynakYeterliMi(etki = {}, malzeme = false) {
  return Object.entries(etki || {}).every(([ad, d]) => d >= 0 || (!malzeme && ad !== 'malzeme' && !KAYNAKLAR[ad]?.yuksekIyi) || (ad === 'malzeme' ? state.malzeme : state.kaynak[ad] ?? 0) >= -d);
}

// Yapı inşa (GDD Faz 7)
export const yapiAcik = (id) => (state.yapilar || []).includes(id);
export function yapiKurabilirMi(id) {
  if (state.bitti || !YAPILAR[id] || yapiAcik(id) || state.insaat || state.gun >= AYAR.maxGun) return false;
  const m = YAPILAR[id].maliyet || {};
  if (state.eylem < (m.eylem || 0)) return false;
  const { eylem, ...kaynak } = m;
  if (!kaynakYeterliMi(kaynak, true)) return false;
  if (YAPILAR[id].onKosul && !YAPILAR[id].onKosul(state)) return false;
  return true;
}
export function yapiKur(id) {
  if (!yapiKurabilirMi(id)) return false;
  const m = YAPILAR[id].maliyet || {};
  if (m.eylem) state.eylem -= m.eylem;
  const kaynakMaliyet = {};
  for (const [k, v] of Object.entries(m)) if (k !== 'eylem') kaynakMaliyet[k] = v;
  etkiUygula(kaynakMaliyet);
  state.insaat = { id, kalan: YAPILAR[id].sure ?? 2, duraklat: false, yardim: false };
  if (YAPILAR[id].bilgi) state.bugunBilgi.push({ anahtar: YAPILAR[id].bilgi, kirli: false });
  state.denge = dengeHesapla();
  bildir();
  return true;
}

export const insaatci = () => state.sakinler.find((s) => s.gorev === 'insaat') || null;
export function insaatTahmini() {
  const i = state.insaat;
  if (!i) return null;
  const kisi = insaatci();
  const uzman = kisi && ['tamirci', 'muhendis'].includes(kisi.id);
  const ilerleme = i.duraklat ? 0 : (kisi ? (uzman ? 2 : 1) : 0) + (i.yardim ? 1 : 0);
  return { ilerleme, kalan: Math.max(0, i.kalan - ilerleme), biter: ilerleme >= i.kalan, uid: kisi?.uid };
}
function insaatciBirak(s) {
  const onceki = s.insaatOncekiGorev || 'bosta';
  s.gorev = MAKINELER[onceki] && makineOperatoru(onceki) ? 'bosta' : onceki;
  delete s.insaatOncekiGorev;
}
export function insaatDuraklat() {
  if (!state.insaat || state.bitti) return false;
  state.insaat.duraklat = !state.insaat.duraklat;
  bildir(); return true;
}
export function insaataYardimEt() {
  const i = state.insaat;
  if (state.bitti || !i || i.duraklat || i.yardim || state.eylem < 1) return false;
  state.eylem -= 1; i.yardim = true;
  bildir(); return true;
}
export function insaatIptal() {
  if (!state.insaat || state.bitti) return false;
  const { id, kalan } = state.insaat;
  const y = YAPILAR[id];
  const oran = kalan / (y.sure ?? 2);
  const iade = Math.floor(-(y.maliyet.malzeme || 0) * oran * 0.5);
  state.malzeme = Math.min(AYAR.malzemeKapasite, state.malzeme + iade);
  for (const s of state.sakinler.filter((s) => s.gorev === 'insaat')) insaatciBirak(s);
  state.insaat = null; katkiGuncelle(); bildir(); return true;
}
function insaatGecesi(tahmin) {
  if (!state.insaat) return null;
  state.insaat.kalan = tahmin.kalan;
  state.insaat.yardim = false;
  if (!tahmin.biter) return null;
  const id = state.insaat.id;
  state.yapilar.push(id);
  state.insaat = null;
  for (const s of state.sakinler.filter((s) => s.gorev === 'insaat')) insaatciBirak(s);
  katkiGuncelle(); return id;
}

export function hazirlanabilirMi() {
  return !state.bitti && !!state.tahmin?.hazirlik && !state.hazirlik && state.eylem >= HAZIRLIK_MALIYETI;
}

function kararKaydet(karar) {
  state.kararGecmisi.push({ gun: state.gun, ...karar });
}
export function panelIncelendi(id) {
  if (state.bitti || !PANELLER[id] || state.kararGecmisi.some(k => k.tip === 'inceleme' && k.id === id && k.gun === state.gun)) return;
  kararKaydet({ tip: 'inceleme', id });
}
export function hazirlan() {
  if (!hazirlanabilirMi()) return false;
  state.eylem -= HAZIRLIK_MALIYETI;
  state.hazirlik = true;
  kararKaydet({ tip: 'hazirlik', ad: state.tahmin.hazirlik.ad, bilgi: 'erkenuyari' });
  state.bugunBilgi.push({ anahtar: 'erkenuyari', kirli: false });
  bildir();
  return true;
}

// ---------------------------------------------------------------
//  EĞİTİCİ KARAR KARTLARI (GDD bölüm 10, veri: data/cards.js)
// ---------------------------------------------------------------
function kartKosuluVar(k) {
  return k.kosul.every((c) => {
    if (c.ziyaretci) return !!state.ziyaretci;
    if (c.gunMin != null) return state.gun >= c.gunMin;
    if (c.memnuniyetAlti != null) return state.memnuniyet < c.memnuniyetAlti;
    if (c.tahmin) return state.tahmin?.id === c.tahmin;
    if (c.olay) return state.olay?.id === c.olay;
    if (c.bosMakineVar) return bosMakineler().length > 0;
    if (c.kesfedilen) return state.kesfedilenler?.includes(c.kesfedilen);
    const v = state.kaynak[c.kaynak];
    if (c.alti != null && !(v < c.alti)) return false;
    if (c.ust != null && !(v > c.ust)) return false;
    return true;
  });
}

// Seçenek bu durumda gösterilebilir mi (açılmış araştırma seçeneği gizlenir)
export const kartSecenegiGecerli = (sec) => !(sec.arastirma && arastirmaAcik(sec.arastirma.id));
export const kartSecenekleri = (k = state.kart) => (k ? k.secenekler.filter(kartSecenegiGecerli) : []);
export const kartSecebilirMi = (sec) => !state.bitti && !!state.kart && state.eylem >= (sec.maliyet || 0) && kaynakYeterliMi(sec.etki) && (!sec.kapi || !!state.ziyaretci) && (!sec.hazirlik || (!!state.tahmin?.hazirlik && !state.hazirlik));

// Sabah: koşulu sağlanan, daha önce çıkmamış ilk kartı bekleyen yapar
function kartKontrol() {
  state.kart = null;
  if (state.bitti) return;
  const k = KARTLAR.find((x) => !state.gosterilenKartlar.includes(x.id) && kartKosuluVar(x) && kartSecenekleri(x).length);
  if (!k) return;
  state.kart = k;
  state.gosterilenKartlar.push(k.id);
}

// Seçeneği uygular; sonuç ekranı için seçeneği döndürür
export function kartSec(sec) {
  if (!kartSecebilirMi(sec) || !kartSecenekleri().includes(sec)) return null;
  const once = { ...state.kaynak };
  state.eylem -= sec.maliyet || 0;
  etkiUygula(sec.etki);
  state.kartGeceEtki = topla(state.kartGeceEtki, sec.geceEtki);
  if (sec.insanlik) state.insanlik = sinirla(state.insanlik + sec.insanlik);
  if (sec.memnuniyet) state.memnuniyet = sinirla(state.memnuniyet + sec.memnuniyet);
  if (sec.yorgunlukAzalt) for (const sk of state.sakinler) sk.yorgunluk = Math.max(0, (sk.yorgunluk || 0) - sec.yorgunlukAzalt);
  if (sec.arastirma) {
    state.arastirma.aktif = sec.arastirma.id;
    const biten = puanEkle(sec.arastirma.puan);
    if (biten) state.bugunBilgi.push({ anahtar: ARASTIRMALAR[biten].bilgi, kirli: false });
  }
  if (sec.bilgi) state.gosterilenBilgiler.push(sec.bilgi); // sonuç ekranında gösterildi, gece tekrar çıkmasın
  kararKaydet({ tip: 'kart', ad: sec.ad, bilgi: sec.bilgi, aciklama: sec.sonuc || '', etki: Object.fromEntries(Object.keys(once).map(k => [k, state.kaynak[k] - once[k]])) });
  state.kart = null;
  if (sec.hazirlik) { state.hazirlik = true; kararKaydet({ tip: 'hazirlik', ad: state.tahmin.hazirlik.ad, bilgi: 'erkenuyari' }); }
  if (sec.kapi === 'kabul') ziyaretciKabul();
  else if (sec.kapi === 'ret') ziyaretciReddet();
  state.denge = dengeHesapla();
  bildir();
  return sec;
}

// ---------------------------------------------------------------
//  KEŞİF (GDD bölüm 8, veri: data/exploration.js)
// ---------------------------------------------------------------
// Kişinin uzmanlığı: ziyaretçide uzman, kurucuda başlangıç makinesi
const uzmanlik = (z) => z.uzman ?? z.varsayilan;

export function kesifSansi(yer, uid) {
  const n = KESIF_NOKTALARI[yer];
  const s = state.sakinler.find((x) => x.uid === uid);
  if (!n || !s) return 0;
  const u = uzmanlik(sakinTanimi(s.id));
  return u === n.uzman || (n.uzman === '*' && u === '*') ? 1 : n.sans;
}

export function kesfeGonderebilirMi(yer, uid) {
  const n = KESIF_NOKTALARI[yer];
  const s = state.sakinler.find((x) => x.uid === uid);
  return !state.bitti && !!n && !!s && !state.sefer && !state.kesfedilenler.includes(yer)
    && s.gorev !== 'insaat' && sakinTanimi(s.id).calisir !== false && state.gun + n.sure <= AYAR.maxGun && kaynakYeterliMi(n.erzak);
}

export function kesfeGonder(yer, uid) {
  if (!kesfeGonderebilirMi(yer, uid)) return false;
  const n = KESIF_NOKTALARI[yer];
  const s = state.sakinler.find((x) => x.uid === uid);
  etkiUygula(n.erzak);
  s.oncekiGorev = s.gorev;
  s.gorev = 'kesif';
  state.sefer = { yer, uid, kalan: n.sure, sans: kesifSansi(yer, uid) };
  state.kesfedilenler.push(yer);
  katkiGuncelle();
  state.denge = dengeHesapla();
  bildir();
  return true;
}

// Sabah: seferin bir gecesi geçti; bittiyse sonucu uygula ve döndür
function seferSabahi() {
  const sf = state.sefer;
  if (!sf) return null;
  const n = KESIF_NOKTALARI[sf.yer];
  const s = state.sakinler.find((x) => x.uid === sf.uid);
  if (!s) { // seferdeyken yorgunluktan ayrıldı
    state.sefer = null;
    return { yer: sf.yer, ad: n.ad, ikon: n.ikon, basari: false, kayip: true, metin: 'Seferdeki ekip geri dönmedi.' };
  }
  if (sf.kararBekliyor) return { bekliyor: true, yer: sf.yer, ad: n.ad, metin: n.araKarar.metin };
  sf.kalan -= 1;
  if (sf.kalan > 0) return null;
  if (n.araKarar && !sf.kararVerildi) {
    sf.kararBekliyor = true;
    return { bekliyor: true, yer: sf.yer, ad: n.ad, metin: n.araKarar.metin };
  }
  return seferDonusu(sf);
}
export function kesifKarariYapabilirMi(secim) {
  const sf = state.sefer;
  if (!sf?.kararBekliyor || state.bitti || !['don','devam','erzak'].includes(secim)) return false;
  if (secim === 'don') return true;
  return state.gun + 1 <= AYAR.maxGun && (secim !== 'erzak' || kaynakYeterliMi(KESIF_NOKTALARI[sf.yer].araKarar.ekErzak));
}
export function kesifKarariSec(secim) {
  if (!kesifKarariYapabilirMi(secim)) return false;
  const sf = state.sefer, n = KESIF_NOKTALARI[sf.yer];
  sf.kararVerildi = true; sf.kararBekliyor = false;
  let sonuc = null;
  if (secim === 'don') sonuc = seferDonusu(sf, true);
  else {
    sf.kalan = 1;
    if (secim === 'erzak') { etkiUygula(n.araKarar.ekErzak); sf.sans = Math.min(1, sf.sans + 0.1); }
    else sf.sans = Math.max(0, sf.sans - 0.15);
  }
  state.denge = dengeHesapla(); bildir(); return sonuc || true;
}
function seferDonusu(sf, erken = false) {
  const n = KESIF_NOKTALARI[sf.yer], s = state.sakinler.find(s => s.uid === sf.uid);
  if (!s) return null;
  const z = sakinTanimi(s.id);
  const basari = erken || rastgele() < sf.sans;
  let arastirmaBitti = null;
  if (basari) {
    const kaynak = erken ? Object.fromEntries(Object.entries(n.odul.kaynak || {}).map(([k,v]) => [k, Math.round(v * 0.5)])) : n.odul.kaynak;
    etkiUygula(kaynak);
    if (!erken && n.araKarar?.plan && !state.planlar.includes(n.araKarar.plan)) state.planlar.push(n.araKarar.plan);
    if (!erken && n.araKarar?.malzeme) state.malzeme = Math.min(AYAR.malzemeKapasite, state.malzeme + n.araKarar.malzeme);
    if (n.odul.insanlik) state.insanlik = sinirla(state.insanlik + n.odul.insanlik);
    state.memnuniyet = sinirla(state.memnuniyet + AYAR.memnuniyet.kesifBasari);
    if (!erken && n.odul.arastirma) arastirmaBitti = puanEkle(n.odul.arastirma.puan, n.odul.arastirma.id);
  }
  // Eski görevine döner (makinesi başkasına verildiyse dinlenir)
  const eski = s.oncekiGorev;
  s.gorev = eski && (!MAKINELER[eski] || !makineOperatoru(eski)) ? eski : 'bosta';
  delete s.oncekiGorev;
  state.sefer = null;
  katkiGuncelle();
  if (n.bilgi) state.gosterilenBilgiler.push(n.bilgi);
  return { yer: sf.yer, ad: n.ad, ikon: n.ikon, kisi: z.ad, basari, metin: erken ? 'Ekip güvenle döndü; yalnız taşınabilir kaynakların yarısı getirildi, çizimler/parçalar geride kaldı.' : basari ? n.basari : n.basarisiz,
    odul: basari ? (erken ? { kaynak: Object.fromEntries(Object.entries(n.odul.kaynak || {}).map(([k,v]) => [k, Math.round(v * 0.5)])) } : n.odul) : null, plan: !erken && basari ? n.araKarar?.plan : null, arastirmaBitti, bilgi: n.bilgi };
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

// Enerji seviyesine göre bu gece KAPALI olacak makinelerin listesi.
// Eşikler artan sırada; ilk eşleşme döndürülür.
export function kapaliMakineler(enerji = state.kaynak.enerji) {
  for (const esik of AYAR.makineKapatmaEsikleri) {
    if (enerji < esik.enerji) return [...esik.kapali];
  }
  return [];
}
export const makineKapali = (makine) => kapaliMakineler().includes(makine);

export const makineModu = (id) => CALISMA_MODLARI[state.makineModlari[id]] || CALISMA_MODLARI.normal;
export function makineModuSec(id, mod) {
  if (state.bitti || !MAKINELER[id] || !CALISMA_MODLARI[mod]) return false;
  state.makineModlari[id] = mod; katkiGuncelle(); bildir(); return true;
}
export function havaUretimEtkisi(id) {
  const olay = state.olay?.id;
  if (olay === 'toz' && (state.olayHazirlikli || arastirmaAcik('havaFiltresi'))) return {};
  if (olay === 'sel' && (state.olayHazirlikli || yapiAcik('bariyer'))) return {};
  const etki = { ...(HAVA_URETIMI[olay]?.[id] || {}) };
  if (olay === 'sicak' && state.makineModlari[id] === 'yogun') for (const k in etki) etki[k] *= 2;
  return etki;
}
export function makineUretimi(id) {
  const mod = makineModu(id);
  const asinma = state.makineAsinma[id] || 0;
  const verim = asinma >= 10 ? 0.4 : asinma >= 6 ? 0.7 : 1;
  const temel = Object.fromEntries(Object.entries(MAKINELER[id].uretim).map(([k,v]) => [k, Math.round(v * mod.carpani * verim)]));
  return topla(temel, MOD_EK_ETKILERI[id]?.[state.makineModlari[id]], havaUretimEtkisi(id));
}
export function bakimYapabilirMi(id) {
  return !state.bitti && !!MAKINELER[id] && state.makineAsinma[id] > 0 && state.eylem >= BAKIM.eylem && state.malzeme >= BAKIM.malzeme;
}
export function bakimYap(id) {
  if (!bakimYapabilirMi(id)) return false;
  state.eylem -= BAKIM.eylem; state.malzeme -= BAKIM.malzeme;
  state.makineAsinma[id] = Math.max(0, state.makineAsinma[id] - BAKIM.onarim);
  katkiGuncelle(); bildir(); return true;
}

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
  const uzmanBurada = z.uzman === s.gorev || z.uzman === '*';
  const makineKapaliMi = MAKINELER[s.gorev] && kapaliMakineler().includes(s.gorev);
  if (MAKINELER[s.gorev]) {
    if (makineKapaliMi) {
      // Enerji yetersiz: makine çalışmaz, operatör dinleniyor sayılır
      sonuc.kapali = true;
    } else {
      etki = makineUretimi(s.gorev);
      // Uzman olmayan sakin makineyi daha az verimli kullanır
      if (!uzmanBurada) {
        for (const ad of Object.keys(etki)) etki[ad] = Math.round(etki[ad] * AYAR.uzmanOlmayanVerim);
      }
    }
  } else if (s.gorev === 'arastirma') {
    sonuc.puan = GOREVLER.arastirma.puan * (z.uzman === 'arastirma' ? 2 : 1);
  }
  // Uzmanlık yerinde (ya da '*' her yerde) kişisel katkı eklenir; keşifteyken ve kapalı makinede yok
  if (s.gorev !== 'kesif' && uzmanBurada && !makineKapaliMi) {
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
  // Oyuncunun bugün kendisi çalıştığı makineler de üretir (kapalı değilse)
  const kapali = kapaliMakineler();
  for (const m of state.oyuncuMakineler) if (!kapali.includes(m)) etki = topla(etki, makineUretimi(m));
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
  if (!s || state.bitti || sakinTanimi(s.id).calisir === false || s.gorev === 'kesif') return;
  if (!MAKINELER[gorev] && !GOREVLER[gorev]) return;
  if (MAKINELER[gorev]) {
    const eski = makineOperatoru(gorev);
    if (eski && eski !== s) eski.gorev = 'bosta';
  }
  if (gorev === 'insaat') {
    if (!state.insaat) return;
    if (s.gorev === 'insaat') return;
    const eski = insaatci();
    if (eski) insaatciBirak(eski);
    s.insaatOncekiGorev = s.gorev;
  } else if (s.gorev === 'insaat') delete s.insaatOncekiGorev;
  s.gorev = gorev;
  katkiGuncelle();
  bildir();
}

export function dinlenmeSozuVerebilirMi(uid) {
  const s = state.sakinler.find(s => s.uid === uid);
  return !state.bitti && state.gun < AYAR.maxGun && !!s && sakinTanimi(s.id).calisir !== false
    && s.gorev !== 'kesif' && !state.sozler.some(p => p.uid === uid);
}
export function dinlenmeSozuVer(uid) {
  if (!dinlenmeSozuVerebilirMi(uid)) return false;
  state.sozler.push({ uid, gun: state.gun + 1, ad: sakinTanimi(state.sakinler.find(s => s.uid === uid).id).ad });
  bildir(); return true;
}
function sozleriDegerlendir() {
  const sonuc = [];
  for (const p of state.sozler.filter(p => p.gun <= state.gun)) {
    const s = state.sakinler.find(s => s.uid === p.uid);
    const tutuldu = s?.gorev === 'bosta';
    const durum = !s ? 'ayrildi' : tutuldu ? 'tutuldu' : 'bozuldu';
    if (s) { s.guven = sinirla((s.guven ?? 50) + (tutuldu ? 10 : -12)); state.memnuniyet = sinirla(state.memnuniyet + (tutuldu ? 6 : -6)); }
    sonuc.push({ ...p, durum });
  }
  state.sozler = state.sozler.filter(p => p.gun > state.gun);
  state.sozGecmisi.push(...sonuc); return sonuc;
}
export function hedefYardimiGonderebilirMi() {
  const h = state.hedefler.find(h => h.id === 'komsuDestek');
  return !state.bitti && h?.durum === 'bekliyor' && state.gun <= 3 && kaynakYeterliMi(SENARYO_HEDEFLERI[1].maliyet, true);
}
export function hedefYardimiGonder() {
  if (!hedefYardimiGonderebilirMi()) return false;
  etkiUygula(SENARYO_HEDEFLERI[1].maliyet);
  state.hedefler.find(h => h.id === 'komsuDestek').durum = 'tamamlandi';
  state.insanlik = sinirla(state.insanlik + 5); state.memnuniyet = sinirla(state.memnuniyet + 4);
  state.bugunBilgi.push({ anahtar: 'goc', kirli: false }); state.denge = dengeHesapla(); bildir(); return true;
}
function hedefleriDegerlendir() {
  const sonuc = [];
  for (const h of state.hedefler.filter(h => h.durum === 'bekliyor')) {
    const tanim = SENARYO_HEDEFLERI.find(t => t.id === h.id);
    if (tanim.yapi && yapiAcik(tanim.yapi)) { h.durum = 'tamamlandi'; state.memnuniyet = sinirla(state.memnuniyet + 4); sonuc.push({ ...h }); }
    else if (state.gun >= tanim.sonGun) { h.durum = 'kacirildi'; sonuc.push({ ...h }); }
  }
  return sonuc;
}

export function moralVerebilirMi(uid) {
  return !state.bitti && state.eylem >= 1 && !state.sohbetEdilenler.includes(uid)
    && state.sakinler.some((s) => s.uid === uid && s.gorev !== 'kesif');
}
export function moralVer(uid) {
  if (!moralVerebilirMi(uid)) return false;
  const s = state.sakinler.find((s) => s.uid === uid);
  state.eylem -= 1; state.memnuniyet = sinirla(state.memnuniyet + 4);
  s.yorgunluk = Math.max(0, (s.yorgunluk || 0) - 1);
  state.sohbetEdilenler.push(uid); bildir(); return true;
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

// Seviye II koşulunu da dikkate alan seçilebilirlik
export const arastirmaSecilebilir = (id) => {
  const p = ARASTIRMALAR[id];
  if (!p || arastirmaAcik(id)) return false;
  return !p.onKosul || p.onKosul(state);
};

export function arastirmaSec(id) {
  if (!ARASTIRMALAR[id] || arastirmaAcik(id) || state.bitti) return;
  if (!arastirmaSecilebilir(id)) return; // Seviye II koşulu sağlanmıyor
  state.arastirma.aktif = id;
  bildir();
}

// Puanı aktif projeye ekler; tamamlanan projenin id'sini döndürür
// proje verilmezse aktif projeye; proje açıksa puan boşa gider
function puanEkle(puan, proje = state.arastirma.aktif) {
  const a = state.arastirma;
  if (!proje || puan <= 0 || a.acik.includes(proje)) return null;
  a.puan[proje] = (a.puan[proje] || 0) + puan;
  if (a.puan[proje] < ARASTIRMALAR[proje].maliyet) return null;
  a.acik.push(proje);
  // Yeni aktif proje: koşulu sağlanan ilk açık olmayan proje
  if (!a.aktif || a.acik.includes(a.aktif)) {
    a.aktif = Object.keys(ARASTIRMALAR).find((id) => !a.acik.includes(id) && arastirmaSecilebilir(id)) || null;
  }
  return proje;
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
  const yapi = (state.yapilar || []).map((id) => YAPILAR[id].geceEtki);
  const degisim = topla(AYAR.gunSonuDegisim, nufusTuketimi(), sakin.etki, olayEtkisi(state.olay?.gunSonu), state.kartGeceEtki, ...teknoloji, ...yapi);

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
    insaat: insaatTahmini(),
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
  return state.eylem >= (eylem.maliyet ?? 1) && kaynakYeterliMi(eylem.etki);
}

export function geriKazanimMiktari(eylem) {
  if (!eylem.geriKazanim) return 0;
  return Math.floor(Math.min(state.kaynak.atik, -(eylem.etki?.atik || 0)) / (-(eylem.etki?.atik || 0) || 1) * eylem.geriKazanim);
}
export function eylemYap(eylem) {
  if (!eylemYapabilirMi(eylem)) return false;
  const once = { ...state.kaynak }, onceMalzeme = state.malzeme;
  const malzeme = geriKazanimMiktari(eylem);
  state.malzeme = Math.min(AYAR.malzemeKapasite, state.malzeme + malzeme);
  state.eylem -= eylem.maliyet ?? 1;
  etkiUygula(eylem.etki);
  kararKaydet({ tip: 'eylem', ad: eylem.ad, bilgi: eylem.bilgi, etki: Object.fromEntries(Object.keys(once).map(k => [k, state.kaynak[k] - once[k]])), malzeme: state.malzeme - onceMalzeme });
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
  state.sakinler.push({ uid: Math.max(0, ...state.sakinler.map((s) => s.uid)) + 1, id: z.id, gorev: varsayilanGorev(z), yorgunluk: 0 });
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

// ---------------------------------------------------------------
//  MEMNUNİYET (GDD bölüm 11, hafif siyaset)
// ---------------------------------------------------------------
// Gece sonunda memnuniyeti günceller; nedenleri rapor için döndürür
function memnuniyetGecesi() {
  const M = AYAR.memnuniyet;
  const nedenler = [];
  const ekle = (neden, deger) => { if (deger) nedenler.push({ neden, deger }); };
  const kitlik = { enerji: 'Karanlık', su: 'Su kıtlığı', gida: 'Gıda kıtlığı' };
  for (const [ad, neden] of Object.entries(kitlik)) if (state.kaynak[ad] < M.kitlikEsigi) ekle(neden, M.kitlik);
  const yorgun = state.sakinler.filter((sk) => sk.gorev && (sk.yorgunluk || 0) >= AYAR.yorgunlukUyari).length;
  if (yorgun) ekle(`${yorgun} kişi tükenmiş`, Math.max(M.yorgunEnFazla, M.yorgun * yorgun));
  if (state.bugunBilgi.some((b) => b.kirli)) ekle('Kirli bir seçim yapıldı', M.kirli);
  if (state.denge >= M.dengeYuksek) ekle('Sığınak iyi durumda', M.dengeYuksekDeger);
  else if (state.denge < M.dengeDusuk) ekle('Sığınak kötüye gidiyor', M.dengeDusukDeger);
  if (state.hazirlik) ekle('Yarına hazırlıklıyız', M.hazirlik);
  const once = state.memnuniyet;
  state.memnuniyet = sinirla(state.memnuniyet + nedenler.reduce((t, n) => t + n.deger, 0));
  return { nedenler, degisim: state.memnuniyet - once };
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
// Bir sakin bu gece gerçekten çalışıyor mu? Kapalı makinedeki operatör dinleniyor sayılır.
const calisiyor = (s) => {
  if (!s.gorev || s.gorev === 'bosta') return false;
  if (s.gorev === 'insaat' && (!state.insaat || state.insaat.duraklat)) return false;
  if (MAKINELER[s.gorev] && kapaliMakineler().includes(s.gorev)) return false;
  return true;
};

// Bu gecenin sonunda sakinin yorgunluğu ne olur
export function yarinkiYorgunluk(s) {
  if (!s.gorev) return s.yorgunluk || 0; // çalışmayanlar (çocuklar) değişmez
  return calisiyor(s) ? (s.yorgunluk || 0) + (MAKINELER[s.gorev] ? makineModu(s.gorev).yorgunluk : 1) : Math.max(0, (s.yorgunluk || 0) - 2);
}

export function ayrilmaSansi(yorgunluk) {
  if (yorgunluk < AYAR.yorgunlukAyrilmaEsigi) return 0;
  return Math.min(1, (yorgunluk - AYAR.yorgunlukAyrilmaEsigi + 1) * AYAR.yorgunlukAyrilmaPay);
}

// Gece sonunda yorgunluğu günceller, sınırı aşanlar için ayrılma zarı atar.
// Ayrılanların listesini döndürür.
function yorgunlukGecesi(plan) {
  const ayrilanlar = [];
  for (const s of state.sakinler) {
    s.yorgunluk = plan.get(s.uid);
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

  const sozSonuclari = sozleriDegerlendir();
  const insaatPlani = insaatTahmini();
  const yorgunlukPlani = new Map(state.sakinler.map((s) => [s.uid, yarinkiYorgunluk(s)]));
  const asinmaPlani = Object.keys(MAKINELER).filter((id) => makineCalisiyorMu(id) && !makineKapali(id));
  for (const id of asinmaPlani) kararKaydet({ tip: 'uretim', ad: `${MAKINELER[id].ad}: ${makineModu(id).ad}`, mod: state.makineModlari[id] });
  const once = { ...state.kaynak };
  const gece = geceHesapla();
  etkiUygula(gece.degisim);
  state.batarya = gece.batarya;
  const arastirmaBitti = puanEkle(gece.puan);
  if (arastirmaBitti) state.bugunBilgi.push({ anahtar: ARASTIRMALAR[arastirmaBitti].bilgi, kirli: false });
  state.denge = dengeHesapla();
  const rapor = {};
  for (const ad of Object.keys(once)) rapor[ad] = state.kaynak[ad] - once[ad];
  const ayrilanlar = yorgunlukGecesi(yorgunlukPlani);
  for (const id of asinmaPlani) state.makineAsinma[id] = Math.min(10, state.makineAsinma[id] + makineModu(id).asinma);
  if (ayrilanlar.length) state.denge = dengeHesapla();
  const memnuniyet = memnuniyetGecesi();
  const insaatBitti = insaatGecesi(insaatPlani);
  const hedefSonuclari = hedefleriDegerlendir();
  const ek = { sozSonuclari, hedefSonuclari, insaatBitti, arastirmaPuani: gece.puan, arastirmaBitti, bataryaKullanim: gece.bataryaKullanim, bataryaSarj: gece.bataryaSarj, ayrilanlar, memnuniyet };
  const bilgi = bilgiSec();
  state.bugunBilgi = [];

  let tip = 'devam';
  state.guvenDusukGece = state.memnuniyet <= AYAR.guvenOylamasiEsigi ? state.guvenDusukGece + 1 : 0;
  if (state.guvenDusukGece >= AYAR.guvenOylamasiGece) tip = 'guvenKaybi'; // güven oylaması
  else if (state.denge <= AYAR.cokusEsigi || state.gun >= AYAR.maxGun) tip = sonucBelirle();

  if (tip !== 'devam') {
    state.bitti = true;
    kaydiSil();
    bildir();
    return { tip, rapor, bilgi, gidenZiyaretci, ...ek };
  }

  state.sohbetEdilenler = [];
  state.gun += 1;
  state.olay = state.tahmin || havuzdanSec(OLAYLAR, state.kullanilanOlaylar);
  state.olayHazirlikli = state.hazirlik;
  state.hazirlik = false;
  state.tahmin = state.gun < AYAR.maxGun ? havuzdanSec(OLAYLAR, state.kullanilanOlaylar) : null;
  state.ziyaretci = state.gun >= AYAR.ziyaretciBaslangicGunu
    ? havuzdanSec(ZIYARETCILER, state.kullanilanZiyaretciler)
    : null;
  state.oyuncuMakineler = [];
  katkiGuncelle();
  state.eylem = Math.max(0, AYAR.eylemHakki + state.ekEylem + (state.olay.eylem || 0));
  etkiUygula(olayEtkisi(state.olay.anlik));
  state.kartGeceEtki = {};
  const sefer = seferSabahi();
  kartKontrol();
  state.denge = dengeHesapla();
  bildir();
  gunBasiniKaydet(state);
  return { tip, rapor, bilgi, gidenZiyaretci, ...ek, sefer };
}
