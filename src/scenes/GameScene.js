// Sahne yaşam döngüsü, oyuncu, etkileşim ve gün akışı.
// Çizim, doku, animasyon, NPC ve efekt yöntemleri ./game/ altında.
import Phaser from 'phaser';
import { ODALAR, ODA_GENISLIK, ZEMIN_Y } from '../data/rooms.js';
import { PANELLER } from '../data/panels.js';
import { ASSETLER } from '../data/assets.js';
import { ANIMASYONLAR } from '../data/animations.js';
import { state, abone, gunuBitir, sifirla, ziyaretciKabul, ziyaretciReddet, MAKINELER, makineOperatoru, sakinTanimi } from '../state.js';
import * as ui from '../ui/ui.js';
import { sesCal } from '../sesler.js';
import { HIZ, KOSU_CARPANI, ETKILESIM_MESAFE, EKRAN_G, EKRAN_Y, CIZIM_OLCEGI } from './game/ayarlar.js';
import { YER_TUTUCULAR } from './game/dokuOnbellegi.js';
import { yerTutucular } from './game/yerTutucular.js';
import { dokular } from './game/dokular.js';
import { animasyonlar } from './game/animasyonlar.js';
import { dunya } from './game/dunya.js';
import { sakinler } from './game/sakinler.js';
import { efektler } from './game/efektler.js';

