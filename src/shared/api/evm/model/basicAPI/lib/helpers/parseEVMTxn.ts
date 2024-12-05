import { ethers, formatEther, formatUnits } from "ethers";
import { CHAINS } from "@/shared/lib/types";
import { BaseTxnParsed } from "@/shared/lib/types/transaction";
import { NormalTransactionsResponse } from "../types/getNormalTransactionsDTO";
import { TokenTransactionsResponse } from "../types/getTokenTransactionsDTO";

export const parseEVMNativeTxn = (
    txns: NormalTransactionsResponse,
    originAddress: string,
    chain: CHAINS
): BaseTxnParsed[] =>
    txns.map((tx) => ({
        actionType: "transfer",
        hash: tx.hash,
        amount: parseFloat(formatEther(tx.value)),
        chain,
        status: tx.isError ? "failed" : "applied",
        symbol: chain,
        timestamp: new Date(parseInt(tx.timeStamp)),
        from: tx.from,
        to: tx.to,
        direction: tx.from === originAddress.toLowerCase() ? "OUT" : "IN",
    }));

export const parseEVMTokenTxn = (
    txns: TokenTransactionsResponse,
    originAddress: string,
    chain: CHAINS
): BaseTxnParsed[] =>
    txns.map((tx) => ({
        actionType: "transfer",
        hash: tx.hash,
        amount: parseFloat(formatUnits(tx.value, +tx.tokenDecimal)),
        chain,
        status: "applied",
        symbol: tx.tokenSymbol,
        timestamp: new Date(tx.timeStamp),
        from: tx.from,
        to: tx.to,
        direction: tx.from === originAddress.toLowerCase() ? "OUT" : "IN",
    }));

export const parseEVMRawTxn = (
    tx: ethers.TransactionReceipt,
    txRaw: ethers.Transaction,
    originAddress: string,
    chain: CHAINS
): BaseTxnParsed => ({
    actionType: "transfer",
    hash: tx.hash,
    amount: parseFloat(formatEther(txRaw.value)),
    chain,
    status: !tx.status ? "failed" : "applied",
    symbol: chain,
    from: tx.from,
    to: tx.to!,
    direction: tx.from === originAddress.toLowerCase() ? "OUT" : "IN",
});
