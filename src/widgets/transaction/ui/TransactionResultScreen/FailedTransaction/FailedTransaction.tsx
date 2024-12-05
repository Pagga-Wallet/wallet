import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Title } from "@/shared/components";
import { BaseLayout } from "@/shared/layouts";
import { useSetupBackButton, useSetupMainButton } from "@/shared/lib";
import errorGif from "@/shared/lib/gifs/error.gif";
import styles from "./TransactionFailed.module.scss";

export const FailedTransaction = () => {
    const { t } = useTranslation();

    const onBack = useCallback(() => {}, []);

    useSetupBackButton({
        onBack,
    });

    const handleClick = useCallback(() => {}, []);

    useSetupMainButton({
        params: {
            text: t("connect.go-back"),
            isVisible: true,
            isEnabled: true,
        },
        onClick: handleClick,
    });

    return (
        <BaseLayout>
            <div className={styles.wrapperImage}>
                <img className={styles.wrapperImage__image} src={errorGif} alt="failed" />
            </div>
            <div className={styles.containerContent}>
                <div className={styles.wrapperContent}>
                    <Title className={styles.title}>{t("connect.tx-failed")}!</Title>
                    <div>
                        <p className={styles.subtitle}>{t("connect.tx-failed-subtitle")}</p>
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
};
