# Demo: StakeIt – Gamified To-Do DApp on Ethereum

## Overview

**StakeIt** is a simple decentralized application (DApp) that combines productivity with blockchain incentives.
Users stake a small fixed amount of ETH to create their first task. They can then add more tasks without additional staking. Once all tasks are completed, the staked ETH can be withdrawn.

This project demonstrates how gamification and smart contracts can be combined to promote accountability and task completion.



## Usage demo




## Build & Deploy

### Prerequisites

* Node.js (v16+ recommended)
* npm or yarn
* MetaMask (or any Ethereum wallet for testing)
* foundry or Truffle (for local Ethereum development)

### Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/Ah141/StakeIt-Dapp
cd StakeIt-Dapp
npm install
```

### Compile & Deploy Contracts


```bash
npm install
npm run dev
```

Open your browser at `http://localhost:3000`.

## Smart Contract Features

* **Stake to start** – first task requires staking `0.0001 ETH`.
* **Add unlimited tasks** – without extra staking.
* **Complete tasks** – mark tasks as done.
* **Withdraw stake** – once all tasks are completed, reclaim ETH.

## Frontend

* **React + Next.js** for UI.
* **wagmi** for Ethereum wallet connection and contract interaction.

## Live Deployment

*Coming soon – link to deployed version.*

## Architecture

* **Smart Contract**: Solidity contract managing tasks & stakes.
* **Frontend**: React/Next.js UI using wagmi to connect with MetaMask.
* **Blockchain**: Ethereum-compatible network (local or testnet).

## License

MIT License.
