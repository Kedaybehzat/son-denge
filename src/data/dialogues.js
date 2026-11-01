// Konuşma metinleri UI'dan ayrı; seçimlerin oyun etkileri state.js'te uygulanır.
export const DIYALOG = {
  giris: 'Bir şey mi konuşmak istedin?',
  secenekler: [
    { id: 'gorev', metin: 'Görevin nasıl gidiyor?' },
    { id: 'ihtiyac', metin: 'Bir şeye ihtiyacın var mı?' },
    { id: 'moral', metin: 'Biraz konuşalım. Birlikte başaracağız.', maliyet: '1 eylem · +4 memnuniyet, −1 yorgunluk' },
    { id: 'soz', metin: 'Yarın dinlenmen için söz veriyorum.', maliyet: 'Yarın Dinlen görevi ver; söz tutulursa güven artar' },
    { id: 'dinlen', metin: 'Bugün dinlenmeni istiyorum.', maliyet: 'Üretimden ayrılır; görev değişir' },
    { id: 'bitir', metin: 'Sonra görüşürüz.' },
  ],
  gorev: (ad) => `Bugün ${ad} görevindeyim. Buradaki herkesin yaptığı iş birbirine bağlı.`,
  dinlen: 'Teşekkür ederim. Bugün dinleneceğim; görevimi devralacak biri varsa iyi olur.',
  moral: 'Bunu duymak iyi geldi. Burada yalnız olmadığımı bilmek yetiyor bazen.',
  yorgun: 'Biraz dinlenmeye ihtiyacım var. Böyle devam edersem işimi iyi yapamayacağım.',
  iyi: 'Şimdilik iyiyim. Kaynakları ve görevleri dengede tuttuğumuz sürece devam edebilirim.',
  cocuk: 'Bugün burada güvende olduğumuzu bilmek güzel. Hep birlikte kalabilecek miyiz?',
  durak: 'İnşaat duruyor. İstersen beni başka bir işe verebilirsin.',
  yetersiz: 'Şu an uygun değil. Önce işlerimizi ve zamanımızı düzenleyelim.',
};
