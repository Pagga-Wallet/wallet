import { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCreateConfirm, useFirstCreate } from "@/features/account/add";
import { useGetUseBiometryQuery, usePINConfirmation } from "@/features/PIN";
import { usePINCreation } from "@/features/PIN";
import { ICreateAccountResult, useCreateAccountMutation } from "@/entities/multichainAccount";
import { CustomButton, Loader, Text, Title, WordArea } from "@/shared/components";
import { BaseLayout } from "@/shared/layouts";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { sendNotification } from "@/shared/lib/helpers/sendNotification";
import { useSetupBackButton, useSetupMainButton } from "@/shared/lib/hooks";
import s from "./CreateMnemonicPage.module.scss";
import { WithDecorLayout } from "@/shared/layouts/layouts";

export const CreateMnemonicPage: FC = () => {
    const [state, setState] = useState<ICreateAccountResult | null>(null);
    const [createAccount, { isLoading: createAccIsLoading }] = useCreateAccountMutation();
    const navigate = useNavigate();

    const { t } = useTranslation();

    useSetupBackButton();

    const { confirm } = usePINConfirmation();
    const { createPIN } = usePINCreation();
    const { data: isUseBiometry } = useGetUseBiometryQuery();
    const { createConfirm, isLoading: createLoading } = useCreateConfirm(confirm);
    const { firstCreate, isLoading: firstCreateLoading } = useFirstCreate(createPIN, isUseBiometry);
    const isLoading = firstCreateLoading || createLoading;

    useEffect(() => {
        createAccount()
            .unwrap()
            .then(res => setState(res));
    }, []);

    const onClick = useCallback(() => {
        if (!state) return;
        if (state.isNew && !isLoading) {
            firstCreate(state);
        }
        if (!state.isNew && !isLoading) {
            createConfirm(state);
        }
    }, [state, createConfirm, isLoading, navigate]);

    const handleCopy = () => {
        if (!state?.mainMnemonic) return;
        navigator.clipboard.writeText(state?.mainMnemonic);
        sendNotification(t("common.mnemonics-copied"), "success");
    };

    return (
        <>
            {!state || isLoading ? (
                <Loader />
            ) : (
                <>
                    <WithDecorLayout>
                        <div className={s.chooseChain}>
                            <div className={s.chooseChainTop}>
                                <Title className={s.chooseChainTitle}>
                                    {t("common.save-mnemonic")}
                                </Title>
                                <Text className={s.chooseChainDescription}>
                                    {t("common.save-mnemonic-desc")}
                                </Text>
                            </div>
                            <WordArea disabled value={state.mainMnemonic.split(" ")} />
                        </div>
                        <CustomButton
                            secondaryButton={{
                                children: <>{t("common.done")}</>,
                                type: "purple",
                                onClick: onClick,
                                isDisabled: isLoading
                            }}
                            firstButton={{
                                children: (
                                    <div className={s.buttonWithIcon}>
                                        <SvgSelector id="copy" /> {t("common.copy")}
                                    </div>
                                ),
                                onClick: handleCopy,
                                type: "grey"
                            }}
                        />
                    </WithDecorLayout>
                </>
            )}
        </>
    );
};
