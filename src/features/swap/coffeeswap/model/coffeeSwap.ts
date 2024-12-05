import { Address } from "@ton/ton";
import axios from "axios";
import { CHAINS, PromisedAPIResponse, TokenBalance } from "@/shared/lib/types";

export interface Asset {
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
    image: string;
    external_id: string;
    stacking_pool_id: string | null;
    stacking_pool: string | null;
}

export interface ErrorCoffee {
    status: "error";
}

export interface ErrorApi {
    error: string;
}

export interface Route {
    input_token: any;
    output_token: any;
    input_amount: number;
    output_amount: number;
    input_usd: number;
    output_usd: number;
    savings?: number;
    left_amount?: number;
    recommended_gas: number;
    price_impact: number;
    paths: any;
}

export interface Transaction {
    route_id: number;
    transactions: {
        address: string;
        value: string;
        cell: string;
        send_mode: number;
        query_id: number;
    }[];
}

export interface GetRouteDTO {
    inputToken: Address | "native";
    outputToken: Address | "native";
    amount: number;
    inputAmount?: boolean;
}

export interface BuildBOCDTO {
    addressUser: Address;
    paths: any;
    slippage?: number;
}

export class CoffeeSwap {
    readonly _url = "https://backend.swap.coffee/";

    constructor() {}

    async getAssetsList(): PromisedAPIResponse<TokenBalance[] | null> {
        try {
            const data = await axios.get<Asset[]>(
                "https://tokens.swap.coffee/api/v1/tokens/1/tokens"
            );
            if (!data) return { data: null, isError: true };
            return {
                data: data.data.map((asset) => ({
                    tokenContract: Address.parse(asset.address).toString(),
                    tokenID: asset.name,
                    tokenSymbol: asset.symbol,
                    tokenName: asset.name,
                    tokenIcon: asset.image,
                    platform: CHAINS.TON,
                    isNativeToken: false,
                    decimals: asset.decimals,
                    balance: 0,
                    balanceUSD: 0,
                    price: asset.price_usd,
                    change24h: asset.price_change_24h,
                })),
                isError: !data.data,
            };
        } catch (error) {
            console.error(error);
            return { data: null, isError: true };
        }
    }

    async getRoute({
        inputToken,
        outputToken,
        amount,
        inputAmount = true,
    }: GetRouteDTO): PromisedAPIResponse<Route | null> {
        try {
            const data = await axios.post(this._url + "v1/route", {
                input_token: {
                    blockchain: "ton",
                    address: inputToken.toString(),
                },
                output_token: {
                    blockchain: "ton",
                    address: outputToken.toString(),
                },
                input_amount: inputAmount ? amount : undefined,
                output_amount: inputAmount ? undefined : amount,
                max_splits: 4,
                max_length: 3,
                pool_selector: {
                    blockchains: ["ton"],
                    max_volatility: 1,
                },
            });
            if (!data) return { data: null, isError: true };
            return { data: data.data ?? null, isError: !data.data };
        } catch (error) {
            console.error(error);
            return { data: null, isError: true };
        }
    }

    async buildBOC({
        addressUser,
        paths,
        slippage = 5,
    }: BuildBOCDTO): PromisedAPIResponse<Transaction> {
        if (slippage < 0 || slippage > 100) {
            console.error("slippage not percent", slippage);
        }
        try {
            const data = await axios.post(this._url + "v2/route/transactions", {
                sender_address: addressUser.toString(),
                slippage: slippage / 100,
                paths: paths,
                // referral_name: "dewallet",
            });
            if (!data) return { data: null, isError: true };
            return { data: data.data ?? null, isError: !data.data };
        } catch (error) {
            console.error(error);
            return { data: null, isError: true };
        }
    }
}

export const coffeeSwap = new CoffeeSwap();
