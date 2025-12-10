# Setup Instructions for 3 New Examples

## 📋 Overview

3 new examples have been created to complete all bounty requirements:
1. `encryption-encryptmultiple`
2. `user-decryption-userdecryptmultiple`
3. `public-decryption-publicdecryptmultiple`

## 🚀 Next Steps

### 1. Create GitHub Repositories

For each new example, create a GitHub repository:

```bash
# For encryption-encryptmultiple
gh repo create zacnider/fhevm-example-encryption-encryptmultiple --public --clone

# For user-decryption-userdecryptmultiple
gh repo create zacnider/fhevm-example-user-decryption-userdecryptmultiple --public --clone

# For public-decryption-publicdecryptmultiple
gh repo create zacnider/fhevm-example-public-decryption-publicdecryptmultiple --public --clone
```

### 2. Initialize and Push Code

For each repository:

```bash
# Example for encryption-encryptmultiple
cd examples/encryption-encryptmultiple
git init
git add .
git commit -m "Initial commit: EntropyEncryptMultiple example"
git branch -M main
git remote add origin https://github.com/zacnider/fhevm-example-encryption-encryptmultiple.git
git push -u origin main
```

### 3. Add as Submodules

After pushing to GitHub, add as submodules:

```bash
cd /Users/nihataltuntas/Desktop/projeler/entrofhe

# Remove the directories (they're currently regular directories)
rm -rf examples/encryption-encryptmultiple
rm -rf examples/user-decryption-userdecryptmultiple
rm -rf examples/public-decryption-publicdecryptmultiple

# Add as submodules (entries already in .gitmodules)
git submodule add https://github.com/zacnider/fhevm-example-encryption-encryptmultiple.git examples/encryption-encryptmultiple
git submodule add https://github.com/zacnider/fhevm-example-user-decryption-userdecryptmultiple.git examples/user-decryption-userdecryptmultiple
git submodule add https://github.com/zacnider/fhevm-example-public-decryption-publicdecryptmultiple.git examples/public-decryption-publicdecryptmultiple
```

### 4. Commit Changes

```bash
git add .gitmodules
git commit -m "Add 3 new examples as submodules: encryptmultiple, userdecryptmultiple, publicdecryptmultiple"
git push origin main
```

## ✅ Verification

After setup, verify:

```bash
git submodule status | grep -E "encryptmultiple|decryptmultiple"
```

All 3 should show as initialized submodules.

## 📝 Notes

- `.gitmodules` file already has entries for these 3 examples
- Contract names: `EntropyEncryptMultiple`, `EntropyUserDecryptMultiple`, `EntropyPublicDecryptMultiple`
- All examples are integrated into frontend (Examples.tsx and Docs.tsx)
