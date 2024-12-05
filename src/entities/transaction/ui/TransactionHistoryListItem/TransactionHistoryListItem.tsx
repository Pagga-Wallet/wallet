import React, { FC, useState } from "react";
import { getColorByNumber } from "@/shared/lib/helpers/getColorByNumber";
import { smallAddress } from "@/shared/lib/helpers/smallAddress";
import s from "./TransactionHistoryListItem.module.scss";

interface TransactionHistoryListItem {
    address: string;
    actionType: string;
    chain: string;
    amount: number;
    status: string;
    modalComponent: React.ReactElement;
}

export const TransactionHistoryListItem: FC<TransactionHistoryListItem> = ({
    actionType,
    address,
    amount,
    chain,
    status,
    modalComponent,
}) => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDetailOpen(false);
    };
    return (
        <div className={s.transaction} onClick={() => setIsDetailOpen(true)}>
            {isDetailOpen && React.cloneElement(modalComponent, { onClose: handleClose })}
            <div className={s.left}>
                <div
                    className={s.transactionLogo}
                    style={{
                        background: getColorByNumber(Number(String(address).charAt(0))),
                    }}
                >
                    {address.slice(-2)}
                </div>
                <div className={s.info}>
                    <div className={s.title}>{actionType}</div>
                    <div className={s.details}>
                        <span className={s.detailsAddress}>{smallAddress(address)}</span>
                        <span className={s.detailsStatus}>{status}</span>
                    </div>
                </div>
            </div>
            <div className={s.right}>
                <div className={s.chain}>{chain}</div>
                <div className={s.amount}>
                    +{amount} {chain}
                </div>
            </div>
        </div>
    );
};
