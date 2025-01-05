import { SystemProgram, Transaction } from "@solana/web3.js";
import { CHAINS } from "@/shared/lib/types";
import { BaseTxnParsed } from "@/shared/lib/types/transaction";
import { LAMPORTS_PER_SOL } from "../const";

// export const parseTronNativeTxn = (
//     txns: NormalTransactionsResponse,
//     originAddress: string
// ): BaseTxnParsed[] =>
//     txns
//         .map<BaseTxnParsed>((tx) => {
//             const amount = Number(TronWeb.fromSun(+tx.raw_data.contract[0].parameter.value.amount));
//             const from = TronWeb.address.fromHex(
//                 tx.raw_data.contract[0].parameter.value.owner_address
//             );
//             const to = TronWeb.address.fromHex(tx.raw_data.contract[0].parameter.value.to_address);
//             return {
//                 actionType: "transfer",
//                 hash: tx.txID,
//                 amount,
//                 chain: CHAINS.TRON,
//                 status: "applied", // Всегда подтверждённые, т.к. в апи проставлен флаг "только успешные транзы"
//                 symbol: "TRX",
//                 timestamp: new Date(tx.block_timestamp),
//                 from,
//                 to,
//                 direction: from.toLowerCase() === originAddress.toLowerCase() ? "OUT" : "IN",
//             };
//         })
//         .filter((el) => !isNaN(el.amount) && el.amount);

export const parseSolanaSignedTxn = (
    txn: Transaction,
    originAddress: string,
    hash: string,
    to: string,
    lamports: number
): BaseTxnParsed => {
    const signatures = txn.signatures;
    if (!signatures[0].signature) throw new Error("Invalid transaction");
    const from = signatures[0]?.publicKey.toBase58();
    
    return {
        actionType: "transfer",
        hash,
        amount: lamports / LAMPORTS_PER_SOL,
        chain: CHAINS.SOLANA,
        status: "applied",
        symbol: "SOL",
        from,
        to,
        direction: from.toLowerCase() === originAddress.toLowerCase() ? "OUT" : "IN"
    };
};

// export const parseTronTokenTxn = (
//     txns: TokenTransactionsResponse,
//     originAddress: string
// ): BaseTxnParsed[] =>
//     txns.map((tx) => ({
//         actionType: "transfer",
//         hash: tx.transaction_id,
//         amount: parseFloat(formatUnits(tx.value, +tx.token_info.decimals)),
//         chain: CHAINS.TRON,
//         status: "applied", // Всегда подтверждённые, т.к. в апи проставлен флаг "только успешные транзы"
//         symbol: tx.token_info.symbol,
//         timestamp: new Date(tx.block_timestamp),
//         from: tx.from,
//         to: tx.to,
//         direction: tx.from.toLowerCase() === originAddress.toLowerCase() ? "OUT" : "IN",
//     }));
