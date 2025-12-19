# 🛠️ CLI Tool Önerisi: `entrofhe-cli`

## 📋 Özet

`entrofhe` projesine **npm package olarak yayınlanabilir bir CLI tool** eklenmesi önerisi. Bu tool, kullanıcıların EntropyOracle entegrasyonlu FHEVM example'larını kolayca generate etmesini sağlayacak.

---

## 🎯 Amaç

1. **Kolay Kullanım**: `npx entrofhe-cli` ile herkesin kullanabileceği bir tool
2. **EntropyOracle Odaklı**: Tüm generate edilen example'lar EntropyOracle entegrasyonlu olacak
3. **Standalone Repository**: Her example bağımsız bir repository olarak oluşturulacak
4. **Interaktif Menu**: Kullanıcı dostu interaktif seçim menüsü

---

## 🏗️ Mimari Önerisi

### 1. **Proje Yapısı**

```
entrofhe/
├── cli/                          # Yeni CLI tool klasörü
│   ├── src/
│   │   ├── index.ts              # CLI entry point
│   │   ├── main.ts               # Ana CLI logic
│   │   ├── prompts.ts            # Interaktif prompt'lar
│   │   ├── generator.ts          # Example generation logic
│   │   └── utils.ts              # Yardımcı fonksiyonlar
│   ├── package.json              # CLI package.json (ayrı)
│   ├── tsconfig.json
│   └── README.md
├── automation/                   # Mevcut (değişmeyecek)
├── base-template/                # Mevcut (kullanılacak)
└── examples/                     # Mevcut (referans olarak)
```

### 2. **CLI Package Yapısı**

```json
{
  "name": "entrofhe-cli",
  "version": "1.0.0",
  "description": "CLI tool to generate EntropyOracle-integrated FHEVM examples",
  "bin": {
    "entrofhe": "./dist/index.js"
  },
  "main": "./dist/index.js",
  "files": [
    "dist",
    "templates"
  ]
}
```

---

## ✨ Özellikler

### 1. **Interaktif Menu**

```bash
$ npx entrofhe-cli

╔══════════════════════════════════════════════════════════╗
║  Welcome to EntropyOracle FHEVM CLI v1.0.0              ║
╚══════════════════════════════════════════════════════════╝

  ██████╗ ████████╗██████╗  ██████╗ ███████╗██╗  ██╗███████╗
  ██╔══██╗╚══██╔══╝██╔══██╗██╔═══██╗██╔════╝██║  ██║██╔════╝
  ██████╔╝   ██║   ██████╔╝██║   ██║█████╗  ███████║█████╗
  ██╔══██╗   ██║   ██╔══██╗██║   ██║██╔══╝  ██╔══██║██╔══╝
  ██║  ██║   ██║   ██║  ██║╚██████╔╝███████╗██║  ██║███████╗
  ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝

  The ultimate EntropyOracle-powered FHEVM example generator

✔ CLI loaded. Press Enter to continue

? Select a category:
  ❯ Basic (EntropyOracle integration)
    Encryption (EntropyOracle integration)
    User Decryption (EntropyOracle integration)
    Public Decryption (EntropyOracle integration)
    Access Control (EntropyOracle integration)
    Input Proof (EntropyOracle integration)
    Anti-Patterns (EntropyOracle integration)
    Handles (EntropyOracle integration)
    Advanced (Live contracts with EntropyOracle)
    OpenZeppelin (EntropyOracle integration)

? Select an example:
  ❯ EntropyCounter
    EntropyArithmetic
    EntropyEqualityComparison

? Enter output directory: [./my-entropy-counter]

? Include EntropyOracle setup? (Y/n): Y

Creating example: EntropyCounter
Category: basic
Output: ./my-entropy-counter

✔ Template copied
✔ Contract generated
✔ Test file generated
✔ EntropyOracle integration added
✔ Dependencies installed
✔ Ready to use!

Next steps:
  cd my-entropy-counter
  npm test
  npm run deploy:sepolia
```

