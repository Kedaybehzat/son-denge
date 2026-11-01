import test from 'node:test';
import assert from 'node:assert/strict';

let sira = 0;
async function kur(kapali = false) {
  const sesler = [], zamanlar = new Map(), dinleyiciler = new Map(), depo = new Map();
  if (kapali) depo.set('sondenge:ses', 'kapali');
  let id = 0;
  class SahteAudio {
    constructor(src) { Object.assign(this, { src, paused: true, muted: false, volume: 1, istekler: [], olaylar: new Map() }); sesler.push(this); }
    play() {
      this.paused = false;
      return new Promise((resolve, reject) => this.istekler.push({
        resolve: () => { this.paused = false; resolve(); }, reject,
      }));
    }
    pause() { this.paused = true; }
    addEventListener(ad, fn) { this.olaylar.set(ad, fn); }
  }
  globalThis.Audio = SahteAudio;
  globalThis.localStorage = { getItem: (ad) => depo.get(ad), setItem: (ad, v) => depo.set(ad, v) };
  globalThis.window = { addEventListener: (ad, fn) => dinleyiciler.set(ad, fn) };
  globalThis.setTimeout = (fn) => { zamanlar.set(++id, fn); return id; };
  globalThis.clearTimeout = (id) => zamanlar.delete(id);
  const api = await import(`../src/sesler.js?test=${++sira}`);
  const coz = async () => { await Promise.resolve(); await Promise.resolve(); };
  const ilerle = () => { for (let i=0; zamanlar.size && i<100; i++) for (const [id, fn] of [...zamanlar]) { zamanlar.delete(id); fn(); } };
  return { ...api, sesler, zamanlar, dinleyiciler, depo, coz, ilerle };
}

