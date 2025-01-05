import { CHAINS } from "../types";

const chainsToTrustPlatform: Record<CHAINS, string> = {
    [CHAINS.BNB]: "smartchain",
    [CHAINS.ETH]: "ethereum",
    [CHAINS.TON]: "ton",
    [CHAINS.TRON]: "tron",
    [CHAINS.SOLANA]: "solana"
};

export const getTokenIconUrl = (platform: CHAINS, contractAddress: string): string => {
    const chain = chainsToTrustPlatform[platform];
    if (!chain) return "";
    const baseUrl = "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/";
    const iconUrl = `${baseUrl}${chain}/assets/${contractAddress}/logo.png`;
    return iconUrl;
};
