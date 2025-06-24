# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Arkiver is a blockchain data indexing framework built with Bun and TypeScript. It provides a type-safe way to index and transform blockchain events, transactions, and blocks into structured data using MikroORM for database management.

## Architecture

This is a monorepo with the following structure:
- `packages/arkiver/` - Core indexing framework
- `examples/` - Example implementations (to be added)

The core framework (`packages/arkiver/src/core/arkive.ts`) provides:
- **Contract indexing**: Index events from smart contracts using ABIs
- **Account tracking**: Track account transactions and transfers  
- **Block indexing**: Index blocks at specified intervals
- **Multi-chain support**: Configure multiple blockchain networks
- **Transform functions**: Process indexed data with custom transformers
- **Database integration**: Uses MikroORM for data persistence

## Development Commands

```bash
# Install dependencies
bun install

# Run TypeScript files directly (from packages/arkiver)
bun run src/index.ts

# Run tests (when implemented)
bun test

# Type checking (TypeScript runs through Bun)
bun run tsc --noEmit
```

## Bun-Specific Guidelines

Default to using Bun instead of Node.js:

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv

### Bun APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`
- `Bun.redis` for Redis. Don't use `ioredis`
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`
- `WebSocket` is built-in. Don't use `ws`
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa

### Testing

Use `bun test` to run tests:

```ts
import { test, expect } from "bun:test";

test("example test", () => {
  expect(1).toBe(1);
});
```

## Key Dependencies

- **viem**: Ethereum library for blockchain interactions
- **abitype**: Type-safe ABI parsing and formatting
- **@mikro-orm/core**: Database ORM (peer dependency)
- **TypeScript 5+**: Required peer dependency

## Usage Pattern

The framework follows this pattern:

```typescript
import { createArkive } from "arkiver";

const arkive = createArkive({
  entities: [/* MikroORM entities */],
  sources: {
    contracts: {
      ContractName: {
        abi: contractAbi,
        chain: "chainName",
        address: "0x...",
        includeCallTraces: true, // Optional
      }
    },
    accounts: {
      AccountName: {
        chain: "chainName",
        address: "0x...",
      }
    },
    blocks: {
      BlockName: {
        chain: "chainName",
        interval: 100,
      }
    }
  },
  transformers: {
    "ContractName:EventName": async (ctx) => {
      // Handle contract events
    },
    "AccountName:transaction:from": async (ctx) => {
      // Handle account transactions
    },
    "BlockName:block": async (ctx) => {
      // Handle blocks
    }
  },
  chains: {
    chainName: {
      id: 1234,
      rpc: "https://...",
    }
  }
});

await arkive.run();
```

## TypeScript Configuration

The project uses modern TypeScript with:
- ESNext target
- Bundler module resolution
- Strict mode enabled
- JSX support (react-jsx)
- `.ts` extensions allowed in imports

## Frontend Development

When building frontend applications with Bun:

```ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly:

```html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

Run with hot reload:
```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.md`.