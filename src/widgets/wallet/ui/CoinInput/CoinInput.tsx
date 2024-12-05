import { FC } from "react";
import { useTranslation } from "react-i18next";

import { TokenListItem } from "@/entities/token/ui";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import s from "./CoinInput.module.scss";

export const CoinInput: FC = () => {
    const { t } = useTranslation();

    return (
        <div className={s.inputBlock}>
            <div className={s.title}>Откуда</div>
            <div className={s.choose}>
                <TokenListItem />
                <SvgSelector id="chevron-right" />
            </div>
            <div className={s.bottom}>
                <input className={s.bottomInput} />
                <div className={s.additional}>50%</div>
                <div className={s.additional}>{t("common.all")}</div>
            </div>
        </div>
    );
};
