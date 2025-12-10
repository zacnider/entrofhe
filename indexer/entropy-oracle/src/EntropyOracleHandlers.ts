// Minimal handlers for Envio. Generated types come from `envio codegen`.
// After running `envio codegen`, import the generated types:
// import { EntropyRequestedEvent, EntropyFulfilledEvent, FeeRecipientUpdatedEvent, ChaosEngineUpdatedEvent } from "../generated/Handlers.gen";

export async function EntropyRequested(event: any, ctx: any) {
  // Persist or log as needed; here we just print
  console.log("EntropyRequested", {
    requestId: event.params.requestId?.toString?.() ?? event.params.requestId,
    hashedConsumer: event.params.hashedConsumer,
    hashedTag: event.params.hashedTag,
    feePaid: event.params.feePaid?.toString?.() ?? event.params.feePaid,
    txHash: event.transaction?.hash,
    blockNumber: event.block?.number,
  });
}

export async function EntropyFulfilled(event: any, ctx: any) {
  console.log("EntropyFulfilled", {
    requestId: event.params.requestId?.toString?.() ?? event.params.requestId,
    hashedConsumer: event.params.hashedConsumer,
    hashedTag: event.params.hashedTag,
    txHash: event.transaction?.hash,
    blockNumber: event.block?.number,
  });
}

export async function FeeRecipientUpdated(event: any, ctx: any) {
  console.log("FeeRecipientUpdated", {
    oldRecipient: event.params.oldRecipient,
    newRecipient: event.params.newRecipient,
    txHash: event.transaction?.hash,
    blockNumber: event.block?.number,
  });
}

export async function ChaosEngineUpdated(event: any, ctx: any) {
  console.log("ChaosEngineUpdated", {
    oldEngine: event.params.oldEngine,
    newEngine: event.params.newEngine,
    txHash: event.transaction?.hash,
    blockNumber: event.block?.number,
  });
}

