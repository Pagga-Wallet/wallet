import { popup } from "@telegram-apps/sdk-react";
import { FC, useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ConnectIntroduction, ConnectList, ConnectListDetail } from "@/widgets/connect";

import { useOpenConnect } from "@/features/connect/model/connectService";
import { useQRScanner } from "@/features/qrScanner";
import { useGetConnectionsQuery, useRemoveConnectionMutation } from "@/entities/connection";
import { IConnection, IConnectionWithWalletName } from "@/entities/connection/model/types";
import { useFetchAccountsQuery } from "@/entities/multichainAccount";
import { Title } from "@/shared/components";
import { BaseLayout } from "@/shared/layouts";
import { useSetupBackButton, useSetupMainButton } from "@/shared/lib";

import { checkDesktopPlatform } from "@/shared/lib/helpers/checkDesktopPlatform";
import { btnText, title } from "../consts";

import { ConnectWalletListSteps } from "../types/ConnectWalletListSteps";

import s from "./ConnectWalletListPage.module.sass";

interface ConnectWalletListPageProps {}

export const ConnectWalletListPage: FC<ConnectWalletListPageProps> = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { connect } = useOpenConnect();
    const [scanHandle] = useQRScanner({ connect });

    const [step, setStep] = useState<ConnectWalletListSteps>(ConnectWalletListSteps.connect_list);

    const { data: accounts, isLoading: isLoadingAccounts } = useFetchAccountsQuery();
    const { data: connections, isLoading: isLoadingConnections } = useGetConnectionsQuery({});

    const isDesktop = checkDesktopPlatform();

    const [removeConnection] = useRemoveConnectionMutation();

    const [detailInfo, setDetailInfo] = useState<IConnectionWithWalletName | null>(null);

    useEffect(() => {
        if (isLoadingAccounts || isLoadingConnections) {
            return;
        }

        if (!connections || connections.length === 0) {
            setStep(ConnectWalletListSteps.connect_introduction);
        } else {
            setStep(ConnectWalletListSteps.connect_list);
        }
    }, [connections, isLoadingAccounts, isLoadingConnections]);

    const updatedConnections = connections?.map((c: IConnection) => {
        const currentAccount = accounts?.find(
            (account: { id: string; name: string; emojiId: string }) => account.id === c.accId
        );
        return {
            ...c,
            walletFullName:
                currentAccount?.name && currentAccount?.name.length > 1
                    ? currentAccount.name
                    : t("wallet.default-name", {
                          id: `${parseInt(currentAccount?.id ?? "0") + 1}`,
                      }),
        };
    });

    const onBack = useCallback(() => {
        if (step === ConnectWalletListSteps.connect_list_detail) {
            setDetailInfo(null);
            setStep(ConnectWalletListSteps.connect_list);
        } else {
            navigate(-1);
        }
    }, [step, navigate]);

    useSetupBackButton({ onBack });

    const onForward = useCallback(() => {
        if (
            step === ConnectWalletListSteps.connect_list ||
            step === ConnectWalletListSteps.connect_introduction
        ) {
            scanHandle();
        }
    }, [step]);

    useSetupMainButton({
        onClick: onForward,
        params: {
            text: t(btnText[step]),
            isEnabled: !isDesktop,
            isLoaderVisible: false,
            isVisible: step !== ConnectWalletListSteps.connect_list_detail,
        },
    });

    const handleListDetail = (clientSessionId: string) => {
        const detailInfo =
            updatedConnections?.find(
                (c: IConnectionWithWalletName) => c.clientSessionId === clientSessionId
            ) ?? null;
        setDetailInfo(detailInfo);
        setStep(ConnectWalletListSteps.connect_list_detail);
    };

    const handleRemove = () => { 
        popup
            .open({
                title: t("connect-wallet-list.delete-connection"),
                message: t("common.are-you-sure"),
                buttons: [
                    {
                        id: "del-btn",
                        type: "default",
                        text: t("connect-wallet-list.delete-connection"),
                    },
                    { id: "cancel", type: "cancel" },
                ],
            })
            .then(async (buttonId) => {
                if (buttonId !== "cancel" && detailInfo) {
                    await removeConnection(detailInfo!.clientSessionId);
                    setStep(ConnectWalletListSteps.connect_list);
                }
            });
    };

    return (
        <BaseLayout>
            {step !== ConnectWalletListSteps.connect_introduction && (
                <div className={s.top}>
                    <Title level={1} className={s.title}>
                        {t(title[step])}
                    </Title>
                    <p className={s.description}>{t("connect-wallet-list.connection-list")}</p>
                </div>
            )}

            {step === ConnectWalletListSteps.connect_introduction && <ConnectIntroduction />}
            {step === ConnectWalletListSteps.connect_list && (
                <ConnectList
                    onClick={handleListDetail}
                    connections={updatedConnections}
                    isLoading={isLoadingAccounts || isLoadingConnections}
                />
            )}
            {step === ConnectWalletListSteps.connect_list_detail && (
                <ConnectListDetail detailInfo={detailInfo} handleRemove={handleRemove} />
            )}
        </BaseLayout>
    );
};
