import { AccountEvent } from "./getTransferJettonHistoryDTO";

export interface GetAccountEventsDTO {
    events: AccountEvent[];
    next_from: bigint;
}
