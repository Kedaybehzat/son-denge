// =============================================================
//  PROLOG (3 günlük öğretici)
//  Sığınak boş başlar; kurucular günlere bölünerek gelir. Her kurucu
//  kendi odasına geçer, oyuncu o odanın konsolunu adım adım öğrenir.
//  Prolog gecelerinde küçük bir sabit tüketim işler; kaynaklar Gün 1'e
//  devreder. Başlangıç değerleri, rehberli oynanışın Gün 1'i normal
//  başlangıca (50/50/50/35/35, malzeme 8) yakın açacağı şekilde seçildi
//  (tools/prolog-test.mjs doğrular).
// =============================================================

export const PROLOG_AYAR = {
  baslangic: { enerji: 45, su: 60, gida: 48, atik: 37, karbon: 38 },
  malzeme: 2,
  // Sığınak henüz yarı kapalı: normal gecenin (−21/−9/−9/+15/−3) yaklaşık yarısı
  geceDegisim: { enerji: -10, su: -4, gida: -4, atik: 6, karbon: -1 },
};

// Kurucular KURUCULAR sırasıyla gelir (uid = sıra + 1 eşleşmesi korunur).
export const PROLOG_GUNLER = [
  { baslik: 'İlk ışık', gelen: 1, eylem: 2,
    metin: 'Sığınak sessiz. Makineler kurulu ama çalıştıracak kimse yok. Bugün enerji teknisyeni Selin geliyor; ışıkları birlikte yakacaksınız.' },
  { baslik: 'Su ve toprak', gelen: 2, eylem: 3,
    metin: 'Burak ve Nur yolda. Bugün su arıtma ve sera çalışmaya başlayacak. Yeni gelenler su ve gıda tüketir; tankları ve seraları izle.' },
  { baslik: 'Döngüyü kapat', gelen: 1, eylem: 2, pano: true,
    metin: 'Son kurucu Can geliyor. Atık döngüsünü kurduktan sonra sığınağın yönetim panosunu tanıyacaksın. Bu gecenin sabahı asıl hikaye başlıyor.' },
];

export const PROLOG_KURUCULAR = {
  selin: {
    gelis: 'Sırt çantasında lehim makinesi, alnında koruyucu gözlük. Güneş panellerini kuran ekipteymiş.',
    ders: { baslik: 'Makineler ve operatörler', metin: 'Her makinenin başında bir operatör olmalı. Operatörü olan makine her gece kendiliğinden üretir; boş makine hiçbir şey üretmez.' },
  },
  burak: {
    gelis: 'Elinde paslı bir İngiliz anahtarı var. Arıtma tanklarının vanalarını ezbere biliyor.',
    ders: { baslik: 'Kişi başı tüketim', metin: 'Sığınağa gelen her kişi her gece 2 su ve 2 gıda tüketir. Nüfus arttıkça üretim de artmalı.' },
  },
  nur: {
    gelis: 'Önlüğünün cebi tohum paketleriyle dolu. Serada büyüttüğü fideleri tek tek adıyla çağırıyor.',
    ders: { baslik: 'Kazanç ve bedel', metin: 'Her eylem bir şey kazandırır ama çoğu bir bedel ister: sulamak gıda verir, su harcar. Önce ekrandaki önizlemeye bak.' },
  },
  can: {
    gelis: 'Yamalı yeleğinin her cebinde onarılmış bir parça var. "Atık yoktur, yanlış yerde duran malzeme vardır" diyor.',
    ders: { baslik: 'Denge çubuğu', metin: 'Sağ üstteki Distopya–Ütopya çubuğu tüm kaynakların ortalamasıdır; karbon iki kat sayılır. 10\'un altına inerse sığınak çöker.' },
  },
};

