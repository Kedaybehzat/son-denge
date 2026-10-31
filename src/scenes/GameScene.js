// =============================================================
//  OYUN SAHNESİ
//  Yandan görünüş: odalar yan yana, kamera karakteri takip eder.
//  Görseller: preload() public/assets/ içindeki dosyaları dener
//  (liste: src/data/assets.js). Bulunamayanlar için dokulariUret()
//  kodla çizilmiş yer tutucu üretir.
// =============================================================
import Phaser from 'phaser';
import { ODALAR, ODA_GENISLIK, TAVAN_Y, ZEMIN_Y, GORSEL_ZEMIN_ORANI, GORSEL_DUVAR_ORANI, ARKA_OLCEK } from '../data/rooms.js';
import { PANELLER } from '../data/panels.js';
import { ASSETLER } from '../data/assets.js';
import { assetVar } from '../assetListesi.js';
import { ANIMASYONLAR, animKareAnahtari, animKareDosyasi } from '../data/animations.js';
import { state, abone, gunuBitir, sifirla, ziyaretciKabul, ziyaretciReddet,
  KAYNAKLAR, MAKINELER, makineOperatoru, makineCalisiyorMu, sakinTanimi } from '../state.js';
import * as ui from '../ui/ui.js';

const HIZ = 240;
const ETKILESIM_MESAFE = 30; // oyuncu ile nesnenin KENARI arasındaki yatay mesafe (px)

// Kodla çizilen yer tutucu dokular (gerçek asset değil). Sahne yeniden
// başlasa da dokular kalıcı olduğu için modül düzeyinde tutulur.
const YER_TUTUCULAR = new Set();
const EKSIK_ASSETLER = new Set();
// Görsellerin şeffaf olmayan içerik kutusu (üst/alt satır), doku anahtarına göre önbellek
const ICERIK_KUTULARI = new Map();
const EKRAN_G = 960;   // oyun dünyası koordinatlarında ekran boyutu (değişmez)
const EKRAN_Y = 540;
// Çizim ölçeği: oyun 1920×1080 tuvale kamera zoom'uyla çizilir. Koordinatlar
// 960×540 kalır, görseller ve yazılar 2 kat net görünür (main.js de bunu kullanır).
export const CIZIM_OLCEGI = 2;
// Zoom'da ekrana sabit/paralaks katmanların kayması: (tuval - tuval/zoom) / 2
const SABIT_X = (EKRAN_G * CIZIM_OLCEGI - EKRAN_G) / 2;
const SABIT_Y = (EKRAN_Y * CIZIM_OLCEGI - EKRAN_Y) / 2;
// Yüklenen büyük görseller oyundaki boyutlarının bu katına yüksek kaliteyle küçültülür
// (WebGL'in 15-25 kat küçültmede yaptığı tırtıklanmayı önler)
const DOKU_PAYI = 1.5;
const KUCULTULEN = new Set();

// Görseli adım adım yarıya indirerek yüksek kaliteyle küçültür (canvas döndürür)
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

// Kirli eylemlerde dumanın hangi odadan çıkacağı (dekorCiz ile uyumlu)
// Eski (görselsiz) çizim koordinatları 640 px oda için yazıldı; oda genişliğine ölçeklenir
const OK = ODA_GENISLIK / 640;
const DUMAN_KONUMU = {
  enerji: { odaIndex: 1, x: 146 * OK, y: ZEMIN_Y - 100 },      // jeneratör bacası
  geriDonusum: { odaIndex: 4, x: 520 * OK, y: ZEMIN_Y - 70 },  // atık yakma noktası
};

