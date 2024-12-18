import { openLink } from "@telegram-apps/sdk-react";
import dayjs from "dayjs";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AmountFormat, TableDetails } from "@/shared/components";
import { Modal } from "@/shared/components/Modal/Modal";
import { useSetupMainButton } from "@/shared/lib";
import { formatTokenAmount } from "@/shared/lib/helpers/formatNumber";
import { getExplorerLink } from "@/shared/lib/helpers/getExplorerLink";
import { CHAINS } from "@/shared/lib/types";
import { TxnDirection } from "@/shared/lib/types/transaction";
import s from "./TransactionDetailsModal.module.scss";

interface TransactionDetailsModal {
    onClose: () => void;
    txHash: string;
    symbol: string;
    amount: number;
    direction: TxnDirection;
    timestamp?: Date;
    chain: CHAINS;
    userAddress: string | undefined;
    participantAddress: string;
}

export const TransactionDetailsModal: FC<TransactionDetailsModal> = ({
    onClose,
    txHash,
    symbol,
    amount,
    direction,
    timestamp,
    chain,
    userAddress,
    participantAddress,
}) => {

    const { t } = useTranslation();

    const handleNavigate = useCallback(() => {
        const link = getExplorerLink({ userAddress, txHash, chain });
        openLink(link);
    }, [userAddress, txHash, chain]);

    useSetupMainButton({
        onClick: handleNavigate,
        params: {
            text: t("trans-detail.view-btn"),
            textColor: "#FFFFFF",
            isLoaderVisible: false,
            backgroundColor: "#007AFF",
            isEnabled: true,
            isVisible: true,
        },
    });

    // console.log(timestamp);

    return (
        <Modal onClose={onClose}>
            <div className={s.details}>
                <div className={s.title}>
                    {direction === "OUT" ? t("history.sent") : t("history.received")}
                </div>
                {/* <div className={s.image}>123</div> */}
                <div className={s.amount}>
                    {direction === "OUT" ? "-" : "+"}
                    <AmountFormat
                        className={s.amount}
                        value={+formatTokenAmount(amount.toString())}
                    />{" "}
                    {symbol}
                </div>
                {timestamp && <div className={s.date}>{dayjs(+timestamp).toString()}</div>}
                <TableDetails txHash={participantAddress} />
            </div>
        </Modal>
    );
};
