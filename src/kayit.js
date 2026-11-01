// Yalnız oyun verisi saklanır; Phaser/DOM/Audio nesneleri kayda girmez.
export const KAYIT_ANAHTARI = 'sondenge:gun-basi:v1';
export function kayitGecerliMi(k) {
  const s = k?.durum;
  return k?.surum === 1 && !!s && Number.isInteger(s.gun) && s.gun >= 1 && s.gun <= 5
    && !s.bitti && ['enerji','su','gida','atik','karbon'].every(ad => Number.isFinite(s.kaynak?.[ad]) && s.kaynak[ad] >= 0 && s.kaynak[ad] <= 100)
    && Array.isArray(s.sakinler) && s.sakinler.length > 0 && s.sakinler.every(s => Number.isInteger(s.uid) && typeof s.id === 'string')
    && ['planlar','sozler','sozGecmisi','hedefler','yapilar','sohbetEdilenler'].every(ad => Array.isArray(s[ad]))
    && (s.kararGecmisi === undefined || (Array.isArray(s.kararGecmisi) && s.kararGecmisi.every(k => k && Number.isInteger(k.gun) && typeof k.tip === 'string')))
    && Array.isArray(s.arastirma?.acik) && !!s.arastirma?.puan && !!s.makineModlari && !!s.makineAsinma && Number.isFinite(s.malzeme)
    && Number.isFinite(s.memnuniyet) && Number.isFinite(s.insanlik) && Number.isInteger(s.eylem);
}
export function gunBasiniKaydet(durum) {
  try {
    const k = { surum: 1, tarih: new Date().toISOString(), durum: JSON.parse(JSON.stringify(durum)) };
    if (!kayitGecerliMi(k)) return false;
    localStorage.setItem(KAYIT_ANAHTARI, JSON.stringify(k)); return true;
  } catch { return false; }
}
export function kayitOku() {
  try { const k = JSON.parse(localStorage.getItem(KAYIT_ANAHTARI)); return kayitGecerliMi(k) ? k : null; } catch { return null; }
}
export function kaydiSil() { try { localStorage.removeItem(KAYIT_ANAHTARI); } catch {} }
