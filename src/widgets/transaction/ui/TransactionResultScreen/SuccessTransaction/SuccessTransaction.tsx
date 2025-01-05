import { openLink } from "@telegram-apps/sdk-react";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Title } from "@/shared/components";
import { BaseLayout } from "@/shared/layouts";
import { useSetupBackButton, useSetupMainButton } from "@/shared/lib";
import moneyGif from "@/shared/lib/images/success.png";
import styles from "./TransactionSuccess.module.scss";

interface SuccessTransactionProps {
    explorerLink?: string;
}

export const SuccessTransaction: FC<SuccessTransactionProps> = ({ explorerLink }) => {
    const { t } = useTranslation();

    const onBack = useCallback(() => {}, []);

    useSetupBackButton({
        onBack
    });

    const handleClick = useCallback(() => {
        if (!explorerLink) return;
        openLink(explorerLink);
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.wrapperInner}>
                <div className={styles.wrapperImage}>
                    <img
                        className={styles.wrapperImage__image}
                        src={moneyGif}
                        width={80}
                        height={80}
                        alt="success"
                    />
                </div>
                <div className={styles.containerContent}>
                    <div className={styles.wrapperContent}>
                        <Title className={styles.title}>{t("connect.tx-success")}!</Title>
                        <div>
                            <p className={styles.subtitle}>{t("connect.tx-success-subtitle")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
