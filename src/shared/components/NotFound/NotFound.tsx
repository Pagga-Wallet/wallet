import clsx, { ClassValue } from "clsx";
import { FC } from "react";

import s from "./NotFound.module.sass";

interface NotFoundProps {
    text: string;
    className?: ClassValue;
}

export const NotFound: FC<NotFoundProps> = ({ text, className }) => {
    return <div className={clsx(s.inner, className)}>{text}</div>;
};
