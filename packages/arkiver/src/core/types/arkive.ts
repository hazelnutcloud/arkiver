import type { EntitySchema } from "@mikro-orm/core";
import type { Narrow } from "viem";
import type { CreateArkiveChains } from "./chains.ts";
import type { CreateArkiveSources } from "./sources.ts";
import type { CreateArkiveTransformers } from "./transformers.ts";

export type CreateArkiveParams<
  chains = unknown,
  contracts = unknown,
  accounts = unknown,
  blocks = unknown
> = {
  entities: EntitySchema[];
  chains: CreateArkiveChains<Narrow<chains>>;
  sources: CreateArkiveSources<
    chains,
    Narrow<contracts>,
    Narrow<accounts>,
    Narrow<blocks>
  >;
  transformers: CreateArkiveTransformers<contracts, accounts, blocks>;
};

export type Arkive = {
  run: () => void;
};