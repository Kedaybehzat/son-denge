// =============================================================
//  ARAYÜZ (HTML katmanı)
//  HUD, paneller, radyo kartı, onay pencereleri ve son ekranı.
//  Phaser'ın üstünde duran düz HTML/CSS. Görünüm için style.css.
// =============================================================
import { state, abone, eylemYap, eylemYapabilirMi, nufusTuketimi, ziyaretciNetEtki, geceTahmini, AYAR, KAYNAKLAR,
  sakinTanimi, sakinCiktisi, gorevAta, arastirmaSec, arastirmaAcik, masadaArastir, masadaArastirabilirMi,
  MAKINELER, gorevBilgisi, makineOperatoru, makineCalisiyorMu, bosMakineler, kendinCalis, kendinCalisabilirMi, yarinkiYorgunluk, ayrilmaSansi , olayEtkisi, hazirlan, hazirlanabilirMi , kartSecenekleri, kartSecebilirMi, kartSec } from '../state.js';
import { ARASTIRMALAR, GOREVLER, MASA_ARASTIRMA, BATARYA_KAPASITE, OYUNCU_CALISMA_MALIYETI } from '../data/research.js';
import { HIKAYE } from '../data/story.js';
import { HAZIRLIK_MALIYETI } from '../data/events.js';
import { BILGILER } from '../data/facts.js';
import { KURUCULAR } from '../data/visitors.js';
import { portreDosyasi, hikayeDosyasi } from '../data/assets.js';

const hud = document.getElementById('hud');
const modal = document.getElementById('modal');
const kart = modal.querySelector('.kart');

let acik = false;
let kapatilabilir = true;
let aktifPanel = null;
let aktifPanelAnahtar = null;
let panoAcik = false;
let sonMesaj = '';

// Sahne ile arayüz arasında basit olay köprüsü
function yayinla(ad, ayrinti = {}) {
  window.dispatchEvent(new CustomEvent('oyun:' + ad, { detail: ayrinti }));
}

export function gunBasligi(gun, olayAd, bitince) {
  yayinla('gunBasligi', { gun, olayAd, onBitti: bitince });
}

export const acikMi = () => acik;

// ---------------------------------------------------------------
//  Yardımcılar
// ---------------------------------------------------------------
const kacis = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// Görsel varsa gösterilir, yoksa (yüklenemezse) kaldırılır ve emoji yedeği görünür
const portreOneki = (id) => (KURUCULAR.some((k) => k.id === id) ? 'kurucu' : 'ziyaretci');
const portreRozet = (id, ikon) =>
  `<span class="ikon-rozet portre"><img src="${portreDosyasi(portreOneki(id), id)}" alt="" onerror="this.remove()"><span class="ikon-yedek">${ikon}</span></span>`;
const portreBuyuk = (id) =>
  `<img class="portre-buyuk" src="${portreDosyasi(portreOneki(id), id)}" alt="" onerror="this.remove()">`;

const paragraf = (s) => kacis(s).split('\n\n').map((p) => `<p>${p}</p>`).join('');

function etkiChipleri(etki) {
  return Object.entries(etki || {})
    .filter(([, d]) => d !== 0)
    .map(([ad, d]) => {
      const k = KAYNAKLAR[ad];
      const iyi = (d > 0) === k.yuksekIyi;
      return `<span class="chip ${iyi ? 'iyi' : 'kotu'}">${k.ikon} ${d > 0 ? '+' : '−'}${Math.abs(d)} ${k.ad}</span>`;
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
  panoAcik = false; // pano kendini çizdikten sonra tekrar açar
  kart.innerHTML = html;
  kart.className = 'kart ' + sinif;
  if (tema) kart.style.setProperty('--tema', tema);
  else kart.style.removeProperty('--tema');
  kapatilabilir = kapatma;
  modal.classList.remove('gizli');
  acik = true;
  kart.querySelectorAll('[data-kapat]').forEach((b) => b.addEventListener('click', modalKapat));
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
    kart.querySelector(`.eylem[data-i="${Number(e.key) - 1}"]`)?.click();
  } else if (e.key === 'Enter') {
    const b = kart.querySelector('[data-varsayilan]');
    if (b) { e.preventDefault(); b.click(); }
  }
});

