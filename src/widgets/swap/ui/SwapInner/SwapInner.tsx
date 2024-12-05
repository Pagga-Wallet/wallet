/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import { FC, ReactElement, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { TokenBalance } from "@/shared/lib/types";
import { SwapAmountInput } from "../SwapAmountInput/SwapAmountInput";
import { SwapInfoProps } from "../SwapInfo/SwapInfo";
import s from "./SwapInner.module.sass";

interface SwapInnerProps {
    poweredBy: string;
    poweredIcon?: React.ReactNode;
    tokenFrom: TokenBalance | null;
    tokenTo: TokenBalance | null;
    setTokenFrom: React.Dispatch<React.SetStateAction<TokenBalance | null>>;
    setTokenTo: React.Dispatch<React.SetStateAction<TokenBalance | null>>;
    setFromAmount: (amount: number) => void;
    setToAmount: (amount: number) => void;
    fromAmount: number;
    toAmount: number;
    setShowTokenList: React.Dispatch<React.SetStateAction<"token1" | "token2" | null>>;
    swapInfoComponent?: ReactElement<SwapInfoProps>;
    allowReversed?: boolean;
}

const variants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
};

export const SwapInner: FC<SwapInnerProps> = ({
    poweredIcon,
    setTokenFrom,
    setTokenTo,
    tokenFrom,
    tokenTo,
    poweredBy,
    setShowTokenList,
    fromAmount,
    setFromAmount,
    toAmount,
    setToAmount,
    swapInfoComponent,
    allowReversed = true,
}) => {
    const { t } = useTranslation();
    const [swapped, setSwapped] = useState<boolean>(false);

    const handleSwapClick = useCallback(() => {
        setTokenFrom(tokenTo);
        setTokenTo(tokenFrom);
        setSwapped((prev) => !prev);
    }, [tokenFrom, tokenTo]);

    return (
        <div className={s.inner}>
            <div className={s.swap}>
                <SwapAmountInput
                    value={fromAmount}
                    setValue={setFromAmount}
                    tokenSelected={tokenFrom}
                    onClick={() => setShowTokenList("token1")}
                    isFrom
                />
                <div className={s.btn}>
                    <motion.button
                        animate={swapped ? "open" : "closed"}
                        variants={variants}
                        onClick={handleSwapClick}
                        className={s.swapBtn}
                    >
                        <SvgSelector id="swap-5" />
                    </motion.button>
                </div>
                <SwapAmountInput
                    value={toAmount}
                    setValue={setToAmount}
                    tokenSelected={tokenTo}
                    onClick={() => setShowTokenList("token2")}
                    onlyRead={!allowReversed}
                />
            </div>

            {swapInfoComponent ?? null}

            <div className={s.info}></div>

            <div className={s.poweredBy}>
                {t("swap-modal.powered")} {poweredIcon} <span>{poweredBy}</span>
            </div>
        </div>
    );
};
