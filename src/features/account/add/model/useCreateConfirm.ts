import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    ICreateAccountResult,
    useLazyLoadAccountQuery,
    useSaveAccountMutation,
} from "@/entities/multichainAccount";

interface ConfirmOptions {
    title: string;
}

type ConfirmFc = (opt: ConfirmOptions) => Promise<string>;

export const useCreateConfirm = (confirm: ConfirmFc) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const [saveAccount] = useSaveAccountMutation();
    const [switchAccount] = useLazyLoadAccountQuery();

    const createConfirm = useCallback(async (walletData: ICreateAccountResult) => {
        setIsLoading(true);
        const pin = await confirm({
            title: t("pincode.enter"),
        });
        await saveAccount({
            walletData,
            pincode: pin,
        });
        await switchAccount(walletData.id);
        navigate("/home");
        setIsLoading(false);
    }, []);

    return {
        createConfirm,
        isLoading,
    };
};
