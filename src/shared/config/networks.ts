import { CHAINS } from "@/shared/lib/types";

export const networkLabels: Record<CHAINS, string> = {
    [CHAINS.BNB]: "BNB Smart Chain (BEP20)",
    [CHAINS.TON]: "The Open Network",
    [CHAINS.TRON]: "Tron(TRC-20)",
    [CHAINS.ETH]: "Ethereum (ERC-20)",
    [CHAINS.SOLANA]: "Solana",
    [CHAINS.SUI]: "Sui",
    [CHAINS.STELLAR]: "Stellar Network"
};