// Asenkron play sonuçları ve fade süreleri gerçek yarış sırasıyla denetlenir.
test('Ses yöneticisi regresyonları', async (t) => {
  const eski = Object.fromEntries(['Audio','window','localStorage','setTimeout','clearTimeout'].map(k => [k, globalThis[k]]));
  t.after(() => { for (const [k,v] of Object.entries(eski)) { if (v === undefined) delete globalThis[k]; else globalThis[k] = v; } });

  await t.test('Parça değişimi eski play yanıtını ve fade zamanlayıcısını geçersiz kılar', async () => {
    const s = await kur();
    s.muzikCal('ana'); const a = s.sesler[0];
    s.muzikCal('gece'); const b = s.sesler[1];
    assert.equal(a.paused, true);
    a.istekler[0].resolve(); b.istekler[0].resolve(); await s.coz(); s.ilerle();
    assert.equal(a.paused, true); assert.equal(a.muted, true); assert.equal(a.volume, 0);
    assert.equal(b.paused, false); assert.equal(b.volume, 0.55 * 0.7);
    s.muzikCal('gece'); assert.equal(s.sesler.length, 2);
    s.muzikCal('umut'); assert.equal(b.paused, true);
    s.muzikDurdur(); assert.equal(s.zamanlar.size, 0);
  });

  await t.test('Müzik ve efekt seviyeleri ayrı uygulanır ve saklanır', async () => {
    const s = await kur();
    assert.equal(s.muzikSeviyesi(), 0.7); assert.equal(s.efektSeviyesi(), 0.8);
    s.muzikCal('ana'); const a = s.sesler[0];
    a.istekler[0].resolve(); await s.coz(); s.ilerle();
    s.muzikSeviyeAyarla(0.4); assert.equal(a.volume, 0.55 * 0.4);
    s.efektSeviyeAyarla(0.25); s.sesCal('klik', { ses: 0.8 });
    assert.equal(s.sesler[1].volume, 0.2);
    assert.equal(s.depo.get('sondenge:ses-muzik'), '0.4');
    assert.equal(s.depo.get('sondenge:ses-efekt'), '0.25');
    s.sesToggle(); s.muzikSeviyeAyarla(1); assert.equal(a.volume, 0);
  });

  await t.test('Tekrarlanan efektler yeniden kullanılır, eşzamanlı ses sayısı sınırlanır', async () => {
    const s = await kur();
    for (let i = 0; i < 20; i++) s.sesCal('adim');
    assert.equal(s.sesler.length, 3, 'Aynı efekt en çok üç kanal açmalı');
    const a = s.sesler[0];
    a.istekler[0].resolve(); await s.coz();
    a.olaylar.get('ended')(); a.currentTime = 0.1;
    for (let i = 0; i < 100; i++) {
      s.sesCal('adim');
      assert.equal(a.currentTime, 0);
      a.istekler.at(-1).resolve(); await s.coz(); a.olaylar.get('ended')();
    }
    assert.equal(s.sesler.length, 3, 'Yüz adım yeni Audio nesnesi üretmemeli');
    s.sesCal('kapi'); assert.equal(s.sesler.length, 4, 'Farklı efekt ayrı havuz kullanmalı');
  });

  await t.test('Havuzdaki eski play yanıtı yeniden kullanılan sesi susturmaz', async () => {
    const s = await kur(); s.sesCal('adim'); const a = s.sesler[0];
    s.sesToggle(); s.sesToggle(); s.sesCal('adim');
    assert.equal(s.sesler.length, 1);
    a.istekler[1].resolve(); await s.coz();
    a.istekler[0].reject({ name: 'AbortError' }); await s.coz();
    assert.equal(a.paused, false); assert.equal(a.muted, false);
    s.sesToggle(); assert.equal(a.paused, true); assert.equal(a.muted, true);
  });

  await t.test('Kapatma fade içindeki müziği ve tüm efektleri anında susturur', async () => {
    const s = await kur();
    s.muzikCal('ana'); s.sesCal('kapi');
    s.sesler[0].istekler[0].resolve(); await s.coz();
    assert.ok(s.zamanlar.size);
    assert.equal(s.sesToggle(), false);
    assert.equal(s.zamanlar.size, 0);
    s.sesler[1].istekler[0].resolve(); await s.coz(); s.ilerle();
    for (const a of s.sesler) { assert.equal(a.paused, true); assert.equal(a.muted, true); }
    assert.equal(s.depo.get('sondenge:ses'), 'kapali');
  });

  await t.test('Kapalıyken son seçilen parça açılışta tek başına döner; eski efekt dönmez', async () => {
    const s = await kur(true);
    s.muzikCal('ana'); s.muzikCal('umut'); s.sesCal('kapi');
    assert.equal(s.sesler.length, 2);
    assert.equal(s.sesler[1].istekler.length, 0);
    s.sesToggle(); const b=s.sesler[1]; b.istekler[0].resolve(); await s.coz();
    assert.equal(s.sesler[0].paused, true); assert.equal(b.paused, false);
    s.sesToggle(); s.muzikDurdur(); s.sesToggle();
    assert.equal(b.paused, true);
  });

  await t.test('Autoplay engeli yalnız son aktif parçayı yeniden dener', async () => {
    const s = await kur();
    s.muzikCal('ana'); const a=s.sesler[0];
    a.istekler[0].reject({ name: 'NotAllowedError' }); await s.coz();
    s.muzikCal('gece'); const b=s.sesler[1];
    b.istekler[0].reject({ name: 'NotAllowedError' }); await s.coz();
    s.dinleyiciler.get('pointerdown')();
    assert.equal(a.istekler.length, 1); assert.equal(b.istekler.length, 2);
    s.sesToggle(); b.istekler[1].resolve(); await s.coz();
    assert.equal(b.paused, true); assert.equal(b.muted, true);
    s.dinleyiciler.get('keydown')(); assert.equal(b.istekler.length, 2);
  });

  await t.test('Hızlı aç/kapat ve gecikmiş play sonuçları eski fade başlatmaz', async () => {
    const s = await kur(); s.muzikCal('ana'); const a=s.sesler[0];
    s.sesToggle(); s.sesToggle();
    a.istekler[1].resolve(); await s.coz();
    a.istekler[0].resolve(); await s.coz();
    assert.equal(s.zamanlar.size, 1);
    s.sesToggle(); s.ilerle(); assert.equal(a.paused, true); assert.equal(a.volume, 0);
  });
});
