// =============================================================
//  ARAYÜZ (HTML katmanı)
//  HUD, paneller, radyo kartı, onay pencereleri ve son ekranı.
//  Phaser'ın üstünde duran düz HTML/CSS. Görünüm için style.css.
// =============================================================
import { state, abone, eylemYap, eylemYapabilirMi, AYAR, KAYNAKLAR } from '../state.js';

const hud = document.getElementById('hud');
const modal = document.getElementById('modal');
const kart = modal.querySelector('.kart');

let acik = false;
let kapatilabilir = true;
let aktifPanel = null;
let sonMesaj = '';

export const acikMi = () => acik;

// ---------------------------------------------------------------
//  Yardımcılar
// ---------------------------------------------------------------
const kacis = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
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

function modalAc(html, { kapatma = true } = {}) {
  kart.innerHTML = html;
  kapatilabilir = kapatma;
  modal.classList.remove('gizli');
  acik = true;
  kart.querySelectorAll('[data-kapat]').forEach((b) => b.addEventListener('click', modalKapat));
}

export function modalKapat() {
  modal.classList.add('gizli');
  acik = false;
  aktifPanel = null;
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
    </div>
    <div class="hud-kaynaklar">
      ${Object.entries(KAYNAKLAR).map(([ad, k]) => `
        <div class="kaynak" data-k="${ad}" title="${k.ad}${k.yuksekIyi ? '' : ' (düşük olması iyi)'}">
          <span class="ikon">${k.ikon}</span>
          <div class="bar"><i></i></div>
          <b></b>
        </div>`).join('')}
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
  if (aktifPanel) panelCiz();
}

