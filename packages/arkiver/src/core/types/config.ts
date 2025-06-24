import type { AbiEvent } from "abitype";
import type { Abi } from "viem";

export type Setup = "setup";

export type AbiConfig<abi extends Abi | readonly unknown[]> = {
  /** Contract application byte interface. */
  abi: abi;
};

export type Factory<event extends AbiEvent = AbiEvent> = {
  /** Address of the factory contract that creates this contract. */
  address: `0x${string}` | readonly `0x${string}`[];
  /** ABI event that announces the creation of a new instance of this contract. */
  event: event;
  /** Name of the factory event parameter that contains the new child contract address. */
  parameter: Exclude<event["inputs"][number]["name"], undefined>;
  /** From block */
  startBlock?: number | "latest";
  endBlock?: number | "latest";
};

export type AddressConfig = {
  address?: `0x${string}` | readonly `0x${string}`[] | Factory;
};

export type TransactionReceiptConfig = {
  includeTransactionReceipts?: boolean;
};

export type FunctionCallConfig = {
  includeCallTraces?: boolean;
};

export type BlockConfig = {
  /** Block number at which to start indexing events (inclusive). If `undefined`, events will be processed from block 0. Default: `undefined`. */
  startBlock?: number | "latest";
  /** Block number at which to stop indexing events (inclusive). If `undefined`, events will be processed in real-time. Default: `undefined`. */
  endBlock?: number | "latest";
};

export type BlockFilterConfig = {
  /** Block number at which to start indexing events (inclusive). If `undefined`, events will be processed from block 0. Default: `undefined`. */
  startBlock?: number | "latest";
  /** Block number at which to stop indexing events (inclusive). If `undefined`, events will be processed in real-time. Default: `undefined`. */
  endBlock?: number | "latest";
  interval?: number;
};