// ---------------------------------------------------------------
//  HUD
// ---------------------------------------------------------------
export function hudKur() {
  hud.innerHTML = `
    <div class="hud-gun">
      <div class="gun">GÜN <b data-gun></b><span>/ ${AYAR.maxGun}</span></div>
      <div class="eylem-hakki" title="Kalan eylem hakkı"><span>Eylem</span><span class="noktalar" data-eylem></span></div>
      <div class="nufus" title="Sığınaktaki kişi sayısı">👥 <b data-nufus></b> kişi</div>
    </div>
    <div class="hud-kaynaklar">
      ${Object.entries(KAYNAKLAR).map(([ad, k]) => `
        <div class="kaynak" data-k="${ad}" title="${k.ad}${k.yuksekIyi ? '' : ' (düşük olması iyi)'}">
          <span class="ikon">${k.ikon}</span>
          <div class="bar"><i></i></div>
          <b></b>
        </div>`).join('')}
    </div>
    <div class="hud-ekstra">
      <div class="kaynak hud-arastirma" data-arastirma title="Aktif araştırma">
        <span class="ikon" data-ar-ikon>🧪</span>
        <div class="bar"><i data-ar-bar></i></div>
        <b data-ar-puan></b>
      </div>
      <div class="kaynak hud-batarya" data-batarya title="Batarya deposu">
        <span class="ikon">🔋</span>
        <div class="bar"><i data-bat-bar></i></div>
        <b data-bat></b>
      </div>
    </div>
    <div class="hud-denge">
      <div class="denge-etiket"><span>Distopya</span><b data-denge></b><span>Ütopya</span></div>
      <div class="bar denge"><i></i></div>
    </div>`;
  abone(hudGuncelle);
  hudGuncelle(state);
}

function hudGuncelle(s) {
  if (!s.kaynak) return;
  hud.querySelector('[data-gun]').textContent = s.gun;
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
    arBox.querySelector('[data-ar-ikon]').textContent = ar.ikon;
    const barAr = arBox.querySelector('[data-ar-bar]');
    barAr.style.width = yuzde + '%';
    barAr.className = yuzde >= 50 ? 'iyi' : yuzde >= 25 ? 'orta' : 'kotu';
    arBox.querySelector('[data-ar-puan]').textContent = `${puan}/${ar.maliyet}`;
  } else {
    arBox.style.display = 'none';
  }

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

  if (aktifPanel) panelCiz();
  if (panoAcik) panoCiz();
}

// ---------------------------------------------------------------
//  KONTROL PANELİ
// ---------------------------------------------------------------
export function panelAc(def, anahtar = null) {
  aktifPanel = def;
  aktifPanelAnahtar = anahtar;
  sonMesaj = '';
  panelCiz();
}

// Panelin makine bölümü: kim çalışıyor, gece ne üretecek, boşsa "kendin çalış"
function makinePanelHtml() {
  const id = aktifPanelAnahtar;
  const m = MAKINELER[id];
  if (!m) return '';
  const op = makineOperatoru(id);
  const oyuncu = state.oyuncuMakineler.includes(id);
  const uretim = etkiChipleri(m.uretim);
  if (op || oyuncu) {
    const kim = op ? `${sakinTanimi(op.id).ikon} ${kacis(sakinTanimi(op.id).ad)}` : '🧍 Sen (bugün)';
    return `<div class="ziyaretci-satir makine"><span>Operatör:</span><span class="chip iyi">${kim}</span><span>Bu gece:</span>${uretim}</div>`;
  }
  return `
    <div class="ziyaretci-satir makine bos"><span>Operatör:</span><span class="chip kotu">YOK: bu gece üretim yok</span></div>
    <button class="eylem" data-kendin ${kendinCalisabilirMi(id) ? '' : 'disabled'}>
      <span class="no">🧍</span>
      <span class="govde"><span class="ad">Makinede kendin çalış</span><span class="chipler">${uretim}</span></span>
      <span class="maliyet">${OYUNCU_CALISMA_MALIYETI} eylem</span>
    </button>
    <p class="aciklama">Görev Panosu'ndan bir sakini buraya gönderirsen her gece kendiliğinden üretir.</p>`;
}

