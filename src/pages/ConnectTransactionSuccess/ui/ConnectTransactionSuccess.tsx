import { initUtils } from "@tma.js/sdk";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { multichainAccountStore } from "@/entities/multichainAccount";
import { Title } from "@/shared/components";
import { BaseLayout } from "@/shared/layouts";
import { useAppSelector, useSetupBackButton, useSetupMainButton } from "@/shared/lib";
import moneyGif from "@/shared/lib/gifs/money.gif";
import styles from "./ConnectTransactionSuccess.module.scss";

export const ConnectTransactionSuccess = () => {
    const { t } = useTranslation();
    const utils = initUtils();
    const navigate = useNavigate();
    const account = useAppSelector(multichainAccountStore.selectors.selectAccount);

    const onBack = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    useSetupBackButton({
        onBack,
    });

    const handleClick = useCallback(() => {
        utils.openLink(`https://tonviewer.com/${account!.multiwallet.TON.address.V4}`);
    }, [utils, account]);

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
