const { ethers } = require('ethers');
const { Pool } = require('pg');

// Configuration
const CONFIG = {
  RPC_URL: process.env.SEPOLIA_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/c9DvcY4j1bI2_h-vv9HVU',
  CONTRACT_ADDRESS: '0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361',
  START_BLOCK: 9780901, // Contract deployment block
  CHAIN_ID: 11155111, // Sepolia
  
  // PostgreSQL
  PG_HOST: process.env.ENVIO_PG_HOST || '127.0.0.1',
  PG_PORT: parseInt(process.env.ENVIO_PG_PORT || '5433'),
  PG_USER: process.env.ENVIO_PG_USER || 'postgres',
  PG_PASSWORD: process.env.ENVIO_PG_PASSWORD || 'entropy',
  PG_DATABASE: process.env.ENVIO_PG_DATABASE || 'entropy',
  
  // Indexing
  POLL_INTERVAL: 12000, // 12 seconds
  BATCH_SIZE: 1000, // Process 1000 blocks at a time
};

// EntropyOracle ABI (only events we need)
const ENTROPY_ORACLE_ABI = [
  "event EntropyRequested(uint256 indexed requestId, bytes32 indexed hashedConsumer, bytes32 hashedTag, uint256 feePaid)",
  "event EntropyFulfilled(uint256 indexed requestId, bytes32 indexed hashedConsumer, bytes32 hashedTag)",
  "event FeeRecipientUpdated(address indexed oldRecipient, address indexed newRecipient)",
  "event ChaosEngineUpdated(address indexed oldEngine, address indexed newEngine)"
];

// PostgreSQL Pool
const pgPool = new Pool({
  host: CONFIG.PG_HOST,
  port: CONFIG.PG_PORT,
  user: CONFIG.PG_USER,
  password: CONFIG.PG_PASSWORD,
  database: CONFIG.PG_DATABASE,
});

