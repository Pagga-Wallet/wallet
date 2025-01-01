import { FC } from "react";
import { useTranslation } from "react-i18next";
// import { TableDetails } from "@/shared/components";
import { TableDetails } from "@/shared/components";
import { formatNumber } from "@/shared/lib/helpers/formatNumber";
import { TokenBalance } from "@/shared/lib/types";

import SEND from "@/shared/lib/images/send.svg?react";

import s from "./ConfirmSendTransactionInfo.module.scss";

interface IConfirmSendTransactionInfoProps {
    onConfirm?: () => void;
    amount?: number;
    receiver: string;
    memo?: string;
    tokenSymbol?: string;
    price?: number;
}

export const ConfirmSendTransactionInfo: FC<IConfirmSendTransactionInfoProps> = ({
    tokenSymbol,
    price,
    amount,
    receiver,
    memo
}) => {
    const { t } = useTranslation();

    return (
        <div className={s.confirm}>
            <div className={s.info}>
                <div className={s.infoTop}>
                    <div className={s.infoSubtitle}>{t("main.send-btn")}</div>
                    <div className={s.infoTitle}>{t("common.confirmation")}</div>
                </div>
                <div className={s.infoContent}>
                    <SEND className={s.infoContentImg} />
                    <div className={s.infoContentTitle}>{t("common.your-sending")}</div>
                    <div className={s.infoContentAmount}>
                        {amount && <div className={s.infoContentAmountValue}>{amount}</div>}
                        <div className={s.infoContentAmountCurrency}>{tokenSymbol}</div>
                    </div>
                    <div className={s.infoContentAmountTotal}>
                        {amount && `~ $${formatNumber((price ?? 0) * amount)}`}
                    </div>
                </div>
                <TableDetails txHash={receiver} memo={memo} />
            </div>
        </div>
    );
};
