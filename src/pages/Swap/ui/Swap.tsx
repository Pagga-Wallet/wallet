import { skipToken } from "@reduxjs/toolkit/query";
import { Address } from "@ton/core";
import { ethers } from "ethers";
import { ceil } from "lodash";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SelectNetwork } from "@/widgets/import";
import { SwapInfo } from "@/widgets/swap/ui/SwapInfo/SwapInfo";
import { SwapInner } from "@/widgets/swap/ui/SwapInner/SwapInner";
import { TokensList } from "@/widgets/token";
import { FailedTransaction, SuccessTransaction } from "@/widgets/transaction";
import { usePINConfirmation } from "@/features/PIN";
import { coffeeSwap, SwapBasic } from "@/features/swap";
import {
    useExecuteSwapMutation,
    useGetAssetsListQuery,
    useGetSwapConfigurationQuery,
} from "@/features/swap/";
import {
    MultichainAccount,
    multichainAccountStore,
    useFetchTotalBalanceQuery,
} from "@/entities/multichainAccount";
import { PrivateLayout } from "@/shared/layouts";
import {
    cryptographyController,
    useAppSelector,
    useSetupBackButton,
    useSetupMainButton,
} from "@/shared/lib";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { getSelectBlockhainConfig } from "@/shared/lib/consts/import-list";
import { getExplorerLink } from "@/shared/lib/helpers/getExplorerLink";
import { sendNotification } from "@/shared/lib/helpers/sendNotification";
import { CHAINS, TokenBalance } from "@/shared/lib/types";
import { useBalanceCheck } from "../lib/hooks/useBalanceCheck";
import { SwapSteps } from "../lib/types";
// import s from "./Swap.module.sass";

