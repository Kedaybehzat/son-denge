// =============================================================
//  RADYO OLAYLARI
//  Her sabah radyodan bir olay gelir (1. gün hariç rastgele).
//
//  anlik   : olay gelir gelmez uygulanan değişim
//  gunSonu : o gecenin tüketimine EKLENEN değişim
//  eylem   : o günün eylem hakkına eklenir (örn. -1)
//
//  Yeni olay eklemek için listeye bir obje eklemeniz yeterli.
// =============================================================

export const ILK_OLAY = {
  id: 'sakin',
  baslik: 'Sakin bir sabah',
  metin:
    '"Günaydın Yeşilvadi. Bugün gökyüzü açık, rüzgar hafif. Merkez hatırlatıyor: ' +
    'Büyük Sessizlik\'ten önceki dünya israf yüzünden çöktü. Kaynaklarınızı dengede tutun."\n\n' +
    'Odaları gez ve panelleri tanı. Her gün sınırlı eylem hakkın var. Günü bitirmek için yatağa git.',
};

export const OLAYLAR = [
  {
    id: 'sicak',
    baslik: 'Sıcak hava dalgası',
    metin: '"Bugün sıcaklık 46 dereceyi bulacak. Soğutma sistemleri tam kapasite çalışıyor."',
    gunSonu: { enerji: -10, su: -5 },
  },
  {
    id: 'kurak',
    baslik: 'Kuraklık',
    metin: '"Baraj doluluk oranı yüzde 8\'e geriledi. Su kullanımında tasarruf şart."',
    gunSonu: { su: -12 },
  },
  {
    id: 'sel',
    baslik: 'Ani sel',
    metin: '"Gece yağan sağanak seranın alt katını su bastı. Hasar tespit ediliyor."',
    anlik: { gida: -15, atik: +10 },
  },
  {
    id: 'kesinti',
    baslik: 'Şebeke kesintisi',
    metin: '"Bölge şebekesinde arıza var. Bugün sistemlerin bir kısmı devre dışı."',
    eylem: -1,
  },
  {
    id: 'ruzgar',
    baslik: 'Rüzgarlı gün',
    metin: '"Kuvvetli rüzgar bekleniyor. Türbinler tam kapasite üretimde."',
    anlik: { enerji: +15 },
  },
  {
    id: 'toz',
    baslik: 'Toz fırtınası',
    metin: '"Çölleşen bölgelerden gelen toz bulutu panelleri kapladı. Güneş enerjisi üretimi düşük."',
    gunSonu: { enerji: -8 },
    anlik: { karbon: +5 },
  },
  {
    id: 'takas',
    baslik: 'Komşu sığınaktan takas',
    metin: '"Doğu sığınağı fazla hasatlarını paylaştı. Ambalajlar geri dönüşüm bekliyor."',
    anlik: { gida: +12, atik: +8 },
  },
];
