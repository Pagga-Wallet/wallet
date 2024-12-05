import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Title } from "@/shared/components";

import errorGif from "@/shared/lib/gifs/error.gif";
import moneyGif from "@/shared/lib/gifs/money.gif";

import s from "./NftSendStatus.module.sass";

interface NftSendStatusProps {
    status?: "success" | "failed";
}

export const NftSendStatus: FC<NftSendStatusProps> = ({ status }) => {
    const { t } = useTranslation();

    const isSuccess = status === "success";
    const gif = isSuccess ? moneyGif : errorGif;
    const title = isSuccess ? t("connect.tx-success") : t("connect.tx-failed");
    const subtitle = isSuccess ? t("connect.tx-success-subtitle") : t("connect.tx-failed-subtitle");
    const decorClass = isSuccess ? s.decorSuccess : s.decorFailed;

    return (
        <div className={s.inner}>
            <div className={s.wrapperImage}>
                <img className={s.wrapperImage__image} src={gif} alt={status} />
            </div>
            <div className={s.containerContent}>
                <div className={s.wrapperContent}>
                    <Title className={s.title}>{title}!</Title>
                    <div>
                        <p className={s.subtitle}>{subtitle}</p>
                    </div>
                </div>
            </div>
            <div className={decorClass} />
        </div>
    );
};
