import { SendNftSteps } from "../types";

export const titles = {
    [SendNftSteps.SelectAddress]: "send.select-recipient",
    [SendNftSteps.EnterMemo]: "common.memo-enter",
    [SendNftSteps.Confirm]: "send.transaction-confirm",
    [SendNftSteps.Success]: "send.transaction-success",
    [SendNftSteps.Failed]: "send.transaction-failed",
};

export const btnText = {
    [SendNftSteps.SelectAddress]: "common.next",
    [SendNftSteps.EnterMemo]: "common.next",
    [SendNftSteps.Confirm]: "common.send",
    [SendNftSteps.Success]: "common.to-main",
    [SendNftSteps.Failed]: "common.back",
};
