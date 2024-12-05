import clsx, { ClassValue } from "clsx";
import { CSSProperties, FC } from "react";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import s from "./BigButton.module.sass";

interface BigButtonProps {
    title: string;
    description?: string;
    imageUrl?: string;
    onClick: () => void;
    style?: CSSProperties;
    className?: ClassValue;
}

export const BigButton: FC<BigButtonProps> = ({
    description,
    imageUrl,
    onClick,
    title,
    style,
    className,
}) => {
    return (
        <div className={clsx(s.bigButton, className)} onClick={onClick} style={style}>
            <div className={s.left}>
                <div className={s.title}>{title}</div>
                {description && <div className={s.description}>{description}</div>}
            </div>
            <div className={s.right}>
                {imageUrl && <img src={imageUrl} alt="image" className={s.image} />}
                <SvgSelector id="chevron-right-gray" />
            </div>
        </div>
    );
};
