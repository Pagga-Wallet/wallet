import { SendSteps } from "../types/SendSteps";

export const btnText = {
    [SendSteps.select]: "",
    [SendSteps.pickAddress]: "common.next",
    [SendSteps.input]: "common.next",
    [SendSteps.confirm]: "common.send",
    [SendSteps.success]: "trans-detail.view-btn",
    [SendSteps.failed]: "common.close",
};

export const title = {
    [SendSteps.select]: "send.select-token",
    [SendSteps.pickAddress]: "send.select-recipient",
    [SendSteps.input]: "send.enter-amount",
    [SendSteps.confirm]: "send.transaction-confirm",
    [SendSteps.success]: "send.transaction-success",
    [SendSteps.failed]: "send.transaction-failed",
};
