import { Transaction } from "@solana/web3.js";
import { CHAINS } from "@/shared/lib/types";
import { BaseTxnParsed } from "@/shared/lib/types/transaction";
import { LAMPORTS_PER_SOL } from "../const";

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
