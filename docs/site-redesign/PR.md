Closes #11

Site, demo PR #28 ile aynı görsel dilde yeniden düzenlendi: asfalt/sis/şerit sarısı, yerel Archivo, 1184px grid, 12px kartlar ve tutarlı tipografi/boşluklar. Ana sayfada gerçek demo çıktısını taşıyan rota önizlemesi; SSS, Hakkında, Gizlilik ve ilk sürüm yazısında ortak başlık, bölüm bağlantıları ve okunaklı metin alanları var.

Rota ilk açılışta doğru öncelik sırasındadır; animasyon yalnızca “Yeniden sırala” ile başlar ve hareket azaltma tercihini korur. Google Fonts çağrıları kaldırıldı; demodaki aynı Archivo dosyası OFL lisansıyla eklendi, gizlilik metni güncellendi. Yerel site simgesi ve klavyeyle içeriğe geçiş bağlantısı eklendi.

“Kurumsal” yalnızca görünümdür. Her sayfada “kişisel ve ticari olmayan bir projedir” açıklaması korunur. Ticari teklif, şirket/ekip iddiası, müşteri logosu veya uydurulmuş veri eklenmedi. Altı demo kaydı, KPI'lar, düşüş değerleri ve brifing örneği değişmedi. JSON-LD blokları da aynı; Organization/founder/offers eklenmedi. Yeni bağımlılık veya dış servis yok.

### Doğrulama

```text
$ cd tests
$ npm ci
added 6 packages

$ npm test
Running 29 tests using 2 workers
29 passed
```

Mevcut 21 test korundu; axe denetimi tüm ihlalleri kapsayacak şekilde sıkılaştırıldı. Ek 8 test, tüm sayfalarda mobil axe/yerel font/dış istek olmaması/klavye erişimi, orijinal demo çıktısıyla birebir karşılaştırma, bölüm bağlantıları ve font lisansını doğrular.

Bulut ortamında Node 24.19.0 ve kurulu Chromium 154 kullanıldı (`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`). Değişken verilmezse mevcut sabit Playwright tarayıcısı kullanılır. Sonuçlar yereldir; CI veya canlı yayının doğrulandığı anlamına gelmez.

[Tam test çıktısı](https://github.com/horasanliugurhan-beep/sahaiq-web/blob/codex/site-kurumsal-tasarim/docs/site-redesign/validation.txt) · [Beş sayfanın tüm öncesi/sonrası görüntüleri](https://github.com/horasanliugurhan-beep/sahaiq-web/blob/codex/site-kurumsal-tasarim/docs/site-redesign/README.md)

### İlk ekran: 390px mobil

| Önce | Sonra |
| --- | --- |
| ![Mobil önce](https://raw.githubusercontent.com/horasanliugurhan-beep/sahaiq-web/codex/site-kurumsal-tasarim/docs/site-redesign/before-index-mobile-viewport.png) | ![Mobil sonra](https://raw.githubusercontent.com/horasanliugurhan-beep/sahaiq-web/codex/site-kurumsal-tasarim/docs/site-redesign/after-index-mobile-viewport.png) |

### İlk ekran: 1440px masaüstü

| Önce | Sonra |
| --- | --- |
| ![Masaüstü önce](https://raw.githubusercontent.com/horasanliugurhan-beep/sahaiq-web/codex/site-kurumsal-tasarim/docs/site-redesign/before-index-desktop-viewport.png) | ![Masaüstü sonra](https://raw.githubusercontent.com/horasanliugurhan-beep/sahaiq-web/codex/site-kurumsal-tasarim/docs/site-redesign/after-index-desktop-viewport.png) |

Öncesinde dış font istekleri test düzeninde boş cevaplandı; sonrasında yerel Archivo kullanıldı. Tam sayfa görüntüleri de aynı 390 × 844 ve 1440 × 1000 tarayıcı boyutlarıyla kaydedildi.

— Codex
