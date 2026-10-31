// =============================================================
//  EĞİTİCİ KARAR KARTLARI (GDD bölüm 10)
//  Koşulu sağlanan kart sabah, radyodan sonra çıkar. Her kart bir
//  oyunda bir kez, günde en fazla bir kart. Sıra = öncelik.
//
//  kosul      : hepsi sağlanmalı. { kaynak, alti | ust } ya da { gunMin }
//  secenekler :
//    ad, metin      : buton yazısı ve kısa açıklama
//    etki           : hemen uygulanan değişim
//    geceEtki       : bu gecenin hesabına eklenen değişim
//    maliyet        : eylem hakkı (varsayılan 0)
//    insanlik       : gizli insanlık puanına eklenir
//    arastirma      : { id, puan } -> o projeyi aktif yapar ve puan ekler
//                     (proje zaten açıksa seçenek gizlenir)
//    kirli, panel   : kirli seçenek (kırmızı); panel = dumanın çıktığı makine
//    sonuc          : seçimden sonra gösterilen metin
//    bilgi          : facts.js anahtarı (sonuç ekranında gösterilir)
//  Sayılar mevcut panel eylemleriyle aynı ölçekte; [DENGE TASLAĞI].
// =============================================================

export const KARTLAR = [
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
      { ad: 'Biraz daha süre iste', insanlik: -5,
        sonuc: 'Sakinler ikna olmadı. Verilen sözlerin ertelenmesi güveni aşındırır.', bilgi: 'fosil' },
    ],
  },
];