// Konsol rehberi: hedef = konsoldaki data-rehber alanı.
// tur: 'oku' (Devam) · 'mod' (mod değiştir) · 'onizle' (bir kontrolün üstüne gel) · 'eylem' (i. kontrolü kullan)
export const PROLOG_REHBER = {
  enerji: [
    { hedef: 'operator', tur: 'oku', metin: 'Selin bu makinenin operatörü. Operatör varken makine her gece kendiliğinden üretir.' },
    { hedef: 'ihtiyac', tur: 'oku', metin: 'Oda hesabı: sığınağın bu gece ne kadar enerji harcayacağı, makinenin ne üreteceği ve sabah ne kalacağı. Kırmızı net, kaynağın azalacağı demek.' },
    { hedef: 'mod', tur: 'mod', metin: 'Çalışma modu anahtarını çevir. Yoğun daha çok üretir ama operatörü yorar, makineyi aşındırır. Bir mod seç.' },
    { hedef: 'moduller', tur: 'onizle', metin: 'Kontrollerin üstüne gel: ekran kazancı ve bedeli gösterir, göstergelerde sonucun gölgesi belirir.' },
    { hedef: 'modul-0', tur: 'eylem', i: 0, metin: 'Güneş panellerini temizle: temiz ve güvenilir enerji. Kolu çek.' },
    { hedef: 'modul-2', tur: 'oku', metin: 'Dizel şalteri en hızlı enerjiyi verir ama karbonu yükseltir. Denge karbonu iki kat sayar; acil durumlara sakla.' },
  ],
  su: [
    { hedef: 'oda', tur: 'oku', metin: 'Tanklar su seviyesini gösterir. Gelen her kişi her gece 2 su içer; nüfus artınca tanklar hızlı boşalır.' },
    { hedef: 'ihtiyac', tur: 'oku', metin: 'Su ihtiyacı nüfusla büyür. Burak her gece arıtmadan su çeker; açığı eylemlerle kapatırsın.' },
    { hedef: 'modul-1', tur: 'onizle', metin: 'Tam güç vanasının üstüne gel: çok su verir ama enerji yer. Su ve enerji birbirine bağlıdır.' },
    { hedef: 'modul-0', tur: 'eylem', i: 0, metin: 'Filtreleri değiştir. Biraz atık çıkar ama enerji harcamaz.' },
  ],
  sera: [
    { hedef: 'oda', tur: 'oku', metin: 'Saksılar gıda seviyesiyle yeşerir ya da solar. Gıda da su gibi kişi başına tüketilir.' },
    { hedef: 'modul-0', tur: 'eylem', i: 0, metin: 'Serayı sula. Ekranda gıdanın arttığını, suyun azaldığını izle.' },
    { hedef: 'modul-1', tur: 'oku', metin: 'Kompost atığı gıdaya çevirir: iki sorunu birden çözer.' },
    { hedef: 'modul-2', tur: 'oku', metin: 'Fidan dikmek karbonu düşürür; biraz su ister. Karbonla mücadelenin en temiz yolu.' },
  ],
  geriDonusum: [
    { hedef: 'oda', tur: 'oku', metin: 'Atık yığını büyüdükçe denge düşer. Sağdaki malzeme sayacı inşaat ve bakımda kullandığın stoktur.' },
    { hedef: 'modul-0', tur: 'eylem', i: 0, metin: 'Atıkları ayrıştır: atık azalır, malzeme kazanırsın.' },
    { hedef: 'modul-2', tur: 'oku', metin: 'Yakma fırını en hızlı temizliktir ama karbon salar ve malzeme vermez.' },
    { hedef: 'asinma', tur: 'oku', metin: 'Aşınma: makine çalıştıkça aşınır, 6\'dan sonra üretim düşer. Gün 1\'den itibaren anahtarla bakım yaparsın (1 eylem + 2 malzeme).' },
  ],
};

