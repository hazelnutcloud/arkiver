import type { Abi, Prettify } from "viem";
import type {
  AbiConfig,
  AddressConfig,
  BlockConfig,
  BlockFilterConfig,
  FunctionCallConfig,
  TransactionReceiptConfig,
} from "./config.ts";
import type { GetEventFilter } from "./abi.ts";

type GetContractChain<
  chains,
  abi extends Abi,
  ///
  allChainNames extends string = [keyof chains] extends [never]
    ? string
    : keyof chains & string
> = {
  /**
   * Chain that this contract is deployed to. Must match a chain name in `chains`.
   * Any filter information overrides the values in the higher level "contracts" property.
   */
  chain:
    | allChainNames
    | {
        [name in allChainNames]?: Prettify<
          AddressConfig &
            GetEventFilter<abi> &
            TransactionReceiptConfig &
            FunctionCallConfig &
            BlockConfig
        >;
      };
};

export type ContractSource<chains, abi extends Abi> = Prettify<
  AbiConfig<abi> &
    GetContractChain<chains, abi> &
    AddressConfig &
    GetEventFilter<abi> &
    TransactionReceiptConfig &
    FunctionCallConfig &
    BlockConfig
>;

export type ContractSources<chains, contracts> = {} extends contracts
  ? {}
  : {
      [name in keyof contracts]: contracts[name] extends {
        abi: infer abi extends Abi;
      }
        ? ContractSource<chains, abi>
        : ContractSource<chains, Abi>;
    };

type GetAccountChain<
  chains,
  ///
  allChainNames extends string = [keyof chains] extends [never]
    ? string
    : keyof chains & string
> = {
  /**
   * Chain that this account is deployed to. Must match a chain name in `chains`.
   * Any filter information overrides the values in the higher level "accounts" property.
   */
  chain:
    | allChainNames
    | {
        [name in allChainNames]?: Prettify<
          AddressConfig & TransactionReceiptConfig & BlockConfig
        >;
      };
};

export type AccountSources<chains, accounts> = {} extends accounts
  ? {}
  : {
      [name in keyof accounts]: Prettify<
        GetAccountChain<chains> &
          Required<AddressConfig> &
          TransactionReceiptConfig &
          BlockConfig
      >;
    };

type GetBlockFilter<
  chains,
  ///
  allChainNames extends string = [keyof chains] extends [never]
    ? string
    : keyof chains & string
> = BlockFilterConfig & {
  chain:
    | allChainNames
    | {
        [name in allChainNames]?: BlockFilterConfig;
      };
};

export type BlocksSources<chains, blocks> = {} extends blocks
  ? {}
  : {
      [name in keyof blocks]: GetBlockFilter<chains>;
    };

export type CreateArkiveSources<chains, contracts, accounts, blocks> = {
  contracts?: ContractSources<chains, contracts>;
  accounts?: AccountSources<chains, accounts>;
  blocks?: BlocksSources<chains, blocks>;
};