export const Swap: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { confirm } = usePINConfirmation();
    const searchParams = new URLSearchParams(location.search);
    const preselectedNetwork: string | null = searchParams.get("network");
    const preselectedInput: TokenBalance | null = location.state?.input ?? null;

    const [step, setStep] = useState<SwapSteps>(SwapSteps.selectNetwork);
    const [network, setNetwork] = useState<CHAINS | null>(
        preselectedNetwork ? (preselectedNetwork as CHAINS) : null
    );
    const [tokenFrom, setTokenFrom] = useState<TokenBalance | null>(null);
    const [tokenTo, setTokenTo] = useState<TokenBalance | null>(null);
    const [fromAmount, setFromAmount] = useState<number>(0);
    const [toAmount, setToAmount] = useState<number>(0);
    const [showTokenList, setShowTokenList] = useState<"token1" | "token2" | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    const [reversed, setReversed] = useState(false);

    // Достаём акк и тон версию
    const account = useAppSelector(multichainAccountStore.selectors.selectAccount);
    const tonVersion = useAppSelector(multichainAccountStore.selectors.selectTonVersion);
    const multichainAccount = useMemo(
        () => (account ? new MultichainAccount(account, tonVersion) : undefined),
        [account, tonVersion]
    );
    const { data: accountBalance = null, isFetching: accountBalanceFetching } =
        useFetchTotalBalanceQuery();

    const explorerLink = getExplorerLink({
        userAddress: multichainAccount?.getAddressInNetwork(CHAINS.TON),
        chain: CHAINS.TON,
    });

    // Доступные ассеты
    const { data: assetList = null } = useGetAssetsListQuery(network ?? skipToken);

    // Мутация вызова свапа
    const [executeSwapMutation] = useExecuteSwapMutation();

    // Получаем конфигурацию свапа
    const {
        data: swapConfig,
        isFetching: isFetchingConfig,
        isError: isConfigError,
    } = useGetSwapConfigurationQuery(
        tokenFrom && tokenTo && network
            ? {
                  params: {
                      inputToken: tokenFrom,
                      outputToken: tokenTo,
                      amount: reversed ? toAmount : fromAmount,
                      inputAmount: !reversed,
                  },
                  chain: network,
              }
            : skipToken,
        { pollingInterval: 10000 }
    );

    // useEffect(() => {
    //     console.log("swapConfig", swapConfig);
    //     if (reversed) setFromAmount(swapConfig?.inputAmount ?? 0);
    //     else setToAmount(swapConfig?.outputAmount ?? 0);
    // }, [swapConfig]);

    // Чекаем что балика достаточно для свапа и комсы (хук)
    const { isEnoughBalance, isSufficientNativeForCommission } = useBalanceCheck({
        gas: swapConfig?.gas,
        balance: accountBalance,
        tokenFrom: tokenFrom,
        fromAmount,
        chain: network,
    });

    // CHECK FROM SEARCH PARAMS
    useEffect(() => {
        if (preselectedNetwork && multichainAccount) {
            const chain = preselectedNetwork ? (preselectedNetwork as CHAINS) : null;
            if (!chain) return;
            setStep(SwapSteps.swap);
            setNetwork(preselectedNetwork as CHAINS);
        }
    }, [preselectedNetwork, multichainAccount]);

    // Обновляем токен при изменении swapConfig
    useEffect(() => {
        if (swapConfig) {
            if (reversed) setFromAmount(ceil(swapConfig.inputAmount, 4));
            else setToAmount(ceil(swapConfig.outputAmount, 4));
        }
    }, [swapConfig]);

    // Сообщение об ошибке
    useEffect(() => {
        if (swapConfig === null || isConfigError)
            sendNotification(t("swap-modal.not-found"), "error");
    }, [swapConfig, isConfigError]);

    // Объединяем балансы и список ассетов
    const parsedTokens: TokenBalance[] = useMemo(() => {
        if (!network || !accountBalance || !assetList) return [];
        const userAssets = accountBalance.chains[network].tokens ?? [];
        const res = assetList?.map<TokenBalance>(
            (asset) =>
                userAssets.find(
                    (userAsset) =>
                        String(userAsset.tokenContract).toLowerCase() ===
                        String(asset.tokenContract).toLowerCase()
                ) ?? asset
        );
        return [accountBalance.chains[network].nativeToken, ...res];
    }, [assetList, accountBalance, network]);

    // Сетаем дефолтные токены по загрузке балика
    // Если инпут тон, ставим в пару с DFC
    // Если инпут жетон, ставим в пару с TON
    useEffect(() => {
        if (accountBalance && network) {
            const allTokens = [
                accountBalance.chains[network].nativeToken,
                ...(accountBalance.chains[network].tokens || []),
            ];
            if (preselectedInput) {
                if (preselectedInput.isNativeToken && preselectedInput.platform === CHAINS.TON) {
                    setTokenFrom(preselectedInput);
                    setTokenTo(
                        allTokens.find((token) => token.tokenID === "DeFinder Capital") ||
                            allTokens[1] ||
                            null
                    );
                } else {
                    setTokenFrom(preselectedInput);
                    setTokenTo(allTokens[0] || null);
                }
            } else {
                setTokenFrom(accountBalance.chains[network].nativeToken);
                setTokenTo(
                    allTokens.find((token) => token.tokenID === "DeFinder Capital") ||
                        allTokens[1] ||
                        null
                );
            }
        }
    }, [accountBalance, network, preselectedInput]);

    // Условия для свапа
    const disableMainBtn = useMemo(() => {
        return !!(
            step !== SwapSteps.swap ||
            !network ||
            !tokenFrom ||
            !tokenTo ||
            showTokenList ||
            !swapConfig ||
            (network === CHAINS.TON && (swapConfig?.paths?.length ?? 0) < 1) ||
            !isEnoughBalance ||
            !isSufficientNativeForCommission
        );
    }, [
        step,
        network,
        tokenFrom,
        tokenTo,
        showTokenList,
        swapConfig,
        isEnoughBalance,
        isSufficientNativeForCommission,
    ]);

    // Главная функция исполнения свапа
    const onSwap = useCallback(async () => {
        if (!disableMainBtn && multichainAccount && network && tokenFrom && tokenTo) {
            const account = multichainAccount._account;
            try {
                // Confirm
                const title = t("send.confirm-transaction");
                const pin = await confirm({
                    title,
                });
                const mnemonics = cryptographyController.HashToKey(
                    pin,
                    account.masterIV,
                    account.masterHash
                );
                if (!mnemonics) {
                    throw new Error("Invalid PIN");
                }
                setProcessing(true);

                // execute
                const result = await executeSwapMutation({
                    chain: network,
                    params: {
                        mnemonics,
                        inputToken: tokenFrom,
                        outputToken: tokenTo,
                        amount: reversed ? toAmount : fromAmount,
                        slippage: 5,
                        inputAmount: reversed,
                        multichainAccount,
                        paths: swapConfig?.paths,
                    },
                });
                if (result) setStep(SwapSteps.success);
                else setStep(SwapSteps.failed);
            } catch (error) {
                console.error(error);
                toast((error as Error).message);
            } finally {
                setProcessing(false);
            }
        }
    }, [swapConfig, disableMainBtn, multichainAccount, network]);

    const onBack = useCallback(() => {
        if (showTokenList) {
            setShowTokenList(null);
        } else if (step === SwapSteps.success || step === SwapSteps.failed) {
            navigate("/home");
        } else {
            navigate(-1);
        }
    }, [showTokenList, navigate]);

    useSetupMainButton({
        onClick: onSwap,
        params: {
            text: !isSufficientNativeForCommission
                ? t("swap-modal.insufficient-ton")
                : isEnoughBalance
                ? t("swap-modal.confirm-swap")
                : t("swap-modal.insufficient"),
            textColor: "#FFFFFF",
            backgroundColor: "#424B56",
            isLoaderVisible: processing,
            isEnabled: !disableMainBtn,
            isVisible: !!(step === SwapSteps.swap && network && !showTokenList),
        },
    });
    useSetupBackButton({
        onBack,
    });

    const onTokenSelect = useCallback(
        (token: TokenBalance) => {
            if (showTokenList === "token1") {
                setTokenFrom(token);
            } else {
                setTokenTo(token);
            }
            setShowTokenList(null);
        },
        [showTokenList]
    );

    const onSelectNetwork = () => {
        setStep(SwapSteps.swap);
    };

    const changeAmountFrom = (value: number) => {
        setReversed(false);
        setFromAmount(value);
    };
    const changeAmountTo = (value: number) => {
        setReversed(true);
        setToAmount(value);
    };
    return (
        <PrivateLayout>
            {/* TON-ONLY */}
            {/* {step === SwapSteps.selectNetwork && (
                <SelectNetwork
                    setNetwork={setNetwork}
                    network={network}
                    config={getSelectBlockhainConfig([CHAINS.TON, CHAINS.ETH, CHAINS.BNB])}
                    onClick={onSelectNetwork}
                    mainTitle
                />
            )} */}
            {step === SwapSteps.swap &&
                (showTokenList && network ? (
                    <TokensList
                        search
                        isSelectMode
                        accountBalance={accountBalance}
                        onTokenSelect={onTokenSelect}
                        isLoading={accountBalanceFetching}
                        chainFilter={[network]}
                        tokenList={parsedTokens}
                    />
                ) : (
                    <SwapInner
                        poweredBy={network === CHAINS.TON ? "swap.coffee" : ""}
                        poweredIcon={
                            network === CHAINS.TON ? <SvgSelector id="coffee" /> : undefined
                        }
                        tokenFrom={tokenFrom}
                        setTokenFrom={setTokenFrom}
                        tokenTo={tokenTo}
                        setTokenTo={setTokenTo}
                        setShowTokenList={setShowTokenList}
                        fromAmount={fromAmount}
                        setFromAmount={changeAmountFrom}
                        toAmount={toAmount}
                        setToAmount={changeAmountTo}
                        swapInfoComponent={
                            <SwapInfo
                                priceImpact={(swapConfig?.priceImpact ?? 0) * 100}
                                gas={swapConfig?.gas}
                                gasSymbol={accountBalance?.chains[network!].nativeToken.tokenSymbol}
                                gasUSD={
                                    (swapConfig?.gas ?? 0) *
                                    (accountBalance?.chains[network!].nativeToken.price ?? 0)
                                }
                                loading={isFetchingConfig}
                            />
                        }
                        allowReversed={network === CHAINS.TON}
                    />
                ))}
            {step === SwapSteps.success && <SuccessTransaction explorerLink={explorerLink} />}
            {step === SwapSteps.failed && <FailedTransaction />}
        </PrivateLayout>
    );
};
