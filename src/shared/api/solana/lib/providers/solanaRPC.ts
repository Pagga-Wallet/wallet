import { Connection } from "@solana/web3.js";

const rpcUrl =
    import.meta.env.VITE_NETWORK === "MAINNET"
        ? "https://solana-api.instantnodes.io/token-" + import.meta.env.VITE_SOLANA_RPC_API_KEY
        : "https://api.devnet.solana.com";
export const solanaRPC = new Connection(rpcUrl, "confirmed");
