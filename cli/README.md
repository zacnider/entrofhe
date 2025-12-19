# EntroFHE CLI Tool

Command-line tool to generate EntropyOracle-integrated FHEVM examples instantly.

## 🚀 Installation

### Option 1: Global Installation (Recommended)

```bash
npm install -g entrofhe-cli
```

After installation, use the `entrofhe` command directly:

```bash
entrofhe
```

### Option 2: Using npx (No Installation)

```bash
npx entrofhe-cli
```

## 📖 Usage

### Interactive Mode

```bash
entrofhe
```

This will:
1. Show a numbered list of all 22 available examples
2. Prompt you to select an example by number
3. Ask for output directory
4. Optionally configure EntropyOracle address
5. Generate the complete project with all dependencies

### Direct Mode

```bash
# Create by number
entrofhe create 1 ./my-project

# Create by key
entrofhe create entropy-counter ./my-project

# List all examples
entrofhe list
```

## ✨ Features

- ✅ **22 Pre-built Examples**: All examples from the EntroFHE hub
- ✅ **Automatic EntropyOracle Integration**: IEntropyOracle interface included
- ✅ **Complete Projects**: Standalone Hardhat projects with tests, contracts, and scripts
- ✅ **Dependencies Installed**: All npm packages installed automatically
- ✅ **Ready to Test**: Test files included and ready to run

## 📦 What Gets Generated

Each generated example includes:

- `contracts/` - Solidity contracts (main contract + IEntropyOracle + dependencies)
- `test/` - Complete test suite
- `scripts/` - Deployment and verification scripts
- `hardhat.config.ts` - Hardhat configuration
- `package.json` - Dependencies and scripts
- `.env.example` - Environment variables template
- `README.md` - Example-specific documentation

## 🔧 Development

### Build

```bash
npm install
npm run build
```

### Run Locally (Development)

```bash
# Interactive mode
npm start

# Direct mode
npm start create entropy-counter ./my-project

# List examples
npm start list
```

### Development Mode

```bash
npm run dev
```

## 📝 License

BSD-3-Clause-Clear
