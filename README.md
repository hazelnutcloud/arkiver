# Arkiver

A lightweight, type-safe blockchain data indexing framework built with TypeScript and Bun.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0+-f472b6.svg)](https://bun.sh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Arkiver is a blockchain data indexing framework that provides a type-safe way to index and transform blockchain events, transactions, and blocks into structured data. Built with performance and portability in mind, Arkiver leverages MikroORM for efficient database management and Viem for blockchain interactions.

Inspired by [Ponder](https://ponder.sh/), Arkiver addresses key limitations in existing indexing solutions:
- **Superior Performance**: Efficient in-memory reorg handling and batch database operations
- **Enhanced Portability**: Works as a lightweight library that can be compiled to a single file or binary
- **Greater Flexibility**: Simple API design that doesn't lock you into a specific framework

## Features

- 🚀 **High Performance Indexing**
  - Efficient in-memory reorg handling via Unit-of-Work pattern
  - Optimized database reads through Identity Map pattern
  - Batch database writes for improved throughput

- 🔧 **Flexible Architecture**
  - Lightweight library approach (not a framework)
  - Compile to single file or cross-platform binary with Bun
  - No CLI dependency - integrate directly into your application

- 🗄️ **Multi-Database Support**
  - PostgreSQL, MySQL, SQLite, MongoDB, and more via MikroORM
  - Type-safe entity definitions
  - Advanced query capabilities

- 🔐 **Type Safety**
  - Full TypeScript support with strict typing
  - Type-safe contract ABIs via abitype
  - Autocomplete for event names and parameters

- ⛓️ **Multi-Chain Support**
  - Index multiple blockchains simultaneously
  - Flexible chain configuration
  - Support for any EVM-compatible chain

## Installation

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- TypeScript >= 5.0

### Install

```bash
bun add arkiver
```

### Peer Dependencies

```bash
bun add @mikro-orm/core
```

## Quick Start

```typescript
import { createArkive } from "arkiver";
import { defineEntity } from "@mikro-orm/core";
import { erc20Abi } from "viem";

// Define your entities
const Transfer = defineEntity({
  name: "transfers",
  properties: (p) => ({
    id: p.text().primary(),
    from: p.text(),
    to: p.text(),
    amount: p.bigint(),
    timestamp: p.bigint(),
  }),
});

// Create and configure your arkive
const arkive = createArkive({
  entities: [Transfer],
  
  chains: {
    mainnet: {
      id: 1,
      rpc: "https://eth.llamarpc.com",
    },
  },
  
  sources: {
    contracts: {
      USDC: {
        abi: erc20Abi,
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        chain: "mainnet",
        startBlock: 6082465,
      },
    },
  },
  
  transformers: {
    "USDC:Transfer": ({ event, db }) => {
      db.create(Transfer, {
        id: event.transactionHash,
        from: event.args.from,
        to: event.args.to,
        amount: event.args.value,
        timestamp: event.block.timestamp,
      });
    },
  },
});

// Start indexing
await arkive.run();
```

## Core Concepts

### Entities

Entities define the structure of data stored in your database using MikroORM's schema definition:

```typescript
const Account = defineEntity({
  name: "accounts",
  properties: (p) => ({
    id: p.text().primary(),
    balance: p.bigint(),
    transactionCount: p.integer(),
    lastActive: p.datetime(),
  }),
});
```

### Sources

Sources define what blockchain data to index:

#### Contract Sources
```typescript
sources: {
  contracts: {
    MyToken: {
      abi: myTokenAbi,
      address: "0x...",
      chain: "mainnet",
      startBlock: 1000000,
      includeCallTraces: true, // Optional: index function calls
    },
  },
}
```

#### Account Sources
```typescript
sources: {
  accounts: {
    Treasury: {
      address: "0x...",
      chain: "mainnet",
      startBlock: 1000000,
    },
  },
}
```

#### Block Sources
```typescript
sources: {
  blocks: {
    EveryHundredBlocks: {
      chain: "mainnet",
      startBlock: 1000000,
      interval: 100, // Index every 100 blocks
    },
  },
}
```

### Transformers

Transformers process indexed data and store it in your database:

```typescript
transformers: {
  // Contract event transformer
  "MyToken:Transfer": async ({ event, db }) => {
    // Process transfer event
  },
  
  // Account transaction transformer
  "Treasury:transaction:from": async ({ transaction, db }) => {
    // Process outgoing transactions
  },
  
  // Block transformer
  "EveryHundredBlocks:block": async ({ block, db }) => {
    // Process block data
  },
}
```

### Chains

Configure blockchain connections:

```typescript
chains: {
  mainnet: {
    id: 1,
    rpc: "https://eth.llamarpc.com",
    pollingInterval: 2000, // Optional: milliseconds
  },
  polygon: {
    id: 137,
    rpc: ["https://polygon-rpc.com", "https://backup-rpc.com"], // Multiple RPCs for fallback
  },
}
```

### Multi-Chain Indexing

Index the same contract across multiple chains:

```typescript
sources: {
  contracts: {
    USDC: {
      abi: erc20Abi,
      chain: {
        mainnet: {
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          startBlock: 6082465,
        },
        polygon: {
          address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          startBlock: 6000000,
        },
      },
    },
  },
}
```

## Architecture

### How It Works

1. **Configuration**: Define entities, sources, and transformers
2. **Indexing**: Arkiver fetches blockchain data based on your sources
3. **Processing**: Transformers process the data and update the database
4. **Reorg Handling**: Automatic handling of blockchain reorganizations
5. **Real-time Updates**: Continuous indexing of new blocks

### Performance Optimizations

- **Unit-of-Work Pattern**: Batches database operations for efficiency
- **Identity Map**: Prevents duplicate entity loads within a transaction
- **In-Memory Reorg Buffer**: Handles reorganizations without heavy database operations
- **Parallel Processing**: Concurrent processing of independent transformers

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/arkiver.git
cd arkiver

# Install dependencies
bun install

# Run tests
bun test

# Build the project
bun build ./packages/arkiver/src/index.ts
```

### Running Examples

```bash
cd examples/basic-indexer
bun install
bun run index.ts
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Comparison with Ponder

| Feature | Arkiver | Ponder |
|---------|---------|---------|
| Runtime | Bun and Node.js | Node.js |
| Architecture | Library | Framework |
| Database | MikroORM (Multiple DBs) | DrizzleORM (PostgreSQL only) |
| Reorg Handling | In-memory | Database-heavy |
| Deployment | Single file/binary | CLI required |
| Type Safety | Full TypeScript | Full TypeScript |

## Roadmap

- [ ] Typesafe client RPC library
- [ ] WebSocket support for real-time updates
- [ ] Built-in monitoring and metrics
- [ ] Plugin system for custom extensions
- [ ] Non-EVM blockchain support

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Inspired by [Ponder](https://ponder.sh/)
- Built with [Bun](https://bun.sh/), [Viem](https://viem.sh/), and [MikroORM](https://mikro-orm.io/)