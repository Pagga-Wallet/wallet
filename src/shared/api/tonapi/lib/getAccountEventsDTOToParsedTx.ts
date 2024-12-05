import { Address, fromNano } from "@ton/core";
import dayjs from "dayjs";
import { BaseTxnParsed, TxnDirection } from "@/shared/lib/types/transaction";
import { CHAINS } from "../../../lib/types";
import { GetAccountEventsDTO } from "../types";

export const getAccountEventsDTOToParsedTxn = (
    dto: GetAccountEventsDTO,
    originAddress: string
): BaseTxnParsed[] => {
    return dto.events
        .filter((tx) => tx.actions[0].type === "TonTransfer")
        .map<BaseTxnParsed>((event) => {
            const amount = parseFloat(fromNano(event.actions[0].TonTransfer?.amount ?? 0));
            const sender = Address.parse(
                event.actions[0].TonTransfer?.sender?.address ?? ""
            ).toString({
                bounceable: false,
            });
            const recipient = Address.parse(
                event.actions[0].TonTransfer?.recipient?.address ?? ""
            ).toString({ bounceable: false });
            const direction: TxnDirection = originAddress === sender ? "OUT" : "IN";
            const timestamp = dayjs.unix(event.timestamp).toDate();

            return {
                actionType: event.actions[0].type,
                hash: event.event_id,
                amount: amount,
                chain: CHAINS.TON,
                status: event.actions[0].status === "ok" ? "applied" : "failed",
                symbol: "TON",
                timestamp,
                from: sender,
                to: recipient,
                direction,
                memo: event.actions[0].TonTransfer?.comment,
            };
        });
};
