#!/bin/bash

# Backend Server'a Yeni 3 Example'ı Ekleme Scripti
# Bu script backend server'da çalıştırılmalıdır

set -e

EXAMPLES_DIR="/root/examples"
GITHUB_USER="zacnider"

echo "🚀 Backend Server'a yeni example'ları ekliyoruz..."
echo ""

# Yeni example'lar
NEW_EXAMPLES=(
    "encryption-encryptmultiple"
    "user-decryption-userdecryptmultiple"
    "public-decryption-publicdecryptmultiple"
)

# Her bir example için
for example in "${NEW_EXAMPLES[@]}"; do
    echo "📦 Processing: $example"
    
    # Example dizini zaten var mı kontrol et
    if [ -d "$EXAMPLES_DIR/$example" ]; then
        echo "  ⚠️  $example already exists, skipping..."
        continue
    fi
    
    # GitHub repo adını oluştur
    case $example in
        "encryption-encryptmultiple")
            REPO="fhevm-example-encryption-encryptmultiple"
            ;;
        "user-decryption-userdecryptmultiple")
            REPO="fhevm-example-user-decryption-userdecryptmultiple"
            ;;
        "public-decryption-publicdecryptmultiple")
            REPO="fhevm-example-public-decryption-publicdecryptmultiple"
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

echo "🎉 Tüm yeni example'lar eklendi!"
echo ""
echo "📋 Eklenen example'lar:"
for example in "${NEW_EXAMPLES[@]}"; do
    if [ -d "$EXAMPLES_DIR/$example" ]; then
        echo "  ✅ $example"
    else
        echo "  ❌ $example (failed)"
    fi
done

