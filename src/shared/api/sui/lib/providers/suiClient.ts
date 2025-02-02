import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

// use getFullnodeUrl to define Devnet RPC location
const rpcUrl = getFullnodeUrl(import.meta.env.VITE_NETWORK === "MAINNET" ? "mainnet" : "testnet");

// create a client connected to devnet
export const suiClient = new SuiClient({ url: rpcUrl });
