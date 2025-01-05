export enum CoinIds {
    TON = "the-open-network",
    ETH = "ethereum",
    TETHER = "tether",
    BNB = "binancecoin",
    TRON = "tron",
    SOLANA = "solana"
}
export enum ContractAddresses {
    ETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
}
export enum VSCurrencies {
    usd = "usd"
}

export interface CoinPrice {
    price: number;
    change24h?: number;
}
export type CoinPriceResult<T> = T extends any[] ? CoinPrice[] : CoinPrice;
export type ContractAddress = ContractAddresses | string;
