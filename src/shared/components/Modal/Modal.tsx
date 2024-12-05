import React, { FC, MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { createContainer, removeContainer } from "@/shared/lib/helpers/containerHelpers";
import { Portal } from "../Portal/Portal";
import s from "./Modal.module.scss";

interface Modal {
    onClose?: (e?: React.MouseEvent) => void;
    children: React.ReactNode | React.ReactNode[];
    isBackButton?: boolean;
}
export const Modal: FC<Modal> = ({ children, onClose, isBackButton }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const [isMounted, setMounted] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        createContainer({
            id: "modal-window",
        });
        setMounted(true);

        return () => {
            removeContainer("modal-window");
        };
    }, []);

    const handleClose: MouseEventHandler<HTMLDivElement | HTMLButtonElement> = useCallback(
        (e) => {
            onClose?.(e);
        },
        [onClose]
    );

    return isMounted ? (
        <Portal id={"modal-window"}>
            <div className={s.wrapper} ref={rootRef}>
                <div className={s.content}>
                    <div className={s.top}>
                        <div className={s.back}>{isBackButton && "Назад"}</div>
                        <div className={s.close} onClick={handleClose}>
                            {t("common.close")}
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </Portal>
    ) : null;
};
