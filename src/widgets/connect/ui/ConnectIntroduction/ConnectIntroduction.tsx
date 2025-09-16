import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Title } from "@/shared/components";

import TON_CONNECT from "@/shared/lib/images/tonConnect.png";
import WALLET_CONNECT from "@/shared/lib/images/walletConnect.png";
import { ConnectionType } from "@/shared/lib/types/connect";

import s from "./ConnectIntroduction.module.sass";

interface ConnectIntroductionProps {
    type: ConnectionType | null;
}

export const ConnectIntroduction: FC<ConnectIntroductionProps> = ({ type }) => {
    const { t } = useTranslation();

    if (!type) return null;

    const renderContent = (preview: string, title: string) => (
        <div className={s.inner}>
            <img src={preview} alt="preview" />
            <div className={s.innerContent}>
                <Title level={1} className={s.innerContentTitle}>
                    {title}
                </Title>
                <p className={s.innerContentDescription}>
                    {t("connect-wallet-list.introduction-description")}
                </p>
            </div>
        </div>
    );

    switch (type) {
        case ConnectionType.TonConnect:
            return renderContent(TON_CONNECT, "TON Connect");
        case ConnectionType.WalletConnect:
            return renderContent(WALLET_CONNECT, "Wallet Connect");
        default:
            return null;
    }
};
