// Asset yükleme, içerik ölçümü ve ölçekleme.
// Yöntemler GameScene üzerinde çalışır; Phaser yaşam döngüsünü sahne yönetir.
import { ASSETLER } from '../../data/assets.js';
import { assetVar } from '../../assetListesi.js';
import { ANIMASYONLAR, animKareAnahtari, animKareDosyasi } from '../../data/animations.js';
import { CIZIM_OLCEGI, DOKU_PAYI } from './ayarlar.js';
import { YER_TUTUCULAR, EKSIK_ASSETLER, ICERIK_KUTULARI, KUCULTULEN } from './dokuOnbellegi.js';

function yuksekKaliteKucult(img, w, h) {
  let kaynak = img, sw = img.width, sh = img.height;
  const ciz = (cw, ch) => {
    const c = document.createElement('canvas');
    c.width = cw; c.height = ch;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(kaynak, 0, 0, cw, ch);
    return c;
  };
  while (sw / 2 >= w && sh / 2 >= h) {
    kaynak = ciz(Math.round(sw / 2), Math.round(sh / 2));
    sw = kaynak.width; sh = kaynak.height;
  }
  return ciz(w, h);
}

export const dokular = {
  // public/assets/ içinde bulunan görselleri yükler (liste: assetListesi.js); olmayanlar istenmez
  preload() {
    this.load.setPath('assets/');
    this.load.on('loaderror', (dosya) => EKSIK_ASSETLER.add(dosya.key));
    for (const [anahtar, a] of Object.entries(ASSETLER)) {
      if (!this.textures.exists(anahtar) && assetVar(a.dosya)) this.load.image(anahtar, a.dosya);
    }
    // Animasyonlar: önce sadece 1. kare denenir (eksik animasyon = tek hata satırı)
    for (const ad of Object.keys(ANIMASYONLAR)) {
      const k = animKareAnahtari(ad, 1);
      if (!this.textures.exists(k) && assetVar(animKareDosyasi(ad, 1))) this.load.image(k, animKareDosyasi(ad, 1));
    }
  },

  // Büyük görseli oyundaki boyutunun DOKU_PAYI katına yüksek kaliteyle küçültür
  // ve dokuyu bununla değiştirir. hedefYukseklik: görünen içeriğin oyundaki boyu.
  dokuKucult(anahtar, hedefYukseklik, tumGorsel = false) {
    if (KUCULTULEN.has(anahtar) || !this.textures.exists(anahtar) || YER_TUTUCULAR.has(anahtar)) return;
    KUCULTULEN.add(anahtar);
    const img = this.textures.get(anahtar).getSourceImage();
    const kutu = tumGorsel ? { ust: 0, alt: img.height, h: img.height } : this.icerikKutusu(anahtar);
    const oran = (hedefYukseklik * CIZIM_OLCEGI * DOKU_PAYI) / Math.max(1, kutu.alt - kutu.ust);
    if (oran >= 1) return; // zaten küçük
    const w = Math.max(1, Math.round(img.width * oran));
    const h = Math.max(1, Math.round(img.height * oran));
    const tuval = yuksekKaliteKucult(img, w, h);
    this.textures.remove(anahtar);
    this.textures.addCanvas(anahtar, tuval);
    ICERIK_KUTULARI.delete(anahtar); // yeni boyutta yeniden ölçülsün
  },

  // Animasyon karesini verilen oranla küçültür (tüm kareler aynı oranla)
  dokuKucultOran(anahtar, oran) {
    if (KUCULTULEN.has(anahtar) || !this.textures.exists(anahtar)) return;
    KUCULTULEN.add(anahtar);
    if (oran >= 1) return;
    const img = this.textures.get(anahtar).getSourceImage();
    const tuval = yuksekKaliteKucult(img, Math.max(1, Math.round(img.width * oran)), Math.max(1, Math.round(img.height * oran)));
    this.textures.remove(anahtar);
    this.textures.addCanvas(anahtar, tuval);
    ICERIK_KUTULARI.delete(anahtar);
  },

  // Yüklenen tüm assetleri küçült (oyun başında bir kez; restart'ta atlanır)
  assetleriKucult() {
    for (const [anahtar, a] of Object.entries(ASSETLER)) this.dokuKucult(anahtar, a.yukseklik, !!a.arka);
  },

  // public/assets/'ten gerçekten yüklenmiş bir görsel mi?
  // 'oda-x' sorgusu birleşik 'oda-x-tam' varsa da doğru sayılır (görselli oda)
  gercekAsset(anahtar) {
    if (anahtar.startsWith('oda-') && !anahtar.endsWith('-tam') && this.textures.exists(anahtar + '-tam') && !YER_TUTUCULAR.has(anahtar + '-tam')) return true;
    return this.textures.exists(anahtar) && !YER_TUTUCULAR.has(anahtar);
  },

  // Doku yoksa assets.js'teki yedek anahtarı kullan (ör. panel-su → panel)
  dokuAnahtari(anahtar) {
    return this.textures.exists(anahtar) ? anahtar : (ASSETLER[anahtar]?.yedek ?? anahtar);
  },

  // Sprite'ı oranını koruyarak assets.js'teki hedef yüksekliğe ölçekler
  // Görselin şeffaf olmayan kısmının üst ve alt satırı. Asset/karelerde üstte ya da
  // altta boşluk olsa da karakter aynı boyda görünsün diye ölçek buna göre yapılır.
  icerikKutusu(dokuAnahtari) {
    if (ICERIK_KUTULARI.has(dokuAnahtari)) return ICERIK_KUTULARI.get(dokuAnahtari);
    const img = this.textures.get(dokuAnahtari).getSourceImage();
    const w = img.width, h = img.height;
    let kutu = { ust: 0, alt: h, h };
    if (!YER_TUTUCULAR.has(dokuAnahtari) && w && h) {
      try {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, w, h).data;
        let ust = -1, alt = -1;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            if (d[(y * w + x) * 4 + 3] > 16) { if (ust < 0) ust = y; alt = y; break; }
          }
        }
        if (ust >= 0) kutu = { ust, alt: alt + 1, h };
      } catch { /* okunamazsa tüm kare kullanılır */ }
    }
    ICERIK_KUTULARI.set(dokuAnahtari, kutu);
    return kutu;
  },

  // Animasyonun tüm karelerinin ortak içerik kutusu (kareler arası titreme olmasın)
  animKutusu(ad) {
    const anahtar = 'anim-kutu:' + ad;
    if (ICERIK_KUTULARI.has(anahtar)) return ICERIK_KUTULARI.get(anahtar);
    const kutular = Array.from({ length: ANIMASYONLAR[ad].kare }, (_, i) => this.icerikKutusu(animKareAnahtari(ad, i + 1)));
    const kutu = { ust: Math.min(...kutular.map((k) => k.ust)), alt: Math.max(...kutular.map((k) => k.alt)), h: kutular[0].h };
    ICERIK_KUTULARI.set(anahtar, kutu);
    return kutu;
  },

  // Sprite'ı oranını koruyarak assets.js'teki hedef yüksekliğe ölçekler: görünen
  // içerik hedef yükseklikte olur, içeriğin alt kenarı sprite'ın y'sine (zemine) oturur
  olcekle(sprite, anahtar, kutu = null) {
    const a = ASSETLER[anahtar];
    if (!a || !sprite.frame?.height) return sprite;
    const k = kutu || this.icerikKutusu(sprite.texture.key);
    const ek = sprite.ekOlcek ?? 1; // perspektif: duvar dibindeki nesneler biraz küçük
    const o = (a.yukseklik * ek) / Math.max(1, k.alt - k.ust);
    sprite.setScale(o);
    sprite.setOrigin(sprite.originX, k.alt / k.h);
    sprite.temelOlcek = o;
    sprite.gorunurYukseklik = a.yukseklik * ek;
    return sprite;
  },

  // İpucu/işaret konumu için görünen yükseklik (şeffaf boşluk hariç)
  gorunurY(sprite) {
    return sprite.gorunurYukseklik ?? sprite.displayHeight;
  },
};
