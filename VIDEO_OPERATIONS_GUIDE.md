# Video Çekimi İşlem Rehberi
## Adım Adım Ne Yapmalıyım?

---

## 🎬 Video Bölümleri ve İşlemler

### 📋 HAZIRLIK (Kayıt Öncesi)

#### 1. Ortam Hazırlığı
- [ ] Terminal'i aç (VS Code terminal veya iTerm)
- [ ] Proje dizinine git: `cd /Users/nihataltuntas/Desktop/projeler/entrofhe`
- [ ] Frontend URL'ini hazırla (Vercel deployment URL)
- [ ] Browser'ı aç (Chrome/Firefox)
- [ ] Ekran kayıt yazılımını aç (OBS Studio, Loom, veya QuickTime)
- [ ] Mikrofonu test et

#### 2. Test Verileri Hazırlığı
- [ ] Frontend'de wallet bağlı olsun (MetaMask/Backpack)
- [ ] Sepolia testnet'te biraz ETH olsun (test için)
- [ ] Live examples'ların çalıştığından emin ol

---

## 🎥 BÖLÜM 1: Introduction (0:00-0:15) - 15 saniye

### Yapılacaklar:
1. **Ekran:** GitHub repo veya README.md göster
2. **Konuş:** Script'teki introduction metnini oku
3. **Göster:** 
   - Ana dizin yapısını göster (examples/, automation/, base-template/)
   - README.md'deki "22 examples" ifadesini göster

### Komutlar:
```bash
# Terminal'de göster:
ls -la
cat README.md | head -20
```

### Ekran Görüntüleri:
- Ana dizin yapısı
- README.md başlığı
- "22 examples" ifadesi

---

## 🎥 BÖLÜM 2: Live Examples Demo (0:15-0:50) - 35 saniye

### Yapılacaklar:

#### 2.1 Simple Lottery (10 saniye)
1. **Browser'da:** Frontend URL'ini aç
2. **Tıkla:** "Examples" sayfasına git
3. **Tıkla:** "Live Examples" tab'ına geç
4. **Tıkla:** "Simple Lottery" kartını seç
5. **Göster:** 
   - "Enter Lottery" butonuna tıkla
   - Transaction'ı göster (wallet onayı)
   - "Select Winner" butonuna tıkla
   - Winner seçimini göster

**Konuş:** "First, Simple Lottery - users can enter and we select a winner using encrypted entropy."

#### 2.2 Random Number Generator (10 saniye)
1. **Tıkla:** "Random Number Generator" kartını seç
2. **Göster:**
   - "Generate Random Number" butonuna tıkla
   - Encrypted result'ı göster
   - Decrypt butonuna tıkla (opsiyonel)

**Konuş:** "Next, Random Number Generator - generates encrypted random numbers."

#### 2.3 EntropyNFT (15 saniye)
1. **Tıkla:** "EntropyNFT" kartını seç
2. **Göster:**
   - "Mint NFT" butonuna tıkla
   - Transaction'ı göster
   - NFT metadata'sını göster (IPFS link)
   - NFT görselini göster (eğer varsa)

**Konuş:** "And EntropyNFT - mint real NFTs with IPFS metadata using entropy."

### Frontend URL:
- Vercel deployment URL'inizi kullanın
- Örnek: `https://entrofhe.vercel.app/examples`

---

## 🎥 BÖLÜM 3: Automation Tools (0:50-1:20) - 30 saniye

### Yapılacaklar:

#### 3.1 Automation Scripts Gösterimi (5 saniye)
1. **Terminal'de:** `automation/` klasörünü göster
2. **Göster:** Script dosyalarını listele

```bash
# Terminal komutları:
cd /Users/nihataltuntas/Desktop/projeler/entrofhe
ls -la automation/
```

**Konuş:** "Our automation tools make it easy to create new examples."

#### 3.2 Yeni Example Oluşturma (20 saniye)
1. **Terminal'de:** `create-example` komutunu çalıştır
2. **Göster:** Komutun çalışmasını izle
3. **Göster:** Oluşan yeni example klasörünü göster

```bash
# Terminal komutları:
npm run create-example -- --name VideoDemo --category basic --description "Demo example for video"
```

**Bekle:** Komutun tamamlanmasını bekle (5-10 saniye)

**Göster:**
```bash
# Oluşan example'ı göster:
ls -la examples/basic-videodemo/
cat examples/basic-videodemo/README.md | head -30
```

**Konuş:** "Watch as I create a new example with one command..."

#### 3.3 Documentation Generation (5 saniye)
1. **Terminal'de:** `generate-docs` komutunu çalıştır
2. **Göster:** Documentation'ın oluşmasını göster

```bash
# Terminal komutları:
npm run generate-docs
```

**Göster:**
```bash
# Oluşan docs'u göster:
ls -la docs/examples/
```

**Konuş:** "...and generate documentation automatically from code annotations."

---

## 🎥 BÖLÜM 4: Tutorial Examples (1:20-1:45) - 25 saniye

### Yapılacaklar:

#### 4.1 Frontend Tutorial Examples (15 saniye)
1. **Browser'da:** Frontend'de "Tutorial Examples" tab'ına geç
2. **Göster:**
   - Example listesini göster (scroll yap)
   - Bir example seç (örn: "EntropyCounter")
   - "Test" butonuna tıkla
   - Test sonucunu göster (başarılı olmalı)
   - "Compile" butonuna tıkla
   - Compile sonucunu göster

**Konuş:** "All 22 examples are available in our frontend with full test, compile, deploy, and verify functionality."

#### 4.2 Example Categories (10 saniye)
1. **Göster:** Category dropdown'ı göster
2. **Tıkla:** Farklı kategorileri göster (Basic, Encryption, Advanced, vb.)
3. **Göster:** Her kategorideki example'ları göster