// ---------------------------------------------------------------
//  KONTROL PANELİ
// ---------------------------------------------------------------
export function panelAc(def) {
  aktifPanel = def;
  sonMesaj = '';
  panelCiz();
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
    <div class="panel-ust"><span class="etiket">KONTROL PANELİ</span><h2>${kacis(def.baslik)}</h2></div>
    <p class="aciklama">${kacis(def.aciklama)}</p>
    <div class="mini-gostergeler">${goster}</div>
    <div class="eylemler">${eylemler}</div>
    ${sonMesaj ? `<p class="mesaj">✓ ${kacis(sonMesaj)}</p>` : ''}
    ${bitti}
    <div class="alt">
      <span class="kalan">Kalan eylem <span class="noktalar">${eylemNoktalari()}</span></span>
      <button class="ikincil" data-kapat>Kapat (Esc)</button>
    </div>`);

  kart.querySelectorAll('.eylem').forEach((b) => {
    b.addEventListener('click', () => {
      const e = def.eylemler[Number(b.dataset.i)];
      if (eylemYapabilirMi(e)) {
        sonMesaj = e.mesaj || 'Tamamlandı.';
        eylemYap(e); // abonelik panelCiz'i tekrar çağırır
      }
    });
  });
}

// ---------------------------------------------------------------
//  RADYO / OLAY KARTI
// ---------------------------------------------------------------
function olayHtml(olay) {
  const satirlar = [];
  if (olay.anlik) satirlar.push(`<div class="etki-satir"><span>Hemen:</span>${etkiChipleri(olay.anlik)}</div>`);
  if (olay.gunSonu) satirlar.push(`<div class="etki-satir"><span>Bu gece ayrıca:</span>${etkiChipleri(olay.gunSonu)}</div>`);
  if (olay.eylem) satirlar.push(`<div class="etki-satir"><span>Bugün:</span><span class="chip kotu">Eylem hakkı ${olay.eylem}</span></div>`);
  return `
    <div class="radyo">
      <div class="radyo-ust">📻 YEŞİLVADİ RADYOSU · GÜN ${state.gun}</div>
      <h3>${kacis(olay.baslik)}</h3>
      ${paragraf(olay.metin)}
      ${satirlar.join('')}
    </div>`;
}

export function olayGoster(olay) {
  modalAc(`${olayHtml(olay)}<div class="alt sag"><button data-kapat data-varsayilan>Tamam</button></div>`);
}

export function gunBaslangici(rapor) {
  modalAc(`
    <div class="panel-ust"><span class="etiket">YENİ GÜN</span><h2>Gün ${state.gun} / ${AYAR.maxGun}</h2></div>
    <div class="rapor"><span>Gece raporu:</span>${etkiChipleri(rapor) || '<span class="chip">Değişim yok</span>'}</div>
    ${olayHtml(state.olay)}
    <div class="alt sag"><button data-kapat data-varsayilan>Güne başla</button></div>`, { kapatma: true });
}

// ---------------------------------------------------------------
//  ONAY / BİLGİ
// ---------------------------------------------------------------
export function onay(baslik, metin, evetYazi, evet) {
  modalAc(`
    <h2>${kacis(baslik)}</h2>
    ${paragraf(metin)}
    <div class="alt sag">
      <button class="ikincil" data-kapat>Vazgeç</button>
      <button data-evet data-varsayilan>${kacis(evetYazi)}</button>
    </div>`);
  kart.querySelector('[data-evet]').addEventListener('click', () => {
    modalKapat();
    evet();
  });
}

export function bilgi(baslik, metin) {
  modalAc(`<h2>${kacis(baslik)}</h2>${paragraf(metin)}<div class="alt sag"><button data-kapat data-varsayilan>Tamam</button></div>`);
}

// ---------------------------------------------------------------
//  BAŞLANGIÇ VE SON EKRANLARI
// ---------------------------------------------------------------
export function baslangicEkrani(basla) {
  modalAc(`
    <div class="baslik-ekrani">
      <span class="etiket">ÇALIŞMA ADI</span>
      <h1>Son Denge</h1>
      <p>2071. Dünya kaynaklarının sonuna geldi. <b>Yeşilvadi</b>, çöküşten sonra kurulan son ütopya, ama ne kadar dayanacağı senin kararlarına bağlı.</p>
      <p>${AYAR.maxGun} gün boyunca enerjiyi, suyu, gıdayı ve atığı yönet. Kolay çözümlerin bir bedeli var.</p>
      <div class="kontroller">
        <span><kbd>A</kbd><kbd>D</kbd> / <kbd>←</kbd><kbd>→</kbd> yürü</span>
        <span><kbd>E</kbd> etkileşim</span>
        <span><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> panel eylemi</span>
        <span><kbd>Esc</kbd> kapat</span>
      </div>
      <button data-basla data-varsayilan>Başla</button>
    </div>`, { kapatma: false });
  kart.querySelector('[data-basla]').addEventListener('click', () => {
    modalKapat();
    basla();
  });
}

const SONLAR = {
  utopya: {
    baslik: 'Yeşilvadi nefes alıyor',
    metin: 'Beş günün sonunda sera yeşil, tanklar dolu, gökyüzü açık. Kolay yolu seçmedin ve ütopya ayakta kaldı. Dünyanın geri kalanı için hâlâ umut var.',
  },
  yarali: {
    baslik: 'Ayakta, ama yorgun',
    metin: 'Yeşilvadi yıkılmadı, ama eski hâlinden uzak. Hava ağır, kaynaklar kıt. Ütopya ile distopya arasındaki çizgi hiç bu kadar ince olmamıştı.',
  },
  cokus: {
    baslik: 'Işıklar söndü',
    metin: 'Kaynaklar tükendi, hava solunamaz hâle geldi. Yeşilvadi, önceki şehirlerin yaptığı hatayı tekrarladı. Çöküş bir anda değil, her gün verilen küçük kararlarla geldi.',
  },
};

export function sonGoster(tip, tekrar) {
  const s = SONLAR[tip];
  modalAc(`
    <div class="son ${tip}">
      <span class="etiket">SON · GÜN ${state.gun}</span>
      <h1>${s.baslik}</h1>
      <p>${s.metin}</p>
      <div class="son-denge">Son denge: <b>${state.denge}</b> / 100</div>
      <button data-tekrar data-varsayilan>Tekrar oyna</button>
    </div>`, { kapatma: false });
  kart.querySelector('[data-tekrar]').addEventListener('click', () => {
    modalKapat();
    tekrar();
  });
}
