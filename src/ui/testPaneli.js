// =============================================================
//  TEST PANELİ (geliştirme aracı)
//  F9 ya da Ayarlar → "Test paneli" ile açılır. Kaynakları ve diğer
//  değişkenleri doğrudan değiştirir, ziyaretçi/olay/kart/son tetikler.
//  Oyun kurallarını değiştirmez; yalnız state'i elle düzenler.
// =============================================================
import { state, abone, testDegistir, KAYNAKLAR, AYAR, MAKINELER, sakinTanimi, prologAktif } from '../state.js';
import { ZIYARETCILER } from '../data/visitors.js';
import { OLAYLAR, ILK_OLAY } from '../data/events.js';
import { KARTLAR } from '../data/cards.js';
import { ARASTIRMALAR, GOREVLER, BATARYA_KAPASITE } from '../data/research.js';
import { YAPILAR } from '../data/structures.js';
import { kaydiSil } from '../kayit.js';

const SON_TIPLERI = { gercekUtopya: 'Yeşilvadi nefes alıyor', yalnizUtopya: 'Yalnız bir ütopya', kapimizAcikti: 'Kapımız açıktı', cokus: 'Işıklar söndü', guvenKaybi: 'Güven oylaması' };
// Sayısal alanlar: [etiket, en az, en çok, okuma, yazma]
const SAYILAR = [
  ...Object.entries(KAYNAKLAR).map(([ad, k]) => [`${k.ikon} ${k.ad}`, 0, 100, (s) => s.kaynak[ad], (s, v) => { s.kaynak[ad] = v; }]),
  ['🙂 Memnuniyet', 0, 100, (s) => s.memnuniyet, (s, v) => { s.memnuniyet = v; }],
  ['❤ İnsanlık (gizli)', 0, 100, (s) => s.insanlik, (s, v) => { s.insanlik = v; }],
  ['⚡ Eylem hakkı', 0, 10, (s) => s.eylem, (s, v) => { s.eylem = v; }],
  ['📅 Gün', 1, AYAR.maxGun, (s) => s.gun, (s, v) => { if (!prologAktif()) s.gun = v; }],
  ['🧱 Malzeme', 0, 100, (s) => s.malzeme, (s, v) => { s.malzeme = v; }],
  ['🔋 Batarya', 0, BATARYA_KAPASITE, (s) => s.batarya, (s, v) => { s.batarya = v; }],
];

let kok = null;
const yayinla = (ad, ayrinti = {}) => window.dispatchEvent(new CustomEvent('oyun:' + ad, { detail: ayrinti }));
const kacis = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const secenekler = (liste, ad = (x) => x.baslik || x.ad || x.id) => liste.map((x) => `<option value="${kacis(x.id)}">${kacis(ad(x))}</option>`).join('');
const gorevSecenekleri = (secili) => [...Object.entries(MAKINELER).map(([id, m]) => [id, m.ad]), ...Object.entries(GOREVLER).map(([id, g]) => [id, g.ad])]
  .map(([id, ad]) => `<option value="${id}" ${id === secili ? 'selected' : ''}>${kacis(ad)}</option>`).join('');

