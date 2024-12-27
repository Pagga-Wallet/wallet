import clsx from "clsx";
import { FC } from "react";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { Button } from "../Button/Button";

import s from "./AlertMessage.module.sass";

interface AlertMessageProps {
    description: string;
    btnText: string;
    isWarning?: boolean;
    onClick: () => void;
}

export const AlertMessage: FC<AlertMessageProps> = ({
    description,
    btnText,
    onClick,
    isWarning = false,
}) => {
    return (
        <div className={s.inner}>
            <div className={s.innerTop}>
                <div className={clsx(s.icon, { [s.iconWarning]: isWarning })}>
                    <SvgSelector id="warning-error" />
                </div>
                <p className={s.text}>{description}</p>
            </div>

            <Button type="grey" className={s.btn} onClick={onClick}>
                {btnText}
            </Button>
        </div>
    );
};
