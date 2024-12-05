import dayjs from "dayjs";
import { FC } from "react";

import { getColorByNumber } from "@/shared/lib/helpers/getColorByNumber";
import { smallAddress } from "@/shared/lib/helpers/smallAddress";

import { CHAINS } from "@/shared/lib/types";

import s from "./TransactionRecentItem.module.sass";

interface TransactionRecentItemProps {
    txHash: string;
    participantAddress: string;
    chain: CHAINS;
    timestamp?: Date;
    onClick: () => void;
}

export const TransactionRecentItem: FC<TransactionRecentItemProps> = ({
    txHash,
    participantAddress,
    timestamp,
    chain,
    onClick,
}) => (
    <div className={s.recent} onClick={onClick}>
        <div
            className={s.recentLogo}
            style={{
                background: getColorByNumber(Number(String(txHash).charAt(0))),
            }}
        >
            {chain !== CHAINS.TON ? txHash.slice(-2) : participantAddress.slice(-2)}
        </div>
        <div className={s.recentInfo}>
            <p className={s.recentInfoAddress}>{smallAddress(participantAddress)}</p>
            {timestamp && <div className={s.recentInfoDate}>{dayjs(+timestamp).toString()}</div>}
        </div>
    </div>
);
