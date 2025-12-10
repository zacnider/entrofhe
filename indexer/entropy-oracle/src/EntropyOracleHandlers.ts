// @ts-nocheck
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const generated = require("../generated/index.js");
const EntropyOracle = generated.EntropyOracle || generated;

// Handler for EntropyRequested event
console.log('[EntropyOracleHandlers] Registering EntropyRequested handler...');
EntropyOracle.EntropyRequested.handler(async ({ event, context }) => {
  try {
    const requestId = BigInt(event.params.requestId?.toString() || event.params.requestId);
    const id = `${event.transaction.hash}-${event.logIndex || 0}`;
    
    context.EntropyRequested.set({
      id: id,
      requestId: requestId,
      hashedConsumer: event.params.hashedConsumer,
      hashedTag: event.params.hashedTag,
      feePaid: BigInt(event.params.feePaid?.toString() || event.params.feePaid),
      txHash: event.transaction.hash,
      blockNumber: BigInt(event.block.number),
    });
    
    console.log(`[EntropyRequested] Saved: requestId=${requestId}, txHash=${event.transaction.hash}`);
  } catch (error) {
    console.error('[EntropyRequested] ERROR:', error);
    throw error;
  }
});

// Handler for EntropyFulfilled event
console.log('[EntropyOracleHandlers] Registering EntropyFulfilled handler...');
EntropyOracle.EntropyFulfilled?.handler(async ({ event, context }) => {
  try {
    const requestId = BigInt(event.params.requestId?.toString() || event.params.requestId);
    const id = `${event.transaction.hash}-${event.logIndex || 0}`;
    
    context.EntropyFulfilled.set({
      id: id,
      requestId: requestId,
      hashedConsumer: event.params.hashedConsumer,
      hashedTag: event.params.hashedTag,
      txHash: event.transaction.hash,
      blockNumber: BigInt(event.block.number),
    });
    
    console.log(`[EntropyFulfilled] Saved: requestId=${requestId}, txHash=${event.transaction.hash}`);
  } catch (error) {
    console.error('[EntropyFulfilled] ERROR:', error);
    throw error;
  }
});

// Handler for FeeRecipientUpdated event
console.log('[EntropyOracleHandlers] Registering FeeRecipientUpdated handler...');
EntropyOracle.FeeRecipientUpdated?.handler(async ({ event, context }) => {
  try {
    const id = `${event.transaction.hash}-${event.logIndex || 0}`;
    
    context.FeeRecipientUpdated.set({
      id: id,
      oldRecipient: event.params.oldRecipient,
      newRecipient: event.params.newRecipient,
      txHash: event.transaction.hash,
      blockNumber: BigInt(event.block.number),
    });
    
    console.log(`[FeeRecipientUpdated] Saved: txHash=${event.transaction.hash}`);
  } catch (error) {
    console.error('[FeeRecipientUpdated] ERROR:', error);
    throw error;
  }
});

// Handler for ChaosEngineUpdated event
console.log('[EntropyOracleHandlers] Registering ChaosEngineUpdated handler...');
EntropyOracle.ChaosEngineUpdated?.handler(async ({ event, context }) => {
  try {
    const id = `${event.transaction.hash}-${event.logIndex || 0}`;
    
    context.ChaosEngineUpdated.set({
      id: id,
      oldEngine: event.params.oldEngine,
      newEngine: event.params.newEngine,
      txHash: event.transaction.hash,
      blockNumber: BigInt(event.block.number),
    });
    
    console.log(`[ChaosEngineUpdated] Saved: txHash=${event.transaction.hash}`);
  } catch (error) {
    console.error('[ChaosEngineUpdated] ERROR:', error);
    throw error;
  }
});

