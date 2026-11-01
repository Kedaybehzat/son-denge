// NPC eşleme, oda rutinleri ve hareket animasyonu.
// Yöntemler GameScene üzerinde çalışır; Phaser yaşam döngüsünü sahne yönetir.
import Phaser from 'phaser';
import { ODALAR, ODA_GENISLIK, ZEMIN_Y } from '../../data/rooms.js';
import { SAKIN_AKTIVITELERI, sakinOdaTipi } from '../../data/activities.js';
import { sakinGorselTanimi } from '../../data/assets.js';
import { state, MAKINELER, YAPILAR } from '../../state.js';
import { SAKIN_HIZI, OK } from './ayarlar.js';

export const sakinler = {
  // Sakin sprite'ı, görevine göre makinesinin / panonun yanında durur.
  // Oyuncu nüfusa sayılmaz; state.sakinler kaynak dizidir (uid ile eşlenir).
  panoSpritesi() {
    return this.nesneler.find((n) => n.def.tip === 'pano')?.sprite;
  },

  sakinKonumu(gorev, sira) {
    // Makine görevi: panelin iki yanına dizilir
    if (gorev && MAKINELER[gorev]) {
      const sprite = this.panelSpritesi(gorev);
      if (sprite) return sprite.x + (sira % 2 === 0 ? -62 : 62);
    }
    if (gorev === 'insaat' && state.insaat) {
      const oda = ODALAR.findIndex((o) => o.tip === YAPILAR[state.insaat.id].oda);
      return Math.max(0, oda) * ODA_GENISLIK + ODA_GENISLIK * 0.5;
    }
    // Laboratuvar: panonun yanı (birden çok kişi yan yana)
    if (gorev === 'arastirma') {
      const pano = this.panoSpritesi();
      if (pano) return pano.x - 70 - (sira % 3) * 26;
    }
    // Bosta ya da çalışmıyor (çocuklar): yaşam alanı ortası
    return 320 * OK + ((sira % 4) - 1.5) * 40;
  },

  sakinRutinDurdur(s) {
    s.wander?.remove(); s.wander = null;
    s.bekleme?.remove(); s.bekleme = null;
    s.isTween?.remove(); s.isTween = null;
    if (s.isEfekti) { this.tweens.killTweensOf(s.isEfekti); s.isEfekti.destroy(); } s.isEfekti = null;
    s.isYazisi?.destroy(); s.isYazisi = null;
    s.calisma = null;
    this.tweens.killTweensOf(s.sprite);
    s.sprite.setAngle(0).setY(ZEMIN_Y);
  },

  sakinOdaBilgisi(s) {
    const tip = sakinOdaTipi(s.gorev, YAPILAR[state.insaat?.id]?.oda);
    const index = ODALAR.findIndex((o) => o.tip === tip);
    return { tip, index, sol: index * ODA_GENISLIK, sag: (index + 1) * ODA_GENISLIK };
  },

  sakinIdleBaslat(s) {
    if (!s.sprite.active || !s.sprite.visible || s.gorev === 'kesif') return;
    this.sakinRutinDurdur(s);
    s.bekleme = this.time.delayedCall(Phaser.Math.Between(800, 1800), () => {
      if (!s.sprite.active || !s.sprite.visible) return;
      const oda = this.sakinOdaBilgisi(s);
      const noktalar = SAKIN_AKTIVITELERI[oda.tip] || [];
      // Bazen odanın boş alanında dolaşır; diğer zamanlarda farklı bir iş noktasına gider.
      if (noktalar.length && Math.random() < 0.75) {
        s.noktaSirasi = ((s.noktaSirasi ?? s.uid) + 1) % noktalar.length;
        this.sakinNoktayaGit(s, noktalar[s.noktaSirasi]);
      } else {
        const x = Phaser.Math.FloatBetween(oda.sol + 40, oda.sag - 40);
        this.sakinTasi(s, x);
      }
    });
  },

  sakinNoktayaGit(s, nokta) {
    const oda = this.sakinOdaBilgisi(s);
    const yer = this.odaYerlesimi[oda.tip];
    const hedef = yer ? yer.nokta(nokta.x, nokta.y) : { x: oda.sol + nokta.x * ODA_GENISLIK, y: ZEMIN_Y - 70 };
    const x = Phaser.Math.Clamp(hedef.x - 16 + (s.uid % 3) * 10, oda.sol + 30, oda.sag - 30);
    this.sakinTasi(s, x, { ...nokta, hedef });
  },

  sakinTasi(s, yeniX, is = null) {
    this.sakinRutinDurdur(s);
    s.hedefX = yeniX;
    s.sprite.setFlipX(yeniX < s.sprite.x);
    s.wander = this.tweens.add({
      targets: s.sprite, x: yeniX,
      duration: Math.max(180, Math.abs(yeniX - s.sprite.x) / SAKIN_HIZI * 1000), ease: 'Linear',
      onComplete: () => is ? this.sakinIsBaslat(s, is) : this.sakinIdleBaslat(s),
    });
  },

  sakinIsBaslat(s, is) {
    if (!s.sprite.active || !s.sprite.visible) return;
    this.sakinRutinDurdur(s);
    s.calisma = is;
    s.sprite.setFlipX(is.hedef.x < s.sprite.x);
    // Yeni karakter kareleri yokken kişiyi değiştirmeyen hafif eğilme/uzanma.
    const egilme = is.tur === 'sula' ? 7 : is.tur === 'onar' ? 4 : 2;
    s.isTween = this.tweens.add({ targets: s.sprite, angle: (s.sprite.flipX ? -1 : 1) * egilme,
      duration: 550, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    s.isYazisi = this.add.text(s.sprite.x, s.sprite.y - this.gorunurY(s.sprite) - 8, is.ad, {
      fontFamily: '"Nunito Sans", sans-serif', fontSize: '10px', color: '#e4dcc1',
      backgroundColor: '#263125aa', padding: { x: 5, y: 3 },
    }).setOrigin(0.5, 1).setDepth(8).setAlpha(0.8);
    s.isEfekti = this.add.graphics().setDepth(7);
    if (is.tur === 'sula') {
      s.isEfekti.fillStyle(0x82b9c7, 0.7);
      for (let i = 0; i < 3; i++) s.isEfekti.fillEllipse(is.hedef.x + i * 4, is.hedef.y + i * 3, 2, 4);
    } else if (is.tur === 'onar') {
      s.isEfekti.lineStyle(1.2, 0xd9bc70, 0.65);
      s.isEfekti.lineBetween(is.hedef.x - 3, is.hedef.y, is.hedef.x + 3, is.hedef.y);
      s.isEfekti.lineBetween(is.hedef.x, is.hedef.y - 3, is.hedef.x, is.hedef.y + 3);
    }
    this.tweens.add({ targets: s.isEfekti, alpha: 0.2, y: is.tur === 'sula' ? 8 : 0, duration: 700, yoyo: true, repeat: -1 });
    s.bekleme = this.time.delayedCall(Phaser.Math.Between(2600, 4200), () => this.sakinIdleBaslat(s));
  },

  npcNoktalariGoster() {
    if (!new URLSearchParams(location.search).has('npcNoktalar')) return;
    const g = this.add.graphics().setDepth(40);
    for (const [tip, noktalar] of Object.entries(SAKIN_AKTIVITELERI)) {
      const yer = this.odaYerlesimi[tip];
      if (!yer) continue;
      for (const n of noktalar) {
        const p = yer.nokta(n.x, n.y), b = n.bolge;
        const a = yer.nokta(b[0], b[1]), z = yer.nokta(b[2], b[3]);
        g.lineStyle(1, 0xb9d78b, 0.65).strokeRect(a.x, a.y, z.x-a.x, z.y-a.y);
        g.fillStyle(0xe3be6c, 0.9).fillCircle(p.x, p.y, 3);
        this.add.text(p.x, p.y - 8, n.id, { fontFamily: '"Nunito Sans", sans-serif', fontSize: '9px', color: '#fff2d3', backgroundColor: '#17291fcc' }).setOrigin(0.5,1).setDepth(41);
      }
    }
  },

  // Sakin hareket ediyorsa yürü, duruyorsa bekle animasyonu (varsa)
  sakinAnimGuncelle(dt = 16.67) {
    for (const s of this.sakinler || []) {
      if (!s.sprite.active) continue;
      const hiz = Math.abs(s.sprite.x - (s.oncekiX ?? s.sprite.x)) * 1000 / Math.max(dt, 1);
      const hareket = hiz > 8;
      s.oncekiX = s.sprite.x;
      if (s.ozelDoku) continue; // karaktere özel görselde genel animasyon yok
      const ad = `sakin-${(s.tip ?? 0) + 1}-${hareket ? 'yuru' : 'bekle'}`;
      if (!this.animOynat(s.sprite, ad)) this.animDurdur(s.sprite, 'sakin' + (s.tip ?? 0));
      s.sprite.anims.timeScale = hareket ? Phaser.Math.Clamp(hiz / SAKIN_HIZI, 0.6, 1.4) : 1;
    }
  },

  sakinGuncelle() {
    const kaynak = state.sakinler || [];
    const kaynakKimlikleri = new Set(kaynak.map(s => s.uid));
    const sahnedekiler = new Map(this.sakinler.map(s => [s.uid, s]));
    // Ayrılan (yorgunluktan giden) sakinlerin figürü solup kaybolur
    for (const eski of this.sakinler.filter(s => !kaynakKimlikleri.has(s.uid))) {
      this.sakinRutinDurdur(eski);
      this.tweens.add({ targets: eski.sprite, alpha: 0, y: eski.sprite.y - 20, duration: 600, onComplete: () => eski.sprite.destroy() });
      this.sakinler.splice(this.sakinler.indexOf(eski), 1);
    }
    kaynak.forEach((kaynakSakin, i) => {
      const hedefX = this.sakinKonumu(kaynakSakin.gorev, i);
      const varOlan = sahnedekiler.get(kaynakSakin.uid);
      if (varOlan) {
        if (varOlan.gorev !== kaynakSakin.gorev) {
          varOlan.gorev = kaynakSakin.gorev;
          if (kaynakSakin.gorev === 'kesif') this.sakinRutinDurdur(varOlan);
          else this.sakinTasi(varOlan, hedefX);
        }
        // Keşifteki sakin sığınakta görünmez
        varOlan.sprite.setVisible(kaynakSakin.gorev !== 'kesif');
      } else {
        const gorsel = sakinGorselTanimi(kaynakSakin.id, (dosya) => this.gercekAsset(dosya.replace('.png', '')));
        // Karaktere özel görsel varsa o, yoksa sırayla genel sakin-1..4
        const ozel = 'sakin-' + kaynakSakin.id;
        const sakinDoku = gorsel.anahtar;
        // Gün 0'da gelen kurucu kapıdan girip çalışma odasına yürür
        const kapi = state.gun === 0 ? this.kapiSpritesi() : null;
        const baslangicX = kapi ? kapi.x : hedefX;
        const sprite = this.olcekle(this.add.sprite(baslangicX, ZEMIN_Y - 55, sakinDoku)
          .setOrigin(0.5, 1).setDepth(5).setAlpha(0), sakinDoku);
        sprite.setVisible(kaynakSakin.gorev !== 'kesif');
        const yeni = { uid: kaynakSakin.uid, id: kaynakSakin.id, gorev: kaynakSakin.gorev, sprite, hedefX, wander: null, tip: gorsel.tip, oncekiX: baslangicX,
          doku: sakinDoku, ozelDoku: sakinDoku === ozel };
        this.tweens.add({ targets: sprite, alpha: 1, duration: 350 });
        this.tweens.add({
          targets: sprite, y: ZEMIN_Y, duration: 720, ease: 'Bounce.easeOut',
          onComplete: () => (kapi ? this.sakinTasi(yeni, hedefX) : this.sakinIdleBaslat(yeni)),
        });
        this.sakinler.push(yeni);
      }
    });
  },
};
