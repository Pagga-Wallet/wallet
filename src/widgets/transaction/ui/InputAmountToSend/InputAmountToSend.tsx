import clsx from "clsx";
import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AmountFormat } from "@/shared/components";
import { NumericInput } from "@/shared/components/Input/NumericInput";
import { formatNumber, formatTokenAmount } from "@/shared/lib/helpers/formatNumber";
import { scientificToDecimal } from "@/shared/lib/helpers/scientificToDecimal";
import { TokenBalance } from "@/shared/lib/types";
import s from "./InputAmountToSend.module.sass";

interface InputAmountToSendProps {
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
    tokenSelected: TokenBalance | null;
}

export const InputAmountToSend: FC<InputAmountToSendProps> = ({
    value,
    setValue,
    tokenSelected,
}) => {
    const { t } = useTranslation();

    const handleMaxClick = useCallback(() => {
        const balance = tokenSelected?.balance ?? 0;
        if (+scientificToDecimal(balance) < 0.00001) {
            setValue(0);
            return;
        }
        setValue(+formatTokenAmount(scientificToDecimal(balance)));
    }, [tokenSelected, setValue]);

    const handleHalfClick = useCallback(() => {
        const balance = tokenSelected?.balance ?? 0;

        if (+scientificToDecimal(balance) < 0.00001) {
            setValue(0);
            return;
        }
        const halfBalance = balance / 2;
        setValue(+formatTokenAmount(scientificToDecimal(halfBalance)));
    }, [tokenSelected, setValue]);

    const dynamicMaxWidth = `${Math.max(value.toString().length * 18, 21)}px`;

    return (
        <div className={s.inputWrapper}>
            <div className={s.top}>
                <div className={s.title}>{t("trans-detail.you-send")}</div>
                <div className={s.amount}>
                    ≈ {formatNumber((tokenSelected?.price ?? 0) * value)}$
                </div>
            </div>
            <div className={s.inputBlock}>
                <NumericInput
                    className={clsx({
                        [s.amountError]: value > (tokenSelected?.balance ?? 0),
                    })}
                    value={value.toString()}
                    onChange={setValue}
                    style={{ maxWidth: dynamicMaxWidth }}
                />
                <div
                    className={clsx(s.token, {
                        [s.amountError]: value > (tokenSelected?.balance ?? 0),
                    })}
                >
                    {tokenSelected?.tokenSymbol}
                </div>
            </div>
            <div className={s.inputWrapperActions}>
                <div className={s.inputWrapperActionsLeft}>
                    <button className={s.available} onClick={handleHalfClick}>
                        50%
                    </button>
                    <button className={s.available} onClick={handleMaxClick}>
                        {t("common.all")}
                    </button>
                </div>
                <button className={s.available} onClick={handleMaxClick}>
                    {t("common.in-stock")} <AmountFormat value={tokenSelected?.balance ?? 0} />{" "}
                    {tokenSelected?.tokenSymbol}
                </button>
            </div>
        </div>
    );
};
