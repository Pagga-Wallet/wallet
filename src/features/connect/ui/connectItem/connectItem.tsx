import clsx from "clsx";
import { FC } from "react";

import { TokenIcon } from "@/shared/components";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import s from "./connectItem.module.sass";

interface ConnectItemProps {
    title: string;
    description?: string;
    preview: string;
    onClick?: () => void;
    isActions?: boolean;
}

export const ConnectItem: FC<ConnectItemProps> = ({
    preview,
    description,
    title,
    onClick,
    isActions = false,
}) => {
    return (
        <div className={clsx(s.item, { [s.itemHover]: isActions })} onClick={onClick}>
            <div className={s.itemInner}>
                <TokenIcon icon={preview} className={s.preview} />
                <div className={s.itemBody}>
                    <p className={s.itemTitle}>{title}</p>
                    {description && <p className={s.itemDescription}>{description}</p>}
                </div>
            </div>
            {isActions && (
                <div className={s.itemActions}>
                    <SvgSelector id="chevron-right" />
                </div>
            )}
        </div>
    );
};
