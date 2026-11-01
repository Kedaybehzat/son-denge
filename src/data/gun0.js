// =============================================================
//  GÜN 0 · HAZIRLIK (öğretici)
//  Sığınak boş başlar; kurucular kapıya teker teker gelir.
//  Oyuncu her birini kendi makinesine yönlendirir, bu sırada
//  bir oyun mekaniği tanıtılır. Sayı/denge değiştirmez: Gün 1
//  her zamanki başlangıç değerleriyle başlar.
// =============================================================

// Kurucu sırası KURUCULAR ile aynıdır (uid = sıra + 1 eşleşmesi korunur).
export const GUN0_KURUCULAR = {
  selin: {
    gelis: 'Sırt çantasında lehim makinesi, alnında koruyucu gözlük. Güneş panellerini kuran ekipteymiş.',
    ders: {
      baslik: 'Makineler ve operatörler',
      metin: 'Her makinenin başında bir operatör olmalı. Operatörü olan makine her gece üretir; boş makine hiçbir şey üretmez. Selin enerji makinesinde çalışınca her gece +6 enerji gelecek.',
    },
    panel: 'Güneş panellerini temizlemek temiz ve güvenilir enerji verir. Rüzgar türbinini onarmak daha az enerji verir ve biraz atık çıkarır. Dizel jeneratör en çok enerjiyi verir ama karbonu sert yükseltir; denge çubuğu karbonu iki kat saydığı için kısa yoldan pahalıya patlar.',
  },
  burak: {
    gelis: 'Elinde paslı bir İngiliz anahtarı var. Arıtma tanklarının vanalarını ezbere biliyor.',
    ders: {
      baslik: 'Üstteki kaynak çubukları',
      metin: 'Ekranın üstünde beş kaynak var: enerji, su ve gıda yüksek olmalı; atık ve karbon düşük olmalı. Her gece sığınak sabit miktarda tüketir, her kişi de ayrıca su ve gıda harcar. Burak arıtmada her gece +5 su üretecek.',
    },
    panel: 'Filtre değiştirmek ucuzdur ama atık çıkarır. Tam güçle arıtma çok su verir, karşılığında enerji yer: su ve enerji birbirine bağlıdır. Enerji azken tam güç modunu açmak iki kaynağı birden zora sokabilir.',
  },
  nur: {
    gelis: 'Önlüğünün cebi tohum paketleriyle dolu. Serada büyüttüğü fideleri tek tek adıyla çağırıyor.',
    ders: {
      baslik: 'Eylem hakkı ve paneller',
      metin: 'Gün 1\'den itibaren her gün 3 eylem hakkın olacak. Bir odanın paneline gidip E\'ye basınca seçenekler açılır; her seçenek bir şey kazandırır ama bir bedeli de vardır. Kırmızı kenarlı "⚠ kirletir" seçenekleri hızlıdır ama karbon salar.',
    },
    panel: 'Serayı sulamak gıda verir ama su harcar. Kompost atığı gıdaya çevirir: iki sorunu birden çözer. Fidan dikmek karbonu düşürür, biraz su ister. Seranın kendisi karbon azaltmanın en temiz yoludur.',
  },
  can: {
    gelis: 'Yamalı yeleğinin her cebinde onarılmış bir parça var. "Atık yoktur, yanlış yerde duran malzeme vardır" diyor.',
    ders: {
      baslik: 'Denge çubuğu',
      metin: 'Sağ üstteki Distopya–Ütopya çubuğu tüm kaynakların ortalamasıdır; karbon iki kat sayılır. Denge düşerse dışarıdaki dünya kararır, 10\'un altına inerse sığınak çöker. Can geri dönüşümde her gece −5 atık sağlayacak.',
    },
    panel: 'Ayrıştırmak ve onarmak atığı azaltır, üstelik alttaki "Malzeme" stoğuna yapı malzemesi kazandırır; inşaat ve bakım bu malzemeyle yapılır. Atık yakmak en hızlı temizliktir ama karbon salar ve malzeme vermez.',
  },
};

// Kurucunun panelini açınca gösterilen ortak panel rehberi (sırayla)
export const GUN0_PANEL_BOLUMLERI = [
  { baslik: 'Operatör ve gece üretimi', metin: 'En üstte makinede kimin çalıştığı ve bu gece ne üreteceği yazar. Operatör yoksa kırmızı "YOK" görünür; o gün kendin çalışabilirsin (1 eylem) ya da panodan birini atarsın.' },
  { baslik: 'Çalışma modu', metin: 'Tasarruf, Normal ve Yoğun arasında ücretsiz geçersin. Yoğun mod çok üretir ama operatörü daha çok yorar, makineyi daha çok aşındırır ve ek kaynak tüketir. Tasarruf modu yorgunluk ve aşınma yaratmaz.' },
  { baslik: 'Aşınma ve bakım', metin: 'Çalışan makine her gece aşınır. Aşınma 6\'ya çıkınca üretim düşer. Bakım 1 eylem ve 2 malzemeyle aşınmayı 5 azaltır.' },
  { baslik: 'Eylemler: kazanç ve bedel', metin: 'Alttaki numaralı düğmeler (1/2/3 tuşlarıyla da seçilir) günlük eylem hakkını harcar. Her düğmede yeşil kazançlar ve kırmızı bedeller yazar. Kaynak yetmezse düğme kapanır.' },
];

