import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TokenImport } from "@/entities/token/ui";
import { SelectBlockhainConfig, importList } from "@/shared/lib/consts/import-list";
import { CHAINS } from "@/shared/lib/types";
import s from "./SelectNetwork.module.sass";
import { BaseLayout, PrivateLayout, WithDecorLayout } from "@/shared/layouts/layouts";

interface SelectNetworkProps {
    setNetwork: React.Dispatch<React.SetStateAction<CHAINS | null>>;
    network: CHAINS | null;
    config?: SelectBlockhainConfig;
    onClick?: (chain: CHAINS) => void;
    title: string;
    subtitle: string;
}

export const SelectNetwork: FC<SelectNetworkProps> = ({
    setNetwork,
    network,
    subtitle,
    title,
    config = importList,
    onClick
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
        <BaseLayout withoutPadding withDecor className={s.inner}>
            <div className={s.innerTop}>
                <p className={s.innerTopSubtitle}>{subtitle}</p>
                <h2 className={s.innerTopTitle}>{title}</h2>
            </div>
            <div className={s.innerContent}>
                {config.map(el => (
                    <TokenImport
                        {...el}
                        onClick={() => onSelect(el.chain!)}
                        disabled={el.disabled}
                        key={el.category}
                    />
                ))}
            </div>
        </BaseLayout>
    );
};
