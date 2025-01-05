import clsx from "clsx";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Section } from "@/shared/components";

import { CHAINS } from "@/shared/lib/types";
import { TokenImportType } from "../../model/types";

import s from "./TokenImport.module.sass";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";

interface TokenImportProps extends TokenImportType {
    onClick: () => void;
    chain: CHAINS | null;
    disabled?: boolean;
}

export const TokenImport: FC<TokenImportProps> = ({
    category,
    onClick,
    previewUrl,
    chain,
    disabled
}) => {
    const { t } = useTranslation();

    return (
        <li
            className={clsx(s.card, {
                [s.cardDisabled]: disabled
            })}
            onClick={onClick}
        >
            <div className={s.cardLeft}>
                <img src={previewUrl} alt={category} width={40} height={40} />
                <div className={s.cardBody}>
                    <div className={s.cardTitle}>
                        <p>{category === "Ton" ? "The Open Network" : category} </p>
                    </div>
                    {chain && <p className={s.cardDescription}>{chain}</p>}
                </div>
            </div>
            {!disabled ? (
                <SvgSelector id="chevron-right" />
            ) : (
                <div className={s.cardSoon}>{t("common.coming-soon")}</div>
            )}
        </li>
    );
};