// Son prolog gününde Sığınak Yönetimi panosunun turu (sayfa sayfa)
export const PROLOG_PANO_TURU = [
  { bolum: 'koloni', hedef: '.y-ust', baslik: 'Sığınak Yönetimi', metin: 'Bu pano sığınağın beyni: yaşam alanındaki panoya E ile ya da sol alttaki düğmelerle açılır. Üst sekmelerden bölümler arasında geçersin. Bir şeyin üstüne gelince sağ üstteki ekran ayrıntısını gösterir.' },
  { bolum: 'koloni', hedef: '.y-gorev-tahtasi', baslik: 'Koloni: görev tahtası', metin: 'Her sütun bir görev yeri. Bir sakini seçip sütuna tıkla ya da kartını sürükle: sütunların üstünde orada ne üreteceği belirir. ★ uzmanlık yeri. Pil, yorgunluk: dolarsa dinlendir, yoksa sakin ayrılabilir.' },
  { bolum: 'odalar', hedef: '.y-odalar', baslik: 'Odalar', metin: 'Beş odanın tek bakışta durumu: operatör, ışık (yeşil çalışıyor, kırmızı boş), gece üretimi, mod (T/N/Y) ve aşınma. Konsolu ya da odanın iyileştirmelerini buradan açarsın.' },
  { bolum: 'kesif', hedef: '.y-harita', baslik: 'Keşif haritası', metin: 'Bir noktaya tıkla, erzakı ve ödülü gör, kimi göndereceğini seç. Yüzde, başarı şansı; ★ uzman giderse başarı kesin. Seferdeki kişi sığınakta çalışmaz.' },
  { bolum: 'arastirma', hedef: '.y-agac', baslik: 'Araştırma ağacı', metin: 'Aynı anda tek proje ilerler; halka dolunca teknoloji açılır. Seviye I\'den biri bitince Seviye II açılır. Puan laboratuvardaki sakinlerden ya da masa başında araştırmaktan gelir.' },
  { bolum: 'insaat', hedef: '.y-planlar', baslik: 'İnşaat planları', metin: 'Malzemeyle kalıcı yapılar kurarsın. Plan kartında eylem, malzeme ve kaynak bedeli yazar. İnşaat iş puanıyla ilerler: bir işçi ata ya da günde bir kez yardım et.' },
  { bolum: 'hedefler', hedef: '.y-mantar', baslik: 'Hedefler ve malzeme', metin: 'İsteğe bağlı topluluk görevleri. Alttaki malzeme sayacı inşaat, bakım ve yardımda kullandığın stoktur; denge puanına sayılmaz.' },
];

export const PROLOG_METIN = {
  giris: 'Yeşilvadi\'nin makineleri kuruldu ama sığınak bomboş. Kurucu ekip üç güne yayılarak gelecek. Her geleni karşıla, kendi odasına yönlendir ve o odanın konsolunu birlikte öğren.\n\nOdalarda yürü (A/D veya ←/→), nesnelere yaklaşıp E\'ye bas.',
  kapiBos: 'Henüz kimse gelmedi. Kapı çalınca üstünde sarı "!" görünecek.',
  kapiGunBitti: 'Bugün gelecek kimse kalmadı. Hazır olduğunda yatağa git.',
  kapiTamam: 'Ekibin tamamı içeride. Gün 1\'den itibaren kapıya iklim göçmenleri gelecek.',
  panelBos: 'Bu makineyi çalıştıracak kimse yok. Operatörü geldiğinde konsol açılır ve makine her gece üretmeye başlar.',
  radyo: 'Radyo her sabah günün olayını ve yarının tahminini duyurur. Kötü bir olayı bir gün önceden öğrenirsen hazırlanabilirsin. Yayın Gün 1 sabahı başlıyor.',
  pano: 'Sığınak Yönetimi panosundan sakinlere görev verir, araştırma, keşif ve inşaatı yönetirsin. Prologun son gününde burada panoyu tanıyacaksın.',
  yatakErken: 'Bugünün işleri bitmedi. Üstteki şeritte sıradaki adımı görebilirsin.',
  konusma: 'Önce yerleşeyim, yarın sabah konuşuruz.',
  kapanis: {
    baslik: 'Ekip tamam',
    metin: 'Dört kurucu da yerini aldı ve sığınağı tanıdın. Gün 1\'den itibaren:\n\n• Radyo her sabah günün olayını duyurur.\n• Kapıya iklim göçmenleri gelir; içeri alıp almamak senin kararın.\n• Pano ve alttaki düğmelerle sakinleri yönetirsin.\n• Gün bitince yatağa gidip uyursun; gece kaynaklar tüketilir.\n\nHazır olduğunda yatağa git: bu gecenin sabahı Gün 1.',
  },
};
