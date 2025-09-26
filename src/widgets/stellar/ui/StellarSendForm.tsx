import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StellarWallet } from "@/shared/api/stellar";
import { isValidStellarAddress, formatStellarAmount } from "@/shared/api/stellar/lib/helpers";
import s from "./stellar.module.sass";
const STELLAR_CONSTANTS = {
    MIN_BALANCE: 1
};

interface StellarSendFormProps {
    stellarWallet: StellarWallet;
    onSuccess: (hash: string) => void;
    onError: (error: string) => void;
    className?: string;
}

export const StellarSendForm: React.FC<StellarSendFormProps> = ({
    stellarWallet,
    onSuccess,
    onError,
    className = s.stellarSendForm
}) => {
    const { t } = useTranslation();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [memo, setMemo] = useState("");
    const [sending, setSending] = useState(false);
    const [balance, setBalance] = useState<number>(0);
    const [minimumBalance, setMinimumBalance] = useState<number>(STELLAR_CONSTANTS.MIN_BALANCE);
    const [validationError, setValidationError] = useState<string>("");

    const loadBalance = useCallback(async () => {
        try {
            const balanceResult = await stellarWallet.getNativeTokenBalance();
            if (!balanceResult.isError) {
                setBalance(balanceResult.data);
            }

            const minBalance = await stellarWallet.getMinimumBalance();
            setMinimumBalance(minBalance);
        } catch (error) {
            console.error("Failed to load balance:", error);
        }
    }, [stellarWallet]);

    // Load balance on initialization
    useEffect(() => {
        loadBalance();
    }, [loadBalance]);

    // Form validation
    useEffect(() => {
        setValidationError("");

        if (recipient && !isValidStellarAddress(recipient)) {
            setValidationError(t("stellar.invalid-stellar-address"));
            return;
        }

        if (amount) {
            const sendAmount = parseFloat(amount);
            if (isNaN(sendAmount) || sendAmount <= 0) {
                setValidationError(t("stellar.amount-must-be-positive"));
                return;
            }

            const availableBalance = balance - minimumBalance;
            if (sendAmount > availableBalance) {
                setValidationError(
                    t("stellar.insufficient-funds", {
                        amount: formatStellarAmount(availableBalance)
                    })
                );
                return;
            }
        }

        if (memo && memo.length > 28) {
            setValidationError(t("stellar.memo-too-long"));
            return;
        }
    }, [recipient, amount, memo, balance, minimumBalance, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validationError) {
            onError(validationError);
            return;
        }

        setSending(true);

        try {
            // Check if sending is possible
            const canSendResult = await stellarWallet.canSendAmount(amount);
            if (!canSendResult.canSend) {
                onError(canSendResult.errorMessage || t("stellar.cannot-send-transaction"));
                return;
            }

            const result = await stellarWallet.sendXLM({
                destinationAddress: recipient,
                amount: amount,
                memo: memo || undefined,
                useFreighter: true
            });

            if (result.isError) {
                onError(result.errorMessage || t("stellar.transaction-send-error"));
            } else {
                onSuccess(result.hash!);
                // Clear form
                setRecipient("");
                setAmount("");
                setMemo("");
                // Update balance
                loadBalance();
            }
        } catch (error) {
            onError((error as Error).message);
        } finally {
            setSending(false);
        }
    };

    const handleMaxAmount = () => {
        const availableBalance = balance - minimumBalance;
        if (availableBalance > 0) {
            setAmount(formatStellarAmount(availableBalance));
        }
    };

    const isFormValid = recipient && amount && !validationError && !sending;

    return (
        <form onSubmit={handleSubmit} className={className}>
            <div className="form-group">
                <label htmlFor="recipient">
                    {t("stellar.recipient")}
                    <span className="required">*</span>
                </label>
                <input
                    id="recipient"
                    type="text"
                    value={recipient}
                    onChange={e => setRecipient(e.target.value)}
                    placeholder={t("stellar.stellar-address-placeholder")}
                    className={recipient && !isValidStellarAddress(recipient) ? "error" : ""}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="amount">
                    {t("stellar.amount-xlm")}
                    <span className="required">*</span>
                </label>
                <div className="amount-input-group">
                    <input
                        id="amount"
                        type="number"
                        step="0.0000001"
                        min="0"
                        max={balance - minimumBalance}
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="0.0000000"
                        required
                    />
                    <button
                        type="button"
                        onClick={handleMaxAmount}
                        className="max-button"
                        disabled={balance <= minimumBalance}
                    >
                        MAX
                    </button>
                </div>
                <div className="balance-info">
                    {t("stellar.balance", {
                        balance: formatStellarAmount(balance),
                        available: formatStellarAmount(balance - minimumBalance)
                    })}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="memo">{t("stellar.memo-optional")}</label>
                <input
                    id="memo"
                    type="text"
                    value={memo}
                    onChange={e => setMemo(e.target.value)}
                    placeholder={t("stellar.transaction-comment-placeholder")}
                    maxLength={28}
                />
                <div className="memo-counter">{memo.length}/28</div>
            </div>

            {validationError && <div className="validation-error">{validationError}</div>}

            <button type="submit" disabled={!isFormValid} className="submit-button">
                {sending ? t("stellar.sending") : t("stellar.send-xlm")}
            </button>

            <div className="form-info">
                <p>
                    <strong>{t("common.attention")}:</strong>{" "}
                    {t("stellar.min-balance-warning", {
                        balance: formatStellarAmount(minimumBalance)
                    })}
                </p>
            </div>
        </form>
    );
};
