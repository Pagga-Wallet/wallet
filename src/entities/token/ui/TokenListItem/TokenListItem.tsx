import clsx from "clsx";
import { FC } from "react";
import {
    ChangeValue,
    PlatformName,
    TokenIcon,
    PlatformNameSize,
    AmountFormat,
} from "@/shared/components/";
import { formatNumber, formatTokenAmount } from "@/shared/lib/helpers/formatNumber";
import { CHAINS } from "@/shared/lib/types";
import s from "./TokenListItem.module.sass";

interface ITokenListItemProps {
    name?: string;
    balance?: number;
    balanceUSD?: number;
    tokenPrice?: number;
    change24?: number;
    icon?: string;
    onClick?: () => void;
    chain?: CHAINS;
    isImportedToken?: boolean;
    noHover?: boolean;
}

export const TokenListItem: FC<ITokenListItemProps> = ({
    name,
    balance,
    balanceUSD,
    tokenPrice,
    change24,
    icon,
    onClick,
    chain,
    noHover,
    isImportedToken,
}) => {
    const showChainLogo = name !== "TON" && chain;

    return (
        <div
            className={clsx(
                s.token,
                { [s.tokenClickable]: Boolean(onClick) },
                { [s.tokenNoHover]: noHover },
                { [s.tokenImported]: isImportedToken },
                "token-" + name + "-" + chain
            )}
            onClick={onClick}
        >
            <div className={s.left}>
                <TokenIcon icon={icon} showChain chain={chain} />
                <div className={s.info}>
                    <div className={s.name}>
                        <span>{name}</span>
                        {showChainLogo && (
                            <PlatformName chain={chain} size={PlatformNameSize.SMALL12} />
                        )}
                    </div>
                    <div className={s.price}>
                        <div className={s.priceInfo}>
                            <span className={s.priceMain}>$</span>
                            <AmountFormat className={s.priceMain} value={tokenPrice ?? 0} />
                        </div>
                        <ChangeValue percent value={change24} />
                        {/* <span className={s.priceChange}>+2.3%</span> */}
                    </div>
                </div>
            </div>
            <div className={s.total}>
                <AmountFormat className={s.totalCount} value={balance ?? 0} />
                <div className={s.totalAmount}>${formatNumber(String(balanceUSD), 3)}</div>
            </div>
        </div>
    );
};
