// =============================================================
//  EĞİTİCİ KARAR KARTLARI (GDD bölüm 10)
//  Koşulu sağlanan kart sabah, radyodan sonra çıkar. Her kart bir
//  oyunda bir kez, günde en fazla bir kart. Sıra = öncelik.
//
//  kosul      : hepsi sağlanmalı. { kaynak, alti | ust }, { gunMin },
//               { memnuniyetAlti }, { tahmin: olayId }, { olay: olayId },
//               { bosMakineVar: true } ya da { kesfedilen: noktaId }
//  sozcu      : { id, metin } -> bu sakin içerideyse kart onun ağzından anlatılır
//  secenekler :
//    ad, metin      : buton yazısı ve kısa açıklama
//    etki           : hemen uygulanan değişim
//    geceEtki       : bu gecenin hesabına eklenen değişim
//    maliyet        : eylem hakkı (varsayılan 0)
//    insanlik       : gizli insanlık puanına eklenir
//    memnuniyet     : sakinlerin memnuniyetine eklenir (GDD bölüm 11)
//    yorgunlukAzalt : tüm sakinlerin yorgunluğundan düşülür
//    arastirma      : { id, puan } -> o projeyi aktif yapar ve puan ekler
//                     (proje zaten açıksa seçenek gizlenir)
//    kirli, panel   : kirli seçenek (kırmızı); panel = dumanın çıktığı makine
//    sonuc          : seçimden sonra gösterilen metin
//    bilgi          : facts.js anahtarı (sonuç ekranında gösterilir)
//  Sayılar mevcut panel eylemleriyle aynı ölçekte; [DENGE TASLAĞI].
// =============================================================

