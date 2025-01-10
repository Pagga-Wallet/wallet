import { FC } from "react";
import { ClassValue, clsx } from "clsx";

import { TON_ADDRESS_INTERFACES } from "@/shared/lib/types";

import s from "./TonVersion.module.sass";

interface TonVersionProps {
    version: TON_ADDRESS_INTERFACES;
    className?: ClassValue;
}

export const TonVersion: FC<TonVersionProps> = ({ version, className }) => (
    <div className={clsx(className, s.label)}>{version}</div>
);
