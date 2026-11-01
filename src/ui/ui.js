// =============================================================
//  ARAYÜZ (HTML katmanı)
//  HUD, paneller, radyo kartı, onay pencereleri ve son ekranı.
//  Phaser'ın üstünde duran düz HTML/CSS. Görünüm için style.css.
// =============================================================
import { state, abone, eylemYap, eylemYapabilirMi, nufusTuketimi, ziyaretciNetEtki, geceTahmini, AYAR, KAYNAKLAR,
  sakinTanimi, sakinCiktisi, gorevAta, arastirmaSec, arastirmaAcik, masadaArastir, masadaArastirabilirMi,
  MAKINELER, gorevBilgisi, makineOperatoru, makineCalisiyorMu, bosMakineler, kendinCalis, kendinCalisabilirMi, yarinkiYorgunluk, ayrilmaSansi , olayEtkisi, hazirlan, hazirlanabilirMi , kartSecenekleri, kartSecebilirMi, kartSec , kesifSansi, kesfeGonder, kesfeGonderebilirMi, kapaliMakineler, makineKapali, YAPILAR, yapiAcik, yapiKur, yapiKurabilirMi, CALISMA_MODLARI, BAKIM, makineModu, makineModuSec, makineUretimi, bakimYap, bakimYapabilirMi, geriKazanimMiktari, insaatci, insaatTahmini, insaatDuraklat, insaatIptal, insaataYardimEt, moralVer, moralVerebilirMi, havaUretimEtkisi, dinlenmeSozuVer, dinlenmeSozuVerebilirMi, SENARYO_HEDEFLERI, hedefYardimiGonder, hedefYardimiGonderebilirMi, kesifKarariSec, kesifKarariYapabilirMi, kayittanDevamEt, panelIncelendi, sifirla, prologAktif, prologTamam, prologBekleyenPanel, prologPanoGor, prologGunu, prologGunTamam, prologPanoSirasi, prologPanelOgrenildi, prologPanelOgren, prologRehberEylemi, prologGeceTahmini } from '../state.js';
import { testPaneliToggle } from './testPaneli.js';
import { PROLOG_KURUCULAR, PROLOG_METIN, PROLOG_PANO_TURU, PROLOG_AYAR, PROLOG_GUNLER, PROLOG_REHBER } from '../data/prolog.js';
import { MOD_EK_ETKILERI } from '../data/production.js';
import KONSOL_YERLESIM from '../data/konsol-yerlesim.json';
import { ARASTIRMALAR, GOREVLER, MASA_ARASTIRMA, BATARYA_KAPASITE, OYUNCU_CALISMA_MALIYETI } from '../data/research.js';
import { ODALAR } from '../data/rooms.js';
import { PANELLER } from '../data/panels.js';
import { kayitOku, gunBasiniKaydet } from '../kayit.js';
import { kararAciklamasi, gununKararlari, ogrenmeOzeti } from '../ogrenme.js';
import { DIYALOG } from '../data/dialogues.js';
import { HIKAYE } from '../data/story.js';
import { HAZIRLIK_MALIYETI } from '../data/events.js';
import { BILGILER } from '../data/facts.js';
import { KESIF_NOKTALARI } from '../data/exploration.js';
import { KURUCULAR } from '../data/visitors.js';
import { portreDosyasi, hikayeDosyasi, ARAYUZ_ASSET_KLASORU, ARAYUZ_IKONLARI, KARAR_GORSELLERI, SON_GORSELLERI, sakinGorselTanimi } from '../data/assets.js';
import { assetVar } from '../assetListesi.js';
import { muzikCal, sesCal, sesAcikMi, sesToggle, muzikSeviyesi, efektSeviyesi, muzikSeviyeAyarla, efektSeviyeAyarla } from '../sesler.js';

const hud = document.getElementById('hud');
const modal = document.getElementById('modal');
const kart = modal.querySelector('.kart');

let acik = false;
let kapatilabilir = true;
let aktifPanel = null;
let aktifPanelAnahtar = null;
let panoAcik = false;
let panoBolumu = 'koloni';
let insaatOda = null;
let sonMesaj = '';
let seciliKesif = null; // panoda seçilmiş keşif noktası (kişi seçimi bekliyor)

// Sahne ile arayüz arasında basit olay köprüsü
function yayinla(ad, ayrinti = {}) {
  window.dispatchEvent(new CustomEvent('oyun:' + ad, { detail: ayrinti }));
}

export function gunBasligi(gun, olayAd, bitince) {
  sesCal('ses-gun-basi');
  yayinla('gunBasligi', { gun, olayAd, onBitti: bitince });
}

export const acikMi = () => acik;

// ---------------------------------------------------------------
//  Yardımcılar
// ---------------------------------------------------------------
const kacis = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// Görsel varsa gösterilir, yoksa (yüklenemezse) kaldırılır ve emoji yedeği görünür
const portreOneki = (id) => (KURUCULAR.some((k) => k.id === id) ? 'kurucu' : 'ziyaretci');
// Dosya public/assets'te yoksa <img> hiç eklenmez (404 olmaz)
const varsaImg = (yol, sinif = '') => {
  const ad = yol.slice(ARAYUZ_ASSET_KLASORU.length);
  return assetVar(ad) ? `<img ${sinif ? `class="${sinif}" ` : ''}src="${yol}" alt="" onerror="this.remove()">` : '';
};
// Görseller dekoratiftir; anlamı yanındaki metin ve HUD title taşır.
function arayuzIkonu(id, yedek = '') {
  const ad = ARAYUZ_IKONLARI[id];
  const resim = ad && varsaImg(`${ARAYUZ_ASSET_KLASORU}ikon-${ad}.png`, 'arayuz-ikon');
  // Yeni ikonlar gelene kadar fontta bulunmayan emoji yerine okunur kısaltma.
  const metin = { malzeme: 'M', yagmurSuyu: 'YS', yagmurDeposu: 'SD', suDeposu: 'GH', onarimTezgahi: 'ON', insaat: 'İŞ', bosta: 'Zz' }[id];
  return resim || (metin ? `<span class="ikon-metin" title="${kacis(metin === 'M' ? 'Malzeme' : ad || id)}">${metin}</span>` : yedek);
}
const arayuzGorseli = (onek, ad, sinif) => ad ? varsaImg(`${ARAYUZ_ASSET_KLASORU}${onek}-${ad}.png`, sinif) : '';

const sakinPortresi = (id, sinif = '') => varsaImg(`${ARAYUZ_ASSET_KLASORU}${sakinGorselTanimi(id, assetVar).dosya}`, `sakin-portre ${sinif}`);
const portreRozet = (id, ikon) =>
  `<span class="ikon-rozet portre">${state.sakinler?.some((s) => s.id === id) ? sakinPortresi(id) : varsaImg(portreDosyasi(portreOneki(id), id))}<span class="ikon-yedek">${ikon}</span></span>`;
// Kanonik yüz portresi, eski mockup rozetinden önce gelir (kimlik eşleşmesi).
const yuzPortresi = (id, ikon) => {
  const yol = portreDosyasi(portreOneki(id), id);
  if (assetVar(yol.slice(ARAYUZ_ASSET_KLASORU.length))) return `<span class="ikon-rozet portre yuz">${varsaImg(yol)}</span>`;
  if (assetVar(`rozet-${id}.png`)) return `<span class="ikon-rozet portre yuz">${varsaImg(`${ARAYUZ_ASSET_KLASORU}rozet-${id}.png`)}</span>`;
  return portreRozet(id, ikon);
};
const diyalogPortresi = (id) => id === 'oyuncu'
  ? varsaImg(`${ARAYUZ_ASSET_KLASORU}portre-oyuncu.png`, 'diyalog-portre') || varsaImg(`${ARAYUZ_ASSET_KLASORU}oyuncu.png`, 'diyalog-portre')
  : varsaImg(portreDosyasi(portreOneki(id), id), 'diyalog-portre') || sakinPortresi(id, 'diyalog-portre');
const oyunLogosu = (sinif = 'oyun-logo') => varsaImg(`${ARAYUZ_ASSET_KLASORU}${assetVar('logo-apoclimate.png') ? 'logo-apoclimate.png' : 'logo.png'}`, sinif);
const portreBuyuk = (id) => varsaImg(portreDosyasi(portreOneki(id), id), 'portre-buyuk');

// CSS özel değişkenindeki göreli url stil dosyasına göre çözülür; sayfa adresine göre mutlak yap
const cssUrl = (ad) => `url('${new URL(ARAYUZ_ASSET_KLASORU + ad, document.baseURI).href}')`;

// Mockup piksel kutusunu [x0,y0,x1,y1] → mutlak yüzde konuma çevirir
const yuzdeYer = (r, W, H) => `left:${(r[0] / W) * 100}%;top:${(r[1] / H) * 100}%;width:${((r[2] - r[0]) / W) * 100}%;height:${((r[3] - r[1]) / H) * 100}%`;

const paragraf = (s) => kacis(s).split('\n\n').map((p) => `<p>${p}</p>`).join('');

function etkiChipleri(etki) {
  return Object.entries(etki || {})
    .filter(([, d]) => d !== 0)
    .map(([ad, d]) => {
      const k = KAYNAKLAR[ad];
      const iyi = (d > 0) === k.yuksekIyi;
      return `<span class="chip ${iyi ? 'iyi' : 'kotu'}">${arayuzIkonu(ad, k.ikon)} ${d > 0 ? '+' : '−'}${Math.abs(d)} ${k.ad}</span>`;
    })
    .join('');
}

function barSinifi(ad, deger) {
  const iyilik = KAYNAKLAR[ad].yuksekIyi ? deger : 100 - deger;
  return iyilik >= 50 ? 'iyi' : iyilik >= 25 ? 'orta' : 'kotu';
}

const eylemNoktalari = () =>
  Array.from({ length: Math.max(AYAR.eylemHakki, state.eylem) }, (_, i) =>
    `<i class="${i < state.eylem ? 'dolu' : ''}"></i>`).join('');

function modalAc(html, { kapatma = true, sinif = '', tema = null } = {}) {
  const oncekiKaydirma = panoAcik ? kart.querySelector('.kart-icerik')?.scrollTop || 0 : 0;
  panoAcik = false; // pano kendini çizdikten sonra tekrar açar
  kart.innerHTML = `<div class="kart-icerik" tabindex="0" aria-label="Pencere içeriği">${html}</div>`;
  const icerik = kart.querySelector('.kart-icerik');
  const gecis = icerik.querySelector('.pano-gecis');
  if (gecis && !gecis.closest('.yonetim-parcali')) kart.prepend(gecis);
  const alt = icerik.querySelector(':scope > .alt');
  if (alt) kart.append(alt);
  kart.className = 'kart ' + sinif;
  // Konsol ve yönetim pencerelerinde isteğe bağlı sarmaşıklı çerçeve (konsol-cerceve.png, 9-dilim)
  if (sinif.includes('konsol-kart') && assetVar('konsol-cerceve.png')) kart.style.borderImageSource = cssUrl('konsol-cerceve.png');
  else kart.style.removeProperty('border-image-source');
  modal.classList.toggle('menu-ortami', sinif === 'baslangic' || sinif === 'hikaye');
  if (tema) kart.style.setProperty('--tema', tema);
  else kart.style.removeProperty('--tema');
  kapatilabilir = kapatma;
  modal.classList.remove('gizli');
  icerik.scrollTop = oncekiKaydirma;
  acik = true;
  kart.querySelectorAll('[data-kapat]').forEach((b) => b.addEventListener('click', modalKapat));
  // Modal içindeki tüm buton tıklamalarına ince bir UI klik sesi (eylem/
  // panel-onay vb. zaten kendi özel seslerini çalar, bu üstüne biner).
  kart.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => sesCal('ses-tiklama', { ses: 0.35 })));
}

export function modalKapat() {
  modal.classList.add('gizli');
  acik = false;
  aktifPanel = null;
  aktifPanelAnahtar = null;
  panoAcik = false;
  sonMesaj = '';
}

document.addEventListener('keydown', (e) => {
  if (!acik) return;
  if (e.key === 'Escape' && kapatilabilir) {
    e.preventDefault();
    modalKapat();
  } else if (aktifPanel && /^[1-9]$/.test(e.key)) {
    kart.querySelector(`.modul[data-i="${Number(e.key) - 1}"], .eylem[data-i="${Number(e.key) - 1}"]`)?.click();
  } else if (e.key === 'Enter') {
    const b = kart.querySelector('[data-varsayilan]');
    if (b) { e.preventDefault(); b.click(); }
  }
});

function hudGorunurlugu(gorunur) {
  const deger = gorunur ? '' : 'hidden';
  hud.style.visibility = deger;
  const erisim = document.querySelector('.yonetim-erisim');
  if (erisim) erisim.style.visibility = deger;
}

// ---------------------------------------------------------------
//  HUD
// ---------------------------------------------------------------
// Mockup HUD şeridi (hud-serit.jpg, 2172×240) ve alt şerit (alt-serit.jpg, 2172×238); tools/ekran-zemin.py
const HUD_F = 1.086;
const hd = (x0, y0, x1, y1) => [x0 * HUD_F, y0 * HUD_F, x1 * HUD_F, y1 * HUD_F];
const hy = (r) => yuzdeYer(r, 2172, 240);
function hudResimliHtml() {
  const kutular = { enerji: 278, su: 475, gida: 675, atik: 875, karbon: 1075 };
  const kaynak = (ad, x0, ekler = '') => `<div class="kaynak hr-kaynak" data-k="${ad}" ${ekler}>
      <div class="bar hr-bar" style="${hy(hd(x0 + 62, 110, x0 + 130, 136))}"><i></i></div>
      <b class="hr-deger" style="${hy(hd(x0 + 132, 100, x0 + 192, 145))}"></b></div>`;
  return `
    <div class="hr-gun" style="${hy(hd(60, 50, 218, 100))}"><span data-gun-etiket>GÜN</span> <b data-gun></b> <span data-gun-max>/ ${AYAR.maxGun}</span></div>
    <span class="noktalar hr-eylem" data-eylem style="${hy(hd(178, 106, 250, 134))}"></span>
    <span class="hr-nufus" style="${hy(hd(95, 138, 175, 174))}"><b data-nufus></b> kişi</span>
    ${Object.entries(kutular).map(([ad, x0]) => kaynak(ad, x0, `title="${KAYNAKLAR[ad].ad}${KAYNAKLAR[ad].yuksekIyi ? '' : ' (düşük olması iyi)'}"`)).join('')}
    <div class="hud-arastirma hr-kaynak" data-arastirma title="Aktif araştırma"><span class="ikon" data-ar-ikon hidden></span>
      <div class="bar hr-bar" style="${hy(hd(1337, 110, 1405, 136))}"><i data-ar-bar></i></div><b class="hr-deger" data-ar-puan style="${hy(hd(1407, 100, 1467, 145))}"></b></div>
    <div class="hud-memnuniyet hr-kaynak" data-memnuniyet><span class="ikon" hidden></span>
      <div class="bar hr-bar" style="${hy(hd(1552, 110, 1620, 136))}"><i data-mem-bar></i></div><b class="hr-deger" data-mem style="${hy(hd(1622, 100, 1682, 145))}"></b></div>
    <div class="hud-batarya hr-batarya" data-batarya title="Batarya deposu" style="${hy(hd(1275, 196, 1462, 250))}">🔋 <div class="bar"><i data-bat-bar></i></div><b data-bat></b></div>
    <div class="hud-denge hr-denge"><b data-denge style="${hy(hd(1820, 52, 1886, 98))}"></b>
      <div class="bar denge" style="${hy(hd(1738, 106, 1952, 138))}"><i></i></div></div>`;
}
const ERISIM_KUTULARI = [hd(68, 58, 283, 155), hd(308, 58, 520, 155), hd(541, 58, 749, 155), hd(770, 58, 1023, 155), hd(1049, 58, 1258, 155), hd(1283, 58, 1500, 155)];

export function hudKur() {
  const resimli = assetVar('hud-serit.jpg');
  hud.classList.toggle('hud-resimli', resimli);
  if (resimli) hud.style.setProperty('--hud-zemin', cssUrl('hud-serit.jpg'));
  hud.innerHTML = resimli ? hudResimliHtml() : `
    <div class="hud-gun">
      <div class="gun"><span data-gun-etiket>GÜN</span> <b data-gun></b><span data-gun-max>/ ${AYAR.maxGun}</span></div>
      <div class="eylem-hakki" title="Kalan eylem hakkı"><span>${arayuzIkonu('eylem')} Eylem</span><span class="noktalar" data-eylem></span></div>
      <div class="nufus" title="Sığınaktaki kişi sayısı">${arayuzIkonu('nufus', '👥')} <b data-nufus></b> kişi</div>
    </div>
    <div class="hud-kaynaklar">
      ${Object.entries(KAYNAKLAR).map(([ad, k]) => `
        <div class="kaynak" data-k="${ad}" title="${k.ad}${k.yuksekIyi ? '' : ' (düşük olması iyi)'}">
          <span class="ikon">${arayuzIkonu(ad, k.ikon)}</span>
          <span class="kaynak-govde"><span class="kaynak-ad">${k.ad}</span><div class="bar"><i></i></div></span>
          <b></b>
        </div>`).join('')}
    </div>
    <div class="hud-ekstra">
      <div class="kaynak hud-arastirma" data-arastirma title="Aktif araştırma">
        <span class="ikon" data-ar-ikon>${arayuzIkonu('arastirma', '🧪')}</span>
        <span class="kaynak-govde"><span class="kaynak-ad">Araştırma</span><div class="bar"><i data-ar-bar></i></div></span>
        <b data-ar-puan></b>
      </div>
      <div class="kaynak hud-memnuniyet" data-memnuniyet title="Sakinlerin memnuniyeti (yönetime güven)">
        <span class="ikon">${arayuzIkonu('memnuniyet', '🙂')}</span>
        <span class="kaynak-govde"><span class="kaynak-ad">Memnuniyet</span><div class="bar"><i data-mem-bar></i></div></span>
        <b data-mem></b>
      </div>
      <div class="kaynak hud-batarya" data-batarya title="Batarya deposu">
        <span class="ikon">${arayuzIkonu('bataryaHud', '🔋')}</span>
        <span class="kaynak-govde"><span class="kaynak-ad">Batarya</span><div class="bar"><i data-bat-bar></i></div></span>
        <b data-bat></b>
      </div>
    </div>
    <div class="hud-denge">
      <div class="denge-etiket"><span>Distopya</span><b data-denge></b><span>Ütopya</span></div>
      <div class="bar denge"><i></i></div>
    </div>`;
  const erisim = document.createElement('nav');
  erisim.className = 'yonetim-erisim';
  erisim.setAttribute('aria-label', 'Sığınak yönetimi');
  const altResimli = assetVar('alt-serit.jpg');
  erisim.classList.toggle('erisim-resimli', altResimli);
  if (altResimli) {
    const ay = (r) => yuzdeYer(r, 2172, 238);
    erisim.style.setProperty('--alt-zemin', cssUrl('alt-serit.jpg'));
    erisim.innerHTML = Object.entries(YONETIM_BOLUMLERI).map(([id, ad], i) => `<button data-yonetim="${id}" aria-label="${ad}" style="${ay(ERISIM_KUTULARI[i])}"></button>`).join('')
      + `<button class="ayarlar-btn" data-ayarlar title="Ayarlar" aria-label="Ayarlar" style="${ay(hd(1545, 58, 1660, 155))}"></button><b class="er-malzeme" data-malzeme style="${ay(hd(1866, 64, 1934, 144))}" title="Geri kazanılmış yapı malzemesi; denge puanına dahil değildir"></b>`;
  } else erisim.innerHTML = Object.entries(YONETIM_BOLUMLERI).map(([id, ad]) => `<button data-yonetim="${id}">${ad}</button>`).join('')
    + `<button class="ayarlar-btn" data-ayarlar title="Ayarlar">⚙</button><span class="malzeme-stok" title="Geri kazanılmış yapı malzemesi; denge puanına dahil değildir">${arayuzIkonu('malzeme')}Malzeme <b data-malzeme></b></span>`;
  document.querySelector('.yonetim-erisim')?.remove();
  modal.before(erisim);
  erisim.querySelectorAll('button[data-yonetim]').forEach((b) => b.addEventListener('click', () => {
    if ((!acik || panoAcik) && !state.bitti) panoAc(b.dataset.yonetim);
  }));
  // Pencereler HUD'un altından başlasın: kaynak şeridi hiç örtülmesin.
  const sahne = document.getElementById('sahne');
  const hudYuksekligi = () => sahne.style.setProperty('--hud-h', `${hud.offsetHeight}px`);
  if (window.ResizeObserver) new ResizeObserver(hudYuksekligi).observe(hud);
  hudYuksekligi();
  erisim.querySelector('[data-ayarlar]').addEventListener('click', () => {
    if (!acik) ayarlarAc();
  });
  abone(hudGuncelle);
  hudGuncelle(state);
}

