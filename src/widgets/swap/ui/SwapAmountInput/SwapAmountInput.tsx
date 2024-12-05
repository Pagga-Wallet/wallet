import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { TokenListItem } from "@/entities/token/ui";

import { NumericInput } from "@/shared/components/Input/NumericInput";
import { SkeletonRound } from "@/shared/components/Skeletons";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import { formatTokenAmount } from "@/shared/lib/helpers/formatNumber";
import { TokenBalance } from "@/shared/lib/types";

import s from "./SwapAmountInput.module.sass";

interface SwapAmountInputProps {
    isFrom?: boolean;
    value: number;
    tokenSelected: TokenBalance | null;
    setValue: (value: number) => void;
    onlyRead?: boolean;
    onClick: () => void;
}

export const SwapAmountInput: FC<SwapAmountInputProps> = ({
    isFrom = false,
    value,
    setValue,
    tokenSelected,
    onlyRead = false,
    onClick,
}) => {
    const { t } = useTranslation();

    const handleMaxClick = useCallback(() => {
        const balance = tokenSelected?.balance ?? 0;
        setValue(+formatTokenAmount(balance.toString()));
    }, [tokenSelected, setValue]);

    const handleHalfClick = useCallback(() => {
        const balance = tokenSelected?.balance ?? 0;
        const halfBalance = balance / 2;
        setValue(+formatTokenAmount(halfBalance.toString()));
    }, [tokenSelected, setValue]);

    return (
        <div className={s.swapInput}>
            <div className={s.title}>{isFrom ? t("swap-modal.from") : t("swap-modal.to")}</div>
            <div className={s.top} onClick={onClick}>
                <div className={s.token}>
                    {tokenSelected ? (
                        <TokenListItem
                            icon={tokenSelected?.tokenIcon}
                            balance={tokenSelected?.balance}
                            balanceUSD={tokenSelected?.balanceUSD}
                            tokenPrice={tokenSelected?.price}
                            name={tokenSelected?.tokenSymbol}
                            change24={tokenSelected.change24h}
                            noHover
                        />
                    ) : (
                        <SkeletonRound height={50} customWidth={"100%"} />
                    )}
                </div>
                <div className={s.chevron}>
                    <SvgSelector id="chevron-bottom" />
                </div>
            </div>
            <div className={s.main}>
                <NumericInput disabled={onlyRead} value={value.toString()} onChange={setValue} />
                {isFrom && (
                    <div className={s.suggestions}>
                        <div className={s.suggestionsItem} onClick={handleHalfClick}>
                            50%
                        </div>
                        <div className={s.suggestionsItem} onClick={handleMaxClick}>
                            {t("common.all")}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
