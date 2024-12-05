import { IPaginationParams } from "./paginationParams";

export interface GetNFTTransactionsDTO extends IPaginationParams {
    address?: string;
    contractaddress?: string;
}

export type NFTTransactionsResponse = Array<{
    blockHash: string;
    blockNumber: string;
    confirmations: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    from: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    hash: string;
    input: string;
    nonce: string;
    timeStamp: string;
    to: string;
    tokenDecimal: string;
    tokenID: string;
    tokenName: string;
    tokenSymbol: string;
    transactionIndex: string;
}>;
