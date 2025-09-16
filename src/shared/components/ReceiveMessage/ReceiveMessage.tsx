import { FC } from "react";
import { useTranslation } from "react-i18next";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { SelectBlockhainConfig } from "@/shared/lib/consts/import-list";


import s from "./ReceiveMessage.module.sass";

interface ReceiveMessageProps {
    category: SelectBlockhainConfig[0]["category"];
    chain: SelectBlockhainConfig[0]["chain"];
}

export const ReceiveMessage: FC<ReceiveMessageProps> = ({ category, chain }) => {
    const { t } = useTranslation();

    return (
        <div className={s.inner}>
            <SvgSelector id="alert-receive" />
            <div className={s.innerBody}>
                {t("receive.receive-part1")} {category} ({chain}) {t("receive.receive-part2")}
            </div>
        </div>
    );
};
