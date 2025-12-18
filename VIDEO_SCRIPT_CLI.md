# 🎬 EntroFHE CLI Video Script (1.5 Dakika)

## 📋 Video Özeti
- **Süre**: 1.5 dakika (90 saniye)
- **Amaç**: Projeyi tanıtmak ve CLI kullanımını göstermek
- **Hedef Kitle**: Developers interested in FHEVM and EntropyOracle

---

## ⏱️ Timing Breakdown

### 0:00 - 0:15 (15 saniye) - Proje Tanıtımı
### 0:15 - 0:45 (30 saniye) - CLI Demo
### 0:45 - 1:15 (30 saniye) - Oluşturulan Proje
### 1:15 - 1:30 (15 saniye) - Kapanış

---

## 🎥 Detaylı Script

### BÖLÜM 1: Proje Tanıtımı (0:00 - 0:15)

**Ekran Görüntüsü:**
- GitHub repo: `https://github.com/zacnider/entrofhe`
- Veya frontend: `https://entrofhe.vercel.app`

**Söylenecekler (İngilizce):**
```
"EntroFHE is a comprehensive FHEVM example hub with EntropyOracle integration. 
We have 22 production-ready examples, all using Zama FHEVM and encrypted randomness. 
Today, I'll show you how to generate any example in seconds using our CLI tool."
```

**Türkçe Okunuş:**
```
"EntroFHE, EntropyOracle entegrasyonlu kapsamlı bir FHEVM örnek merkezidir. 
22 adet production-ready örneğimiz var, hepsi Zama FHEVM ve şifreli rastgelelik kullanıyor. 
Bugün size CLI tool ile herhangi bir örneği saniyeler içinde nasıl oluşturacağınızı göstereceğim."
```

**Yapılacaklar:**
1. GitHub repo'yu veya frontend'i aç
2. README'yi göster (kısa bir scroll)
3. Examples listesini göster

---

### BÖLÜM 2: CLI Demo (0:15 - 0:45)

**Ekran Görüntüsü:**
- Terminal ekranı

**Söylenecekler (İngilizce):**
```
"Let's use the CLI. First, I'll list all available examples. 
As you can see, we have 22 examples organized by category. 
Now, I'll create the EntropyCounter example by simply entering number 1."
```

**Türkçe Okunuş:**
```
"CLI'yi kullanalım. Önce tüm mevcut örnekleri listeleyeceğim. 
Gördüğünüz gibi, kategorilere göre düzenlenmiş 22 örneğimiz var. 
Şimdi, sadece 1 numarasını girerek EntropyCounter örneğini oluşturacağım."
```

**Yapılacaklar:**
1. Terminal'i aç
2. `entrofhe list` komutunu çalıştır
3. Liste çıktısını göster (hızlı scroll)
4. `entrofhe` komutunu çalıştır (interactive mode)
5. Numara girişi yap (1)
6. Output directory girişi yap (./my-entropy-counter)
7. Generation sürecini göster

**Terminal Komutları:**
```bash
# 1. List examples
entrofhe list

# 2. Interactive mode
entrofhe
# Enter: 1
# Output: ./my-entropy-counter
```

**Ekran Görüntüleri:**
- ✅ Numbered list output
- ✅ Interactive prompt
- ✅ Generation progress
- ✅ Success message

---

### BÖLÜM 3: Oluşturulan Proje (0:45 - 1:15)

**Ekran Görüntüsü:**
- VS Code veya file explorer
- Oluşturulan proje klasörü

**Söylenecekler (İngilizce):**
```
"Perfect! The project is ready. Let me show you what was generated. 
You get a complete Hardhat project with EntropyOracle integration, 
test files, deployment scripts, and all dependencies installed. 
You can immediately run tests or deploy to Sepolia."
```

**Türkçe Okunuş:**
```
"Mükemmel! Proje hazır. Oluşturulanları göstereyim. 
EntropyOracle entegrasyonlu tam bir Hardhat projesi, 
test dosyaları, deployment script'leri ve tüm bağımlılıklar yüklü. 
Hemen test çalıştırabilir veya Sepolia'ya deploy edebilirsiniz."
```

**Yapılacaklar:**
1. Oluşturulan klasörü aç
2. Dosya yapısını göster:
   - `contracts/EntropyCounter.sol`
   - `contracts/interfaces/IEntropyOracle.sol`
   - `test/EntropyCounter.test.ts`
   - `package.json`
   - `README.md`
3. Contract dosyasını aç (ilk birkaç satır)
4. EntropyOracle kullanımını göster

**Gösterilecek Dosyalar:**
```
my-entropy-counter/
├── contracts/
│   ├── EntropyCounter.sol      ← Show this
│   └── interfaces/
│       └── IEntropyOracle.sol  ← Show this
├── test/
│   └── EntropyCounter.test.ts  ← Mention
├── package.json                ← Mention
└── README.md                   ← Mention
```

