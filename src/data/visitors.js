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
//
//  Traitler ve görevler (GDD bölüm 5):
//  guclu / kosullu : kartta görünen güçlü yön ve koşullu bedel
//  uzman        : uzmanlık yeri: makine anahtarı ('enerji','su','sera','geriDonusum'),
//                 'arastirma' (laboratuvarda 2 kat puan) ya da '*' (her yerde)
//  calisir      : false ise görev atanamaz (çocuklar)
//  ekTuketim    : görevden bağımsız her gece eklenen değişim
//  kosul        : { olay | enerjiAlti, gorev?, carpan?, ek? }
//                 koşul sağlanınca kişinin tüm çıktısı carpan ile çarpılır, ek eklenir
//  gunlukKatki / eylemArtisi yalnızca uzmanlık yerinde çalışırken eklenir
// =============================================================

export const ZIYARETCILER = [
  {
    id: 'muhendis',
    ad: 'Deniz, mühendis',
    ikon: '🛠️',
    kisi: 1,
    metin: 'Kuzeydeki enerji santralinde çalışıyormuş. Santral sel altında kalınca günlerce yürüyerek yola çıkmış.',
    katkiMetni: 'Enerji odasında: her gün +1 eylem hakkı',
    eylemArtisi: 1,
    uzman: 'enerji',
    guclu: 'Enerji odasında çalışırsa her gün +1 eylem hakkı',
    kosullu: 'Ağır iş: her gece fazladan −1 gıda',
    ekTuketim: { gida: -1 },
    insanlik: 10,
    retCeza: 15,
  },
  {
    id: 'ciftci',
    ad: 'Hasan ve kızı Elif',
    ikon: '🌱',
    kisi: 2,
    metin: 'Kuraklık tarlalarını kurutmuş. Yanlarında bir avuç tohumdan başka bir şey yok.',
    katkiMetni: 'Seraya yardım: serada her gece ek +5 gıda',
    gunlukKatki: { gida: +5 },
    uzman: 'sera',
    guclu: 'Serada çalışırsa her gece ek +5 gıda',
    kosullu: 'Kuraklıkta serada fazladan −3 su ister',
    kosul: { olay: 'kurak', gorev: 'sera', ek: { su: -3 } },
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
    uzman: 'arastirma',
    guclu: 'Laboratuvarda 2 kat araştırma ve hava filtresiyle −4 karbon',
    kosullu: 'Aşırı sıcakta verimi yarıya düşer',
    kosul: { olay: 'sicak', carpan: 0.5 },
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
    calisir: false,
    guclu: 'Topluluğun geleceği',
    kosullu: 'Çalışmazlar; iki kişilik su ve gıda gerekir',
    insanlik: 20,
    retCeza: 25,
  },
  {
    id: 'tamirci',
    ad: 'Kemal, tamirci',
    ikon: '🔧',
    kisi: 1,
    metin: 'Sırtında koca bir alet çantası var. Bozuk ne varsa onarabileceğini söylüyor.',
    katkiMetni: 'Hemen +10 enerji, geri dönüşümde her gece ek −4 atık',
    anlik: { enerji: +10 },
    gunlukKatki: { atik: -4 },
    uzman: 'geriDonusum',
    guclu: 'Geri dönüşümde çalışırsa her gece ek −4 atık',
    kosullu: 'Enerji 25 altındaysa Geri Dönüşüm komple kapanır (genel kural)',
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
    uzman: '*',
    guclu: 'Her işe el atarlar: nerede çalışırlarsa her gece +3 gıda, +3 su',
    kosullu: 'Dört kişiler: tüketimleri yüksek',
    insanlik: 15,
    retCeza: 22,
  },
];

// Oyunun başında sığınakta olan kurucular. varsayilan: başlangıçtaki görev.
// Dört makinenin hepsi dolu başlar.
export const KURUCULAR = [
  { id: 'selin', ad: 'Selin', ikon: '👩‍🔧', kisi: 1, guclu: 'Sığınağın kurucularından', varsayilan: 'enerji' },
  { id: 'burak', ad: 'Burak', ikon: '👨‍🔬', kisi: 1, guclu: 'Sığınağın kurucularından', varsayilan: 'su' },
  { id: 'nur',   ad: 'Nur',   ikon: '👩‍🌾', kisi: 1, guclu: 'Sığınağın kurucularından', varsayilan: 'sera' },
  { id: 'can',   ad: 'Can',   ikon: '🧑‍🔧', kisi: 1, guclu: 'Sığınağın kurucularından', varsayilan: 'geriDonusum' },
];
