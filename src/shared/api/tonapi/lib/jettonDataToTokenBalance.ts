import { Address } from "@ton/core";
import { CHAINS, TokenBalance } from "../../../lib/types";
import { GetRatesDTO, JettonDataCoffee } from "../types";
import { JettonMetadataResponse } from "../types/getJettonDataByIdDTO";

export const jettonDataToTokenBalance = (
    token: JettonMetadataResponse,
    rates: JettonDataCoffee
): TokenBalance => {
    const contract = Address.parse(token.metadata.address).toString({ bounceable: true });
    const metadata = token.metadata;
    return {
        tokenContract: contract, // bounceable: true для API коингеко
        tokenID: metadata?.name,
        tokenSymbol: metadata?.symbol,
        tokenIcon: metadata?.image,
        tokenName: metadata?.name,
        balanceUSD: 0,
        balance: 0,
        change24h: parseFloat(rates.price_change_24h.toString().replace("−", "-").replace("%", "")),
        price: rates.price_usd,
        platform: CHAINS.TON,
        isNativeToken: false,
        decimals: Number(metadata?.decimals),
    };
};
