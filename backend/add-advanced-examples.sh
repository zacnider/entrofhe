#!/bin/bash

# Backend Server'a Advanced Example'ları Ekleme Scripti
# Bu script backend server'da çalıştırılmalıdır

set -e

EXAMPLES_DIR="/root/examples"
GITHUB_USER="zacnider"

echo "🚀 Backend Server'a advanced example'ları ekliyoruz..."
echo ""

# Advanced example'lar
ADVANCED_EXAMPLES=(
    "advanced-simplelottery"
    "advanced-randomnumbergenerator"
    "advanced-entropynft"
)

# Her bir example için
for example in "${ADVANCED_EXAMPLES[@]}"; do
    echo "📦 Processing: $example"
    
    # Example dizini zaten var mı kontrol et
    if [ -d "$EXAMPLES_DIR/$example" ]; then
        echo "  ⚠️  $example already exists, skipping..."
        continue
    fi
    
    # GitHub repo adını oluştur
    case $example in
        "advanced-simplelottery")
            REPO="fhevm-example-advanced-simplelottery"
            ;;
        "advanced-randomnumbergenerator")
            REPO="fhevm-example-advanced-randomnumbergenerator"
            ;;
        "advanced-entropynft")
            REPO="fhevm-example-advanced-entropynft"
            ;;
        *)
            echo "  ❌ Unknown example: $example"
            continue
            ;;
    esac
    
    echo "  📥 Cloning $REPO..."
    
    # Geçici dizinde clone et
    TEMP_DIR=$(mktemp -d)
    cd "$TEMP_DIR"
    
    git clone "https://github.com/$GITHUB_USER/$REPO.git" "$example"
    
    # .git dizinini kaldır (normal dizin olarak kalacak)
    rm -rf "$example/.git"
    
    # Examples dizinine taşı
    mv "$example" "$EXAMPLES_DIR/"
    
    # Geçici dizini temizle
    cd /
    rm -rf "$TEMP_DIR"
    
    echo "  ✅ $example added successfully!"
    echo ""
done

echo "🎉 Tüm advanced example'lar eklendi!"
echo ""
echo "📋 Eklenen example'lar:"
for example in "${ADVANCED_EXAMPLES[@]}"; do
    if [ -d "$EXAMPLES_DIR/$example" ]; then
        echo "  ✅ $example"
    else
        echo "  ❌ $example (failed)"
    fi
done

