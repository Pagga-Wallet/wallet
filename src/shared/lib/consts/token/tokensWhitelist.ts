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
        id: "DFC",
        contract: "EQD26zcd6Cqpz7WyLKVH8x_cD6D7tBrom6hKcycv8L8hV0GP",
        chain: CHAINS.TON,
        order: 2,
    },
    {
        id: "CES",
        contract: "EQCl0S4xvoeGeFGijTzicSA8j6GiiugmJW5zxQbZTUntre-1",
        chain: CHAINS.TON,
        order: 3,
    },
    {
        id: "ARBUZ",
        contract: "EQAM2KWDp9lN0YvxvfSbI0ryjBXwM70rakpNIHbuETatRWA1",
        order: 4,
        chain: CHAINS.TON,
    },
    {
        id: "tether",
        contract: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
        chain: CHAINS.TON,
        order: 1,
    },
];
export const ERC20TokensWhitelist: WhitelistItem[] = [
    {
        id: "ARBUZ",
        contract: "0x10Ba2e5ac2e91d5A89Fe0f89bB625EBCefFf812D",
        chain: CHAINS.ETH,
        overrideIcon:
            "https://cache.tonapi.io/imgproxy/HxPeXiiX4pF3QFOJCnpmcEO8scn3vZsMstfXySfK5oI/rs:fill:200:200:1/g:no/aHR0cHM6Ly9pLnBvc3RpbWcuY2MvWEpnVmY3cGIvYXJiLnBuZw.webp",
    },
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
    // PROD-TON-ONLY
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