export { CIZIM_OLCEGI } from './game/ayarlar.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    // Yazılar da çizim ölçeğinde render edilsin (zoom'da bulanık olmasın)
    const asilYaziUret = this.add.text;
    const yaziUret = asilYaziUret.bind(this.add);
    this.add.text = (...a) => yaziUret(...a).setResolution(CIZIM_OLCEGI);
    this.events.once('shutdown', () => { this.add.text = asilYaziUret; });
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
    this.sonZaman = null;
    this.konusmaIstegi = false;
    this.vurguluNesne = null;
    this.sehirRenkleri = null;
    this.hedefDenge = state.denge;
    this.kapiTakTakTimer = null;
    // Sahne tekrar başlatıldığında (Tekrar oyna) eski Graphics referansları
    // "truthy" kalmasın: _cizCatiPanelleri/_cizYapilar null kontrolü yapıyor.
    this.catiTemel = null;
    this.catiEkPaneller = [];
    this.catiPaneller = [];
    this.yalitimKat = null;
    this.bariyerDekor = null;
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
      sol: 'A', sag: 'D', solOk: 'LEFT', sagOk: 'RIGHT', kos: 'SHIFT',
    });
    // E tuşu olay olarak dinlenir: düşük FPS'te kısa basışlar da kaçmaz
    this.etkilesimIstegi = false;
    const etkilesimTusu = () => { this.etkilesimIstegi = true; };
    const konusmaTusu = () => { this.konusmaIstegi = true; };
    this.input.keyboard.on('keydown-E', etkilesimTusu);
    this.input.keyboard.on('keydown-T', konusmaTusu);

    this.ipucu = this.add
      .text(0, 0, '', {
        fontFamily: '"Nunito Sans", sans-serif', fontSize: '13px', color: '#eee5cd',
        padding: { x: 10, y: 6 }, wordWrap: { width: 310 },
      })
      .setOrigin(0.5, 1).setDepth(50).setVisible(false);
    this.ipucuZemini = this.add.graphics().setDepth(49).setVisible(false);

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
    this.sakinGuncelle();
    this.gorselUygula();
    this.npcNoktalariGoster();
    const iptal = abone((s) => this.gorselGuncelle(s));

    this.events.once('shutdown', () => {
      iptal();
      this.input.keyboard.off('keydown-E', etkilesimTusu);
      this.input.keyboard.off('keydown-T', konusmaTusu);
      window.removeEventListener('oyun:eylemYapildi', this.dinleyiciler.eylem);
      window.removeEventListener('oyun:ziyaretciKabul', this.dinleyiciler.ziyaretci);
      window.removeEventListener('oyun:gunBasligi', this.dinleyiciler.gunBasligi);
      this.kapiTakTakDurdur();
      if (this.lambaTitremeTimer) this.lambaTitremeTimer.remove();
      for (const s of this.sakinler || []) this.sakinRutinDurdur(s);
    });
  }

  oyuncuOlustur() {
    this.oyuncu = this.olcekle(this.add.sprite(220, ZEMIN_Y, 'oyuncu').setOrigin(0.5, 1).setDepth(10), 'oyuncu');
    this.oyuncuMesgulBitis = 0; // 'oyuncu-calis' bir kez oynarken bekle/yürü araya girmesin
    this.yurume = 0;

    // Kapıda biri varken kapının üstünde zıplayan işaret
    const kapi = this.nesneler.find((n) => n.def.tip === 'kapi');
    this.kapiIsaret = this.add
      .text(kapi.sprite.x, kapi.sprite.y - this.gorunurY(kapi.sprite) - 30, '!', {
        fontFamily: '"Nunito Sans", sans-serif', fontSize: '34px', fontStyle: 'bold', color: '#ffd23f',
        stroke: '#3a2a10', strokeThickness: 6,
      })
      .setOrigin(0.5, 1).setDepth(20).setVisible(false);
    this.tweens.add({ targets: this.kapiIsaret, y: '-=10', duration: 450, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.sakinler = [];
  }

  oyuncuDurdur(simdi = performance.now()) {
    const p = this.oyuncu;
    if (!p) return;
    p.y = ZEMIN_Y;
    p.anims.timeScale = 1;
    this.yurumeTozSayac = 0;
    if (simdi < this.oyuncuMesgulBitis) return;
    if (!this.animOynat(p, 'oyuncu-bekle')) this.animDurdur(p, 'oyuncu');
  }

  update() {
    // Kendi saatimizle delta: düşük FPS'li bilgisayarlarda da hız sabit kalır
    const simdi = performance.now();
    const dt = Math.min(100, simdi - (this.sonZaman ?? simdi));
    this.sonZaman = simdi;

    const eBasildi = this.etkilesimIstegi;
    const tBasildi = this.konusmaIstegi;
    this.konusmaIstegi = false;
    this.etkilesimIstegi = false; // her karede tüketilir (panel açıkken basılan E birikmez)
    this.sakinAnimGuncelle(dt); // pencere açıkken de sakinler yürümeye devam eder
    if (ui.acikMi() || this.gecisVar || state.bitti) {
      this.ipucu.setVisible(false);
      this.ipucuZemini.setVisible(false);
      this.oyuncuDurdur(simdi); // pencere açıkken yürüme animasyonu/zıplama sürmesin
      return;
    }

    const T = this.tuslar;
    let yon = 0;
    if (T.sol.isDown || T.solOk.isDown) yon -= 1;
    if (T.sag.isDown || T.sagOk.isDown) yon += 1;

    const p = this.oyuncu;
    p.x = Phaser.Math.Clamp(p.x + (yon * HIZ * (T.kos.isDown ? KOSU_CARPANI : 1) * dt) / 1000, 40, this.dunyaG - 40);
    const mesgul = simdi < this.oyuncuMesgulBitis && yon === 0;
    if (yon !== 0) {
      p.anims.timeScale = T.kos.isDown ? KOSU_CARPANI : 1;
      p.setFlipX(yon < 0);
      this.yurume += dt;
      // Yürüme animasyonu varsa onu oynat; yoksa sabit görsel + kodla zıplama
      if (this.animOynat(p, 'oyuncu-yuru')) {
        p.y = ZEMIN_Y;
      } else {
        this.animDurdur(p, 'oyuncu');
        p.y = ZEMIN_Y - Math.abs(Math.sin(this.yurume * 0.014)) * 5;
      }
      // Her ~220ms'de bir ayak altında küçük bir toz pufu + adım sesi
      this.yurumeTozSayac += dt;
      if (this.yurumeTozSayac > (T.kos.isDown ? 140 : 220)) {
        this.yurumeTozSayac = 0;
        this.ayakTozu.emitParticleAt(p.x - yon * 8, ZEMIN_Y - 2, 2);
        sesCal('ses-adim', { ses: 0.3 });
      }
    } else {
      p.anims.timeScale = 1;
      p.y = ZEMIN_Y;
      this.yurumeTozSayac = 0;
      if (!mesgul && !this.animOynat(p, 'oyuncu-bekle')) this.animDurdur(p, 'oyuncu');
    }

    // En yakın etkileşimli nesne
    let enYakin = null;
    // Ölçeklenmiş genişlik hesaba katılır: geniş nesnede (yatak) kenara yaklaşmak yeter
    let min = Infinity;
    for (const n of this.nesneler) {
      const d = Math.abs(n.sprite.x - p.x);
      const kenar = Math.max(0, d - n.sprite.displayWidth / 2);
      if (kenar < ETKILESIM_MESAFE && d < min) { min = d; enYakin = n; }
    }

    // Tek geçiş: geçici dizi ve sıralama yok; eşit mesafede ilk sakin korunur.
    let yakinSakin = null;
    let sakinMesafesi = ETKILESIM_MESAFE;
    for (const s of this.sakinler) {
      if (!s.sprite.visible || !s.sprite.active) continue;
      const mesafe = Math.abs(s.sprite.x - p.x);
      if (mesafe < sakinMesafesi) { sakinMesafesi = mesafe; yakinSakin = s; }
    }
    const vurgulu = enYakin && !(yakinSakin && sakinMesafesi < min) ? enYakin : null;
    if (this.vurguluNesne !== vurgulu) {
      this.vurguluNesne?.sprite.clearTint();
      vurgulu?.sprite.setTint(0xfff7c2);
      this.vurguluNesne = vurgulu;
    }

    if (yakinSakin && (tBasildi || ((!enYakin || sakinMesafesi < min) && eBasildi))) {
      ui.sakinleKonus(yakinSakin.uid); return;
    }
    if (yakinSakin && (!enYakin || sakinMesafesi < min)) {
      const s = yakinSakin;
      this.ipucu.setText(`[E] ${sakinTanimi(s.id).ad} ile konuş`)
        .setPosition(s.sprite.x, s.sprite.y - this.gorunurY(s.sprite) - 10).setVisible(true);
      const gorunum = this.cameras.main.worldView, yari = this.ipucu.width / 2;
      this.ipucu.x = Phaser.Math.Clamp(this.ipucu.x, gorunum.left + yari + 8, gorunum.right - yari - 8);
      this.etiketZeminiCiz(this.ipucuZemini, this.ipucu, 0.88); this.ipucuZemini.setVisible(true);
      return;
    }
    if (enYakin) {
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
        .setText(`[E] ${metin}${yakinSakin ? ' · [T] Konuş' : ''}`)
        .setPosition(enYakin.sprite.x, enYakin.sprite.y - this.gorunurY(enYakin.sprite) - 10)
        .setVisible(true);
      // Kenardaki nesnelerde ipucunun metni ekran dışına taşmasın.
      const gorunum = this.cameras.main.worldView;
      const yari = this.ipucu.width / 2;
      this.ipucu.x = Phaser.Math.Clamp(this.ipucu.x, gorunum.left + yari + 8, gorunum.right - yari - 8);
      this.etiketZeminiCiz(this.ipucuZemini, this.ipucu, 0.88);
      this.ipucuZemini.setVisible(true);
      if (eBasildi) this.etkilesim(enYakin.def);
    } else {
      this.ipucu.setVisible(false);
      this.ipucuZemini.setVisible(false);
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
        sesCal('ses-radyo-ac');
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

// Phaser sahne yöntemleri this bağlamını korur; sistemler sahneyi import etmez.
Object.assign(GameScene.prototype, yerTutucular, dokular, animasyonlar, dunya, sakinler, efektler);
