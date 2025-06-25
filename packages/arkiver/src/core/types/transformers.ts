import type { EntityManager } from "@mikro-orm/core";
import type { Abi, Log } from "viem";
import type { SafeEventNames, SafeFunctionNames } from "./abi.ts";
import type { Setup } from "./config.ts";
import type { ExtractAbiEvent } from "abitype";

type _FormatEventNames<
  contract extends { abi: Abi },
  ///
  safeEventNames = SafeEventNames<contract["abi"]>
> = string extends safeEventNames ? never : safeEventNames;

type _FormatFunctionNames<
  contract extends { abi: Abi },
  ///
  safeFunctionNames = SafeFunctionNames<contract["abi"]>
> = string extends safeFunctionNames ? never : safeFunctionNames;

export type ExtractEventName<sourceName> =
  sourceName extends `${string}:${infer eventName}` ? eventName : never;

export type LogEvent<sourceName, abi> = abi extends Abi
  ? Log<
      bigint,
      number,
      false,
      ExtractAbiEvent<abi, ExtractEventName<sourceName>>
    >
  : never;

export type ExtractSourceNames<contracts> = contracts[keyof contracts] extends {
  abi: Abi;
}
  ?
      | `${keyof contracts & string}:${
          | _FormatEventNames<contracts[keyof contracts]>
          | Setup}`
      | (contracts[keyof contracts] extends { includeCallTraces: true }
          ? `${keyof contracts & string}.${_FormatFunctionNames<
              contracts[keyof contracts]
            >}`
          : never)
  : never;

export type ContractTransformers<contracts> = {} extends contracts
  ? {}
  : {
      [name in ExtractSourceNames<contracts> as name &
        string]?: contracts[keyof contracts] extends {
        abi: infer abi extends Abi;
      }
        ? (context: { db: EntityManager; event: LogEvent<name, abi> }) => void
        : never;
    };

export type AccountsTransformers<accounts> = {} extends accounts
  ? {}
  : {
      [name in keyof accounts as `${name & string}:${
        | "transaction"
        | "transfer"}:${"from" | "to"}`]?: (context: {
        db: EntityManager;
      }) => void;
    };

export type BlocksTransformers<blocks> = {} extends blocks
  ? {}
  : {
      [name in keyof blocks as `${name & string}:block`]?: (context: {
        db: EntityManager;
      }) => void;
    };

export type CreateArkiveTransformers<contracts, accounts, blocks> =
  ContractTransformers<contracts> &
    AccountsTransformers<accounts> &
    BlocksTransformers<blocks>;
