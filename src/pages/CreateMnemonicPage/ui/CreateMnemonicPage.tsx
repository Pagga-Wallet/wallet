import { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCreateConfirm, useFirstCreate } from "@/features/account/add";
import { useGetUseBiometryQuery, usePINConfirmation } from "@/features/PIN";
import { usePINCreation } from "@/features/PIN";
import { ICreateAccountResult, useCreateAccountMutation } from "@/entities/multichainAccount";
import { Loader, Title, WordArea } from "@/shared/components";
import { BaseLayout } from "@/shared/layouts";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { sendNotification } from "@/shared/lib/helpers/sendNotification";
import { useSetupBackButton, useSetupMainButton } from "@/shared/lib/hooks";
import s from "./CreateMnemonicPage.module.scss";

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
            .then((res) => setState(res));
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

    useSetupMainButton({
        onClick,
        params: {
            text: t("common.i-saved-mnemonic"),
            textColor: "#FFFFFF",
            backgroundColor: "#007AFF",
            isEnabled: !isLoading,
            isVisible: true,
            isLoaderVisible: isLoading,
        },
    });

    return (
        <>
            {!state || isLoading ? (
                <Loader />
            ) : (
                <BaseLayout>
                    <div className={s.chooseChain}>
                        <Title>{t("common.save-mnemonic")}</Title>
                        <WordArea
                            disabled
                            value={state.mainMnemonic.split(" ")}
                            buttonProps={{
                                icon: <SvgSelector id="copy" />,
                                children: t("common.copy"),
                                onClick: (_, words) => {
                                    navigator.clipboard.writeText(words.join(" "));
                                    sendNotification(t("common.mnemonics-copied"), "success");
                                },
                            }}
                        />
                    </div>
                </BaseLayout>
            )}
        </>
    );
};