function hudGuncelle(s) {
  if (!s.kaynak) return;
  document.querySelector('[data-malzeme]').textContent = s.malzeme;
  const prolog = prologAktif();
  hud.querySelector('[data-gun-etiket]').textContent = prolog ? 'PROLOG' : 'GÜN';
  hud.querySelector('[data-gun]').textContent = prolog ? s.prolog.gun : s.gun;
  hud.querySelector('[data-gun-max]').textContent = `/ ${prolog ? PROLOG_GUNLER.length : AYAR.maxGun}`;
  hud.querySelector('[data-eylem]').innerHTML = eylemNoktalari();
  hud.querySelector('[data-nufus]').textContent = s.nufus;
  for (const ad of Object.keys(KAYNAKLAR)) {
    const el = hud.querySelector(`[data-k="${ad}"]`);
    const v = s.kaynak[ad];
    const bar = el.querySelector('i');
    bar.style.width = v + '%';
    bar.className = barSinifi(ad, v);
    el.querySelector('b').textContent = v;
  }
  hud.querySelector('[data-denge]').textContent = s.denge;
  hud.querySelector('.denge i').style.width = s.denge + '%';

  // Araştırma göstergesi: aktif proje varsa görün
  const arBox = hud.querySelector('[data-arastirma]');
  const ar = s.arastirma?.aktif ? ARASTIRMALAR[s.arastirma.aktif] : null;
  if (ar) {
    arBox.style.display = '';
    arBox.title = `Aktif araştırma: ${ar.ad}`;
    const puan = s.arastirma.puan?.[s.arastirma.aktif] || 0;
    const yuzde = Math.min(100, Math.round((puan / ar.maliyet) * 100));
    arBox.querySelector('[data-ar-ikon]').innerHTML = arayuzIkonu(s.arastirma.aktif, ar.ikon);
    const barAr = arBox.querySelector('[data-ar-bar]');
    barAr.style.width = yuzde + '%';
    barAr.className = yuzde >= 50 ? 'iyi' : yuzde >= 25 ? 'orta' : 'kotu';
    arBox.querySelector('[data-ar-puan]').textContent = `${puan}/${ar.maliyet}`;
  } else if (hud.classList.contains('hud-resimli')) {
    arBox.querySelector('[data-ar-bar]').style.width = '0%';
    arBox.querySelector('[data-ar-puan]').textContent = '—';
  } else {
    arBox.style.display = 'none';
  }

  // Memnuniyet göstergesi (GDD bölüm 11)
  const mem = s.memnuniyet ?? AYAR.baslangicMemnuniyet;
  const memBar = hud.querySelector('[data-mem-bar]');
  memBar.style.width = mem + '%';
  memBar.className = mem >= 50 ? 'iyi' : mem >= AYAR.itirazEsigi ? 'orta' : 'kotu';
  hud.querySelector('[data-mem]').textContent = mem;
  hud.querySelector('[data-memnuniyet] .ikon').innerHTML = arayuzIkonu('memnuniyet', mem >= 50 ? '🙂' : mem >= AYAR.itirazEsigi ? '😐' : '😠');
  hud.querySelector('[data-memnuniyet]').title = `Memnuniyet ${mem}/100. Üst üste ${AYAR.guvenOylamasiGece} gece ${AYAR.guvenOylamasiEsigi} veya altında kalırsa güven oylaması yapılır.`;

  // Batarya göstergesi: ancak Batarya Deposu araştırması bittiyse
  const batBox = hud.querySelector('[data-batarya]');
  if (arastirmaAcik('batarya')) {
    batBox.style.display = '';
    const yuzde = Math.min(100, Math.round((s.batarya / BATARYA_KAPASITE) * 100));
    const barBat = batBox.querySelector('[data-bat-bar]');
    barBat.style.width = yuzde + '%';
    barBat.className = yuzde >= 50 ? 'iyi' : yuzde >= 25 ? 'orta' : 'kotu';
    batBox.querySelector('[data-bat]').textContent = s.batarya;
    batBox.title = `Batarya: ${s.batarya} / ${BATARYA_KAPASITE}`;
  } else {
    batBox.style.display = 'none';
  }

  prologHedefGuncelle();
  if (aktifPanel) panelCiz();
  if (panoAcik) panoCiz();
}

// Prologda HUD altında o anki hedefi gösteren ince şerit
function prologHedefGuncelle() {
  let el = document.querySelector('.prolog-hedef');
  if (!prologAktif()) { el?.remove(); return; }
  if (!el) {
    el = document.createElement('div');
    el.className = 'prolog-hedef';
    modal.before(el);
  }
  const p = state.prolog, gun = prologGunu();
  const etiket = `<b>Prolog ${p.gun}/${PROLOG_GUNLER.length}</b> · `;
  const bekleyen = prologBekleyenPanel();
  el.innerHTML = etiket + (prologGunTamam()
    ? (prologTamam() ? 'Ekip tamam. Yatağa git: sabah Gün 1 başlıyor.' : 'Bugünün işleri bitti. Yaşam alanındaki yatağa git.')
    : bekleyen
      ? `<b>${kacis(sakinTanimi(makineOperatoru(bekleyen).id).ad)}</b> ${kacis(MAKINELER[bekleyen].ad)} odasına geçti. Oradaki konsola git, <b>E</b> ile aç ve birlikte öğren.`
    : prologPanoSirasi()
      ? 'Yaşam alanındaki <b>Sığınak Yönetimi</b> panosuna git (ya da sol alttaki düğmeler).'
    : p.kapida
      ? `Kapı çalıyor! Kapıya git: <b>${kacis(KURUCULAR[p.sira].ad)}</b> geldi.`
      : `${kacis(gun.baslik)} · Ekip yolda (${p.sira}/${KURUCULAR.length}). Beklerken odaları gez.`);
}

// ---------------------------------------------------------------
//  KONTROL KONSOLU (oda başına tasarım: panels.js → konsol)
// ---------------------------------------------------------------
let konsolOnizleme = null;   // üstüne gelinen kontrolün sırası
let konsolOnceki = null;     // eylemden önceki kaynaklar (göstergeler buradan kayar)
let konsolSonBasilan = null; // basılan kontrol (bir kez animasyon oynar)
const rehberAdimlari = {};   // prolog: panel -> rehber adımı

export function panelAc(def, anahtar = null) {
  if (!prologAktif()) panelIncelendi(anahtar);
  aktifPanel = def;
  aktifPanelAnahtar = anahtar;
  sonMesaj = '';
  konsolOnizleme = null;
  panelCiz();
}

// Etkiyi küçük ikon + sayı rozetlerine çevirir (kontrol üstü)
function kisaEtki(etki, eylem) {
  const parca = Object.entries(etki || {}).filter(([, d]) => d).map(([ad, d]) => {
    const k = KAYNAKLAR[ad];
    const iyi = (d > 0) === k.yuksekIyi;
    return `<span class="mini-etki ${iyi ? 'iyi' : 'kotu'}" title="${k.ad}">${arayuzIkonu(ad, k.ikon)}${d > 0 ? '+' : '−'}${Math.abs(d)}</span>`;
  });
  if (eylem?.geriKazanim) parca.push(`<span class="mini-etki iyi" title="Malzeme">${arayuzIkonu('malzeme', '🧱')}+${geriKazanimMiktari(eylem)}</span>`);
  return parca.join('');
}

// Odanın ana kaynağı için gece hesabı: ihtiyaç, makine üretimi, net
function odaHesabi(id, ana) {
  const sabit = (prologAktif() ? PROLOG_AYAR.geceDegisim : AYAR.gunSonuDegisim)[ana] || 0;
  const kisi = nufusTuketimi()[ana] || 0;
  const calisiyor = makineCalisiyorMu(id) && !makineKapali(id);
  const uretim = calisiyor ? (makineUretimi(id)[ana] || 0) : 0;
  const net = (prologAktif() ? prologGeceTahmini() : geceTahmini()).degisim[ana] || 0;
  return { ihtiyac: sabit + kisi, uretim, net, calisiyor };
}

function odaGorseliHtml(tip, id) {
  const k = state.kaynak;
  if (tip === 'tank' && assetVar('konsol-tank.png')) {
    const cam = (x, v) => `<span class="k-tank-cam" style="left:${x}%"><i style="height:${Math.max(0, Math.min(100, v))}%"></i></span>`;
    return `<div class="k-tank-resim" style="--tank-resim:${cssUrl('konsol-tank.png')}">${cam(37, k.su * 1.1)}${cam(65, k.su * 0.9)}</div>`;
  }
  if (tip === 'tank') {
    const tank = (v, ad) => `<div class="k-tank"><i style="height:${v}%"></i><span>${ad}</span></div>`;
    return `<div class="k-tanklar">${tank(Math.min(100, k.su * 1.15), 'T1')}${tank(Math.max(0, k.su * 0.85), 'T2')}</div>`;
  }
  if (tip === 'saksi') {
    const saglik = Math.round((k.gida + state.denge) / 2);
    return `<div class="k-saksilar">${Array.from({ length: 7 }, (_, i) => {
      const boy = Math.max(12, Math.min(100, saglik + ((i * 37) % 21) - 10));
      return `<span class="k-saksi ${saglik < 35 ? 'solgun' : ''}"><i style="height:${boy}%"></i></span>`;
    }).join('')}</div>`;
  }
  if (tip === 'yigin') {
    return `<div class="k-yigin"><i style="height:${Math.max(6, k.atik)}%"></i></div>
      <div class="k-malzeme">${arayuzIkonu('malzeme', '🧱')}<b>${state.malzeme}</b><small>malzeme</small></div>`;
  }
  // sayac: yarım daire ibre (enerji)
  return `<div class="k-sayac" style="--deger:${k.enerji}"><i></i><b>${k.enerji}</b><small>kWh·sığınak</small></div>`;
}

// Bütün resimli zeminden bağımsız, yeniden kullanılabilir parçalar.
function konsolParcalariHazir() {
  return ['ui-panel-cerceve.png', 'ui-panel-metal.jpg', 'ui-dugme-cerceve.png', 'ui-bakim.png'].every(assetVar);
}

function konsolOdaParcasiHtml(tip, id) {
  const dosya = tip === 'saksi' ? 'ui-oda-sera.png' : tip === 'yigin' ? 'ui-oda-geri.png' : null;
  if (!dosya || !assetVar(dosya)) return odaGorseliHtml(tip, id);
  const saglik = Math.max(0, Math.min(1, (state.kaynak.gida + state.denge) / 110));
  const stil = tip === 'saksi' ? `;filter:saturate(${saglik}) brightness(${0.6 + 0.4 * saglik})` : '';
  return `<div class="k-oda-parcasi" style="background-image:${cssUrl(dosya)}${stil}">${tip === 'yigin' ? `<div class="k-malzeme">${arayuzIkonu('malzeme', '🧱')}<b>${state.malzeme}</b><small>malzeme</small></div>` : ''}</div>`;
}

