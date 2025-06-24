import type { Transport } from "viem";

export type CreateArkiveChains<chains> = {} extends chains
  ? {}
  : {
      [chainName in keyof chains]: {
        id: chains[chainName] extends { id: infer id extends number }
          ? id | number
          : number;
        rpc: string | string[] | Transport | undefined;
        pollingInterval?: number;
      };
    };