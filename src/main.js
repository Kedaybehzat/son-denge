import Phaser from 'phaser';
import GameScene, { CIZIM_OLCEGI } from './scenes/GameScene.js';
import { sifirla, state } from './state.js';
import * as ui from './ui/ui.js';
import { muzikCal } from './sesler.js';
import './style.css';

sifirla();
ui.hudKur();

// Ana menü müziği (autoplay engeli ilk tıklamada çözülür)
muzikCal('muzik-ana');

// Tam ekran: F tuşuyla ya da ayarlar menüsünden çağrılır. Browser native
// Fullscreen API — Esc ile çıkış tarayıcı tarafından halledilir.
const sahneKok = document.getElementById('sahne');
export function tamEkranToggle() {
  if (!document.fullscreenElement) sahneKok?.requestFullscreen?.().catch(() => {});
  else document.exitFullscreen?.();
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'f' || e.key === 'F') {
    e.preventDefault();
    tamEkranToggle();
  }
});
window.tamEkranToggle = tamEkranToggle;

// Canvas yazıları oluşturulmadan önce yerel fontlar hazır olsun.
await Promise.all([
  document.fonts.load('400 16px "Nunito Sans"'),
  document.fonts.load('700 16px "Nunito Sans"'),
  document.fonts.load('700 24px "Barlow Condensed"'),
]);

// window.oyun: tarayıcı konsolundan hata ayıklamak için
window.oyun = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'oyun',
  // Dünya 960×540 koordinatlı; tuval CIZIM_OLCEGI kat büyük, kamera zoom'la çizer (netlik)
  width: 960 * CIZIM_OLCEGI,
  height: 540 * CIZIM_OLCEGI,
  backgroundColor: '#0a0814',
  // 120/144/240 Hz ekranlarda gereksiz render yükü oluşturma.
  fps: { target: 60, limit: 60 },
  // 2× tuval netliği korur; ikinci MSAA geçişi gereksiz GPU yüküdür.
  render: { powerPreference: 'high-performance', antialias: true, antialiasGL: false },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [GameScene],
});

window.addEventListener('oyun:kayitYuklendi', (e) => {
  const sahne = window.oyun.scene.getScene('Game');
  sahne.events.once('create', () => e.detail.onBitti());
  sahne.scene.restart();
});

ui.girisHikayesi(() => ui.baslangicEkrani(() => ui.oyunuBaslat()));
