import { CHAINS } from "../../types";
import {
    USDT_ERC20_CONTRACT_CURRENT_NETWORK,
    USDT_TRC20_CONTRACT_CURRENT_NETWORK,
} from "./contractAddresses";

export interface WhitelistItem {
    id?: string;
    contract: string;
    overrideIcon?: string;
    chain: CHAINS;
    order?: number;
}

export const jettonsWhitelist: WhitelistItem[] = [
    {
        id: "tether",
        contract: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
        chain: CHAINS.TON,
        order: 1,
    },
];
export const ERC20TokensWhitelist: WhitelistItem[] = [
    {
        id: "tether-erc20",
        contract: USDT_ERC20_CONTRACT_CURRENT_NETWORK,
        chain: CHAINS.ETH,
        overrideIcon:
            "https://raw.githubusercontent.com/delab-team/manifests-images/main/tether-cion-160x160.png",
    },
];
export const TRC20TokensWhitelist: WhitelistItem[] = [
    {
        id: "tether-trc20",
        contract: USDT_TRC20_CONTRACT_CURRENT_NETWORK,
        chain: CHAINS.TRON,
        overrideIcon:
            "https://raw.githubusercontent.com/delab-team/manifests-images/main/tether-cion-160x160.png",
    },
];
export const BEP20TokensWhitelist: WhitelistItem[] = [
    {
        id: "BUSD",
        contract: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        chain: CHAINS.BNB,
    },
    {
        id: "tether-bep20",
        contract: "0x55d398326f99059fF775485246999027B3197955",
        chain: CHAINS.BNB,
    },
];

export const tokensWhitelist = [
    ...ERC20TokensWhitelist,
    ...TRC20TokensWhitelist,
    ...BEP20TokensWhitelist,
    ...jettonsWhitelist,
] as WhitelistItem[];

// Порядок нативных токенов
export const tokenNativeSortArr = [CHAINS.TON, CHAINS.ETH, CHAINS.BNB, CHAINS.TRON];
// Порядок вайтлиста по order
export const tokenWhitelistSortArr = tokensWhitelist
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
    .map((token) => token.contract.toLowerCase());
