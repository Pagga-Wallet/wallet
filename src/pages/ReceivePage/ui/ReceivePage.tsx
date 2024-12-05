import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { ReceiveInner } from "@/widgets/receive";
import { TokensList } from "@/widgets/token";
import {
    MultichainAccount,
    multichainAccountStore,
    useFetchTotalBalanceQuery,
} from "@/entities/multichainAccount";
import { PrivateLayout } from "@/shared/layouts";
import { useAppSelector, useSetupBackButton } from "@/shared/lib";
import { CHAINS, TokenBalance } from "@/shared/lib/types";
import { title } from "../consts";
import { ReceiveSteps } from "../types/ReceiveSteps";
import s from "./ReceivePage.module.sass";

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

    const { data: accountBalance = null, isFetching: accountBalanceFetching } =
        useFetchTotalBalanceQuery();

    const onTokenSelect = useCallback(
        (token: TokenBalance) => {
            if (!multichainAccount) return;
            const network: CHAINS = token.platform as CHAINS;
            const address = multichainAccount.getAddressInNetwork(network);
            if (!address) return;
            setSendAddress(address);
            setTokenChain(token.platform);
            setStep(ReceiveSteps.receive);
        },
        [multichainAccount]
    );

    const onBack = useCallback(() => {
        switch (step) {
            case ReceiveSteps.select:
                navigate(-1);
                break;
            case ReceiveSteps.receive:
                if (tokenPlatfromParam) navigate(-1);
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

    return (
        <PrivateLayout>
            <div className={s.title}>{t(title[step])}</div>

            {step === ReceiveSteps.select && (
                <TokensList
                    search
                    isSelectMode
                    accountBalance={accountBalance}
                    onTokenSelect={onTokenSelect}
                    isLoading={accountBalanceFetching}
                />
            )}
            {step === ReceiveSteps.receive && (
                <ReceiveInner address={sendAddress} chain={tokenChain} />
            )}
        </PrivateLayout>
    );
};
