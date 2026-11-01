// =============================================================
//  ARAŞTIRMALAR (GDD bölüm 6)
//  Aynı anda tek proje araştırılır; puan sakinlerin "Araştırma"
//  görevinden ve Görev Panosu'ndaki masa başı araştırmadan gelir.
//  Seviye I (batarya, grisu) oyun başında seçilebilir; Seviye II
//  (turbin, hidroponik, filtre) `onKosul` ile açılır — Seviye I'den
//  en az biri biterse açılır (GDD: "ilk oyunda tüm dalları açmak
//  hedeflenmez"; önce temel, sonra ileri teknoloji).
//
//  maliyet   : tamamlanması için gereken araştırma puanı
//  geceEtki  : açıldıktan sonra HER GECE eklenen değişim
//  onKosul   : state'e göre proje seçilebilir mi (dönüş: boolean)
//  bilgi     : facts.js'teki "Biliyor muydun?" anahtarı
//  Batarya mantığı state.js → geceHesapla() içinde (BATARYA_KAPASITE).
// =============================================================

export const BATARYA_KAPASITE = 30;   // depoda tutulabilecek en fazla enerji
export const BATARYA_SARJ_ESIGI = 80; // gece bu değerin üstündeki enerji depoya aktarılır

const seviyeII = (state) => state.arastirma.acik.length >= 1;

export const ARASTIRMALAR = {
  // --- Seviye I: temel ---
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
  // --- Seviye II: ileri (Seviye I'den en az biri bitince açılır) ---
  turbin: {
    ad: 'Verimli Türbin',
    ikon: '🌬️',
    maliyet: 12,
    aciklama: 'Rüzgar türbini bakım ve kanat profili yenilenir: her gece +4 enerji.',
    geceEtki: { enerji: +4 },
    onKosul: seviyeII,
    bilgi: 'ruzgar',
  },
  hidroponik: {
    ad: 'Hidroponik Tarım',
    ikon: '🥬',
    maliyet: 12,
    aciklama: 'Kapalı döngü su ile dikey ekim: her gece +3 gıda, −1 su (toplam su daha verimli).',
    geceEtki: { gida: +3, su: -1 },
    onKosul: seviyeII,
    bilgi: 'sulama',
  },
  havaFiltresi: {
    ad: 'Hava Filtresi',
    ikon: '🫁',
    maliyet: 12,
    aciklama: 'Partikül ve CO₂ filtresi: her gece −3 karbon. Toz fırtınasında da panelleri korur.',
    geceEtki: { karbon: -3 },
    onKosul: seviyeII,
    bilgi: 'ruzgar',
  },
};

// Oyuncunun şu an seçebileceği (açık olmayan ve açılma koşulu sağlanan) projeler
export function seciliebilirArastirmalar(state) {
  return Object.entries(ARASTIRMALAR)
    .filter(([id, p]) => !state.arastirma.acik.includes(id) && (!p.onKosul || p.onKosul(state)))
    .map(([id]) => id);
}

// Makine dışı görevler. Makine görevleri panels.js → makine alanından gelir.
// Her makinede en fazla 1 operatör olur; laboratuvara sınırsız kişi gidebilir.
export const GOREVLER = {
  arastirma: { ad: 'Laboratuvar', ikon: '🧪', puan: 2 },
  bosta:     { ad: 'Dinlen',      ikon: '💤' },
};
export const OYUNCU_CALISMA_MALIYETI = 1; // boş makinede kendin çalışmak: eylem hakkı

export const MASA_ARASTIRMA = { ad: 'Masa başında araştır', puan: 2, maliyet: 1 };
