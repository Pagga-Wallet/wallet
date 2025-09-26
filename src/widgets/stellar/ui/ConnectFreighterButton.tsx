import { isConnected, getAddress, getNetworkDetails } from "@stellar/freighter-api";
import { Networks } from "@stellar/stellar-sdk";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface ConnectFreighterButtonProps {
    onConnected: (publicKey: string) => void;
    onError: (error: string) => void;
    className?: string;
    children?: React.ReactNode;
}

export const ConnectFreighterButton: React.FC<ConnectFreighterButtonProps> = ({
    onConnected,
    onError,
    className = "btn btn-primary",
    children
}) => {
    const { t } = useTranslation();
    const [connecting, setConnecting] = useState(false);

    const handleConnect = async () => {
        setConnecting(true);
        try {
            const installed = await isConnected();
            if (!installed) {
                onError(t("stellar.freighter-not-detected"));
                return;
            }

            // Network check
            const networkDetails = await getNetworkDetails();
            const expectedPassphrase = Networks.PUBLIC;

            if (networkDetails.networkPassphrase !== expectedPassphrase) {
                onError(t("stellar.network-mismatch"));
                return;
            }

            const publicKey = await getAddress();
            onConnected(publicKey.address);
        } catch (error) {
            onError((error as Error).message || t("stellar.freighter-connection-error"));
        } finally {
            setConnecting(false);
        }
    };

    return (
        <button onClick={handleConnect} disabled={connecting} className={className}>
            {connecting ? t("stellar.connecting") : children || t("stellar.connect-freighter")}
        </button>
    );
};
