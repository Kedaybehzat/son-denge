// oda-*-tam.png görselleri (1808/1809 × 836) görsel olarak incelenerek
// işaretlendi. x/y görsel oranıdır; bolge [sol, üst, sağ, alt].
// Bunlar üretim hesabını değiştirmeyen görsel çalışma hedefleridir.
export const SAKIN_AKTIVITELERI = {
  yasam: [
    { id: 'kitaplik', ad: 'Kitaplığı inceliyor', x: .16, y: .58, tur: 'incele', bolge: [.04,.50,.28,.75] },
    { id: 'yatak', ad: 'Yatağı düzenliyor', x: .43, y: .62, tur: 'duzenle', bolge: [.30,.51,.56,.75] },
    { id: 'radyo', ad: 'Radyoyu dinliyor', x: .63, y: .56, tur: 'incele', bolge: [.60,.49,.66,.60] },
    { id: 'pano', ad: 'Notları inceliyor', x: .91, y: .40, tur: 'incele', bolge: [.84,.29,.98,.53] },
  ],
  enerji: [
    { id: 'jenerator', ad: 'Jeneratörü kontrol ediyor', x: .16, y: .58, tur: 'onar', bolge: [.04,.34,.27,.72] },
    { id: 'gunes-numune', ad: 'Panelleri inceliyor', x: .30, y: .43, tur: 'incele', bolge: [.22,.37,.37,.46] },
    { id: 'tezgah', ad: 'Parçaları onarıyor', x: .48, y: .56, tur: 'onar', bolge: [.30,.50,.62,.73] },
    { id: 'konsol', ad: 'Üretimi kontrol ediyor', x: .73, y: .41, tur: 'incele', bolge: [.64,.27,.82,.51] },
    { id: 'batarya-rafi', ad: 'Bataryaları kontrol ediyor', x: .90, y: .54, tur: 'onar', bolge: [.84,.26,.97,.74] },
  ],
  su: [
    { id: 'filtre-rafi', ad: 'Filtreleri düzenliyor', x: .14, y: .57, tur: 'duzenle', bolge: [.04,.36,.24,.75] },
    { id: 'tank-1', ad: 'Tank vanasını kontrol ediyor', x: .38, y: .64, tur: 'onar', bolge: [.30,.20,.45,.75] },
    { id: 'tank-2', ad: 'Su seviyesini kontrol ediyor', x: .54, y: .48, tur: 'incele', bolge: [.46,.20,.62,.75] },
    { id: 'aritma', ad: 'Filtreleri kontrol ediyor', x: .71, y: .48, tur: 'onar', bolge: [.64,.29,.77,.63] },
    { id: 'lavabo', ad: 'Suyu kontrol ediyor', x: .87, y: .56, tur: 'incele', bolge: [.79,.48,.96,.76] },
  ],
  sera: [
    { id: 'sulama-kabi', ad: 'Sulama kabını hazırlıyor', x: .13, y: .71, tur: 'duzenle', bolge: [.10,.65,.15,.77] },
    { id: 'domates', ad: 'Domatesleri suluyor', x: .27, y: .55, tur: 'sula', bolge: [.16,.42,.39,.64] },
    { id: 'marul', ad: 'Marullarla ilgileniyor', x: .46, y: .60, tur: 'sula', bolge: [.39,.53,.53,.64] },
    { id: 'biber', ad: 'Biberleri kontrol ediyor', x: .61, y: .55, tur: 'sula', bolge: [.53,.45,.66,.65] },
    { id: 'fide-rafi', ad: 'Fideleri suluyor', x: .75, y: .53, tur: 'sula', bolge: [.68,.37,.82,.70] },
    { id: 'saksi-tezgahi', ad: 'Saksıları düzenliyor', x: .88, y: .56, tur: 'duzenle', bolge: [.83,.45,.96,.59] },
  ],
  geri: [
    { id: 'hurda-kasalari', ad: 'Parçaları ayırıyor', x: .12, y: .62, tur: 'duzenle', bolge: [.03,.45,.19,.75] },
    { id: 'ayristirma-konsolu', ad: 'Ayrıştırmayı kontrol ediyor', x: .29, y: .53, tur: 'incele', bolge: [.25,.34,.33,.75] },
    { id: 'onarim-tezgahi', ad: 'Aletleri onarıyor', x: .50, y: .55, tur: 'onar', bolge: [.34,.46,.67,.75] },
    { id: 'malzeme-rafi', ad: 'Malzemeleri sınıflıyor', x: .83, y: .56, tur: 'duzenle', bolge: [.74,.25,.93,.74] },
    { id: 'varil', ad: 'Varili kontrol ediyor', x: .95, y: .64, tur: 'incele', bolge: [.92,.50,.99,.76] },
  ],
};
export function sakinOdaTipi(gorev, insaatOdasi = 'yasam') {
  return ({ enerji: 'enerji', su: 'su', sera: 'sera', geriDonusum: 'geri', insaat: insaatOdasi })[gorev] || 'yasam';
}
