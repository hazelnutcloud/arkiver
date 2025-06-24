import type { EntityManager } from "@mikro-orm/core";
import type { Abi } from "viem";
import type { SafeEventNames, SafeFunctionNames } from "./abi.ts";
import type { Setup } from "./config.ts";

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

export type CreateArkiveTransformers<contracts, accounts, blocks> =
  {} extends contracts
    ? {}
    : {
        [name in keyof contracts as contracts[name] extends {
          abi: infer abi extends Abi;
        }
          ?
              | `${name & string}:${_FormatEventNames<contracts[name]> | Setup}`
              | (contracts[name] extends { includeCallTraces: true }
                  ? `${name & string}.${_FormatFunctionNames<contracts[name]>}`
                  : never)
          : never]?: (context: { db: EntityManager }) => void;
      } & {
        [name in keyof accounts as `${name & string}:${
          | "transaction"
          | "transfer"}:${"from" | "to"}`]?: (context: {
          db: EntityManager;
        }) => void;
      } & {
        [name in keyof blocks as `${name & string}:block`]?: (context: {
          db: EntityManager;
        }) => void;
      };