function ciz() {
  kok.innerHTML = `
    <header><b>🛠 Test paneli</b><span>F9 ile aç/kapat</span><button data-kapat title="Kapat">✕</button></header>
    <section><h4>Değişkenler</h4>
      ${SAYILAR.map(([ad, min, max], i) => `<label class="tp-sayi"><span>${ad}</span>
        <input type="range" min="${min}" max="${max}" data-aralik="${i}"><input type="number" min="${min}" max="${max}" data-sayi="${i}"></label>`).join('')}
      <p class="tp-not">Denge: <b data-denge></b> · Nüfus: <b data-nufus></b> · ${prologAktif() ? `Prolog ${state.prolog.gun}/3 aktif` : `Olay: <b data-olay></b>`}</p>
    </section>
    <section><h4>Sakinler</h4><div data-sakinler></div>
      <div class="tp-satir"><button data-yorgun-sifir>Yorgunlukları sıfırla</button><button data-yorgun-max>Herkesi yor (5)</button></div>
    </section>
    <section><h4>Kapı ve olaylar</h4>
      <div class="tp-satir"><select data-ziyaretci>${secenekler(ZIYARETCILER, (z) => `${z.ikon} ${z.ad}`)}</select><button data-ziyaretci-getir>Kapıya getir</button><button data-ziyaretci-al>Hemen içeri al</button></div>
      <div class="tp-satir"><select data-olay>${secenekler([ILK_OLAY, ...OLAYLAR])}</select><button data-olay-bugun>Bugünün olayı yap</button><button data-olay-yarin>Yarının tahmini yap</button></div>
      <div class="tp-satir"><select data-kart>${secenekler(KARTLAR, (k) => k.baslik || k.id)}</select><button data-kart-goster>Kartı göster</button></div>
    </section>
    <section><h4>Araştırma (açık)</h4><div class="tp-kutular">${Object.entries(ARASTIRMALAR).map(([id, a]) => `<label><input type="checkbox" data-arastirma="${id}"> ${a.ikon || ''} ${kacis(a.ad)}</label>`).join('')}</div></section>
    <section><h4>Yapılar (kurulu)</h4><div class="tp-kutular">${Object.entries(YAPILAR).map(([id, y]) => `<label><input type="checkbox" data-yapi="${id}"> ${kacis(y.ad)}</label>`).join('')}</div></section>
    <section><h4>Akış</h4>
      <div class="tp-satir"><button data-gunu-bitir>Günü bitir</button><button data-eylem-doldur>Eylemleri doldur</button></div>
      <div class="tp-satir"><select data-son>${Object.entries(SON_TIPLERI).map(([id, ad]) => `<option value="${id}">${ad}</option>`).join('')}</select><button data-son-goster>Son ekranını göster</button></div>
      <div class="tp-satir"><button data-yeni="prolog">Prologdan başlat</button><button data-yeni="gun1">Gün 1'den başlat</button><button data-kayit-sil>Kaydı sil</button></div>
    </section>`;
  bagla();
  guncelle();
}

function sakinlerHtml() {
  if (!state.sakinler.length) return '<p class="tp-not">Sığınakta kimse yok.</p>';
  return state.sakinler.map((s) => {
    const z = sakinTanimi(s.id);
    return `<div class="tp-sakin" data-uid="${s.uid}"><span>${z.ikon} ${kacis(z.ad)}</span>
      <select data-gorev ${z.calisir === false ? 'disabled' : ''}><option value="">—</option>${gorevSecenekleri(s.gorev)}</select>
      <label>Yorg. <input type="number" min="0" max="10" value="${s.yorgunluk || 0}" data-yorgunluk></label>
      <button data-cikar title="Sığınaktan çıkar">✕</button></div>`;
  }).join('');
}

function guncelle() {
  if (!kok || kok.hidden) return;
  const odak = kok.contains(document.activeElement) ? document.activeElement : null;
  SAYILAR.forEach(([, , , oku], i) => {
    for (const el of kok.querySelectorAll(`[data-aralik="${i}"], [data-sayi="${i}"]`)) if (el !== odak) el.value = oku(state) ?? 0;
  });
  kok.querySelector('[data-denge]').textContent = state.denge;
  kok.querySelector('[data-nufus]').textContent = state.nufus;
  const olay = kok.querySelector('[data-olay]');
  if (olay) olay.textContent = state.olay?.baslik || '—';
  const sakinKutusu = kok.querySelector('[data-sakinler]');
  if (!sakinKutusu.contains(odak)) { sakinKutusu.innerHTML = sakinlerHtml(); sakinBagla(); }
  kok.querySelectorAll('[data-arastirma]').forEach((c) => { c.checked = state.arastirma.acik.includes(c.dataset.arastirma); });
  kok.querySelectorAll('[data-yapi]').forEach((c) => { c.checked = state.yapilar.includes(c.dataset.yapi); });
}

function sakinBagla() {
  kok.querySelectorAll('.tp-sakin').forEach((satir) => {
    const uid = Number(satir.dataset.uid);
    const bul = (s) => s.sakinler.find((k) => k.uid === uid);
    satir.querySelector('[data-gorev]').addEventListener('change', (e) => testDegistir((s) => {
      const gorev = e.target.value || null;
      // Makinede tek operatör: eski operatör dinlenmeye geçer
      if (MAKINELER[gorev]) for (const k of s.sakinler) if (k.gorev === gorev && k.uid !== uid) k.gorev = 'bosta';
      bul(s).gorev = gorev;
    }));
    satir.querySelector('[data-yorgunluk]').addEventListener('change', (e) => testDegistir((s) => { bul(s).yorgunluk = Math.max(0, Number(e.target.value) || 0); }));
    satir.querySelector('[data-cikar]').addEventListener('click', () => testDegistir((s) => {
      s.sakinler = s.sakinler.filter((k) => k.uid !== uid);
      if (s.sefer?.uid === uid) s.sefer = null;
    }));
  });
}

