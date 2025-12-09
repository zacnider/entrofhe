# Backend Server - Examples Güncelleme Talimatları

## 📋 Durum

OpenZeppelin example'larında `@openzeppelin/contracts` paketi eksikti. Bu paket şu example'lara eklendi:
- `openzeppelin-erc7984token`
- `openzeppelin-erc7984toerc20wrapper`

Diğer OpenZeppelin example'larında zaten mevcut:
- `openzeppelin-swaperc7984toerc20`
- `openzeppelin-swaperc7984toerc7984`
- `openzeppelin-vestingwallet`

## 🔄 Otomatik Güncelleme

Backend server'da examples klasörü submodule olarak çekilmişse, güncellemeler otomatik olarak gelecektir.

### Submodule Güncelleme

```bash
# Backend server'da examples klasörüne git
cd /root/examples

# Her submodule'ı güncelle
git submodule update --remote

# Veya tüm submodule'ları tek seferde güncelle
cd /root
git submodule update --remote --recursive
```

## 📦 Manuel Güncelleme (Gerekirse)

Eğer submodule güncellemesi çalışmazsa, manuel olarak package.json'ları güncelleyebilirsiniz:

### 1. openzeppelin-erc7984token

```bash
cd /root/examples/openzeppelin-erc7984token
git pull origin main
npm install --legacy-peer-deps
```

### 2. openzeppelin-erc7984toerc20wrapper

```bash
cd /root/examples/openzeppelin-erc7984toerc20wrapper
git pull origin main
npm install --legacy-peer-deps
```

## ✅ Doğrulama

Güncellemelerin başarılı olduğunu kontrol etmek için:

```bash
# Package.json'da @openzeppelin/contracts var mı kontrol et
grep -r "@openzeppelin/contracts" /root/examples/openzeppelin-*/package.json

# node_modules'da paket yüklü mü kontrol et
ls -la /root/examples/openzeppelin-erc7984token/node_modules/@openzeppelin/contracts
ls -la /root/examples/openzeppelin-erc7984toerc20wrapper/node_modules/@openzeppelin/contracts
```

## 🚀 Sonuç

Backend server'da ilk test/compile çalıştırmada `npm install --legacy-peer-deps` otomatik çalışacak ve güncel package.json'ları kullanacak. Bu yüzden manuel güncelleme gerekmez, ancak hızlı test için yukarıdaki komutları çalıştırabilirsiniz.

