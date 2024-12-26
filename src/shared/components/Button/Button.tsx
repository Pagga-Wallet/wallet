import clsx, { ClassValue } from "clsx";
import React, { FC } from "react";
import s from "./Button.module.scss";

export interface ButtonProps {
    children: React.ReactNode;
    type: "purple" | "grey";
    isDisabled?: boolean;
    onClick: () => void;
    className?: ClassValue;
}

export const Button: FC<ButtonProps> = ({ children, isDisabled, type, onClick, className }) => {
    const buttonClasses = clsx(s.button, s[type], className);

    return (
        <button className={buttonClasses} disabled={isDisabled} onClick={onClick}>
            {children}
        </button>
    );
};
