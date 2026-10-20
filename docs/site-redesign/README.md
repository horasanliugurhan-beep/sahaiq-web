# sahaiq.app yeniden tasarım

Issue #11 · başlangıç sürümü `57b5ee5` · dal `codex/site-kurumsal-tasarim`.

Beş sayfa, demo PR #28 ile aynı asfalt/sis/şerit sarısı, Archivo, 1184px grid,
12px kart ve tutarlı boşluklarla düzenlendi. Kurumsal görünüm, projeyi bir
şirket veya ticari hizmet olarak sunmaz. Her sayfanın altbilgisinde
“kişisel ve ticari olmayan bir projedir” açıklaması korunur.

- Archivo, demodaki aynı dosyadan OFL lisansıyla yerel sunulur. Google Fonts
  bağlantıları kaldırıldı ve gizlilik sayfası güncellendi.
- Ana sayfadaki altı rota kaydı, KPI'lar, düşüş örnekleri ve brifing değişmedi.
  Test fikstürü başlangıç sürümünün HTML'inden çıkarıldı.
- Rota ilk açılışta öncelik sırasında görünür. Hareket yalnızca kullanıcının
  “Yeniden sırala” eylemiyle başlar; azaltılmış harekette liste statiktir.
- İç sayfalarda ortak başlık düzeni, bölüm bağlantıları ve okunaklı metin
  alanı vardır. Klavyeyle içeriğe geçiş ve görünür odak sağlanır.
- JSON-LD blokları önceki sürümle aynı; Organization/founder/offers eklenmedi.
  Yeni bağımlılık veya dış servis yoktur.

## Doğrulama

```sh
cd tests
export npm_config_cache=/workspace/.npm-cache
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium
npm ci
npm test
```

Node 24.19.0 / npm 11.9.0 / Chromium 154 ile 29 test geçti; 0 başarısız,
0 atlanan. Mevcut 21 testin tamamı korunur. Masaüstü axe kontrolleri tüm
ihlalleri kapsayacak şekilde sıkılaştırıldı. Ek 8 test; beş sayfada mobil axe,
font yükleme, dış istek olmaması, klavye erişimi, demo çıktısının birebir
korunması, bölüm bağlantıları ve font lisansını doğrular.

`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` bulutta kurulu Chromium'u kullanmak
için isteğe bağlıdır; verilmediğinde mevcut sabit Playwright tarayıcısı
kullanılır. Paket tanımları ve kilit dosyası değişmedi. Sonuçlar yereldir;
GitHub CI veya canlı site yayını sonucu değildir.

[Tam kurulum ve test çıktısı](validation.txt) · [PR açıklaması](PR.md)

## Ekran görüntüleri

Tüm görüntüler 390 × 844 veya 1440 × 1000 tarayıcı boyutunda, Türkçe yerel
ayarla alındı. Öncesi Google Fonts bağlantıları testlerdeki gibi boş
cevaplanarak sistem fontuyla; sonrası yerel Archivo ile görüntülendi.
Aşağıdaki bağlantılar tam sayfa görüntüleridir. Ana sayfanın ilk ekranı da
ayrıca kaydedildi.

| Sayfa | 390px önce | 390px sonra | Masaüstü önce | Masaüstü sonra |
| --- | --- | --- | --- | --- |
| Ana sayfa | [Görüntü](before-index-mobile.png) | [Görüntü](after-index-mobile.png) | [Görüntü](before-index-desktop.png) | [Görüntü](after-index-desktop.png) |
| SSS | [Görüntü](before-sss-mobile.png) | [Görüntü](after-sss-mobile.png) | [Görüntü](before-sss-desktop.png) | [Görüntü](after-sss-desktop.png) |
| Hakkında | [Görüntü](before-hakkinda-mobile.png) | [Görüntü](after-hakkinda-mobile.png) | [Görüntü](before-hakkinda-desktop.png) | [Görüntü](after-hakkinda-desktop.png) |
| Gizlilik | [Görüntü](before-gizlilik-mobile.png) | [Görüntü](after-gizlilik-mobile.png) | [Görüntü](before-gizlilik-desktop.png) | [Görüntü](after-gizlilik-desktop.png) |
| İlk sürüm yazısı | [Görüntü](before-sahaiq-nasil-kurdum-mobile.png) | [Görüntü](after-sahaiq-nasil-kurdum-mobile.png) | [Görüntü](before-sahaiq-nasil-kurdum-desktop.png) | [Görüntü](after-sahaiq-nasil-kurdum-desktop.png) |

İlk ekranlar: [mobil önce](before-index-mobile-viewport.png) /
[mobil sonra](after-index-mobile-viewport.png) ·
[masaüstü önce](before-index-desktop-viewport.png) /
[masaüstü sonra](after-index-desktop-viewport.png).
