import { IPaginationParams } from "./paginationParams";

export interface GetTokenTransactionsDTO extends IPaginationParams {
    address?: string;
    contractaddress: string;
}

export type TokenTransactionsResponse = Array<{
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
    value: string;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: string;
    transactionIndex: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    cumulativeGasUsed: string;
    input: string;
    confirmations: string;
}>;