// Initialize database tables
async function initDatabase() {
  try {
    // Create tables if they don't exist
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS "EntropyRequested" (
        id TEXT PRIMARY KEY,
        "requestId" NUMERIC NOT NULL,
        "hashedConsumer" TEXT NOT NULL,
        "hashedTag" TEXT NOT NULL,
        "feePaid" NUMERIC NOT NULL,
        "txHash" TEXT NOT NULL,
        "blockNumber" NUMERIC NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS "EntropyFulfilled" (
        id TEXT PRIMARY KEY,
        "requestId" NUMERIC NOT NULL,
        "hashedConsumer" TEXT NOT NULL,
        "hashedTag" TEXT NOT NULL,
        "txHash" TEXT NOT NULL,
        "blockNumber" NUMERIC NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS "FeeRecipientUpdated" (
        id TEXT PRIMARY KEY,
        "oldRecipient" TEXT NOT NULL,
        "newRecipient" TEXT NOT NULL,
        "txHash" TEXT NOT NULL,
        "blockNumber" NUMERIC NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS "ChaosEngineUpdated" (
        id TEXT PRIMARY KEY,
        "oldEngine" TEXT NOT NULL,
        "newEngine" TEXT NOT NULL,
        "txHash" TEXT NOT NULL,
        "blockNumber" NUMERIC NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Create indexer state table
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS indexer_state (
        id TEXT PRIMARY KEY DEFAULT 'main',
        "lastBlock" NUMERIC NOT NULL DEFAULT ${CONFIG.START_BLOCK},
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Initialize state if not exists
    await pgPool.query(`
      INSERT INTO indexer_state (id, "lastBlock")
      VALUES ('main', ${CONFIG.START_BLOCK})
      ON CONFLICT (id) DO NOTHING;
    `);
    
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

// Get last processed block
async function getLastBlock() {
  const result = await pgPool.query('SELECT "lastBlock" FROM indexer_state WHERE id = $1', ['main']);
  return result.rows[0] ? BigInt(result.rows[0].lastBlock) : BigInt(CONFIG.START_BLOCK);
}

// Update last processed block
async function updateLastBlock(blockNumber) {
  await pgPool.query(
    'UPDATE indexer_state SET "lastBlock" = $1, "updatedAt" = NOW() WHERE id = $2',
    [blockNumber.toString(), 'main']
  );
}

// Process events
async function processEvents(events, eventName) {
  if (events.length === 0) return;
  
  console.log(`📦 Processing ${events.length} ${eventName} events...`);
  
  for (const event of events) {
    try {
      const id = `${event.transactionHash}-${event.logIndex}`;
      const blockNumber = BigInt(event.blockNumber);
      
      if (eventName === 'EntropyRequested') {
        const requestId = BigInt(event.args.requestId.toString());
        const feePaid = BigInt(event.args.feePaid.toString());
        
        await pgPool.query(`
          INSERT INTO "EntropyRequested" (id, "requestId", "hashedConsumer", "hashedTag", "feePaid", "txHash", "blockNumber")
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO NOTHING
        `, [
          id,
          requestId.toString(),
          event.args.hashedConsumer,
          event.args.hashedTag,
          feePaid.toString(),
          event.transactionHash,
          blockNumber.toString()
        ]);
      } else if (eventName === 'EntropyFulfilled') {
        const requestId = BigInt(event.args.requestId.toString());
        
        await pgPool.query(`
          INSERT INTO "EntropyFulfilled" (id, "requestId", "hashedConsumer", "hashedTag", "txHash", "blockNumber")
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO NOTHING
        `, [
          id,
          requestId.toString(),
          event.args.hashedConsumer,
          event.args.hashedTag,
          event.transactionHash,
          blockNumber.toString()
        ]);
      } else if (eventName === 'FeeRecipientUpdated') {
        await pgPool.query(`
          INSERT INTO "FeeRecipientUpdated" (id, "oldRecipient", "newRecipient", "txHash", "blockNumber")
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO NOTHING
        `, [
          id,
          event.args.oldRecipient,
          event.args.newRecipient,
          event.transactionHash,
          blockNumber.toString()
        ]);
      } else if (eventName === 'ChaosEngineUpdated') {
        await pgPool.query(`
          INSERT INTO "ChaosEngineUpdated" (id, "oldEngine", "newEngine", "txHash", "blockNumber")
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO NOTHING
        `, [
          id,
          event.args.oldEngine,
          event.args.newEngine,
          event.transactionHash,
          blockNumber.toString()
        ]);
      }
    } catch (error) {
      console.error(`❌ Error processing ${eventName} event:`, error);
    }
  }
}

// Index blocks
async function indexBlocks(fromBlock, toBlock) {
  try {
    const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
    const contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, ENTROPY_ORACLE_ABI, provider);
    
    console.log(`🔍 Indexing blocks ${fromBlock} to ${toBlock}...`);
    
    // Fetch all events
    const [entropyRequested, entropyFulfilled, feeRecipientUpdated, chaosEngineUpdated] = await Promise.all([
      contract.queryFilter(contract.filters.EntropyRequested(), Number(fromBlock), Number(toBlock)),
      contract.queryFilter(contract.filters.EntropyFulfilled(), Number(fromBlock), Number(toBlock)),
      contract.queryFilter(contract.filters.FeeRecipientUpdated(), Number(fromBlock), Number(toBlock)),
      contract.queryFilter(contract.filters.ChaosEngineUpdated(), Number(fromBlock), Number(toBlock)),
    ]);
    
    // Process events
    await Promise.all([
      processEvents(entropyRequested, 'EntropyRequested'),
      processEvents(entropyFulfilled, 'EntropyFulfilled'),
      processEvents(feeRecipientUpdated, 'FeeRecipientUpdated'),
      processEvents(chaosEngineUpdated, 'ChaosEngineUpdated'),
    ]);
    
    // Update last block
    await updateLastBlock(toBlock);
    
    console.log(`✅ Indexed blocks ${fromBlock} to ${toBlock}`);
  } catch (error) {
    console.error('❌ Error indexing blocks:', error);
    throw error;
  }
}

// Main indexing loop
async function startIndexing() {
  try {
    console.log('🚀 Starting simple indexer...');
    console.log(`📡 RPC: ${CONFIG.RPC_URL}`);
    console.log(`📄 Contract: ${CONFIG.CONTRACT_ADDRESS}`);
    
    await initDatabase();
    
    const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
    
    while (true) {
      try {
        const lastBlock = await getLastBlock();
        const currentBlock = BigInt(await provider.getBlockNumber());
        
        if (currentBlock <= lastBlock) {
          console.log(`⏳ Waiting for new blocks... (last: ${lastBlock}, current: ${currentBlock})`);
          await new Promise(resolve => setTimeout(resolve, CONFIG.POLL_INTERVAL));
          continue;
        }
        
        // Process in batches
        let fromBlock = lastBlock + 1n;
        const toBlock = currentBlock;
        
        while (fromBlock <= toBlock) {
          const batchToBlock = fromBlock + BigInt(CONFIG.BATCH_SIZE) - 1n;
          const actualToBlock = batchToBlock > toBlock ? toBlock : batchToBlock;
          
          await indexBlocks(fromBlock, actualToBlock);
          
          fromBlock = actualToBlock + 1n;
        }
        
        console.log(`✅ Caught up to block ${currentBlock}`);
      } catch (error) {
        console.error('❌ Error in indexing loop:', error);
        await new Promise(resolve => setTimeout(resolve, CONFIG.POLL_INTERVAL));
      }
    }
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Start indexer
if (require.main === module) {
  startIndexing().catch(console.error);
}

module.exports = { startIndexing, initDatabase };

