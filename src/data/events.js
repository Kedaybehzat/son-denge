// =============================================================
//  RADYO OLAYLARI
//  Her sabah radyodan bir olay gelir (1. gün hariç rastgele).
//
//  anlik   : olay gelir gelmez uygulanan değişim
//  gunSonu : o gecenin tüketimine EKLENEN değişim
//  eylem   : o günün eylem hakkına eklenir (örn. -1)
//
//  Hazırlık (GDD Faz 2: uyarı → hazırlık → etki):
//  Olay bir gün önceden radyoda duyurulur (uyari). hazirlik tanımlıysa
//  oyuncu bugün 1 eylemle hazırlanır; yarın olayın KÖTÜ yöndeki etkileri
//  carpan ile çarpılır (0 = tamamen önlenir, 0.3 = %70 azalır).
//  Zararlı olaylar hazırlık gelince ~1.6 kat sertleştirildi; böylece
//  hazırlanmak bir panel eylemi kadar değerli (simülasyon: PROJECT_LOG D12).
//
//  Yeni olay eklemek için listeye bir obje eklemeniz yeterli.
// =============================================================

export const ILK_OLAY = {
  id: 'sakin',
  baslik: 'Sakin bir sabah',
  metin:
    '"Günaydın Yeşilvadi. Bugün gökyüzü açık, rüzgar hafif. Merkez hatırlatıyor: ' +
    'Afetlere hazırlanmak ve kaynakları paylaşmak Yeşilvadi\'yi ayakta tutacak."\n\n' +
    'Odaları gez ve panelleri tanı. Her gün sınırlı eylem hakkın var. Günü bitirmek için yatağa git.\n\n' +
    'Yarından itibaren kapıya sığınacak yer arayanlar gelebilir. Kimi içeri alacağına sen karar vereceksin.',
};

export const HAZIRLIK_MALIYETI = 1; // eylem hakkı

export const OLAYLAR = [
  {
    id: 'sicak',
    baslik: 'Sıcak hava dalgası',
    metin: '"Bugün sıcaklık 46 dereceyi bulacak. Soğutma sistemleri tam kapasite çalışıyor."',
    gunSonu: { enerji: -18, su: -10 },
    uyari: '"Meteoroloji yarın için aşırı sıcak uyarısı verdi. Soğutma yükü artacak."',
    hazirlik: { ad: 'Yalıtımı güçlendir, gölgelikleri kur', carpan: 0 },
  },
  {
    id: 'kurak',
    baslik: 'Kuraklık',
    metin: '"Baraj doluluk oranı yüzde 8\'e geriledi. Su kullanımında tasarruf şart."',
    gunSonu: { su: -20 },
    uyari: '"Yarın da yağış beklenmiyor, baraj seviyesi hızla düşüyor."',
    hazirlik: { ad: 'Tankları doldur, su tasarruf planı hazırla', carpan: 0 },
  },
  {
    id: 'sel',
    baslik: 'Ani sel',
    metin: '"Gece yağan sağanak seranın alt katını su bastı. Hasar tespit ediliyor."',
    anlik: { gida: -22, atik: +14 },
    uyari: '"Yarın şiddetli sağanak bekleniyor. Alçak katlar su baskını riski altında."',
    hazirlik: { ad: 'Seranın alt katına su bariyeri kur', carpan: 0.3 },
  },
  {
    id: 'kesinti',
    baslik: 'Şebeke kesintisi',
    metin: '"Bölge şebekesinde arıza var. Bugün sistemlerin bir kısmı devre dışı."',
    eylem: -1,
    uyari: '"Şebeke operatörü yarın arıza riski bildirdi. Planlarınızı buna göre yapın."',
  },
  {
    id: 'ruzgar',
    baslik: 'Rüzgarlı gün',
    metin: '"Kuvvetli rüzgar bekleniyor. Türbinler tam kapasite üretimde."',
    anlik: { enerji: +15 },
    uyari: '"Yarın kuvvetli rüzgar bekleniyor. Türbinler için iyi bir gün olacak."',
  },
  {
    id: 'toz',
    baslik: 'Toz fırtınası',
    metin: '"Çölleşen bölgelerden gelen toz bulutu panelleri kapladı. Güneş enerjisi üretimi düşük."',
    gunSonu: { enerji: -15 },
    anlik: { karbon: +8 },
    uyari: '"Çöl yönünden yarın yoğun bir toz bulutu bekleniyor."',
    hazirlik: { ad: 'Güneş panellerini koruyucu örtüyle kapla', carpan: 0 },
  },
  {
    id: 'takas',
    baslik: 'Komşu sığınaktan takas',
    metin: '"Doğu sığınağı fazla hasatlarını paylaştı. Ambalajlar geri dönüşüm bekliyor."',
    anlik: { gida: +12, atik: +8 },
    uyari: '"Doğu sığınağı yarın takas için kervan göndereceğini bildirdi."',
  },
];
