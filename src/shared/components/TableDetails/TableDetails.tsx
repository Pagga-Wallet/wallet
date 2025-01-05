import { FC } from "react";
import { useTranslation } from "react-i18next";
import { smallAddress } from "@/shared/lib/helpers/smallAddress";
import s from "./TableDetails.module.sass";

interface TableDetailsProps {
    txHash?: string;
    fee?: number;
    memo?: string;
}

export const TableDetails: FC<TableDetailsProps> = ({ txHash, fee, memo }) => {
    const { t } = useTranslation();

    return (
        <div className={s.details}>
            {/* <div className={s.detailsTitle}>{t("trans-detail.header")}</div> */}
            {txHash && (
                <div className={s.detailRow}>
                    <div className={s.detailRowTitle}>{t("trans-detail.address")}</div>
                    <div className={s.detailRowValue}>{smallAddress(txHash)}</div>
                </div>
            )}
            {fee !== undefined && (
                <div className={s.detailRow}>
                    <div className={s.detailRowTitle}>{t("trans-detail.fee")}</div>
                    <div className={s.detailRowValue}>~ 0.2 TON</div>
                </div>
            )}
            {!!memo && (
                <div className={s.detailRow}>
                    <div className={s.detailRowTitle}>{t("common.memo")}</div>
                    <div className={s.detailRowValue_BreakWord}>{memo}</div>
                </div>
            )}
        </div>
    );
};
