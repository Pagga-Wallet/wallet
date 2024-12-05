import clsx from "clsx";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Section } from "@/shared/components";

import { CHAINS } from "@/shared/lib/types";
import { TokenImportType } from "../../model/types";

import s from "./TokenImport.module.sass";

interface TokenImportProps extends TokenImportType {
    onClick: () => void;
    chain: CHAINS | null;
    checked: boolean;
    disabled?: boolean;
}

export const TokenImport: FC<TokenImportProps> = ({
    category,
    onClick,
    previewUrl,
    checked,
    chain,
    disabled,
}) => {
    const { t } = useTranslation();

    return (
        <Section.Radio
            className={clsx(s.card, { [s.cardChecked]: checked })}
            checked={checked}
            onSelect={onClick}
            disabled={disabled}
        >
            <div className={s.cardLeft}>
                <img src={previewUrl} alt={category} width={40} height={40} />
                <div className={s.cardBody}>
                    <div className={s.cardTitle}>
                        <p>{category === "Ton" ? "The Open Network" : category} </p>
                        {disabled && <div className={s.cardSoon}>{t("common.coming-soon")}</div>}
                    </div>
                    {chain && <p className={s.cardDescription}>{chain}</p>}
                </div>
            </div>
        </Section.Radio>
    );
};
