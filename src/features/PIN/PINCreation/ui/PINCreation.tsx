import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PINPad } from "@/shared/components";
import { useSetupBackButton, useSetupMainButton } from "@/shared/lib";

interface PINCreationProps {
    onSuccess: (pin: string) => void;
    onBack: () => void;
}

export const PINCreation = ({ onSuccess, onBack }: PINCreationProps) => {
    const [pin, setPIN] = useState<string>("");
    const [tempPIN, setTempPIN] = useState<string>("");
    const { t } = useTranslation();
    const [status, setStatus] = useState<"success" | "failure" | undefined>();
    const [isConfirmation, setIsConfirmation] = useState(false);

    const handleChange = (value: string) => {
        if (tempPIN.length !== 4) {
            setTempPIN(value);
        }
        if (tempPIN.length === 4) {
            setPIN(value);
        }
    };

    useSetupBackButton({
        onBack,
    });

    useSetupMainButton({
        params: {
            text: isConfirmation ? t("pincode.repeat") : t("pincode.create"),
            textColor: "#FFFFFF",
            backgroundColor: "#424B56",
            isLoaderVisible: false,
            isEnabled: false,
            isVisible: true,
        },
    });

    useEffect(() => {
        switch (true) {
            case tempPIN.length === 4 && pin.length === 0:
                setStatus("success");
                setTimeout(() => setIsConfirmation(true), 300);
                break;
            case tempPIN.length === 4 && pin.length === 4 && pin !== tempPIN:
                setStatus("failure");
                break;
            case tempPIN.length === 4 && pin.length === 4 && pin === tempPIN:
                setStatus("success");
                setTimeout(() => onSuccess(pin), 300);
                break;
            default:
                setStatus(undefined);
                break;
        }
    }, [pin, tempPIN]);

    return (
        <PINPad
            value={isConfirmation ? pin : tempPIN}
            state={status}
            onChange={handleChange}
            title={isConfirmation ? t("pincode.repeat") : t("pincode.create")}
        />
    );
};
