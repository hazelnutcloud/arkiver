import type {
  AbiEvent,
  AbiFunction,
  ExtractAbiEvents,
  ExtractAbiFunctions,
  FormatAbiItem,
  ParseAbiItem,
} from "abitype";
import type { Abi, GetEventArgs } from "viem";

export type FormatAbiFunction<
  abi extends Abi,
  _function extends AbiFunction,
  ///
  abiFunctions extends AbiFunction = ExtractAbiFunctions<abi>,
  matchingNameFunctions extends AbiFunction = Extract<
    abiFunctions,
    { name: _function["name"] }
  >
> = [matchingNameFunctions] extends [never]
  ? Abi extends abi
    ? `${_function["name"]}()`
    : never
  : [Exclude<matchingNameFunctions, _function>] extends [never]
  ? `${_function["name"]}()`
  : FormatAbiItem<_function> extends `function ${infer signature}`
  ? signature
  : never;

export type SafeFunctionNames<
  abi extends Abi,
  ///
  abiFunctions extends AbiFunction = ExtractAbiFunctions<abi>
> = abiFunctions extends abiFunctions
  ? FormatAbiFunction<abi, abiFunctions>
  : never;

export type FormatAbiEvent<
  abi extends Abi,
  event extends AbiEvent,
  ///
  abiEvents extends AbiEvent = ExtractAbiEvents<abi>,
  matchingNameEvents extends AbiEvent = Extract<
    abiEvents,
    { name: event["name"] }
  >
> = [matchingNameEvents] extends [never]
  ? Abi extends abi
    ? event["name"]
    : never
  : [Exclude<matchingNameEvents, event>] extends [never]
  ? event["name"]
  : FormatAbiItem<event> extends `event ${infer signature}`
  ? signature
  : never;

export type SafeEventNames<
  abi extends Abi,
  ///
  abiEvents extends AbiEvent = ExtractAbiEvents<abi>
> = abiEvents extends abiEvents ? FormatAbiEvent<abi, abiEvents> : never;

export type ParseAbiEvent<
  abi extends Abi,
  signature extends string,
  ///
  abiEvents extends AbiEvent = ExtractAbiEvents<abi>,
  noOverloadEvent = Extract<abiEvents, { name: signature }>,
  overloadEvent = Extract<abiEvents, ParseAbiItem<`event ${signature}`>>
> = [noOverloadEvent] extends [never]
  ? [overloadEvent] extends [never]
    ? AbiEvent
    : overloadEvent
  : noOverloadEvent;

export type FilterArgs<abi extends Abi, event extends string> = GetEventArgs<
  abi,
  string,
  {
    EnableUnion: true;
    IndexedOnly: true;
    Required: false;
  },
  ParseAbiEvent<abi, event>
>;

export type GetEventFilter<
  abi extends Abi,
  ///
  safeEventNames extends string = SafeEventNames<abi>
> = {
  filter?:
    | (safeEventNames extends safeEventNames
        ? {
            event: safeEventNames;
            args: FilterArgs<abi, safeEventNames>;
          }
        : never)
    | (safeEventNames extends safeEventNames
        ? {
            event: safeEventNames;
            args: FilterArgs<abi, safeEventNames>;
          }
        : never)[];
};