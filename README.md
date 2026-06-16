# CompTIA Security+ (SY0-701) Öğrenim Platformu

Kapsamlı ve pratik odaklı CompTIA Security+ sınav hazırlık sistemi.

**Canlı Demo:** [security-ogrenim.vercel.app](https://security-ogrenim.vercel.app)

## Projenin Amacı

CompTIA Security+ (SY0-701) sertifikasyon sınavına hazırlanırken kendi çalışma sürecimi disipline etmek, tekrarlarımı otomatize etmek ve tüm sınav müfredatını tek bir merkezden yönetmek amacıyla bu platformu geliştirdim.

Klasik not tutma yöntemleri yerine; sınavın temel mantığı olan "anahtar kelime (trigger word)" avcılığını ve aralıklı tekrarı merkeze alarak, öğrendiğim teorik bilgileri kalıcı hale getirebileceğim kişisel bir öğrenim üssü inşa ettim.

## Özellikler ve İçerik

* **Domain Takibi:** SY0-701'in güncel sınav ağırlıklarına (Domain 1.0 - 5.0) göre yapılandırılmış konu ve ilerleme sistemi.
* **Kritik Kelimeler (Trigger Words):** Sınav sorularındaki İngilizce terimleri doğrudan hedefe yönelik eşleştiren hızlı analiz modülü.
* **Akıllı Kartlar (Flashcards):** Siber güvenlik terimlerini, akronimlerini ve konseptlerini akılda tutmak için tasarlanmış aralıklı tekrar sistemi.
* **Kelime Defteri:** Sınav İngilizcesinde ve senaryolarda sık karşılaşılan kritik kavramların merkezi takibi. Kendi kelimelerini ekleyip kaydedebileceğin kişisel sözlük.
* **Sınav Simülasyonu:** Gerçek sınav süresi (90 dk) ve orijinal domain ağırlık dağılımına sadık kalınarak hazırlanan deneme sınavı modülü. Domain bazlı performans raporu sunar.
* **Performans Bazlı Sorular (PBQ):** Eşleştirme tipi sorularla gerçek sınav formatına alışma.
* **Log Analizi & Senaryo Soruları:** SIEM/IDS/Firewall log örnekleri üzerinden analiz pratiği ve kurumsal senaryolar üzerinden uygulamalı kavrama.
* **Tekrar Sistemi:** Yanlış cevaplanan ve işaretlenen soruların otomatik biriktirildiği özel tekrar havuzu.
* **Mobil Uyumlu:** Telefon ve tablette de rahatça çalışılabilir arayüz.

## Teknoloji Yığını

* **React 18** + **Vite** — hızlı geliştirme ve derleme
* **Tailwind CSS** — tasarım sistemi
* **Zustand** — durum yönetimi (ilerleme, cevaplar, işaretlemeler)
* **React Router** — sayfa yönlendirme
* **Fuse.js** — sözlük/akronim bulanık arama
* **Vercel** — barındırma

## Veri Saklama

Tüm ilerleme (çözülen sorular, doğruluk oranı, işaretlenen sorular, eklenen kelimeler) tarayıcının **localStorage**'ında saklanır. Sunucu tarafında veritabanı yoktur — her kullanıcının verisi kendi tarayıcısına özeldir ve başka bir kullanıcıyla paylaşılmaz.

## Kurulum & Çalıştırma

```bash
# Projeyi İndir
git clone https://github.com/KULLANICI_ADI/Security-renim.git
cd Security-renim

# Bağımlılıkları Yükle
npm install

# Geliştirme Sunucusunu Başlat
npm run dev
```

## Proje Yapısı

```
src/
├── data/              # Domain içerikleri, sorular, sözlük, akronimler (JSON)
├── pages/             # Sayfa bileşenleri (Dashboard, ModulePage, ExamSimPage, ...)
├── components/        # Yeniden kullanılabilir bileşenler (QuestionCard, Sidebar, ...)
├── store/             # Zustand ile ilerleme durumu yönetimi
└── lib/                # Veri yükleme yardımcı fonksiyonları
```
