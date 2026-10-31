import Phaser from 'phaser';
import GameScene, { CIZIM_OLCEGI } from './scenes/GameScene.js';
import { sifirla, state } from './state.js';
import * as ui from './ui/ui.js';
import './style.css';

sifirla();
ui.hudKur();

// window.oyun: tarayıcı konsolundan hata ayıklamak için
window.oyun = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'oyun',
  // Dünya 960×540 koordinatlı; tuval CIZIM_OLCEGI kat büyük, kamera zoom'la çizer (netlik)
  width: 960 * CIZIM_OLCEGI,
  height: 540 * CIZIM_OLCEGI,
  backgroundColor: '#0a0814',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [GameScene],
});

ui.girisHikayesi(() => ui.baslangicEkrani(() => {
  ui.gunBasligi(state.gun, state.olay.baslik, () => ui.olayGoster(state.olay));
}));