function konsolHtml(def, id) {
  const ks = def.konsol;
  const op = makineOperatoru(id);
  const oyuncu = state.oyuncuMakineler.includes(id);
  const kapali = prologAktif() && !op;
  const rehber = prologAktif() && op && !prologPanelOgrenildi(id) ? PROLOG_REHBER[id] : null;
  const adim = rehber ? rehber[rehberAdimlari[id] || 0] || null : null;
  const once = konsolOnceki || state.kaynak;
  const onizle = konsolOnizleme != null ? def.eylemler[konsolOnizleme] : null;

  const gostergeler = def.gosterge.map((ad) => {
    const k = KAYNAKLAR[ad], v = state.kaynak[ad];
    const d = onizle?.etki?.[ad] || 0;
    const sonra = Math.max(0, Math.min(100, v + d));
    const iyi = (d > 0) === k.yuksekIyi;
    const golge = d ? `<u class="${iyi ? 'iyi' : 'kotu'}" style="left:${Math.min(v, sonra)}%;width:${Math.abs(sonra - v)}%"></u>` : '';
    return `<div class="k-gosterge"><span>${arayuzIkonu(ad, k.ikon)}${k.ad}</span>
      <div class="bar"><i class="${barSinifi(ad, v)}" style="width:${once[ad]}%" data-hedef="${v}"></i>${golge}</div>
      <b>${v}${d ? `<em class="${iyi ? 'iyi' : 'kotu'}">→${sonra}</em>` : ''}</b></div>`;
  }).join('');

  const h = odaHesabi(id, ks.ana);
  const anaK = KAYNAKLAR[ks.ana];
  const netIyi = (h.net >= 0) === anaK.yuksekIyi;
  const isaret = (n) => (n > 0 ? '+' : n < 0 ? '−' : '±') + Math.abs(n);
  const ihtiyac = `<div class="k-ihtiyac" data-rehber="ihtiyac">
      <div><small>${anaK.yuksekIyi ? 'Gece tüketimi' : 'Gece birikimi'}</small><b class="kotu">${isaret(h.ihtiyac)}</b></div>
      <div><small>Makine üretimi</small><b class="${h.calisiyor ? 'iyi' : 'kotu'}">${h.calisiyor ? isaret(h.uretim) : 'durdu'}</b></div>
      <div class="net"><small>Bu gece net ${anaK.ad.toLowerCase()}</small><b class="${netIyi ? 'iyi' : 'kotu'}">${isaret(h.net)}</b></div>
    </div>`;

  const ekranMetin = onizle
    ? `<b>${kacis(onizle.ad)}</b>${onizle.kirli ? ' <em class="kirli-etiket">⚠ kirletir</em>' : ''}<span>${kacis(onizle.mesaj || '')}</span>`
    : sonMesaj ? `<span class="k-mesaj">&gt; ${kacis(sonMesaj)}</span>` : `<span>${kacis(def.aciklama)}</span>`;

  const modulListesi = def.eylemler.map((e, i) => {
    const m = ks.moduller[i] || { tip: 'dugme', ikon: '•', kisa: e.ad, fiil: 'Yap' };
    const yapabilir = eylemYapabilirMi(e);
    const kilit = kapali || (adim && !(adim.tur === 'eylem' && adim.i === i)) || !yapabilir;
    const neden = kapali ? 'Kapalı' : !yapabilir ? (state.eylem < (e.maliyet ?? 1) ? 'Eylem yok' : 'Kaynak yetersiz') : '';
    // modul-<ad>.png yazısız sahne kartıdır: kutunun arka planını kaplar (docs/tasarim-referans/konsol-*.jpg)
    const resim = m.gorsel && assetVar(`modul-${m.gorsel}.png`) ? `style="--modul-resim:${cssUrl(`modul-${m.gorsel}.png`)};--etiket-x:${m.etiketX ?? 50}"` : '';
    return `<button class="modul modul-${m.tip} ${resim ? 'resimli' : ''} ${e.kirli ? 'kirli' : ''} ${kilit ? 'kilitli' : ''} ${konsolSonBasilan === i ? 'calisti' : ''}" data-i="${i}" data-rehber="modul-${i}" aria-disabled="${kilit}" title="${kacis(e.ad)}" ${resim}>
      ${resim ? '<span class="modul-arka" aria-hidden="true"></span>' : ''}<span class="modul-mekanik"><span class="modul-ikon">${m.ikon}</span><i class="modul-parca"></i></span>
      <span class="modul-ad">${kacis(m.kisa)}</span>
      <span class="modul-etki">${kisaEtki(e.etki, e)}</span>
      <span class="modul-fiil">${neden || `${kacis(m.fiil)} · ${e.maliyet ?? 1}<i class="pip"></i>`}</span>
    </button>`;
  });
  const moduller = modulListesi.join('');

  const modlar = Object.entries(CALISMA_MODLARI).map(([mod, b], i) =>
    `<button class="k-mod ${state.makineModlari[id] === mod ? 'secili' : ''}" data-mod="${mod}" data-makine="${id}" title="${kacis(b.aciklama)}" ${kapali || (adim && adim.tur !== 'mod') ? 'disabled' : ''}>${kacis(b.ad)}</button>`).join('');
  const modIndex = Object.keys(CALISMA_MODLARI).indexOf(state.makineModlari[id]);
  const asinma = state.makineAsinma[id];

  const operator = op
    ? `${yuzPortresi(op.id, sakinTanimi(op.id).ikon)}<span><small>Operatör</small><b>${kacis(sakinTanimi(op.id).ad)}</b></span>`
    : oyuncu ? `<span class="ikon-rozet">🧍</span><span><small>Operatör</small><b>Sen (bugün)</b></span>`
    : `<span class="ikon-rozet uyari">!</span><span><small>Operatör</small><b class="kotu">YOK</b></span>${prologAktif() ? '' : `<button class="k-kendin" data-kendin ${kendinCalisabilirMi(id) ? '' : 'disabled'}>Kendin çalış · ${OYUNCU_CALISMA_MALIYETI}<i class="pip"></i></button>`}`;

  const durum = kapali ? 'ÇEVRİMDIŞI' : makineCalisiyorMu(id) ? 'ÇEVRİMİÇİ' : 'BEKLEMEDE';

  // Mockup zeminli yerleşim: panel-<id>.jpg + konsol-yerlesim.json (tools/konsol-arka.py)
  const Y = KONSOL_YERLESIM.konsollar[id];
  const parcali = konsolParcalariHazir();
  if (!parcali && Y && kapali && assetVar(`panel-${id}-kapali.jpg`)) {
    const ky = (r) => yuzdeYer(r, ...KONSOL_YERLESIM.boyut);
    return `
  <div class="konsol konsol-resimli konsol-ariza" style="--panel:${cssUrl(`panel-${id}-kapali.jpg`)}">
    <div class="kr kr-ariza-rozet" data-rehber="operator" style="${ky([1349, 91, 1581, 187])}"><span>⚠</span><span><small>OPERATÖR</small><b>YOK</b></span></div>
    <div class="kr kr-ariza-mesaj" style="${ky([300, 330, 1372, 600])}"><b>⚠ OPERATÖR YOK</b><p>${kacis(PROLOG_METIN.panelBos)}</p>
      <div class="kr-ariza-onizleme">${def.eylemler.map((e) => `<span>${kacis(e.ad)}</span>`).join('')}</div></div>
    <button class="kr kr-kapat" data-kapat style="${ky([1385, 752, 1584, 840])}" aria-label="Kapat (Esc)"></button>
  </div>`;
  }
  if (!parcali && Y && assetVar(`panel-${id}.jpg`)) {
    const [W, H] = KONSOL_YERLESIM.boyut;
    const yer = (r) => `left:${(r[0] / W) * 100}%;top:${(r[1] / H) * 100}%;width:${((r[2] - r[0]) / W) * 100}%;height:${((r[3] - r[1]) / H) * 100}%`;
    const birlesik = (rs) => [Math.min(...rs.map((r) => r[0])), Math.min(...rs.map((r) => r[1])), Math.max(...rs.map((r) => r[2])), Math.max(...rs.map((r) => r[3]))];
    const degerler = [
      [isaret(h.ihtiyac), 'kotu'],
      [h.calisiyor ? isaret(h.uretim) : 'durdu', h.calisiyor ? 'iyi' : 'kotu'],
      [isaret(h.net), netIyi ? 'iyi' : 'kotu'],
    ].map(([v, c], i) => `<b class="kr kr-deger ${c}" style="${yer(Y.degerler[i])}">${v}</b>`).join('');
    // Canlı oda katmanı (zemindeki çizimin üstünde)
    let oda = '';
    if (ks.oda === 'sayac') oda = odaGorseliHtml('sayac', id);
    else if (ks.oda === 'tank') oda = (Y.tanklar || []).map((x, i) => `<span class="k-tank-cam" style="left:${x * 100}%"><i style="height:${Math.max(0, Math.min(100, state.kaynak.su * (i ? 0.9 : 1.1)))}%"></i></span>`).join('');
    const saksiSolma = Math.max(0, Math.min(1, (55 - (state.kaynak.gida + state.denge) / 2) / 35));
    const solgun = ks.oda === 'saksi' && Y.saksilar
      ? `<span class="kr kr-solgun" style="${yer(Y.saksilar)};opacity:${saksiSolma.toFixed(2)};background-image:${cssUrl(`panel-${id}.jpg`)};background-size:${(W / (Y.saksilar[2] - Y.saksilar[0])) * 100}% ${(H / (Y.saksilar[3] - Y.saksilar[1])) * 100}%;background-position:${(Y.saksilar[0] / (W - (Y.saksilar[2] - Y.saksilar[0]))) * 100}% ${(Y.saksilar[1] / (H - (Y.saksilar[3] - Y.saksilar[1]))) * 100}%"></span>` : '';
    const malzeme = Y.malzeme ? `<span class="kr kr-malzeme" style="${yer(Y.malzeme)}">${arayuzIkonu('malzeme', '🧱')}<b>${state.malzeme}</b> malzeme</span>` : '';
    const kutular = modulListesi.map((html, i) => `<div class="kr kr-kutu" style="${yer(Y.kutular[i])}">${html}</div>`).join('');
    const opHtml = op
      ? `<span class="kr-portre" style="width:${((Y.portre[2] - Y.portre[0]) / (Y.operator[2] - Y.operator[0])) * 100}%">${yuzPortresi(op.id, sakinTanimi(op.id).ikon)}</span><span class="kr-op-metin"><small>OPERATÖR</small><b>${kacis(sakinTanimi(op.id).ad)}</b></span>`
      : oyuncu ? `<span class="kr-portre bos">🧍</span><span class="kr-op-metin"><small>OPERATÖR</small><b>Sen (bugün)</b></span>`
      : `<span class="kr-portre bos uyari">!</span><span class="kr-op-metin"><small>OPERATÖR</small><b class="kotu">YOK</b>${prologAktif() ? '' : `<button class="k-kendin" data-kendin ${kendinCalisabilirMi(id) ? '' : 'disabled'}>Kendin çalış · ${OYUNCU_CALISMA_MALIYETI}<i class="pip"></i></button>`}</span>`;
    return `
  <div class="konsol konsol-resimli konsol-${ks.oda} ${kapali ? 'kapali' : ''} ${rehber ? 'rehberli' : ''}" style="--panel:${cssUrl(`panel-${id}.jpg`)}">
    <div class="kr kr-durum" style="${yer(Y.durum)}"><span>▶ ${kacis(def.kod || 'KONTROL')} // ${durum}</span><i class="led ${kapali ? 'uyari' : ''}"></i></div>
    <div class="kr kr-operator" data-rehber="operator" style="${yer(Y.operator)}">${opHtml}</div>
    <div class="kr k-ekran kr-ekran" data-rehber="ekran" style="${yer(Y.ekran)}"><div class="k-ekran-metin">${ekranMetin}</div><div class="k-gostergeler">${gostergeler}</div></div>
    <div class="kr kr-oda" data-rehber="oda" style="${yer(Y.oda)}">${oda}</div>${solgun}${malzeme}
    <div class="kr kr-ihtiyac" data-rehber="ihtiyac" style="${yer(birlesik(Y.degerler))}"></div>${degerler}
    <div class="kr kr-kontroller" data-rehber="moduller" style="${yer(birlesik(Y.kutular))}"></div>${kutular}
    <div class="kr k-mod-anahtar kr-mod" data-rehber="mod" style="${yer(Y.mod)};--mod:${modIndex}"><div class="k-modlar">${modlar}</div></div>
    <div class="kr k-asinma-seg kr-asinma" data-rehber="asinma" style="${yer(Y.asinma)}">${Array.from({ length: 10 }, (_, i) => `<i class="${i < asinma ? (asinma >= 6 ? 'kotu' : 'dolu') : ''}"></i>`).join('')}</div>
    <button class="kr kr-bakim" data-bakim="${id}" style="${yer(Y.bakim)}" ${bakimYapabilirMi(id) ? '' : 'disabled'} title="Bakım: ${BAKIM.eylem} eylem + ${BAKIM.malzeme} malzeme, −${BAKIM.onarim} aşınma" aria-label="Bakım"></button>
    <span class="kr kr-eylem noktalar" style="${yer(Y.eylem)}">${eylemNoktalari()}</span>
    <button class="kr kr-kapat" data-kapat style="${yer(Y.kapat)}" aria-label="Kapat (Esc)"></button>
    ${kapali ? `<div class="k-kapali-ortu"><b>! OPERATÖR YOK</b><p>${kacis(PROLOG_METIN.panelBos)}</p></div>` : ''}
    ${adim ? rehberBalonHtml(rehber, adim) : ''}
  </div>`;
  }

  const arka = ks.gorsel && assetVar(`konsol-${ks.gorsel}.png`) ? `style="--konsol-arka:${cssUrl(`konsol-${ks.gorsel}.png`)}"` : '';
  return `
  <div class="konsol ${parcali ? 'konsol-parcali' : ''} konsol-${ks.oda} ${kapali ? 'kapali' : ''} ${rehber ? 'rehberli' : ''}" ${arka}>
    <header class="k-ust">
      <div class="k-kimlik"><span class="etiket">▸ ${kacis(def.kod || 'KONTROL')} // ${durum}<i class="led ${kapali ? 'uyari' : ''}"></i></span><h2>${kacis(def.baslik)}</h2></div>
      <div class="k-operator" data-rehber="operator">${operator}</div>
    </header>
    <div class="k-govde">
      <div class="k-ekran" data-rehber="ekran">
        <div class="k-ekran-metin">${ekranMetin}</div>
        <div class="k-gostergeler">${gostergeler}</div>
      </div>
      <div class="k-oda" data-rehber="oda">${parcali ? konsolOdaParcasiHtml(ks.oda, id) : odaGorseliHtml(ks.oda, id)}${ihtiyac}</div>
    </div>
    <div class="k-kontroller" data-rehber="moduller">${moduller}</div>
    <footer class="k-alt">
      <div class="k-mod-anahtar" data-rehber="mod" style="--mod:${modIndex}"><small>Çalışma modu</small><div class="k-modlar">${modlar}</div></div>
      <div class="k-asinma" data-rehber="asinma"><small>Aşınma</small>
        <div class="k-asinma-seg">${Array.from({ length: 10 }, (_, i) => `<i class="${i < asinma ? (asinma >= 6 ? 'kotu' : 'dolu') : ''}"></i>`).join('')}</div>
        <button class="k-bakim" aria-label="Bakım yap" data-bakim="${id}" ${bakimYapabilirMi(id) ? '' : 'disabled'} title="Bakım: ${BAKIM.eylem} eylem + ${BAKIM.malzeme} malzeme, −${BAKIM.onarim} aşınma">⌁</button></div>
      <div class="k-eylem"><small>Eylem</small><span class="noktalar">${eylemNoktalari()}</span></div>
      <button class="ikincil k-kapat" data-kapat>Kapat (Esc)</button>
    </footer>
    ${kapali ? `<div class="k-kapali-ortu"><b>! OPERATÖR YOK</b><p>${kacis(PROLOG_METIN.panelBos)}</p></div>` : ''}
    ${adim ? rehberBalonHtml(rehber, adim) : ''}
  </div>`;
}

function rehberBalonHtml(rehber, adim) {
  const n = rehber.indexOf(adim) + 1;
  const ipucu = { mod: '↳ Bir mod düğmesine bas.', onizle: '↳ İşaretli kontrolün üstüne gel.', eylem: '↳ İşaretli kontrolü kullan.' }[adim.tur];
  return `<div class="rehber-balon" data-hedef="${adim.hedef}"><span class="etiket">📘 KONSOL REHBERİ · ${n}/${rehber.length}</span><p>${kacis(adim.metin)}</p>
    ${adim.tur === 'oku' ? `<button data-rehber-devam data-varsayilan>${n === rehber.length ? 'Anladım' : 'Devam'}</button>` : `<small>${ipucu}</small>`}</div>`;
}

function rehberIlerle(id) {
  rehberAdimlari[id] = (rehberAdimlari[id] || 0) + 1;
  if (rehberAdimlari[id] >= PROLOG_REHBER[id].length) rehberTamamla(id);
  else panelCiz();
}
function rehberTamamla(id) {
  sonMesaj = 'Konsolu öğrendin. Makine her gece kendiliğinden üretecek.';
  if (prologPanelOgren(id)) yayinla('prologPlanla'); // abonelik yeniden çizer
  else panelCiz();
}

function panelCiz() {
  const def = aktifPanel, id = aktifPanelAnahtar;
  if (!def.konsol || !MAKINELER[id]) return;
  const rehber = prologAktif() && makineOperatoru(id) && !prologPanelOgrenildi(id) ? PROLOG_REHBER[id] : null;
  const adim = rehber ? rehber[rehberAdimlari[id] || 0] || null : null;
  if (adim?.tur === 'eylem') prologRehberEylemi();
  const parcali = konsolParcalariHazir();
  const resimli = !parcali && !!KONSOL_YERLESIM.konsollar[id] && assetVar(`panel-${id}.jpg`);
  modalAc(konsolHtml(def, id), { sinif: `panel konsol-kart ${parcali ? 'konsol-parcali-kart' : resimli ? 'konsol-resimli-kart' : ''}`, tema: def.tema });
  const cizimZamani = performance.now();

  // Göstergeler önceki değerden yenisine kayar
  const barlar = kart.querySelectorAll('.k-gosterge .bar i[data-hedef]');
  if (konsolOnceki) requestAnimationFrame(() => barlar.forEach((b) => { b.style.width = b.dataset.hedef + '%'; }));
  else barlar.forEach((b) => { b.style.width = b.dataset.hedef + '%'; });
  konsolOnceki = null;
  konsolSonBasilan = null;

  // Rehber vurgusu ve balon konumu
  if (adim) {
    const hedef = kart.querySelector(`[data-rehber="${adim.hedef}"]`);
    hedef?.classList.add('rehber-vurgu');
    const balon = kart.querySelector('.rehber-balon');
    const konsol = kart.querySelector('.konsol');
    if (hedef && balon) {
      const k = konsol.getBoundingClientRect(), r = hedef.getBoundingClientRect();
      const altta = r.bottom - k.top + balon.offsetHeight + 12 < konsol.offsetHeight;
      balon.style.top = `${altta ? r.bottom - k.top + 10 : Math.max(0, r.top - k.top - balon.offsetHeight - 10)}px`;
      balon.style.left = `${Math.max(8, Math.min(k.width - balon.offsetWidth - 8, r.left - k.left + r.width / 2 - balon.offsetWidth / 2))}px`;
      balon.classList.toggle('ustte', !altta);
    }
  }
  kart.querySelector('[data-rehber-devam]')?.addEventListener('click', () => rehberIlerle(id));

  kart.querySelectorAll('.k-mod').forEach((b) => b.addEventListener('click', () => {
    if (adim?.tur === 'mod') rehberAdimlari[id] = (rehberAdimlari[id] || 0) + 1;
    sesCal('ses-tiklama', { ses: 0.5 });
    if (state.makineModlari[id] === b.dataset.mod) panelCiz(); else makineModuSec(id, b.dataset.mod);
  }));
  kart.querySelector('[data-bakim]')?.addEventListener('click', () => { if (bakimYap(id)) sonMesaj = 'Bakım yapıldı, makine rahatladı.'; });
  kart.querySelector('[data-kendin]')?.addEventListener('click', () => {
    if (!kendinCalisabilirMi(id)) return;
    sonMesaj = 'Kolları sıvadın. Makine bu gece senin sayende üretecek.';
    kendinCalis(id);
  });

  kart.querySelectorAll('.modul').forEach((b) => {
    const i = Number(b.dataset.i);
    const onizleAdim = adim?.tur === 'onizle' && (adim.hedef === 'moduller' || adim.hedef === `modul-${i}`);
    const goster = () => {
      if (konsolOnizleme === i) return;
      konsolOnizleme = i;
      ekranGuncelle(def, id);
    };
    b.addEventListener('mouseenter', goster);
    // Rehber "üstüne gel" adımı gerçek fare hareketiyle ilerler (yeniden çizimde imlecin altında kalmak sayılmaz);
    // önizleme kısa süre görünsün diye adım biraz gecikmeyle geçer.
    const adimNo = rehberAdimlari[id] || 0;
    let bekliyor = false;
    const onizleIlerle = () => {
      if (!onizleAdim || bekliyor || performance.now() - cizimZamani < 350) return;
      bekliyor = true;
      goster();
      setTimeout(() => { if (aktifPanelAnahtar === id && (rehberAdimlari[id] || 0) === adimNo) rehberIlerle(id); }, 900);
    };
    b.addEventListener('focus', () => { goster(); onizleIlerle(); });
    b.addEventListener('mousemove', onizleIlerle);
    b.addEventListener('mouseleave', () => { konsolOnizleme = null; ekranGuncelle(def, id); });
    b.addEventListener('click', () => {
      if (b.getAttribute('aria-disabled') === 'true') { b.classList.remove('red'); void b.offsetWidth; b.classList.add('red'); return; }
      const e = def.eylemler[i];
      konsolOnceki = { ...state.kaynak };
      konsolSonBasilan = i;
      konsolOnizleme = null;
      sonMesaj = e.mesaj || 'Tamamlandı.';
      if (adim?.tur === 'eylem' && adim.i === i) rehberAdimlari[id] = (rehberAdimlari[id] || 0) + 1;
      const basarili = eylemYap(e); // abonelik konsolu yeniden çizer
      if (basarili) {
        sesCal('ses-panel-onay');
        yayinla('eylemYapildi', { panel: id, etki: e.etki, kirli: !!e.kirli });
        if (rehber && (rehberAdimlari[id] || 0) >= rehber.length) rehberTamamla(id);
      } else { konsolOnceki = null; panelCiz(); }
    });
  });
}

// Önizleme değişince yalnız ekran ve göstergeler yenilenir (DOM'u baştan kurmadan)
function ekranGuncelle(def, id) {
  const yeni = document.createElement('div');
  yeni.innerHTML = konsolHtml(def, id);
  const eski = kart.querySelector('.k-ekran');
  const taze = yeni.querySelector('.k-ekran');
  if (eski && taze) {
    eski.replaceWith(taze);
    taze.querySelectorAll('.bar i[data-hedef]').forEach((b) => { b.style.width = b.dataset.hedef + '%'; });
  }
}

// ---------------------------------------------------------------
//  RADYO / OLAY KARTI
// ---------------------------------------------------------------
// Bir olayın etki satırları (zaman ifadeleri bugün/yarın'a göre)
function olayEtkiSatirlari(olay, { hemen, gece, gun }, anlik = olay.anlik, gunSonu = olay.gunSonu) {
  const satirlar = [];
  const dolu = (e) => e && Object.values(e).some((d) => d !== 0);
  if (dolu(anlik)) satirlar.push(`<div class="etki-satir"><span>${hemen}:</span>${etkiChipleri(anlik)}</div>`);
  if (dolu(gunSonu)) satirlar.push(`<div class="etki-satir"><span>${gece}:</span>${etkiChipleri(gunSonu)}</div>`);
  if (olay.eylem) satirlar.push(`<div class="etki-satir"><span>${gun}:</span><span class="chip kotu">Eylem hakkı ${olay.eylem}</span></div>`);
  return satirlar.join('');
}

// Yarının hava/olay tahmini + hazırlık butonu
function tahminHtml() {
  const t = state.tahmin;
  if (!t || state.bitti) return '';
  let hazirlik = '';
  if (t.hazirlik) {
    const azalma = t.hazirlik.carpan === 0 ? 'zararı tamamen önler' : `zararı %${Math.round((1 - t.hazirlik.carpan) * 100)} azaltır`;
    hazirlik = state.hazirlik
      ? `<p class="mesaj">&gt; ✓ Hazırlandın: ${kacis(t.hazirlik.ad)}. Yarın ${azalma}.</p>`
      : `<button class="eylem" data-hazirlan ${hazirlanabilirMi() ? '' : 'disabled'}>
          <span class="no">🛡</span>
          <span class="govde"><span class="ad">${kacis(t.hazirlik.ad)}</span><span class="chipler"><span class="chip iyi">Yarın ${azalma}</span></span></span>
          <span class="maliyet">${HAZIRLIK_MALIYETI} eylem</span>
        </button>`;
  }
  return `
    <div class="tahmin">
      <div class="radyo-ust">🔭 YARIN İÇİN TAHMİN · GÜN ${state.gun + 1}</div>
      <h4>${kacis(t.baslik)}</h4>
      ${paragraf(t.uyari || t.metin)}
      ${olayEtkiSatirlari(t, { hemen: 'Sabah', gece: 'Yarın gece', gun: 'Yarın' })}
      ${hazirlik}
    </div>`;
}

function olayHtml(olay) {
  const hazirlikli = state.olayHazirlikli && olay === state.olay && olay.hazirlik;
  return `
    <div class="radyo">
      <div class="radyo-ust">📻 YEŞİLVADİ RADYOSU · GÜN ${state.gun}</div>
      <h3>${kacis(olay.baslik)}</h3>
      ${paragraf(olay.metin)}
      ${hazirlikli ? `<p class="mesaj">&gt; 🛡 Dün hazırlandığın için etkisi azaldı: ${kacis(olay.hazirlik.ad)}.</p>` : ''}
      ${olayEtkiSatirlari(olay, { hemen: 'Hemen', gece: 'Bu gece ayrıca', gun: 'Bugün' }, olayEtkisi(olay.anlik, olay), olayEtkisi(olay.gunSonu, olay))}
    </div>
    ${tahminHtml()}`;
}

// Radyo/sabah kartındaki hazırlık butonu; basınca kart yeniden çizilir
function hazirlikBagla(yenidenCiz) {
  kart.querySelector('[data-hazirlan]')?.addEventListener('click', () => {
    if (hazirlan()) {
      yayinla('hazirlikYapildi', {});
      yenidenCiz();
    }
  });
}

export function olayGoster(olay) {
  modalAc(`${olayHtml(olay)}${ilkGunRehberiHtml()}<div class="alt sag"><button data-kapat data-varsayilan>Tamam</button></div>`, { sinif: 'radyo-kart' });
  hazirlikBagla(() => olayGoster(olay));
  ilkGunRehberiBagla();
}

