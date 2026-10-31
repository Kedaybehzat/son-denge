// =============================================================
//  ARAYÜZ (HTML katmanı)
//  HUD, paneller, radyo kartı, onay pencereleri ve son ekranı.
//  Phaser'ın üstünde duran düz HTML/CSS. Görünüm için style.css.
// =============================================================
import { state, abone, eylemYap, eylemYapabilirMi, nufusTuketimi, AYAR, KAYNAKLAR } from '../state.js';
import { HIKAYE } from '../data/story.js';

const hud = document.getElementById('hud');
const modal = document.getElementById('modal');
const kart = modal.querySelector('.kart');

let acik = false;
let kapatilabilir = true;
let aktifPanel = null;
let aktifPanelAnahtar = null;
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
  if (aktifPanel) panelCiz();
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
    <div class="mini-gostergeler">${goster}</div>
    <div class="eylemler">${eylemler}</div>
    ${sonMesaj ? `<p class="mesaj">&gt; ${kacis(sonMesaj)}</p>` : ''}
    ${bitti}
    <div class="alt">
      <span class="kalan"><span>Kalan eylem</span> <span class="noktalar">${eylemNoktalari()}</span></span>
      <button class="ikincil" data-kapat>Kapat (Esc)</button>
    </div>`, { sinif: 'panel', tema: def.tema });

  kart.querySelectorAll('.eylem').forEach((b) => {
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
  modalAc(`${olayHtml(olay)}<div class="alt sag"><button data-kapat data-varsayilan>Tamam</button></div>`, { sinif: 'radyo-kart' });
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
export function gunBaslangici({ rapor, bilgi, gidenZiyaretci }) {
  const gitti = gidenZiyaretci
    ? `<p class="uyari">🚪 ${kacis(gidenZiyaretci.ad)} kapıda beklemekten vazgeçip gitti.</p>`
    : '';
  modalAc(`
    <div class="panel-ust"><span class="etiket">▸ GECE RAPORU<i class="led"></i></span><h2>Gün ${state.gun - 1} sona erdi</h2></div>
    <div class="rapor"><span>Gece tüketimi (👥 ${state.nufus} kişi):</span>${etkiChipleri(rapor) || '<span class="chip">Değişim yok</span>'}</div>
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
    <div class="alt sag"><button data-kapat data-varsayilan>Güne başla</button></div>`, { sinif: 'sabah' });
}

// ---------------------------------------------------------------
//  KAPIDAKİ ZİYARETÇİ
// ---------------------------------------------------------------
export function ziyaretciGoster(z, kabul, ret) {
  const katkiVar = z.anlik || z.gunlukKatki || z.eylemArtisi;
  modalAc(`
    <div class="panel-ust"><span class="etiket">▸ KAPIDA BİRİ VAR<i class="led uyari"></i></span><h2><span class="ikon-rozet">${z.ikon}</span>${kacis(z.ad)}</h2></div>
    <p class="kisi-sayisi">👥 ${z.kisi} kişi</p>
    <p>${kacis(z.metin)}</p>
    <div class="ziyaretci-satir"><span>Getirdikleri:</span><span class="chip ${katkiVar ? 'iyi' : ''}">${kacis(z.katkiMetni)}</span></div>
    <div class="ziyaretci-satir"><span>Her gece ek tüketim:</span>${etkiChipleri(nufusTuketimi(z.kisi))}</div>
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
      </div>
      ${bilgiHtml(bilgi)}
      <button data-tekrar data-varsayilan>Tekrar oyna</button>
    </div>`, { kapatma: false, sinif: 'son-ekrani' });
  kart.querySelector('[data-tekrar]').addEventListener('click', () => {
    modalKapat();
    tekrar();
  });
}
