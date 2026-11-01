// Prolog regresyonları: 3 gün, bölünmüş kurucu gelişi, rehberli konsol, gece tüketimi,
// Gün 1'e devir ve rehberli oynanışın normal başlangıca yakın bitmesi.
import assert from 'node:assert/strict';
import { state, sifirla, rastgeleAyarla, eylemYap, kendinCalisabilirMi, bakimYapabilirMi, prologAktif, prologGunTamam, prologTamam,
  prologKapidakiKurucu, prologKapiyaGel, prologKarsila, prologBitir, prologBekleyenPanel, prologPanelOgren, prologPanoGor,
  prologPanoSirasi, prologGecesi, prologGunHedefi, prologRehberEylemi, makineOperatoru, AYAR } from '../src/state.js';
import { PANELLER } from '../src/data/panels.js';
import { KURUCULAR } from '../src/data/visitors.js';
import { PROLOG_GUNLER, PROLOG_REHBER, PROLOG_KURUCULAR, PROLOG_AYAR } from '../src/data/prolog.js';

rastgeleAyarla(() => 0.4);
sifirla();
const normal = structuredClone(state);
assert.equal(prologAktif(), false, 'Prologu atlayan oyun doğrudan Gün 1');

// Veri tutarlılığı
assert.equal(PROLOG_GUNLER.reduce((t, g) => t + g.gelen, 0), KURUCULAR.length, 'Tüm kurucular prologda gelir');
for (const [id, p] of Object.entries(PANELLER)) {
  assert.ok(PROLOG_REHBER[id]?.length, `${id} için konsol rehberi olmalı`);
  assert.equal(p.konsol.moduller.length, p.eylemler.length, `${id} konsol kontrolleri eylemlerle eşleşmeli`);
  for (const a of PROLOG_REHBER[id]) if (a.tur === 'eylem') assert.ok(p.eylemler[a.i], `${id} rehber eylemi geçerli olmalı`);
}
for (const k of KURUCULAR) assert.ok(PROLOG_KURUCULAR[k.id]?.ders, `${k.id} için ders olmalı`);

// Rehberli oynanış: her kurucu gelir, rehberdeki eylem yapılır, panel öğrenilir
function rehberliOyna() {
  sifirla({ prolog: true });
  assert.equal(state.gun, 0);
  assert.equal(state.sakinler.length, 0);
  assert.deepEqual(state.kaynak, PROLOG_AYAR.baslangic);
  for (const id of Object.keys(PANELLER)) assert.equal(kendinCalisabilirMi(id), false, 'Prologda boş makinede kendin çalışılamaz');
  for (let gun = 1; gun <= PROLOG_GUNLER.length; gun++) {
    assert.equal(state.prolog.gun, gun);
    assert.equal(state.eylem, PROLOG_GUNLER[gun - 1].eylem);
    assert.equal(prologGunTamam(), false);
    while (state.prolog.sira < prologGunHedefi()) {
      assert.equal(prologKapiyaGel(), true);
      assert.equal(prologKapiyaGel(), false, 'Kapıda aynı anda tek kişi');
      const k = prologKapidakiKurucu();
      assert.equal(k.id, KURUCULAR[state.prolog.sira].id, 'Kurucular sırayla gelir');
      prologKarsila();
      assert.equal(makineOperatoru(k.varsayilan)?.id, k.id);
      assert.equal(prologBekleyenPanel(), k.varsayilan);
      assert.equal(prologKapiyaGel(), false, 'Konsol öğrenilmeden sıradaki gelmez');
      for (const a of PROLOG_REHBER[k.varsayilan]) if (a.tur === 'eylem') { prologRehberEylemi(); assert.ok(eylemYap(PANELLER[k.varsayilan].eylemler[a.i])); }
      assert.equal(prologPanelOgren(k.varsayilan), true);
    }
    assert.equal(prologKapiyaGel(), false, 'Günün kotası dolunca kimse gelmez');
    if (PROLOG_GUNLER[gun - 1].pano) {
      assert.equal(prologGunTamam(), false, 'Pano turu görülmeden son gün bitmez');
      assert.equal(prologPanoSirasi(), true);
      assert.equal(prologPanoGor(), true);
    } else assert.equal(prologPanoGor(), false);
    assert.equal(prologGunTamam(), true);
    assert.equal(bakimYapabilirMi('enerji'), false, 'Prologda bakım yok');
    const r = prologGecesi();
    assert.equal(r.bitti, gun === PROLOG_GUNLER.length);
  }
}
rehberliOyna();
assert.equal(prologAktif(), false);
assert.equal(state.gun, 1);
assert.equal(state.eylem, AYAR.eylemHakki);
assert.deepEqual(state.sakinler, normal.sakinler, 'Gün 1 ekibi normal başlangıçla aynı (uid eşleşmesi korunur)');
for (const [ad, v] of Object.entries(normal.kaynak)) assert.ok(Math.abs(state.kaynak[ad] - v) <= 6, `Rehberli prolog sonrası ${ad} normal başlangıca yakın (${state.kaynak[ad]} ~ ${v})`);
assert.ok(Math.abs(state.malzeme - normal.malzeme) <= 2, `Malzeme normal başlangıca yakın (${state.malzeme})`);
console.log('  Rehberli prolog sonrası Gün 1:', JSON.stringify(state.kaynak), 'malzeme', state.malzeme);

// Atlamak her aşamada normal Gün 1 başlangıcına götürür
sifirla({ prolog: true });
prologKapiyaGel(); prologKarsila();
assert.equal(prologBitir(), true);
assert.deepEqual(state.kaynak, normal.kaynak);
assert.deepEqual(state.sakinler, normal.sakinler);
assert.equal(prologTamam(), false);
console.log('Prolog kontrolleri başarılı: 3 gün, bölünmüş geliş, konsol rehberi, gece tüketimi, Gün 1 devri ve atlama.');
