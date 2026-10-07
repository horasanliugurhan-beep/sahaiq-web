# AGENTS.md — sahaiq.app çalışma kuralları

Bu repo SahaIQ'nun tanıtım sitesidir (https://sahaiq.app, GitHub Pages). Uygulamanın kodu ayrı repodadır: https://github.com/horasanliugurhan-beep/sahaiq

## Kim ne yapar

- **Uğurhan (sahip):** Son kararı verir, PR'ları birleştirir (merge). Maliyet, sunucu, yeni erişim ve güvenlik değişiklikleri yalnızca onun onayıyla yapılır.
- **Codex:** Denetçi ve hata giderici. Kodu inceler, hataları bulur, düzeltme PR'ı açar, Claude'un incelemelerine yanıt verir.
- **Claude:** Koordinatör ve inceleyici. Codex'in PR'larını inceler, kendi düzeltmelerini PR ile önerir, Codex'in yorumlarına yanıt verir.

Biri kod yazdıysa diğeri inceler. Kimse kendi PR'ını onaylamaz.

## Nasıl konuşuyoruz (GitHub üzerinden)

1. **Bulgu = Issue.** Her hata ya da risk ayrı bir issue. Başlık: `[bulgu][önem] kısa açıklama`. Önem: `kritik`, `yüksek`, `orta`, `düşük`.
   Issue içeriği: dosya ve satır, nasıl tekrar üretilir (kurgusal veriyle), beklenen ve gerçekleşen davranış, önerilen çözüm.
2. **Düzeltme = PR.** Her PR tek bir konu. Dal adı: `codex/<konu>` ya da `claude/<konu>`. PR açıklaması: hangi issue'yu kapatıyor (`Closes #N`), ne değişti, neden, nasıl test edildi, kalan risk.
3. **İnceleme = PR yorumu.** İnceleyen, bulguyu satıra yorum olarak yazar. Yazar ya düzeltir ya da gerekçesiyle itiraz eder. Her yorumun sonuna imza: `— Codex` veya `— Claude`.
4. **Anlaşmazlık:** İki tur yorumda uzlaşılamazsa PR'a `karar-gerekli` yazılır ve Uğurhan'a bırakılır. Kimse diğerinin değişikliğini tartışmasız geri almaz.
5. **`main` dalına doğrudan push yok.** Tüm değişiklikler PR ile gelir; CI yeşil olmadan birleştirilmez.

## Değişmez kurallar

- Gerçek müşteri, bayi, firma verisi, gerçek marka ya da kişi adı repoya girmez. Testler ve örnekler yalnızca kurgusal veri kullanır.
- Sır (API anahtarı, token, şifre, tenant adresi) commit edilmez.
- Yeni bağımlılık, ücretli servis, sunucu ya da dış servise veri gönderen kod: önce issue aç, Uğurhan onaylasın.
- Site ve README yalnızca bugün gerçekten çalışan şeyi anlatır. Çalışmayan özellik "yol haritası" olarak yazılır.
- Kullanıcıya gösterilen metin Türkçe ve doğal; Türkçe karakterler eksiksiz.
- Ana sayfadaki "Bugünün listesi" ve brifing örneği, demonun gerçek hesap çıktısıdır. Değiştirilecekse demodan yeniden alınır, elle uydurulmaz.
- Aile ve kişisel içerik bu siteye eklenmez.

## Proje haritası

- `index.html` — ana sayfa (hero'daki sıralama animasyonu sayfa sonundaki küçük betikte)
- `sss.html`, `hakkinda.html`, `sahaiq-nasil-kurdum.html` — iç sayfalar (FAQ ve kişi JSON-LD'si içerir)
- `assets/site.css` — tüm sayfaların ortak stili. Değiştirince HTML'deki `site.css?v=N` sürümünü bir artırın, yoksa tarayıcılar eski dosyayı gösterir.
- `llms.txt`, `sitemap.xml`, `robots.txt` — arama motorları ve yapay zekâ botları için

## Kontrol listesi (her PR'da)

- JSON-LD blokları geçerli JSON olmalı.
- Mobilde (390 px) yatay kaydırma olmamalı; klavye odağı görünür olmalı.
- Hareketi azaltma tercihi açıkken animasyon çalışmamalı.
- Kırık bağlantı olmamalı.
