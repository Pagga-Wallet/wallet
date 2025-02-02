import { BalanceChange, SuiTransactionBlockResponse } from "@mysten/sui/dist/cjs/client";
import { SUI_TYPE_ARG, SUI_DECIMALS } from "@mysten/sui/utils";
import { uniqBy } from "lodash";
import { CHAINS } from "@/shared/lib/types";
import { BaseTxnParsed } from "@/shared/lib/types/transaction";
import { suiClient } from "../providers/suiClient";

const parseBalanceChanges = (
    changes: BalanceChange[]
): Array<{
    address: string;
    coinType: string;
    amount: number;
}> =>
    changes?.map(({ coinType, owner, amount }) => ({
        address:
            owner === "Immutable"
                ? "Immutable"
                : "AddressOwner" in owner
                ? owner.AddressOwner
                : "ObjectOwner" in owner
                ? owner.ObjectOwner
                : "",
        coinType,
        amount: Number(amount) || 0
    }));

export const parseSuiTxn = async (
    txn: SuiTransactionBlockResponse,
    originAddress: string
): Promise<BaseTxnParsed> => {
    const balanceChanges = parseBalanceChanges(txn.balanceChanges ?? []);
    const balanceChange = balanceChanges[0];
    const from = txn.transaction?.data.sender ?? "";
    const recipients = uniqBy(balanceChanges, "address").filter(change => change.address !== from);
    const to = recipients[0].address ?? "";
    const coinMetadata = await suiClient.getCoinMetadata({ coinType: balanceChange.coinType });
    const amount = balanceChanges[0].amount / 10 ** (coinMetadata?.decimals ?? 9);

    return {
        actionType: "transfer",
        hash: txn.digest,
        amount: amount,
        chain: CHAINS.SUI,
        status: txn.effects?.status.status === "success" ? "applied" : "failed",
        symbol: "SUI",
        from,
        to,
        direction: from.toLowerCase() === originAddress.toLowerCase() ? "OUT" : "IN"
    };
};
