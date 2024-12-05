import { Address, fromNano } from "@ton/core";
import dayjs from "dayjs";
import { BaseTxnParsed, TxnDirection } from "@/shared/lib/types/transaction";
import { CHAINS } from "../../../lib/types";
import { GetAccountTransactionDTO } from "../types";

export const getAccountTransactionDTOToParsedTxn = (
    dto: GetAccountTransactionDTO,
    originAddress: string
): BaseTxnParsed[] => {
    return dto.transactions
        .filter((tx) => tx.in_msg.value !== 0)
        .map<BaseTxnParsed>((tx) => {
            const amount = parseFloat(fromNano(tx.in_msg.value));
            const sender = Address.parse(tx.in_msg.source?.address ?? "").toString({
                bounceable: false,
            });
            const recipient = Address.parse(tx.in_msg.destination?.address ?? "").toString({
                bounceable: false,
            });
            const direction: TxnDirection = originAddress === recipient ? "IN" : "OUT";
            const timestamp = dayjs.unix(tx.utime).toDate();

            return {
                actionType: tx.transaction_type,
                hash: tx.hash,
                amount: amount,
                chain: CHAINS.TON,
                status: tx.success ? "applied" : "failed",
                symbol: "TON",
                timestamp,
                from: sender,
                to: recipient,
                direction,
                fee: parseFloat(fromNano(tx.total_fees)),
            };
        });
};
