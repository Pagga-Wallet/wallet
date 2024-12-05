import React, { FC, useCallback, useState } from "react";

import { useTranslation } from "react-i18next";
import { AmountFormat } from "@/shared/components";
import { formatTokenAmount } from "@/shared/lib/helpers/formatNumber";
import { getColorByNumber } from "@/shared/lib/helpers/getColorByNumber";
import { smallAddress } from "@/shared/lib/helpers/smallAddress";
import { TxnDirection } from "@/shared/lib/types/transaction";

import s from "./TransactionHistoryDetailItem.module.sass";

interface TransactionHistoryDetailItem {
    txHash: string;
    actionType: string;
    symbol: string;
    amount: number;
    direction: TxnDirection;
    participantAddress: string;
    onClick: () => void;
}

export const TransactionHistoryDetailItem: FC<TransactionHistoryDetailItem> = ({
    actionType,
    txHash,
    amount,
    symbol,
    direction,
    participantAddress,
    onClick,
}) => {
    const { t } = useTranslation();
    const isSent = direction === "OUT";

    return (
        <div className={s.transaction} onClick={() => onClick()}>
            <div className={s.left}>
                <div
                    className={s.transactionLogo}
                    style={{
                        background: getColorByNumber(Number(String(txHash).charAt(0))),
                    }}
                >
                    {participantAddress.slice(-2)}
                </div>
                <div className={s.info}>
                    <div className={s.title}>{actionType}</div>
                    <div className={s.details}>
                        <span className={s.detailsAddress}>{smallAddress(participantAddress)}</span>
                    </div>
                </div>
            </div>
            <div className={s.right}>
                <div className={s.status}>
                    {direction === "OUT" ? t("history.sent") : t("history.received")}
                </div>
                <div className={s.amount}>
                    {isSent ? "-" : "+"}
                    <AmountFormat
                        className={s.amount}
                        value={+formatTokenAmount(amount.toString())}
                    />{" "}
                    {symbol}
                </div>
            </div>
        </div>
    );
};
