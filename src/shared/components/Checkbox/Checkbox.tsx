import clsx from "clsx";
import { FC } from "react";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import s from "./Checkbox.module.sass";

interface CheckboxProps {
    isConfirmed: boolean;
    setIsConfirmed: (value: boolean) => void;
}

export const Checkbox: FC<CheckboxProps> = ({ isConfirmed, setIsConfirmed }) => (
    <div
        className={clsx(s.checkbox, { [s.checkboxChecked]: isConfirmed })}
        onClick={() => setIsConfirmed(!isConfirmed)}
    >
        {isConfirmed && <SvgSelector id="checked" />}
    </div>
);
