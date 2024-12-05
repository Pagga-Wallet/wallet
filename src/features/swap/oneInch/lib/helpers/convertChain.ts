import { CHAINS, EVM_CHAINS } from "@/shared/lib/types";

export const convertChain = (chain: EVM_CHAINS): number | null => {
    switch (chain) {
        case CHAINS.ETH:
            return 1;
        case CHAINS.BNB:
            return 56;
        default:
            return null;
    }
};
