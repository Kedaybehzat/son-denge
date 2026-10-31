// =============================================================
//  KAPIYA GELEN ZİYARETÇİLER
//  2. günden itibaren her sabah biri kapıyı çalar (havuzdan rastgele).
//
//  kisi         : kaç kişi (her biri her gece su ve gıda tüketir)
//  katkiMetni   : kartta "Getirdikleri" olarak görünür
//  anlik        : kabul edilince hemen uygulanan değişim
//  gunlukKatki  : kabul edildikten sonra HER GECE eklenen değişim
//  eylemArtisi  : kalıcı ek günlük eylem hakkı
//  insanlik     : kabul edince insanlık puanına eklenir
//  retCeza      : geri çevirince insanlık puanından düşer
// =============================================================

export const ZIYARETCILER = [
  {
    id: 'muhendis',
    ad: 'Deniz, mühendis',
    ikon: '🛠️',
    kisi: 1,
    metin: 'Kuzeydeki enerji santralinde çalışıyormuş. Santral sel altında kalınca günlerce yürüyerek yola çıkmış.',
    katkiMetni: 'Her gün +1 eylem hakkı',
    eylemArtisi: 1,
    insanlik: 10,
    retCeza: 15,
  },
  {
    id: 'ciftci',
    ad: 'Hasan ve kızı Elif',
    ikon: '🌱',
    kisi: 2,
    metin: 'Kuraklık tarlalarını kurutmuş. Yanlarında bir avuç tohumdan başka bir şey yok.',
    katkiMetni: 'Seraya yardım: her gece +5 gıda',
    gunlukKatki: { gida: +5 },
    insanlik: 12,
    retCeza: 18,
  },
  {
    id: 'bilim',
    ad: 'Dr. Leyla',
    ikon: '🔬',
    kisi: 1,
    metin: 'Büyük Sessizlik\'ten önce iklim araştırmacısıymış. Çantası hava filtresi çizimleriyle dolu.',
    katkiMetni: 'Hava filtresi: her gece −4 karbon',
    gunlukKatki: { karbon: -4 },
    insanlik: 10,
    retCeza: 15,
  },
  {
    id: 'cocuklar',
    ad: 'Mert ve Ada',
    ikon: '🧒',
    kisi: 2,
    metin: 'İki kardeş. Ailelerini salgında kaybetmişler, haftalardır yalnız yürüyorlar.',
    katkiMetni: 'Hiçbir şey getirmiyorlar. Sadece bir gelecek.',
    insanlik: 20,
    retCeza: 25,
  },
  {
    id: 'tamirci',
    ad: 'Kemal, tamirci',
    ikon: '🔧',
    kisi: 1,
    metin: 'Sırtında koca bir alet çantası var. Bozuk ne varsa onarabileceğini söylüyor.',
    katkiMetni: 'Hemen +10 enerji, her gece −4 atık',
    anlik: { enerji: +10 },
    gunlukKatki: { atik: -4 },
    insanlik: 10,
    retCeza: 15,
  },
  {
    id: 'kafile',
    ad: 'Sahil kasabasından bir aile',
    ikon: '🌊',
    kisi: 4,
    metin: 'Yükselen deniz evlerini yutmuş. Dört kişiler, çok yorgunlar ama çalışmaya hazırlar.',
    katkiMetni: 'Her gece +3 gıda, +3 su',
    gunlukKatki: { gida: +3, su: +3 },
    insanlik: 15,
    retCeza: 22,
  },
];
