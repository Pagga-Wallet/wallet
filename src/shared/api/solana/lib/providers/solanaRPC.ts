import { Connection } from "@solana/web3.js";

const net = "devnet";
export const solanaRPC = new Connection(`https://api.${net}.solana.com`, "confirmed");
