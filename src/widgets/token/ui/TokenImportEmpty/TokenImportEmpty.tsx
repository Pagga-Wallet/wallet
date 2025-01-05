import { FC } from "react";
import { useTranslation } from "react-i18next";

import TOKEN_NOT_FOUND from "@/shared/lib/images/SearchNotFound.svg?react"

import s from "./TokenImportEmpty.module.sass";

interface TokenImportEmptyProps {}

export const TokenImportEmpty: FC<TokenImportEmptyProps> = ({}) => {
  const { t } = useTranslation();

    return <div className={s.content}>
        <TOKEN_NOT_FOUND />
        <p>{t("common.enter-contract-address")}</p>
    </div>;
};
