import clsx from "clsx";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TokenImport } from "@/entities/token/ui";
import { SelectBlockhainConfig, importList } from "@/shared/lib/consts/import-list";
import { CHAINS } from "@/shared/lib/types";
import s from "./SelectNetwork.module.sass";

interface SelectNetworkProps {
    setNetwork: React.Dispatch<React.SetStateAction<CHAINS | null>>;
    network: CHAINS | null;
    config?: SelectBlockhainConfig;
    onClick?: (chain: CHAINS) => void;
    mainTitle?: boolean;
}

export const SelectNetwork: FC<SelectNetworkProps> = ({
    setNetwork,
    network,
    config = importList,
    onClick,
    mainTitle,
}) => {
    const { t } = useTranslation();
    const onSelect = useCallback(
        (chain: CHAINS) => {
            onClick?.(chain!);
            setNetwork(chain);
        },
        [onClick, setNetwork]
    );

    return (
        <div>
            <h2 className={clsx(s.title, { [s.titleMain]: mainTitle })}>
                {t("common.select-network")}
            </h2>

            {config.map((el) => (
                <TokenImport
                    {...el}
                    onClick={() => onSelect(el.chain!)}
                    checked={el.chain === network && !el.disabled}
                    disabled={el.disabled}
                    key={el.category}
                />
            ))}
        </div>
    );
};
