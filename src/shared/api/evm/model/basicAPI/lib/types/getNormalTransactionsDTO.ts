import { IPaginationParams } from "./paginationParams";

export interface GetNormalTransactionsDTO extends IPaginationParams {
    address?: string;
}

export type NormalTransactionsResponse = Array<{
    blockHash: string;
    blockNumber: string;
    confirmations: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    from: string;
    functionName: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    hash: string;
    input: string;
    isError: string;
    methodId: string;
    nonce: string;
    timeStamp: string;
    to: string;
    transactionIndex: string;
    txreceipt_status: string;
    value: string;
}>;
