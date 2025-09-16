import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StellarWallet } from "@/shared/api/stellar";
import { formatStellarAmount } from "@/shared/api/stellar/lib/helpers";
import s from "./stellar.module.sass";
const STELLAR_CONSTANTS = {
    MIN_BALANCE: 1
};

interface StellarAccountInfoProps {
    stellarWallet: StellarWallet;
    className?: string;
}

interface AccountInfo {
    balance: number;
    minimumBalance: number;
    availableBalance: number;
    sequenceNumber?: string;
    subentryCount?: number;
}

export const StellarAccountInfo: React.FC<StellarAccountInfoProps> = ({
    stellarWallet,
    className = s.stellarAccountInfo
}) => {
    const { t } = useTranslation();
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const loadAccountInfo = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const balanceResult = await stellarWallet.getNativeTokenBalance();
            if (balanceResult.isError) {
                setError(t("stellar.account-balance-load-error"));
                return;
            }

            const balance = balanceResult.data;
            const minimumBalance = await stellarWallet.getMinimumBalance();
            const availableBalance = Math.max(0, balance - minimumBalance);

            setAccountInfo({
                balance,
                minimumBalance,
                availableBalance
            });
        } catch (error) {
            setError((error as Error).message || t("stellar.account-info-load-error"));
        } finally {
            setLoading(false);
        }
    }, [stellarWallet, t]);

    useEffect(() => {
        loadAccountInfo();
    }, [loadAccountInfo]);

    const handleRefresh = () => {
        loadAccountInfo();
    };

    if (loading) {
        return (
            <div className={className}>
                <div className="loading">{t("stellar.account-info-loading")}</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={className}>
                <div className="error">
                    <p>{error}</p>
                    <button onClick={handleRefresh} className="retry-button">
                        {t("stellar.retry")}
                    </button>
                </div>
            </div>
        );
    }

    if (!accountInfo) {
        return (
            <div className={className}>
                <div className="no-data">{t("stellar.no-account-data")}</div>
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="account-header">
                <h3>{t("stellar.stellar-account")}</h3>
                <button
                    onClick={handleRefresh}
                    className="refresh-button"
                    title={t("stellar.refresh")}
                >
                    🔄
                </button>
            </div>

            <div className="balance-section">
                <div className="balance-item main-balance">
                    <label>{t("stellar.total-balance")}:</label>
                    <span className="balance-value">
                        {formatStellarAmount(accountInfo.balance)} XLM
                    </span>
                </div>

                <div className="balance-item available-balance">
                    <label>{t("stellar.available-to-send")}:</label>
                    <span className="balance-value available">
                        {formatStellarAmount(accountInfo.availableBalance)} XLM
                    </span>
                </div>

                <div className="balance-item minimum-balance">
                    <label>{t("stellar.minimum-reserve")}:</label>
                    <span className="balance-value reserved">
                        {formatStellarAmount(accountInfo.minimumBalance)} XLM
                    </span>
                </div>
            </div>

            <div className="account-details">
                <div className="detail-item">
                    <label>{t("stellar.address")}:</label>
                    <span className="address" title={stellarWallet._address}>
                        {stellarWallet._address.slice(0, 8)}...{stellarWallet._address.slice(-8)}
                    </span>
                </div>
            </div>

            <div className="info-section">
                <div className="info-item">
                    <p>
                        <strong>ℹ️ {t("common.info")}:</strong>{" "}
                        {t("stellar.info-min-reserve", {
                            balance: formatStellarAmount(STELLAR_CONSTANTS.MIN_BALANCE)
                        })}
                    </p>
                </div>
            </div>

            <div className="actions">
                <button
                    onClick={() =>
                        window.open(
                            `https://stellar.expert/explorer/public/account/${stellarWallet._address}`,
                            "_blank"
                        )
                    }
                    className="explorer-button"
                >
                    {t("stellar.open-in-explorer")}
                </button>
            </div>
        </div>
    );
};
