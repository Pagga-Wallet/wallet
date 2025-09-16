import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StellarWallet } from "@/shared/api/stellar";
import { isValidStellarAddress } from "@/shared/api/stellar/lib/helpers";
import s from "./stellar.module.sass";

interface AddTrustlineFormProps {
    stellarWallet: StellarWallet;
    onSuccess: (assetCode: string, issuer: string) => void;
    onError: (error: string) => void;
    className?: string;
}

export const AddTrustlineForm: React.FC<AddTrustlineFormProps> = ({
    stellarWallet,
    onSuccess,
    onError,
    className = s.addTrustlineForm
}) => {
    const { t } = useTranslation();
    const [assetCode, setAssetCode] = useState("");
    const [issuer, setIssuer] = useState("");
    const [adding, setAdding] = useState(false);
    const [validationError, setValidationError] = useState("");

    // Form validation
    React.useEffect(() => {
        setValidationError("");

        if (assetCode && (assetCode.length < 1 || assetCode.length > 12)) {
            setValidationError(t("stellar.asset-code-length-error"));
            return;
        }

        if (issuer && !isValidStellarAddress(issuer)) {
            setValidationError(t("stellar.invalid-issuer-address"));
            return;
        }
    }, [assetCode, issuer, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validationError) {
            onError(validationError);
            return;
        }

        if (!assetCode.trim() || !issuer.trim()) {
            onError(t("stellar.fill-required-fields"));
            return;
        }

        setAdding(true);

        try {
            // Add trustline using Freighter (or could use private key)
            const result = await stellarWallet.addTrustline({
                assetCode: assetCode.trim(),
                issuer: issuer.trim(),
                useFreighter: true
            });

            if (result.isError) {
                onError(result.errorMessage || "Error adding trustline");
                return;
            }

            onSuccess(assetCode.trim(), issuer.trim());

            // Clear form
            setAssetCode("");
            setIssuer("");
        } catch (error) {
            onError((error as Error).message || "Error adding trustline");
        } finally {
            setAdding(false);
        }
    };

    const isFormValid = assetCode.trim() && issuer.trim() && !validationError && !adding;

    return (
        <form onSubmit={handleSubmit} className={className}>
            <div className="form-header">
                <h3>{t("stellar.add-stellar-asset")}</h3>
                <p>{t("stellar.add-trustline-description")}</p>
            </div>

            <div className="form-group">
                <label htmlFor="assetCode">
                    {t("stellar.asset-code")}
                    <span className="required">*</span>
                </label>
                <input
                    id="assetCode"
                    type="text"
                    value={assetCode}
                    onChange={e => setAssetCode(e.target.value.toUpperCase())}
                    placeholder="USDC, EUR, BTC..."
                    maxLength={12}
                    className={
                        assetCode && (assetCode.length < 1 || assetCode.length > 12) ? "error" : ""
                    }
                    required
                />
                <div className="field-hint">{t("stellar.asset-symbol-hint")}</div>
            </div>

            <div className="form-group">
                <label htmlFor="issuer">
                    {t("stellar.issuer-address")}
                    <span className="required">*</span>
                </label>
                <input
                    id="issuer"
                    type="text"
                    value={issuer}
                    onChange={e => setIssuer(e.target.value)}
                    placeholder={t("stellar.stellar-address-placeholder")}
                    className={issuer && !isValidStellarAddress(issuer) ? "error" : ""}
                    required
                />
                <div className="field-hint">{t("stellar.issuer-hint")}</div>
            </div>

            {validationError && <div className="validation-error">{validationError}</div>}

            <button type="submit" disabled={!isFormValid} className="submit-button">
                {adding ? t("stellar.adding") : t("stellar.add-asset")}
            </button>

            <div className="form-info">
                <div className="warning">
                    <p>{t("stellar.trustline-warning")}</p>
                </div>

                <div className="info">
                    <p>{t("stellar.trustline-info", { amount: 0.5 })}</p>
                </div>
            </div>
        </form>
    );
};
