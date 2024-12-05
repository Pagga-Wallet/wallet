import { CHAINS } from "../multichainAccount";

export type TxnStatus = "applied" | "failed";
export type TxnDirection = "IN" | "OUT";

export type TransactionResponseNormal<T> = {
    isError: boolean;
    transaction: T | null;
    errorMessage?: string;
};

export type TransactionResponseFail = {
    isError: true;
    transaction: null;
    errorMessage: string;
};

export type TransactionResponse<T> = TransactionResponseNormal<T> | TransactionResponseFail;

export interface BaseTxnParsed {
    actionType: string;
    hash: string;
    amount: number;
    chain: CHAINS;
    status: TxnStatus;
    symbol: string;
    timestamp?: Date;
    from: string;
    to: string;
    direction: TxnDirection;
    fee?: number;
    memo?: string;
    amountUSD?: number;
}
