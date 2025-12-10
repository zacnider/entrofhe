# EntropyOracle Envio Indexer (Sepolia)

Indexes EntropyOracle events on Sepolia:
- `EntropyRequested(uint256 requestId, bytes32 hashedConsumer, bytes32 hashedTag, uint256 feePaid)`
- `EntropyFulfilled(uint256 requestId, bytes32 hashedConsumer, bytes32 hashedTag)`
- `FeeRecipientUpdated(address oldRecipient, address newRecipient)`
- `ChaosEngineUpdated(address oldEngine, address newEngine)`

## Contract
- Address: `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`
- Network: Sepolia (chainId 11155111)
- Start block: `9780901` (deploy block)

## Setup
```bash
cd indexer/entropy-oracle

# Install Envio CLI locally if needed
npm install --save-dev envio

# (Optional) If you want project deps
npm install

# Generate types
npx envio codegen
```

## Run
```bash
# Set your Sepolia RPC (Alchemy/Infura/etc.)
export SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/..."

# Development mode
npx envio dev

# Production mode
npx envio start
```

## Notes
- Handlers are in `src/EntropyOracleHandlers.ts`. Currently they just log; extend to write to DB/GraphQL as needed.
- `rollback_on_reorg` is disabled for speed; enable for production if required.
- RPC is read from `SEPOLIA_RPC_URL`; you can hardcode in `config.yaml` but env is recommended.

