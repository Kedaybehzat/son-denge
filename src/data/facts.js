// =============================================================
//  "BİLİYOR MUYDUN?" KARTLARI
//  Gün sonunda, o gün yapılan seçimlere bağlı gerçek bir bilgi gösterilir.
//  Panel eylemleri (panels.js) ve kapı kararları "bilgi" anahtarıyla buraya bağlanır.
//  Sunumdan önce rakamları kaynaklarından bir kez daha kontrol edin.
// =============================================================

export const BILGILER = {
  batarya: {
    metin: 'Güneş ve rüzgar üretimi hava durumuna göre değişir. Bataryalar fazla elektriği saklayıp üretimin düştüğü saatlerde kullanır; bu yüzden enerji dönüşümünde depolama, üretim kadar önemlidir.',
    kaynak: 'IEA',
  },
  grisu: {
    metin: 'Lavabo, duş ve çamaşırdan gelen "gri su" arıtılarak sulama ve tuvalet için yeniden kullanılabilir. Böylece temiz içme suyu yalnızca gerçekten gereken yerde harcanır.',
    kaynak: 'US EPA',
  },
  fosil: {
    metin: 'Kömür, petrol ve doğalgaz gibi fosil yakıtlar, küresel sera gazı salımlarının dörtte üçünden fazlasından ve karbondioksit salımlarının yaklaşık %90\'ından sorumlu.',
    kaynak: 'Birleşmiş Milletler',
  },
  gunes: {
    metin: 'Güneş panellerinin üzerindeki toz ve kir verimi belirgin şekilde düşürür. Çölleşen ve tozlu bölgelerde düzenli temizlik bu yüzden kritik.',
    kaynak: 'Genel bilgi',
  },
  ruzgar: {
    metin: 'Rüzgar ve güneş santralleri çalışırken neredeyse hiç sera gazı salmaz. Ömürleri boyunca saldıkları gazın büyük kısmı üretim ve kurulum aşamasından gelir.',
    kaynak: 'IPCC',
  },
  tatlisu: {
    metin: 'Dünyadaki suyun yalnızca yaklaşık %2,5\'i tatlı su ve bunun da büyük kısmı buzullarda ve yer altında. Bugün 2 milyardan fazla insan güvenli içme suyuna erişemiyor.',
    kaynak: 'USGS, DSÖ / UNICEF',
  },
  suenerji: {
    metin: 'Suyu arıtmak, pompalamak ve taşımak ciddi miktarda enerji gerektirir. Su tasarrufu, aynı zamanda enerji tasarrufu demektir.',
    kaynak: 'Uluslararası Enerji Ajansı',
  },
  sulama: {
    metin: 'Dünyada çekilen tatlı suyun yaklaşık %70\'i tarımda kullanılıyor. Damla sulama gibi yöntemler aynı hasadı çok daha az suyla sağlayabilir.',
    kaynak: 'FAO',
  },
  metan: {
    metin: 'Çöp sahalarında çürüyen organik atık metan üretir. Metan, 20 yıllık sürede karbondioksitten yaklaşık 80 kat daha güçlü bir sera gazıdır. Kompost bu salımı büyük ölçüde önler.',
    kaynak: 'IPCC, UNEP',
  },
  agac: {
    metin: 'Bir ağacın tuttuğu karbon yıllar içinde artar. Yeni dikilen fidanlar ilk yıllarda az karbon tutar; bu yüzden mevcut ormanları korumak, yenilerini dikmek kadar önemlidir.',
    kaynak: 'FAO',
  },
  plastik: {
    metin: 'Dünyada üretilen plastik atığın yalnızca yaklaşık %9\'u geri dönüştürülüyor. Geri kalanı çöp sahalarına, yakma tesislerine ya da doğaya gidiyor.',
    kaynak: 'OECD',
  },
  hiyerarsi: {
    metin: 'Sıfır atık yaklaşımında sıra şöyledir: önce azalt, sonra yeniden kullan ve onar, en son geri dönüştür. Onarılan bir eşya, yeniden üretilen bir eşyadan çok daha az kaynak harcar.',
    kaynak: 'Sıfır Atık yaklaşımı',
  },
  yakma: {
    metin: 'Atık yakmak bir miktar enerji üretse de karbondioksit ve hava kirliliğine yol açar. Atık hiyerarşisinde yakma, azaltma ve geri dönüşümden sonra gelir.',
    kaynak: 'UNEP',
  },
  goc: {
    metin: 'Dünya Bankası\'na göre önlem alınmazsa 2050\'ye kadar 216 milyon insan iklim değişikliği yüzünden kendi ülkesi içinde göç etmek zorunda kalabilir.',
    kaynak: 'Dünya Bankası, Groundswell raporu',
  },
  // Genel bilgiler: o gün eşleşen bir bilgi yoksa bunlardan biri gösterilir
  permafrost: {
    metin: 'Kuzey yarımküredeki donmuş topraklar (permafrost), atmosferdekinin yaklaşık iki katı kadar karbon tutuyor. Çözüldükçe bu karbon salınmaya başlıyor.',
    kaynak: 'NASA, IPCC',
  },
  sibirya: {
    metin: '2016\'da Sibirya\'da sıcak hava dalgası permafrostu çözünce, onlarca yıl önce ölmüş bir rengeyiğinden şarbon bakterisi yayıldı ve bir salgına yol açtı.',
    kaynak: 'Yamal 2016 salgını haberleri (BBC, Reuters)',
  },
  gidaisraf: {
    metin: 'Dünyada üretilen gıdanın yaklaşık üçte biri kayboluyor ya da israf ediliyor. Gıda israfı, küresel sera gazı salımlarının yaklaşık %8–10\'undan sorumlu.',
    kaynak: 'FAO, UNEP',
  },
};

export const GENEL_BILGILER = ['permafrost', 'sibirya', 'gidaisraf'];