export const KARTLAR = [
  {
    // Hafif siyaset (GDD bölüm 11): eleştiri kötü karakter değildir, baskıcı seçenek yoktur
    id: 'itiraz',
    baslik: 'Sakinlerin itirazı',
    metin: 'Sakinler toplandı. Kesintilerden, yorgunluktan ve verilen kararlardan şikâyetçiler. Bir sözcü seni dinlemeye çağırıyor.',
    sozcu: { id: 'tamirci', metin: 'Kemal sakinleri topladı: "Daha hızlı çözümler lazım. İnsanlar yorgun, ışıklar sönüyor." Haklı olduğu yerler var. Ne yapacaksın?' },
    kosul: [{ memnuniyetAlti: 35 }],
    secenekler: [
      { ad: 'Toplantı yap, itirazları tek tek dinle', maliyet: 1, memnuniyet: +15,
        sonuc: 'Herkes söz aldı. Bazı kararlar değişmedi ama neden alındıkları artık anlaşılıyor.' },
      { ad: 'Uzlaş: herkese bir gece dinlenme sözü ver', yorgunlukAzalt: 2, memnuniyet: +10, geceEtki: { enerji: -6, gida: -4 },
        sonuc: 'Makineler bu gece yavaş çalışacak ama sakinler nefes aldı.' },
      { ad: 'Kararlarımın arkasındayım', memnuniyet: -8,
        sonuc: 'Toplantı sessizce dağıldı. Güven bir kez sarsılınca geri kazanmak zor; bu böyle sürerse yönetim oylanabilir.' },
    ],
  },
  {
    id: 'karanlik',
    baslik: 'Karanlıkta kalan koloni',
    metin: 'Lambalar titriyor, sakinler soğuktan şikâyetçi. Bu gece enerji yetmeyebilir. Ne yapacaksın?',
    kosul: [{ kaynak: 'enerji', alti: 30 }],
    secenekler: [
      { ad: 'Dizel jeneratörü bütün gece çalıştır', etki: { enerji: +30, karbon: +16 }, kirli: true, panel: 'enerji',
        sonuc: 'Işıklar hemen geri geldi ama havadaki is kokusu sabaha kadar gitmedi.', bilgi: 'fosil' },
      { ad: 'Güneş panellerine bakım ekibi gönder', etki: { enerji: +20 }, maliyet: 1,
        sonuc: 'Ekip panelleri tek tek temizledi. Yavaş ama temiz bir çözüm.', bilgi: 'gunes' },
      { ad: 'Enerji tasarruf planı ilan et', geceEtki: { enerji: +10 },
        sonuc: 'Gereksiz cihazlar kapatıldı. En temiz enerji, hiç harcanmayan enerjidir.', bilgi: 'hiyerarsi' },
    ],
  },
  {
    id: 'susuz',
    baslik: 'Su paylaşımı',
    metin: 'Tanklar azalıyor. Sera daha fazla su istiyor, sakinler de içme suyundan endişeli.',
    kosul: [{ kaynak: 'su', alti: 30 }],
    secenekler: [
      { ad: 'Seranın sulamasına öncelik ver', etki: { gida: +10, su: -8 },
        sonuc: 'Bitkiler canlandı ama tanklar daha da azaldı. Kısa vadede gıda, uzun vadede su riski.', bilgi: 'sulama' },
      { ad: 'Evsel su tasarrufu başlat', geceEtki: { su: +10 },
        sonuc: 'Kısa duşlar, kapalı musluklar. Bu gece tanklar daha az boşalacak.', bilgi: 'tatlisu' },
      { ad: 'Gri su araştırmasını öne al', arastirma: { id: 'grisu', puan: 3 },
        sonuc: 'Laboratuvar lavabo suyunu geri kazanmanın yollarını çalışmaya başladı.', bilgi: 'grisu' },
    ],
  },
  {
    id: 'protesto',
    baslik: 'Geri dönüşüm protestosu',
    metin: 'Atık yığını yaşam alanına taştı. Sakinler bugün bir çözüm istiyor.',
    kosul: [{ kaynak: 'atik', ust: 65 }],
    secenekler: [
      { ad: 'Herkesle birlikte atıkları ayrıştır', etki: { atik: -20 }, maliyet: 1,
        sonuc: 'Cam, metal, plastik ayrı kutulara gitti. Zahmetli ama doğru yol.', bilgi: 'plastik' },
      { ad: 'Atıkları yak, hemen bitsin', etki: { atik: -35, enerji: +8, karbon: +15 }, kirli: true, panel: 'geriDonusum',
        sonuc: 'Yığın bir saatte yok oldu. Geriye duman ve kül kaldı.', bilgi: 'yakma' },
      { ad: 'Onarılabilecekleri ayır ve onar', etki: { atik: -10, enerji: +5 },
        sonuc: 'Eski parçalardan birkaç işe yarar alet çıktı.', bilgi: 'hiyerarsi' },
    ],
  },
  {
    id: 'kompost',
    baslik: 'Kompost tartışması',
    metin: 'Organik atık birikiyor, gıda stoku da azalıyor. Sakinler ne yapılacağını tartışıyor.',
    kosul: [{ kaynak: 'atik', ust: 50 }, { kaynak: 'gida', alti: 40 }],
    secenekler: [
      { ad: 'Organik atığı kompost yapıp seraya ver', etki: { gida: +12, atik: -12 },
        sonuc: 'Çürüyen atık toprağa döndü, sera besin buldu.', bilgi: 'metan' },
      { ad: 'Açık bir köşeye yığ, sonra bakarız', etki: { atik: -8 }, geceEtki: { karbon: +6 }, kirli: true, panel: 'sera',
        sonuc: 'Yığın gözden uzaklaştı ama havasız çürüyen atık metan saldı.', bilgi: 'metan' },
    ],
  },
  {
    id: 'soz',
    baslik: 'Yenilenebilir enerji sözü',
    metin: 'Sakinlere temiz enerji sözü vermiştin. Karbon hâlâ yüksek; hesap soruyorlar.',
    kosul: [{ kaynak: 'karbon', ust: 55 }],
    secenekler: [
      { ad: 'Fidan dikim günü düzenle', etki: { karbon: -15, su: -6 }, maliyet: 1,
        sonuc: 'Herkes bir fidan dikti. Küçük ama somut bir adım.', bilgi: 'agac' },
      { ad: 'Batarya araştırmasına öncelik ver', arastirma: { id: 'batarya', puan: 3 },
        sonuc: 'Depolama olmadan temiz enerji gece yetmiyor. Laboratuvar bataryaya odaklandı.', bilgi: 'batarya' },
      { ad: 'Biraz daha süre iste', memnuniyet: -10,
        sonuc: 'Sakinler ikna olmadı. Verilen sözlerin ertelenmesi güveni aşındırır.', bilgi: 'fosil' },
    ],
  },
  {
    // Kart D (GDD): yarın toz fırtınası uyarısı
    id: 'tozUyari',
    baslik: 'Yaklaşan toz fırtınası',
    metin: 'Meteoroloji yarın için yoğun toz uyarısı verdi. Güneş panelleri risk altında, enerji üretimi düşecek.',
    kosul: [{ tahmin: 'toz' }],
    secenekler: [
      { ad: 'Panelleri koruyucu örtüyle kapla', maliyet: 1, etki: { enerji: -5 }, geceEtki: { enerji: +12 },
        sonuc: 'Örtüler panelleri korudu; yarın temiz üretim kısmen devam edecek.', bilgi: 'gunes' },
      { ad: 'Batarya depolamasına öncelik ver', arastirma: { id: 'batarya', puan: 3 },
        sonuc: 'Laboratuvar yarına kadar batarya kapasitesini artırmaya odaklandı.', bilgi: 'batarya' },
      { ad: 'Tüketimi kıs, risk göze alınır', geceEtki: { enerji: +6 }, memnuniyet: -4,
        sonuc: 'Kesintiler sakinleri rahatsız etti ama panelleri koruyacak zaman yok.', bilgi: 'hiyerarsi' },
    ],
  },
  {
    // Kart G (GDD): yarın sel + sera (gıda) risk
    id: 'selUyari',
    baslik: 'Alçak katı su basabilir',
    metin: 'Yarın şiddetli sağanak bekleniyor. Alçak katta sera var; sel basarsa hasat telef olur.',
    kosul: [{ tahmin: 'sel' }],
    secenekler: [
      { ad: 'Seranın alt katına su bariyeri kur', maliyet: 1, etki: { atik: +3 }, geceEtki: { gida: +10 },
        sonuc: 'Bariyer bitti. Yarın hasat büyük ölçüde kurtulacak.', bilgi: 'tatlisu' },
      { ad: 'Üretimi geçici olarak üst kata taşı', etki: { gida: -6 }, geceEtki: { gida: +14 },
        sonuc: 'Fidanlar yukarı taşındı; verim düştü ama sel vurursa toparlanmak kolay.', bilgi: 'sulama' },
      { ad: 'Riski göze al, bugün başka iş yap', memnuniyet: -3,
        sonuc: 'Umut ederek beklemek bir strateji değil; yağmur başlarsa sera açık hedef.', bilgi: 'goc' },
    ],
  },
  {
    // Kart F (GDD): kritik ekipman — koloni boş makineyle çalışıyor
    id: 'bosMakine',
    baslik: 'Araştırma mı, tamirat mı?',
    metin: 'Bir makine operatörsüz duruyor, gece üretim yapmayacak. Laboratuvar da iş başı bekliyor. Kaynaklar iki ihtiyacı birden karşılamıyor.',
    kosul: [{ bosMakineVar: true }, { gunMin: 2 }],
    secenekler: [
      { ad: 'Boş makineye bu gece ben el atayım', maliyet: 1, geceEtki: { enerji: +5 },
        sonuc: 'Ertesi sabaha kadar makine çalıştı; onarım yeni bir operatör yetişene kadar iş görür.', bilgi: 'hiyerarsi' },
      { ad: 'Araştırmaya devam, kayıp kabul', geceEtki: { enerji: -4, gida: -2 }, arastirma: { id: 'batarya', puan: 2 },
        sonuc: 'Üretim durdu ama laboratuvar bir adım daha attı. Yatırım geleceği değiştirir.', bilgi: 'batarya' },
      { ad: 'Herkese bir gece tasarruf planı', geceEtki: { enerji: +4, su: +4, gida: +4 }, memnuniyet: -3,
        sonuc: 'Kısıntı sakinleri yordu ama koloni dengeyi korudu.', bilgi: 'suenerji' },
    ],
  },
  {
    // Kart H (GDD): keşiften döndükten sonra batarya parçaları
    id: 'keşifBataryalari',
    baslik: 'Keşif ekibinin bulduğu bataryalar',
    metin: 'Enerji santralinden dönen ekip hasarlı birkaç batarya parçası getirdi. Hepsini aynı anda kullanamazsın; nasıl değerlendireceksin?',
    kosul: [{ kesfedilen: 'santral' }],
    secenekler: [
      { ad: 'Hemen yeniden kullan: koloniye tak', etki: { enerji: +12 },
        sonuc: 'Parçalar kolonin bataryasına eklendi; kısa vadede ışıklar daha güvenli yanıyor.', bilgi: 'hiyerarsi' },
      { ad: 'Laboratuvarda araştır', arastirma: { id: 'batarya', puan: 4 },
        sonuc: 'Parçalar söküldü; batarya araştırması büyük sıçrama yaptı.', bilgi: 'batarya' },
      { ad: 'Komşu yerleşimle takas et', etki: { gida: +6, su: +6 }, memnuniyet: +4, insanlik: +5,
        sonuc: 'Bataryalar karşılığında yiyecek ve iyi niyet geldi. Döngüsel ekonomi dayanışmayı da getiriyor.', bilgi: 'goc' },
    ],
  },
  {
    // Kart E (GDD): ziyaretçi kapıda + stok düşük
    id: 'yeniAile',
    baslik: 'Yeni aileye yer var mı?',
    metin: 'Kapıda bekleyen var ama stoklar da gergin. Sakinler kaygılı: alırsak hepimiz mi aç kalacağız?',
    kosul: [{ kaynak: 'gida', alti: 35 }, { gunMin: 2 }],
    secenekler: [
      { ad: 'Kabul et, bu gece ekstra tasarruf yap', geceEtki: { gida: +6, su: +6 }, memnuniyet: -2, insanlik: +8,
        sonuc: 'Sakinler bir öğünü atladı. Zor ama paylaşmanın bedeli.', bilgi: 'goc' },
      { ad: 'Sera üretimini öne al, sonra kabul', maliyet: 1, etki: { gida: +12, su: -8 },
        sonuc: 'Önce kapasite yaratıldı. "Önce yer, sonra misafir" bazen en adil yol.', bilgi: 'sulama' },
      { ad: 'Bu seferlik geri çevirmek zorundayız', memnuniyet: +2, insanlik: -10,
        sonuc: 'Kapı kapandı. Yüzlerindeki ifade içeride uzun süre konuşuldu.', bilgi: 'goc' },
    ],
  },
];