**Highlight Edilecekler:**
- ✅ EntropyOracle import
- ✅ IEntropyOracle interface
- ✅ Contract structure
- ✅ Ready-to-use code

---

### BÖLÜM 4: Kapanış (1:15 - 1:30)

**Ekran Görüntüsü:**
- GitHub repo veya frontend
- CLI komutları

**Söylenecekler (İngilizce):**
```
"That's it! In just seconds, you have a complete FHEVM project with EntropyOracle. 
Check out our GitHub for all 22 examples, or visit our documentation. 
Start building confidential smart contracts today!"
```

**Türkçe Okunuş:**
```
"İşte bu kadar! Sadece saniyeler içinde, EntropyOracle ile tam bir FHEVM projeniz var. 
Tüm 22 örnek için GitHub'ımıza bakın veya dokümantasyonumuzu ziyaret edin. 
Bugün gizli akıllı sözleşmeler oluşturmaya başlayın!"
```

**Yapılacaklar:**
1. GitHub linkini göster
2. CLI komutunu tekrar göster: `npx entrofhe-cli`
3. Frontend linkini göster (opsiyonel)
4. Call-to-action

**Gösterilecek Linkler:**
- GitHub: `https://github.com/zacnider/entrofhe`
- CLI: `npx entrofhe-cli`
- Docs: `https://entrofhe.vercel.app/docs`

---

## 📝 Adım Adım Checklist

### Hazırlık
- [ ] Terminal'i temizle ve hazırla
- [ ] VS Code veya file explorer'ı hazırla
- [ ] GitHub repo'yu aç
- [ ] Test klasörü oluştur (örn: `/tmp/video-demo`)

### Çekim
- [ ] **0:00-0:15**: Proje tanıtımı (GitHub/frontend)
- [ ] **0:15-0:30**: `entrofhe list` komutu
- [ ] **0:30-0:45**: `entrofhe` interactive mode + generation
- [ ] **0:45-1:00**: Oluşturulan proje yapısı
- [ ] **1:00-1:15**: Contract dosyası gösterimi
- [ ] **1:15-1:30**: Kapanış + linkler

### Post-Production
- [ ] Video'yu 1.5 dakikaya kısalt
- [ ] Smooth transitions ekle
- [ ] Text overlay'ler ekle (komutlar, linkler)
- [ ] Background music (opsiyonel, düşük ses)
- [ ] Thumbnail oluştur

---

## 🎨 Görsel Öneriler

### Text Overlays
- Komutları göster: `entrofhe list`, `entrofhe create 1`
- Linkleri göster: GitHub, Documentation
- Önemli noktaları vurgula: "22 Examples", "EntropyOracle Integration"

### Zoom & Focus
- Terminal çıktısına zoom yap
- Contract koduna zoom yap
- Dosya yapısına zoom yap

### Transitions
- Smooth fade between sections
- Quick cuts for terminal commands
- Slow pan for code viewing

---

## 💡 İpuçları

1. **Hız**: Terminal komutlarını hızlı göster, ama okunabilir olsun
2. **Odak**: Her bölümde tek bir şeye odaklan
3. **Açıklık**: Komutları ve çıktıları net göster
4. **Akıcılık**: Kesintisiz bir akış sağla
5. **Call-to-Action**: Sonunda net bir CTA ekle

---

## 📊 Timing Özeti

| Zaman | Bölüm | Süre | Ana Aktivite |
|-------|-------|------|--------------|
| 0:00-0:15 | Tanıtım | 15s | Proje gösterimi |
| 0:15-0:30 | CLI List | 15s | `entrofhe list` |
| 0:30-0:45 | CLI Create | 15s | `entrofhe` + generation |
| 0:45-1:00 | Proje Yapısı | 15s | Dosya gösterimi |
| 1:00-1:15 | Code Demo | 15s | Contract kodu |
| 1:15-1:30 | Kapanış | 15s | Linkler + CTA |

**Toplam: 90 saniye (1.5 dakika)**

---

## 🎯 Ana Mesajlar

1. ✅ **EntroFHE = 22 EntropyOracle-integrated examples**
2. ✅ **CLI = Instant project generation**
3. ✅ **Ready-to-use = Tests + Deploy scripts included**
4. ✅ **Open Source = GitHub'da mevcut**

---

## 📱 Platform Önerileri

- **YouTube**: Ana platform
- **Twitter/X**: Kısa clip (30 saniye)
- **LinkedIn**: Professional network
- **GitHub**: README'ye embed

---

**Hazır! 🎬 İyi çekimler!**

