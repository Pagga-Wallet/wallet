import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Title } from "@/shared/components";
import { BaseLayout } from "@/shared/layouts";
import { useSetupBackButton, useSetupMainButton } from "@/shared/lib";
import errorGif from "@/shared/lib/gifs/error.gif";
import styles from "./ConnectTransactionFailed.module.scss";

export const ConnectTransactionFailed = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const onBack = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    useSetupBackButton({
        onBack,
    });

    const handleClick = useCallback(() => {
        navigate("/home");
    }, [navigate]);

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
