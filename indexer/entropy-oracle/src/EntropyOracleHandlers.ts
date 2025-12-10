// @ts-nocheck
import * as generated from "../generated/index.js";
const EntropyOracle = generated.EntropyOracle || generated;

// Handler for EntropyRequested event
console.log('[EntropyOracleHandlers] Registering EntropyRequested handler...');
EntropyOracle.EntropyRequested.handler(async ({ event, context }) => {
  console.log("EntropyRequested", {
    requestId: event.params.requestId?.toString?.() ?? event.params.requestId,
    hashedConsumer: event.params.hashedConsumer,
    hashedTag: event.params.hashedTag,
    feePaid: event.params.feePaid?.toString?.() ?? event.params.feePaid,
    txHash: event.transaction?.hash,
    blockNumber: event.block?.number,
  });
});

// Handler for EntropyFulfilled event
console.log('[EntropyOracleHandlers] Registering EntropyFulfilled handler...');
EntropyOracle.EntropyFulfilled.handler(async ({ event, context }) => {
  console.log("EntropyFulfilled", {
    requestId: event.params.requestId?.toString?.() ?? event.params.requestId,
    hashedConsumer: event.params.hashedConsumer,
    hashedTag: event.params.hashedTag,
    txHash: event.transaction?.hash,
    blockNumber: event.block?.number,
  });
});

// Handler for FeeRecipientUpdated event
console.log('[EntropyOracleHandlers] Registering FeeRecipientUpdated handler...');
EntropyOracle.FeeRecipientUpdated.handler(async ({ event, context }) => {
  console.log("FeeRecipientUpdated", {
    oldRecipient: event.params.oldRecipient,
    newRecipient: event.params.newRecipient,
    txHash: event.transaction?.hash,
    blockNumber: event.block?.number,
  });
});

// Handler for ChaosEngineUpdated event
console.log('[EntropyOracleHandlers] Registering ChaosEngineUpdated handler...');
EntropyOracle.ChaosEngineUpdated.handler(async ({ event, context }) => {
  console.log("ChaosEngineUpdated", {
    oldEngine: event.params.oldEngine,
    newEngine: event.params.newEngine,
    txHash: event.transaction?.hash,
    blockNumber: event.block?.number,
  });
});

