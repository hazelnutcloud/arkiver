import type { CreateArkiveParams, Arkive } from "./types/index.ts";

export const createArkive = <
  const chains,
  const contracts = {},
  const accounts = {},
  const blocks = {}
>(
  params: CreateArkiveParams<chains, contracts, accounts, blocks>
): Arkive => {
  // TODO: Implement arkive logic using params
  console.log("Creating arkive with:", params);
  
  return {
    run: () => {
      console.log("Running arkive...");
    },
  };
};