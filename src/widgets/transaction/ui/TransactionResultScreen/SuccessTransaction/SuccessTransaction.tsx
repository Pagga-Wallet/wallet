import { initUtils } from "@tma.js/sdk";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Title } from "@/shared/components";
import { BaseLayout } from "@/shared/layouts";
import { useSetupBackButton, useSetupMainButton } from "@/shared/lib";
import moneyGif from "@/shared/lib/gifs/money.gif";
import styles from "./TransactionSuccess.module.scss";

interface SuccessTransactionProps {
    explorerLink?: string;
}

export const SuccessTransaction: FC<SuccessTransactionProps> = ({ explorerLink }) => {
    const { t } = useTranslation();
    const utils = initUtils();

    const onBack = useCallback(() => {}, []);

    useSetupBackButton({
        onBack,
    });

    const handleClick = useCallback(() => {
        if (!explorerLink) return;
        utils.openLink(explorerLink);
    }, []);

    useSetupMainButton({
        params: {
            text: t("connect.tx-view"),
            isVisible: true,
            isEnabled: true,
        },
        onClick: handleClick,
    });

    return (
        <BaseLayout>
            <div className={styles.wrapperImage}>
                <img className={styles.wrapperImage__image} src={moneyGif} alt="success" />
            </div>
            <div className={styles.containerContent}>
                <div className={styles.wrapperContent}>
                    <Title className={styles.title}>{t("connect.tx-success")}!</Title>
                    <div>
                        <p className={styles.subtitle}>{t("connect.tx-success-subtitle")}</p>
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
};
