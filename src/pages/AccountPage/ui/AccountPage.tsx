import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { usePINConfirmation } from "@/features/PIN";
import {
    useDeleteAccountMutation,
    useFetchAccountQuery,
    useLazyLoadAccountQuery,
    useUpdateAccountMutation,
} from "@/entities/multichainAccount";
import { Loader } from "@/shared/components";
import { PrivateLayout } from "@/shared/layouts";
import { useSetupBackButton, useSetupMainButton } from "@/shared/lib";

import { AccountEditForm } from "./AccountEditForm";

export const AccountPage = () => {
    const { id: accountId } = useParams();

    const { data: account, isLoading } = useFetchAccountQuery(accountId as string);
    const [updateAccount, { isLoading: updateAccountIsLoading }] = useUpdateAccountMutation();
    const [deleteAccount, { isLoading: deleteAccountIsLoading }] = useDeleteAccountMutation();
    const [switchAccount, { isLoading: switchAccountIsLoading }] = useLazyLoadAccountQuery();
    const [formData, setFormData] = useState({});
    const { confirm } = usePINConfirmation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const onSave = useCallback(async () => {
        if (
            isLoading ||
            updateAccountIsLoading ||
            deleteAccountIsLoading ||
            switchAccountIsLoading
        ) {
            return;
        }
        await updateAccount({
            id: accountId!,
            payload: formData,
        });
        setFormData({});
        navigate("/home");
    }, [
        formData,
        updateAccount,
        isLoading,
        updateAccountIsLoading,
        deleteAccountIsLoading,
        switchAccountIsLoading,
    ]);

    const onChange = useCallback(
        ({ name, emojiId }: { emojiId?: string; name?: string }) => {
            setFormData({ name, emojiId });
        },
        [setFormData]
    );

    const onDelete = useCallback(async () => {
        try {
            await confirm({
                title: t("wallet.deletion"),
            });
            deleteAccount(accountId!)
                .unwrap()
                .then((res) => {
                    if (res.prevAccId) {
                        switchAccount(res.prevAccId).then(() => {
                            navigate("/home");
                        });
                    }
                    if (!res.prevAccId) {
                        navigate("/");
                    }
                });
        } catch (error) {
            console.error(error);
        }
    }, [account]);

    const loading =
        isLoading || updateAccountIsLoading || deleteAccountIsLoading || switchAccountIsLoading;

    useSetupBackButton();

    useSetupMainButton({
        onClick: onSave,
        params: {
            text: t("common.save"),
            textColor: "#FFFFFF",
            bgColor: "#424B56",
            isLoaderVisible: loading,
            isEnabled: !loading,
            isVisible: !!Object.keys(formData).length,
        },
    });

    if (isLoading || updateAccountIsLoading) {
        return <Loader />;
    }

    return (
        <PrivateLayout>
            <AccountEditForm onDelete={onDelete} account={account!} onChange={onChange} />
        </PrivateLayout>
    );
};
