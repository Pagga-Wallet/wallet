import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    useLazyGetOldAccountQuery,
    useLazyLoadAccountQuery,
    useRenewAccountMutation,
    useSaveAccountMutation,
} from "@/entities/multichainAccount";
import { PINPad } from "@/shared/components";
import { BaseLayout } from "@/shared/layouts";
import { useSetupBackButton } from "@/shared/lib";
import styles from "./RenewPage.module.scss";

export const RenewPage = () => {
    const navigate = useNavigate();
    const [state, setState] = useState<"success" | "failure" | undefined>();
    const [getOldAccount] = useLazyGetOldAccountQuery();
    const [renewAccount] = useRenewAccountMutation();
    const [saveAccount] = useSaveAccountMutation();
    const [switchAccount] = useLazyLoadAccountQuery();
    const { t } = useTranslation();

    useSetupBackButton({
        onBack() {
            navigate("/introduction");
        },
    });

    const onChange = (pin: string) => {
        if (pin.length === 4) {
            getOldAccount()
                .unwrap()
                .then(async (result) => {
                    if (result) {
                        const resultRenew = await renewAccount({
                            pin,
                            hash: result.hash,
                            iv: result.iv,
                        });
                        if ("error" in resultRenew && resultRenew.error) {
                            return setState("failure");
                        }
                        if ("data" in resultRenew) {
                            setState("success");
                            setTimeout(() => {
                                saveAccount({
                                    walletData: resultRenew.data,
                                    pincode: pin,
                                })
                                    .unwrap()
                                    .then(() => {
                                        switchAccount(resultRenew.data.id).then(() => {
                                            navigate("/home");
                                        });
                                    });
                            }, 300);
                        }
                    }
                });
        }
    };

    const onChangeState = (state: "success" | "failure" | undefined) => {
        setState(state);
    };

    const onSkip = () => {
        navigate("/");
    };

    return (
        <BaseLayout>
            <PINPad
                title={t("pincode.enter")}
                subtitle={t("introduction.sing-in-acc")}
                onChangeState={onChangeState}
                state={state}
                action={
                    <button onClick={onSkip} className={styles.skip_btn}>
                        {t("common.skip")}
                    </button>
                }
                onChange={onChange}
            />
        </BaseLayout>
    );
};
