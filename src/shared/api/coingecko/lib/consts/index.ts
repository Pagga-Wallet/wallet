import { CHAINS } from "@/shared/lib/types";
import { CoinIds } from "../types";

export const chainToGeckoPlatform: { [key in CHAINS]: string } = {
    [CHAINS.ETH]: "ethereum",
    [CHAINS.BNB]: "binance-smart-chain",
    [CHAINS.TON]: "the-open-network",
    [CHAINS.TRON]: "tron",
    [CHAINS.SOLANA]: "solana",
    [CHAINS.SUI]: "sui"
};

export const chainToGeckoTokenID: { [key in CHAINS]: string } = {
    [CHAINS.ETH]: CoinIds.ETH,
    [CHAINS.BNB]: CoinIds.BNB,
    [CHAINS.TON]: CoinIds.TON,
    [CHAINS.TRON]: CoinIds.TRON,
    [CHAINS.SOLANA]: CoinIds.SOLANA,
    [CHAINS.SUI]: CoinIds.SUI
};
