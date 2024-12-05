import { initBiometryManager } from "@tma.js/sdk";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ICreateAccountResult,
    useLazyLoadAccountQuery,
    useSaveAccountMutation,
} from "@/entities/multichainAccount";

type createPINFc = () => Promise<string>;

export const useFirstCreate = (createPIN: createPINFc, isUseBiometry?: boolean) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [switchAccount, { isLoading: isLoadingSwitch }] = useLazyLoadAccountQuery();
    const [saveAccount, { isLoading: isLoadingSave }] = useSaveAccountMutation();
    const [biometryManagerInit] = initBiometryManager();

    const firstCreate = useCallback(
        async (walletData: ICreateAccountResult) => {
            if (!walletData) return;
            setIsLoading(true);
            const pin = await createPIN();

            if (isUseBiometry) {
                try {
                    const bm = await biometryManagerInit;
                    await bm.requestAccess({ reason: "Use biometry authenticate" });
                    await bm.updateToken({ token: pin });
                } catch (error) {
                    console.log("error Biometry Manager", error);
                }
            }
            console.log("save");
            const acc = await saveAccount({
                walletData,
                pincode: pin,
            }).unwrap();

            console.log("switch");
            await switchAccount(acc.id);
            console.log("navigate");
            navigate("/home");
            setIsLoading(false);
        },
        [isUseBiometry, createPIN]
    );

    useEffect(() => {
        console.log("init");
    }, []);

    useEffect(() => {
        console.log("isLoading", isLoading);
    }, [isLoading]);

    return {
        firstCreate,
        isLoading: isLoading || isLoadingSwitch || isLoadingSave,
    };
};