// İki renk arasında geçiş: t=0 kötü renk, t=1 iyi renk
function renkGecis(kotu, iyi, t) {
  const C = Phaser.Display.Color;
  const c = C.Interpolate.ColorWithColor(C.ValueToColor(kotu), C.ValueToColor(iyi), 100, Math.round(t * 100));
  return C.GetColor(c.r, c.g, c.b);
}

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

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
  }

  create() {
    // Yazılar da çizim ölçeğinde render edilsin (zoom'da bulanık olmasın)
    const yaziUret = this.add.text.bind(this.add);
    this.add.text = (...a) => yaziUret(...a).setResolution(CIZIM_OLCEGI);
    this.dunyaG = ODALAR.length * ODA_GENISLIK;
    this.nesneler = [];
    this.lambalar = [];
    this.bitkiler = [];
    this.suTanklari = [];
    this.odaYerlesimi = {};   // oda tipi -> görselin dünya yerleşimi
    this.dumanNoktasi = {};   // panel -> görseldeki duman noktası
    this.copYigini = null;
    this.gecisVar = false;
    this.yurumeTozSayac = 0;
    this.kapiTakTakTimer = null;
    this.lambaTitremeTimer = null;

    this.dokulariUret();
    this.assetleriKucult();
    if (!this.assetRaporu) {
      this.assetRaporu = true;
      const yuklenen = Object.keys(ASSETLER).filter((k) => this.gercekAsset(k));
      console.info(`[asset] yüklenen: ${yuklenen.join(', ') || 'yok'} · yer tutucu: ${[...YER_TUTUCULAR].join(', ')}`);
    }
    this.disariCiz();
    this.evCiz();
    this.odaGecisleriCiz();
    this.oyuncuOlustur();
    this.animasyonlariYukle();

    this.cameras.main.setZoom(CIZIM_OLCEGI);
    this.cameras.main.setBounds(0, 0, this.dunyaG, EKRAN_Y);
    this.cameras.main.startFollow(this.oyuncu, true, 0.12, 0.12);

    // Atmosfer katmanı: denge düştükçe ekran kararır
    this.atmosfer = this.ekranaSabitle(this.add.rectangle(0, 0, EKRAN_G, EKRAN_Y, 0x2a1608, 0).setOrigin(0).setDepth(40), 0);

    // Dış dünyada süzülen toz/kül (denge düşükken açılır)
    this.disToz = this.add.particles(0, 0, 'toz', {
      x: { min: 0, max: this.dunyaG },
      y: { min: 10, max: 160 },
      speedY: { min: 10, max: 28 },
      speedX: { min: -10, max: 10 },
      scale: { start: 1.2, end: 0.4 },
      alpha: { start: 0.55, end: 0 },
      tint: [0x8a7a66, 0x6b5a48, 0x5a4a3a],
      lifespan: { min: 4500, max: 7000 },
      frequency: 220,
      quantity: 1,
      emitting: false,
    }).setDepth(-6);
    this.ekranaSabitle(this.disToz, 0.3);

    // Oyuncunun ayağının altında ara ara çıkan toz
    this.ayakTozu = this.add.particles(0, 0, 'toz', {
      speed: { min: 20, max: 55 },
      angle: { min: 200, max: 340 },
      scale: { start: 0.65, end: 0 },
      alpha: { start: 0.45, end: 0 },
      tint: [0x8a7764, 0x9c8974],
      lifespan: 450,
      emitting: false,
    }).setDepth(9);

    this.tuslar = this.input.keyboard.addKeys({
      sol: 'A', sag: 'D', solOk: 'LEFT', sagOk: 'RIGHT',
    });
    // E tuşu olay olarak dinlenir: düşük FPS'te kısa basışlar da kaçmaz
    this.etkilesimIstegi = false;
    this.input.keyboard.on('keydown-E', () => { this.etkilesimIstegi = true; });

    this.ipucu = this.add
      .text(0, 0, '', {
        fontFamily: 'system-ui, sans-serif', fontSize: '15px', color: '#ffffff',
        backgroundColor: '#1b2430cc', padding: { x: 8, y: 4 },
      })
      .setOrigin(0.5, 1).setDepth(50).setVisible(false);

    // Arayüzden gelen efekt olayları
    this.dinleyiciler = {
      eylem: (e) => this.efektEylem(e.detail),
      ziyaretci: (e) => this.efektZiyaretci(e.detail),
      gunBasligi: (e) => this.gunBasligiGoster(e.detail.gun, e.detail.olayAd, e.detail.onBitti),
    };
    window.addEventListener('oyun:eylemYapildi', this.dinleyiciler.eylem);
    window.addEventListener('oyun:ziyaretciKabul', this.dinleyiciler.ziyaretci);
    window.addEventListener('oyun:gunBasligi', this.dinleyiciler.gunBasligi);

    // Görseller denge değerine yumuşak geçişle tepki verir
    this.gorsel = { d: state.denge };
    this.gorselUygula();
    const iptal = abone((s) => this.gorselGuncelle(s));

    this.events.once('shutdown', () => {
      iptal();
      window.removeEventListener('oyun:eylemYapildi', this.dinleyiciler.eylem);
      window.removeEventListener('oyun:ziyaretciKabul', this.dinleyiciler.ziyaretci);
      window.removeEventListener('oyun:gunBasligi', this.dinleyiciler.gunBasligi);
      this.kapiTakTakDurdur();
      if (this.lambaTitremeTimer) this.lambaTitremeTimer.remove();
    });
  }

  // ---------------------------------------------------------------
  //  YER TUTUCU DOKULAR (çizimler gelince değiştirilecek)
  // ---------------------------------------------------------------
  dokulariUret() {
    // Her doku yalnızca yoksa üretilir: yüklenen asset'in yerine geçmez,
    // sahne yeniden başlayınca da tekrar üretilmez.
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Oyuncu (sağa bakıyor)
    g.fillStyle(0x3b4f63).fillRoundedRect(3, 20, 26, 40, 7);
    g.fillStyle(0x2a3a4a).fillRect(6, 52, 8, 10).fillRect(18, 52, 8, 10);
    g.fillStyle(0xf1c27d).fillCircle(16, 11, 11);
    g.fillStyle(0x4a3424).fillRect(5, 0, 22, 6);
    g.fillStyle(0x222222).fillRect(21, 9, 3, 4);
    g.fillStyle(0x9fd36b).fillRect(3, 30, 26, 4); // yeşil şerit: Yeşilvadi üniforması
    this.dokuUret(g, 'oyuncu', 32, 62);
    g.clear();

    // Kontrol paneli
    g.fillStyle(0x37424d).fillRoundedRect(0, 0, 70, 100, 6);
    g.fillStyle(0x0e2a1f).fillRect(8, 10, 54, 36);
    g.fillStyle(0x52e3a4).fillRect(12, 16, 30, 4).fillRect(12, 24, 40, 4).fillRect(12, 32, 22, 4);
    g.fillStyle(0xe85d4a).fillCircle(18, 62, 5);
    g.fillStyle(0xf2c14e).fillCircle(35, 62, 5);
    g.fillStyle(0x6bd36b).fillCircle(52, 62, 5);
    g.fillStyle(0x27313a).fillRect(10, 76, 50, 16);
    this.dokuUret(g, 'panel', 70, 100);
    g.clear();

    // Radyo + masa
    g.fillStyle(0x7a5233).fillRect(0, 34, 80, 8).fillRect(6, 42, 6, 38).fillRect(68, 42, 6, 38);
    g.fillStyle(0xa8483a).fillRoundedRect(16, 6, 48, 28, 5);
    g.fillStyle(0xe8d9b5).fillCircle(30, 20, 8);
    g.fillStyle(0x333333).fillRect(44, 14, 14, 3).fillRect(44, 20, 14, 3);
    g.lineStyle(2, 0x333333).lineBetween(56, 6, 64, 0);
    this.dokuUret(g, 'radyo', 80, 80);
    g.clear();

    // Görev ve araştırma panosu (ayaklı mantar pano)
    g.fillStyle(0x5a3d26).fillRect(8, 70, 6, 40).fillRect(76, 70, 6, 40);
    g.fillStyle(0x6b4a2f).fillRoundedRect(0, 0, 90, 74, 5);
    g.fillStyle(0xc9a26b).fillRect(6, 6, 78, 62);
    g.fillStyle(0xf3efe6).fillRect(12, 12, 26, 20).fillRect(46, 10, 30, 16).fillRect(14, 40, 22, 22);
    g.fillStyle(0x9fe3c8).fillRect(46, 32, 30, 28);
    g.fillStyle(0xe85d4a).fillCircle(25, 13, 3).fillCircle(61, 11, 3).fillCircle(25, 41, 3);
    g.fillStyle(0x2f6b55).fillRect(50, 38, 22, 3).fillRect(50, 45, 16, 3).fillRect(50, 52, 20, 3);
    this.dokuUret(g, 'pano', 90, 110);
    g.clear();

    // Yatak
    g.fillStyle(0x6b4a2f).fillRect(0, 20, 8, 40).fillRect(0, 40, 140, 10);
    g.fillStyle(0x6b4a2f).fillRect(132, 30, 8, 30);
    g.fillStyle(0x7fa7c9).fillRect(8, 28, 124, 14);
    g.fillStyle(0xf3efe6).fillRoundedRect(10, 20, 34, 12, 4);
    this.dokuUret(g, 'yatak', 140, 60);
    g.clear();

    // Kapı
    g.fillStyle(0x5a3d26).fillRect(0, 0, 60, 120);
    g.fillStyle(0x7a5536).fillRect(6, 6, 48, 110);
    g.fillStyle(0xd9b44a).fillCircle(46, 64, 4);
    this.dokuUret(g, 'kapi', 60, 120);
    g.clear();

    // Bitki
    g.fillStyle(0x8a5a3a).fillRect(8, 40, 24, 16);
    g.fillStyle(0xffffff).fillRect(19, 14, 3, 28);
    g.fillEllipse(12, 22, 16, 9).fillEllipse(29, 18, 16, 9).fillEllipse(14, 10, 14, 8).fillEllipse(26, 6, 12, 8);
    this.dokuUret(g, 'bitki', 40, 56);
    g.destroy();

    // Sığınak sakinleri (farklı kıyafet renkleri)
    const g2 = this.make.graphics({ x: 0, y: 0, add: false });
    [0x8a5a44, 0x4f6d8a, 0x7a7a3a, 0x6b4f7a].forEach((renk, i) => {
      g2.clear();
      g2.fillStyle(renk).fillRoundedRect(3, 18, 22, 36, 6);
      g2.fillStyle(0x3a3a3a).fillRect(5, 48, 7, 8).fillRect(16, 48, 7, 8);
      g2.fillStyle([0xf1c27d, 0xc68642, 0xe0ac69, 0x8d5524][i]).fillCircle(14, 10, 10);
      g2.fillStyle([0x2b2b2b, 0x6b4a2a, 0xd9c27a, 0x1a1a1a][i]).fillRect(4, 0, 20, 5);
      this.dokuUret(g2, 'sakin' + i, 28, 56);
    });
    g2.destroy();

    // Çöp yığını: üst üste torbalar, hurda parçaları, kutu (atığa göre büyür)
    if (!this.textures.exists('cop-yigini')) {
      const gc = this.make.graphics({ x: 0, y: 0, add: false });
      gc.fillStyle(0x3b3127).fillEllipse(80, 70, 156, 26);
      [[38, 52, 46, 34, 0x4f5a3c], [78, 44, 56, 46, 0x5b4a39], [118, 54, 44, 32, 0x3f4a52], [62, 30, 40, 30, 0x6b5a44], [100, 28, 38, 28, 0x56603f]]
        .forEach(([x, y, w, h, c]) => {
          gc.fillStyle(c).fillEllipse(x, y, w, h);
          gc.lineStyle(2, 0x1d1712, 0.8).strokeEllipse(x, y, w, h);
          gc.fillStyle(0xffffff, 0.12).fillEllipse(x - w * 0.15, y - h * 0.2, w * 0.35, h * 0.25);
        });
      gc.fillStyle(0x8a7350).fillRect(18, 40, 22, 18).lineStyle(2, 0x1d1712, 0.8).strokeRect(18, 40, 22, 18); // karton
      gc.fillStyle(0x9aa3a8).fillRect(122, 20, 6, 26).fillRect(108, 34, 26, 5);  // metal çubuklar
      gc.fillStyle(0xb7c2b0).fillCircle(56, 58, 5).fillCircle(132, 62, 4);      // teneke
      this.dokuUret(gc, 'cop-yigini', 160, 80);
      gc.destroy();
    }

    if (this.textures.exists('isik')) return; // efekt dokuları zaten var (restart)

    // Lamba ışığı: yumuşak radyal parıltı
    const tuval = this.textures.createCanvas('isik', 256, 256);
    const ctx = tuval.getContext();
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255,242,179,1)');
    grad.addColorStop(0.4, 'rgba(255,242,179,0.35)');
    grad.addColorStop(1, 'rgba(255,242,179,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    tuval.refresh();

    // Duman parçacığı (kirli eylem bacası)
    const tuvDuman = this.textures.createCanvas('duman', 48, 48);
    const ctxDuman = tuvDuman.getContext();
    const gradDuman = ctxDuman.createRadialGradient(24, 24, 0, 24, 24, 24);
    gradDuman.addColorStop(0, 'rgba(220,210,200,0.95)');
    gradDuman.addColorStop(0.55, 'rgba(140,130,120,0.55)');
    gradDuman.addColorStop(1, 'rgba(80,70,65,0)');
    ctxDuman.fillStyle = gradDuman;
    ctxDuman.fillRect(0, 0, 48, 48);
    tuvDuman.refresh();

    // Toz parçacığı (ayak altı + dış kül)
    const tuvToz = this.textures.createCanvas('toz', 10, 10);
    const ctxToz = tuvToz.getContext();
    const gradToz = ctxToz.createRadialGradient(5, 5, 0, 5, 5, 5);
    gradToz.addColorStop(0, 'rgba(255,255,255,1)');
    gradToz.addColorStop(1, 'rgba(255,255,255,0)');
    ctxToz.fillStyle = gradToz;
    ctxToz.fillRect(0, 0, 10, 10);
    tuvToz.refresh();
  }

  // ---------------------------------------------------------------
  //  DIŞ DÜNYA: gökyüzü, güneş ve parallax şehir silueti
  // ---------------------------------------------------------------
  // Ekrana sabit (f=0) ya da paralaks (0<f<1) katmanı ayarlar. Kamera zoom'u
  // ekran merkezinden yaptığı için katman (1-f) oranında kaydırılır; böylece
  // 960×540 koordinatlarıyla yazılmış katmanlar zoom öncesiyle aynı yerde görünür.
  ekranaSabitle(nesne, f) {
    nesne.setScrollFactor(f);
    nesne.x += SABIT_X * (1 - f);
    nesne.y += SABIT_Y * (1 - f);
    return nesne;
  }

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
  }

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
  }

  // Yüklenen tüm assetleri küçült (oyun başında bir kez; restart'ta atlanır)
  assetleriKucult() {
    for (const [anahtar, a] of Object.entries(ASSETLER)) this.dokuKucult(anahtar, a.yukseklik, !!a.arka);
  }

  // Yer tutucu dokuyu sadece o anahtarda doku yoksa üretir
  dokuUret(g, anahtar, w, h) {
    if (this.textures.exists(anahtar)) return;
    g.generateTexture(anahtar, w, h);
    YER_TUTUCULAR.add(anahtar);
  }

  // public/assets/'ten gerçekten yüklenmiş bir görsel mi?
  gercekAsset(anahtar) {
    return this.textures.exists(anahtar) && !YER_TUTUCULAR.has(anahtar);
  }

  // Doku yoksa assets.js'teki yedek anahtarı kullan (ör. panel-su → panel)
  dokuAnahtari(anahtar) {
    return this.textures.exists(anahtar) ? anahtar : (ASSETLER[anahtar]?.yedek ?? anahtar);
  }

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
  }

  // Animasyonun tüm karelerinin ortak içerik kutusu (kareler arası titreme olmasın)
  animKutusu(ad) {
    const anahtar = 'anim-kutu:' + ad;
    if (ICERIK_KUTULARI.has(anahtar)) return ICERIK_KUTULARI.get(anahtar);
    const kutular = Array.from({ length: ANIMASYONLAR[ad].kare }, (_, i) => this.icerikKutusu(animKareAnahtari(ad, i + 1)));
    const kutu = { ust: Math.min(...kutular.map((k) => k.ust)), alt: Math.max(...kutular.map((k) => k.alt)), h: kutular[0].h };
    ICERIK_KUTULARI.set(anahtar, kutu);
    return kutu;
  }

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
  }

  // İpucu/işaret konumu için görünen yükseklik (şeffaf boşluk hariç)
  gorunurY(sprite) {
    return sprite.gorunurYukseklik ?? sprite.displayHeight;
  }

  // Oda görselini yerleştirir (oran korunur, yürüme çizgisi zeminin ortasına
  // denk gelir, taşan yanlar kırpılır). Görsel yoksa null döner.
  odaGorseliYerlestir(oda, i) {
    const anahtar = 'oda-' + oda.tip;
    if (!this.gercekAsset(anahtar)) return null;
    const x0 = i * ODA_GENISLIK;
    const kaynak = this.textures.get(anahtar).getSourceImage();
    const oran = kaynak.width / kaynak.height;
    let H = (ZEMIN_Y - TAVAN_Y) / GORSEL_ZEMIN_ORANI;
    let W = H * oran;
    if (W < ODA_GENISLIK) { W = ODA_GENISLIK; H = W / oran; }
    const ust = ZEMIN_Y - GORSEL_ZEMIN_ORANI * H;
    const sol = x0 - (W - ODA_GENISLIK) / 2;
    const img = this.add.image(sol, ust, anahtar).setOrigin(0).setDisplaySize(W, H).setDepth(0.5);
    const olcek = W / kaynak.width;
    img.setCrop((x0 - sol) / olcek, 0, ODA_GENISLIK / olcek, kaynak.height);
    const yer = { sol, ust, W, H, alt: ust + H };
    // Görsel üzerindeki oran koordinatını dünyaya çevirir
    yer.nokta = (fx, fy) => ({ x: sol + fx * W, y: ust + fy * H });
    this.odaYerlesimi[oda.tip] = yer;
    if (oda.gorsel?.duman) {
      const panel = oda.nesneler.find((n) => n.tip === 'panel')?.panel;
      if (panel) this.dumanNoktasi[panel] = yer.nokta(...oda.gorsel.duman);
    }
    return yer;
  }

  // Oda sınırlarına taşıyıcı kolon + yumuşak gölge: görseller arası sert geçişi örter
  odaGecisleriCiz() {
    const yerler = Object.values(this.odaYerlesimi);
    if (!yerler.length) return;
    const ust = TAVAN_Y - 4;
    const alt = Math.max(...yerler.map((y) => y.alt));
    const g = this.add.graphics().setDepth(0.8);
    for (let i = 0; i <= ODALAR.length; i++) {
      const x = i * ODA_GENISLIK;
      // iki yana kararan gölge şeritleri
      for (let k = 0; k < 8; k++) {
        const a = 0.22 * (1 - k / 8);
        g.fillStyle(0x0d0905, a).fillRect(x + 9 + k * 4, ust, 4, alt - ust);
        g.fillStyle(0x0d0905, a).fillRect(x - 13 - k * 4, ust, 4, alt - ust);
      }
      // kolon: koyu ahşap/metal, ışık ve gölge kenarı, perçinler
      g.fillStyle(0x3a2d22, 1).fillRect(x - 9, ust, 18, alt - ust);
      g.fillStyle(0x5a4632, 1).fillRect(x - 9, ust, 4, alt - ust);
      g.fillStyle(0x221a13, 1).fillRect(x + 5, ust, 4, alt - ust);
      for (let y = ust + 24; y < alt - 10; y += 56) g.fillStyle(0x8a7350, 1).fillCircle(x, y, 2);
    }
  }

  // ---------------------------------------------------------------
  //  ANİMASYONLAR (src/data/animations.js)
  // ---------------------------------------------------------------
  // 1. karesi gelen animasyonların kalan karelerini yükler, tamamı olanları kurar
  animasyonlariYukle() {
    let bekleyen = false;
    for (const [ad, a] of Object.entries(ANIMASYONLAR)) {
      if (this.anims.exists(ad) || !this.textures.exists(animKareAnahtari(ad, 1))) continue;
      for (let n = 2; n <= a.kare; n++) {
        const k = animKareAnahtari(ad, n);
        if (!this.textures.exists(k) && assetVar(animKareDosyasi(ad, n))) { this.load.image(k, animKareDosyasi(ad, n)); bekleyen = true; }
      }
    }
    const kur = () => {
      const kurulan = [];
      const eksik = [];
      for (const [ad, a] of Object.entries(ANIMASYONLAR)) {
        if (this.anims.exists(ad)) { kurulan.push(ad); continue; }
        const kareler = Array.from({ length: a.kare }, (_, i) => animKareAnahtari(ad, i + 1));
        const var_ = kareler.filter((k) => this.textures.exists(k)).length;
        if (var_ === a.kare) {
          // Kareler ortak kutuya göre küçültülür (karelerin oranı korunur)
          const kutu = this.animKutusu(ad);
          ICERIK_KUTULARI.delete('anim-kutu:' + ad);
          for (const k of kareler) this.dokuKucultOran(k, (ASSETLER[a.sahip].yukseklik * CIZIM_OLCEGI * DOKU_PAYI) / Math.max(1, kutu.alt - kutu.ust));
          this.anims.create({ key: ad, frames: kareler.map((key) => ({ key })), frameRate: a.fps, repeat: a.dongu ? -1 : 0 });
          kurulan.push(ad);
        } else if (var_ > 0) {
          eksik.push(`${ad} (${var_}/${a.kare})`);
        }
      }
      if (!this.animRaporu) {
        this.animRaporu = true;
        console.info(`[anim] kurulan: ${kurulan.join(', ') || 'yok'}${eksik.length ? ` · eksik kareli: ${eksik.join(', ')}` : ''}`);
      }
      if (this.sys.isActive()) this.makineAnimGuncelle();
    };
    if (bekleyen) { this.load.once('complete', kur); this.load.start(); } else kur();
  }

  // Animasyon varsa oynatır (zaten oynuyorsa dokunmaz), yoksa false döner
  animOynat(sprite, ad) {
    if (!this.anims.exists(ad)) return false;
    if (sprite.anims.isPlaying && sprite.anims.currentAnim?.key === ad) return true;
    sprite.play(ad);
    this.olcekle(sprite, ANIMASYONLAR[ad].sahip, this.animKutusu(ad));
    return true;
  }

  // Animasyonu durdurup sabit görsele döner
  animDurdur(sprite, statik, sahip = statik) {
    if (sprite.anims?.isPlaying) sprite.stop();
    if (sprite.texture.key !== statik) {
      sprite.setTexture(statik);
      this.olcekle(sprite, sahip);
    }
  }

  // Operatörü olan makinenin paneli "çalışıyor" animasyonu oynatır, boş olan durur
  // Odaya özel panelde kendi animasyonu (panel-<oda>-calis), genel panelde panel-calis.
  // Genel animasyon odaya özel panelin yerine geçmez (tasarımı kaybolmasın).
  // Ayrıca panelin üstünde durum ışığı: çalışıyorsa yanıp sönen yeşil, boşsa kırmızı.
  makineAnimGuncelle() {
    for (const n of this.nesneler || []) {
      if (n.def.tip !== 'panel' || !MAKINELER[n.def.panel]) continue;
      const calisiyor = makineCalisiyorMu(n.def.panel);
      const ozelAnim = n.statik === 'panel' ? 'panel-calis' : n.statik.replace('panel-geriDonusum', 'panel-geri') + '-calis';
      if (!(calisiyor && this.animOynat(n.sprite, ozelAnim))) this.animDurdur(n.sprite, n.statik, n.statik);
      if (!n.isik) {
        n.isik = this.add.circle(n.sprite.x, n.sprite.y - this.gorunurY(n.sprite) - 7, 4, 0x52e3a4).setDepth(4);
        n.isikTween = this.tweens.add({ targets: n.isik, alpha: 0.35, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
      n.isik.setFillStyle(calisiyor ? 0x52e3a4 : 0xe85d4a);
      if (calisiyor) n.isikTween.resume(); else { n.isikTween.pause(); n.isik.setAlpha(1); }
    }
  }

  disariCiz() {
    this.gokyuzu = this.ekranaSabitle(this.add.rectangle(0, 0, EKRAN_G, EKRAN_Y, 0x8fd3ff).setOrigin(0).setDepth(-10), 0);
    this.gunes = this.ekranaSabitle(this.add.circle(780, 90, 34, 0xfff3b0).setDepth(-9), 0.05);

    // Uzak şehir (yavaş kayar) ve yakın binalar (biraz daha hızlı)
    this.uzakSehir = this.ekranaSabitle(this.add.graphics().setDepth(-8), 0.2);
    this.yakinSehir = this.ekranaSabitle(this.add.graphics().setDepth(-7), 0.45);
    this.sehirSekilleri = { uzak: [], yakin: [] };
    const uret = (liste, genislik, minH, maxH) => {
      let x = -50;
      while (x < genislik) {
        const w = Phaser.Math.Between(40, 100);
        const h = Phaser.Math.Between(minH, maxH);
        liste.push({ x, w, h });
        x += w + Phaser.Math.Between(4, 24);
      }
    };
    uret(this.sehirSekilleri.uzak, this.dunyaG * 0.2 + EKRAN_G, 300, 420);
    uret(this.sehirSekilleri.yakin, this.dunyaG * 0.45 + EKRAN_G, 260, 380);

    // Manzara görseli varsa kodla çizilen şehrin yerine geçer (yatayda tekrar eder)
    this.manzara = null;
    if (this.gercekAsset('manzara-iyi')) {
      const genislik = this.dunyaG * 0.2 + EKRAN_G;
      const katman = (anahtar, derinlik) => {
        const k = this.ekranaSabitle(this.add.tileSprite(0, 0, genislik, ZEMIN_Y, anahtar).setOrigin(0).setDepth(derinlik), 0.2);
        const o = ZEMIN_Y / this.textures.get(anahtar).getSourceImage().height;
        k.setTileScale(o, o);
        return k;
      };
      this.manzara = {
        iyi: katman('manzara-iyi', -8),
        kotu: this.gercekAsset('manzara-kotu') ? katman('manzara-kotu', -7.5) : null,
      };
      this.uzakSehir.setVisible(false);
      this.yakinSehir.setVisible(false);
    }
  }

  sehirBoya(uzakRenk, yakinRenk) {
    for (const [g, liste, renk] of [
      [this.uzakSehir, this.sehirSekilleri.uzak, uzakRenk],
      [this.yakinSehir, this.sehirSekilleri.yakin, yakinRenk],
    ]) {
      g.clear().fillStyle(renk);
      for (const b of liste) g.fillRect(b.x, ZEMIN_Y - b.h, b.w, b.h);
    }
  }

  // ---------------------------------------------------------------
  //  EV: duvarlar (pencere boşluklu), tavan, zemin, ara duvarlar
  // ---------------------------------------------------------------
  evCiz() {
    const g = this.add.graphics().setDepth(0);
    const ust = TAVAN_Y;
    const alt = ZEMIN_Y;

    ODALAR.forEach((oda, i) => {
      const x0 = i * ODA_GENISLIK;
      const pw = oda.pencereGenis ? 260 : 150;
      const px = x0 + oda.pencereX - pw / 2;
      const py = ust + 40;
      const ph = 110;

      // Duvar = pencere etrafındaki 4 parça (pencereden dışarısı görünür)
      g.fillStyle(oda.duvar);
      g.fillRect(x0, ust, ODA_GENISLIK, py - ust);
      g.fillRect(x0, py + ph, ODA_GENISLIK, alt - (py + ph));
      g.fillRect(x0, py, px - x0, ph);
      g.fillRect(px + pw, py, x0 + ODA_GENISLIK - (px + pw), ph);

      // Pencere çerçevesi
      g.lineStyle(6, 0x5b4a3a).strokeRect(px, py, pw, ph);
      g.lineStyle(3, 0x5b4a3a).lineBetween(px + pw / 2, py, px + pw / 2, py + ph);

      // Süpürgelik
      g.fillStyle(0x000000, 0.12).fillRect(x0, alt - 16, ODA_GENISLIK, 16);

      // Oda arka planı görseli varsa kodla çizilen duvarın üstüne biner
      const yer = this.odaGorseliYerlestir(oda, i);

      // Oda adı
      // Oda görseli varsa üstünde okunsun diye açık renk + koyu kontur
      const odaGorselli = this.gercekAsset('oda-' + oda.tip);
      this.add.text(x0 + 26, ust + 12, oda.ad.toUpperCase(), {
        fontFamily: 'system-ui, sans-serif', fontSize: '13px', fontStyle: 'bold',
        color: odaGorselli ? '#f3ead2' : '#3a3328',
        ...(odaGorselli ? { stroke: '#1d1712', strokeThickness: 3 } : {}),
      }).setAlpha(odaGorselli ? 0.9 : 0.55).setDepth(1);

      // Tavan lambası (enerjiye göre parlar)
      const lx = x0 + ODA_GENISLIK / 2 + (oda.pencereX > ODA_GENISLIK / 2 ? -150 : 150);
      g.fillStyle(0x444444).fillRect(lx - 1, ust, 2, 22).fillRect(lx - 14, ust + 22, 28, 8);
      const isik = this.add.image(lx, ust + 60, 'isik').setScale(1.6, 1.3).setDepth(1).setBlendMode(Phaser.BlendModes.ADD);
      this.lambalar.push(isik);

      this.dekorCiz(oda.tip, x0);

      // Etkileşimli nesneler
      for (const n of oda.nesneler) {
        const anahtar = n.tip === 'panel' ? this.dokuAnahtari('panel-' + n.panel) : n.tip;
        // Oda görseli varken: konum görsele göre, duvara yaslananlar duvar dibine ve biraz küçük
        const ad = n.tip === 'panel' ? n.panel : n.tip;
        const oranX = yer ? oda.gorsel?.nesneOran?.[ad] : null;
        const nx = oranX != null ? yer.sol + oranX * yer.W - x0 : n.x;
        const ny = yer && n.arka ? yer.ust + GORSEL_DUVAR_ORANI * yer.H + 4 : alt;
        const s = this.add.sprite(x0 + nx, ny, anahtar).setOrigin(0.5, 1).setDepth(3);
        if (yer && n.arka) s.ekOlcek = ARKA_OLCEK;
        this.olcekle(s, anahtar);
        // Görselde zaten çizili nesne: sprite görünmez, etkileşim ve ipucu kalır
        if (yer && oda.gorsel?.gorseldeVar?.includes(n.tip)) s.setAlpha(0);
        this.nesneler.push({ sprite: s, def: n, statik: anahtar });
      }
    });

    // Ara duvarlar (alt kısmı geçit)
    for (let i = 1; i < ODALAR.length; i++) {
      const x = i * ODA_GENISLIK;
      g.fillStyle(0x6e5a46).fillRect(x - 9, ust, 18, alt - ust - 130);
      g.fillStyle(0x5b4a3a).fillRect(x - 12, alt - 136, 24, 8);
    }

    // Dış duvarlar, tavan, çatı ve zemin
    g.fillStyle(0x6e5a46).fillRect(0, ust, 14, alt - ust).fillRect(this.dunyaG - 14, ust, 14, alt - ust);
    g.fillStyle(0x5b4a3a).fillRect(-20, ust - 18, this.dunyaG + 40, 18);
    g.fillStyle(0x3f4a3a).fillRect(-20, ust - 30, this.dunyaG + 40, 12);
    // Çatı: cati.png varsa yatayda döşenir (alt kenarı tavan kirişine oturur);
    // yoksa kodla çizilen eğik, ayaklı güneş panelleri
    if (this.gercekAsset('cati')) {
      const h = ASSETLER.cati.yukseklik;
      const kaynak = this.textures.get('cati').getSourceImage();
      this.add.tileSprite(-20, ust - h, this.dunyaG + 40, h, 'cati').setOrigin(0).setDepth(0.6)
        .setTileScale(h / kaynak.height, h / kaynak.height);
    } else {
      for (let x = 60; x < this.dunyaG; x += 180) {
        const taban = ust - 30;
        g.fillStyle(0x3a3a36).fillRect(x + 18, taban - 14, 4, 14).fillRect(x + 88, taban - 22, 4, 22); // ayaklar
        g.fillStyle(0x23314f).fillPoints([{ x, y: taban - 12 }, { x: x + 110, y: taban - 28 }, { x: x + 110, y: taban - 20 }, { x, y: taban - 4 }], true);
        g.lineStyle(2, 0x5b6470, 1).strokePoints([{ x, y: taban - 12 }, { x: x + 110, y: taban - 28 }, { x: x + 110, y: taban - 20 }, { x, y: taban - 4 }], true);
        g.lineStyle(1, 0x7fa6d8, 0.5).lineBetween(x + 37, taban - 17, x + 37, taban - 9).lineBetween(x + 73, taban - 23, x + 73, taban - 15);
      }
    }
    g.fillStyle(0x4b3b2c).fillRect(-20, alt, this.dunyaG + 40, 14);
    g.fillStyle(0x3a2e24).fillRect(-20, alt + 14, this.dunyaG + 40, EKRAN_Y - alt);
  }

  // Odaya göre dekor. Bazıları kaynaklara göre değişir (su tankı, çöp yığını, bitkiler).
  // Oda görseli (oda-<tip>.png) varsa sadece süs amaçlı çizimler atlanır (görselde
  // zaten var, çift görünmesin); işlevi olanlar (su tankı, bitki, çöp, jeneratör) kalır.
  dekorCiz(tip, x0) {
    const g = this.add.graphics().setDepth(2);
    const alt = ZEMIN_Y;
    const gorselli = this.gercekAsset('oda-' + tip);
    if (tip === 'yasam') {
      if (gorselli) return;
      g.fillStyle(0x8c6b4a).fillRect(x0 + 340 * OK, alt - 70, 70, 70); // dolap
      g.fillStyle(0x6e5236).fillRect(x0 + 344 * OK, alt - 40, 62, 3);
    } else if (tip === 'enerji') {
      for (let i = 0; i < (gorselli ? 0 : 3); i++) {
        const bx = x0 + (400 + i * 50) * OK;
        g.fillStyle(0x2e3a44).fillRoundedRect(bx, alt - 90, 38, 90, 4);
        g.fillStyle(0x52e3a4).fillRect(bx + 8, alt - 80, 22, 6);
      }
      if (!gorselli) { // jeneratör (görselde zaten var; duman yine bu noktadan çıkar)
        g.fillStyle(0x6b6b6b).fillRoundedRect(x0 + 60 * OK, alt - 70, 110, 70, 6);
        g.fillStyle(0x3d3d3d).fillRect(x0 + 140 * OK, alt - 100, 12, 32);
      }
    } else if (tip === 'su' && gorselli && this.odaYerlesimi.su && ODALAR.find((o) => o.tip === 'su').gorsel?.suGostergeleri) {
      // Görseldeki tankların gösterge camlarında su seviyesi
      for (const [x1, y1, x2, y2] of ODALAR.find((o) => o.tip === 'su').gorsel.suGostergeleri) {
        const a = this.odaYerlesimi.su.nokta(x1, y1);
        const b = this.odaYerlesimi.su.nokta(x2, y2);
        g.fillStyle(0x10202a, 0.55).fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
        const su = this.add.rectangle((a.x + b.x) / 2, b.y, b.x - a.x - 2, b.y - a.y - 2, 0x5ec8f0, 0.9).setOrigin(0.5, 1).setDepth(2);
        this.suTanklari.push(su);
      }
    } else if (tip === 'su') {
      for (let i = 0; i < 2; i++) {
        const tx = x0 + (470 + i * 90) * OK;
        if (gorselli) {
          // Görsele uyumlu: koyu metal çerçeve, yarı saydam cam, perçin şeridi
          g.fillStyle(0x2f3a40, 0.92).fillRoundedRect(tx - 34, alt - 150, 68, 150, 10);
          g.fillStyle(0x9fc6d6, 0.18).fillRoundedRect(tx - 28, alt - 144, 56, 138, 6);
          g.lineStyle(2, 0x7c6a4f, 1).strokeRoundedRect(tx - 34, alt - 150, 68, 150, 10);
          g.fillStyle(0x7c6a4f, 1).fillRect(tx - 34, alt - 112, 68, 4).fillRect(tx - 34, alt - 52, 68, 4);
        } else {
          g.fillStyle(0xdfe7ec).fillRoundedRect(tx - 34, alt - 150, 68, 150, 12);
        }
        const su = this.add.rectangle(tx, alt - 6, 56, 138, 0x4aa3df, gorselli ? 0.75 : 1).setOrigin(0.5, 1).setDepth(2);
        this.suTanklari.push(su);
      }
      if (!gorselli) g.lineStyle(6, 0x8a9aa6).lineBetween(x0 + 60 * OK, alt - 120, x0 + 430 * OK, alt - 120);
    } else if (tip === 'sera') {
      if (!gorselli) g.fillStyle(0x7a5a3a).fillRect(x0 + 40 * OK, alt - 30, 440, 30); // saksı sırası
      for (let i = 0; i < 7; i++) {
        const yerS = this.odaYerlesimi.sera;
        const bo = ODALAR.find((o) => o.tip === 'sera').gorsel?.bitkiOran;
        const bx = gorselli && yerS && bo ? yerS.sol + yerS.W * (bo[0] + i * bo[1]) : x0 + (75 + i * 62) * OK;
        const b = this.olcekle(this.add.image(bx, gorselli ? alt : alt - 28, 'bitki').setOrigin(0.5, 1).setDepth(2), 'bitki');
        this.bitkiler.push(b);
      }
    } else if (tip === 'geri') {
      const renkler = [0x3b82c4, 0xe0b23a, 0x4caf50, 0x9a9a9a];
      if (!gorselli) renkler.forEach((r, i) => {
        g.fillStyle(r).fillRoundedRect(x0 + (420 + i * 52) * OK, alt - 70, 44, 70, 5);
        g.fillStyle(0x000000, 0.2).fillRect(x0 + (420 + i * 52) * OK, alt - 70, 44, 8);
      });
      const yerG = this.odaYerlesimi.geri;
      const co = ODALAR.find((o) => o.tip === 'geri').gorsel?.copOran;
      const cx = gorselli && yerG && co ? yerG.sol + yerG.W * co : x0 + 120 * OK;
      this.copYigini = this.olcekle(this.add.image(cx, alt + 4, 'cop-yigini').setOrigin(0.5, 1).setDepth(2), 'cop-yigini');
    }
  }

  oyuncuOlustur() {
    this.oyuncu = this.olcekle(this.add.sprite(220, ZEMIN_Y, 'oyuncu').setOrigin(0.5, 1).setDepth(10), 'oyuncu');
    this.oyuncuMesgulBitis = 0; // 'oyuncu-calis' bir kez oynarken bekle/yürü araya girmesin
    this.yurume = 0;

    // Kapıda biri varken kapının üstünde zıplayan işaret
    const kapi = this.nesneler.find((n) => n.def.tip === 'kapi');
    this.kapiIsaret = this.add
      .text(kapi.sprite.x, kapi.sprite.y - this.gorunurY(kapi.sprite) - 30, '!', {
        fontFamily: 'system-ui, sans-serif', fontSize: '34px', fontStyle: 'bold', color: '#ffd23f',
        stroke: '#3a2a10', strokeThickness: 6,
      })
      .setOrigin(0.5, 1).setDepth(20).setVisible(false);
    this.tweens.add({ targets: this.kapiIsaret, y: '-=10', duration: 450, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.sakinler = [];
  }

  // Sakin sprite'ı, görevine göre makinesinin / panonun yanında durur.
  // Oyuncu nüfusa sayılmaz; state.sakinler kaynak dizidir (uid ile eşlenir).
  panoSpritesi() {
    return this.nesneler.find((n) => n.def.tip === 'pano')?.sprite;
  }

  sakinKonumu(gorev, sira) {
    // Makine görevi: panelin iki yanına dizilir
    if (gorev && MAKINELER[gorev]) {
      const sprite = this.panelSpritesi(gorev);
      if (sprite) return sprite.x + (sira % 2 === 0 ? -62 : 62);
    }
    // Laboratuvar: panonun yanı (birden çok kişi yan yana)
    if (gorev === 'arastirma') {
      const pano = this.panoSpritesi();
      if (pano) return pano.x - 70 - (sira % 3) * 26;
    }
    // Bosta ya da çalışmıyor (çocuklar): yaşam alanı ortası
    return 320 * OK + ((sira % 4) - 1.5) * 40;
  }

  sakinIdleBaslat(s) {
    if (s.wander) s.wander.remove();
    const adim = Phaser.Math.Between(14, 24) * (Math.random() < 0.5 ? -1 : 1);
    s.sprite.setFlipX(adim < 0);
    s.wander = this.tweens.add({
      targets: s.sprite,
      x: s.hedefX + adim,
      duration: Phaser.Math.Between(1900, 3200),
      yoyo: true, repeat: -1,
      hold: 600, repeatDelay: 600,
      ease: 'Sine.easeInOut',
      onYoyo: () => s.sprite.setFlipX(!s.sprite.flipX),
      onRepeat: () => s.sprite.setFlipX(!s.sprite.flipX),
    });
  }

  sakinTasi(s, yeniX) {
    if (s.wander) { s.wander.remove(); s.wander = null; }
    this.tweens.killTweensOf(s.sprite);
    s.hedefX = yeniX;
    s.sprite.setFlipX(yeniX < s.sprite.x);
    this.tweens.add({
      targets: s.sprite, x: yeniX,
      duration: 1100, ease: 'Sine.easeInOut',
      onComplete: () => this.sakinIdleBaslat(s),
    });
  }

  // Sakin hareket ediyorsa yürü, duruyorsa bekle animasyonu (varsa)
  sakinAnimGuncelle() {
    for (const s of this.sakinler || []) {
      if (!s.sprite.active) continue;
      const hareket = Math.abs(s.sprite.x - (s.oncekiX ?? s.sprite.x)) > 0.05;
      s.oncekiX = s.sprite.x;
      if (s.ozelDoku) continue; // karaktere özel görselde genel animasyon yok
      const ad = `sakin-${(s.tip ?? 0) + 1}-${hareket ? 'yuru' : 'bekle'}`;
      if (!this.animOynat(s.sprite, ad)) this.animDurdur(s.sprite, 'sakin' + (s.tip ?? 0));
    }
  }

  sakinGuncelle() {
    const kaynak = state.sakinler || [];
    // Ayrılan (yorgunluktan giden) sakinlerin figürü solup kaybolur
    for (const eski of this.sakinler.filter((x) => !kaynak.some((k) => k.uid === x.uid))) {
      if (eski.wander) { eski.wander.remove(); eski.wander = null; }
      this.tweens.killTweensOf(eski.sprite);
      this.tweens.add({ targets: eski.sprite, alpha: 0, y: eski.sprite.y - 20, duration: 600, onComplete: () => eski.sprite.destroy() });
      this.sakinler.splice(this.sakinler.indexOf(eski), 1);
    }
    kaynak.forEach((kaynakSakin, i) => {
      const hedefX = this.sakinKonumu(kaynakSakin.gorev, i);
      const varOlan = this.sakinler.find((x) => x.uid === kaynakSakin.uid);
      if (varOlan) {
        if (varOlan.gorev !== kaynakSakin.gorev) {
          varOlan.gorev = kaynakSakin.gorev;
          this.sakinTasi(varOlan, hedefX);
        }
        // Keşifteki sakin sığınakta görünmez
        varOlan.sprite.setVisible(kaynakSakin.gorev !== 'kesif');
      } else {
        const idx = this.sakinler.length;
        // Karaktere özel görsel varsa o, yoksa sırayla genel sakin-1..4
        const ozel = 'sakin-' + kaynakSakin.id;
        const sakinDoku = this.gercekAsset(ozel) ? ozel : 'sakin' + (idx % 4);
        const sprite = this.olcekle(this.add.sprite(hedefX, ZEMIN_Y - 55, sakinDoku)
          .setOrigin(0.5, 1).setDepth(5).setAlpha(0), sakinDoku);
        const yeni = { uid: kaynakSakin.uid, gorev: kaynakSakin.gorev, sprite, hedefX, wander: null, tip: idx % 4, oncekiX: hedefX,
          doku: sakinDoku, ozelDoku: sakinDoku === ozel };
        this.tweens.add({ targets: sprite, alpha: 1, duration: 350 });
        this.tweens.add({
          targets: sprite, y: ZEMIN_Y, duration: 720, ease: 'Bounce.easeOut',
          onComplete: () => this.sakinIdleBaslat(yeni),
        });
        this.sakinler.push(yeni);
      }
    });
  }

  // ---------------------------------------------------------------
  //  EFEKTLER
  // ---------------------------------------------------------------
  panelSpritesi(anahtar) {
    return this.nesneler.find((n) => n.def.tip === 'panel' && n.def.panel === anahtar)?.sprite;
  }

  kapiSpritesi() {
    return this.nesneler.find((n) => n.def.tip === 'kapi')?.sprite;
  }

  // Panel üstünden sayıların yükselerek kaybolması
  suzülenEtkiler(sprite, etki) {
    if (!sprite || !etki) return;
    const girisler = Object.entries(etki).filter(([, d]) => d !== 0);
    const ustY = sprite.y - this.gorunurY(sprite) - 6;
    girisler.forEach(([ad, deger], i) => {
      const k = KAYNAKLAR[ad];
      if (!k) return;
      const iyi = (deger > 0) === k.yuksekIyi;
      const renk = iyi ? '#9fd36b' : '#ff8a74';
      const metin = `${deger > 0 ? '+' : '−'}${Math.abs(deger)} ${k.ikon}`;
      const yazi = this.add.text(sprite.x, ustY, metin, {
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '22px', fontStyle: 'bold',
        color: renk,
        stroke: '#0a0e07', strokeThickness: 4,
      }).setOrigin(0.5, 1).setDepth(45).setAlpha(0);
      this.tweens.add({
        targets: yazi,
        alpha: { from: 0, to: 1 }, y: ustY - 10,
        duration: 220, delay: i * 170, ease: 'Sine.easeOut',
        onComplete: () => {
          this.tweens.add({
            targets: yazi,
            alpha: 0, y: ustY - 70,
            duration: 900, ease: 'Sine.easeIn',
            onComplete: () => yazi.destroy(),
          });
        },
      });
    });
  }

  // Kirli eylem: duman + kamera sarsıntısı
  kirliEfekt(panelAnahtar) {
    const konum = DUMAN_KONUMU[panelAnahtar];
    if (konum) {
      // Oda görseli varsa görseldeki noktadan (ör. jeneratörün üstü)
      const gorselde = this.dumanNoktasi?.[panelAnahtar];
      const x = gorselde ? gorselde.x : konum.odaIndex * ODA_GENISLIK + konum.x;
      const y = gorselde ? gorselde.y : konum.y;
      const em = this.add.particles(x, y, 'duman', {
        speed: { min: 25, max: 60 },
        angle: { min: 255, max: 285 },
        scale: { start: 0.5, end: 1.8 },
        alpha: { start: 0.7, end: 0 },
        tint: [0x6b5a48, 0x7a6655, 0x4d3f33, 0x3a2f26],
        lifespan: { min: 1600, max: 2600 },
        frequency: 85,
        quantity: 1,
      }).setDepth(6);
      this.time.delayedCall(2400, () => em.stop());
      this.time.delayedCall(5200, () => em.destroy());
    }
    this.cameras.main.shake(320, 0.0045);
  }

  efektEylem({ panel, etki, kirli }) {
    const sprite = this.panelSpritesi(panel);
    if (sprite) this.suzülenEtkiler(sprite, etki);
    if (kirli) this.kirliEfekt(panel);
  }

  efektZiyaretci({ kisi }) {
    const kapi = this.kapiSpritesi();
    if (!kapi) return;
    if (this.animOynat(kapi, 'kapi-ac')) {
      kapi.once('animationcomplete', () => this.time.delayedCall(700, () => this.animDurdur(kapi, 'kapi')));
    }
    const yazi = this.add.text(
      kapi.x, kapi.y - this.gorunurY(kapi) - 8,
      `+${kisi} 👥`,
      {
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '26px', fontStyle: 'bold',
        color: '#9fd36b',
        stroke: '#0a0e07', strokeThickness: 4,
      }
    ).setOrigin(0.5, 1).setDepth(45);
    this.tweens.add({
      targets: yazi,
      alpha: 0, y: yazi.y - 80,
      duration: 1300, ease: 'Sine.easeIn',
      onComplete: () => yazi.destroy(),
    });
  }

  // Ekran ortasında "GÜN N" + olay başlığı; sonra bitince() çağrılır
  gunBasligiGoster(gun, olayAd, bitince) {
    const cx = EKRAN_G / 2;
    const cy = EKRAN_Y / 2;
    const buyuk = this.add.text(cx, cy - 20, `GÜN ${gun}`, {
      fontFamily: '"VT323", monospace',
      fontSize: '110px',
      color: '#eaffd4',
      stroke: '#0a140f', strokeThickness: 6,
    }).setOrigin(0.5).setDepth(60).setAlpha(0);
    this.ekranaSabitle(buyuk, 0);
    const kucuk = this.add.text(cx, cy + 58, olayAd || '', {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '22px', fontStyle: 'bold',
      color: '#9fd36b',
      stroke: '#0a140f', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(60).setAlpha(0);
    this.ekranaSabitle(kucuk, 0);

    this.tweens.add({
      targets: [buyuk, kucuk], alpha: 1, duration: 300, ease: 'Sine.easeOut',
      onComplete: () => {
        this.time.delayedCall(900, () => {
          this.tweens.add({
            targets: [buyuk, kucuk], alpha: 0, duration: 300, ease: 'Sine.easeIn',
            onComplete: () => {
              buyuk.destroy();
              kucuk.destroy();
              bitince?.();
            },
          });
        });
      },
    });
  }

  // Kapıda biri varken kapıyı periyodik tıklatır (küçük açılı sallanma)
  kapiTakTakBaslat() {
    if (this.kapiTakTakTimer) return;
    const sprite = this.kapiSpritesi();
    if (!sprite) return;
    this.kapiTakTakTimer = this.time.addEvent({
      delay: 3200, loop: true,
      callback: () => {
        if (!sprite.active) return;
        this.tweens.add({
          targets: sprite,
          angle: { from: 0, to: 2.6 },
          duration: 70, yoyo: true, repeat: 2,
          ease: 'Sine.easeInOut',
          onComplete: () => { sprite.setAngle(0); },
        });
      },
    });
  }

  kapiTakTakDurdur() {
    if (this.kapiTakTakTimer) {
      this.kapiTakTakTimer.remove();
      this.kapiTakTakTimer = null;
    }
    const sprite = this.kapiSpritesi();
    if (sprite) sprite.setAngle(0);
  }

  // Enerji azsa tavan lambalarını ara ara titret
  lambaTitremeBaslat() {
    if (this.lambaTitremeTimer) return;
    this.lambaTitremeTimer = this.time.addEvent({
      delay: 1500, loop: true,
      callback: () => {
        if (!this.lambalar.length) return;
        const l = Phaser.Utils.Array.GetRandom(this.lambalar);
        const asil = l.alpha;
        this.tweens.add({
          targets: l,
          alpha: Math.max(0, asil * 0.1),
          duration: 70, yoyo: true, repeat: 1, ease: 'Quad.easeInOut',
          onComplete: () => l.setAlpha(asil),
        });
      },
    });
  }

  lambaTitremeDurdur() {
    if (this.lambaTitremeTimer) {
      this.lambaTitremeTimer.remove();
      this.lambaTitremeTimer = null;
    }
  }

  // ---------------------------------------------------------------
  //  ÜTOPYA <-> DİSTOPYA GÖRSEL DÖNÜŞÜMÜ
  // ---------------------------------------------------------------
  gorselGuncelle(s) {
    this.makineAnimGuncelle();
    this.tweens.killTweensOf(this.gorsel);
    this.tweens.add({
      targets: this.gorsel, d: s.denge, duration: 1200, ease: 'Sine.easeInOut',
      onUpdate: () => this.gorselUygula(),
    });
    this.gorselUygula();
  }

  gorselUygula() {
    // 1 = ütopya, 0 = distopya. 30 altı tamamen karanlık, 80 üstü tamamen aydınlık.
    const t = Phaser.Math.Clamp((this.gorsel.d - 30) / 50, 0, 1);
    const k = state.kaynak;

    this.gokyuzu.fillColor = renkGecis(0xb5774a, 0x8fd3ff, t);
    this.gunes.fillColor = renkGecis(0xff9a4a, 0xfff3b0, t);
    this.gunes.setAlpha(0.35 + 0.65 * t);
    this.sehirBoya(renkGecis(0x5a4436, 0xa9bccf, t), renkGecis(0x3e2f27, 0x7d93ad, t));
    if (this.manzara) {
      // Kötü manzara varsa denge düştükçe belirir; yoksa iyi manzara karartılır
      if (this.manzara.kotu) this.manzara.kotu.setAlpha(1 - t);
      else this.manzara.iyi.setTint(renkGecis(0x8a6a50, 0xffffff, t));
    }
    this.atmosfer.setAlpha((1 - t) * 0.42);

    const ziyaretciVar = !!state.ziyaretci && !state.bitti;
    this.kapiIsaret.setVisible(ziyaretciVar);
    if (ziyaretciVar) this.kapiTakTakBaslat();
    else this.kapiTakTakDurdur();
    this.sakinGuncelle();

    for (const l of this.lambalar) l.setAlpha(0.04 + (k.enerji / 100) * 0.32);
    // Enerji azsa lambaları titret, bol varsa durdur
    if (k.enerji < 25 && !state.bitti) this.lambaTitremeBaslat();
    else this.lambaTitremeDurdur();

    // Denge düşükse dışarıda süzülen kül, yükselince kaybolur
    if (this.disToz) {
      const toz = this.disToz;
      if (this.gorsel.d < 40 && !state.bitti) {
        if (!toz.emitting) toz.start();
      } else if (toz.emitting) {
        toz.stop();
      }
    }
    for (const su of this.suTanklari) su.setScale(1, Math.max(0.02, k.su / 100));
    if (this.copYigini) this.copYigini.setScale((this.copYigini.temelOlcek ?? 1) * (0.3 + (k.atik / 100) * 1.0));
    const saglik = (k.gida / 100) * 0.6 + t * 0.4;
    const gercekBitki = this.gercekAsset('bitki');
    const solgunVar = this.gercekAsset('bitki-solgun');
    for (const b of this.bitkiler) {
      // Solgun görsel varsa sağlık düşünce ona geçilir (ölçek yeni dokuya göre)
      if (solgunVar) {
        const hedef = saglik < 0.45 ? 'bitki-solgun' : 'bitki';
        if (b.texture.key !== hedef) { b.setTexture(hedef); this.olcekle(b, 'bitki'); }
      }
      // Yer tutucu beyaz çizildiği için renklendirilir; gerçek görsel sadece hafifçe soldurulur
      b.setTint(gercekBitki ? renkGecis(0xb8a07a, 0xffffff, saglik) : renkGecis(0x8a6b3a, 0x4caf50, saglik));
      const o = b.temelOlcek ?? 1;
      b.setScale(o, o * (0.55 + 0.45 * saglik));
    }
  }

  // ---------------------------------------------------------------
  //  OYUN DÖNGÜSÜ
  // ---------------------------------------------------------------
  update() {
    // Kendi saatimizle delta: düşük FPS'li bilgisayarlarda da hız sabit kalır
    const simdi = performance.now();
    const dt = Math.min(100, simdi - (this.sonZaman ?? simdi));
    this.sonZaman = simdi;

    const eBasildi = this.etkilesimIstegi;
    this.etkilesimIstegi = false; // her karede tüketilir (panel açıkken basılan E birikmez)
    this.sakinAnimGuncelle(); // pencere açıkken de sakinler yürümeye devam eder
    if (ui.acikMi() || this.gecisVar || state.bitti) {
      this.ipucu.setVisible(false);
      return;
    }

    const T = this.tuslar;
    let yon = 0;
    if (T.sol.isDown || T.solOk.isDown) yon -= 1;
    if (T.sag.isDown || T.sagOk.isDown) yon += 1;

    const p = this.oyuncu;
    p.x = Phaser.Math.Clamp(p.x + (yon * HIZ * dt) / 1000, 40, this.dunyaG - 40);
    const mesgul = simdi < this.oyuncuMesgulBitis && yon === 0;
    if (yon !== 0) {
      p.setFlipX(yon < 0);
      this.yurume += dt;
      // Yürüme animasyonu varsa onu oynat; yoksa sabit görsel + kodla zıplama
      if (this.animOynat(p, 'oyuncu-yuru')) {
        p.y = ZEMIN_Y;
      } else {
        this.animDurdur(p, 'oyuncu');
        p.y = ZEMIN_Y - Math.abs(Math.sin(this.yurume * 0.014)) * 5;
      }
      // Her ~220ms'de bir ayak altında küçük bir toz pufu
      this.yurumeTozSayac += dt;
      if (this.yurumeTozSayac > 220) {
        this.yurumeTozSayac = 0;
        this.ayakTozu.emitParticleAt(p.x - yon * 8, ZEMIN_Y - 2, 2);
      }
    } else {
      p.y = ZEMIN_Y;
      this.yurumeTozSayac = 0;
      if (!mesgul && !this.animOynat(p, 'oyuncu-bekle')) this.animDurdur(p, 'oyuncu');
    }

    // En yakın etkileşimli nesne
    let enYakin = null;
    // Ölçeklenmiş genişlik hesaba katılır: geniş nesnede (yatak) kenara yaklaşmak yeter
    let min = Infinity;
    for (const n of this.nesneler) {
      n.sprite.clearTint();
      const d = Math.abs(n.sprite.x - p.x);
      const kenar = Math.max(0, d - n.sprite.displayWidth / 2);
      if (kenar < ETKILESIM_MESAFE && d < min) { min = d; enYakin = n; }
    }

    if (enYakin) {
      enYakin.sprite.setTint(0xfff7c2);
      let metin = enYakin.def.etiket;
      if (enYakin.def.tip === 'kapi' && state.ziyaretci) {
        metin = 'Kapı: biri kapıyı çalıyor!';
      } else if (enYakin.def.tip === 'panel' && MAKINELER[enYakin.def.panel]) {
        const op = makineOperatoru(enYakin.def.panel);
        const kendisi = state.oyuncuMakineler?.includes(enYakin.def.panel);
        if (op) metin += ` · Operatör: ${sakinTanimi(op.id).ad}`;
        else if (kendisi) metin += ` · Bugün sen çalışıyorsun`;
        else metin += ` · ⚠ Operatör yok`;
      }
      this.ipucu
        .setText(`[E] ${metin}`)
        .setPosition(enYakin.sprite.x, enYakin.sprite.y - this.gorunurY(enYakin.sprite) - 10)
        .setVisible(true);
      if (eBasildi) this.etkilesim(enYakin.def);
    } else {
      this.ipucu.setVisible(false);
    }
  }

  etkilesim(def) {
    switch (def.tip) {
      case 'panel':
        if (this.animOynat(this.oyuncu, 'oyuncu-calis')) {
          this.oyuncuMesgulBitis = performance.now() + (ANIMASYONLAR['oyuncu-calis'].kare / ANIMASYONLAR['oyuncu-calis'].fps) * 1000;
        }
        ui.panelAc(PANELLER[def.panel], def.panel);
        break;
      case 'radyo':
        ui.olayGoster(state.olay);
        break;
      case 'pano':
        ui.panoAc();
        break;
      case 'yatak':
        ui.gunuBitirOnay(() => this.gunuBitirAkisi());
        break;
      case 'kapi': {
        const z = state.ziyaretci;
        if (!z) {
          ui.bilgi('Kapı', 'Kapının önünde kimse yok. Dışarıda sıcak rüzgar uğulduyor.');
          break;
        }
        ui.ziyaretciGoster(
          z,
          () => {
            ziyaretciKabul();
            ui.bilgi('Kapı açıldı', `${z.ad} sığınağa yerleşti. ${z.kisi > 1 ? 'Yüzlerinde' : 'Yüzünde'} haftalardır ilk kez bir gülümseme var.`);
          },
          () => {
            ziyaretciReddet();
            ui.bilgi('Kapı kapalı kaldı', 'Bir süre kapının önünde beklediler. Sonra ayak sesleri sıcak rüzgarın içinde kayboldu.');
          },
        );
        break;
      }
    }
  }

  gunuBitirAkisi() {
    this.gecisVar = true;
    const sonuc = gunuBitir();
    const kam = this.cameras.main;
    kam.fadeOut(700, 10, 8, 20);
    kam.once('camerafadeoutcomplete', () => {
      if (sonuc.tip === 'devam') {
        kam.fadeIn(900, 10, 8, 20);
        // Önce büyük gün başlığı, sonra gece raporu
        this.gunBasligiGoster(state.gun, state.olay.baslik, () => {
          this.gecisVar = false;
          ui.gunBaslangici(sonuc);
        });
      } else {
        ui.sonGoster(sonuc, () => {
          sifirla();
          this.scene.restart();
          // Yeni sahnenin create() tamamlanmasını bekleyip 1. gün başlığını göster
          setTimeout(() => {
            ui.gunBasligi(state.gun, state.olay.baslik, () => ui.olayGoster(state.olay));
          }, 80);
        });
      }
    });
  }
}