### 2. **Direct Mode (Non-Interactive)**

```bash
# Direct example generation
$ npx entrofhe-cli entropy-counter ./my-project

# With options
$ npx entrofhe-cli entropy-counter ./my-project --entropy-oracle 0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361
```

### 3. **Example List**

```bash
$ npx entrofhe-cli list

Available examples:

Basic:
  - entropy-counter
  - entropy-arithmetic
  - entropy-equality-comparison

Encryption:
  - entropy-encryption
  - entropy-encrypt-multiple
  ...
```

### 4. **Help**

```bash
$ npx entrofhe-cli --help

Usage: entrofhe-cli [command] [options]

Commands:
  [no command]    Interactive mode
  list            List all available examples
  create <name>   Create example directly
  version         Show version

Options:
  --output, -o    Output directory
  --entropy-oracle, -e  EntropyOracle address
  --help, -h      Show help
  --version, -v   Show version
```

---

## 🔧 Teknik Detaylar

### 1. **Dependencies**

```json
{
  "dependencies": {
    "@clack/prompts": "^0.9.0",
    "chalk": "^5.4.0",
    "commander": "^13.0.0",
    "fs-extra": "^11.1.1",
    "gradient-string": "^3.0.0",
    "figlet": "^1.9.4"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.1"
  }
}
```

### 2. **Example Catalog**

Mevcut `examples/` klasöründen otomatik olarak example listesi oluşturulacak:

```typescript
// cli/src/utils.ts
interface ExampleInfo {
  name: string;
  category: string;
  description: string;
  contractPath: string;
  testPath: string;
}

function scanExamples(): ExampleInfo[] {
  // examples/ klasörünü tarayarak example listesi oluştur
}
```

### 3. **Template Generation**

Mevcut `automation/create-fhevm-example.ts` logic'i kullanılacak, ancak CLI için optimize edilecek:

```typescript
// cli/src/generator.ts
async function generateExample(
  exampleName: string,
  outputDir: string,
  options: {
    entropyOracle?: string;
    includeTests?: boolean;
  }
) {
  // 1. base-template'i kopyala
  // 2. Example contract'ı inject et
  // 3. EntropyOracle entegrasyonu ekle
  // 4. Test dosyasını oluştur
  // 5. package.json'ı güncelle
  // 6. npm install çalıştır
}
```

### 4. **EntropyOracle Integration**

Tüm generate edilen example'lar otomatik olarak EntropyOracle entegrasyonu içerecek:

```solidity
// Generated contract will include:
import "./interfaces/IEntropyOracle.sol";

contract MyExample is ZamaEthereumConfig {
    IEntropyOracle public constant ENTROPY_ORACLE = 
        IEntropyOracle(0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361);
    
    // EntropyOracle usage examples...
}
```

---

## 📦 NPM Package Yayınlama

### 1. **Package Name**

- **Önerilen**: `entrofhe-cli`
- **Alternatif**: `@entrofhe/cli` (scoped package)

### 2. **Build Process**

```json
{
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build",
    "start": "node dist/index.js"
  }
}
```

### 3. **Publishing**

```bash
cd cli
npm login
npm publish --access public
```

---

## 🎨 UI/UX Özellikleri

### 1. **Renkli Output**

- ✅ Başarı: Yeşil
- ⚠️ Uyarı: Sarı
- ❌ Hata: Kırmızı
- ℹ️ Bilgi: Mavi
- 🎯 EntropyOracle: Turuncu (özel tema)

### 2. **Progress Indicators**

```typescript
const s = spinner();
s.start('Creating example...');
// ... work ...
s.stop('✅ Example created!');
```

### 3. **ASCII Art**

