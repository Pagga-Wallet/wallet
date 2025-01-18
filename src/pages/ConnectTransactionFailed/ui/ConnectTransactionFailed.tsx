import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CustomButton, Title } from "@/shared/components";
import { BaseLayout } from "@/shared/layouts";
import { useSetupBackButton, useSetupMainButton } from "@/shared/lib";
import styles from "./ConnectTransactionFailed.module.scss";
import { WithDecorLayout } from "@/shared/layouts/layouts";
import { FailedTransaction } from "@/widgets/transaction";

export const ConnectTransactionFailed = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const onBack = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    useSetupBackButton({
        onBack
    });

    const handleClick = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    // useSetupMainButton({
    //     params: {
    //         text: t("connect.go-back"),
    //         isVisible: true,
    //         isEnabled: true,
    //     },
    //     onClick: handleClick,
    // });

    return (
        <WithDecorLayout>
            <FailedTransaction />
            <CustomButton
                firstButton={{
                    children: t("connect.go-back"),
                    type: "purple",
                    onClick: handleClick
                }}
            />
        </WithDecorLayout>
    );
};
