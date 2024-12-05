import { SwapParams, SwapStep } from "@dedust/sdk";
import { Address, Cell } from "@ton/ton";
import { TON_ADDRESS_INTERFACES } from "@/shared/lib/types";

export interface ISendSwapMessageWithFee {
    publicKey: string;
    secretKey: string;
    Swapfee: bigint;
    amountIn: bigint;
    swapBody: Cell;
    contractAddress: Address;
    contractDedustFee: bigint;
    version: TON_ADDRESS_INTERFACES;
}

export interface TransferTonDTO {
    to: string;
    amount: number;
    mnemonics: string;
    memo?: string;
}

export interface TransferJettonDTO extends TransferTonDTO {
    tokenAddress: string;
}

export interface TonTxDTO {
    amount: string;
    to: string;
    data?: string;
    comment?: string;
}

export interface TransObject {
    value: string;
    to: string;
    data?: string;
    comment?: string;
}

export interface TransToSignTon {
    to: Address;
    amount: string;
    comment?: string;
    data?: string;
}

export interface TransToSignJetton {
    to: Address;
    amount: string;
    comment?: string;
}

export interface IBuildSwapMessage {
    amount: bigint;
    poolAddress: Address;
    queryId?: bigint | number;
    limit?: bigint;
    swapParams?: SwapParams;
    next?: SwapStep;
}

export interface IBuildSwapJettonToTonMessage {
    queryId?: number | bigint;
    destination: Address;
    amount: bigint;
    responseAddress?: Address | null;
    customPayload?: Cell;
    forwardAmount?: bigint;
    forwardPayload?: Cell;
}

export interface TransferOptions {
    queryId?: number | bigint;
    tokenAmount: bigint;
    to: Address;
    responseAddress: Address;
    fwdAmount?: bigint;
    fwdBody?: Cell;
    comment?: string;
}
