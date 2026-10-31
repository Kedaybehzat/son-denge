import Phaser from 'phaser';
import GameScene from './scenes/GameScene.js';
import { sifirla, state } from './state.js';
import * as ui from './ui/ui.js';
import './style.css';

sifirla();
ui.hudKur();

// window.oyun: tarayıcı konsolundan hata ayıklamak için
window.oyun = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'oyun',
  width: 960,
  height: 540,
  backgroundColor: '#0a0814',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [GameScene],
});

ui.girisHikayesi(() => ui.baslangicEkrani(() => ui.olayGoster(state.olay)));
