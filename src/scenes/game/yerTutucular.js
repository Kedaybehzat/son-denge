// Eksik görseller için kodla üretilen dokular.
// Yöntemler GameScene üzerinde çalışır; Phaser yaşam döngüsünü sahne yönetir.
import { YER_TUTUCULAR } from './dokuOnbellegi.js';

export const yerTutucular = {
  //  YER TUTUCU DOKULAR (çizimler gelince değiştirilecek)
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
  },

  // Yer tutucu dokuyu sadece o anahtarda doku yoksa üretir
  dokuUret(g, anahtar, w, h) {
    if (this.textures.exists(anahtar)) return;
    g.generateTexture(anahtar, w, h);
    YER_TUTUCULAR.add(anahtar);
  },
};
