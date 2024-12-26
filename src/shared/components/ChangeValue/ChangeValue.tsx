import clsx, { ClassValue } from "clsx";
import React, { FC } from "react";
import { formatNumber } from "@/shared/lib/helpers/formatNumber";
import s from "./ChangeValue.module.sass";

interface IChangeValueProps {
    percent?: boolean;
    value?: number;
    className?: ClassValue;
}

export const ChangeValue: FC<IChangeValueProps> = ({ percent, value = 0, className }) => {
    const isNonNegative = value >= 0;
    const color = `rgb(var(${isNonNegative ? "--accent-green" : "--accent-red"}))`;
    return (
        <div className={clsx(s.changeValue, className)} style={{ fontWeight: 500, color, fontSize: 13 }}>
            {isNonNegative ? "+" : "-"}
            {formatNumber(Math.abs(value))}
            {percent ? "%" : null}
        </div>
    );
};