function panelCiz() {
  const def = aktifPanel;
  const goster = (def.gosterge || []).map((ad) => {
    const k = KAYNAKLAR[ad];
    const v = state.kaynak[ad];
    return `<div class="mini"><span>${k.ikon} ${k.ad}</span><div class="bar"><i class="${barSinifi(ad, v)}" style="width:${v}%"></i></div><b>${v}</b></div>`;
  }).join('');

  const eylemler = def.eylemler.map((e, i) => `
    <button class="eylem ${e.kirli ? 'kirli' : ''}" data-i="${i}" ${eylemYapabilirMi(e) ? '' : 'disabled'}>
      <span class="no">${i + 1}</span>
      <span class="govde">
        <span class="ad">${kacis(e.ad)}${e.kirli ? ' <em>⚠ kirletir</em>' : ''}</span>
        <span class="chipler">${etkiChipleri(e.etki)}</span>
      </span>
      <span class="maliyet">${e.maliyet ?? 1} eylem</span>
    </button>`).join('');

  const bitti = state.eylem <= 0
    ? '<p class="uyari">Bugünlük eylem hakkın bitti. Günü bitirmek için yaşam alanındaki yatağa git.</p>'
    : '';

  modalAc(`
    <div class="panel-ust">
      <span class="etiket">▸ ${kacis(def.kod || 'KONTROL')} // ÇEVRİMİÇİ<i class="led"></i></span>
      <h2>${kacis(def.baslik)}</h2>
    </div>
    <p class="aciklama">${kacis(def.aciklama)}</p>
    ${makinePanelHtml()}
    <div class="mini-gostergeler">${goster}</div>
    <div class="eylemler">${eylemler}</div>
    ${sonMesaj ? `<p class="mesaj">&gt; ${kacis(sonMesaj)}</p>` : ''}
    ${bitti}
    <div class="alt">
      <span class="kalan"><span>Kalan eylem</span> <span class="noktalar">${eylemNoktalari()}</span></span>
      <button class="ikincil" data-kapat>Kapat (Esc)</button>
    </div>`, { sinif: 'panel', tema: def.tema });

  kart.querySelector('[data-kendin]')?.addEventListener('click', () => {
    if (!kendinCalisabilirMi(aktifPanelAnahtar)) return;
    sonMesaj = 'Kolları sıvadın. Makine bu gece senin sayende üretecek.';
    kendinCalis(aktifPanelAnahtar); // abonelik paneli yeniden çizer
  });

  kart.querySelectorAll('.eylem[data-i]').forEach((b) => {
    b.addEventListener('click', () => {
      const e = def.eylemler[Number(b.dataset.i)];
      if (eylemYapabilirMi(e)) {
        sonMesaj = e.mesaj || 'Tamamlandı.';
        const basarili = eylemYap(e); // abonelik panelCiz'i tekrar çağırır
        if (basarili && aktifPanelAnahtar) {
          yayinla('eylemYapildi', { panel: aktifPanelAnahtar, etki: e.etki, kirli: !!e.kirli });
        }
      }
    });
  });
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
  modalAc(`${olayHtml(olay)}<div class="alt sag"><button data-kapat data-varsayilan>Tamam</button></div>`, { sinif: 'radyo-kart' });
  hazirlikBagla(() => olayGoster(olay));
}

function bilgiHtml(b) {
  if (!b) return '';
  return `
    <div class="bilgi-karti">
      <span class="etiket">💡 BİLİYOR MUYDUN?</span>
      <p>${kacis(b.metin)}</p>
      <span class="kaynak">Kaynak: ${kacis(b.kaynak)}</span>
    </div>`;
}

