import { FC } from "react";
import { useTranslation } from "react-i18next";
import { SkeletonRect } from "@/shared/components/Skeletons";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { formatNumber } from "@/shared/lib/helpers/formatNumber";
import s from "./SwapInfo.module.sass";

export interface SwapInfoProps {
    priceImpact?: number;
    gas?: number;
    gasSymbol?: string;
    gasUSD?: number;
    loading?: boolean;
}

export const SwapInfo: FC<SwapInfoProps> = ({
    priceImpact,
    gas = 0,
    gasSymbol,
    gasUSD = 0,
    loading,
}) => {
    const { t } = useTranslation();

    return (
        <div className={s.inner}>
            <div className={s.row}>
                <div className={s.title}>{t("common.price-impact")}</div>
                <div className={s.value}>
                    {loading ? (
                        <SkeletonRect width={140} height={19} />
                    ) : (
                        formatNumber(priceImpact) + "%"
                    )}
                </div>
            </div>
            <SvgSelector id="dotted-line" />
            <div className={s.row}>
                <div className={s.title}>{t("common.trading-fee")}</div>
                <div className={s.value}>
                    {loading ? (
                        <SkeletonRect width={140} height={19} />
                    ) : (
                        `${formatNumber(gas)} ${gasSymbol} ≈ ${formatNumber(gasUSD)} $`
                    )}
                </div>
            </div>
        </div>
    );
};
