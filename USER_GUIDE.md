# User Guide: How to Use the FHEVM Example Hub

## 🎯 What is This?

This repository contains **standalone FHEVM examples** - each example is a complete, working Hardhat project that demonstrates a specific FHEVM concept. You can clone, study, modify, and learn from each example independently.

## 📦 Two Ways to Use This Repository

### 1. **Standalone Examples** (Primary Use - Bounty Focus)
Each example in `examples/` is a **standalone Hardhat project**. You can:
- Clone individual examples
- Study the code
- Run tests
- Modify and experiment
- Use as templates for your own projects

### 2. **Interactive Frontend** (Bonus - Live Demos)
The `frontend/` provides **live demonstrations** of some example contracts:
- See examples working in real-time
- Interact with deployed contracts
- Learn visually

## 🚀 How Users Will Use the Examples

### Option A: Clone Individual Examples

```bash
# Clone the repository
git clone https://github.com/zacnider/entrofhe.git
cd entrofhe

# Navigate to an example
cd examples/basic-simplecounter

# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test
```

### Option B: Use as Template

```bash
# Copy an example to start your own project
cp -r examples/basic-simplecounter my-new-project
cd my-new-project

# Modify the code
# ... make changes ...

# Test your changes
npm test
```

### Option C: Use Automation Scripts

```bash
# Create a new example from template
npm run create-example -- --name MyExample --category basic

# This creates: examples/basic-myexample/
# Ready to use!
```

## 🎨 Frontend Usage (Optional)

The frontend is **optional** and serves as:
1. **Live Demo**: See examples working in real-time
2. **Learning Tool**: Visual understanding of FHEVM concepts
3. **Production Interface**: For the Entrofhe oracle (separate use case)

### To Use Frontend:

```bash
cd frontend
npm install
npm start
```

Then visit:
- **Examples Page**: Interactive demos of SimpleLottery, RandomNumberGenerator, EntropyNFT
- **Docs Page**: Comprehensive documentation
- **EntropyScan**: View entropy requests (for oracle users)

## 📚 Example Structure

Each example follows this structure:

```
examples/basic-simplecounter/
├── contracts/
│   └── SimpleCounter.sol    # The contract
├── test/
│   └── SimpleCounter.test.ts # Tests
├── hardhat.config.ts        # Hardhat config
├── package.json            # Dependencies
├── README.md               # Documentation
└── types/                  # Auto-generated types
```

## 🎓 Learning Path

### For Beginners:
1. Start with `basic-simplecounter` - simplest example
2. Read the README.md
3. Study the contract code
4. Run the tests
5. Modify and experiment

### For Intermediate:
1. Try `basic-arithmetic` - multiple operations
2. Study `encryption-encryptsingle` - encryption patterns
3. Look at `user-decryption-userdecryptsingle` - access control

### For Advanced:
1. Study `advanced-simplelottery` - real-world use case
2. Check `anti-patterns-*` - learn from mistakes
3. Create your own example using automation scripts

## 🔧 Common Workflows

### Workflow 1: Study an Example
```bash
cd examples/basic-simplecounter
npm install
npm run compile
npm test
# Read README.md
# Study contracts/SimpleCounter.sol
# Study test/SimpleCounter.test.ts
```

### Workflow 2: Create Your Own
```bash
# Use automation
npm run create-example -- --name MyCounter --category basic

# Or copy an existing example
cp -r examples/basic-simplecounter my-counter
cd my-counter

# Modify code
# ... make changes ...

# Test
npm test
```

### Workflow 3: Interactive Learning (Frontend)
```bash
# Start frontend
cd frontend
npm start

# Open browser
# Navigate to Examples page
# Interact with live contracts
# See real-time results
```

## 📖 Documentation

Each example includes:
- **README.md**: Overview, concepts, usage examples
- **Contract comments**: Inline documentation
- **Test comments**: Explaining test patterns

## 🎯 Bounty Submission Structure

The bounty focuses on:
- ✅ **Standalone examples** (each in `examples/`)
- ✅ **Automation scripts** (`automation/`)
- ✅ **Base template** (`base-template/`)
- ✅ **Documentation** (READMEs, auto-generated docs)
- ✅ **Developer guide** (`DEVELOPER_GUIDE.md`)

**Frontend is a bonus** - it demonstrates examples working live, but the core bounty is the standalone examples themselves.

## 💡 Key Points

1. **Each example is independent** - clone and use separately
2. **No frontend required** - examples work standalone
3. **Frontend is optional** - for visual learning and live demos
4. **Automation helps** - create new examples easily
5. **Documentation is comprehensive** - READMEs explain everything

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/zacnider/entrofhe.git
cd entrofhe

# 2. Pick an example
cd examples/basic-simplecounter

# 3. Install and test
npm install
npm test

# 4. Read and learn
cat README.md
cat contracts/SimpleCounter.sol

# 5. Experiment!
# Modify the code, run tests, learn!
```

## 📝 Summary

- **Bounty Focus**: Standalone Hardhat examples
- **User Experience**: Clone → Install → Test → Learn
- **Frontend Role**: Optional bonus for live demos
- **Documentation**: Comprehensive READMEs for each example
- **Automation**: Scripts to create new examples easily

The examples are designed to be **self-contained** and **educational** - perfect for learning FHEVM!


