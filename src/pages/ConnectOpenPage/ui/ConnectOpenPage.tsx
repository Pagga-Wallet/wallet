import { mnemonicToPrivateKey } from "@ton/crypto";
import { beginCell, storeStateInit, WalletContractV4 } from "@ton/ton";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ConnectItem } from "@/features/connect";
import { connectStore } from "@/features/connect/model/connectSlice";
import { usePINConfirmation } from "@/features/PIN";
import { MultichainAccount, multichainAccountStore } from "@/entities/multichainAccount";
import { CustomButton, Title } from "@/shared/components";
import { BaseLayout } from "@/shared/layouts";
import { WithDecorLayout } from "@/shared/layouts/layouts";
import {
    cryptographyController,
    useAppSelector,
    useSetupBackButton,
    useSetupMainButton
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
    const shortAddress = useMemo(() => smallAddress(account?.multiwallet.TON.address[tonVersion]), [
        account
    ]);

    const onConnect = useCallback(
        async (mnemonics: string) => {
            const accountService = new MultichainAccount(account!, tonVersion);
            const { wallet, stateInit } = await accountService.getStateInit({
                version: tonVersion
            });

            const multichainWallet = await cryptographyController.importWallet(mnemonics);
            const tonWallet = multichainWallet.ton;
            const secretKey = Buffer.from(tonWallet.secretKey, "hex");

            // !! IF NOT DEPLOYED WALLET NOT CONNECTED
            // if (tonWallet.publicKey != accountService._tonWallet.publicKey) {
            //     throw new Error("Public key mismatch");
            // }

            const replyItems = replyBuilder!.createReplyItems(
                wallet.address.toRawString(),
                (secretKey as unknown) as Uint8Array, // FIXME
                tonWallet.publicKey,
                stateInit
            );

            requestPromise!.resolve({
                address: wallet.address.toRawString(),
                replyItems,
                notificationsEnabled: false
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

    // useSetupMainButton({
    //     params: {
    //         text: t("common.connect"),
    //         isVisible: !isShowConfirm,
    //         isEnabled: true,
    //     },
    //     onClick: handleClick,
    // });

    const onBack = useCallback(() => {
        requestPromise?.reject();
        navigate("/home");
    }, [requestPromise, navigate]);

    useSetupBackButton({
        onBack
    });

    return (
        <WithDecorLayout>
            <div className={styles.top}>
                <div className={styles.topImg}>
                    <img src={app!.iconUrl} width={80} height={80} alt="example" />
                </div>
                <div className={styles.topInfo}>
                    <Title level={2} className={styles.topInfoTitle}>
                        {app?.name ?? "App"}
                    </Title>

                    <p className={styles.topInfoSubtitle}>
                        {t("connect-wallet-list.requests-a-connection")}
                    </p>
                </div>
            </div>

            <div className={styles.innerDetail}>
                <div className={styles.item}>
                    <p className={styles.itemLeft}>{t("common.network")}</p>
                    <p className={styles.itemRight}>The Open Network</p>
                </div>
                <div className={styles.item}>
                    <p className={styles.itemLeft}>{t("trans-detail.address")}</p>
                    <p className={styles.itemRight}>{app?.url}</p>
                </div>
            </div>

            <div className={styles.innerInfo}>
                <div className={styles.innerInfoItem}>
                    <SvgSelector id="activity" />
                    {t("connect-wallet-list.info-item-1")}
                </div>
                <div className={styles.innerInfoItem}>
                    <SvgSelector id="checked-checked" />
                    {t("connect-wallet-list.info-item-2")}
                </div>
            </div>

            <Title level={3} className={styles.networkTitle}>
                {t("connect-wallet-list.networks")}
            </Title>
            <ConnectItem
                title="TON"
                description={shortAddress}
                preview="https://s2.coinmarketcap.com/static/img/coins/200x200/11419.png"
            />
            {!isShowConfirm && (
                <CustomButton
                    firstButton={{
                        children: t("common.connect"),
                        type: "purple",
                        onClick: handleClick
                    }}
                />
            )}
        </WithDecorLayout>
    );
};
