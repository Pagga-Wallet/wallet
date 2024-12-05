import { FC } from "react";
import { useTranslation } from "react-i18next";
// import { TableDetails } from "@/shared/components";
import { TableDetails } from "@/shared/components";
import { formatNumber } from "@/shared/lib/helpers/formatNumber";
import { TokenBalance } from "@/shared/lib/types";
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
    memo,
}) => {
    const { t } = useTranslation();

    return (
        <div className={s.confirm}>
            <div className={s.info}>
                <div className={s.infoTitle}>{t("trans-detail.you-send")}</div>
                <div className={s.amount}>
                    {amount && <div className={s.amountValue}>{amount}</div>}
                    <div className={s.amountCurrency}>{tokenSymbol}</div>
                </div>
                <div className={s.total}>{amount && `~${formatNumber((price ?? 0) * amount)}`}</div>
            </div>
            <TableDetails txHash={receiver} memo={memo} />
        </div>
    );
};
