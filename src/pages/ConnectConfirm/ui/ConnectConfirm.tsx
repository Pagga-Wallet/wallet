import { fromNano } from "@ton/ton";
import { SEND_TRANSACTION_ERROR_CODES } from "@tonconnect/protocol";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MessageForSign } from "@/pages/ConnectConfirm/ui/MessageForSign";
import { useValidUntil } from "@/features/connect";
import { connectConfirmStore } from "@/features/connect/model/confirmSlice";
import { usePINConfirmation } from "@/features/PIN";
import {
    MultichainAccount,
    multichainAccountStore,
    useFetchTotalBalanceQuery,
} from "@/entities/multichainAccount";
import { Title } from "@/shared/components";
import { BaseLayout } from "@/shared/layouts";
import {
    cryptographyController,
    useAppSelector,
    useSetupBackButton,
    useSetupMainButton,
} from "@/shared/lib";
import { SendTransactionError } from "@/shared/lib/connect/SendTransactionError";
import styles from "./ConnectConfirm.module.scss";

// зарефакторить в фичу
export const ConnectConfirm = () => {
    const { t } = useTranslation();
    const { confirm } = usePINConfirmation();
    const navigate = useNavigate();

    const connection = useAppSelector(connectConfirmStore.selectors.selectConnection);
    const messages = useAppSelector(connectConfirmStore.selectors.selectMessages);
    const requestPromise = useAppSelector(connectConfirmStore.selectors.selectRequestPromise);
    const request = useAppSelector(connectConfirmStore.selectors.selectRequest);
    const validUntil = useAppSelector(connectConfirmStore.selectors.selectValidUntil);

    const account = useAppSelector(multichainAccountStore.selectors.selectAccount);
    const tonVersion = useAppSelector(multichainAccountStore.selectors.selectTonVersion);
    const multichainAccount = useMemo(
        () => (account ? new MultichainAccount(account, tonVersion) : undefined),
        [account, tonVersion]
    );
    const { data: accountBalance = null } = useFetchTotalBalanceQuery();
    const txAmount = messages.reduce((acc, message) => acc + Number(fromNano(message.amount)), 0);
    const isInsufficientBalance = txAmount > (accountBalance?.chains.TON.nativeToken.balance ?? 0);

    const onSend = useCallback(async () => {
        if (isInsufficientBalance) return;
        const title = t("send.confirm-transaction");
        const pin = await confirm({
            title,
        });
        if (!pin) {
            throw new Error("PIN confirmation cancelled");
        }
        const mnemonic = cryptographyController.HashToKey(
            pin,
            account!.masterIV,
            account!.masterHash
        );

        if (!mnemonic) {
            throw new Error("Invalid PIN");
        }

        const res = await multichainAccount!.signRawMessages({
            mnemonic,
            messages,
        });
        requestPromise?.resolve();
        if (res) {
            navigate("/connect/success");
        } else {
            navigate("/connect/failed");
        }
    }, [multichainAccount, confirm, requestPromise, messages, isInsufficientBalance]);

    useValidUntil(validUntil, () => {
        requestPromise?.reject(
            new SendTransactionError(
                request.id,
                SEND_TRANSACTION_ERROR_CODES.BAD_REQUEST_ERROR,
                "Request timed out"
            )
        );
    });

    const onBack = useCallback(() => {
        requestPromise?.reject(
            new SendTransactionError(
                request.id,
                SEND_TRANSACTION_ERROR_CODES.USER_REJECTS_ERROR,
                "Wallet declined the request"
            )
        );
        navigate("/home");
    }, [requestPromise, request, navigate]);

    useSetupMainButton({
        onClick: onSend,
        params: {
            text: isInsufficientBalance ? t("common.insufficient-ton") : t("common.send"),
            isLoaderVisible: false,
            isEnabled: !isInsufficientBalance,
            isVisible: true,
        },
    });

    useSetupBackButton({
        onBack,
    });

    return (
        <BaseLayout>
            <Title className={styles.title}>{t("connect.confirm-from")}</Title>
            <div className={styles.app}>
                <img width={32} height={32} src={connection.iconUrl} alt="example" />
                {connection.name}
            </div>
            <div className={styles.messageList}>
                {messages
                    .map((message) => ({
                        type: message.payload ? ("execute" as const) : ("sending" as const),
                        amountTON: fromNano(message.amount),
                        amountUSD: (
                            Number(fromNano(message.amount)) *
                            (accountBalance?.chains.TON.nativeToken.price ?? 0)
                        ).toString(),
                        address: message.address,
                        stateInit: message.stateInit,
                    }))
                    .map((msg) => (
                        <MessageForSign {...msg} />
                    ))}
            </div>
        </BaseLayout>
    );
};