function ilkGunRehberiHtml() {
  if (state.gun !== 1 || state.bitti) return '';
  const incelendi = state.kararGecmisi.some(k => k.tip === 'inceleme');
  const secildi = state.kararGecmisi.some(k => k.tip === 'eylem' || k.tip === 'kart');
  return `<section class="bilgi-karti"><h3>İlk gün: kararını ve sonucunu keşfet</h3>
    <p>${incelendi ? '✓' : '1.'} Bir makinenin üretimini ve seçeneklerini incele. ${secildi ? '✓ Bir tercih yaptın.' : '2. Eylemlerin kazancını ve bedelini karşılaştırıp birini seç.'} 3. Gece tahminine bak; hazır olduğunda yaşam alanındaki yatakta uyu. Sabah raporunda seçiminin sonucunu gör.</p>
    <button class="ikincil" data-rehber-panel>Enerji panelini incele</button>
    <button class="ikincil" data-rehber-tahmin>Gece tahminine bak</button></section>`;
}
function ilkGunRehberiBagla() {
  kart.querySelector('[data-rehber-panel]')?.addEventListener('click', () => panelAc(PANELLER.enerji, 'enerji'));
  kart.querySelector('[data-rehber-tahmin]')?.addEventListener('click', () => {
    const t = geceTahmini();
    bilgi('Gece tahmini', `Enerji ${Math.max(0, Math.min(100, state.kaynak.enerji + (t.degisim.enerji || 0)))}, su ${Math.max(0, Math.min(100, state.kaynak.su + (t.degisim.su || 0)))}, gıda ${Math.max(0, Math.min(100, state.kaynak.gida + (t.degisim.gida || 0)))}. Bu bir tahmindir; gün içindeki yeni tercihlerle değişir. Hazır olduğunda yatağa gidip günü bitir.`);
  });
}

function secimDersleriHtml(secimler, baslik) {
  if (!secimler.length) return '';
  return `<section class="bilgi-karti"><h3>${kacis(baslik)}</h3>${secimler.map(k => `<p><b>Gün ${k.gun} · ${kacis(k.ad || 'Seçimin')}:</b> ${kacis(kararAciklamasi(k))}</p>${k.tip === 'eylem' ? `<div class="rapor"><span>Seçim anındaki değişim:</span>${etkiChipleri(k.etki) || '<span class="chip">Kaynak değişimi yok</span>'}${k.malzeme ? `<span class="chip iyi">+${k.malzeme} malzeme</span>` : ''}</div>` : ''}`).join('')}</section>`;
}

function bilgiHtml(b) {
  if (!b) return '';
  return `
    <div class="bilgi-karti">
      <span class="etiket">💡 BİLİYOR MUYDUN?</span>
      <p>${kacis(b.metin)}</p>
      <span class="kaynak">Kaynak: ${kacis(b.kaynak)}${b.url?.startsWith('https://') ? ` · <a href="${kacis(b.url)}" target="_blank" rel="noopener noreferrer">Kaynağı aç</a>` : ''}</span>
    </div>`;
}

// Gün geçişi iki adım: önce gece raporu + bilgi kartı, sonra sabah radyosu
export function gunBaslangici({ sozSonuclari = [], hedefSonuclari = [], insaatBitti = null, rapor, bilgi, gidenZiyaretci, arastirmaPuani, arastirmaBitti, bataryaKullanim, bataryaSarj, ayrilanlar = [], sefer = null, memnuniyet = null }) {
  muzikCal('muzik-gece-gecis');
  if (arastirmaBitti) sesCal('ses-arastirma-bitti');
  if (insaatBitti) sesCal('ses-insa-bitti');
  const gitti = gidenZiyaretci
    ? `<p class="uyari">🚪 ${kacis(gidenZiyaretci.ad)} kapıda beklemekten vazgeçip gitti.</p>`
    : '';
  modalAc(`
    <div class="panel-ust"><span class="etiket">▸ GECE RAPORU<i class="led"></i></span><h2>Gün ${state.gun - 1} sona erdi</h2></div>
    <div class="rapor"><span>Gece tüketimi (👥 ${state.nufus} kişi):</span>${etkiChipleri(rapor) || '<span class="chip">Değişim yok</span>'}</div>
    ${arastirmaPuani ? `<div class="rapor"><span>Araştırma:</span><span class="chip iyi">🧪 +${arastirmaPuani} puan</span></div>` : ''}
    ${bataryaKullanim ? `<div class="rapor"><span>Batarya:</span><span class="chip iyi">🔋 ${bataryaKullanim} enerji depodan geldi</span></div>` : ''}
    ${bataryaSarj ? `<div class="rapor"><span>Batarya:</span><span class="chip iyi">🔋 ${bataryaSarj} fazla enerji depolandı</span></div>` : ''}
    ${arastirmaBitti ? `<p class="mesaj">&gt; ${ARASTIRMALAR[arastirmaBitti].ikon} ${kacis(ARASTIRMALAR[arastirmaBitti].ad)} tamamlandı! ${kacis(ARASTIRMALAR[arastirmaBitti].aciklama)}</p>` : ''}
    ${insaatBitti ? `<p class="mesaj">İnşaat tamamlandı: ${kacis(YAPILAR[insaatBitti].ad)}. Etkisi bugünden itibaren aktif.</p>` : ''}
    ${ayrilanlar.map((z) => `<p class="uyari">😮‍💨 ${kacis(z.ad)} tükenmişti ve gece sessizce sığınaktan ayrıldı.</p>`).join('')}
    ${sozSonuclari.map(p => `<p class="${p.durum === 'tutuldu' ? 'mesaj' : 'uyari'}">${kacis(p.ad)}: dinlenme sözü ${p.durum === 'tutuldu' ? 'tutuldu (+6 memnuniyet, güven arttı)' : p.durum === 'ayrildi' ? 'sakin ayrıldığı için kapandı' : 'tutulmadı (−6 memnuniyet, güven azaldı)' }.</p>`).join('')}
    ${hedefSonuclari.map(h => `<p class="mesaj">${SENARYO_HEDEFLERI.find(t => t.id === h.id).ad}: ${h.durum === 'tamamlandi' ? 'tamamlandı' : 'süre doldu'}.</p>`).join('')}
    ${secimDersleriHtml(gununKararlari(state.kararGecmisi, state.gun - 1), 'Seçimlerin neyi gösterdi?')}
    ${memnuniyetHtml(memnuniyet)}
    ${gitti}
    ${seferHtml(sefer)}
    ${sefer?.basari && sefer.bilgi ? '' : bilgiHtml(bilgi)}
    <div class="alt sag"><button data-sabah data-varsayilan>Sabah oldu</button></div>`, { kapatma: false, sinif: 'gece' });
  kart.querySelector('[data-sabah]').addEventListener('click', sabahGoster);
}

// Gecelik memnuniyet değişimi ve nedenleri
function memnuniyetHtml(m) {
  if (!m || !m.nedenler.length) return '';
  const chipler = m.nedenler.map((n) => `<span class="chip ${n.deger > 0 ? 'iyi' : 'kotu'}">${kacis(n.neden)} ${n.deger > 0 ? '+' : '−'}${Math.abs(n.deger)}</span>`).join('');
  const uyari = state.guvenDusukGece > 0
    ? `<p class="uyari">⚠ Sakinler güven oylaması istiyor! Memnuniyet yarın gece de ${AYAR.guvenOylamasiEsigi} veya altında kalırsa yönetim el değiştirecek.</p>`
    : state.memnuniyet < AYAR.itirazEsigi
      ? `<p class="uyari">😠 Memnuniyet ${state.memnuniyet}. Üst üste ${AYAR.guvenOylamasiGece} gece ${AYAR.guvenOylamasiEsigi} veya altında kalırsa sakinler yönetimi oylayacak.</p>`
      : '';
  return `<div class="rapor"><span>Memnuniyet (${m.degisim >= 0 ? '+' : ''}${m.degisim} → ${state.memnuniyet}):</span>${chipler}</div>${uyari}`;
}

// Sabah dönen keşif seferinin sonucu (gece raporunda)
function seferHtml(sf) {
  if (!sf) return '';
  if (sf.bekliyor) return `<p class="uyari">${kacis(sf.ad)}: ekip karar bekliyor. Keşif panelinden devam/erzak/dönüş seç. ${kacis(sf.metin)}</p>`;
  const odul = sf.odul
    ? [etkiChipleri(sf.odul.kaynak),
      sf.odul.arastirma ? `<span class="chip iyi">🧪 +${sf.odul.arastirma.puan} ${kacis(ARASTIRMALAR[sf.odul.arastirma.id].ad)}</span>` : '',
      sf.odul.insanlik ? '<span class="chip iyi">🤝 dayanışma</span>' : ''].join('')
    : '';
  return `
    <div class="sefer-sonuc ${sf.basari ? 'iyi' : 'kotu'}">
      <span class="etiket">🧭 KEŞİF · ${sf.ikon} ${kacis(sf.ad)}</span>
      <p><b>${sf.kisi ? kacis(sf.kisi) + ' döndü. ' : ''}${sf.basari ? 'Sefer başarılı!' : 'Sefer sonuçsuz kaldı.'}</b> ${kacis(sf.metin)}</p>
      ${odul ? `<div class="rapor">${odul}</div>` : ''}
      ${sf.plan ? '<p class="mesaj">Pompa çizimleri bulundu: Araştırma panelinde yağmur suyu projesi açıldı.</p>' : ''}
      ${sf.arastirmaBitti ? `<p class="mesaj">&gt; ${kacis(ARASTIRMALAR[sf.arastirmaBitti].ad)} tamamlandı!</p>` : ''}
    </div>
    ${sf.basari && sf.bilgi ? bilgiHtml(BILGILER[sf.bilgi]) : ''}`;
}