**Konuş:** "Developers can learn FHEVM concepts through interactive examples."

---

## 🎥 BÖLÜM 5: Closing (1:45-2:00) - 15 saniye

### Yapılacaklar:

#### 5.1 GitHub Repository (10 saniye)
1. **Browser'da:** GitHub repo'yu aç
2. **Göster:**
   - Ana sayfayı göster
   - "22 examples" ifadesini göster
   - README.md'yi göster
   - Automation klasörünü göster

**GitHub URL:** `https://github.com/zacnider/entrofhe`

**Konuş:** "Check out our GitHub repository for all 22 examples, automation tools, and comprehensive documentation."

#### 5.2 Final Message (5 saniye)
1. **Ekran:** README.md'deki "Built with Zama FHEVM" ifadesini göster
2. **Göster:** Zama FHEVM logo veya link

**Konuş:** "Built entirely with Zama FHEVM. Thank you!"

---

## 📝 DETAYLI KOMUT LİSTESİ

### Terminal Komutları (Sırayla)

```bash
# 1. Proje dizinine git
cd /Users/nihataltuntas/Desktop/projeler/entrofhe

# 2. Ana yapıyı göster
ls -la
tree -L 2 -d  # Eğer tree yüklüyse

# 3. Examples sayısını göster
ls examples/ | wc -l

# 4. Automation scripts'i göster
ls -la automation/

# 5. Yeni example oluştur (video için)
npm run create-example -- --name VideoDemo --category basic --description "Demo example for video"

# 6. Oluşan example'ı göster
ls -la examples/basic-videodemo/
cat examples/basic-videodemo/README.md | head -30

# 7. Documentation generate et
npm run generate-docs

# 8. Oluşan docs'u göster
ls -la docs/examples/
```

---

## 🎯 ÖNEMLİ NOTLAR

### Video Çekimi İçin:
1. **Hızlandırma:** Automation komutlarını hızlandırabilirsin (post-production'da)
2. **Duraklatma:** Önemli ekranlarda 1-2 saniye bekle
3. **Zoom:** Terminal'de font size'ı büyüt (daha okunabilir olsun)
4. **Cursor:** Mouse cursor'ı görünür tut
5. **Smooth Scrolling:** Browser'da smooth scroll kullan

### Hata Durumunda:
- Eğer bir komut hata verirse, durdur ve tekrar dene
- Video'yu kesip yapıştırabilirsin (post-production)
- En iyi take'i kullan

### Timing İpuçları:
- **0:00-0:15:** Hızlı geç (sadece intro)
- **0:15-0:50:** Yavaş geç (live demolar önemli)
- **0:50-1:20:** Orta hız (automation gösterimi)
- **1:20-1:45:** Hızlı geç (tutorial examples)
- **1:45-2:00:** Yavaş geç (closing önemli)

---

## 🎬 ÇEKİM SENARYOSU (Adım Adım)

### Senaryo 1: Tek Çekim (Önerilen)
1. Tüm bölümleri tek seferde çek
2. Hataları post-production'da düzelt
3. Daha doğal görünür

### Senaryo 2: Bölüm Bölüm
1. Her bölümü ayrı çek
2. Post-production'da birleştir
3. Daha kontrollü

---

## 📋 KONTROL LİSTESİ

### Çekim Öncesi:
- [ ] Terminal hazır
- [ ] Browser açık
- [ ] Frontend deploy edilmiş ve çalışıyor
- [ ] Wallet bağlı ve Sepolia'da ETH var
- [ ] Ekran kayıt yazılımı açık
- [ ] Mikrofon test edildi
- [ ] Script ezberlendi veya hazır

### Çekim Sırası:
- [ ] Bölüm 1: Introduction ✓
- [ ] Bölüm 2: Live Examples ✓
- [ ] Bölüm 3: Automation ✓
- [ ] Bölüm 4: Tutorial Examples ✓
- [ ] Bölüm 5: Closing ✓

### Çekim Sonrası:
- [ ] Video 2 dakikayı geçmiyor
- [ ] Ses kalitesi iyi
- [ ] Ekran görüntüleri net
- [ ] Tüm özellikler gösterildi
- [ ] YouTube/Loom'a yüklendi

---

## 🚀 HIZLI BAŞLANGIÇ

### En Basit Versiyon (Eğer zaman kısıtlıysa):

1. **Frontend'i aç** → Live examples göster (30 saniye)
2. **Terminal'de** → `npm run create-example` komutunu çalıştır (20 saniye)
3. **Frontend'de** → Tutorial examples göster (20 saniye)
4. **GitHub'ı aç** → Repo göster (10 saniye)
5. **Kapanış** → "Built with Zama FHEVM" (10 saniye)

**Toplam: ~90 saniye** (2 dakika içinde rahatça sığar)

---

## 💡 İPUÇLARI

1. **Pratik Yap:** Önce birkaç kez prova çek
2. **Script'i Oku:** Video çekmeden önce script'i 2-3 kez oku
3. **Hızlandır:** Post-production'da yavaş kısımları hızlandır
4. **Kes-Yapıştır:** Hataları kes, iyi kısımları birleştir
5. **Alt Yazı:** İsterseniz İngilizce alt yazı ekle

---

## ✅ BAŞARILAR!

Bu rehberi takip ederek profesyonel bir video çekebilirsin. Unutma:
- **Sakin ol** - Hata yaparsan durdur, tekrar dene
- **Doğal konuş** - Mükemmel olmak zorunda değil
- **Eğlen** - Bu senin projen, gurur duy!

Good luck! 🎬🚀