// Gün geçişi iki adım: önce gece raporu + bilgi kartı, sonra sabah radyosu
export function gunBaslangici({ rapor, bilgi, gidenZiyaretci, arastirmaPuani, arastirmaBitti, bataryaKullanim, bataryaSarj, ayrilanlar = [] }) {
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
    ${ayrilanlar.map((z) => `<p class="uyari">😮‍💨 ${kacis(z.ad)} tükenmişti ve gece sessizce sığınaktan ayrıldı.</p>`).join('')}
    ${gitti}
    ${bilgiHtml(bilgi)}
    <div class="alt sag"><button data-sabah data-varsayilan>Sabah oldu</button></div>`, { kapatma: false, sinif: 'gece' });
  kart.querySelector('[data-sabah]').addEventListener('click', sabahGoster);
}

function sabahGoster() {
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
  if (!k) return modalKapat();
  const secenekler = kartSecenekleri(k);
  const satirlar = secenekler.map((sec, i) => {
    const chipler = [
      etkiChipleri(sec.etki),
      sec.geceEtki ? `<span class="gece-etiket">bu gece:</span>${etkiChipleri(sec.geceEtki)}` : '',
      sec.arastirma ? `<span class="chip iyi">🧪 +${sec.arastirma.puan} ${kacis(ARASTIRMALAR[sec.arastirma.id].ad)}</span>` : '',
      sec.insanlik ? `<span class="chip kotu">Sakinlerin güveni azalır</span>` : '',
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
    <div class="panel-ust"><span class="etiket">▸ KARAR KARTI<i class="led uyari"></i></span><h2>${kacis(k.baslik)}</h2></div>
    <p>${kacis(k.metin)}</p>
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
    <div class="ziyaretci-satir"><span>Olası görevler:</span><span class="chip">${z.calisir === false ? 'Çalışmaz' : 'Üretim · Bakım · Araştırma'}</span></div>
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
export function panoAc() {
  panoAcik = true;
  sonMesaj = '';
  panoCiz();
}

// Bir görevde kişinin üreteceğinin kısa metni (koşullar hariç)
function gorevAciklama(s, gorev) {
  const c = sakinCiktisi({ id: s.id, gorev }, false);
  const z = sakinTanimi(s.id);
  const parca = Object.entries(c.etki)
    .filter(([ad, d]) => d && !(z.ekTuketim && z.ekTuketim[ad] === d))
    .map(([ad, d]) => `${d > 0 ? '+' : '−'}${Math.abs(d)} ${KAYNAKLAR[ad].ikon}`);
  if (c.puan) parca.push(`+${c.puan} 🧪`);
  if (c.eylem) parca.push(`+${c.eylem} eylem`);
  return parca.join(' ') || 'üretim yok';
}

// Makinelerin durum özeti: operatör, oyuncu ya da BOŞ
function makineDurumHtml() {
  return Object.entries(MAKINELER).map(([id, m]) => {
    const op = makineOperatoru(id);
    const oyuncu = state.oyuncuMakineler.includes(id);
    const kim = op ? `${sakinTanimi(op.id).ikon} ${kacis(sakinTanimi(op.id).ad)}` : oyuncu ? '🧍 Sen (bugün)' : 'BOŞ: üretim yok';
    return `<span class="chip ${op || oyuncu ? 'iyi' : 'kotu'}">${m.ikon} ${kacis(m.ad)}: ${kim}</span>`;
  }).join('');
}

// Laboratuvarda şu an kimler çalışıyor + bu gece ne üretecekler
function laboratuvarDurumHtml() {
  const laborantlar = state.sakinler.filter((s) => s.gorev === 'arastirma');
  const puan = laborantlar.reduce((a, s) => a + sakinCiktisi(s, false).puan, 0);
  if (!laborantlar.length) {
    return `<span class="chip">🧪 Laboratuvar: kimse yok (herkesi atayabilirsin, +2 puan/gün; bilim adamı 2 kat)</span>`;
  }
  const kim = laborantlar.map((s) => `${sakinTanimi(s.id).ikon} ${kacis(sakinTanimi(s.id).ad)}`).join(', ');
  return `<span class="chip iyi">🧪 Laboratuvar: ${kim} · bu gece +${puan} 🧪</span>`;
}

// Sakinin yorgunluk göstergesi: şu an → bu geceden sonra, risk varsa yüzde
function yorgunlukChip(s) {
  if (!s.gorev) return '';
  const simdi = s.yorgunluk || 0;
  const yarin = yarinkiYorgunluk(s);
  const sans = ayrilmaSansi(yarin);
  const sinif = sans > 0 ? 'kotu' : yarin >= AYAR.yorgunlukUyari ? 'uyari-chip' : '';
  const ok = yarin > simdi ? '↑' : yarin < simdi ? '↓' : '';
  const risk = sans > 0 ? ` · %${Math.round(sans * 100)} ayrılabilir` : yarin >= AYAR.yorgunlukUyari ? ' · dinlenmeli' : '';
  return `<span class="chip yorgunluk ${sinif}" title="Çalışınca her gece +1, dinlenince −2. ${AYAR.yorgunlukAyrilmaEsigi} ve üstünde sığınaktan ayrılabilir.">😮‍💨 ${simdi}${ok ? ` ${ok} ${yarin}` : ''}${risk}</span>`;
}

function panoCiz() {
  const sakinler = state.sakinler.map((s) => {
    const z = sakinTanimi(s.id);
    const cikti = sakinCiktisi(s);
    const gorevler = [...Object.keys(MAKINELER), ...Object.keys(GOREVLER)];
    const butonlar = z.calisir === false
      ? '<span class="chip">Çalışmaz</span>'
      : gorevler.map((id) => {
          const g = gorevBilgisi(id);
          const op = MAKINELER[id] ? makineOperatoru(id) : null;
          const dolu = op && op !== s ? `dolu: ${sakinTanimi(op.id).ad}` : '';
          const alt = id === 'bosta' ? 'üretim yok' : gorevAciklama(s, id);
          return `
          <button class="gorev ${s.gorev === id ? 'secili' : ''} ${dolu ? 'dolu' : ''}" data-uid="${s.uid}" data-gorev="${id}"
            title="${dolu ? kacis(dolu + ' (o kişi dinlenmeye geçer)') : ''}">
            ${g.ikon} ${kacis(g.ad)}${z.uzman === id ? ' ★' : ''}<small>${kacis(dolu || alt)}</small>
          </button>`;
        }).join('');
    return `
      <div class="sakin-satir">
        <div class="sakin-ad">${portreRozet(s.id, z.ikon)}<b>${kacis(z.ad)}</b>
          ${yorgunlukChip(s)}
          ${z.kosullu ? `<span class="chip ${cikti.kosul ? 'kotu' : ''}">${cikti.kosul ? '⚠ ' : ''}${kacis(z.kosullu)}</span>` : ''}</div>
        <div class="gorevler">${butonlar}</div>
      </div>`;
  }).join('');

  const a = state.arastirma;
  const projeler = Object.entries(ARASTIRMALAR).map(([id, p]) => {
    const puan = Math.min(p.maliyet, a.puan[id] || 0);
    const acik = arastirmaAcik(id);
    return `
      <button class="proje ${a.aktif === id ? 'secili' : ''} ${acik ? 'acik' : ''}" data-proje="${id}" ${acik ? 'disabled' : ''}>
        <span class="ad">${p.ikon} ${kacis(p.ad)} ${acik ? '✓' : a.aktif === id ? '◂ aktif' : ''}</span>
        <span class="aciklama">${kacis(p.aciklama)}</span>
        <span class="bar"><i class="iyi" style="width:${(puan / p.maliyet) * 100}%"></i></span>
        <span class="kalan">${acik ? 'Tamamlandı' : `${puan} / ${p.maliyet} puan`}</span>
      </button>`;
  }).join('');

  const batarya = arastirmaAcik('batarya')
    ? `<div class="ziyaretci-satir"><span>Batarya:</span><span class="chip iyi">🔋 ${state.batarya} / ${BATARYA_KAPASITE}</span></div>`
    : '';

  modalAc(`
    <div class="panel-ust"><span class="etiket">▸ GÖREV_PANOSU // ÇEVRİMİÇİ<i class="led"></i></span><h2>Görevler ve Araştırma</h2></div>
    <p class="aciklama">Her makinede bir operatör çalışır; <b>operatörü olmayan makine üretim yapmaz</b>. Boş makinenin paneline gidip kendin çalışabilirsin (${OYUNCU_CALISMA_MALIYETI} eylem). ★ uzmanlık yeridir: orada ek katkı verir. Laboratuvar sınırsız: istediğin kadar sakini araştırmaya atayabilirsin, her biri +2 puan/gün verir. <b>Yorgunluk:</b> çalışan her gece +1, dinlenen −2; ${AYAR.yorgunlukAyrilmaEsigi} ve üstünde sakin sığınaktan ayrılabilir. Görev değişikliği bu geceden geçerlidir; +1 eylem hakkı yarın başlar.</p>
    <div class="ziyaretci-satir makineler">${makineDurumHtml()}</div>
    <div class="ziyaretci-satir laboratuvar">${laboratuvarDurumHtml()}</div>
    <div class="sakinler">${sakinler}</div>
    <h3>Araştırma</h3>
    <div class="projeler">${projeler}</div>
    ${batarya}
    <button class="eylem" data-masa ${masadaArastirabilirMi() ? '' : 'disabled'}>
      <span class="no">🧪</span>
      <span class="govde"><span class="ad">${kacis(MASA_ARASTIRMA.ad)}</span><span class="chipler"><span class="chip iyi">+${MASA_ARASTIRMA.puan} araştırma puanı</span></span></span>
      <span class="maliyet">${MASA_ARASTIRMA.maliyet} eylem</span>
    </button>
    ${sonMesaj ? `<p class="mesaj">&gt; ${kacis(sonMesaj)}</p>` : ''}
    <div class="alt">
      <span class="kalan"><span>Kalan eylem</span> <span class="noktalar">${eylemNoktalari()}</span></span>
      <button class="ikincil" data-kapat>Kapat (Esc)</button>
    </div>`, { sinif: 'panel pano', tema: '#7fd1b9' });
  panoAcik = true;

  kart.querySelectorAll('[data-gorev]').forEach((b) => b.addEventListener('click', () => {
    sonMesaj = '';
    gorevAta(Number(b.dataset.uid), b.dataset.gorev);
  }));
  kart.querySelectorAll('[data-proje]').forEach((b) => b.addEventListener('click', () => {
    sonMesaj = '';
    arastirmaSec(b.dataset.proje);
  }));
  kart.querySelector('[data-masa]').addEventListener('click', () => {
    if (!masadaArastirabilirMi()) return;
    sonMesaj = 'Notlar, çizimler, hesaplar...';
    const biten = masadaArastir();
    if (biten) sonMesaj = `${ARASTIRMALAR[biten].ad} tamamlandı! Etkisi bu geceden başlıyor.`;
    panoCiz();
  });
}

// Günü bitirmeden önce gece tahmini + onay
export function gunuBitirOnay(evet) {
  const t = geceTahmini();
  const uyarilar = [];
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
    <p class="aciklama">Tahmin; sabit gece tüketimini, ${state.nufus} kişinin tüketimini, çalışan makinelerin üretimini, sakinlerin katkılarını ve bugünkü olayı içerir. Yarının olayı bilinmez.</p>
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
  hud.style.visibility = 'hidden';
  const h = HIKAYE[i];
  const noktalar = HIKAYE.map((_, j) => `<i class="${j <= i ? 'dolu' : ''}"></i>`).join('');
  modalAc(`
    <div class="hikaye-ekrani">
      <img class="hikaye-gorsel" src="${hikayeDosyasi(i + 1)}" alt="" onerror="this.remove()">
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
  hud.style.visibility = '';
  bitti();
}

