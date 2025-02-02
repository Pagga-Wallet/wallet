import BNB from "@/shared/lib/images/network/bnb.png";
import ETHEREUM from "@/shared/lib/images/network/ethereum.png";
import POLYGON from "@/shared/lib/images/network/polygon.png";
import TRON from "@/shared/lib/images/network/tron.png";
import SUI from "@/shared/lib/images/suiNetwork.png";
import { CHAINS } from "../../types";

export type SelectBlockhainConfig = Array<{
    category: string;
    previewUrl: string;
    chain: CHAINS | null;
    disabled?: boolean;
}>;

export const getSelectBlockhainConfig = (
    enabledChains?: Array<CHAINS | null>
): SelectBlockhainConfig => [
    {
        category: "Ton",
        previewUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/11419.png",
        disabled: enabledChains ? !enabledChains?.includes(CHAINS.TON) : false,
        chain: CHAINS.TON
    },
    {
        category: "Ethereum",
        previewUrl: ETHEREUM,
        disabled: enabledChains ? !enabledChains?.includes(CHAINS.ETH) : false,
        // disabled: true,
        chain: CHAINS.ETH
    },
    {
        category: "Tron",
        previewUrl: TRON,
        disabled: enabledChains ? !enabledChains?.includes(CHAINS.TRON) : false,
        // disabled: true,
        chain: CHAINS.TRON
    },
    {
        category: "BNB Smart Chain",
        previewUrl: BNB,
        disabled: enabledChains ? !enabledChains?.includes(CHAINS.BNB) : false,
        // disabled: true,
        chain: CHAINS.BNB
    },
    {
        category: "Solana",
        previewUrl:
            "https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756",
        disabled: enabledChains ? !enabledChains?.includes(CHAINS.SOLANA) : false,
        // disabled: true,
        chain: CHAINS.SOLANA
    },
    {
        category: "Solana",
        previewUrl: SUI,
        disabled: enabledChains ? !enabledChains?.includes(CHAINS.SUI) : false,
        // disabled: true,
        chain: CHAINS.SUI
    }
    // {
    //     category: "Polygon",
    //     previewUrl: POLYGON,
    //     disabled: true,
    //     chain: null
    // }
];

export const importList: SelectBlockhainConfig = getSelectBlockhainConfig().filter(
    el => el.chain !== CHAINS.TON
);
