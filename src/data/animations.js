// =============================================================
//  ANİMASYONLAR (görsel asset sisteminin kardeşi, bkz. assets.js)
//  Kareler public/assets/anim/<animasyon>-<kare>.png adıyla konur:
//    oyuncu-yuru-1.png, oyuncu-yuru-2.png, ... oyuncu-yuru-6.png
//  Bir animasyonun TÜM kareleri varsa kurulur ve oynar; tek kare bile
//  eksikse animasyon kurulmaz, nesne bugünkü gibi sabit görselle kalır.
//  Önce yalnızca 1. kare denenir; o yoksa diğerleri hiç istenmez.
//
//  kare   : kaç kare gerekiyor (1..kare)
//  fps    : saniyedeki kare
//  dongu  : true = sürekli döner, false = bir kez oynar
//  sahip  : hangi asset'in hedef yüksekliğine ölçeklenir (assets.js anahtarı)
//  ne     : ne zaman oynar (liste ve PROJECT_LOG için açıklama)
// =============================================================

export const ANIMASYONLAR = {
  'oyuncu-bekle': { kare: 4, fps: 4,  dongu: true,  sahip: 'oyuncu', ne: 'Oyuncu dururken (nefes alma)' },
  'oyuncu-yuru':  { kare: 6, fps: 10, dongu: true,  sahip: 'oyuncu', ne: 'Oyuncu yürürken (varsa kodla zıplama kapanır)' },
  'oyuncu-calis': { kare: 4, fps: 8,  dongu: false, sahip: 'oyuncu', ne: 'Oyuncu bir panelle etkileşince (bir kez)' },

  'sakin-1-bekle': { kare: 2, fps: 2, dongu: true, sahip: 'sakin0', ne: 'Sakin 1 dururken' },
  'sakin-1-yuru':  { kare: 4, fps: 8, dongu: true, sahip: 'sakin0', ne: 'Sakin 1 yürürken' },
  'sakin-2-bekle': { kare: 2, fps: 2, dongu: true, sahip: 'sakin1', ne: 'Sakin 2 dururken' },
  'sakin-2-yuru':  { kare: 4, fps: 8, dongu: true, sahip: 'sakin1', ne: 'Sakin 2 yürürken' },
  'sakin-3-bekle': { kare: 2, fps: 2, dongu: true, sahip: 'sakin2', ne: 'Sakin 3 dururken' },
  'sakin-3-yuru':  { kare: 4, fps: 8, dongu: true, sahip: 'sakin2', ne: 'Sakin 3 yürürken' },
  'sakin-4-bekle': { kare: 2, fps: 2, dongu: true, sahip: 'sakin3', ne: 'Sakin 4 dururken' },
  'sakin-4-yuru':  { kare: 4, fps: 8, dongu: true, sahip: 'sakin3', ne: 'Sakin 4 yürürken' },

  'kapi-ac':     { kare: 4, fps: 10, dongu: false, sahip: 'kapi',  ne: 'Ziyaretçi içeri alınınca kapı açılır (bir kez)' },
  'panel-calis': { kare: 3, fps: 6,  dongu: true,  sahip: 'panel', ne: 'Genel panel (panel.png) kullanan makinede operatör varken ekran/ışıklar yanıp söner' },
  // Odaya özel paneller kendi animasyonunu kullanır (yoksa sabit kalır, üstündeki ışık durumu gösterir)
  'panel-enerji-calis': { kare: 3, fps: 6, dongu: true, sahip: 'panel-enerji', ne: 'Enerji paneli çalışırken (ekran/ışıklar)' },
  'panel-su-calis':     { kare: 3, fps: 6, dongu: true, sahip: 'panel-su', ne: 'Su arıtma paneli çalışırken' },
  'panel-sera-calis':   { kare: 3, fps: 6, dongu: true, sahip: 'panel-sera', ne: 'Sera paneli çalışırken' },
  'panel-geri-calis':   { kare: 3, fps: 6, dongu: true, sahip: 'panel-geriDonusum', ne: 'Geri dönüşüm paneli çalışırken' },
};

export const ANIM_KLASOR = 'anim/';
export const animKareAnahtari = (ad, n) => `anim:${ad}-${n}`;
export const animKareDosyasi = (ad, n) => `${ANIM_KLASOR}${ad}-${n}.png`;
