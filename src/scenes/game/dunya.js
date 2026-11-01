// Odalar, dış dünya, dekor ve yapıların çizimi.
// Yöntemler GameScene üzerinde çalışır; Phaser yaşam döngüsünü sahne yönetir.
import Phaser from 'phaser';
import { ODALAR, ODA_GENISLIK, TAVAN_Y, ZEMIN_Y, GORSEL_ZEMIN_ORANI, GORSEL_DUVAR_ORANI, ARKA_OLCEK, YURUME_PAYI } from '../../data/rooms.js';
import { ASSETLER } from '../../data/assets.js';
import { state } from '../../state.js';
import { EKRAN_G, EKRAN_Y, SABIT_X, SABIT_Y, OK } from './ayarlar.js';

export const dunya = {
  //  DIŞ DÜNYA: gökyüzü, güneş ve parallax şehir silueti
  // Ekrana sabit (f=0) ya da paralaks (0<f<1) katmanı ayarlar. Kamera zoom'u
  // ekran merkezinden yaptığı için katman (1-f) oranında kaydırılır; böylece
  // 960×540 koordinatlarıyla yazılmış katmanlar zoom öncesiyle aynı yerde görünür.
  ekranaSabitle(nesne, f) {
    nesne.setScrollFactor(f);
    nesne.x += SABIT_X * (1 - f);
    nesne.y += SABIT_Y * (1 - f);
    return nesne;
  },

  // Oda görselini yerleştirir (oran korunur, yürüme çizgisi zeminin ortasına
  // denk gelir, taşan yanlar kırpılır). Görsel yoksa null döner.
  odaGorseliYerlestir(oda, i) {
    // Birleşik oda (nesneler görselde çizili) varsa o, yoksa boş oda görseli
    const tam = this.gercekAsset('oda-' + oda.tip + '-tam');
    const anahtar = tam ? 'oda-' + oda.tip + '-tam' : 'oda-' + oda.tip;
    if (!this.gercekAsset(anahtar)) return null;
    const x0 = i * ODA_GENISLIK;
    const kaynak = this.textures.get(anahtar).getSourceImage();
    const oran = kaynak.width / kaynak.height;
    // Ölçek tüm odalarda aynı (nesneler orantılı kalsın); her odanın kendi zemin
    // çizgisi ortak yürüme çizgisine (ZEMIN_Y) hizalanır
    const duvar = oda.gorsel?.duvar ?? GORSEL_DUVAR_ORANI;
    const yurume = duvar + YURUME_PAYI;
    let H = (ZEMIN_Y - TAVAN_Y) / GORSEL_ZEMIN_ORANI;
    let W = H * oran;
    if (W < ODA_GENISLIK) { W = ODA_GENISLIK; H = W / oran; }
    const ust = ZEMIN_Y - yurume * H;
    const sol = x0 - (W - ODA_GENISLIK) / 2;
    const img = this.add.image(sol, ust, anahtar).setOrigin(0).setDisplaySize(W, H).setDepth(0.5);
    const olcek = W / kaynak.width;
    img.setCrop((x0 - sol) / olcek, 0, ODA_GENISLIK / olcek, kaynak.height);
    const yer = { sol, ust, W, H, alt: ust + H, duvarY: ust + duvar * H, tam };
    // Görsel üzerindeki oran koordinatını dünyaya çevirir
    yer.nokta = (fx, fy) => ({ x: sol + fx * W, y: ust + fy * H });
    this.odaYerlesimi[oda.tip] = yer;
    if (oda.gorsel?.duman) {
      const panel = oda.nesneler.find((n) => n.tip === 'panel')?.panel;
      if (panel) this.dumanNoktasi[panel] = yer.nokta(...oda.gorsel.duman);
    }
    return yer;
  },

  // Oda sınırlarına taşıyıcı kolon + yumuşak gölge: görseller arası sert geçişi örter
  odaGecisleriCiz() {
    const yerler = Object.values(this.odaYerlesimi);
    if (!yerler.length) return;
    // Birleşik oda görselleri (tek şeritten kesilmiş) kendi sütunlarını içerir
    if (yerler.length === ODALAR.length && yerler.every((y) => y.tam)) return;
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
  },

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
  },

  sehirBoya(uzakRenk, yakinRenk) {
    if (this.sehirRenkleri?.uzak === uzakRenk && this.sehirRenkleri?.yakin === yakinRenk) return;
    this.sehirRenkleri = { uzak: uzakRenk, yakin: yakinRenk };
    for (const [g, liste, renk] of [
      [this.uzakSehir, this.sehirSekilleri.uzak, uzakRenk],
      [this.yakinSehir, this.sehirSekilleri.yakin, yakinRenk],
    ]) {
      g.clear().fillStyle(renk);
      for (const b of liste) g.fillRect(b.x, ZEMIN_Y - b.h, b.w, b.h);
    }
  },

  //  EV: duvarlar (pencere boşluklu), tavan, zemin, ara duvarlar
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

      // Oda görseli varsa kodla çizilen duvar/pencere/lamba çizilmez: görselin
      // şeffaf camlarından doğrudan dış dünya (manzara) görünür
      const gorselVar = this.gercekAsset('oda-' + oda.tip);
      if (!gorselVar) {
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
      }

      // Oda arka planı görseli varsa kodla çizilen duvarın üstüne biner
      const yer = this.odaGorseliYerlestir(oda, i);

      // İnce, sakin oda levhası; dünya görselini bastırmaz.
      const odaYazisi = this.add.text(x0 + 26, ust + 12, oda.ad.toLocaleUpperCase('tr-TR'), {
        fontFamily: '"Barlow Condensed", sans-serif', fontSize: '13px', fontStyle: 'bold',
        color: '#ded7bd', padding: { x: 9, y: 4 },
      }).setDepth(2).setAlpha(0.9);
      this.etiketZeminiCiz(this.add.graphics().setDepth(1.9), odaYazisi, 0.68);

      // Tavan lambası (enerjiye göre parlar)
      const lx = x0 + ODA_GENISLIK / 2 + (oda.pencereX > ODA_GENISLIK / 2 ? -150 : 150);
      if (!gorselVar) g.fillStyle(0x444444).fillRect(lx - 1, ust, 2, 22).fillRect(lx - 14, ust + 22, 28, 8);
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
        const arkada = n.arka && !oda.gorsel?.onde?.includes(ad);
        const yOran = yer ? oda.gorsel?.nesneY?.[ad] : null;
        const ny = yOran != null ? yer.ust + yOran * yer.H : (yer && arkada ? yer.duvarY + 4 : alt);
        const s = this.add.sprite(x0 + nx, ny, anahtar).setOrigin(0.5, 1).setDepth(arkada || !yer ? 3 : 6);
        if (yer && arkada) s.ekOlcek = ARKA_OLCEK;
        this.olcekle(s, anahtar);
        // Görselde zaten çizili nesne: sprite görünmez, etkileşim ve ipucu kalır
        if (yer && (yer.tam || oda.gorsel?.gorseldeVar?.includes(n.tip))) { s.setAlpha(0); s.gorseldeCizili = true; }
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
    // cati.png varsa altındaki kahverengi kiriş şeridi çizilmez (asset altta
    // transparan olabilir, overlap çirkin görünüyor). Yoksa yer tutucu kirişler
    // çizilsin ki kodla üretilen eğik paneller yere oturmuş gibi dursun.
    if (!this.gercekAsset('cati')) {
      g.fillStyle(0x5b4a3a).fillRect(-20, ust - 18, this.dunyaG + 40, 18);
      g.fillStyle(0x3f4a3a).fillRect(-20, ust - 30, this.dunyaG + 40, 12);
    }
    this._cizCatiPanelleri();
    g.fillStyle(0x4b3b2c).fillRect(-20, alt, this.dunyaG + 40, 14);
    g.fillStyle(0x3a2e24).fillRect(-20, alt + 14, this.dunyaG + 40, EKRAN_Y - alt);
  },

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
  },

  // Çatı: cati.png tüm dünya genişliğinde tile edilir (asset ile uyumlu).
  // Ek Güneş Paneli yapı inşa edildikçe çatıya ek "takviye paneller" yerleştirilir.
  // Başlangıç: sadece cati.png'nin içindeki paneller görünür.
  _cizCatiPanelleri() {
    const ust = TAVAN_Y;
    // Çatı tabanı: cati.png varsa tam dünya genişliğinde tile et (eski davranış)
    if (!this.catiTemel) {
      if (this.gercekAsset('cati')) {
        const h = ASSETLER.cati.yukseklik;
        const kaynak = this.textures.get('cati').getSourceImage();
        this.catiTemel = this.add.tileSprite(-20, ust - h, this.dunyaG + 40, h, 'cati')
          .setOrigin(0).setDepth(0.6).setTileScale(h / kaynak.height, h / kaynak.height);
      } else {
        // Yer tutucu (asset yoksa): kodla çizilen eğik güneş panelleri her 180 px
        const g = this.add.graphics().setDepth(0.6);
        for (let x = 60; x < this.dunyaG; x += 180) {
          const taban = ust - 30;
          g.fillStyle(0x3a3a36).fillRect(x + 18, taban - 14, 4, 14).fillRect(x + 88, taban - 22, 4, 22);
          g.fillStyle(0x23314f).fillPoints([{ x, y: taban - 12 }, { x: x + 110, y: taban - 28 }, { x: x + 110, y: taban - 20 }, { x, y: taban - 4 }], true);
          g.lineStyle(2, 0x5b6470, 1).strokePoints([{ x, y: taban - 12 }, { x: x + 110, y: taban - 28 }, { x: x + 110, y: taban - 20 }, { x, y: taban - 4 }], true);
          g.lineStyle(1, 0x7fa6d8, 0.5).lineBetween(x + 37, taban - 17, x + 37, taban - 9).lineBetween(x + 73, taban - 23, x + 73, taban - 15);
        }
        this.catiTemel = g;
      }
    }
    // Ek Güneş Paneli yapı: her inşa için çatıya 2 "takviye panel" ekle
    const ekPanelSayisi = (state.yapilar || []).filter((y) => y === 'ekPanel').length;
    const hedefEk = ekPanelSayisi * 2;
    if (!this.catiEkPaneller) this.catiEkPaneller = [];
    if (this.catiEkPaneller.length === hedefEk) return;
    for (const sp of this.catiEkPaneller) sp.destroy();
    this.catiEkPaneller = [];
    if (hedefEk === 0) return;
    // ikon-ek-panel.png varsa küçük sprite olarak çatının farklı yerlerine yerleştir
    const ikon = this.gercekAsset('ikon-ek-panel') ? 'ikon-ek-panel' : null;
    const h = this.gercekAsset('cati') ? ASSETLER.cati.yukseklik : 32;
    const yerler = [];
    for (let i = 0; i < hedefEk; i++) {
      // Ek paneller cati.png'nin arasında kalmayacak şekilde çatının üstüne (daha yukarı) konur
      const x = (this.dunyaG / (hedefEk + 1)) * (i + 1);
      yerler.push(x);
    }
    for (const x of yerler) {
      let sp;
      if (ikon) {
        sp = this.add.image(x, ust - h + 8, ikon).setOrigin(0.5, 1).setDepth(0.65);
        // ~40 px genişlikte göster
        const im = this.textures.get(ikon).getSourceImage();
        sp.setScale(42 / im.width);
      } else {
        const g = this.add.graphics().setDepth(0.65);
        const taban = ust - h + 8;
        // Küçük yatık panel
        g.fillStyle(0x1c2b4a).fillPoints([
          { x: x - 22, y: taban - 10 }, { x: x + 22, y: taban - 16 },
          { x: x + 22, y: taban - 10 }, { x: x - 22, y: taban - 4 },
        ], true);
        g.lineStyle(1.5, 0x6a7a8c).strokePoints([
          { x: x - 22, y: taban - 10 }, { x: x + 22, y: taban - 16 },
          { x: x + 22, y: taban - 10 }, { x: x - 22, y: taban - 4 },
        ], true);
        g.lineStyle(1, 0x8fb3e8, 0.55).lineBetween(x, taban - 13, x, taban - 7);
        sp = g;
      }
      this.catiEkPaneller.push(sp);
    }
  },

  // Yapılar (data/structures.js) inşa edilince sahnede görsel karşılık:
  //  - yalitim : sığınak kenar duvarlarına açık renk kaplama
  //  - bariyer : sera odasının önüne beton bariyer
  //  - ekPanel : _cizCatiPanelleri() tarafından ele alınıyor
  _cizYapilar() {
    const yapilar = state.yapilar || [];

    // ---- Yalıtım Tesisi: iki yan duvara dik panel ----
    if (yapilar.includes('yalitim') && !this.yalitimKat) {
      const g = this.add.graphics().setDepth(0.5);
      const w = 22;                // panel genişliği
      const yUst = TAVAN_Y - 10;
      const yAlt = ZEMIN_Y + 10;
      const h = yAlt - yUst;
      const yan = [-w, this.dunyaG]; // sol ve sağ panelin iç kenar x'i
      for (const xi of yan) {
        // Ana panel (açık yeşil köpük)
        g.fillStyle(0xc8d4ba).fillRect(xi, yUst, w, h);
        // Üstte alümünyum başlık şeridi (parlak)
        g.fillStyle(0xe8ecd8).fillRect(xi, yUst, w, 6);
        g.fillStyle(0x9fb28e).fillRect(xi, yUst + 6, w, 1);
        // Altta beton temel
        g.fillStyle(0x8e9e82).fillRect(xi, yAlt - 7, w, 7);
        // Dikey panel bağlantıları (her ~55 px)
        g.lineStyle(1, 0x7f9478, 0.9);
        for (let y = yUst + 10; y < yAlt - 10; y += 55) g.lineBetween(xi, y, xi + w, y);
        // Çapraz lattice deseni (hafif)
        g.lineStyle(1, 0x8ea385, 0.35);
        for (let y = yUst + 14; y < yAlt - 10; y += 14) {
          g.lineBetween(xi, y, xi + w, y + 8);
          g.lineBetween(xi, y + 8, xi + w, y);
        }
        // Vidalar (dört köşe + ortada iki)
        g.fillStyle(0x4a5546, 1);
        const vida = (x, y) => g.fillCircle(x, y, 1.5);
        vida(xi + 3, yUst + 3); vida(xi + w - 3, yUst + 3);
        vida(xi + 3, yAlt - 10); vida(xi + w - 3, yAlt - 10);
        vida(xi + 3, (yUst + yAlt) / 2); vida(xi + w - 3, (yUst + yAlt) / 2);
      }
      // Sağ tarafta hafif gölge (sığınağın sol duvarının iç kenarına doğru)
      g.fillStyle(0x000000, 0.15);
      g.fillRect(0, TAVAN_Y - 4, 3, ZEMIN_Y - TAVAN_Y + 8); // sol panelin iç gölgesi
      g.fillRect(this.dunyaG - 3, TAVAN_Y - 4, 3, ZEMIN_Y - TAVAN_Y + 8); // sağ panelin iç gölgesi
      this.yalitimKat = g;
    }

    // ---- Sel Bariyeri: sera odasının önünde beton bariyer ----
    if (yapilar.includes('bariyer') && !this.bariyerDekor) {
      const seraOda = ODALAR.findIndex((o) => o.tip === 'sera');
      if (seraOda >= 0) {
        const x0 = seraOda * ODA_GENISLIK;
        const g = this.add.graphics().setDepth(2.5);
        const bx = x0 + 20;
        const bw = ODA_GENISLIK - 40;
        const yAlt = ZEMIN_Y - 2;    // zeminin hemen üstü
        const bH = 34;               // toplam yükseklik
        const by = yAlt - bH;
        // Alt beton ana gövde (koyu)
        g.fillStyle(0x5b5f55).fillRect(bx, by + 8, bw, bH - 8);
        // Üst beton başlığı (hafif daha açık, T profili için 4 px taşmış)
        g.fillStyle(0x7a7f72).fillRect(bx - 4, by, bw + 8, 14);
        // Üst parlaklık şeridi
        g.fillStyle(0x95a08c).fillRect(bx - 4, by, bw + 8, 2);
        // Sarı-siyah uyarı şeridi (başlığın altında)
        const sY = by + 15;
        g.fillStyle(0x1a1a16).fillRect(bx, sY, bw, 5);
        g.fillStyle(0xd6a84a);
        for (let i = 0; i < bw - 10; i += 18) g.fillRect(bx + i + 2, sY, 10, 5);
        // Dikey bağlantı çizgileri (segment hissi) ~110 px
        g.lineStyle(1, 0x3f433b, 0.8);
        for (let x = bx + 55; x < bx + bw - 10; x += 110) g.lineBetween(x, by + 23, x, yAlt);
        // Alt kısımda drenaj delikleri (küçük daireler)
        g.fillStyle(0x2d2f2a);
        for (let x = bx + 30; x < bx + bw - 10; x += 60) g.fillCircle(x, yAlt - 4, 2);
        // Köşe çentikleri
        g.fillStyle(0x4a4e45, 0.6);
        g.fillRect(bx - 4, by, 2, 2); g.fillRect(bx + bw + 2, by, 2, 2);
        // Önünde zemine düşen gölge
        g.fillStyle(0x000000, 0.18);
        g.fillEllipse(bx + bw / 2, yAlt + 1, bw - 10, 6);
        this.bariyerDekor = g;
      }
    }
  },
};
