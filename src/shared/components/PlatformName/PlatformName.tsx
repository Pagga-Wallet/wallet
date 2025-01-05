import clsx from "clsx";
import { FC } from "react";
import { CHAINS } from "@/shared/lib/types";
import s from "./PlatformName.module.sass";

export enum PlatformNameSize {
    SMALL12 = "small12",
    MEDIUM16 = "medium16",
    LARGE18 = "large18",
}

interface IPlatformNameProps {
    chain: CHAINS;
    size?: PlatformNameSize;
}

const platformNames = {
    [CHAINS.ETH]: "ERC20",
    [CHAINS.BNB]: "BEP20",
    [CHAINS.TON]: "TON",
    [CHAINS.TRON]: "TRC20",
    [CHAINS.SOLANA]: "SOLANA",
};

export const PlatformName: FC<IPlatformNameProps> = ({
    chain,
    size = PlatformNameSize.MEDIUM16,
}) => {
    return <span className={clsx(s.chains, s[size])}>{platformNames[chain]}</span>;
};
