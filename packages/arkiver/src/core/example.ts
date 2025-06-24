// for reference

// import { defineEntity } from "@mikro-orm/core";
// import { erc20Abi } from "viem";
// import { riseTestnet } from "viem/chains";
// import { createArkive } from "./createArkive.ts";

// const account = defineEntity({
//   name: "accounts",
//   properties: (p) => ({
//     address: p.string().primary(),
//     balance: p.bigint(),
//   }),
// });

// const arkive = createArkive({
//   entities: [account],
//   sources: {
//     contracts: {
//       Usdc: {
//         abi: erc20Abi,
//         chain: "riseTestnet",
//       },
//     },
//   },
//   transformers: {
//     "Usdc:Transfer": async (ctx, event) => {
//       const accounts = await ctx.db.findAll(account, {
//         where: {
//           address: {
//             $in: [event.args.from, event.args.to],
//           },
//         },
//       });

//       const sender = accounts.find(({ address }) => (address = event.args.from))!;
//       const receiver = accounts.find(({ address }) => (address = event.args.to))!;

//       sender.balance -= event.args.amount;
//       receiver.balance += event.args.amount;
//     },
//   },
//   chains: {
//     riseTestnet: {
//       id: riseTestnet.id,
//       rpc: riseTestnet.rpcUrls.default.http[0],
//     },
//   },
// });

// await arkive.run();
