// =============================================================
//  public/assets/ içinde gerçekten bulunan dosyalar (vite.config.js
//  → assetListesi eklentisi üretir). Yalnızca tarayıcı kodu kullanır;
//  Node'da çalışan tools/ scriptleri bunu içe aktarmamalı.
// =============================================================
import liste from 'virtual:asset-listesi';

const VAR = new Set(liste);
// dosya: public/assets/'e göre yol, ör. 'kapi.png', 'anim/oyuncu-yuru-1.png'
export const assetVar = (dosya) => VAR.has(dosya);
