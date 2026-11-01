// Kare yükleme, animasyon kurma ve oynatma.
// Yöntemler GameScene üzerinde çalışır; Phaser yaşam döngüsünü sahne yönetir.
import { ASSETLER } from '../../data/assets.js';
import { assetVar } from '../../assetListesi.js';
import { ANIMASYONLAR, animKareAnahtari, animKareDosyasi } from '../../data/animations.js';
import { MAKINELER, makineCalisiyorMu, makineKapali } from '../../state.js';
import { CIZIM_OLCEGI, DOKU_PAYI } from './ayarlar.js';
import { ICERIK_KUTULARI } from './dokuOnbellegi.js';

export const animasyonlar = {
  //  ANİMASYONLAR (src/data/animations.js)
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
  },

  // Animasyon varsa oynatır (zaten oynuyorsa dokunmaz), yoksa false döner
  animOynat(sprite, ad) {
    if (!this.anims.exists(ad)) return false;
    if (sprite.anims.isPlaying && sprite.anims.currentAnim?.key === ad) return true;
    sprite.play(ad);
    this.olcekle(sprite, ANIMASYONLAR[ad].sahip, this.animKutusu(ad));
    return true;
  },

  // Animasyonu durdurup sabit görsele döner
  animDurdur(sprite, statik, sahip = statik) {
    if (sprite.anims?.isPlaying) sprite.stop();
    if (sprite.texture.key !== statik) {
      sprite.setTexture(statik);
      this.olcekle(sprite, sahip);
    }
  },

  // Operatörü olan makinenin paneli "çalışıyor" animasyonu oynatır, boş olan durur
  // Odaya özel panelde kendi animasyonu (panel-<oda>-calis), genel panelde panel-calis.
  // Genel animasyon odaya özel panelin yerine geçmez (tasarımı kaybolmasın).
  // Ayrıca panelin üstünde durum ışığı: çalışıyorsa yanıp sönen yeşil, boşsa kırmızı.
  makineAnimGuncelle() {
    for (const n of this.nesneler || []) {
      if (n.def.tip !== 'panel' || !MAKINELER[n.def.panel]) continue;
      const calisiyor = makineCalisiyorMu(n.def.panel) && !makineKapali(n.def.panel);
      const ozelAnim = n.statik === 'panel' ? 'panel-calis' : n.statik.replace('panel-geriDonusum', 'panel-geri') + '-calis';
      // Birleşik oda sprite'ı görünmez: boşa animasyon oynatmak yerine
      // çizilmiş panelin gerçek LED noktasındaki ışık durumunu güncelle.
      if (!(calisiyor && !n.sprite.gorseldeCizili && this.animOynat(n.sprite, ozelAnim))) this.animDurdur(n.sprite, n.statik, n.statik);
      const oda = this.odaYerlesimi[n.def.panel === 'geriDonusum' ? 'geri' : n.def.panel];
      const led = n.def.calismaIsigi;
      const nokta = oda && led ? oda.nokta(...led) : { x: n.sprite.x, y: n.sprite.y - this.gorunurY(n.sprite) - 7 };
      if (!n.isik) {
        n.isik = this.add.circle(nokta.x, nokta.y, oda && led ? 2.2 : 4, 0x52e3a4).setDepth(4);
        n.isikTween = this.tweens.add({ targets: n.isik, alpha: 0.35, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
      n.isik.setFillStyle(calisiyor ? 0x52e3a4 : 0xe85d4a);
      if (calisiyor) n.isikTween.resume(); else { n.isikTween.pause(); n.isik.setAlpha(1); }
    }
  },
};
