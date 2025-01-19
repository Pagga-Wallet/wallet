import { IPaginationParams } from "./paginationParams";

export interface GetTokenTransactionsDTO extends IPaginationParams {
    address?: string;
    contractaddress: string;
}

export type TokenTransactionsResponse = Array<{
    transaction_id: string;
    token_info: {
        symbol: string;
        address: string;
        decimals: number;
        name: string;
    };
    block_timestamp: number;
    from: string;
    to: string;
    type: string;
    value: string;
}>;
