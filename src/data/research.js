// =============================================================
//  ARAŞTIRMALAR (GDD bölüm 6, Faz 1 dar kapsam)
//  Aynı anda tek proje araştırılır; puan sakinlerin "Araştırma"
//  görevinden ve Görev Panosu'ndaki masa başı araştırmadan gelir.
//
//  maliyet   : tamamlanması için gereken araştırma puanı
//  geceEtki  : açıldıktan sonra HER GECE eklenen değişim
//  bilgi     : facts.js'teki "Biliyor muydun?" anahtarı
//  Batarya mantığı state.js → geceHesapla() içinde (BATARYA_KAPASITE).
// =============================================================

export const BATARYA_KAPASITE = 30;   // depoda tutulabilecek en fazla enerji
export const BATARYA_SARJ_ESIGI = 80; // gece bu değerin üstündeki enerji depoya aktarılır

export const ARASTIRMALAR = {
  batarya: {
    ad: 'Batarya Deposu',
    ikon: '🔋',
    maliyet: 8,
    aciklama: `Gece ${BATARYA_SARJ_ESIGI}'in üstündeki fazla enerjiyi depolar (en çok ${BATARYA_KAPASITE}). Gece enerji açığı önce depodan karşılanır.`,
    bilgi: 'batarya',
  },
  grisu: {
    ad: 'Gri Su Geri Kazanımı',
    ikon: '♻️',
    maliyet: 8,
    aciklama: 'Lavabo ve duş suyu arıtılıp yeniden kullanılır: her gece +4 su.',
    geceEtki: { su: +4 },
    bilgi: 'grisu',
  },
};

// Makine dışı görevler. Makine görevleri panels.js → makine alanından gelir.
// Her makinede en fazla 1 operatör olur; laboratuvara sınırsız kişi gidebilir.
export const GOREVLER = {
  arastirma: { ad: 'Laboratuvar', ikon: '🧪', puan: 2 },
  bosta:     { ad: 'Dinlen',      ikon: '💤' },
};
export const OYUNCU_CALISMA_MALIYETI = 1; // boş makinede kendin çalışmak: eylem hakkı

export const MASA_ARASTIRMA = { ad: 'Masa başında araştır', puan: 2, maliyet: 1 };
