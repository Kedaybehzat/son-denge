// =============================================================
//  OYUN SAHNESİ
//  Yandan görünüş: odalar yan yana, kamera karakteri takip eder.
//  Tüm görseller şimdilik kodla çiziliyor (yer tutucu). Çizimler
//  hazır olunca dokulariUret() yerine this.load.image(...) kullanılır.
// =============================================================
import Phaser from 'phaser';
import { ODALAR, ODA_GENISLIK, TAVAN_Y, ZEMIN_Y } from '../data/rooms.js';
import { PANELLER } from '../data/panels.js';
import { state, abone, gunuBitir, sifirla, ziyaretciKabul, ziyaretciReddet } from '../state.js';
import * as ui from '../ui/ui.js';

const HIZ = 240;
const ETKILESIM_MESAFE = 60;
const EKRAN_G = 960;
const EKRAN_Y = 540;

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

  create() {
    this.dunyaG = ODALAR.length * ODA_GENISLIK;
    this.nesneler = [];
    this.lambalar = [];
    this.bitkiler = [];
    this.suTanklari = [];
    this.copYigini = null;
    this.gecisVar = false;

    this.dokulariUret();
    this.disariCiz();
    this.evCiz();
    this.oyuncuOlustur();

    this.cameras.main.setBounds(0, 0, this.dunyaG, EKRAN_Y);
    this.cameras.main.startFollow(this.oyuncu, true, 0.12, 0.12);

    // Atmosfer katmanı: denge düştükçe ekran kararır
    this.atmosfer = this.add.rectangle(0, 0, EKRAN_G, EKRAN_Y, 0x2a1608, 0).setOrigin(0).setScrollFactor(0).setDepth(40);

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

    // Görseller denge değerine yumuşak geçişle tepki verir
    this.gorsel = { d: state.denge };
    this.gorselUygula();
    const iptal = abone((s) => this.gorselGuncelle(s));
    this.events.once('shutdown', iptal);
  }

  // ---------------------------------------------------------------
  //  YER TUTUCU DOKULAR (çizimler gelince değiştirilecek)
  // ---------------------------------------------------------------
  dokulariUret() {
    if (this.textures.exists('oyuncu')) return; // restart'ta tekrar üretme
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Oyuncu (sağa bakıyor)
    g.fillStyle(0x3b4f63).fillRoundedRect(3, 20, 26, 40, 7);
    g.fillStyle(0x2a3a4a).fillRect(6, 52, 8, 10).fillRect(18, 52, 8, 10);
    g.fillStyle(0xf1c27d).fillCircle(16, 11, 11);
    g.fillStyle(0x4a3424).fillRect(5, 0, 22, 6);
    g.fillStyle(0x222222).fillRect(21, 9, 3, 4);
    g.fillStyle(0x9fd36b).fillRect(3, 30, 26, 4); // yeşil şerit: Yeşilvadi üniforması
    g.generateTexture('oyuncu', 32, 62);
    g.clear();

    // Kontrol paneli
    g.fillStyle(0x37424d).fillRoundedRect(0, 0, 70, 100, 6);
    g.fillStyle(0x0e2a1f).fillRect(8, 10, 54, 36);
    g.fillStyle(0x52e3a4).fillRect(12, 16, 30, 4).fillRect(12, 24, 40, 4).fillRect(12, 32, 22, 4);
    g.fillStyle(0xe85d4a).fillCircle(18, 62, 5);
    g.fillStyle(0xf2c14e).fillCircle(35, 62, 5);
    g.fillStyle(0x6bd36b).fillCircle(52, 62, 5);
    g.fillStyle(0x27313a).fillRect(10, 76, 50, 16);
    g.generateTexture('panel', 70, 100);
    g.clear();

    // Radyo + masa
    g.fillStyle(0x7a5233).fillRect(0, 34, 80, 8).fillRect(6, 42, 6, 38).fillRect(68, 42, 6, 38);
    g.fillStyle(0xa8483a).fillRoundedRect(16, 6, 48, 28, 5);
    g.fillStyle(0xe8d9b5).fillCircle(30, 20, 8);
    g.fillStyle(0x333333).fillRect(44, 14, 14, 3).fillRect(44, 20, 14, 3);
    g.lineStyle(2, 0x333333).lineBetween(56, 6, 64, 0);
    g.generateTexture('radyo', 80, 80);
    g.clear();

    // Yatak
    g.fillStyle(0x6b4a2f).fillRect(0, 20, 8, 40).fillRect(0, 40, 140, 10);
    g.fillStyle(0x6b4a2f).fillRect(132, 30, 8, 30);
    g.fillStyle(0x7fa7c9).fillRect(8, 28, 124, 14);
    g.fillStyle(0xf3efe6).fillRoundedRect(10, 20, 34, 12, 4);
    g.generateTexture('yatak', 140, 60);
    g.clear();

    // Kapı
    g.fillStyle(0x5a3d26).fillRect(0, 0, 60, 120);
    g.fillStyle(0x7a5536).fillRect(6, 6, 48, 110);
    g.fillStyle(0xd9b44a).fillCircle(46, 64, 4);
    g.generateTexture('kapi', 60, 120);
    g.clear();

    // Bitki
    g.fillStyle(0x8a5a3a).fillRect(8, 40, 24, 16);
    g.fillStyle(0xffffff).fillRect(19, 14, 3, 28);
    g.fillEllipse(12, 22, 16, 9).fillEllipse(29, 18, 16, 9).fillEllipse(14, 10, 14, 8).fillEllipse(26, 6, 12, 8);
    g.generateTexture('bitki', 40, 56);
    g.destroy();

    // Sığınak sakinleri (farklı kıyafet renkleri)
    const g2 = this.make.graphics({ x: 0, y: 0, add: false });
    [0x8a5a44, 0x4f6d8a, 0x7a7a3a, 0x6b4f7a].forEach((renk, i) => {
      g2.clear();
      g2.fillStyle(renk).fillRoundedRect(3, 18, 22, 36, 6);
      g2.fillStyle(0x3a3a3a).fillRect(5, 48, 7, 8).fillRect(16, 48, 7, 8);
      g2.fillStyle([0xf1c27d, 0xc68642, 0xe0ac69, 0x8d5524][i]).fillCircle(14, 10, 10);
      g2.fillStyle([0x2b2b2b, 0x6b4a2a, 0xd9c27a, 0x1a1a1a][i]).fillRect(4, 0, 20, 5);
      g2.generateTexture('sakin' + i, 28, 56);
    });
    g2.destroy();

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
  }

  // ---------------------------------------------------------------
  //  DIŞ DÜNYA: gökyüzü, güneş ve parallax şehir silueti
  // ---------------------------------------------------------------
  disariCiz() {
    this.gokyuzu = this.add.rectangle(0, 0, EKRAN_G, EKRAN_Y, 0x8fd3ff).setOrigin(0).setScrollFactor(0).setDepth(-10);
    this.gunes = this.add.circle(780, 90, 34, 0xfff3b0).setScrollFactor(0.05).setDepth(-9);

    // Uzak şehir (yavaş kayar) ve yakın binalar (biraz daha hızlı)
    this.uzakSehir = this.add.graphics().setScrollFactor(0.2).setDepth(-8);
    this.yakinSehir = this.add.graphics().setScrollFactor(0.45).setDepth(-7);
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

      // Oda adı
      this.add.text(x0 + 22, ust + 12, oda.ad.toUpperCase(), {
        fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#3a3328', fontStyle: 'bold',
      }).setAlpha(0.55).setDepth(1);

      // Tavan lambası (enerjiye göre parlar)
      const lx = x0 + ODA_GENISLIK / 2 + (oda.pencereX > ODA_GENISLIK / 2 ? -150 : 150);
      g.fillStyle(0x444444).fillRect(lx - 1, ust, 2, 22).fillRect(lx - 14, ust + 22, 28, 8);
      const isik = this.add.image(lx, ust + 60, 'isik').setScale(1.6, 1.3).setDepth(1).setBlendMode(Phaser.BlendModes.ADD);
      this.lambalar.push(isik);

      this.dekorCiz(oda.tip, x0);

      // Etkileşimli nesneler
      for (const n of oda.nesneler) {
        const s = this.add.image(x0 + n.x, alt, n.tip === 'panel' ? 'panel' : n.tip).setOrigin(0.5, 1).setDepth(3);
        this.nesneler.push({ sprite: s, def: n });
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
    // Çatıdaki güneş panelleri
    for (let x = 60; x < this.dunyaG; x += 180) {
      g.fillStyle(0x2c3e66).fillRect(x, ust - 52, 110, 22);
      g.lineStyle(1, 0x8fb3e8, 0.6).strokeRect(x, ust - 52, 110, 22).lineBetween(x + 55, ust - 52, x + 55, ust - 30);
    }
    g.fillStyle(0x4b3b2c).fillRect(-20, alt, this.dunyaG + 40, 14);
    g.fillStyle(0x3a2e24).fillRect(-20, alt + 14, this.dunyaG + 40, EKRAN_Y - alt);
  }

  // Odaya göre dekor. Bazıları kaynaklara göre değişir (su tankı, çöp yığını, bitkiler).
  dekorCiz(tip, x0) {
    const g = this.add.graphics().setDepth(2);
    const alt = ZEMIN_Y;
    if (tip === 'yasam') {
      g.fillStyle(0x8c6b4a).fillRect(x0 + 340, alt - 70, 70, 70); // dolap
      g.fillStyle(0x6e5236).fillRect(x0 + 344, alt - 40, 62, 3);
    } else if (tip === 'enerji') {
      for (let i = 0; i < 3; i++) {
        const bx = x0 + 400 + i * 50;
        g.fillStyle(0x2e3a44).fillRoundedRect(bx, alt - 90, 38, 90, 4);
        g.fillStyle(0x52e3a4).fillRect(bx + 8, alt - 80, 22, 6);
      }
      g.fillStyle(0x6b6b6b).fillRoundedRect(x0 + 60, alt - 70, 110, 70, 6); // jeneratör
      g.fillStyle(0x3d3d3d).fillRect(x0 + 140, alt - 100, 12, 32);
    } else if (tip === 'su') {
      for (let i = 0; i < 2; i++) {
        const tx = x0 + 470 + i * 90;
        g.fillStyle(0xdfe7ec).fillRoundedRect(tx - 34, alt - 150, 68, 150, 12);
        const su = this.add.rectangle(tx, alt - 6, 56, 138, 0x4aa3df).setOrigin(0.5, 1).setDepth(2);
        this.suTanklari.push(su);
      }
      g.lineStyle(6, 0x8a9aa6).lineBetween(x0 + 60, alt - 120, x0 + 430, alt - 120);
    } else if (tip === 'sera') {
      g.fillStyle(0x7a5a3a).fillRect(x0 + 40, alt - 30, 440, 30); // saksı sırası
      for (let i = 0; i < 7; i++) {
        const b = this.add.image(x0 + 75 + i * 62, alt - 28, 'bitki').setOrigin(0.5, 1).setDepth(2);
        this.bitkiler.push(b);
      }
    } else if (tip === 'geri') {
      const renkler = [0x3b82c4, 0xe0b23a, 0x4caf50, 0x9a9a9a];
      renkler.forEach((r, i) => {
        g.fillStyle(r).fillRoundedRect(x0 + 420 + i * 52, alt - 70, 44, 70, 5);
        g.fillStyle(0x000000, 0.2).fillRect(x0 + 420 + i * 52, alt - 70, 44, 8);
      });
      this.copYigini = this.add.ellipse(x0 + 120, alt, 160, 80, 0x6f6252).setOrigin(0.5, 1).setDepth(2);
    }
  }

  oyuncuOlustur() {
    this.oyuncu = this.add.image(220, ZEMIN_Y, 'oyuncu').setOrigin(0.5, 1).setDepth(10);
    this.yurume = 0;

    // Kapıda biri varken kapının üstünde zıplayan işaret
    const kapi = this.nesneler.find((n) => n.def.tip === 'kapi');
    this.kapiIsaret = this.add
      .text(kapi.sprite.x, kapi.sprite.y - kapi.sprite.height - 30, '!', {
        fontFamily: 'system-ui, sans-serif', fontSize: '34px', fontStyle: 'bold', color: '#ffd23f',
        stroke: '#3a2a10', strokeThickness: 6,
      })
      .setOrigin(0.5, 1).setDepth(20).setVisible(false);
    this.tweens.add({ targets: this.kapiIsaret, y: '-=10', duration: 450, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.sakinler = [];
  }

  // Nüfus arttıkça sığınakta dolaşan sakinler belirir (oyuncu hariç)
  sakinGuncelle(nufus) {
    const hedef = Math.min(nufus - 1, 18);
    const yasak = this.nesneler.map((n) => n.sprite.x);
    while (this.sakinler.length < hedef) {
      let x;
      do x = Phaser.Math.Between(60, this.dunyaG - 60);
      while (yasak.some((y) => Math.abs(y - x) < 70));
      const s = this.add.image(x, ZEMIN_Y, 'sakin' + (this.sakinler.length % 4))
        .setOrigin(0.5, 1).setDepth(5).setAlpha(0);
      const adim = Phaser.Math.Between(25, 60) * (Math.random() < 0.5 ? -1 : 1);
      s.setFlipX(adim < 0);
      this.tweens.add({ targets: s, alpha: 1, duration: 800 });
      this.tweens.add({
        targets: s, x: x + adim, duration: Phaser.Math.Between(2200, 4200), yoyo: true, repeat: -1,
        hold: 800, repeatDelay: 800, ease: 'Sine.easeInOut',
        onYoyo: () => s.setFlipX(!s.flipX), onRepeat: () => s.setFlipX(!s.flipX),
      });
      this.sakinler.push(s);
    }
  }

  // ---------------------------------------------------------------
  //  ÜTOPYA <-> DİSTOPYA GÖRSEL DÖNÜŞÜMÜ
  // ---------------------------------------------------------------
  gorselGuncelle(s) {
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
    this.atmosfer.setAlpha((1 - t) * 0.42);

    this.kapiIsaret.setVisible(!!state.ziyaretci && !state.bitti);
    this.sakinGuncelle(state.nufus);

    for (const l of this.lambalar) l.setAlpha(0.04 + (k.enerji / 100) * 0.32);
    for (const su of this.suTanklari) su.setScale(1, Math.max(0.02, k.su / 100));
    if (this.copYigini) this.copYigini.setScale(0.3 + (k.atik / 100) * 1.0);
    const saglik = (k.gida / 100) * 0.6 + t * 0.4;
    for (const b of this.bitkiler) {
      b.setTint(renkGecis(0x8a6b3a, 0x4caf50, saglik));
      b.setScale(1, 0.55 + 0.45 * saglik);
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
    if (yon !== 0) {
      p.setFlipX(yon < 0);
      this.yurume += dt;
      p.y = ZEMIN_Y - Math.abs(Math.sin(this.yurume * 0.014)) * 5;
    } else {
      p.y = ZEMIN_Y;
    }

    // En yakın etkileşimli nesne
    let enYakin = null;
    let min = ETKILESIM_MESAFE;
    for (const n of this.nesneler) {
      n.sprite.clearTint();
      const d = Math.abs(n.sprite.x - p.x);
      if (d < min) { min = d; enYakin = n; }
    }

    if (enYakin) {
      enYakin.sprite.setTint(0xfff7c2);
      this.ipucu
        .setText(`[E] ${enYakin.def.tip === 'kapi' && state.ziyaretci ? 'Kapı: biri kapıyı çalıyor!' : enYakin.def.etiket}`)
        .setPosition(enYakin.sprite.x, enYakin.sprite.y - enYakin.sprite.height - 10)
        .setVisible(true);
      if (eBasildi) this.etkilesim(enYakin.def);
    } else {
      this.ipucu.setVisible(false);
    }
  }

  etkilesim(def) {
    switch (def.tip) {
      case 'panel':
        ui.panelAc(PANELLER[def.panel]);
        break;
      case 'radyo':
        ui.olayGoster(state.olay);
        break;
      case 'yatak':
        ui.onay(
          'Günü bitirmek istiyor musun?',
          state.eylem > 0
            ? `Hâlâ ${state.eylem} eylem hakkın var. Gece boyunca kaynaklar tüketilecek.`
            : 'Gece boyunca kaynaklar tüketilecek.',
          'Uyu',
          () => this.gunuBitirAkisi(),
        );
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
        this.gecisVar = false;
        ui.gunBaslangici(sonuc);
      } else {
        ui.sonGoster(sonuc, () => {
          sifirla();
          this.scene.restart();
          ui.olayGoster(state.olay);
        });
      }
    });
  }
}
