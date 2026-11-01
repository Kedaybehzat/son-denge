// Gün 0 öğreticisi regresyonları: boş sığınak, sırayla gelen kurucular, Gün 1'e temiz geçiş.
import assert from 'node:assert/strict';
import { state, sifirla, rastgeleAyarla, eylemYapabilirMi, kendinCalisabilirMi, gun0Aktif, gun0Tamam, gun0KapidakiKurucu, gun0KapiyaGel, gun0Karsila, gun0Bitir, gun0EkipTamam, gun0BekleyenPanel, gun0PanelIncele, gun0PanoGor, makineOperatoru, AYAR } from '../src/state.js';
import { PANELLER } from '../src/data/panels.js';
import { KURUCULAR } from '../src/data/visitors.js';
import { GUN0_KURUCULAR } from '../src/data/gun0.js';

rastgeleAyarla(() => 0.4);
sifirla();
const normal = structuredClone(state);
assert.equal(gun0Aktif(), false, 'Eğitimi atlayan oyun doğrudan Gün 1');

sifirla({ gun0: true });
assert.equal(state.gun, 0);
assert.equal(state.sakinler.length, 0, 'Gün 0 sığınak boş başlar');
assert.equal(state.nufus, 0);
assert.equal(state.eylem, 0);
for (const id of Object.keys(PANELLER)) {
  assert.equal(makineOperatoru(id), null);
  assert.equal(kendinCalisabilirMi(id), false, 'Gün 0 makine çalıştırılamaz');
  for (const e of PANELLER[id].eylemler) assert.equal(eylemYapabilirMi(e), false, 'Gün 0 panel eylemi yok');
}
assert.equal(gun0Karsila(), null, 'Kapı çalmadan kimse giremez');
assert.equal(gun0Tamam(), false);

KURUCULAR.forEach((k, i) => {
  assert.ok(GUN0_KURUCULAR[k.id]?.ders, `${k.id} için öğretici metni olmalı`);
  assert.equal(gun0KapiyaGel(), true);
  assert.equal(gun0KapiyaGel(), false, 'Kapıda aynı anda tek kişi');
  assert.equal(gun0KapidakiKurucu().id, k.id, 'Kurucular sırayla gelir');
  gun0Karsila();
  assert.equal(makineOperatoru(k.varsayilan)?.id, k.id, 'Kurucu kendi makinesine yönlendirilir');
  assert.equal(state.nufus, i + 1);
  assert.equal(state.eylem, 0);
  assert.equal(gun0BekleyenPanel(), k.varsayilan, 'Önce yeni gelenin paneli incelenmeli');
  assert.equal(gun0KapiyaGel(), false, 'Panel incelenmeden sıradaki gelmez');
  assert.equal(gun0PanoGor(), false);
  assert.equal(gun0PanelIncele(k.varsayilan), true);
  assert.equal(gun0BekleyenPanel(), null);
});
assert.equal(gun0EkipTamam(), true);
assert.equal(gun0Tamam(), false, 'Pano turu görülmeden Gün 0 bitmez');
assert.equal(gun0PanoGor(), true);
assert.equal(gun0Tamam(), true);
assert.equal(gun0KapiyaGel(), false);

const kaynakOnce = { ...state.kaynak };
assert.equal(gun0Bitir(), true);
assert.equal(state.gun, 1);
assert.equal(state.eylem, AYAR.eylemHakki);
assert.deepEqual(state.kaynak, kaynakOnce, 'Gün 0 kaynakları değiştirmez');
assert.deepEqual(state.sakinler, normal.sakinler, 'Gün 1 ekibi normal başlangıçla aynı (uid eşleşmesi korunur)');
assert.equal(gun0Aktif(), false);

// Eğitimi yarıda atlamak da aynı Gün 1 başlangıcına götürür
sifirla({ gun0: true });
gun0KapiyaGel(); gun0Karsila();
assert.equal(gun0Bitir(), true);
assert.deepEqual(state.sakinler, normal.sakinler);
console.log('Gün 0 kontrolleri başarılı: boş sığınak, kullanılamaz makineler, sıralı kurucular, Gün 1 geçişi.');
