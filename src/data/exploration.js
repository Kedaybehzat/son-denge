// =============================================================
//  KEŞİF (GDD bölüm 8)
//  Görev Panosu'ndan bir sakin bir keşif noktasına gönderilir.
//  Gittiği gün erzak düşer, sefer boyunca kolonide çalışmaz (makinesi
//  boşalır) ve her gece yorulur. Dönüşte başarı zarı atılır.
//  Her nokta bir oyunda bir kez keşfedilir; aynı anda tek sefer.
//
//  sure     : kaç gece sürer (dönüş, o kadar gece sonra sabah)
//  erzak    : gönderildiği an düşen kaynak
//  sans     : başarı ihtimali (0..1)
//  uzman    : bu uzmanlığa (visitors.js uzman / kurucu varsayılan görevi)
//             sahip biri giderse sans = 1
//  odul     : başarıda kaynak (hemen) ve/veya { arastirma: { id, puan } }
//  basari / basarisiz : dönüş metni. Başarısızlık "neden" anlatır.
//  bilgi    : facts.js anahtarı (gece kartı adayı)
//  Sayılar [DENGE TASLAĞI].
// =============================================================

export const KESIF_NOKTALARI = {
  santral: {
    harita: { x: 17, y: 24, alan: [4, 7, 34, 40] }, // Keşif haritasında konum (% genişlik/yükseklik)
    araKarar: { metin: 'Sağlam batarya parçaları bulundu. Çıkarmak bir gece daha sürecek. Erken dönersen yalnız taşınabilir erzak getirilecek.', ekErzak: { gida: -2, su: -2 }, malzeme: 5 },
    ad: 'Terk edilmiş enerji santrali',
    ikon: '🏭',
    sure: 1,
    erzak: { gida: -4, su: -4 },
    sans: 0.65,
    uzman: 'enerji',
    odul: { kaynak: { enerji: +12 }, arastirma: { id: 'batarya', puan: 4 } },
    basari: 'Santralin deposunda sağlam batarya hücreleri ve bakım kılavuzları bulundu.',
    basarisiz: 'Hasarlı tesiste neyin güvenli olduğunu ayırt edecek bilgi yoktu; ekip eli boş döndü. Enerji uzmanı gitseydi işe yarar parçaları tanıyabilirdi.',
    bilgi: 'batarya',
  },
  sehir: {
    harita: { x: 80, y: 20, alan: [64, 4, 97, 39] }, // Keşif haritasında konum (% genişlik/yükseklik)
    ad: 'Eski şehir',
    ikon: '🏚️',
    sure: 2,
    erzak: { gida: -8, su: -6 },
    sans: 0.75,
    uzman: 'geriDonusum',
    odul: { kaynak: { atik: -10, enerji: +8, gida: +8 } },
    basari: 'Yıkıntılardan onarılabilir aletler, konserve ve kablo toplandı. Atılan her şey bir kaynak.',
    basarisiz: 'Uzun yol erzağı tüketti, taşınabilecek şeyler seçilemedi. Onarım bilen biri olsaydı neyin işe yarayacağını bilirdi.',
    bilgi: 'hiyerarsi',
  },
  komsu: {
    harita: { x: 84, y: 72, alan: [66, 54, 99, 98] }, // Keşif haritasında konum (% genişlik/yükseklik)
    ad: 'Komşu yerleşim',
    ikon: '🏘️',
    sure: 1,
    erzak: { gida: -3, su: -3 },
    sans: 0.85,
    uzman: '*',
    odul: { kaynak: { gida: +10, su: +10 }, insanlik: +5 },
    basari: 'Komşular tohum ve su paylaştı, karşılığında onarım sözü aldılar. Dayanışma iki tarafı da güçlendirdi.',
    basarisiz: 'Komşular da zor durumdaydı; paylaşacak bir şeyleri yoktu. Kaynak paylaşımı herkesin biraz fazlası olduğunda mümkün.',
    bilgi: 'gidaisraf',
  },
  rezervuar: {
    harita: { x: 19, y: 76, alan: [2, 56, 36, 98] }, // Keşif haritasında konum (% genişlik/yükseklik)
    araKarar: { metin: 'Eski pompanın çizimleri bulundu. Kasayı çıkarmak için bir gece daha gerekiyor. Devam edersen yağmur suyu teknolojisinin önünü açabilirsin.', ekErzak: { gida: -2, su: -2 }, plan: 'pompa' },
    ad: 'Kurumuş rezervuar',
    ikon: '🏜️',
    sure: 1,
    erzak: { gida: -4, su: -2 },
    sans: 0.7,
    uzman: 'su',
    odul: { kaynak: { su: +8 }, arastirma: { id: 'grisu', puan: 4 } },
    basari: 'Eski su şebekesinin haritaları ve kullanılabilir filtreler bulundu.',
    basarisiz: 'Rezervuarın dibi kupkuruydu; haritaları okuyacak bilgi olmadan yer altı hatları bulunamadı. Su sistemlerini bilen biri yolu gösterebilirdi.',
    bilgi: 'tatlisu',
  },
};
