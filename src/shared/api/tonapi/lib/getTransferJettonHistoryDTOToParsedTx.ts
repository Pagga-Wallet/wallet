import { Address } from "@ton/core";
import dayjs from "dayjs";
import { formatUnits } from "ethers";
import { BaseTxnParsed, TxnDirection } from "@/shared/lib/types/transaction";
import { CHAINS } from "../../../lib/types";
import { GetTransferJettonHistoryDTO } from "../types";

export const getTransferJettonHistoryDTOToParsedTxn = (
    dto: GetTransferJettonHistoryDTO,
    originAddress: string
): BaseTxnParsed[] => {
    return dto.events.map<BaseTxnParsed>((event) => {
        const amount = parseFloat(
            formatUnits(
                event.actions[0].JettonTransfer?.amount ?? 0,
                event.actions[0].JettonTransfer?.jetton.decimals
            )
        );
        const sender = Address.parse(
            event.actions[0].JettonTransfer?.sender?.address ?? ""
        ).toString({ bounceable: false });
        const recipient = Address.parse(
            event.actions[0].JettonTransfer?.recipient?.address ?? ""
        ).toString({ bounceable: false });
        const direction: TxnDirection = originAddress === sender ? "OUT" : "IN";
        const timestamp = dayjs.unix(event.timestamp).toDate();

        return {
            actionType: event.actions[0].type,
            hash: event.event_id,
            amount: amount,
            chain: CHAINS.TON,
            status: event.actions[0].status === "ok" ? "applied" : "failed",
            symbol: event.actions[0].JettonTransfer?.jetton.symbol ?? "",
            timestamp,
            from: sender,
            to: recipient,
            direction,
            memo: event.actions[0].JettonTransfer?.comment,
        };
    });
};
