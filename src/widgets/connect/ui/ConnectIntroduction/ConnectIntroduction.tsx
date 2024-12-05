import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Title } from "@/shared/components";
import WALLET_CONNECT from "@/shared/lib/images/tonConnect.png";

import s from "./ConnectIntroduction.module.sass";

interface ConnectIntroductionProps {}

export const ConnectIntroduction: FC<ConnectIntroductionProps> = () => {
    const { t } = useTranslation();

    return (
        <div className={s.inner}>
            <img src={WALLET_CONNECT} alt="preview" />
            <div className={s.innerContent}>
                <Title level={1} className={s.innerContentTitle}>
                    TON Connect
                </Title>
                <p className={s.innerContentDescription}>
                    {t("connect-wallet-list.introduction-description")}
                </p>
            </div>
        </div>
    );
};
