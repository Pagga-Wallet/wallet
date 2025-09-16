import { CHAINS } from "@/shared/lib/types/multichainAccount";

export interface StellarSendResult {
    isError: boolean;
    hash?: string;
    errorMessage?: string;
}

export interface StellarBalanceResult {
    isError: boolean;
    data?: number;
    errorMessage?: string;
}

export interface StellarTokenBalance {
    tokenContract?: string;
    tokenSymbol: string;
    tokenName: string;
    balance: number;
    balanceUSD: number;
    price: number;
    decimals: number;
    platform: CHAINS.STELLAR;
    isNativeToken: boolean;
    change24h?: number;
}

export interface StellarTokenBalancesResult {
    isError: boolean;
    data?: StellarTokenBalance[];
    errorMessage?: string;
}

export interface StellarSendParams {
    destinationAddress: string;
    amount: string;
    memo?: string;
    useFreighter?: boolean;
    privateKey?: string;
}

export interface StellarAssetSendParams extends StellarSendParams {
    asset: string;
    issuer?: string;
}
