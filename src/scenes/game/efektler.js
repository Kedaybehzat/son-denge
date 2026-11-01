// Görsel geri bildirim, atmosfer ve gün geçişi.
// Yöntemler GameScene üzerinde çalışır; Phaser yaşam döngüsünü sahne yönetir.
import Phaser from 'phaser';
import { ODA_GENISLIK } from '../../data/rooms.js';
import { state, KAYNAKLAR } from '../../state.js';
import * as ui from '../../ui/ui.js';
import { muzikCal } from '../../sesler.js';
import { EKRAN_G, EKRAN_Y, DUMAN_KONUMU } from './ayarlar.js';

function renkGecis(kotu, iyi, t) {
  const C = Phaser.Display.Color;
  const c = C.Interpolate.ColorWithColor(C.ValueToColor(kotu), C.ValueToColor(iyi), 100, Math.round(t * 100));
  return C.GetColor(c.r, c.g, c.b);
}

export const efektler = {
  panelSpritesi(anahtar) {
    return this.nesneler.find((n) => n.def.tip === 'panel' && n.def.panel === anahtar)?.sprite;
  },

  kapiSpritesi() {
    return this.nesneler.find((n) => n.def.tip === 'kapi')?.sprite;
  },

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
        fontFamily: '"Nunito Sans", sans-serif',
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
  },

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
  },

  efektEylem({ panel, etki, kirli }) {
    const sprite = this.panelSpritesi(panel);
    if (sprite) this.suzülenEtkiler(sprite, etki);
    if (kirli) this.kirliEfekt(panel);
  },

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
        fontFamily: '"Nunito Sans", sans-serif',
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
  },

  // Ekran ortasında "GÜN N" + olay başlığı; sonra bitince() çağrılır
  gunBasligiGoster(gun, olayAd, bitince) {
    const cx = EKRAN_G / 2;
    const cy = EKRAN_Y / 2;
    const buyuk = this.add.text(cx, cy - 20, `GÜN ${gun}`, {
      fontFamily: '"Barlow Condensed", sans-serif',
      fontSize: '110px',
      color: '#eaffd4',
      stroke: '#0a140f', strokeThickness: 6,
    }).setOrigin(0.5).setDepth(60).setAlpha(0);
    this.ekranaSabitle(buyuk, 0);
    const kucuk = this.add.text(cx, cy + 58, olayAd || '', {
      fontFamily: '"Nunito Sans", sans-serif',
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
  },

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
  },

  kapiTakTakDurdur() {
    if (this.kapiTakTakTimer) {
      this.kapiTakTakTimer.remove();
      this.kapiTakTakTimer = null;
    }
    const sprite = this.kapiSpritesi();
    if (sprite) sprite.setAngle(0);
  },

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
  },

  lambaTitremeDurdur() {
    if (this.lambaTitremeTimer) {
      this.lambaTitremeTimer.remove();
      this.lambaTitremeTimer = null;
    }
  },

  //  ÜTOPYA <-> DİSTOPYA GÖRSEL DÖNÜŞÜMÜ
  gorselGuncelle(s) {
    this.makineAnimGuncelle();
    this._cizCatiPanelleri();
    this._cizYapilar();
    this.sakinGuncelle();
    if (this.hedefDenge !== s.denge) {
      this.hedefDenge = s.denge;
      this.tweens.killTweensOf(this.gorsel);
      this.tweens.add({
        targets: this.gorsel, d: s.denge, duration: 1200, ease: 'Sine.easeInOut',
        onUpdate: () => this.gorselUygula(),
      });
    }
    this.gorselUygula();
  },

  gorselUygula() {
    // 1 = ütopya, 0 = distopya. 30 altı tamamen karanlık, 80 üstü tamamen aydınlık.
    const t = Phaser.Math.Clamp((this.gorsel.d - 30) / 50, 0, 1);
    const k = state.kaynak;

    // Oyun içi müzik: histerezis ile eşiğin üstünde salınım yok.
    // Gerilime düşmek için eşikler daha sert, umut'a dönmek için daha yüksek.
    // Modal açıkken (gece raporu vs.) oradaki müziği bozmayalım.
    if (!state.bitti && !ui.acikMi()) {
      const dusuk = (state.memnuniyet != null && state.memnuniyet < 30) || state.denge < 25;
      const yuksek = (state.memnuniyet == null || state.memnuniyet > 40) && state.denge > 35;
      if (dusuk) muzikCal('muzik-gerilim');
      else if (yuksek) muzikCal('muzik-umut');
      // Arada (ne dusuk ne yuksek) kalınca mevcut müzik aynen devam eder.
    }

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
  },

  etiketZeminiCiz(zemin, yazi, opaklik) {
    const { x, y, width, height } = yazi.getBounds();
    // Kamera hareketi dünya koordinatlarını değiştirmez; yalnız kutu değişince çiz.
    const onceki = zemin.etiketKutusu;
    if (onceki && onceki.x === x && onceki.y === y && onceki.width === width && onceki.height === height && onceki.opaklik === opaklik) return;
    zemin.etiketKutusu = { x, y, width, height, opaklik };
    zemin.clear();
    zemin.fillStyle(0x263125, opaklik);
    zemin.fillRoundedRect(x, y, width, height, 4);
    zemin.lineStyle(1, 0xc5bc96, 0.28);
    zemin.strokeRoundedRect(x + 0.5, y + 0.5, width - 1, height - 1, 4);
  },
};
