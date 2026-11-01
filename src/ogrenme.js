// Öğrenme geri bildirimi yalnız gerçekleşmiş karar kayıtlarından üretilir.
const ILISKILER = {
  fosil: 'Fosil yakıtla hızlı enerji üretmenin karbon bedelini gördün.',
  gunes: 'Panel bakımı, yeni yakıt tüketmeden mevcut üretimden yararlanmanın bir yolu.',
  ruzgar: 'Yenilenebilir üretimin devamı için bakım ve malzeme yönetimi de gerekiyor.',
  tatlisu: 'Su arıtma tercihin, kullanılabilir su ile bakım atığı arasındaki ilişkiyi gösteriyor.',
  suenerji: 'Daha fazla su arıtmak enerji gerektiriyor: su ve enerji kararları birbirine bağlı.',
  sulama: 'Gıda üretimi suya bağlı; serayı büyütürken su bütçesini de düşünmelisin.',
  metan: 'Organik atığı kompost olarak kullanmak besin maddelerini yeniden üretime döndürüyor.',
  agac: 'Fidan seçimi uzun vadeli karbon tutmayı temsil ediyor. Gerçekte ağaçların büyümesi yıllar alır.',
  plastik: 'Ayrıştırma, eldeki atığı yeniden kullanılabilir malzemeye dönüştürmenin başlangıcı.',
  hiyerarsi: 'Onarım ve yeniden kullanım, yeni malzeme ihtiyacını azaltmanın yolları.',
  yakma: 'Yakma, bu oyunda atığı azaltıp enerji sağlarken karbon yükünü artırıyor.',
  erkenuyari: 'Önceden hazırlık, iklim etkileriyle karşılaşmadan dayanıklılığı artırmayı temsil ediyor.',
  grisu: 'Suyu yeniden kullanmak, temiz su kaynakları üzerindeki talebi azaltabilir.',
  batarya: 'Depolama, enerji üretimi ile ihtiyacın farklı zamanlarda oluşmasını yönetmeye yardımcı olur.',
};
export function kararAciklamasi(k) {
  // Bilgi kartı anahtarı bir eylem değildir: ör. süre istemek de fosil kartına bağlanır.
  if (k.tip === 'kart') return k.aciklama || '';
  if (k.tip === 'hazirlik') return ILISKILER.erkenuyari;
  if (k.tip === 'uretim') return k.mod === 'yogun'
    ? 'Yoğun üretim daha yüksek çıktı karşılığında ek tüketim, yorgunluk ve aşınma getiriyor.'
    : k.mod === 'tasarruf' ? 'Tasarruf modu üretimi düşürüyor; ek yorgunluk ve aşınmayı önlüyor.' : '';
  return ILISKILER[k.bilgi] || '';
}
export function gununKararlari(gecmis, gun) {
  const adaylar = (gecmis || []).filter(k => k.gun === gun && kararAciklamasi(k));
  const secilen = [], konular = new Set();
  // Gün içinde verilen kararlar, geceki üretim modlarından önce gösterilir.
  for (const k of [...adaylar.filter(k => k.tip !== 'uretim'), ...adaylar.filter(k => k.tip === 'uretim')]) {
    const konu = k.bilgi || k.mod || k.tip;
    if (!konular.has(konu)) { secilen.push(k); konular.add(konu); }
    if (secilen.length === 3) break;
  }
  return secilen;
}
export function ogrenmeOzeti(gecmis) {
  const secilen = [], konular = new Set();
  for (const k of [...(gecmis || [])].reverse()) {
    const konu = ['plastik','hiyerarsi','metan'].includes(k.bilgi) ? 'dongu'
      : ['fosil','yakma','gunes','ruzgar','batarya'].includes(k.bilgi) ? 'enerji'
      : k.tip === 'hazirlik' ? 'uyum' : k.bilgi || k.mod;
    if (konu && !konular.has(konu) && kararAciklamasi(k)) { secilen.push(k); konular.add(konu); }
    if (secilen.length === 3) break;
  }
  return secilen;
}
