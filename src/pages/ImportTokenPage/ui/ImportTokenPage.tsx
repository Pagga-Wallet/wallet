import { skipToken } from "@reduxjs/toolkit/query";
import { backButton } from "@telegram-apps/sdk-react";
import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { InputAddressContract, SelectNetwork } from "@/widgets/import";
import { useGetImportedTokensQuery, useImportTokenMutation } from "@/entities/multichainAccount";
import { useGetTokenByContractQuery } from "@/entities/token/model/tokenService";
import { TokenListItem } from "@/entities/token/ui";
import { Title } from "@/shared/components";
import { BaseLayout } from "@/shared/layouts";
import { useSetupBackButton, useSetupMainButton } from "@/shared/lib";
import { tokensWhitelist } from "@/shared/lib/consts/token";
import { checkAddress } from "@/shared/lib/helpers/checkAddress";
import { CHAINS } from "@/shared/lib/types";
import { btnText } from "../consts";
import { ImportTokenSteps } from "../types/ImportTokenSteps";
import s from "./ImportTokenPage.module.sass";

interface ImportTokenPageProps {}

export const ImportTokenPage: FC<ImportTokenPageProps> = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [step, setStep] = useState<ImportTokenSteps>(ImportTokenSteps.network);
    const [network, setNetwork] = useState<CHAINS | null>(null);
    const [addressContract, setAddressContract] = useState<string>("");

    const isValidAddress: boolean = !!(network && checkAddress(addressContract, network));
    const { data: tokenData, isLoading } = useGetTokenByContractQuery(
        network && isValidAddress ? { tokenContract: addressContract, chain: network } : skipToken
    );
    const isValidToken = Boolean(isValidAddress && !isLoading && tokenData);

    const { data: savedTokens, isFetching } = useGetImportedTokensQuery();
    const [importToken] = useImportTokenMutation();
    const isImportedToken = Boolean(
        isFetching || (network && savedTokens?.[network].includes(addressContract))
    );
    const isWhitelistedToken = tokensWhitelist.some(
        (token) => addressContract && token.contract === addressContract
    );
    const isSavedToken = isWhitelistedToken || isImportedToken;

    const onSaveContractAddress = useCallback(async () => {
        if (!isValidToken || !network) return;
        await importToken({ token: addressContract, chain: network });
        navigate(-1);
    }, [addressContract, navigate, isValidToken, importToken, network]);

    const onForward = useCallback(() => {
        switch (step) {
            case ImportTokenSteps.network:
                setStep(ImportTokenSteps.address_contract);
                break;
            case ImportTokenSteps.address_contract:
                onSaveContractAddress();
                break;
            default:
                break;
        }
    }, [step, onSaveContractAddress]);

    useSetupMainButton({
        onClick: onForward,
        params: {
            text: isSavedToken ? t("import-token.already-imported") : t(btnText[step]),
            isVisible: true,
            isEnabled:
                step === ImportTokenSteps.address_contract
                    ? isValidToken && !isSavedToken
                    : !!(step === ImportTokenSteps.network && network),
            isLoaderVisible: isFetching,
            backgroundColor: "#007AFF",
        },
    });

    const onBack = useCallback(() => {
        switch (step) {
            case ImportTokenSteps.network:
                navigate(-1);
                break;
            case ImportTokenSteps.address_contract:
                setAddressContract("");
                setStep(ImportTokenSteps.network);
                break;
            default:
                break;
        }
    }, [step, navigate]);

    backButton.mount()
    useSetupBackButton({
        onBack,
    });

    return (
        <BaseLayout>
            <Title level={2} className={s.title}>
                {t("common.import-token")}
            </Title>

            {step === ImportTokenSteps.network && (
                <SelectNetwork setNetwork={setNetwork} network={network} />
            )}

            {step === ImportTokenSteps.address_contract && (
                <>
                    <InputAddressContract
                        addressContract={addressContract}
                        setAddressContract={setAddressContract}
                    />
                    {/* Тут отображать найденный токен */}
                    {isValidAddress && tokenData && !isLoading ? (
                        <TokenListItem
                            name={tokenData.tokenName}
                            balance={tokenData.balance}
                            balanceUSD={tokenData.balanceUSD}
                            change24={tokenData.change24h}
                            tokenPrice={tokenData.price}
                            icon={tokenData.tokenIcon}
                            chain={tokenData.platform}
                        />
                    ) : null}
                </>
            )}
        </BaseLayout>
    );
};