function sabahGoster() {
  if (state.ziyaretci) sesCal('ses-kapi-cal');
  if (state.kart) sesCal('ses-uyari');
  const kapi = state.ziyaretci
    ? `<p class="kapi-uyari">🚪 Kapı çalınıyor! Biri sığınağa girmek istiyor.</p>`
    : '';
  modalAc(`
    <div class="panel-ust"><span class="etiket">▸ YENİ GÜN<i class="led"></i></span><h2>Gün ${state.gun} / ${AYAR.maxGun}</h2></div>
    ${olayHtml(state.olay)}
    ${kapi}
    ${bosMakineler().length ? `<p class="kapi-uyari">⚙ Boş makine: ${bosMakineler().map((m) => kacis(MAKINELER[m].ad)).join(', ')}. Görev Panosu'ndan birini gönder ya da kendin çalış.</p>` : ''}
    ${state.kart ? `<p class="kapi-uyari">🗳 Sakinler bir konuda kararını bekliyor.</p>` : ''}
    <div class="alt sag">${state.kart
      ? '<button data-kartac data-varsayilan>Kararı gör</button>'
      : '<button data-kapat data-varsayilan>Güne başla</button>'}</div>`, { sinif: 'sabah', kapatma: !state.kart });
  hazirlikBagla(sabahGoster);
  kart.querySelector('[data-kartac]')?.addEventListener('click', kararKartiGoster);
}

// ---------------------------------------------------------------
//  EĞİTİCİ KARAR KARTI (seçim yapılmadan kapanmaz)
// ---------------------------------------------------------------
export function kararKartiGoster() {
  const k = state.kart;
  if (k) sesCal('ses-kart-ac');
  if (!k) return modalKapat();
  const secenekler = kartSecenekleri(k);
  const satirlar = secenekler.map((sec, i) => {
    const chipler = [
      etkiChipleri(sec.etki),
      sec.arastirma ? `<span class="chip iyi">🧪 +${sec.arastirma.puan} ${kacis(ARASTIRMALAR[sec.arastirma.id].ad)}</span>` : '',
      sec.insanlik ? `<span class="chip ${sec.insanlik > 0 ? 'iyi' : 'kotu'}">Vicdan ${sec.insanlik > 0 ? '+' : '−'}</span>` : '',
      sec.memnuniyet ? `<span class="chip ${sec.memnuniyet > 0 ? 'iyi' : 'kotu'}">🙂 Memnuniyet ${sec.memnuniyet > 0 ? '+' : '−'}${Math.abs(sec.memnuniyet)}</span>` : '',
      sec.yorgunlukAzalt ? `<span class="chip iyi">😮‍💨 Herkesin yorgunluğu −${sec.yorgunlukAzalt}</span>` : '',
      sec.geceEtki ? `<span class="gece-etiket">bu gece:</span>${etkiChipleri(sec.geceEtki)}` : '',
    ].join('');
    return `
      <button class="eylem ${sec.kirli ? 'kirli' : ''}" data-sec="${i}" ${kartSecebilirMi(sec) ? '' : 'disabled'}>
        <span class="no">${i + 1}</span>
        <span class="govde">
          <span class="ad">${kacis(sec.ad)}${sec.kirli ? ' <em>⚠ kirletir</em>' : ''}</span>
          <span class="chipler">${chipler || '<span class="chip">Etkisi yok</span>'}</span>
        </span>
        <span class="maliyet">${sec.maliyet ? `${sec.maliyet} eylem` : 'ücretsiz'}</span>
      </button>`;
  }).join('');
  modalAc(`
    ${arayuzGorseli('kart', KARAR_GORSELLERI[k.id], 'karar-gorsel')}
    <div class="panel-ust"><span class="etiket">▸ KARAR KARTI<i class="led uyari"></i></span><h2>${kacis(k.baslik)}</h2></div>
    <p>${kacis(k.sozcu && state.sakinler.some((x) => x.id === k.sozcu.id) ? k.sozcu.metin : k.metin)}</p>
    <div class="eylemler">${satirlar}</div>
    <p class="aciklama">"Bu gece" yazan değişimler bu gecenin hesabına eklenir. Kalan eylem: ${state.eylem}</p>`,
    { kapatma: false, sinif: 'panel karar', tema: '#e0b23a' });
  kart.querySelectorAll('[data-sec]').forEach((b) => b.addEventListener('click', () => {
    const sec = kartSec(secenekler[Number(b.dataset.sec)]);
    if (!sec) return;
    if (sec.kirli) yayinla('eylemYapildi', { panel: sec.panel || null, etki: sec.etki || {}, kirli: true });
    modalAc(`
      <div class="panel-ust"><span class="etiket">▸ KARAR VERİLDİ<i class="led"></i></span><h2>${kacis(k.baslik)}</h2></div>
      <p class="mesaj">&gt; ${kacis(sec.sonuc)}</p>
      ${bilgiHtml(BILGILER[sec.bilgi])}
      <div class="alt sag"><button data-kapat data-varsayilan>Güne başla</button></div>`, { sinif: 'panel karar', tema: '#e0b23a' });
  }));
}

// ---------------------------------------------------------------
//  KAPIDAKİ ZİYARETÇİ
// ---------------------------------------------------------------
export function ziyaretciGoster(z, kabul, ret) {
  const katkiVar = z.anlik || z.gunlukKatki || z.eylemArtisi;
  modalAc(`
    <div class="panel-ust"><span class="etiket">▸ KAPIDA BİRİ VAR<i class="led uyari"></i></span><h2>${portreRozet(z.id, z.ikon)}${kacis(z.ad)}</h2></div>
    ${portreBuyuk(z.id)}
    <p class="kisi-sayisi">👥 ${z.kisi} kişi</p>
    <p>${kacis(z.metin)}</p>
    <div class="ziyaretci-satir"><span>Getirdikleri:</span><span class="chip ${katkiVar ? 'iyi' : ''}">${kacis(z.katkiMetni)}</span></div>
    <div class="ziyaretci-satir"><span>Her gece ek tüketim:</span>${etkiChipleri(nufusTuketimi(z.kisi))}</div>
    ${z.guclu ? `<div class="ziyaretci-satir"><span>Güçlü yön:</span><span class="chip iyi">${kacis(z.guclu)}</span></div>` : ''}
    ${z.kosullu ? `<div class="ziyaretci-satir"><span>Koşullu bedel:</span><span class="chip kotu">${kacis(z.kosullu)}</span></div>` : ''}
    <div class="ziyaretci-satir"><span>Olası görevler:</span><span class="chip">${z.calisir === false ? 'Çalışmaz' : 'Makine · Laboratuvar · Keşif'}</span></div>
    <div class="ziyaretci-satir net"><span>Her gece NET etki:</span>${etkiChipleri(ziyaretciNetEtki(z)) || '<span class="chip">Etkisiz</span>'}</div>
    <p class="aciklama">Sığınakta şu an ${state.nufus} kişi var. Karar vermeden günü bitirirsen beklemekten vazgeçip gider.</p>
    <div class="alt">
      <button class="ikincil" data-kapat>Sonra karar ver</button>
      <span class="hikaye-butonlar">
        <button class="ret" data-ret>Geri çevir</button>
        <button data-kabul>İçeri al</button>
      </span>
    </div>`, { sinif: 'kapi' });
  kart.querySelector('[data-kabul]').addEventListener('click', () => {
    const kisi = z.kisi;
    modalKapat();
    kabul();
    yayinla('ziyaretciKabul', { kisi });
  });
  kart.querySelector('[data-ret]').addEventListener('click', () => { modalKapat(); ret(); });
}

// ---------------------------------------------------------------
//  ONAY / BİLGİ
// ---------------------------------------------------------------
export function onay(baslik, metin, evetYazi, evet) {
  modalAc(`
    <div class="panel-ust"><span class="etiket">▸ ONAY<i class="led"></i></span><h2>${kacis(baslik)}</h2></div>
    ${paragraf(metin)}
    <div class="alt sag">
      <button class="ikincil" data-kapat>Vazgeç</button>
      <button data-evet data-varsayilan>${kacis(evetYazi)}</button>
    </div>`, { sinif: 'bilgi' });
  kart.querySelector('[data-evet]').addEventListener('click', () => {
    modalKapat();
    evet();
  });
}

// ---------------------------------------------------------------
//  GÖREV VE ARAŞTIRMA PANOSU
// ---------------------------------------------------------------
const YONETIM_BOLUMLERI = { koloni: 'Koloni', odalar: 'Odalar', kesif: 'Keşif', arastirma: 'Araştırma', insaat: 'İnşaat', hedefler: 'Hedefler' };

function makineAyarHtml(id) {
  const secili = state.makineModlari[id];
  const asinma = state.makineAsinma[id];
  return `<div class="makine-ayar"><div class="mod-secimleri" aria-label="${MAKINELER[id].ad} çalışma modu">
    ${Object.entries(CALISMA_MODLARI).map(([mod, bilgi]) => `<button data-mod="${mod}" data-makine="${id}" class="${secili === mod ? 'secili' : ''}" aria-pressed="${secili === mod}" title="${bilgi.aciklama}">${bilgi.ad}</button>`).join('')}
    </div><p class="aciklama">${makineModu(id).aciklama} Aşınma: ${asinma}/10${asinma >= 6 ? ' · üretim düşüyor' : ''}.</p>
    <div class="chipler">${etkiChipleri(makineUretimi(id))}</div>${Object.keys(havaUretimEtkisi(id)).length ? `<p class="aciklama">Hava etkisi (${kacis(state.olay.baslik)}): ${etkiChipleri(havaUretimEtkisi(id))}</p>` : ''}
    <button data-bakim="${id}" ${bakimYapabilirMi(id) ? '' : 'disabled'}>Bakım · ${BAKIM.eylem} eylem + ${BAKIM.malzeme} malzeme · −${BAKIM.onarim} aşınma</button></div>`;
}
function makineAyarlariniBagla() {
  kart.querySelectorAll('[data-mod]').forEach((b) => b.addEventListener('click', () => makineModuSec(b.dataset.makine, b.dataset.mod)));
  kart.querySelectorAll('[data-bakim]').forEach((b) => b.addEventListener('click', () => bakimYap(b.dataset.bakim)));
}
// ---------------------------------------------------------------
//  SIĞINAK YÖNETİMİ (oda konsollarıyla aynı prensip: görsel gövde,
//  üstte fareyle ayrıntı gösteren durum ekranı, az metin)
//  İsteğe bağlı arka planlar: public/assets/yonetim-<bölüm>.png
// ---------------------------------------------------------------
let seciliSakin = null;   // koloni: atanmak üzere seçilen sakin
let panoTuruAdim = null;  // prolog: pano turu sayfası (null = tur yok)

export function panoAc(bolum = 'koloni') {
  if (prologAktif()) {
    if (prologPanoSirasi()) return prologPanoTuru();
    return bilgi('Sığınak Yönetimi', PROLOG_METIN.pano);
  }
  aktifPanel = null;
  aktifPanelAnahtar = null;
  panoBolumu = bolum;
  panoAcik = true;
  sonMesaj = '';
  seciliSakin = null;
  panoCiz();
}

// Bir görevde kişinin üreteceği: mini ikon rozetleri (koşullar hariç)
function gorevEtkisi(s, gorev) {
  if (gorev === 'bosta') return '<span class="mini-etki">💤 −2 yorgunluk</span>';
  const c = sakinCiktisi({ id: s.id, gorev }, false);
  const z = sakinTanimi(s.id);
  const etki = Object.fromEntries(Object.entries(c.etki).filter(([ad, d]) => d && !(z.ekTuketim && z.ekTuketim[ad] === d)));
  return kisaEtki(etki) + (c.puan ? `<span class="mini-etki iyi">🧪+${c.puan}</span>` : '') + (c.eylem ? `<span class="mini-etki iyi">✋+${c.eylem}</span>` : '') || '<span class="mini-etki">üretim yok</span>';
}
const gorevMetni = (s, gorev) => gorevEtkisi(s, gorev).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// Yorgunluk pili: 5 dilim, eşikte kırmızı
function yorgunlukPili(s) {
  if (!s.gorev || sakinTanimi(s.id).calisir === false) return '';
  const y = s.yorgunluk || 0, yarin = yarinkiYorgunluk(s), esik = AYAR.yorgunlukAyrilmaEsigi;
  const risk = ayrilmaSansi(yarin);
  return `<span class="y-pil ${risk ? 'kotu' : yarin >= AYAR.yorgunlukUyari ? 'uyari' : ''}" title="Yorgunluk ${y} → ${yarin}">${Array.from({ length: esik }, (_, i) => `<i class="${i < y ? 'dolu' : i < yarin ? 'gelecek' : ''}"></i>`).join('')}</span>`;
}
function sakinBilgisi(s) {
  const z = sakinTanimi(s.id);
  const yarin = yarinkiYorgunluk(s), risk = ayrilmaSansi(yarin);
  const soz = state.sozler.find((p) => p.uid === s.uid);
  return [
    `${z.ad}: ${s.gorev === 'kesif' ? 'keşifte' : gorevBilgisi(s.gorev).ad}.`,
    s.gorev && s.gorev !== 'kesif' && z.calisir !== false ? `Bu gece: ${gorevMetni(s, s.gorev)}.` : '',
    z.calisir === false ? 'Çalışmaz; yalnız tüketir.' : `Yorgunluk ${s.yorgunluk || 0} → ${yarin}${risk ? `, %${Math.round(risk * 100)} ayrılabilir` : yarin >= AYAR.yorgunlukUyari ? ', dinlenmeli' : ''}.`,
    z.uzman ? `★ Uzmanlık: ${gorevBilgisi(z.uzman).ad}.` : '',
    z.kosullu ? `Koşullu bedel: ${z.kosullu}.` : '',
    soz ? `İzin sözü: gün ${soz.gun}.` : '',
  ].filter(Boolean).join(' ');
}

function koloniHtml() {
  const yerler = [...Object.keys(MAKINELER), 'arastirma', 'bosta', ...(state.insaat ? ['insaat'] : [])];
  const secili = state.sakinler.find((s) => s.uid === seciliSakin);
  const kart = (s) => {
    const z = sakinTanimi(s.id);
    const uzman = z.uzman === s.gorev;
    const tasinir = s.gorev !== 'kesif' && z.calisir !== false;
    return `<div class="y-sakin ${seciliSakin === s.uid ? 'secili' : ''} ${tasinir ? '' : 'sabit'}" data-sakin="${s.uid}" ${tasinir ? 'draggable="true"' : ''} data-bilgi="${kacis(sakinBilgisi(s))}" tabindex="0">
      ${yuzPortresi(s.id, z.ikon)}<span class="y-sakin-ad">${kacis(z.ad)}${uzman ? ' <b class="yildiz">★</b>' : ''}</span>
      ${yorgunlukPili(s)}${state.sozler.some((p) => p.uid === s.uid) ? '<span class="y-rozet" title="İzin sözü">🤝</span>' : ''}
      ${s.gorev !== 'kesif' ? `<button class="y-konus" data-konus="${s.uid}" title="Konuş" aria-label="Sakinle konuş">Konuş</button>` : ''}</div>`;
  };
  const sutunlar = yerler.map((id) => {
    const g = gorevBilgisi(id), m = MAKINELER[id];
    const icindekiler = state.sakinler.filter((s) => s.gorev === id);
    const durum = m ? (makineKapali(id) ? 'kapali' : makineCalisiyorMu(id) ? 'calisiyor' : 'bos') : '';
    const hedef = secili && secili.gorev !== id && sakinTanimi(secili.id).calisir !== false;
    const dolu = m && icindekiler.length && hedef ? sakinTanimi(icindekiler[0].id).ad : '';
    const bilgiMetni = m
      ? `${m.ad}: ${durum === 'kapali' ? 'enerji yetersiz, kapalı' : durum === 'calisiyor' ? 'çalışıyor' : 'operatör yok, bu gece üretmez'}. Tek operatör.`
      : id === 'arastirma' ? 'Laboratuvar: sınırsız kişi, her biri +2 araştırma puanı/gece.' : id === 'bosta' ? 'Dinlen: üretim yok, yorgunluk −2/gece.' : 'İnşaat: işçi gecede iş puanı üretir.';
    return `<section class="y-sutun ${durum} ${hedef ? 'hedef' : ''} ${secili && secili.gorev === id ? 'mevcut' : ''}" data-yer="${id}" data-bilgi="${kacis(bilgiMetni)}">
      <header>${arayuzIkonu(id, g.ikon || m?.ikon)}<b>${kacis(m ? m.ad : g.ad)}</b>${m ? `<i class="led-durum ${durum}"></i>` : ''}</header>
      ${hedef ? `<div class="y-onizleme">${gorevEtkisi(secili, id)}${sakinTanimi(secili.id).uzman === id ? '<span class="mini-etki iyi">★</span>' : ''}${dolu ? `<small>${kacis(dolu)} dinlenmeye geçer</small>` : ''}</div>` : ''}
      <div class="y-sutun-ic">${icindekiler.map(kart).join('') || (m ? '<span class="y-bos">boş</span>' : '')}</div>
    </section>`;
  }).join('');
  const disarida = state.sakinler.filter((s) => s.gorev === 'kesif' || !s.gorev);
  return `
    <div class="y-gorev-tahtasi">${sutunlar}</div>
    ${disarida.length ? `<div class="y-disarida"><small>Keşifte / çalışmaz</small>${disarida.map(kart).join('')}</div>` : ''}
    <p class="y-ipucu">${secili ? `<b>${kacis(sakinTanimi(secili.id).ad)}</b> seçili: bir sütuna tıkla ya da kartı sürükle. Vazgeçmek için karta tekrar tıkla.` : 'Bir sakini seç ya da kartını bir sütuna sürükle. Ayrıntı için kartların üstüne gel.'}</p>`;
}

function odaKartlariHtml() {
  return `<div class="y-odalar">${ODALAR.map((oda) => {
    const panel = oda.nesneler.find((n) => n.tip === 'panel')?.panel;
    const op = panel ? makineOperatoru(panel) : null;
    const yapilar = Object.entries(YAPILAR).filter(([, y]) => y.oda === oda.tip);
    const kurulu = yapilar.filter(([id]) => yapiAcik(id));
    const resim = assetVar(`oda-${oda.tip}-tam.png`) ? `style="--oda-resim:${cssUrl(`oda-${oda.tip}-tam.png`)}"` : '';
    if (!panel) {
      return `<article class="y-oda" data-bilgi="${kacis(`${oda.ad}: ${state.nufus} kişi yaşıyor. Kurulu iyileştirme: ${kurulu.map(([, y]) => y.ad).join(', ') || 'yok'}.`)}">
        <div class="y-oda-resim" ${resim}><span class="y-oda-nufus">👥 ${state.nufus}</span></div>
        <h3>${kacis(oda.ad)}</h3>
        <div class="y-oda-yapilar">${yapilar.map(([id, y]) => `<span class="${yapiAcik(id) ? 'acik' : ''}" title="${kacis(y.ad)}">${arayuzIkonu(id, y.ikon)}</span>`).join('')}</div>
        <div class="y-oda-dugmeler"><button data-oda-insaat="${oda.tip}" title="İyileştirmeler">🔨 ${kurulu.length}/${yapilar.length}</button></div></article>`;
    }
    const durum = makineKapali(panel) ? 'kapali' : makineCalisiyorMu(panel) ? 'calisiyor' : 'bos';
    const asinma = state.makineAsinma[panel];
    const bilgiMetni = `${oda.ad}: ${op ? `operatör ${sakinTanimi(op.id).ad}` : 'operatör yok'}, ${makineModu(panel).ad} modu (${makineModu(panel).aciklama}) Aşınma ${asinma}/10${asinma >= 6 ? ', üretim düşüyor' : ''}. İyileştirme: ${kurulu.map(([, y]) => y.ad).join(', ') || 'yok'}.`;
    return `<article class="y-oda ${durum}" data-bilgi="${kacis(bilgiMetni)}">
      <div class="y-oda-resim" ${resim}><i class="led-durum ${durum}"></i>${op ? yuzPortresi(op.id, sakinTanimi(op.id).ikon) : '<span class="ikon-rozet uyari">!</span>'}</div>
      <h3>${kacis(oda.ad)}</h3>
      <div class="y-oda-uretim">${durum === 'calisiyor' ? kisaEtki(makineUretimi(panel)) : `<span class="mini-etki kotu">${durum === 'kapali' ? 'kapalı' : 'üretim yok'}</span>`}</div>
      <div class="y-mini-mod">${Object.entries(CALISMA_MODLARI).map(([mod, b]) => `<button data-mod="${mod}" data-makine="${panel}" class="${state.makineModlari[panel] === mod ? 'secili' : ''}" title="${kacis(b.ad + ': ' + b.aciklama)}">${kacis(b.ad[0])}</button>`).join('')}</div>
      <div class="k-asinma-seg">${Array.from({ length: 10 }, (_, i) => `<i class="${i < asinma ? (asinma >= 6 ? 'kotu' : 'dolu') : ''}"></i>`).join('')}</div>
      <div class="y-oda-dugmeler"><button data-oda-panel="${panel}" title="Konsolu aç">⚙ Konsol</button><button data-oda-insaat="${oda.tip}" title="İyileştirmeler">🔨 ${kurulu.length}/${yapilar.length}</button></div>
    </article>`;
  }).join('')}</div>`;
}

function kesifHaritaHtml() {
  const sf = state.sefer;
  const merkez = { x: 50, y: 52 };
  const rotalar = Object.entries(KESIF_NOKTALARI).map(([id, n]) => `<line x1="${merkez.x}" y1="${merkez.y}" x2="${n.harita.x}" y2="${n.harita.y}" class="${sf?.yer === id ? 'aktif' : seciliKesif === id ? 'secili' : ''} ${state.kesfedilenler.includes(id) ? 'gidildi' : ''}"/>`).join('');
  const pinler = Object.entries(KESIF_NOKTALARI).map(([id, n]) => {
    const gidildi = state.kesfedilenler.includes(id);
    const yetismez = state.gun + n.sure > AYAR.maxGun;
    const kapali = gidildi || yetismez || !!sf;
    const bilgiMetni = `${n.ad}: ${n.sure} gece, başarı %${Math.round(n.sans * 100)}${gidildi ? ', gidildi' : yetismez ? ', oyun bitmeden dönülemez' : ''}.`;
    const [x0, y0, x1, y1] = n.harita.alan || [n.harita.x-12, n.harita.y-15, n.harita.x+12, n.harita.y+15];
    const yer = `left:${x0}%;top:${y0}%;width:${x1-x0}%;height:${y1-y0}%;--pin-x:${(n.harita.x-x0)/(x1-x0)*100}%;--pin-y:${(n.harita.y-y0)/(y1-y0)*100}%`;
    return `<button class="y-pin y-pin-bolge ${seciliKesif === id ? 'secili' : ''} ${gidildi ? 'gidildi' : ''} ${kapali ? 'kilitli' : ''}" style="${yer}" data-kesif="${id}" data-bilgi="${kacis(bilgiMetni)}" aria-label="${kacis(n.ad)} bölgesini incele" aria-pressed="${seciliKesif === id}">
      <span class="y-pin-isaret"><span class="y-pin-ikon">${arayuzIkonu(id, n.ikon)}</span><span class="y-pin-ad">${kacis(n.ad)}</span><span class="y-pin-gun">${n.sure} gece</span></span></button>`;
  }).join('');
  let ekip = '';
  if (sf) {
    const n = KESIF_NOKTALARI[sf.yer];
    const ilerleme = Math.max(0.15, Math.min(0.85, 1 - sf.kalan / (n.sure + 1)));
    const kisi = state.sakinler.find((x) => x.uid === sf.uid);
    ekip = `<span class="y-ekip" style="left:${merkez.x + (n.harita.x - merkez.x) * ilerleme}%;top:${merkez.y + (n.harita.y - merkez.y) * ilerleme}%">${kisi ? portreRozet(kisi.id, sakinTanimi(kisi.id).ikon) : '🧭'}</span>`;
  }
  const arka = assetVar('yonetim-kesif.png') ? `style="--harita:${cssUrl('yonetim-kesif.png')}"` : '';
  return `<div class="y-harita" ${arka}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${rotalar}</svg>
    <span class="y-siginak" style="left:${merkez.x}%;top:${merkez.y}%" data-bilgi="Yeşilvadi sığınağı">${varsaImg(`${ARAYUZ_ASSET_KLASORU}kesif-siginak.png`, 'y-harita-img') || '<span class="y-siginak-ad">Yeşilvadi</span>'}</span>
    ${pinler}${ekip}</div>`;
}

function kesifDetayHtml() {
  const sf = state.sefer;
  if (sf && (!seciliKesif || seciliKesif === sf.yer)) {
    const n = KESIF_NOKTALARI[sf.yer];
    const kisi = state.sakinler.find((x) => x.uid === sf.uid);
    return `<h3>${arayuzIkonu(sf.yer, n.ikon)} ${kacis(n.ad)}</h3>
      <div class="y-sefer">${kisi ? portreRozet(kisi.id, sakinTanimi(kisi.id).ikon) : ''}<div><b>${kacis(kisi ? sakinTanimi(kisi.id).ad : '')}</b><small>${sf.kararBekliyor ? 'karar bekliyor' : sf.kalan === 1 ? 'yarın sabah döner' : `${sf.kalan} gün sonra döner`}</small></div>
      <span class="y-sans" style="--sans:${Math.round(sf.sans * 100)}"><b>%${Math.round(sf.sans * 100)}</b></span></div>
      ${sf.kararBekliyor ? `<div class="y-karar"><p>${kacis(n.araKarar.metin)}</p>${[['don', '↩ Dön', 'Eldekiyle dön: yarım kaynak, çizim/araştırma ödülü yok.'], ['devam', '➜ Devam', '+1 gece, başarı −15 yüzde puan.'], ['erzak', '🎒 Erzak', '2 gıda + 2 su gönder: +1 gece, başarı +10 yüzde puan.']].map(([id, ad, b]) => `<button data-kesif-karar="${id}" data-bilgi="${kacis(b)}" ${kesifKarariYapabilirMi(id) ? '' : 'disabled'}>${ad}</button>`).join('')}</div>` : ''}`;
  }
  if (!seciliKesif) return `<div class="y-bos-detay"><b>Bir nokta seç</b><p>Haritadan bir nokta seç. Aynı anda tek sefer olur; giden kişi o sürede sığınakta çalışmaz.</p></div>`;
  const n = KESIF_NOKTALARI[seciliKesif];
  const engel = sf ? 'Başka bir sefer sürüyor. Ekip dönmeden yeni sefer gönderilemez.'
    : state.kesfedilenler.includes(seciliKesif) ? 'Bu bölge daha önce keşfedildi. Aynı bölgeye tekrar sefer gönderilemez.'
    : state.gun + n.sure > AYAR.maxGun ? 'Bu sefer oyun bitmeden geri dönemez.' : '';
  const odul = kisaEtki(n.odul.kaynak) + (n.odul.arastirma ? `<span class="mini-etki iyi">🧪+${n.odul.arastirma.puan}</span>` : '') + (n.odul.insanlik ? '<span class="mini-etki iyi">🤝</span>' : '');
  const adaylar = state.sakinler.filter((s) => kesfeGonderebilirMi(seciliKesif, s.uid));
  return `<h3>${arayuzIkonu(seciliKesif, n.ikon)} ${kacis(n.ad)}</h3>
    <div class="y-kesif-satir"><small>Erzak</small>${kisaEtki(n.erzak)}</div>
    <div class="y-kesif-satir"><small>Ödül</small>${odul}</div>
    <div class="y-kesif-satir"><small>Süre</small><span class="mini-etki">${n.sure} gece</span></div>
    ${engel ? `<p class="y-kesif-engel" role="status">${kacis(engel)}</p>` : '<small class="y-baslik">Kimi göndereceksin?</small>'}
    <div class="y-adaylar">${adaylar.map((s) => {
      const sans = kesifSansi(seciliKesif, s.uid);
      return `<button class="y-aday" data-gonder="${s.uid}" data-bilgi="${kacis(`${sakinTanimi(s.id).ad}: başarı %${Math.round(sans * 100)}${sans === 1 ? ' (uzman, kesin)' : ''}${MAKINELER[s.gorev] ? `. ${MAKINELER[s.gorev].ad} makinesi boşalır` : ''}.`)}">
        ${yuzPortresi(s.id, sakinTanimi(s.id).ikon)}<span>${kacis(sakinTanimi(s.id).ad)}${sans === 1 ? ' ★' : ''}</span><span class="y-sans" style="--sans:${Math.round(sans * 100)}"><b>%${Math.round(sans * 100)}</b></span></button>`;
    }).join('') || (engel ? '' : '<span class="y-bos">Gönderilebilecek kimse yok (erzak/kişi yetersiz).</span>')}</div>`;
}

function arastirmaAgaciHtml() {
  const a = state.arastirma;
  const dugum = ([id, p]) => {
    const puan = Math.min(p.maliyet, a.puan[id] || 0);
    const acik = arastirmaAcik(id);
    const kilitli = !acik && p.onKosul && !p.onKosul(state);
    const yuzde = Math.round((acik ? 1 : puan / p.maliyet) * 100);
    const bilgiMetni = `${p.ad}: ${p.aciklama} ${acik ? 'Tamamlandı.' : kilitli ? `Kilitli: ${p.kilitAciklama || 'önce Seviye I'}.` : `${puan}/${p.maliyet} puan${a.aktif === id ? ', aktif proje' : ''}.`}`;
    return `<button class="y-dugum ${a.aktif === id ? 'aktif' : ''} ${acik ? 'acik' : ''} ${kilitli ? 'kilitli' : ''}" data-proje="${id}" style="--ilerleme:${yuzde}" data-bilgi="${kacis(bilgiMetni)}" ${acik || kilitli ? 'aria-disabled="true"' : ''}>
      <span class="y-halka"><span>${arayuzIkonu(id, p.ikon)}</span></span>
      <span class="y-dugum-ad">${kacis(p.ad)}</span>
      <small>${acik ? '✓' : kilitli ? 'Kilitli' : `${puan}/${p.maliyet}`}</small></button>`;
  };
  const tum = Object.entries(ARASTIRMALAR);
  const s1 = tum.filter(([, p]) => p.seviye !== 2), s2 = tum.filter(([, p]) => p.seviye === 2);
  const lab = state.sakinler.filter((s) => s.gorev === 'arastirma');
  const labPuan = lab.reduce((t, s) => t + sakinCiktisi(s, false).puan, 0);
  return `<div class="y-agac">
      <div class="y-seviye"><small>Seviye I</small><div>${s1.map(dugum).join('')}</div></div>
      <div class="y-baglanti" aria-hidden="true"><i></i></div>
      <div class="y-seviye"><small>Seviye II · Seviye I'den biri bitince</small><div>${s2.map(dugum).join('')}</div></div>
    </div>
    <div class="y-lab">
      <div class="y-lab-tezgah" data-bilgi="${kacis(`Laboratuvar: ${lab.length ? lab.map((s) => sakinTanimi(s.id).ad).join(', ') : 'kimse yok'}. Bu gece +${labPuan} puan. Koloni panosundan sakin atayabilirsin.`)}">
        <small>Laboratuvar</small><div>${lab.map((s) => portreRozet(s.id, sakinTanimi(s.id).ikon)).join('') || '<span class="y-bos">boş</span>'}</div><b>+${labPuan}<small>/gece</small></b></div>
      <button class="modul modul-dugme y-masa ${masadaArastirabilirMi() ? '' : 'kilitli'}" data-masa aria-disabled="${!masadaArastirabilirMi()}" data-bilgi="${kacis(`${MASA_ARASTIRMA.ad}: ${MASA_ARASTIRMA.maliyet} eylem, aktif projeye +${MASA_ARASTIRMA.puan} puan.`)}">
        <span class="modul-mekanik"><span class="modul-ikon">📓</span><i class="modul-parca"></i></span><span class="modul-ad">Masa başında</span><span class="modul-etki"><span class="mini-etki iyi">🧪+${MASA_ARASTIRMA.puan}</span></span><span class="modul-fiil">Araştır · ${MASA_ARASTIRMA.maliyet}<i class="pip"></i></span></button>
      ${arastirmaAcik('batarya') ? `<div class="y-batarya" data-bilgi="Batarya deposu: gece 80'i aşan enerji depolanır, açık önce depodan karşılanır."><small>Batarya</small><div class="bar"><i class="iyi" style="width:${(state.batarya / BATARYA_KAPASITE) * 100}%"></i></div><b>${state.batarya}/${BATARYA_KAPASITE}</b></div>` : ''}
    </div>`;
}

function insaatPlaniHtml() {
  const i = state.insaat;
  let aktif = '';
  if (i) {
    const y = YAPILAR[i.id], t = insaatTahmini(), kisi = insaatci();
    const adaylar = state.sakinler.filter((s) => sakinTanimi(s.id).calisir !== false && s.gorev !== 'kesif');
    const iade = Math.floor(-(y.maliyet.malzeme || 0) * i.kalan / y.sure * 0.5);
    aktif = `<section class="y-iskele">
      <div class="y-iskele-ust">${arayuzIkonu(i.id, y.ikon)}<div><b>${kacis(y.ad)}</b><small>${i.duraklat ? 'duraklatıldı' : `bu gece +${t.ilerleme} iş${t.biter ? ' · tamamlanacak' : ''}`}</small></div>
        <div class="y-iskele-is">${Array.from({ length: y.sure }, (_, k) => `<i class="${k < y.sure - i.kalan ? 'dolu' : k < y.sure - i.kalan + t.ilerleme ? 'gelecek' : ''}"></i>`).join('')}</div></div>
      <div class="y-isciler"><small>İşçi</small>
        <button class="y-aday ${!kisi ? 'secili' : ''}" data-insaatci="" data-bilgi="İşçi yok: inşaat yalnız senin yardımınla ilerler.">∅</button>
        ${adaylar.map((s) => `<button class="y-aday ${kisi?.uid === s.uid ? 'secili' : ''}" data-insaatci="${s.uid}" data-bilgi="${kacis(`${sakinTanimi(s.id).ad}: ${['tamirci', 'muhendis'].includes(s.id) ? '+2' : '+1'} iş/gece. ${MAKINELER[s.gorev] ? `${MAKINELER[s.gorev].ad} makinesi boşalır.` : ''}`)}">${portreRozet(s.id, sakinTanimi(s.id).ikon)}${['tamirci', 'muhendis'].includes(s.id) ? '<b class="yildiz">★</b>' : ''}</button>`).join('')}</div>
      <div class="y-iskele-dugmeler">
        <button data-insaat-yardim ${i.duraklat || i.yardim || state.eylem < 1 ? 'disabled' : ''} data-bilgi="Yardım et: 1 eylem, +1 iş (günde bir kez).">Yardım ${i.yardim ? '✓' : '1'}<i class="pip"></i></button>
        <button data-insaat-duraklat data-bilgi="${i.duraklat ? 'Devam et' : 'Duraklat: işçi önceki görevine döner'}">${i.duraklat ? 'Devam' : 'Duraklat'}</button>
        <button data-insaat-iptal data-bilgi="İptal: ${iade} malzeme iade edilir, eylem ve enerji iade edilmez.">İptal</button></div>
    </section>`;
  }
  const sekmeler = `<div class="y-sekmeler"><button data-insaat-oda="" class="${!insaatOda ? 'secili' : ''}">Tümü</button>${ODALAR.map((o) => `<button data-insaat-oda="${o.tip}" class="${insaatOda === o.tip ? 'secili' : ''}">${kacis(o.ad)}</button>`).join('')}</div>`;
  const planlar = Object.entries(YAPILAR).filter(([, y]) => !insaatOda || y.oda === insaatOda).map(([id, y]) => {
    const kurulu = yapiAcik(id), kurabilir = yapiKurabilirMi(id), suruyor = state.insaat?.id === id;
    const kilitli = y.onKosul && !y.onKosul(state);
    const m = y.maliyet || {};
    const maliyet = Object.fromEntries(Object.entries(m).filter(([k]) => KAYNAKLAR[k]));
    const damga = kurulu ? 'KURULDU' : suruyor ? 'İNŞADA' : kilitli ? 'KİLİTLİ' : '';
    const neden = kilitli ? y.kilitAciklama || 'Araştırma gerekli' : kurulu ? 'Kalıcı etki aktif' : suruyor ? `${state.insaat.kalan} iş kaldı` : state.gun >= AYAR.maxGun ? 'Son gün inşaat başlatılamaz' : state.insaat ? 'Önce mevcut inşaat bitmeli' : kurabilir ? 'Tıkla: inşaatı başlat' : 'Eylem / kaynak / malzeme yetersiz';
    return `<button class="y-plan ${kurulu ? 'kurulu' : ''} ${kurabilir ? '' : 'kilitli'}" data-yapi="${id}" aria-disabled="${!kurabilir}" data-bilgi="${kacis(`${y.ad}: ${y.aciklama} ${neden}.`)}">
      ${damga ? `<span class="y-damga">${damga}</span>` : ''}
      <span class="y-plan-ikon">${arayuzIkonu(id, arayuzIkonu(['suDeposu', 'yagmurDeposu'].includes(id) ? 'grisu' : id === 'onarimTezgahi' ? 'atik' : id, y.ikon))}</span>
      <span class="y-plan-ad">${kacis(y.ad)}</span>
      <span class="modul-etki">${m.eylem ? `<span class="mini-etki">${m.eylem} eylem</span>` : ''}${m.malzeme ? `<span class="mini-etki ${state.malzeme >= -m.malzeme ? '' : 'kotu'}">${arayuzIkonu('malzeme', '🧱')}${Math.abs(m.malzeme)}</span>` : ''}${kisaEtki(maliyet)}</span>
      <span class="y-plan-sure">${Array.from({ length: y.sure ?? 2 }, () => '<i></i>').join('')}</span>
    </button>`;
  }).join('');
  return `${aktif}${sekmeler}<div class="y-planlar">${planlar}</div>`;
}

function hedefPanosuHtml() {
  return `<div class="y-mantar">${SENARYO_HEDEFLERI.map((h, i) => {
    const durum = state.hedefler.find((t) => t.id === h.id)?.durum;
    const damga = durum === 'tamamlandi' ? 'TAMAM' : durum === 'kacirildi' ? 'SÜRE DOLDU' : '';
    return `<article class="y-not ${durum || ''}" style="--egim:${i % 2 ? 1.5 : -1.2}deg" data-bilgi="${kacis(h.metin)}">
      <i class="y-raptiye"></i>${damga ? `<span class="y-damga">${damga}</span>` : ''}
      <h3>${kacis(h.ad)}</h3><p>${kacis(h.metin)}</p>
      <span class="y-son-gun">GÜN ${h.sonGun}'E KADAR</span>
      ${h.id === 'komsuDestek' ? `<button data-hedef-yardim ${hedefYardimiGonderebilirMi() ? '' : 'disabled'} data-bilgi="8 su + 5 malzeme gönder: +5 insanlık, +4 memnuniyet.">📦 Gönder <span class="modul-etki">${kisaEtki({ su: -8 })}<span class="mini-etki kotu">${arayuzIkonu('malzeme', '🧱')}−5</span></span></button>`
        : `<button data-oda-insaat="sera" data-bilgi="İnşaat panosunda Sel Bariyeri'ni kur.">🔨 İnşaata git</button>`}
    </article>`;
  }).join('')}</div>`;
}

function yonetimOzeti() {
  const bos = bosMakineler().length;
  const ar = state.arastirma.aktif ? ARASTIRMALAR[state.arastirma.aktif] : null;
  return {
    koloni: `${state.nufus} kişi · ${bos ? `${bos} boş makine` : 'tüm makineler çalışıyor'} · ${state.sakinler.filter((s) => s.gorev === 'arastirma').length} kişi laboratuvarda`,
    odalar: `${Object.keys(MAKINELER).length - bos}/${Object.keys(MAKINELER).length} makine çalışıyor · mod ve aşınmayı buradan da ayarlayabilirsin`,
    kesif: state.sefer ? `Sefer sürüyor: ${KESIF_NOKTALARI[state.sefer.yer].ad}` : `${Object.keys(KESIF_NOKTALARI).length - state.kesfedilenler.length} keşfedilmemiş nokta`,
    arastirma: ar ? `Aktif: ${ar.ad} · ${state.arastirma.puan[state.arastirma.aktif] || 0}/${ar.maliyet} puan` : 'Aktif proje yok: ağaçtan birini seç',
    insaat: `Malzeme ${state.malzeme}/${AYAR.malzemeKapasite} · ${state.insaat ? `${YAPILAR[state.insaat.id].ad} inşa ediliyor` : 'aynı anda bir yapı kurulur'}`,
    hedefler: `${state.hedefler.filter((h) => h.durum === 'tamamlandi').length}/${SENARYO_HEDEFLERI.length} hedef tamam · isteğe bağlı`,
  }[panoBolumu];
}

function panoCiz() {
  const govde = { koloni: koloniHtml, odalar: odaKartlariHtml, arastirma: arastirmaAgaciHtml, insaat: insaatPlaniHtml, hedefler: hedefPanosuHtml,
    kesif: () => `<div class="y-kesif">${kesifHaritaHtml()}<aside class="y-kesif-detay">${kesifDetayHtml()}</aside></div>` }[panoBolumu]();
  const tur = panoTuruAdim != null ? PROLOG_PANO_TURU[panoTuruAdim] : null;
  const arka = assetVar(`yonetim-${panoBolumu}.png`) && panoBolumu !== 'kesif' ? `style="--yonetim-arka:${cssUrl(`yonetim-${panoBolumu}.png`)}"` : '';
  const varsayilan = sonMesaj ? `<span class="k-mesaj">&gt; ${kacis(sonMesaj)}</span>` : `<span>${kacis(yonetimOzeti())}</span>`;
  const turBalonu = tur ? `<div class="rehber-balon" data-tur-balon><span class="etiket">📘 SIĞINAK YÖNETİMİ · ${panoTuruAdim + 1}/${PROLOG_PANO_TURU.length}</span><b>${kacis(tur.baslik)}</b><p>${kacis(tur.metin)}</p>
        ${panoTuruAdim > 0 ? '<button class="ikincil" data-tur-geri>Geri</button>' : ''}<button data-tur-ileri data-varsayilan>${panoTuruAdim === PROLOG_PANO_TURU.length - 1 ? 'Turu bitir' : 'İleri'}</button></div>` : '';

  // Mockup zeminli pano: yonetim-<bölüm>.jpg + konsol-yerlesim.json → yonetim (tools/konsol-arka.py)
  const Y = KONSOL_YERLESIM.yonetim?.[panoBolumu];
  const parcali = konsolParcalariHazir();
  if (!parcali && Y && assetVar(`yonetim-${panoBolumu}.jpg`)) {
    const [W, H] = KONSOL_YERLESIM.boyut;
    const yer = (r) => `left:${(r[0] / W) * 100}%;top:${(r[1] / H) * 100}%;width:${((r[2] - r[0]) / W) * 100}%;height:${((r[3] - r[1]) / H) * 100}%`;
    const icerik = panoBolumu === 'kesif'
      ? `<div class="kr kr-harita" style="${yer(Y.harita)}">${kesifHaritaHtml()}</div><aside class="kr y-kesif-detay kr-detay" style="${yer(Y.detay)}">${kesifDetayHtml()}</aside>`
      : `<div class="kr y-govde kr-govde" data-rehber="govde" style="${yer(Y.govde)}">${govde}</div>`;
    modalAc(`
    <div class="yonetim yonetim-resimli yonetim-${panoBolumu} ${tur ? 'tur-modu' : ''}" style="--panel:${cssUrl(`yonetim-${panoBolumu}.jpg`)}">
      ${Object.entries(YONETIM_BOLUMLERI).map(([id, ad], i) => `<button class="kr kr-sekme ${panoBolumu === id ? 'secili' : ''}" data-bolum="${id}" style="${yer(Y.sekmeler[i])}" aria-label="${ad}" aria-pressed="${panoBolumu === id}" ${tur ? 'disabled' : ''}></button>`).join('')}
      <div class="kr y-ust kr-ust" style="${yer(Y.ust)}"></div>
      <div class="kr k-ekran y-ekran kr-yekran" data-rehber="ekran" style="${yer(Y.ekran)}"><div class="k-ekran-metin" data-y-ekran>${varsayilan}</div></div>
      ${icerik}
      <span class="kr kr-ymalzeme" style="${yer(Y.malzeme)}" data-bilgi="Geri kazanılmış yapı malzemesi; inşaat ve bakımda kullanılır, dengeye sayılmaz.">${state.malzeme}</span>
      <span class="kr kr-eylem noktalar" style="${yer(Y.eylem)}">${eylemNoktalari()}</span>
      <button class="kr kr-kapat" data-kapat style="${yer(Y.kapat)}" aria-label="Kapat (Esc)" ${tur ? 'disabled' : ''}></button>
      ${turBalonu}
    </div>`, { sinif: 'panel pano konsol-kart konsol-resimli-kart', tema: '#7fd1b9', kapatma: !tur });
  } else modalAc(`
    <div class="${parcali ? 'konsol konsol-parcali yonetim-parcali' : ''} yonetim yonetim-${panoBolumu} ${tur ? 'tur-modu' : ''}" ${arka}>
    <nav class="pano-gecis" aria-label="Yönetim panelleri">${Object.entries(YONETIM_BOLUMLERI).map(([id, ad]) => `<button data-bolum="${id}" aria-pressed="${panoBolumu === id}" class="${panoBolumu === id ? 'secili' : ''}" ${tur ? 'disabled' : ''}>${arayuzIkonu('yonetim-' + id, '')}${ad}</button>`).join('')}</nav>
      <header class="y-ust">
        <div class="k-kimlik"><span class="etiket">▸ YEŞİLVADİ // YÖNETİM<i class="led"></i></span><h2>${YONETIM_BOLUMLERI[panoBolumu]}</h2></div>
        <div class="k-ekran y-ekran" data-rehber="ekran"><div class="k-ekran-metin" data-y-ekran>${varsayilan}</div></div>
      </header>
      <div class="y-govde" data-rehber="govde">${govde}</div>
      <footer class="k-alt y-alt">
        <div class="y-stok" data-bilgi="Geri kazanılmış yapı malzemesi; inşaat ve bakımda kullanılır, dengeye sayılmaz.">${arayuzIkonu('malzeme', '🧱')}<small>Malzeme</small><b>${state.malzeme}</b></div>
        <div class="k-eylem"><small>Eylem</small><span class="noktalar">${eylemNoktalari()}</span></div>
        <button class="ikincil k-kapat" data-kapat ${tur ? 'disabled' : ''}>Kapat (Esc)</button>
      </footer>
      ${turBalonu}
    </div>`, { sinif: `panel pano konsol-kart ${parcali ? 'konsol-parcali-kart' : ''}`, tema: '#7fd1b9', kapatma: !tur });
  panoAcik = !tur;

  // Durum ekranı: data-bilgi taşıyan her öğe üstüne gelince ayrıntıyı gösterir
  const ekran = kart.querySelector('[data-y-ekran]');
  kart.querySelectorAll('.yonetim [data-bilgi]').forEach((el) => {
    const goster = () => { ekran.innerHTML = `<span>${kacis(el.dataset.bilgi)}</span>`; };
    el.addEventListener('mouseenter', goster);
    el.addEventListener('focus', goster);
    el.addEventListener('mouseleave', () => { ekran.innerHTML = varsayilan; });
  });

  if (tur) {
    const hedef = kart.querySelector(tur.hedef ? `.yonetim ${tur.hedef}` : '.y-govde');
    hedef?.classList.add('rehber-vurgu');
    const balon = kart.querySelector('[data-tur-balon]');
    const kok = kart.querySelector('.yonetim');
    const k = kok.getBoundingClientRect(), r = (hedef || kok).getBoundingClientRect();
    balon.style.top = `${Math.max(8, Math.min(kok.offsetHeight - balon.offsetHeight - 8, r.top - k.top + 30))}px`;
    balon.style.left = `${Math.max(8, kok.offsetWidth - balon.offsetWidth - 16)}px`;
    kart.querySelector('[data-tur-geri]')?.addEventListener('click', () => prologPanoTuru(panoTuruAdim - 1));
    kart.querySelector('[data-tur-ileri]').addEventListener('click', () => {
      if (panoTuruAdim < PROLOG_PANO_TURU.length - 1) return prologPanoTuru(panoTuruAdim + 1);
      panoTuruAdim = null;
      prologPanoGor();
      bilgi(PROLOG_METIN.kapanis.baslik, PROLOG_METIN.kapanis.metin);
    });
    return; // tur sırasında pano salt okunur
  }

  kart.querySelectorAll('[data-bolum]').forEach((b) => b.addEventListener('click', () => {
    panoBolumu = b.dataset.bolum;
    sonMesaj = '';
    seciliSakin = null;
    panoCiz();
    kart.querySelector('.kart-icerik').scrollTop = 0;
  }));
  // Koloni: seç-tıkla ve sürükle-bırak ile görev atama
  kart.querySelectorAll('.y-sakin:not(.sabit)').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-konus]')) return;
      seciliSakin = seciliSakin === Number(el.dataset.sakin) ? null : Number(el.dataset.sakin);
      panoCiz();
    });
    el.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', el.dataset.sakin); seciliSakin = Number(el.dataset.sakin); el.classList.add('suruklenen'); });
  });
  kart.querySelectorAll('.y-sutun').forEach((el) => {
    const ata = (uid) => {
      const s = state.sakinler.find((x) => x.uid === uid);
      if (!s || s.gorev === el.dataset.yer) return;
      seciliSakin = null;
      sonMesaj = `${sakinTanimi(s.id).ad} → ${gorevBilgisi(el.dataset.yer).ad}. Bu geceden geçerli.`;
      sesCal('ses-tiklama', { ses: 0.5 });
      gorevAta(uid, el.dataset.yer);
    };
    el.addEventListener('click', (e) => { if (seciliSakin && !e.target.closest('.y-sakin')) ata(seciliSakin); });
    el.addEventListener('dragover', (e) => { e.preventDefault(); el.classList.add('uzerinde'); });
    el.addEventListener('dragleave', () => el.classList.remove('uzerinde'));
    el.addEventListener('drop', (e) => { e.preventDefault(); ata(Number(e.dataTransfer.getData('text/plain'))); });
  });
  kart.querySelectorAll('[data-konus]').forEach((b) => b.addEventListener('click', () => sakinleKonus(Number(b.dataset.konus))));
  // Odalar
  kart.querySelectorAll('.y-mini-mod [data-mod]').forEach((b) => b.addEventListener('click', () => makineModuSec(b.dataset.makine, b.dataset.mod)));
  kart.querySelectorAll('[data-oda-panel]').forEach((b) => b.addEventListener('click', () => panelAc(PANELLER[b.dataset.odaPanel], b.dataset.odaPanel)));
  kart.querySelectorAll('[data-oda-insaat]').forEach((b) => b.addEventListener('click', () => { insaatOda = b.dataset.odaInsaat; panoBolumu = 'insaat'; panoCiz(); }));
  // Keşif
  kart.querySelectorAll('.y-pin').forEach((b) => b.addEventListener('click', () => {
    seciliKesif = b.dataset.kesif;
    panoCiz();
  }));
  kart.querySelectorAll('[data-gonder]').forEach((b) => b.addEventListener('click', () => {
    const yer = seciliKesif;
    const s = state.sakinler.find((x) => x.uid === Number(b.dataset.gonder));
    if (yer && s && kesfeGonder(yer, s.uid)) {
      sonMesaj = `${sakinTanimi(s.id).ad} erzakını aldı ve ${KESIF_NOKTALARI[yer].ad} yönüne yola çıktı.`;
      seciliKesif = null;
      panoCiz();
    }
  }));
  kart.querySelectorAll('[data-kesif-karar]').forEach((b) => b.addEventListener('click', () => {
    const r = kesifKarariSec(b.dataset.kesifKarar);
    if (r) { sonMesaj = r.metin || 'Kararın ekibe iletildi.'; panoCiz(); }
  }));
  // Araştırma
  kart.querySelectorAll('[data-proje]').forEach((b) => b.addEventListener('click', () => {
    if (b.getAttribute('aria-disabled') === 'true') return;
    sonMesaj = `Aktif proje: ${ARASTIRMALAR[b.dataset.proje].ad}.`;
    arastirmaSec(b.dataset.proje);
  }));
  kart.querySelector('[data-masa]')?.addEventListener('click', (e) => {
    if (!masadaArastirabilirMi()) { e.currentTarget.classList.remove('red'); void e.currentTarget.offsetWidth; e.currentTarget.classList.add('red'); return; }
    sonMesaj = 'Notlar, çizimler, hesaplar...';
    const biten = masadaArastir();
    if (biten) sonMesaj = `${ARASTIRMALAR[biten].ad} tamamlandı! Etkisi bu geceden başlıyor.`;
    panoCiz();
  });
  // İnşaat
  kart.querySelectorAll('[data-insaat-oda]').forEach((b) => b.addEventListener('click', () => { insaatOda = b.dataset.insaatOda || null; panoCiz(); }));
  kart.querySelectorAll('[data-insaatci]').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.insaatci) gorevAta(Number(b.dataset.insaatci), 'insaat');
    else if (insaatci()) gorevAta(insaatci().uid, 'bosta');
  }));
  kart.querySelector('[data-insaat-yardim]')?.addEventListener('click', insaataYardimEt);
  kart.querySelector('[data-insaat-duraklat]')?.addEventListener('click', insaatDuraklat);
  kart.querySelector('[data-insaat-iptal]')?.addEventListener('click', () => {
    onay('İnşaatı iptal et', 'Harcanan eylem ve enerji iade edilmez. Kalan iş oranına göre malzemenin yarısı geri alınır.', 'İptal et', () => { insaatIptal(); panoAc('insaat'); });
  });
  kart.querySelectorAll('[data-yapi]').forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.yapi;
    if (b.getAttribute('aria-disabled') === 'true') { b.classList.remove('red'); void b.offsetWidth; b.classList.add('red'); return; }
    if (yapiKur(id)) {
      sesCal('ses-panel-onay');
      sonMesaj = `${YAPILAR[id].ad} inşaatı başladı. İşçi ata ya da yardım et.`;
      panoCiz();
    }
  }));
  // Hedefler
  kart.querySelector('[data-hedef-yardim]')?.addEventListener('click', hedefYardimiGonder);
}

// Prolog: pano turu, gerçek pano bölümlerinin üstünde salt okunur balonlarla
function prologPanoTuru(i = 0) {
  panoTuruAdim = i;
  panoBolumu = PROLOG_PANO_TURU[i].bolum || 'koloni';
  aktifPanel = null;
  aktifPanelAnahtar = null;
  sonMesaj = '';
  seciliSakin = null;
  seciliKesif = null;
  panoCiz();
}

// Diyalogta oyuncu seçimi önce kendi portresiyle gösterilir; Devam ile sakin yanıtlar.
export function sakinleKonus(uid) {
  const s = state.sakinler.find((s) => s.uid === uid);
  if (!s || s.gorev === 'kesif' || state.bitti) return;
  aktifPanel = null; aktifPanelAnahtar = null;
  const z = sakinTanimi(s.id);
  if (prologAktif()) return bilgi(z.ad, PROLOG_METIN.konusma);
  const cerceve = (oyuncu, aktif) => `<div class="diyalog-cerceve ${oyuncu ? 'oyuncu' : 'sakin'} ${aktif ? 'konusuyor' : 'dinliyor'}" aria-label="${oyuncu ? 'Sen' : kacis(z.ad)}${aktif ? ', konuşuyor' : ', dinliyor'}">${diyalogPortresi(oyuncu ? 'oyuncu' : z.id)}<span>${oyuncu ? 'Sen' : kacis(z.ad)}</span></div>`;
  function ciz(konusan, metin, devam = null) {
    const oyuncu = konusan === 'oyuncu';
    const secenekler = DIYALOG.secenekler.filter((sec) => sec.id !== 'dinlen' || (z.calisir !== false && s.gorev !== 'bosta'));
    modalAc(`<div class="diyalog-sahne">
      <div class="diyalog-sol">${cerceve(true, oyuncu)}</div>
      <div class="diyalog-konusma"><span class="etiket">${oyuncu ? 'Sen' : kacis(z.ad)}</span><p>${kacis(metin)}</p>
      ${devam ? '<button data-diyalog-devam data-varsayilan>Devam</button>' : `<div class="diyalog-secenekler">${secenekler.map((sec) => `<button data-diyalog="${sec.id}" ${(sec.id === 'moral' && !moralVerebilirMi(uid)) || (sec.id === 'soz' && !dinlenmeSozuVerebilirMi(uid)) ? 'disabled' : ''}>${kacis(sec.metin)}${sec.maliyet ? `<small>${kacis(sec.maliyet)}</small>` : ''}</button>`).join('')}</div>`}</div>
      <div class="diyalog-sag">${cerceve(false, !oyuncu)}</div>
    </div>`, { sinif: 'diyalog-kart' });
    kart.querySelector('[data-diyalog-devam]')?.addEventListener('click', devam);
    kart.querySelectorAll('[data-diyalog]').forEach((b) => b.addEventListener('click', () => {
      const sec = DIYALOG.secenekler.find((sec) => sec.id === b.dataset.diyalog);
      ciz('oyuncu', sec.metin, () => {
        if (!state.sakinler.some((s) => s.uid === uid)) return modalKapat();
        let yanit;
        if (sec.id === 'bitir') yanit = 'Görüşürüz. Bir şeye ihtiyacın olursa buradayım.';
        else if (sec.id === 'gorev') yanit = z.calisir === false ? DIYALOG.cocuk : DIYALOG.gorev(gorevBilgisi(s.gorev).ad);
        else if (sec.id === 'ihtiyac') {
          yanit = (s.yorgunluk || 0) >= 3 ? DIYALOG.yorgun
            : state.kaynak.su < 20 ? 'Su azalıyor. Tankları doldurabilirsek içim rahat eder.'
            : state.kaynak.gida < 20 ? 'Yemek stokları beni endişelendiriyor. Seraya bakabilir misin?'
            : s.gorev === 'insaat' && state.insaat?.duraklat ? DIYALOG.durak : DIYALOG.iyi;
        } else if (sec.id === 'soz') yanit = dinlenmeSozuVer(uid) ? 'Yarın dinleneceğime söz verdin. Buna güveniyorum; o gün beni Dinlen görevine almayı unutma.' : 'Şu an yeni bir izin sözü veremiyoruz.';
        else if (sec.id === 'moral') yanit = moralVer(uid) ? DIYALOG.moral : DIYALOG.yetersiz;
        else if (sec.id === 'dinlen') { gorevAta(uid, 'bosta'); yanit = DIYALOG.dinlen; }
        ciz('sakin', yanit || 'Seni duydum. Bunu birlikte çözebiliriz.', sec.id === 'bitir' ? modalKapat : secimleriGoster);
      });
    }));
  }
  function secimleriGoster() { ciz('sakin', 'Ne konuşmak istersin?'); }
  const soz = state.sozler.find(p => p.uid === uid);
  const gecmis = [...state.sozGecmisi].reverse().find(p => p.uid === uid);
  const hatira = soz ? `Bana ${soz.gun}. gün için dinlenme sözü verdin.` : gecmis?.durum === 'tutuldu' ? 'Dinlenme sözünü tuttun, teşekkür ederim.' : gecmis?.durum === 'bozuldu' ? 'Dinleneceğime söz vermiştin ama çalışmaya devam ettim. Sana güvenmek istiyorum.' : DIYALOG.giris;
  ciz('sakin', `${z.ad}. ${z.calisir === false ? DIYALOG.cocuk : hatira}`, secimleriGoster);
}

// Günü bitirmeden önce gece tahmini + onay
export function gunuBitirOnay(evet) {
  const t = geceTahmini();
  const uyarilar = [];
  if (t.insaat) uyarilar.push(t.insaat.biter ? 'İnşaat bu gece tamamlanacak.' : `İnşaat: bu gece ${t.insaat.ilerleme} iş ilerler, ${t.insaat.kalan} iş kalır.`);
  if (state.eylem > 0) uyarilar.push(`Hâlâ ${state.eylem} eylem hakkın var.`);
  const bos = bosMakineler();
  if (bos.length) uyarilar.push(`⚙ Boş makine: ${bos.map((m) => MAKINELER[m].ad).join(', ')}. Bu gece üretim yapmayacak.`);
  for (const r of t.riskliler) uyarilar.push(`😮‍💨 ${r.ad} çok yorgun (${r.yorgunluk}): bu gece %${Math.round(r.sans * 100)} ihtimalle sığınaktan ayrılabilir. Görev Panosu'ndan dinlendir.`);
  if (t.kapidaBekleyen) uyarilar.push(`🚪 ${t.kapidaBekleyen.ad} kapıda bekliyor. Karar vermezsen gidecek.`);
  if (t.cokus) uyarilar.push('⚠ Bu gidişle denge çöküş eşiğinin altına iniyor. Oyun bu gece bitebilir.');
  else if (t.sonGun) uyarilar.push('Bu son gece. Sabah sonuç belli olacak.');
  modalAc(`
    <div class="panel-ust"><span class="etiket">▸ GECE TAHMİNİ<i class="led ${t.cokus ? 'uyari' : ''}"></i></span><h2>Günü bitirmek istiyor musun?</h2></div>
    <div class="ziyaretci-satir"><span>Bu gece kaynaklar:</span>${etkiChipleri(t.degisim)}</div>
    ${t.puan ? `<div class="ziyaretci-satir"><span>Araştırma:</span><span class="chip iyi">🧪 +${t.puan} puan</span></div>` : ''}
    ${t.bataryaKullanim ? `<div class="ziyaretci-satir"><span>Batarya:</span><span class="chip iyi">🔋 ${t.bataryaKullanim} enerji depodan karşılanacak</span></div>` : ''}
    ${t.bataryaSarj ? `<div class="ziyaretci-satir"><span>Batarya:</span><span class="chip iyi">🔋 fazla ${t.bataryaSarj} enerji depoya</span></div>` : ''}
    <div class="ziyaretci-satir"><span>Tahmini denge:</span><span class="chip ${t.denge >= state.denge ? 'iyi' : 'kotu'}">${state.denge} → ${t.denge}</span></div>
    ${uyarilar.map((u) => `<p class="aciklama">${kacis(u)}</p>`).join('')}
    <p class="aciklama">Tahmin; sabit gece tüketimini, ${state.nufus} kişinin tüketimini, çalışan makinelerin üretimini, sakinlerin katkılarını ve bugünkü olayı içerir. Yarının anlık etkileri bu gece tahminine dahil değildir.</p>
    <div class="alt sag">
      <button class="ikincil" data-kapat>Vazgeç</button>
      <button data-evet data-varsayilan>Uyu</button>
    </div>`, { sinif: 'bilgi' });
  kart.querySelector('[data-evet]').addEventListener('click', () => {
    modalKapat();
    evet();
  });
}

export function bilgi(baslik, metin) {
  modalAc(`<div class="panel-ust"><span class="etiket">▸ BİLGİ<i class="led"></i></span><h2>${kacis(baslik)}</h2></div>${paragraf(metin)}<div class="alt sag"><button data-kapat data-varsayilan>Tamam</button></div>`, { sinif: 'bilgi' });
}

// ---------------------------------------------------------------
//  BAŞLANGIÇ VE SON EKRANLARI
// ---------------------------------------------------------------
// Başla ekranından önceki hikaye ekranları (data/story.js)
export function girisHikayesi(bitti, i = 0) {
  if (i >= HIKAYE.length) return girisBitti(bitti);
  hudGorunurlugu(false);
  const h = HIKAYE[i];
  // Mockup hikaye ekranı (metin story.js ile aynı, görselde çizili); düğmeler üstünde görünmez alanlar
  if (assetVar(`hikaye-ekran-${i + 1}.jpg`)) {
    const son = i === HIKAYE.length - 1;
    const hy2 = (r) => yuzdeYer(r, 1672, 941);
    modalAc(`
      <div class="hikaye-resimli" style="--hikaye:${cssUrl(`hikaye-ekran-${i + 1}.jpg`)}" role="img" aria-label="${kacis(`${h.ust}. ${h.baslik}. ${h.metin}`)}">
        <button class="hr-dugme" data-gec aria-label="Geç" style="${hy2(son ? [1041, 756, 1231, 840] : [1044, 729, 1236, 816])}"></button>
        <button class="hr-dugme" data-devam data-varsayilan aria-label="${son ? 'Sığınağa gir' : 'Devam'}" style="${hy2(son ? [1256, 756, 1497, 840] : [1261, 729, 1493, 816])}"></button>
      </div>`, { kapatma: false, sinif: 'hikaye hikaye-resimli-kart' });
    kart.querySelector('[data-devam]').addEventListener('click', () => girisHikayesi(bitti, i + 1));
    kart.querySelector('[data-gec]').addEventListener('click', () => girisBitti(bitti));
    return;
  }
  const noktalar = HIKAYE.map((_, j) => `<i class="${j <= i ? 'dolu' : ''}"></i>`).join('');
  modalAc(`
    <div class="hikaye-ekrani">
      ${varsaImg(hikayeDosyasi(i + 1), 'hikaye-gorsel')}
      <span class="hikaye-ust">${kacis(h.ust)}</span>
      <h1>${kacis(h.baslik)}</h1>
      ${paragraf(h.metin)}
      <div class="alt">
        <span class="noktalar">${noktalar}</span>
        <span class="hikaye-butonlar">
          <button class="ikincil" data-gec>Geç</button>
          <button data-devam data-varsayilan>${i === HIKAYE.length - 1 ? 'Sığınağa gir' : 'Devam'}</button>
        </span>
      </div>
    </div>`, { kapatma: false, sinif: 'hikaye' });
  kart.querySelector('[data-devam]').addEventListener('click', () => girisHikayesi(bitti, i + 1));
  kart.querySelector('[data-gec]').addEventListener('click', () => girisBitti(bitti));
}

function girisBitti(bitti) {
  hudGorunurlugu(true);
  bitti();
}

export function baslangicEkrani(basla) {
  const kayit = kayitOku();
  hudGorunurlugu(false);
  modalAc(`
    <div class="baslik-ekrani">
      <span class="etiket">YEŞİLVADİ · 2071<i class="led"></i></span>
      <h1 class="oyun-baslik" aria-label="Apoclimate">${oyunLogosu() || 'Apoclimate'}</h1>
      <p><b>Yeşilvadi</b>, Büyük Sessizlik'ten sonra kurulan son ütopya. Ne kadar dayanacağı senin kararlarına bağlı.</p>
      <p>${AYAR.maxGun} gün boyunca enerjiyi, suyu, gıdayı ve atığı yönet. Kolay çözümlerin bir bedeli var.</p>
      <div class="menu-butonlar">
        ${kayit ? `<button data-kayit-devam>Devam et · Gün ${kayit.durum.gun}</button>` : ''}
        <button data-basla data-varsayilan>${kayit ? 'Yeni oyun' : 'Oyuna Başla'}</button>
        <button class="ikincil" data-ayarlar>Ayarlar</button>
      </div>
      <p class="aciklama kontrol-ozet"><kbd>A</kbd><kbd>D</kbd>/<kbd>←</kbd><kbd>→</kbd> yürü · <kbd>Shift</kbd> koş · <kbd>E</kbd> etkileşim · <kbd>F</kbd> tam ekran</p>
    </div>`, { kapatma: false, sinif: 'baslangic' });
  kart.querySelector('[data-basla]').addEventListener('click', () => yeniOyunSecimi((egitim) => {
    sifirla({ prolog: egitim });
    hudGorunurlugu(true);
    if (state.gun > 0) gunBasiniKaydet(state); // Gün 0 kaydedilmez; Gün 1 başında kaydedilir
    muzikCal('muzik-umut');
    basla();
  }, () => baslangicEkrani(basla)));
  kart.querySelector('[data-kayit-devam]')?.addEventListener('click', () => {
    if (!kayittanDevamEt(kayit)) return bilgi('Kayıt açılamadı', 'Bu kayıt güncel sürümle uyumlu değil. Yeni oyun başlatabilirsin.');
    hudGorunurlugu(true); modalKapat(); muzikCal('muzik-umut'); yayinla('kayitYuklendi', { onBitti: basla });
  });
  kart.querySelector('[data-ayarlar]').addEventListener('click', () => ayarlarAc(() => baslangicEkrani(basla)));
}

// Ayarlar menüsü: hem başlangıç ekranından hem oyun içinden açılabilir.
// `donus` → kapatınca nereye dönülecek. Boş geçilirse sadece kapatılır.
export function ayarlarAc(donus) {
  const tamEkranDa = !!document.fullscreenElement;
  const sesDa = sesAcikMi();
  const mz = Math.round(muzikSeviyesi() * 100);
  const ef = Math.round(efektSeviyesi() * 100);
  const ay = (r) => yuzdeYer(r, 1448, 1086);
  if (assetVar('ekran-ayarlar.jpg')) modalAc(`
    <div class="ayarlar-resimli" style="--ayar:${cssUrl('ekran-ayarlar.jpg')}">
      <button class="ar-satir" data-tamekran aria-label="Tam ekran" style="${ay([87, 206, 1363, 326])}"></button>
      <span class="ar-ikon" style="${ay([136, 230, 208, 300])}">${tamEkranDa ? '🗗' : '🖥️'}</span>
      <span class="ar-chip ${tamEkranDa ? 'iyi' : 'kotu'}" style="${ay([266, 269, 367, 303])}">${tamEkranDa ? 'Açık' : 'Kapalı'}</span>
      <button class="ar-satir" data-ses aria-label="Ses ve müzik" style="${ay([87, 349, 1363, 473])}"></button>
      <span class="ar-ikon" style="${ay([136, 375, 208, 445])}">${sesDa ? '🔊' : '🔇'}</span>
      <span class="ar-chip ${sesDa ? 'iyi' : 'kotu'}" style="${ay([266, 413, 378, 450])}">${sesDa ? 'Açık' : 'Kapalı'}</span>
      <span class="ar-sag" style="${ay([1262, 388, 1340, 430])}">${sesDa ? 'kapat' : 'aç'}</span>
      <input class="ar-kaydirici" type="range" min="0" max="100" step="1" value="${mz}" data-muzik-seviye ${sesDa ? '' : 'disabled'} aria-label="Müzik sesi" style="${ay([372, 529, 1188, 565])};--deger:${mz}%">
      <span class="ar-deger" data-muzik-deger style="${ay([1222, 522, 1324, 570])}">${mz}</span>
      <input class="ar-kaydirici" type="range" min="0" max="100" step="1" value="${ef}" data-efekt-seviye ${sesDa ? '' : 'disabled'} aria-label="Efekt sesi" style="${ay([372, 598, 1188, 637])};--deger:${ef}%">
      <span class="ar-deger" data-efekt-deger style="${ay([1222, 592, 1324, 642])}">${ef}</span>
      <span class="ar-tus" style="${ay([915, 826, 1205, 872])}"><kbd>F</kbd> tam ekran</span>
      <button class="ar-satir ar-dugme" data-test-paneli aria-label="Test paneli" style="${ay([791, 918, 1117, 1012])}"></button>
      <button class="ar-satir ar-dugme" data-kapat data-varsayilan aria-label="Kapat" style="${ay([1147, 918, 1374, 1012])}"></button>
    </div>`, { sinif: 'ayarlar-kart ayarlar-resimli-kart konsol-resimli-kart', kapatma: !donus });
  else modalAc(`
    <div class="panel-ust"><span class="etiket">▸ AYARLAR<i class="led"></i></span><h2>Ayarlar</h2></div>
    <div class="ayarlar">
      <button class="eylem" data-tamekran>
        <span class="no">${tamEkranDa ? '◧' : '⛶'}</span>
        <span class="govde"><span class="ad">Tam ekran</span><span class="chipler"><span class="chip ${tamEkranDa ? 'iyi' : ''}">${tamEkranDa ? 'Açık' : 'Kapalı'}</span></span></span>
        <span class="maliyet">F tuşu</span>
      </button>
      <button class="eylem" data-ses>
        <span class="no">${sesDa ? '🔊' : '🔇'}</span>
        <span class="govde"><span class="ad">Ses ve müzik</span><span class="chipler"><span class="chip ${sesDa ? 'iyi' : 'kotu'}">${sesDa ? 'Açık' : 'Kapalı'}</span></span></span>
        <span class="maliyet">${sesDa ? 'kapat' : 'aç'}</span>
      </button>
      <div class="ses-seviyeleri${sesDa ? '' : ' pasif'}">
        <label class="ses-slider">
          <span class="ad">🎵 Müzik</span>
          <input type="range" min="0" max="100" step="1" value="${mz}" data-muzik-seviye ${sesDa ? '' : 'disabled'} aria-label="Müzik sesi">
          <span class="deger" data-muzik-deger>${mz}</span>
        </label>
        <label class="ses-slider">
          <span class="ad">🔔 Efektler</span>
          <input type="range" min="0" max="100" step="1" value="${ef}" data-efekt-seviye ${sesDa ? '' : 'disabled'} aria-label="Efekt sesi">
          <span class="deger" data-efekt-deger>${ef}</span>
        </label>
      </div>
      <div class="kontroller">
        <h3>Kontroller</h3>
        <div class="kontrol-liste">
          <span><kbd>A</kbd><kbd>D</kbd> / <kbd>←</kbd><kbd>→</kbd> yürü</span>
          <span><kbd>Shift</kbd> koş</span>
          <span><kbd>E</kbd> etkileşim</span>
          <span><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> panel eylemi</span>
          <span><kbd>F</kbd> tam ekran</span>
          <span><kbd>Esc</kbd> pencereyi kapat</span>
          <span><kbd>Enter</kbd> varsayılan düğme</span>
          <span><kbd>F9</kbd> test paneli</span>
        </div>
      </div>
    </div>
    <div class="alt sag">
      <button class="ikincil" data-test-paneli>🛠 Test paneli</button>
      <button data-kapat data-varsayilan>Kapat</button>
    </div>`, { sinif: 'bilgi ayarlar-kart', kapatma: !donus });
  kart.querySelector('[data-test-paneli]').addEventListener('click', () => { modalKapat(); testPaneliToggle(); });
  kart.querySelector('[data-tamekran]').addEventListener('click', () => {
    window.tamEkranToggle?.();
    setTimeout(() => ayarlarAc(donus), 120);
  });
  kart.querySelector('[data-ses]').addEventListener('click', () => {
    sesToggle();
    ayarlarAc(donus);
  });
  const mSlider = kart.querySelector('[data-muzik-seviye]');
  const mDeger = kart.querySelector('[data-muzik-deger]');
  const eSlider = kart.querySelector('[data-efekt-seviye]');
  const eDeger = kart.querySelector('[data-efekt-deger]');
  let efektOrnek = 0;
  mSlider?.addEventListener('input', () => {
    mSlider.style.setProperty('--deger', mSlider.value + '%');
    const v = Number(mSlider.value) / 100;
    muzikSeviyeAyarla(v);
    mDeger.textContent = mSlider.value;
  });
  eSlider?.addEventListener('input', () => {
    eSlider.style.setProperty('--deger', eSlider.value + '%');
    const v = Number(eSlider.value) / 100;
    efektSeviyeAyarla(v);
    eDeger.textContent = eSlider.value;
    // Yeni seviyeyi hissettirmek için ara ara küçük bir örnek ses
    if (performance.now() - efektOrnek > 150) {
      efektOrnek = performance.now();
      sesCal('ses-tiklama', { ses: 0.6 });
    }
  });
  if (donus) {
    // Dönüş yolu belli (ör. ana menü): Kapat tuşu modalKapat yerine donus'u çağırır
    const kapat = kart.querySelector('[data-kapat]');
    const yeni = kapat.cloneNode(true);
    kapat.replaceWith(yeni);
    yeni.addEventListener('click', () => donus());
  }
}

const SONLAR = {
  gercekUtopya: {
    sinif: 'utopya',
    baslik: 'Yeşilvadi nefes alıyor',
    metin: 'Sera yeşil, tanklar dolu ve sığınak her gün biraz daha kalabalık. Kaynakları dengede tuttun, kapıyı da kapatmadın. Ütopya ancak paylaşıldığında gerçek oluyor.',
  },
  yalnizUtopya: {
    sinif: 'yarali',
    baslik: 'Yalnız bir ütopya',
    metin: 'Sığınak ayakta, hava temiz, kaynaklar yeterli. Ama geceleri kapının önünde bekleyenleri düşünüyorsun. Sadece içeridekiler için kurulan bir dünya ne kadar ütopya sayılır?',
  },
  kapimizAcikti: {
    sinif: 'yarali',
    baslik: 'Kapımız açıktı',
    metin: 'Kimseyi kaderine terk etmedin, ama kaynaklar bu kadar insana yetmedi. Yeşilvadi zor durumda, yine de kimse yalnız değil. İyi niyet tek başına yetmiyor: dayanışma ancak sürdürülebilir bir sistemle ayakta kalır.',
  },
  guvenKaybi: {
    sinif: 'yarali',
    baslik: 'Güven oylaması',
    metin: 'Sakinler toplandı ve yönetimi başkasına devretmeye karar verdi. Kimse kötü niyetli değildi; sadece yorgun, aç ve dinlenmemiş hissediyorlardı. Sürdürülebilir kararlar ancak insanlar onlara inandığında ve sesleri duyulduğunda ayakta kalır.',
  },
  cokus: {
    sinif: 'cokus',
    baslik: 'Işıklar söndü',
    metin: 'Kaynaklar tükendi, hava ağırlaştı, kapı da kapalı kaldı. Yeşilvadi, Büyük Sessizlik\'ten önceki dünyanın hatasını tekrarladı. Çöküş bir anda değil, her gün verilen küçük kararlarla geldi.',
  },
};

const SON_MUZIKLERI = {
  gercekUtopya: 'son-gercek-utopya',
  yalnizUtopya: 'son-yalniz-utopya',
  kapimizAcikti: 'son-kapimiz-acikti',
  cokus: 'son-isiklar-sondu',
  guvenKaybi: 'son-guven-oylamasi',
};

export function sonGoster({ tip, bilgi }, tekrar) {
  const s = SONLAR[tip];
  if (SON_MUZIKLERI[tip]) muzikCal(SON_MUZIKLERI[tip]);
  modalAc(`
    <div class="son-marka" aria-label="Apoclimate">${oyunLogosu()}</div>
    <div class="son ${s.sinif}">
      ${arayuzGorseli('son', SON_GORSELLERI[tip], 'son-gorsel')}
      <span class="etiket">▸ SON · GÜN ${state.gun}<i class="led"></i></span>
      <h1>${s.baslik}</h1>
      <p>${s.metin}</p>
      <div class="son-istatistik">
        <div><span>Denge</span><b>${state.denge}</b><small>/ 100</small></div>
        <div><span>İnsanlık</span><b>${state.insanlik}</b><small>/ 100</small></div>
        <div><span>Sığınakta</span><b>${state.nufus}</b><small>kişi</small></div>
        <div><span>Geri çevrilen</span><b>${state.reddedilen}</b><small>kişi</small></div>
        ${state.ayrilan ? `<div><span>Tükenip giden</span><b>${state.ayrilan}</b><small>kişi</small></div>` : ''}
        <div><span>Memnuniyet</span><b>${state.memnuniyet}</b><small>/ 100</small></div>
      </div>
      ${secimDersleriHtml(ogrenmeOzeti(state.kararGecmisi), 'Bu oyundaki tercihlerinden')}
      <p class="aciklama">Kaynaklar ve karbon 0–100 oyun puanlarıdır; gerçek miktar veya iklim tahmini değildir. Beş günlük akış, uzun vadeli ilişkileri basitleştirir.</p>
      ${bilgiHtml(bilgi)}
      <button data-tekrar data-varsayilan>Tekrar oyna</button>
    </div>`, { kapatma: false, sinif: 'son-ekrani' });
  kart.querySelector('[data-tekrar]').addEventListener('click', () => {
    modalKapat();
    muzikCal('muzik-umut');
    tekrar();
  });
}

// ---------------------------------------------------------------
//  PROLOG (3 günlük öğretici)
// ---------------------------------------------------------------
// Yeni oyunun ilk ekranı: prolog ise prolog günü, değilse 1. gün radyosu
export function oyunuBaslat() {
  if (prologAktif()) prologGunuBaslat();
  else gunBasligi(state.gun, state.olay.baslik, () => olayGoster(state.olay));
}

// "Yeni oyun" ve "Tekrar oyna" öncesi eğitimi yapma/atlama seçimi
export function yeniOyunSecimi(secildi, geri = null) {
  modalAc(`
    <div class="panel-ust"><span class="etiket">▸ YENİ OYUN<i class="led"></i></span><h2>Prolog oynansın mı?</h2></div>
    <p>Prolog ${PROLOG_GUNLER.length} gün sürer: sığınak boş başlar, kurucular günlere yayılarak gelir ve her odanın konsolunu onlarla adım adım öğrenirsin. Prologda yaptıkların Gün 1'e devreder. Atlarsan doğrudan Gün 1'den, ekip yerinde başlarsın.</p>
    <div class="alt sag">
      ${geri ? '<button class="ikincil" data-geri>Geri</button>' : ''}
      <button class="ikincil" data-secim="atla">Prologu atla (Gün 1)</button>
      <button data-secim="egitim" data-varsayilan>Prologla başla</button>
    </div>`, { kapatma: false, sinif: geri ? 'baslangic' : 'bilgi' });
  kart.querySelector('[data-geri]')?.addEventListener('click', geri);
  kart.querySelectorAll('[data-secim]').forEach((b) => b.addEventListener('click', () => {
    modalKapat();
    secildi(b.dataset.secim === 'egitim');
  }));
}

// Her prolog gününün başı: büyük başlık + gün kartı
export function prologGunuBaslat() {
  const g = prologGunu();
  gunBasligi(`PROLOG ${state.prolog.gun}/${PROLOG_GUNLER.length}`, g.baslik, () => {
    const ilk = state.prolog.gun === 1;
    modalAc(`
      <div class="panel-ust"><span class="etiket">▸ PROLOG · GÜN ${state.prolog.gun}/${PROLOG_GUNLER.length}<i class="led"></i></span><h2>${kacis(g.baslik)}</h2></div>
      ${varsaImg(`${ARAYUZ_ASSET_KLASORU}prolog-${state.prolog.gun}.png`, 'prolog-gorsel')}
      ${ilk ? paragraf(PROLOG_METIN.giris) : ''}
      ${paragraf(g.metin)}
      <div class="ziyaretci-satir"><span>Bugün:</span><span class="chip">👥 ${g.gelen} kurucu gelecek</span><span class="chip">${arayuzIkonu('eylem', '✋')} ${g.eylem} eylem hakkı</span>${g.pano ? '<span class="chip">📋 Yönetim panosu</span>' : ''}</div>
      <div class="alt sag">
        <button class="ikincil" data-prolog-atla>Prologu atla</button>
        <button data-prolog-basla data-varsayilan>Başla</button>
      </div>`, { kapatma: false, sinif: 'radyo-kart' });
    kart.querySelector('[data-prolog-basla]').addEventListener('click', () => { modalKapat(); yayinla('prologPlanla'); });
    kart.querySelector('[data-prolog-atla]').addEventListener('click', () => onay('Prologu atla', 'Gün 1 her zamanki başlangıç değerleriyle açılır; prologdaki ilerleme silinir.', 'Atla', () => yayinla('prologAtla')));
  });
}

// Kapıdaki kurucu: tanıtım + ders + çalışma alanına yönlendirme
export function prologKapiGoster(k, gonder) {
  const veri = PROLOG_KURUCULAR[k.id] || {};
  const makine = MAKINELER[k.varsayilan];
  modalAc(`
    <div class="panel-ust"><span class="etiket">▸ KAPIDA EKİPTEN BİRİ VAR<i class="led"></i></span><h2>${portreRozet(k.id, k.ikon)}${kacis(k.ad)}</h2></div>
    ${portreBuyuk(k.id)}
    <p>${kacis(veri.gelis || k.guclu)}</p>
    <div class="ziyaretci-satir"><span>Çalışma alanı:</span><span class="chip iyi">${makine.ikon} ${kacis(makine.ad)}</span><span>Her gece:</span>${etkiChipleri(makine.uretim)}</div>
    <div class="ziyaretci-satir"><span>Her gece tüketir:</span>${etkiChipleri(nufusTuketimi(1))}</div>
    ${veri.ders ? `<section class="bilgi-karti"><span class="etiket">📘 NASIL OYNANIR · ${KURUCULAR.indexOf(k) + 1}/${KURUCULAR.length}</span><h3>${kacis(veri.ders.baslik)}</h3><p>${kacis(veri.ders.metin)}</p></section>` : ''}
    <div class="alt sag"><button data-gonder data-varsayilan>İçeri al · ${makine.ikon} ${kacis(makine.ad)} odasına yönlendir</button></div>`, { kapatma: false, sinif: 'kapi' });
  kart.querySelector('[data-gonder]').addEventListener('click', () => {
    modalKapat();
    gonder();
    yayinla('ziyaretciKabul', { kisi: 1 });
  });
}

// Prolog yatağı: gece tahmini + onay
export function prologUyuOnay(evet) {
  const t = prologGeceTahmini();
  const son = state.prolog.gun >= PROLOG_GUNLER.length;
  const bos = bosMakineler();
  modalAc(`
    <div class="panel-ust"><span class="etiket">▸ PROLOG · GECE ${state.prolog.gun}<i class="led"></i></span><h2>${son ? 'Uyu: sabah Gün 1' : 'Günü bitir'}</h2></div>
    <div class="ziyaretci-satir"><span>Bu gece kaynaklar:</span>${etkiChipleri(t.degisim) || '<span class="chip">Değişim yok</span>'}</div>
    <div class="ziyaretci-satir"><span>Tahmini denge:</span><span class="chip ${t.denge >= state.denge ? 'iyi' : 'kotu'}">${state.denge} → ${t.denge}</span></div>
    ${bos.length ? `<p class="aciklama">⚙ Operatörü henüz gelmeyen makineler bu gece üretmeyecek: ${bos.map((m) => kacis(MAKINELER[m].ad)).join(', ')}.</p>` : ''}
    ${state.eylem > 0 ? `<p class="aciklama">Hâlâ ${state.eylem} eylem hakkın var; kullanılmayan hak ertesi güne geçmez.</p>` : ''}
    <p class="aciklama">${son ? 'Prologdaki kaynaklar, malzeme ve çalışma modları Gün 1\'e devreder.' : 'Prologda gece tüketimi normal günlerin yaklaşık yarısıdır.'}</p>
    <div class="alt sag"><button class="ikincil" data-kapat>Vazgeç</button><button data-evet data-varsayilan>Uyu</button></div>`, { sinif: 'bilgi' });
  kart.querySelector('[data-evet]').addEventListener('click', () => { modalKapat(); evet(); });
}

export function prologGeceRaporu(rapor, sonGece, devam) {
  modalAc(`
    <div class="panel-ust"><span class="etiket">▸ GECE RAPORU · PROLOG<i class="led"></i></span><h2>${sonGece ? 'Prolog bitti' : 'Sabah oldu'}</h2></div>
    <div class="rapor"><span>Gece değişimi:</span>${etkiChipleri(rapor) || '<span class="chip">Değişim yok</span>'}</div>
    <p>${sonGece ? 'Kurucu ekip yerinde, makineler çalışıyor. Bundan sonrası senin kararlarına bağlı: Gün 1 başlıyor.' : 'Operatörü olan makineler gece üretti. Bugün yeni kurucular geliyor.'}</p>
    <div class="alt sag"><button data-kapat data-varsayilan>${sonGece ? 'Gün 1\'e geç' : 'Devam'}</button></div>`, { kapatma: false, sinif: 'gece' });
  kart.querySelector('[data-kapat]').addEventListener('click', devam);
}
