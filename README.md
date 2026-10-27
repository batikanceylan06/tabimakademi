# TABİM Akademi – Modüler HTML / CSS / JS

Önceki **Ultra** sürümü, görünüm ve animasyon akışları korunarak kaynak dosyalarına ayrıldı. Derleme, Node veya ek kütüphane gerektirmez.

## Proje yapısı

```text
index.html                       Sayfa içeriği, semantik HTML ve SVG simgeleri
assets/
  css/
    themes.css                   5 yeni tema + klasik, tüm sahneler için renk eşlemesi
    base.css                     Temel stiller, katalog, menü, mobil düzen
    motion.css                   Ortak animasyonlar / scroll reveal / hover
    cinema.css                   İlk üç laptoplu sinematik sahne
    studio.css                   Akademi 360° etkileşimli cihaz alanı
    scenes.css                   Uçan tablet / kartlar / monitör ve telefon sahneleri
    cta.css                      “Yeni bir başlangıç, güvendiğiniz ekiple.” animasyonu
    utilities.css                Tekil örnek veri ölçüleri ve yardımcı sınıflar
  js/
    themes.js                    Tema seçimi, localStorage, erişilebilir panel
    catalog.js                   Eğitim arama, kategori filtreleri, menü ve modal
    motion.js                    Genel hareket, kaydırma ilerlemesi, parallax
    cinema.js                    İlk 3D laptop scroll animasyonları
    studio.js                    Akademi 360° aşamaları ve kontrolleri
    scenes.js                    İki büyük scroll sahnesinin cihaz animasyonları
previews/                        Masaüstü / mobil ekran görüntüleri (opsiyonel)
```

## Canlı renk paletleri

Sol alt köşedeki **Tema** düğmesinden Midnight Ocean, Obsidian Gold, Cosmic Violet, Arctic Minimal, Emerald Night veya orijinal Klasik TABİM seçilebilir. Sayfa yeniden yüklenmeden başlıklar, butonlar, arka planlar, laptop/stüdyo/cihaz sahnelerinin neon renkleri değişir. Tercih `localStorage` ile saklanır (kısıtlı dosya ortamlarında sadece o oturum için geçerli olabilir).

Renkleri düzenlemek için `assets/css/themes.css` içindeki `[data-theme="..."]` değişkenlerini kullan. Palet seçenekleri `index.html` tema panelindedir, etiketler ve kayıt mantığı `assets/js/themes.js` içindedir. Eski JS modülleri değiştirilmedi.

## Çalıştırma

1. `index.html` dosyasını tarayıcıda aç. Yerel (`file://`) olarak da çalışır.
2. İstersen klasörde `python -m http.server 8000` komutunu çalıştırıp `http://localhost:8000` adresinden önizle.
3. Sunucuya aktarırken **index.html ve assets/ klasörünü birlikte** yükle. `previews/` yayınlamak zorunda değilsin.

## Düzenleme

- Sayfanın metinleri, bölüm sırası ve SVG ikonlar için: `index.html`.
- Renkler ve temel düzen için: `assets/css/base.css` (`:root` değişkenleri).
- Laptopların kayma / dönme dereceleri için: `assets/js/cinema.js`.
- Yeni tablet ve cihaz sahneleri için: `assets/js/scenes.js`.
- Eğitim içeriği örnekleri için: `assets/js/catalog.js` ve `index.html` eğitim kartları.
- İletişim sloganı için: `index.html` içindeki `#iletisim` bölümü ve `assets/css/cta.css`.

**Not:** Bu sürüm ön yüz prototipidir; giriş, video barındırma ve üyelik servisine bağlı değildir. Yerel ekran görselleri sadece önizleme içindir. Mobil ve `prefers-reduced-motion` tercihleri korunmuştur.
