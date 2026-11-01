// Haritadaki pin dışı şehir alanlarını ve kapalı sefer geri bildirimini denetler.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
export async function kesifTiklamaKontrol() {
 const require=createRequire(import.meta.url);
 const {chromium}=require(process.env.PLAYWRIGHT_CORE_PATH || 'playwright');
 const dir=process.env.KONTROL_CIKTI || '/tmp/son-denge-kesif';await fs.mkdir(dir,{recursive:true});
 const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined,headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try {
  const p=await b.newPage({viewport:{width:1440,height:900}});const hatalar=[];p.on('pageerror',e=>hatalar.push(e.message));
  await p.goto(process.env.KONTROL_URL || 'http://127.0.0.1:5173');
  await p.waitForFunction(()=>window.oyun?.scene?.getScene('Game')?.sakinler?.length);
  await p.locator('[data-gec]').click();await p.locator('[data-basla]').click();await p.locator('[data-secim="atla"]').click();await p.locator('.radyo-kart [data-kapat]').click();
  await p.evaluate(()=>window.kontrolModulu=yol=>import(performance.getEntriesByType('resource').find(r=>new URL(r.name).pathname===yol)?.name || yol));
  const ac=()=>p.evaluate(async()=>(await window.kontrolModulu('/src/ui/ui.js')).panoAc('kesif'));
  const noktalar=await p.evaluate(async()=>(await window.kontrolModulu('/src/data/exploration.js')).KESIF_NOKTALARI);
  for(const ekran of [{width:1440,height:900},{width:960,height:540}]) {
   await p.setViewportSize(ekran);await ac();
   for(const [id,n] of Object.entries(noktalar)) {
    for(const kisim of ['sehir','pin','etiket','tekrar']) {
     const pin=p.locator(`[data-kesif="${id}"]`);
     if(kisim==='sehir') {const r=await pin.boundingBox();await p.mouse.click(r.x+r.width*.12,r.y+r.height*.15);}
     else if(kisim==='pin') {const r=await pin.locator('.y-pin-ikon').boundingBox();await p.mouse.click(r.x+r.width/2,r.y+r.height/2);}
     else {const r=await pin.locator('.y-pin-ad').boundingBox();await p.mouse.click(r.x+r.width/2,r.y+r.height/2);}
     assert.equal(await p.locator(`[data-kesif="${id}"]`).getAttribute('aria-pressed'),'true',`${id} ${kisim} seçilmeli`);
     assert.ok((await p.locator('.y-kesif-detay h3').textContent()).includes(n.ad));
    }
   }
  }
  await p.setViewportSize({width:1440,height:900});await ac();
  await p.locator('[data-kesif="komsu"]').click();await p.locator('[data-gonder]').first().click();
  await p.locator('[data-kesif="sehir"]').click();
  assert.match(await p.locator('.y-kesif-engel').textContent(),/sefer sürüyor/);
  assert.equal(await p.locator('[data-gonder]').count(),0);
  await p.evaluate(async()=>{const st=await window.kontrolModulu('/src/state.js');st.testDegistir(s=>{s.sefer=null;s.kesfedilenler=['santral'];s.gun=5;});});
  await ac();await p.locator('[data-kesif="santral"]').click();assert.match(await p.locator('.y-kesif-engel').textContent(),/daha önce/);
  await p.locator('[data-kesif="sehir"]').click();assert.match(await p.locator('.y-kesif-engel').textContent(),/oyun bitmeden/);
  await p.screenshot({path:path.join(dir,'kesif-erisim.png'),animations:'disabled'});
  assert.deepEqual(hatalar,[]);console.log('Keşif: iki boyutta dört şehir alanı/pin/etiket/tekrar seçimi, aktif/gidilmiş/geç sefer gerekçeleri başarılı.');
 } finally {await b.close();}
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) await kesifTiklamaKontrol();