export function baslangicEkrani(basla) {
  modalAc(`
    <div class="baslik-ekrani">
      <span class="etiket">▸ ÇALIŞMA ADI<i class="led"></i></span>
      <h1>Son Denge</h1>
      <p><b>Yeşilvadi</b>, Büyük Sessizlik'ten sonra kurulan son ütopya. Ne kadar dayanacağı senin kararlarına bağlı.</p>
      <p>${AYAR.maxGun} gün boyunca enerjiyi, suyu, gıdayı ve atığı yönet. Kolay çözümlerin bir bedeli var.</p>
      <div class="kontroller">
        <span><kbd>A</kbd><kbd>D</kbd> / <kbd>←</kbd><kbd>→</kbd> yürü</span>
        <span><kbd>E</kbd> etkileşim</span>
        <span><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> panel eylemi</span>
        <span><kbd>Esc</kbd> kapat</span>
      </div>
      <button data-basla data-varsayilan>Başla</button>
    </div>`, { kapatma: false, sinif: 'baslangic' });
  kart.querySelector('[data-basla]').addEventListener('click', () => {
    modalKapat();
    basla();
  });
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
  cokus: {
    sinif: 'cokus',
    baslik: 'Işıklar söndü',
    metin: 'Kaynaklar tükendi, hava ağırlaştı, kapı da kapalı kaldı. Yeşilvadi, Büyük Sessizlik\'ten önceki dünyanın hatasını tekrarladı. Çöküş bir anda değil, her gün verilen küçük kararlarla geldi.',
  },
};

export function sonGoster({ tip, bilgi }, tekrar) {
  const s = SONLAR[tip];
  modalAc(`
    <div class="son ${s.sinif}">
      <span class="etiket">▸ SON · GÜN ${state.gun}<i class="led"></i></span>
      <h1>${s.baslik}</h1>
      <p>${s.metin}</p>
      <div class="son-istatistik">
        <div><span>Denge</span><b>${state.denge}</b><small>/ 100</small></div>
        <div><span>İnsanlık</span><b>${state.insanlik}</b><small>/ 100</small></div>
        <div><span>Sığınakta</span><b>${state.nufus}</b><small>kişi</small></div>
        <div><span>Geri çevrilen</span><b>${state.reddedilen}</b><small>kişi</small></div>
        ${state.ayrilan ? `<div><span>Tükenip giden</span><b>${state.ayrilan}</b><small>kişi</small></div>` : ''}
      </div>
      ${bilgiHtml(bilgi)}
      <button data-tekrar data-varsayilan>Tekrar oyna</button>
    </div>`, { kapatma: false, sinif: 'son-ekrani' });
  kart.querySelector('[data-tekrar]').addEventListener('click', () => {
    modalKapat();
    tekrar();
  });
}
