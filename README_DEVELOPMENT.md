# Development Guide

## Local Development Setup

### Option 1: Vercel CLI (Recommended)

Vercel CLI ile hem frontend hem de API'leri local'de çalıştırabilirsiniz:

```bash
# ⚠️ ÖNEMLİ: Proje ROOT dizininde çalıştırın (entrofhe klasörü)
# /Users/nihataltuntas/Desktop/projeler/entrofhe

# 1. Vercel CLI'yi yükleyin (eğer yoksa)
npm install -g vercel

# 2. Root dizinde Vercel dev'i başlatın
vercel dev
```

**Nerede çalıştırılır?**
- ✅ `/Users/nihataltuntas/Desktop/projeler/entrofhe` (ROOT dizin)
- ❌ `/Users/nihataltuntas/Desktop/projeler/entrofhe/api` (YANLIŞ)
- ❌ `/Users/nihataltuntas/Desktop/projeler/entrofhe/frontend` (YANLIŞ)

Bu komut:
- Frontend'i `http://localhost:3000`'de başlatır
- API endpoint'lerini (`/api/*`) local'de çalıştırır (otomatik olarak `api/` klasörünü bulur)
- Hot reload desteği sağlar

### Option 2: Separate Frontend & API

Eğer sadece frontend'i test etmek istiyorsanız:

```bash
# Terminal 1: API server (Vercel dev)
vercel dev

# Terminal 2: Frontend (React)
cd frontend
npm start
```

### API Endpoints

Local development'ta API endpoint'leri:
- `http://localhost:3000/api/test-example`
- `http://localhost:3000/api/compile-example`
- `http://localhost:3000/api/deploy-example`
- `http://localhost:3000/api/verify-example`

### Troubleshooting

**404 Error on API calls:**
- Vercel CLI'nin çalıştığından emin olun: `vercel dev`
- API dosyalarının `api/` klasöründe olduğunu kontrol edin

**Port conflicts:**
- Vercel dev varsayılan olarak port 3000 kullanır
- Eğer port kullanılıyorsa, Vercel otomatik olarak başka bir port seçer

**Environment Variables:**
- Local development için `.env.local` dosyası oluşturun
- Vercel CLI otomatik olarak `.env.local` dosyasını okur

