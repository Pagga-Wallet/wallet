import React, { FC, useCallback, useState } from "react";

import { useTranslation } from "react-i18next";
import { AmountFormat } from "@/shared/components";
import { TransactionIconSelector } from "@/shared/lib/assets/transaction-icon-selector";
import { formatTokenAmount } from "@/shared/lib/helpers/formatNumber";
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
    timestamp?: Date;
    onClick: () => void;
}

export const TransactionHistoryDetailItem: FC<TransactionHistoryDetailItem> = ({
    actionType,
    txHash,
    amount,
    symbol,
    direction,
    timestamp,
    participantAddress,
    onClick
}) => {
    const { t } = useTranslation();
    const isSent = direction === "OUT";

    return (
        <div className={s.transaction} onClick={() => onClick()}>
            <div className={s.left}>
                <div className={s.transactionLogo}>
                    <TransactionIconSelector id={isSent ? "send" : "receive"} />
                </div>
                <div className={s.info}>
                    <div className={s.title}>
                        {direction === "OUT" ? t("history.sent") : t("history.received")}
                    </div>
                    {timestamp && (
                        <div className={s.details}>
                            {timestamp.toLocaleString()}
                        </div>
                    )}
                </div>
            </div>
            <div className={s.right}>
                <div className={s.amount}>
                    {isSent ? "-" : "+"}
                    <AmountFormat
                        className={s.amount}
                        value={+formatTokenAmount(amount.toString())}
                    />{" "}
                    {symbol}
                </div>
                <div className={s.address}>{isSent ? t("history.to") : t("history.from")} {smallAddress(participantAddress)}</div>
            </div>
        </div>
    );
};
