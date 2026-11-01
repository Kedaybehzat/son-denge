// İsteğe bağlı tarayıcı kontrolü; npm test'e dahil değildir.
// PLAYWRIGHT_CORE_PATH ve CHROMIUM_PATH ile mevcut yerel kurulum kullanılabilir.
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

export async function canliKontrol() {
  const require = createRequire(import.meta.url);
  const { chromium } = require(process.env.PLAYWRIGHT_CORE_PATH || 'playwright');
  const cikti = process.env.KONTROL_CIKTI || '/tmp/son-denge-canli';
  await fs.mkdir(cikti, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    headless: true,
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const hatalar = [];
  const bagla = (page) => {
    page.on('pageerror', (e) => hatalar.push(e.message));
    page.on('response', (r) => { if (r.status() >= 400) hatalar.push(`${r.status()} ${r.url()}`); });
  };
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    bagla(page);
    const url = process.env.KONTROL_URL || 'http://127.0.0.1:5173';
    await page.goto(url);
    await page.waitForFunction(() => window.oyun?.scene?.getScene('Game')?.anims?.exists('sakin-can-yuru'));
    // Vite HMR sonrası UI/state singleton'ının aynı sürümünü kullan.
    await page.evaluate(() => {
      window.kontrolModulu = (yol) => {
        const kaynak = performance.getEntriesByType('resource').find((r) => new URL(r.name).pathname === yol);
        return import(kaynak?.name || yol);
      };
    });
    await page.locator('[data-gec]').click();
    assert.ok((await page.locator('.oyun-logo').getAttribute('src')).endsWith('logo-apoclimate.png'));
    await page.screenshot({path:path.join(cikti,'menu-logo.png'),animations:'disabled'});
    await page.locator('[data-basla]').click();
    await page.locator('[data-secim="atla"]').click();
    await page.locator('.radyo-kart [data-kapat]').click();

    // Gerçek Phaser döngüsünde bütün yürüme kareleri ve görünen ayak tabanı.
    const animasyon = await page.evaluate(async () => {
      const s = window.oyun.scene.getScene('Game');
      s.sakinler.forEach((n) => s.sakinRutinDurdur(n));
      const can = s.sakinler.find((n) => n.id === 'can');
      s.oyuncu.x = can.sprite.x - 100;
      s.sakinTasi(can, can.sprite.x - 350);
      const basla = performance.now();
      let son = basla;
      const kareler = [], sureler = [];
      return new Promise((resolve) => {
        const oku = () => {
          const simdi = performance.now();
          const p = can.sprite;
          const k = s.icerikKutusu(p.texture.key);
          sureler.push(simdi - son); son = simdi;
          if (p.anims.currentAnim?.key === 'sakin-can-yuru') kareler.push({
            kare: p.texture.key, x: p.x, taban: p.y + (k.alt - p.originY * p.frame.height) * p.scaleY,
            hizCarpani: p.anims.timeScale,
          });
          if (simdi - basla < 3200) requestAnimationFrame(oku);
          else resolve({ kareler, sureler });
        };
        requestAnimationFrame(oku);
      });
    });
    assert.equal(new Set(animasyon.kareler.map((k) => k.kare)).size, 4, 'Dört yürüme karesi görünmeli');
    const tabanlar = animasyon.kareler.map((k) => k.taban);
    const tabanFarki = Math.max(...tabanlar) - Math.min(...tabanlar);
    assert.ok(tabanFarki < 1, `Ayak tabanı kayması: ${tabanFarki} px`);

    const konum = () => page.evaluate(() => window.oyun.scene.getScene('Game').oyuncu.x);
    const x0 = await konum();
    await page.locator('canvas').click({position:{x:50,y:200}});
    await page.keyboard.down('d');
    await page.waitForFunction((x) => window.oyun.scene.getScene('Game').oyuncu.x > x + 80, x0);
    await page.keyboard.up('d');
    const ac = async (id) => page.evaluate(async (id) => {
      const ui = await window.kontrolModulu('/src/ui/ui.js');
      const { PANELLER } = await import('/src/data/panels.js');
      ui.panelAc(PANELLER[id], id);
    }, id);
    const durum = () => page.evaluate(async () => {
      const { state } = await window.kontrolModulu('/src/state.js');
      return { enerji: state.kaynak.enerji, eylem: state.eylem, mod: state.makineModlari.enerji };
    });
    await ac('enerji');
    const once = await durum();
    await page.locator('[data-i="0"]').hover();
    assert.deepEqual(await durum(), once, 'Önizleme kaynak harcamamalı');
    await page.locator('[data-i="0"]').click();
    const sonra = await durum();
    assert.equal(sonra.enerji, once.enerji + 20);
    assert.equal(sonra.eylem, once.eylem - 1);
    await page.locator('[data-mod="tasarruf"]').click();
    assert.equal((await durum()).mod, 'tasarruf');
    const sabitX = await konum();
    await page.keyboard.down('d'); await page.waitForTimeout(300); await page.keyboard.up('d');
    assert.equal(await konum(), sabitX, 'Panel açıkken oyuncu yürümemeli');

    const yerlesimler = [];
    for (const viewport of [{ width: 1440, height: 900 }, { width: 960, height: 540 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      for (const id of ['enerji', 'su', 'sera', 'geriDonusum']) {
        await ac(id);
        await page.waitForTimeout(150);
        assert.equal(await page.locator('.konsol-parcali').count(), 1);
        const r = await page.locator('.konsol-parcali').boundingBox();
        assert.ok(r.x >= 0 && r.y >= 0 && r.x + r.width <= viewport.width + 1 && r.y + r.height <= viewport.height + 1, `${id} ${viewport.width} pencere dışına taştı: ${JSON.stringify(r)}`);
        const tasma = await page.locator('.konsol-parcali').evaluate((e) => e.scrollWidth > e.clientWidth + 1);
        assert.equal(tasma, false, `${id} yatay taşma`);
        yerlesimler.push({ ekran: viewport, id, kutu: r });
        await page.screenshot({ path: path.join(cikti, `konsol-${id}-${viewport.width}.png`), animations: 'disabled' });
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.konsol-parcali').isVisible(), false, 'Esc kapatmalı');
      }
    }
    // Yönetim: ortak parçalar, canlı sekmeler ve gerçek durum değişimleri.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(async () => (await window.kontrolModulu('/src/ui/ui.js')).panoAc('koloni'));
    const bolumler = ['koloni', 'odalar', 'kesif', 'arastirma', 'insaat', 'hedefler'];
    for (const ekran of [{ width: 1440, height: 900 }, { width: 960, height: 540 }]) {
      await page.setViewportSize(ekran);
      for (const id of bolumler) {
        await page.locator(`[data-bolum="${id}"]`).click();
        assert.equal(await page.locator('.yonetim-parcali .pano-gecis button[aria-pressed="true"]').textContent(), { koloni: 'Koloni', odalar: 'Odalar', kesif: 'Keşif', arastirma: 'Araştırma', insaat: 'İnşaat', hedefler: 'Hedefler' }[id]);
        await page.waitForFunction(() => [...document.querySelectorAll('#modal img')].every(i=>i.complete && i.naturalWidth>0));
        if (id === 'kesif') assert.equal(await page.locator('.y-pin img').count(), 4, 'Dört harita pini görseli yüklenmeli');
        await page.screenshot({ path: path.join(cikti, `yonetim-${id}-${ekran.width}.png`), animations: 'disabled' });
        const r = await page.locator('.yonetim-parcali').boundingBox();
        assert.ok(r.x >= 0 && r.y >= 0 && r.x+r.width <= ekran.width+1 && r.y+r.height <= ekran.height+1, `Yönetim ${id} dış taşma: ${JSON.stringify(r)}`);
      }
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.locator('[data-bolum="koloni"]').click();
    const uid = await page.locator('.y-sakin[data-sakin]').first().getAttribute('data-sakin');
    await page.locator(`.y-sakin[data-sakin="${uid}"]`).click();
    await page.locator('.y-sutun[data-yer="arastirma"]').click();
    assert.equal(await page.evaluate(async (uid) => (await window.kontrolModulu('/src/state.js')).state.sakinler.find(s=>s.uid===Number(uid)).gorev, uid), 'arastirma');
    await page.locator('[data-bolum="arastirma"]').click();
    await page.locator('[data-proje="grisu"]').click();
    assert.equal(await page.evaluate(async () => (await window.kontrolModulu('/src/state.js')).state.arastirma.aktif), 'grisu');
    await page.locator('[data-bolum="insaat"]').click();
    await page.locator('[data-yapi="yalitim"]').click();
    assert.equal(await page.evaluate(async () => (await window.kontrolModulu('/src/state.js')).state.insaat?.id), 'yalitim');
    await page.screenshot({ path: path.join(cikti, 'yonetim-insaat-aktif.png'), animations: 'disabled' });
    await page.locator('[data-bolum="kesif"]').click();
    await page.locator('[data-kesif="komsu"]').click();
    await page.locator('[data-gonder]').first().click();
    assert.equal(await page.evaluate(async () => (await window.kontrolModulu('/src/state.js')).state.sefer?.yer), 'komsu');
    await page.screenshot({ path: path.join(cikti, 'yonetim-kesif-aktif.png'), animations: 'disabled' });
    await page.keyboard.press('Escape');

    // Bütün ziyaretçiler gerçek kabul kuralıyla eklenir; her biri özel setini kullanır.
    await page.evaluate(async () => {
      const st=await window.kontrolModulu('/src/state.js');
      const { ZIYARETCILER }=await window.kontrolModulu('/src/data/visitors.js');
      for (const z of ZIYARETCILER) { st.testDegistir(s=>{s.ziyaretci=z;}); st.ziyaretciKabul(); }
      // Önceki keşif kontrolündeki kişiyi diyalog fixture'ına geri getir.
      st.testDegistir(s=>{s.sefer=null;for(const n of s.sakinler)if(n.gorev==='kesif')n.gorev='bosta';});
    });
    await page.waitForFunction(() => window.oyun.scene.getScene('Game').anims.exists('sakin-kafile-yuru'));
    const eslemeler=await page.evaluate(async () => {
      const s=window.oyun.scene.getScene('Game');
      return s.sakinler.map(n=>({id:n.id,ozel:n.ozelDoku,doku:n.doku,uid:n.uid}));
    });
    assert.equal(eslemeler.length,10);
    for (const n of eslemeler) {
      assert.equal(n.ozel,true,`${n.id} özel sprite`);
      assert.equal(n.doku,`sakin-${n.id}`);
      await page.evaluate(async(uid)=>(await window.kontrolModulu('/src/ui/ui.js')).sakinleKonus(uid),n.uid);
      assert.equal(await page.locator('.diyalog-cerceve').count(),2);
      const portre=await page.locator('.diyalog-sag img').getAttribute('src');
      assert.ok(portre.endsWith(`${['selin','burak','nur','can'].includes(n.id)?'kurucu':'ziyaretci'}-${n.id}.png`));
      assert.ok((await page.locator('.diyalog-sol img').getAttribute('src')).endsWith('portre-oyuncu.png'));
      if (n.id==='selin') {
        await page.screenshot({path:path.join(cikti,'diyalog-sakin.png'),animations:'disabled'});
        await page.locator('[data-diyalog-devam]').click();
        await page.locator('[data-diyalog="gorev"]').click();
        assert.equal(await page.locator('.diyalog-sol .konusuyor').count(),1);
        await page.screenshot({path:path.join(cikti,'diyalog-oyuncu.png'),animations:'disabled'});
      }
      await page.keyboard.press('Escape');
    }
    await page.evaluate(async()=>{
      const s=window.oyun.scene.getScene('Game');
      s.sakinler.forEach(n=>{s.sakinRutinDurdur(n);s.sakinTasi(n,n.sprite.x-150)});
    });
    await page.waitForTimeout(500);
    const yanlis=await page.evaluate(()=>window.oyun.scene.getScene('Game').sakinler.filter(n=>n.sprite.anims.currentAnim?.key!==`sakin-${n.id}-yuru`).map(n=>n.id));
    assert.deepEqual(yanlis,[], 'Yürüyen herkes kendi animasyonunu kullanmalı');

    const isiklar = await page.evaluate(async () => {
      const st = await window.kontrolModulu('/src/state.js');
      st.testDegistir(s=>{s.kaynak.enerji=0;});
      const sahne = window.oyun.scene.getScene('Game');
      return sahne.nesneler.filter(n=>n.def.tip==='panel').map(n=>({
        id:n.def.panel, kapali:st.makineKapali(n.def.panel), operator:st.makineCalisiyorMu(n.def.panel),
        renk:n.isik.fillColor, gizliAnim:n.sprite.anims.isPlaying, konum:[n.isik.x,n.isik.y],
        hedef:Object.values(sahne.odaYerlesimi).find(yer=>n.isik.x>=yer.sol && n.isik.x<=yer.sol+yer.W) ? true : false,
      }));
    });
    for (const n of isiklar) {
      assert.equal(n.renk, n.operator && !n.kapali ? 0x52e3a4 : 0xe85d4a, `${n.id} LED durumu`);
      assert.equal(n.gizliAnim, false, `${n.id} gizli sprite animasyonu durmalı`);
      assert.equal(n.hedef, true);
    }

    // Prologda kilitli konsol: eylem çalışmamalı, Kapat erişilebilir kalmalı.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(async () => (await window.kontrolModulu('/src/state.js')).sifirla({ prolog: true }));
    await ac('su');
    assert.equal(await page.locator('.k-kapali-ortu').count(), 1);
    assert.equal(await page.locator('[data-i="0"]').getAttribute('aria-disabled'), 'true');
    assert.equal(await page.locator('.k-kapali-ortu').isVisible(), true);
    await page.screenshot({ path: path.join(cikti, 'konsol-kapali.png'), animations: 'disabled' });
    await page.locator('[data-kapat]').click();

    // Parçalar eksikse mevcut tek-resim tasarımına düşülmeli (dosya silmeden).
    const yedek = await browser.newPage(); bagla(yedek);
    await yedek.route(/\/src\/assetListesi\.js(?:\?|$)/, async (route) => {
      const response = await route.fetch();
      const body = (await response.text()).replace('VAR.has(dosya)', "(!dosya.startsWith('ui-') && VAR.has(dosya))");
      await route.fulfill({ response, body });
    });
    await yedek.goto(url);
    await yedek.waitForFunction(() => window.oyun?.scene?.getScene('Game')?.sakinler?.length);
    await yedek.evaluate(async () => {
      window.kontrolModulu = (yol) => {
        const kaynak = performance.getEntriesByType('resource').find((r) => new URL(r.name).pathname === yol);
        return import(kaynak?.name || yol);
      };
      const ui = await window.kontrolModulu('/src/ui/ui.js'); const { PANELLER } = await import('/src/data/panels.js');
      ui.panelAc(PANELLER.enerji, 'enerji');
    });
    assert.equal(await yedek.locator('.konsol-resimli').count(), 1, 'Parçasız yedek konsol');
    assert.deepEqual(hatalar, [], 'Tarayıcı / HTTP hatası olmamalı');
    const sureler = [...animasyon.sureler].sort((a, b) => a-b);
    const rapor = { tabanFarki, gorulenKare: 4, ornek: sureler.length,
      medyanMs: sureler[Math.floor(sureler.length*0.5)], p95Ms: sureler[Math.floor(sureler.length*0.95)],
      yonetim: bolumler, eslemeler, isiklar, not: 'Headless SwiftShader ölçümü; gerçek GPU FPS performansı olarak yorumlanmamalı.', yerlesimler, hatalar };
    await fs.writeFile(path.join(cikti, 'rapor.json'), JSON.stringify(rapor, null, 2));
    console.log(JSON.stringify(rapor));
  } finally { await browser.close(); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await canliKontrol();
