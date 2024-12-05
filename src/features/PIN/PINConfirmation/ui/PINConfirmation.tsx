import React from "react";
import { useTranslation } from "react-i18next";
import { PINPad } from "@/shared/components";
import { useSetupBackButton, useSetupMainButton } from "@/shared/lib";

interface PINConfirmationProps {
    title: string;
    onChange?: (pin: string) => void;
    state?: "success" | "failure" | undefined;
    onBack: () => void;
    action?: React.ReactNode;
    onChangeState: (state?: "success" | "failure" | undefined) => void;
    isLoading: boolean;
    pin: string | undefined;
}
// сделать страницей
export const PINConfirmation = ({
    title,
    onChange,
    state,
    onBack,
    action,
    onChangeState,
    isLoading,
    pin,
}: PINConfirmationProps) => {
    const { t } = useTranslation();
    useSetupMainButton({
        params: {
            text: t("pincode.enter"),
            isEnabled: true,
            isVisible: true,
            isLoaderVisible: isLoading,
        },
    });
    useSetupBackButton({
        onBack,
    });

    return (
        <PINPad
            value={pin}
            onChangeState={onChangeState}
            state={state}
            action={action}
            title={title}
            onChange={onChange}
        />
    );
};
