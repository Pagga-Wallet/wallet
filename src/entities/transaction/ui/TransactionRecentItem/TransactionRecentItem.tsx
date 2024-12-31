import dayjs from "dayjs";
import { FC } from "react";

import { getColorByNumber } from "@/shared/lib/helpers/getColorByNumber";
import { smallAddress } from "@/shared/lib/helpers/smallAddress";

import { CHAINS } from "@/shared/lib/types";

import USER from "@/shared/lib/images/user.png";

import s from "./TransactionRecentItem.module.sass";

interface TransactionRecentItemProps {
    participantAddress: string;
    chain: CHAINS;
    timestamp?: Date;
    onClick: () => void;
}

export const TransactionRecentItem: FC<TransactionRecentItemProps> = ({
    participantAddress,
    timestamp,
    chain,
    onClick,
}) => (
    <div className={s.recent} onClick={onClick}>
        <img src={USER} className={s.recentLogo} alt="user" />
        <div className={s.recentInfo}>
            <p className={s.recentInfoAddress}>{smallAddress(participantAddress)}</p>
            {timestamp && <div className={s.recentInfoDate}>{dayjs(+timestamp).toString()}</div>}
        </div>
    </div>
);
