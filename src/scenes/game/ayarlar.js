import { ODA_GENISLIK, ZEMIN_Y } from '../../data/rooms.js';

export const HIZ = 240;
export const KOSU_CARPANI = 1.65;
export const SAKIN_HIZI = 85;
export const ETKILESIM_MESAFE = 30; // oyuncu ile nesnenin KENARI arasındaki yatay mesafe (px)

export const EKRAN_G = 960;   // oyun dünyası koordinatlarında ekran boyutu (değişmez)
export const EKRAN_Y = 540;
// Çizim ölçeği: oyun 1920×1080 tuvale kamera zoom'uyla çizilir. Koordinatlar
// 960×540 kalır, görseller ve yazılar 2 kat net görünür (main.js de bunu kullanır).
export const CIZIM_OLCEGI = 2;
// Zoom'da ekrana sabit/paralaks katmanların kayması: (tuval - tuval/zoom) / 2
export const SABIT_X = (EKRAN_G * CIZIM_OLCEGI - EKRAN_G) / 2;
export const SABIT_Y = (EKRAN_Y * CIZIM_OLCEGI - EKRAN_Y) / 2;
// Yüklenen büyük görseller oyundaki boyutlarının bu katına yüksek kaliteyle küçültülür
// (WebGL'in 15-25 kat küçültmede yaptığı tırtıklanmayı önler)
export const DOKU_PAYI = 1.5;

export const OK = ODA_GENISLIK / 640;
export const DUMAN_KONUMU = {
  enerji: { odaIndex: 1, x: 146 * OK, y: ZEMIN_Y - 100 },
  geriDonusum: { odaIndex: 4, x: 520 * OK, y: ZEMIN_Y - 70 },
};
