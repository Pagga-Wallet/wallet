import { useTranslation } from "react-i18next";
import ArrowUpIcon from "@/shared/assets/arrow-up.svg?react";
import ContractIcon from "@/shared/assets/contract.svg?react";
import { AmountFormat } from "@/shared/components";
import { formatTokenAmount } from "@/shared/lib/helpers/formatNumber";
import { smallAddress } from "@/shared/lib/helpers/smallAddress";
import styles from "./MessageForSign.module.scss";

interface MessageForSignProps {
    type: "execute" | "sending";
    address: string;
    amountTON: string;
    amountUSD: string;
}

export const MessageForSign = ({ type, address, amountTON, amountUSD }: MessageForSignProps) => {
    const { t } = useTranslation();
    return (
        <div className={styles.message}>
            <span className={styles.icon}>
                {type === "execute" ? <ContractIcon /> : <ArrowUpIcon />}
            </span>
            <div className={styles.info}>
                <span className={styles.type}>
                    {type === "execute" ? t("connect.execute") : t("connect.sending")}
                </span>
                <span className={styles.address}>{smallAddress(address)}</span>
            </div>
            <div className={styles.amount}>
                <span className={styles.amountTon}>{amountTON} TON</span>
                <span className={styles.amountUSD}>
                    <AmountFormat
                        className={styles.amountUSD}
                        value={+formatTokenAmount(amountUSD.toString())}
                    />{" "}
                    $
                </span>
            </div>
        </div>
    );
};
