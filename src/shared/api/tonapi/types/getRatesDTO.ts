interface TokenRates {
    prices: { [key: string]: number };
    diff_24h: { [key: string]: string };
    diff_7d: { [key: string]: string };
    diff_30d: { [key: string]: string };
}

export interface GetRatesDTO {
    rates: {
        [key: string]: TokenRates;
    };
}

export interface JettonDataCoffee {
    id: number;
    blockchain_id: number;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    price_usd: number;
    price_change_24h: number;
    tvl: number;
    holders_count: number;
    image: string | null;
    external_id: string;
    stacking_pool_id: string | null;
    stacking_pool: string | null;
}
