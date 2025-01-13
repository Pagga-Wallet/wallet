import { mnemonicToPrivateKey } from "@ton/crypto";
import { beginCell, storeStateInit, WalletContractV4 } from "@ton/ton";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { connectStore } from "@/features/connect/model/connectSlice";
import { usePINConfirmation } from "@/features/PIN";
import { AccountSelector } from "@/features/switchAccount";
import { MultichainAccount, multichainAccountStore } from "@/entities/multichainAccount";
import { BaseLayout } from "@/shared/layouts";
import {
    cryptographyController,
    useAppSelector,
    useSetupBackButton,
    useSetupMainButton,
} from "@/shared/lib";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { workchain } from "@/shared/lib/consts/ton";
import { smallAddress } from "@/shared/lib/helpers/smallAddress";
import styles from "./ConnectOpenPage.module.sass";

export const ConnectOpenPage = () => {
    const app = useAppSelector(connectStore.selectors.selectManifest);
    const requestPromise = useAppSelector(connectStore.selectors.selectRequestPromise);
    const replyBuilder = useAppSelector(connectStore.selectors.selectReplyBuilder);

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { confirm } = usePINConfirmation();

    const [isShowConfirm, setShowConfirm] = useState<boolean>(false);

    const account = useAppSelector(multichainAccountStore.selectors.selectAccount);

    const tonVersion = useAppSelector(multichainAccountStore.selectors.selectTonVersion);
    const shortAddress = useMemo(
        () => smallAddress(account?.multiwallet.TON.address[tonVersion]),
        [account]
    );

    const onConnect = useCallback(
        async (mnemonics: string) => {
            const accountService = new MultichainAccount(account!, tonVersion);
            const { wallet, stateInit } = await accountService.getStateInit({
                version: tonVersion,
            });

            const multichainWallet = await cryptographyController.importWallet(mnemonics);
            const tonWallet = multichainWallet.ton;
            const secretKey = Buffer.from(tonWallet.secretKey, "hex");

            if (tonWallet.publicKey != accountService._tonWallet.publicKey) {
                throw new Error("Public key mismatch");
            }

            const replyItems = replyBuilder!.createReplyItems(
                wallet.address.toRawString(),
                secretKey as unknown as Uint8Array, // FIXME
                tonWallet.publicKey,
                stateInit
            );

            requestPromise!.resolve({
                address: wallet.address.toRawString(),
                replyItems,
                notificationsEnabled: false,
            });
            navigate("/home");
        },
        [requestPromise, tonVersion, navigate]
    );

    const handleClick = useCallback(async () => {
        if (!account) return;

        try {
            const title = t("pincode.enter");
            setShowConfirm(true);
            const pin = await confirm({ title });

            if (!pin) {
                throw new Error("PIN confirmation cancelled");
            }

            const mnemonics = cryptographyController.HashToKey(
                pin,
                account.masterIV,
                account.masterHash
            );

            if (!mnemonics) {
                throw new Error("Invalid PIN");
            }

            onConnect(mnemonics);
        } catch (error) {
            console.error(error);
        } finally {
            setShowConfirm(false);
        }
    }, [account, t]);

    useSetupMainButton({
        params: {
            text: t("common.connect"),
            isVisible: !isShowConfirm,
            isEnabled: true,
        },
        onClick: handleClick,
    });

    const onBack = useCallback(() => {
        requestPromise?.reject();
        navigate("/home");
    }, [requestPromise, navigate]);

    useSetupBackButton({
        onBack,
    });

    return (
        <BaseLayout withDecor>
            <div className={styles.modal}>
                <AccountSelector />
                <h2 className={styles.title}>
                    {t("common.connect-to")} <br />
                    {app!.name}
                </h2>
                <div className={styles.modalContent}>
                    <div className={styles.modalConnect}>
                        <img
                            src="https://raw.githubusercontent.com/delab-team/manifests-images/main/WalletAvatar.png"
                            alt="example"
                        />
                        <SvgSelector id="connect" />
                        <img src={app!.iconUrl} alt="example" />
                    </div>
                    <div className={styles.modalInfo}>
                        <p className={styles.modalInfoText}>
                            <span>Example</span>{" "}
                            {`${t("common.is-want-to-connect")} ${t(
                                "common.to-your-wallet"
                            )} ${shortAddress}`}
                        </p>
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
};
