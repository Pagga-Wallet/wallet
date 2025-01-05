import clsx, { ClassValue } from "clsx";
import React, { FC } from "react";
import EthNetwork from "@/shared/lib/images/ethNetwork.png";
import BNBNetwork from "@/shared/lib/images/network/bnb.png";
import TronNetwork from "@/shared/lib/images/network/tron.png";
import SolanaNetwork from "@/shared/lib/images/solanaNetwork.png";
import TokenImg from "@/shared/lib/images/token.png";
import TonNetwork from "@/shared/lib/images/tonNetwork.png";
import { CHAINS } from "@/shared/lib/types";
import s from "./TokenIcon.module.sass";

interface ITokenIconProps {
    icon?: string;
    chain?: CHAINS;
    showChain?: boolean;
    size?: number;
    className?: ClassValue;
}

const icons: Record<CHAINS, string> = {
    [CHAINS.ETH]: EthNetwork,
    [CHAINS.BNB]: BNBNetwork,
    [CHAINS.TON]: TonNetwork,
    [CHAINS.TRON]: TronNetwork,
    [CHAINS.SOLANA]: SolanaNetwork
};

export const TokenIcon: FC<ITokenIconProps> = ({
    icon,
    showChain,
    chain,
    size = 40,
    className
}) => {
    return (
        <div className={clsx(s.tokenIcon, className)}>
            <img
                src={icon ?? TokenImg}
                alt="token"
                className={s.logo}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.src = TokenImg;
                    e.currentTarget.alt = "default token";
                }}
                style={{
                    height: size + "px",
                    width: size + "px"
                }}
            />
            {showChain && chain && (
                <img
                    className={s.chainLogo}
                    src={icons[chain]}
                    alt="chain"
                    style={{
                        height: size / 2 + "px",
                        width: size / 2 + "px",
                        border: chain === "TRON" ? "2px solid #1F1F25" : "none"
                    }}
                />
            )}
        </div>
    );
};
