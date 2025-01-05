import { IPaginationParams } from "./paginationParams";

export interface GetNormalTransactionsDTO extends IPaginationParams {
    address?: string;
}

export type NormalTransactionsResponse = Array<{
    txID: string;
    blockNumber: number;
    block_timestamp: number;
    ret: Array<{
        contractRet: string;
        fee: number;
    }>;
    signature: string[];
    raw_data_hex: string;
    raw_data: {
        contract: Array<{
            parameter: {
                value: {
                    owner_address: string;
                    to_address: string;
                    amount: number;
                };
                type_url: string;
            };
            type: string;
        }>;
        ref_block_bytes: string;
        ref_block_hash: string;
        expiration: number;
        timestamp: number;
    };
    energy_fee: number;
    energy_usage: number;
    energy_usage_total: number;
    net_fee: number;
    net_usage: number;
}>;
