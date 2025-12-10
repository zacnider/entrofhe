const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.INDEXER_API_PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Postgres connection pool for Envio indexer DB
const pgPool = new Pool({
  host: process.env.ENVIO_PG_HOST || '127.0.0.1',
  port: process.env.ENVIO_PG_PORT || 5433,
  user: process.env.ENVIO_PG_USER || 'postgres',
  password: process.env.ENVIO_PG_PASSWORD || 'entropy',
  database: process.env.ENVIO_PG_DATABASE || 'entropy',
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await pgPool.query('SELECT 1');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Events endpoint - Get EntropyOracle events from indexer DB
app.get('/api/events', async (req, res) => {
  try {
    const { 
      type,           // 'EntropyRequested', 'EntropyFulfilled', 'FeeRecipientUpdated', 'ChaosEngineUpdated'
      requestId,      // Filter by requestId
      txHash,         // Filter by transaction hash
      fromBlock,      // Filter from block number
      toBlock,        // Filter to block number
      limit = 50,     // Limit results
      offset = 0      // Pagination offset
    } = req.query;

    // Determine which table to query
    const validTypes = ['EntropyRequested', 'EntropyFulfilled', 'FeeRecipientUpdated', 'ChaosEngineUpdated'];
    const eventType = type && validTypes.includes(type) ? type : null;

    if (!eventType) {
      return res.status(400).json({ 
        error: 'Invalid event type. Must be one of: ' + validTypes.join(', ') 
      });
    }

    // Build query based on event type
    // Envio uses lowercase table names
    const tableName = eventType.toLowerCase();
    
    let query = `SELECT * FROM ${tableName}`;
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (requestId) {
      conditions.push(`request_id = $${paramIndex}`);
      params.push(requestId);
      paramIndex++;
    }

    if (txHash) {
      conditions.push(`tx_hash = $${paramIndex}`);
      params.push(txHash);
      paramIndex++;
    }

    if (fromBlock) {
      conditions.push(`block_number >= $${paramIndex}`);
      params.push(fromBlock);
      paramIndex++;
    }

    if (toBlock) {
      conditions.push(`block_number <= $${paramIndex}`);
      params.push(toBlock);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Order by block number descending (newest first)
    query += ` ORDER BY block_number DESC`;

    // Add limit and offset
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    console.log(`[Indexer API] Query: ${query}, Params:`, params);

    const result = await pgPool.query(query, params);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) FROM ${tableName}`;
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await pgPool.query(countQuery, params.slice(0, -2)); // Remove limit/offset params
    const total = parseInt(countResult.rows[0].count);

    return res.json({
      success: true,
      events: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });
  } catch (error) {
    console.error('[Indexer API] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all event types summary
app.get('/api/events/summary', async (req, res) => {
  try {
    const summary = {};
    const types = ['entropyrequested', 'entropyfulfilled', 'feerecipientupdated', 'chaosengineupdated'];

    for (const type of types) {
      const result = await pgPool.query(`SELECT COUNT(*) FROM ${type}`);
      summary[type] = parseInt(result.rows[0].count);
    }

    return res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('[Indexer API Summary] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Indexer API server running on port ${PORT}`);
  console.log(`📊 Connected to Postgres: ${process.env.ENVIO_PG_HOST || '127.0.0.1'}:${process.env.ENVIO_PG_PORT || 5433}`);
});

