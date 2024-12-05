import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useChangePINMutation } from "@/entities/multichainAccount";
import { usePINConfirmation } from "../../../PINConfirmation/";
import { usePINCreation } from "../../../PINCreation";

export const useChangePIN = () => {
    const { t } = useTranslation();
    const { confirm } = usePINConfirmation();
    const { createPIN } = usePINCreation();
    const [changePINMutation] = useChangePINMutation();

    const changePIN = useCallback(async () => {
        const oldPIN = await confirm({ title: t("pincode.old") });
        const newPIN = await createPIN();
        await changePINMutation({
            newPIN: newPIN,
            oldPIN: oldPIN,
        });
    }, []);
    return { changePIN };
};
