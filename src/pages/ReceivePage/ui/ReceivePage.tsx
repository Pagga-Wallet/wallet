import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { SelectNetwork } from "@/widgets/import";
import { ReceiveInner } from "@/widgets/receive";
import {
    MultichainAccount,
    multichainAccountStore,
    useFetchTotalBalanceQuery
} from "@/entities/multichainAccount";
import { useAppSelector, useSetupBackButton } from "@/shared/lib";
import { getSelectBlockhainConfig } from "@/shared/lib/consts/import-list";
import { CHAINS } from "@/shared/lib/types";
import { ReceiveSteps } from "../types/ReceiveSteps";

export const ReceivePage = () => {
    const { t } = useTranslation();
    const account = useAppSelector(multichainAccountStore.selectors.selectAccount);
    const tonVersion = useAppSelector(multichainAccountStore.selectors.selectTonVersion);
    const multichainAccount = useMemo(
        () => (account ? new MultichainAccount(account, tonVersion) : undefined),
        [account, tonVersion]
    );

    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const tokenPlatfromParam: string | null = searchParams.get("tokenPlatfrom");

    const [sendAddress, setSendAddress] = useState<string>("");
    const [step, setStep] = useState<ReceiveSteps>(ReceiveSteps.select);
    const [tokenChain, setTokenChain] = useState<CHAINS | null>(
        tokenPlatfromParam ? (tokenPlatfromParam as CHAINS) : null
    );

    const {
        data: accountBalance = null,
        isFetching: accountBalanceFetching
    } = useFetchTotalBalanceQuery();

    useEffect(() => {
        if (!multichainAccount || !tokenChain) return;
        const address = multichainAccount.getAddressInNetwork(tokenChain);
        if (!address) return;
        setSendAddress(address);
        setStep(ReceiveSteps.receive);
    }, [tokenChain]);

    const onBack = useCallback(() => {
        switch (step) {
            case ReceiveSteps.select:
                navigate(-1);
                break;
            case ReceiveSteps.receive:
                if (tokenPlatfromParam) navigate(-1);
                setTokenChain(null);
                setStep(ReceiveSteps.select);
                break;
            default:
                break;
        }
    }, [step, navigate, tokenPlatfromParam]);

    useSetupBackButton({ onBack });

    // CHECK FROM SEARCH PARAMS
    useEffect(() => {
        if (tokenPlatfromParam && multichainAccount) {
            const chain = tokenPlatfromParam ? (tokenPlatfromParam as CHAINS) : null;
            if (!chain) return;
            const address = multichainAccount.getAddressInNetwork(chain);
            if (!address) return;
            setSendAddress(address);
            setStep(ReceiveSteps.receive);
        }
    }, [tokenPlatfromParam, multichainAccount]);

    const configNetworks = getSelectBlockhainConfig();
    return (
        <>
            {step === ReceiveSteps.select && (
                <SelectNetwork
                    setNetwork={setTokenChain}
                    config={configNetworks}
                    network={tokenChain}
                    title={t("main.receive-btn")}
                    subtitle={t("common.select-network")}
                />
            )}
            {step === ReceiveSteps.receive && (
                <ReceiveInner address={sendAddress} chain={tokenChain} />
            )}
        </>
    );
};
