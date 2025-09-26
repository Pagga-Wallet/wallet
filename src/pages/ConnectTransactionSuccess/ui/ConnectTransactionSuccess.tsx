import { openLink } from "@telegram-apps/sdk-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import { SuccessTransaction } from "@/widgets/transaction";
import { multichainAccountStore } from "@/entities/multichainAccount";

import { CustomButton } from "@/shared/components";

import { WithDecorLayout } from "@/shared/layouts/layouts";
import { useAppSelector, useSetupBackButton } from "@/shared/lib";



export const ConnectTransactionSuccess = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const account = useAppSelector(multichainAccountStore.selectors.selectAccount);

    const onBack = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    useSetupBackButton({
        onBack
    });

    const handleClick = useCallback(() => {
        openLink(`https://tonviewer.com/${account!.multiwallet.TON.address.V4}`);
    }, [account]);

    // useSetupMainButton({
    //     params: {
    //         text: t("connect.tx-view"),
    //         isVisible: true,
    //         isEnabled: true
    //     },
    //     onClick: handleClick
    // });

    return (
        <WithDecorLayout>
            <SuccessTransaction />
            <CustomButton
                firstButton={{
                    children:  t("connect.tx-view"),
                    type: "purple",
                    onClick: handleClick
                }}
            />
        </WithDecorLayout>
    );
};