function bagla() {
  const q = (sec) => kok.querySelector(sec);
  q('[data-kapat]').addEventListener('click', testPaneliToggle);
  SAYILAR.forEach(([, min, max, , yaz], i) => {
    kok.querySelectorAll(`[data-aralik="${i}"], [data-sayi="${i}"]`).forEach((el) => el.addEventListener('input', () => {
      const v = Math.max(min, Math.min(max, Math.round(Number(el.value) || 0)));
      testDegistir((s) => yaz(s, v));
    }));
  });
  q('[data-yorgun-sifir]').addEventListener('click', () => testDegistir((s) => s.sakinler.forEach((k) => { k.yorgunluk = 0; })));
  q('[data-yorgun-max]').addEventListener('click', () => testDegistir((s) => s.sakinler.forEach((k) => { k.yorgunluk = AYAR.yorgunlukAyrilmaEsigi ?? 5; })));
  const ziyaretci = () => ZIYARETCILER.find((z) => z.id === q('[data-ziyaretci]').value);
  q('[data-ziyaretci-getir]').addEventListener('click', () => testDegistir((s) => { s.ziyaretci = ziyaretci(); }));
  q('[data-ziyaretci-al]').addEventListener('click', () => {
    const z = ziyaretci();
    testDegistir((s) => {
      const gorev = z.calisir === false ? null : (MAKINELER[z.uzman] && !s.sakinler.some((k) => k.gorev === z.uzman) ? z.uzman : 'bosta');
      s.sakinler.push({ uid: Math.max(0, ...s.sakinler.map((k) => k.uid)) + 1, id: z.id, gorev, yorgunluk: 0 });
      s.kabulEdilen += z.kisi;
    });
  });
  const olay = () => [ILK_OLAY, ...OLAYLAR].find((o) => o.id === q('[data-olay]').value);
  q('[data-olay-bugun]').addEventListener('click', () => testDegistir((s) => { s.olay = olay(); }));
  q('[data-olay-yarin]').addEventListener('click', () => testDegistir((s) => { s.tahmin = olay() === ILK_OLAY ? null : olay(); s.hazirlik = false; }));
  q('[data-kart-goster]').addEventListener('click', () => {
    testDegistir((s) => { s.kart = KARTLAR.find((k) => k.id === q('[data-kart]').value); });
    yayinla('testKart');
  });
  kok.querySelectorAll('[data-arastirma]').forEach((c) => c.addEventListener('change', () => testDegistir((s) => {
    const id = c.dataset.arastirma;
    s.arastirma.acik = c.checked ? [...new Set([...s.arastirma.acik, id])] : s.arastirma.acik.filter((x) => x !== id);
    if (c.checked && s.arastirma.aktif === id) s.arastirma.aktif = null;
  })));
  kok.querySelectorAll('[data-yapi]').forEach((c) => c.addEventListener('change', () => testDegistir((s) => {
    const id = c.dataset.yapi;
    s.yapilar = c.checked ? [...new Set([...s.yapilar, id])] : s.yapilar.filter((x) => x !== id);
    if (c.checked && s.insaat?.id === id) s.insaat = null;
  })));
  q('[data-gunu-bitir]').addEventListener('click', () => yayinla('testGunuBitir'));
  q('[data-eylem-doldur]').addEventListener('click', () => testDegistir((s) => { s.eylem = AYAR.eylemHakki + (s.ekEylem || 0); }));
  q('[data-son-goster]').addEventListener('click', () => yayinla('testSon', { tip: q('[data-son]').value }));
  kok.querySelectorAll('[data-yeni]').forEach((b) => b.addEventListener('click', () => {
    yayinla('testYeniOyun', { prolog: b.dataset.yeni === 'prolog' });
    setTimeout(ciz, 150); // Prolog / Gün 1 alanları değişir
  }));
  q('[data-kayit-sil]').addEventListener('click', () => { kaydiSil(); q('[data-kayit-sil]').textContent = 'Kayıt silindi'; });
}

export function testPaneliToggle() {
  if (!kok) {
    kok = document.createElement('aside');
    kok.id = 'test-paneli';
    kok.hidden = true;
    // Panelde yazarken oyuncu yürümesin / kısayollar tetiklenmesin
    for (const olay of ['keydown', 'keyup']) kok.addEventListener(olay, (e) => { if (e.key !== 'F9') e.stopPropagation(); });
    document.getElementById('sahne').append(kok);
    abone(guncelle);
  }
  kok.hidden = !kok.hidden;
  if (!kok.hidden) ciz();
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'F9') { e.preventDefault(); testPaneliToggle(); }
});
