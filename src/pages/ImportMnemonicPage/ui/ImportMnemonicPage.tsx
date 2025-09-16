import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCreateConfirm, useFirstCreate } from "@/features/account/add";
import { useGetUseBiometryQuery, usePINConfirmation, usePINCreation } from "@/features/PIN";
import { useImportAccountMutation } from "@/entities/multichainAccount";
import { CustomButton, Loader, Title } from "@/shared/components";
import { BaseLayout } from "@/shared/layouts";
import { WithDecorLayout } from "@/shared/layouts/layouts";
import { useSetupBackButton, useSetupMainButton } from "@/shared/lib";
import { sendNotification } from "@/shared/lib/helpers/sendNotification";
import styles from "./ImportMnemonicPage.module.scss";
import { MnemonicInput } from "./MnemonicInput/MnemonicInput";

export const ImportMnemonicPage = () => {
    const { t } = useTranslation();
    const [mnemonic, setMnemonic] = useState<string[]>([]);
    const [importAccount, { error, isLoading: importAccountLoading }] = useImportAccountMutation();
    const navigate = useNavigate();
    const { confirm } = usePINConfirmation();
    const { createPIN } = usePINCreation();
    const { createConfirm, isLoading: createLoading } = useCreateConfirm(confirm);
    const { data: isUseBiometry } = useGetUseBiometryQuery();
    const { firstCreate, isLoading: firstCreateLoading } = useFirstCreate(createPIN, isUseBiometry);
    const isLoading = createLoading || firstCreateLoading;

    const onImport = useCallback(async () => {
        const data = await importAccount(mnemonic).unwrap();
        if (data.isNew) {
            firstCreate(data);
        }
        if (!data.isNew) {
            createConfirm(data);
        }
    }, [importAccount, createConfirm, mnemonic, navigate]);

    const onChange = (value: string[]) => {
        setMnemonic(value);
    };

    const isEnabled = mnemonic.length === 12 || mnemonic.length === 24;

    const onClick = useCallback(() => {
        if (isEnabled && !importAccountLoading && !isLoading) {
            onImport();
        }
    }, [isEnabled, importAccountLoading, onImport, isLoading]);

    useEffect(() => {
        if (error && error.message) {
            sendNotification(error.message, "error");
        }
    }, [error]);

    useSetupBackButton();

    return isLoading ? (
        <Loader />
    ) : (
        <WithDecorLayout>
            <div className={styles.content}>
                <Title className={styles.title}>{t("common.import")}</Title>
                <div className={styles.subtitle}>{t("registration.seed")}</div>
                <MnemonicInput onChange={onChange} isImport />
            </div>

            <CustomButton
                firstButton={{
                    children: <>{t("common.done")}</>,
                    type: "purple",
                    onClick: onClick,
                    isDisabled: importAccountLoading || isLoading
                }}
            />
        </WithDecorLayout>
    );
};
