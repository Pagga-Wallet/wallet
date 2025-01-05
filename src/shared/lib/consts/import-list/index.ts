import BNB from "@/shared/lib/images/network/bnb.png";
import ETHEREUM from "@/shared/lib/images/network/ethereum.png";
import POLYGON from "@/shared/lib/images/network/polygon.png";
import TRON from "@/shared/lib/images/network/tron.png";
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
        chain: CHAINS.TON,
    },
    {
        category: "Ethereum",
        previewUrl: ETHEREUM,
        disabled: enabledChains ? !enabledChains?.includes(CHAINS.ETH) : false,
        // disabled: true,
        chain: CHAINS.ETH,
    },
    {
        category: "Tron",
        previewUrl: TRON,
        disabled: enabledChains ? !enabledChains?.includes(CHAINS.TRON) : false,
        // disabled: true,
        chain: CHAINS.TRON,
    },
    {
        category: "BNB Smart Chain",
        previewUrl: BNB,
        disabled: enabledChains ? !enabledChains?.includes(CHAINS.BNB) : false,
        // disabled: true,
        chain: CHAINS.BNB,
    },
    {
        category: "Polygon",
        previewUrl: POLYGON,
        disabled: true,
        chain: null,
    },
];

export const importList: SelectBlockhainConfig = getSelectBlockhainConfig().filter(
    (el) => el.chain !== CHAINS.TON
);
