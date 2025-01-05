import { FC } from "react";
import { useTranslation } from "react-i18next";

import { AmountFormat, TokenIcon } from "@/shared/components";

import { formatNumber, formatTokenAmount } from "@/shared/lib/helpers/formatNumber";
import { TokenBalance } from "@/shared/lib/types";

import s from "./TokenDetailInfo.module.sass";

interface TokenDetailInfoProps {
    token: TokenBalance;
}

export const TokenDetailInfo: FC<TokenDetailInfoProps> = ({ token }) => {
    const { t } = useTranslation();

    return (
        <div className={s.main}>
            <TokenIcon icon={token.tokenIcon} size={40} chain={token.platform} />
            <div className={s.amount}>
                <div className={s.mainLeftTop}>
                    <AmountFormat
                        className={s.amountCount}
                        value={+formatTokenAmount(token.balance.toString())}
                    />
                    <p className={s.amountCount}>{token.tokenSymbol}</p>
                </div>
                <div className={s.amountPrice}>≈ ${formatNumber(token.balanceUSD)} </div>
            </div>
        </div>
    );
};
