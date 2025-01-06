import { Connection } from "@solana/web3.js";

const net = import.meta.env.VITE_NETWORK === "MAINNET" ? "mainnet" : "devnet";
export const solanaRPC = new Connection(`https://api.${net}.solana.com`, "confirmed");
