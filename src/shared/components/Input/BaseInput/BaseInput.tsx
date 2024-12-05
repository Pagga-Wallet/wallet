import clsx, { ClassValue } from "clsx";
import React, { FC, HTMLProps } from "react";

import s from "./BaseInput.module.sass";

interface IBaseInput extends Omit<HTMLProps<HTMLInputElement>, "onChange"> {
    onChange(value: string): void;
}

export const BaseInput: FC<IBaseInput> = ({
    type = "text",
    className,
    onChange,
    value,
    ...props
}) => {
    return (
        <input
            type={type}
            className={clsx(s.baseInput, className as ClassValue)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            value={value}
            {...props}
        />
    );
};