EntropyOracle temalı banner:
```
  ██████╗ ████████╗██████╗  ██████╗ ███████╗██╗  ██╗███████╗
  ██╔══██╗╚══██╔══╝██╔══██╗██╔═══██╗██╔════╝██║  ██║██╔════╝
  ...
```

---

## 🔄 Mevcut Kod ile Entegrasyon

### 1. **Mevcut Automation Scripts**

- `automation/create-fhevm-example.ts` → CLI'da kullanılacak
- `base-template/` → Template olarak kullanılacak
- `examples/` → Example catalog olarak kullanılacak

### 2. **Değişiklikler**

- ✅ Mevcut kod değişmeyecek
- ✅ CLI, mevcut automation scripts'i kullanacak
- ✅ Yeni bir `cli/` klasörü eklenecek

---

## 📝 Implementation Plan

### Phase 1: Temel CLI (1-2 gün)
- [ ] CLI proje yapısı oluştur
- [ ] Basic commands (help, version, list)
- [ ] Template kopyalama
- [ ] Simple example generation

### Phase 2: Interaktif Menu (1-2 gün)
- [ ] @clack/prompts entegrasyonu
- [ ] Category selection
- [ ] Example selection
- [ ] Output directory prompt

### Phase 3: EntropyOracle Integration (1 gün)
- [ ] Otomatik EntropyOracle injection
- [ ] Interface dosyası ekleme
- [ ] Example contract'larda EntropyOracle kullanımı

### Phase 4: Polish & Testing (1 gün)
- [ ] Error handling
- [ ] Progress indicators
- [ ] ASCII art
- [ ] Documentation

### Phase 5: NPM Publishing (1 gün)
- [ ] Build configuration
- [ ] Package.json setup
- [ ] NPM publish
- [ ] README ve dokümantasyon

**Toplam Süre: ~5-7 gün**

---

## 🎯 Kullanım Senaryoları

### Senaryo 1: Yeni Başlayan Developer

```bash
$ npx entrofhe-cli
# Interaktif menu ile entropy-counter seçer
# Otomatik olarak EntropyOracle entegrasyonlu example oluşturulur
# npm test ile hemen test edebilir
```

### Senaryo 2: Hızlı Prototip

```bash
$ npx entrofhe-cli entropy-lottery ./my-lottery --entropy-oracle 0x...
# Hızlıca lottery example'ı oluşturur
# Custom EntropyOracle address ile
```

### Senaryo 3: Example Listesi

```bash
$ npx entrofhe-cli list
# Tüm mevcut example'ları listeler
# Category'lere göre organize edilmiş
```

---

## ✅ Avantajlar

1. **Kolay Erişim**: `npx` ile herkes kullanabilir
2. **EntropyOracle Odaklı**: Tüm example'lar EntropyOracle entegrasyonlu
3. **Standalone**: Her example bağımsız repository
4. **Interaktif**: Kullanıcı dostu menu
5. **Hızlı**: Template-based generation
6. **Extensible**: Yeni example'lar kolayca eklenebilir

---

## ❓ Sorular ve Cevaplar

**S: Mevcut automation scripts'e zarar verir mi?**
C: Hayır, CLI mevcut scripts'i kullanacak, değiştirmeyecek.

**S: NPM package olarak yayınlamak zorunlu mu?**
C: Hayır, sadece local kullanım için de yapılabilir. Ama npm package olarak yayınlamak daha kullanışlı.

**S: Tüm example'lar CLI'da olacak mı?**
C: Evet, mevcut 22 example'ın hepsi CLI'da olacak.

**S: EntropyOracle address hardcoded mi?**
C: Hayır, default olarak Sepolia address kullanılacak ama `--entropy-oracle` ile override edilebilir.

---

## 🚀 Sonuç

Bu CLI tool, `entrofhe` projesini daha erişilebilir hale getirecek ve EntropyOracle entegrasyonlu FHEVM example'larını kolayca generate etmeyi sağlayacak.

**Onay bekleniyor...** ✅

