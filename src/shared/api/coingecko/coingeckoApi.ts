import { BaseToken, CHAINS, TokenPriceHistory } from "@/shared/lib/types";
import { chainToGeckoPlatform, chainToGeckoTokenID } from "./lib/consts";
import { coingeckoInstanse } from "./lib/providers/coingeckoInstance";
import { CoinIds, CoinPrice, CoinPriceResult, ContractAddress, VSCurrencies } from "./lib/types";

class CoingeckoClient {
    async getCoinPriceByContract<T extends ContractAddress | ContractAddress[]>(
        chain: CHAINS,
        contractAddress: T,
        vsCurrency: VSCurrencies = VSCurrencies.usd
    ): Promise<CoinPriceResult<T>> {
        try {
            const tokenContracts = Array.isArray(contractAddress)
                ? contractAddress.join(",")
                : contractAddress;

            const data = (
                await coingeckoInstanse.get("/simple/token_price/" + chainToGeckoPlatform[chain], {
                    params: {
                        contract_addresses: tokenContracts,
                        vs_currencies: vsCurrency,
                        include_market_cap: false,
                        include_24hr_vol: false,
                        include_24hr_change: true,
                        include_last_updated_at: false,
                    },
                })
            ).data;

            if (Array.isArray(contractAddress)) {
                return contractAddress.map<CoinPrice>((id) => ({
                    price: Number(data[id.toLowerCase()]?.[vsCurrency] ?? 0),
                    change24h: Number(data[id.toLowerCase()]?.usd_24h_change ?? 0),
                })) as CoinPriceResult<T>;
            } else {
                return {
                    price: Number(data[contractAddress.toLowerCase()]?.[vsCurrency] ?? 0),
                    change24h: Number(data[contractAddress.toLowerCase()]?.usd_24h_change ?? 0),
                } as CoinPriceResult<T>;
            }
        } catch (error) {
            console.error(error);
            return (
                Array.isArray(contractAddress)
                    ? new Array(contractAddress.length).fill({ price: 0 })
                    : { price: 0 }
            ) as CoinPriceResult<T>;
        }
    }

    async getCoinPriceByCoinID<T extends CoinIds | CoinIds[]>(
        coinID: T,
        vsCurrency: VSCurrencies = VSCurrencies.usd
    ): Promise<CoinPriceResult<T>> {
        try {
            const coinIDs = Array.isArray(coinID) ? coinID.join(",") : coinID;

            const data = (
                await coingeckoInstanse.get("/simple/price", {
                    params: {
                        ids: coinIDs,
                        vs_currencies: vsCurrency,
                        include_market_cap: false,
                        include_24hr_vol: false,
                        include_24hr_change: true,
                        include_last_updated_at: false,
                    },
                })
            ).data;

            if (Array.isArray(coinID)) {
                return coinID.map<CoinPrice>((id) => ({
                    price: +data[id][vsCurrency],
                    change24h: +data[id].usd_24h_change,
                })) as CoinPriceResult<T>;
            } else {
                return {
                    price: +data[coinID][vsCurrency],
                    change24h: +data[coinID].usd_24h_change,
                } as CoinPriceResult<T>;
            }
        } catch (error) {
            console.error(error);
            return (
                Array.isArray(coinID) ? new Array(coinID.length).fill({ price: 0 }) : { price: 0 }
            ) as CoinPriceResult<T>;
        }
    }

    async getPriceHistoryByToken(
        token: BaseToken,
        vsCurrency: VSCurrencies = VSCurrencies.usd
    ): Promise<TokenPriceHistory> {
        try {
            const platform = chainToGeckoPlatform[token.platform];
            let url = "";
            if (token.isNativeToken) {
                url = `/coins/${chainToGeckoTokenID[token.platform]}/market_chart`;
            } else if (token.tokenContract) {
                url = `/coins/${platform}/contract/${token.tokenContract.toLowerCase()}/market_chart`;
            } else return [];
            const data = (
                await coingeckoInstanse.get(url, {
                    params: {
                        vs_currency: vsCurrency,
                        days: 30,
                    },
                })
            ).data;
            return data?.prices ?? [];
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}

export const coingeckoClient = new CoingeckoClient();