// Ekip tamamlanınca Sığınak Yönetimi panosunun turu (sayfa sayfa)
export const GUN0_PANO_TURU = [
  { baslik: 'Sığınak Yönetimi', metin: 'Bu pano sığınağın beyni. Yaşam alanındaki panoya E ile ya da ekranın sol altındaki düğmelerle her yerden açılır. Üst şeritten bölümler arasında geçersin.' },
  { baslik: 'Koloni', metin: 'Her sakinin kartı burada: görevi, yorgunluğu ve ne ürettiği. Bir sakini makineye, Laboratuvar\'a (araştırma) ya da Dinlen\'e atarsın. ★ uzmanlık yeri demektir; orada daha verimli çalışır. Yorgunluk 4\'e çıkınca dinlendir, yoksa sığınaktan ayrılabilir.' },
  { baslik: 'Odalar', metin: 'Beş odanın durumunu tek bakışta görürsün: kim çalışıyor, hangi modda, aşınma ne durumda ve o odaya ait iyileştirmeler.' },
  { baslik: 'Araştırma', metin: 'Aynı anda tek proje araştırılır. Puan Laboratuvar\'daki sakinlerden ya da "Masa başında araştır" eyleminden gelir. Batarya Deposu fazla enerjiyi saklar, Gri Su her gece su kazandırır; bunlar bitince daha ileri teknolojiler açılır.' },
  { baslik: 'Keşif ve İnşaat', metin: 'Keşifte bir sakini erzakla dışarı yollarsın; döndüğünde kaynak ve araştırma puanı getirebilir, bu sırada sığınakta çalışmaz. İnşaatta malzemeyle kalıcı yapılar kurarsın: yalıtım, sel bariyeri, ek güneş paneli gibi. Bir sakini inşaata atamak gerekir.' },
  { baslik: 'Hedefler ve malzeme', metin: 'Hedefler bölümü isteğe bağlı topluluk görevlerini gösterir. Sol alttaki "Malzeme" sayısı inşaat ve bakım için kullandığın geri kazanılmış stoğundur; denge puanına sayılmaz.' },
];

export const GUN0_METIN = {
  giris: {
    baslik: 'Gün 0 · Hazırlık',
    metin: 'Yeşilvadi\'nin makineleri kuruldu ama sığınak bomboş. Kurucu ekip yolda; birazdan kapıya teker teker gelecekler.\n\nHer geleni karşıla ve kendi çalışma alanına yönlendir. Bu arada sığınağı tanı: odalarda yürü (A/D veya ←/→), nesnelere yaklaşıp E\'ye bas.',
  },
  kapiBos: 'Henüz kimse gelmedi. Ekip yolda, kapı çalınca sarı "!" görünecek.',
  panelBos: 'Bu makineyi çalıştıracak kimse yok. Kapıya gelen ekipten birini buraya yönlendirdiğinde makine Gün 1 sabahı çalışmaya başlar.',
  panelHazir: (ad) => `${ad} burada ve hazır. Makine Gün 1 sabahı üretime başlayacak. Eylemleri yarından itibaren kullanabilirsin.`,
  radyo: 'Radyo her sabah günün olayını ve yarının tahminini duyurur. Kötü bir olay geleceğini bir gün önceden öğrenirsen hazırlanabilirsin. Yayın Gün 1 sabahı başlıyor.',
  pano: 'Sığınak Yönetimi panosundan sakinlere görev verir, araştırma, keşif ve inşaatı yönetirsin. Ekibin tamamı yerleşince burada sana panoyu tanıtacağım.',
  yatakErken: (gelen, toplam) => `Ekip henüz tamamlanmadı (${gelen}/${toplam}). Herkes yerleşmeden uyuyamazsın.`,
  konusma: 'Önce yerleşeyim, yarın sabah konuşuruz.',
  kapanis: {
    baslik: 'Ekip tamam',
    metin: 'Dört kurucu da yerini aldı ve sığınağı tanıdın. Gün 1\'den itibaren:\n\n• Radyo her sabah günün olayını duyurur.\n• Kapıya iklim göçmenleri gelir; içeri alıp almamak senin kararın.\n• Yaşam alanındaki pano ve alttaki düğmelerle sakinleri yönetirsin.\n• Gün bitince yatağa gidip uyursun; gece kaynaklar tüketilir.\n\nHazır olduğunda yaşam alanındaki yatağa git ve Gün 1\'i başlat.',
  },
};
