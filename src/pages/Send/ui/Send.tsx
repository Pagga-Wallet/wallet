/* eslint-disable react-hooks/exhaustive-deps */
import { initUtils } from "@tma.js/sdk";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { TokensList } from "@/widgets/token";
import {
    ConfirmSendTransactionInfo,
    InputAmountToSend,
    FailedTransaction,
    SuccessTransaction,
    SelectWalletToSend,
    InputMemo,
} from "@/widgets/transaction";
import { usePINConfirmation } from "@/features/PIN";
import {
    MultichainAccount,
    multichainAccountStore,
    useFetchTotalBalanceQuery,
} from "@/entities/multichainAccount";
import { BaseLayout } from "@/shared/layouts";
import {
    cryptographyController,
    useAppSelector,
    useSetupBackButton,
    useSetupMainButton,
} from "@/shared/lib";
import { checkAddress, checkAddressFromUnknownChain } from "@/shared/lib/helpers/checkAddress";
import { getExplorerLink } from "@/shared/lib/helpers/getExplorerLink";
import { CHAINS, EVM_CHAINS_ARRAY, TokenBalance } from "@/shared/lib/types";
import { BaseTxnParsed } from "@/shared/lib/types/transaction";
import { btnText, title } from "../lib/consts";
import { SendSteps } from "../lib/types/SendSteps";
import s from "./Send.module.scss";

export const Send: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const utils = initUtils();
    const preselectedToken: TokenBalance | undefined = location.state?.preselectedToken;
    const isPreselectedToken = !!preselectedToken;
    const searchParams = new URLSearchParams(location.search);
    const preselectedReceiver: string | null = searchParams.get("receiver");

    const [step, setStep] = useState<SendSteps>(
        isPreselectedToken ? SendSteps.pickAddress : SendSteps.select
        // SendSteps.success
    );
    const [tokenSelected, setTokenSelected] = useState<TokenBalance | null>(
        preselectedToken ?? null
    );
    const [valueAmount, setValueAmount] = useState<number>(0);
    const [memo, setMemo] = useState<string>("");
    const [receiver, setReceiver] = useState<string>("");
    const [parsedReceiver, setParsedReceiver] = useState<string>("");
    const [processing, setProcessing] = useState<boolean>(false);
    const [transactionError, setTransactionError] = useState<string>("");
    const [txResponse, setTxResponse] = useState<BaseTxnParsed | null>(null);
    const [allowedChain, setAllowedChain] = useState<CHAINS | null>(null);
    const { confirm } = usePINConfirmation();

    const account = useAppSelector(multichainAccountStore.selectors.selectAccount);
    const tonVersion = useAppSelector(multichainAccountStore.selectors.selectTonVersion);
    const multichainAccount = useMemo(
        () => (account ? new MultichainAccount(account, tonVersion) : undefined),
        [account, tonVersion]
    );

    const { data: accountBalance = null, isFetching: accountBalanceFetching } =
        useFetchTotalBalanceQuery();

    const onTokenSelect = useCallback((token: TokenBalance) => {
        setTokenSelected(token);
        setStep(SendSteps.pickAddress);
    }, []);

    // Основная функция отправка транзакции
    // TODO сделать через redux query
    const onConfirm = useCallback(async () => {
        try {
            const title = t("send.confirm-transaction");
            if (multichainAccount && account) {
                if (!tokenSelected) throw new Error("Invalid Token");
                const pin = await confirm({
                    title,
                });
                // console.log("onConfirm pin", pin);
                const mnemonics = cryptographyController.HashToKey(
                    pin,
                    account.masterIV,
                    account.masterHash
                );
                if (!mnemonics) {
                    throw new Error("Invalid PIN");
                }

                setProcessing(true);
                const result = await multichainAccount.transferToken({
                    receiver: parsedReceiver,
                    amount: Number(valueAmount),
                    mnemonics,
                    tokenSelected,
                    memo,
                });
                if (result.isError) {
                    throw new Error(result.errorMessage);
                } else {
                    setStep(SendSteps.success);
                    setTxResponse(result.data);
                }
                setProcessing(false);
            }
        } catch (error) {
            setTransactionError((error as Error).message ?? "");
            setStep(SendSteps.failed);
            setProcessing(false);
        }
    }, [parsedReceiver, valueAmount, memo, multichainAccount, account, tokenSelected, t]);

    // Валидация

    const [disableBtn, errorText] = useMemo(() => {
        let result = false;
        let text = "";

        switch (step) {
            case SendSteps.pickAddress:
                if (!receiver) {
                    result = true;
                    text = t("send.select-recipient");
                } else if (!parsedReceiver) {
                    result = true;
                    text = t("send.invalid-receiver");
                }
                break;
            case SendSteps.input:
                if (valueAmount <= 0) {
                    result = true;
                    text = t("common.invalid-amount");
                } else if (valueAmount > (tokenSelected?.balance ?? 0)) {
                    result = true;
                    text = t("common.insufficient-funds");
                }
                break;
            default:
                break;
        }
        return [result, text];
    }, [step, parsedReceiver, receiver, tokenSelected, valueAmount, t]);

    const onForward = useCallback(() => {
        switch (step) {
            case SendSteps.pickAddress:
                return setStep(SendSteps.input);
            case SendSteps.input:
                return setStep(SendSteps.confirm);
            case SendSteps.confirm:
                return onConfirm();
            case SendSteps.success:
                return utils.openLink(
                    getExplorerLink({
                        userAddress: multichainAccount?.getAddressInNetwork(CHAINS.TON),
                        txHash: txResponse?.hash,
                        chain: tokenSelected?.platform as CHAINS,
                    })
                );
            case SendSteps.failed:
                return navigate("/home");
            default:
                break;
        }
    }, [step, onConfirm, navigate, txResponse]);

    const onBack = useCallback(() => {
        // return navigate("/home");
        switch (step) {
            case SendSteps.select:
                return navigate("/home");
            case SendSteps.pickAddress:
                if (isPreselectedToken) navigate(-1);
                setStep(SendSteps.select);
                setReceiver(preselectedReceiver ?? "");
                break;
            case SendSteps.input:
                setStep(SendSteps.pickAddress);
                setValueAmount(0);
                break;
            case SendSteps.confirm:
                setStep(SendSteps.input);
                break;
            case SendSteps.success:
                navigate("/home");
                break;
            case SendSteps.failed:
                navigate("/home");
                break;
            default:
                return;
        }
    }, [step, navigate]);

    useEffect(() => {
        const check = async () => {
            if (!tokenSelected) return;
            const parsed = await checkAddress(receiver, tokenSelected.platform);
            setParsedReceiver(parsed ?? "");
        };

        check();
    }, [receiver, tokenSelected]);

    useEffect(() => {
        const check = async () => {
            if (!preselectedReceiver) return;
            const parsed = await checkAddressFromUnknownChain(preselectedReceiver);
            if (!parsed || !parsed.address) return;
            setReceiver(parsed.address);
            setAllowedChain(parsed.chain);
        };

        check();
    }, [preselectedReceiver]);

    useSetupBackButton(
        {
            onBack,
        },
        [step]
    );

    useSetupMainButton({
        onClick: onForward,
        params: {
            text: errorText || t(btnText[step]),
            isLoaderVisible: processing,
            isEnabled: !disableBtn,
            isVisible: step !== SendSteps.select,
        },
    });

    const onAddressSelect = useCallback(
        async (receiver: string) => {
            setReceiver(receiver);
            if (!tokenSelected) return;
            const parsed = await checkAddress(receiver, tokenSelected.platform);
            setParsedReceiver(parsed ?? "");
            onForward();
        },
        [tokenSelected, onForward]
    );

    return (
        <BaseLayout>
            <div className={s.send}>
                {step !== SendSteps.success && step !== SendSteps.failed && (
                    <div className={s.title}>{t(title[step])}</div>
                )}

                {step === SendSteps.select && (
                    <TokensList
                        search
                        accountBalance={accountBalance}
                        isSelectMode
                        onTokenSelect={onTokenSelect}
                        isLoading={accountBalanceFetching}
                        chainFilter={
                            allowedChain
                                ? allowedChain === CHAINS.ETH
                                    ? EVM_CHAINS_ARRAY
                                    : [allowedChain]
                                : undefined
                        }
                    />
                )}
                {step === SendSteps.pickAddress && (
                    <SelectWalletToSend
                        tokenSelected={tokenSelected}
                        value={receiver}
                        setValue={setReceiver}
                        onAddressSelect={onAddressSelect}
                        disabled={!!preselectedReceiver}
                    />
                )}
                {step === SendSteps.input && (
                    <>
                        <InputAmountToSend
                            value={valueAmount}
                            setValue={setValueAmount}
                            tokenSelected={tokenSelected}
                        />
                        {tokenSelected?.platform === CHAINS.TON && (
                            <InputMemo value={memo} setValue={setMemo} />
                        )}
                    </>
                )}
                {step === SendSteps.confirm && (
                    <ConfirmSendTransactionInfo
                        onConfirm={onConfirm}
                        tokenSymbol={tokenSelected?.tokenSymbol}
                        price={tokenSelected?.price}
                        amount={valueAmount}
                        receiver={receiver}
                        memo={memo}
                    />
                )}
                {step === SendSteps.success && <SuccessTransaction />}
                {step === SendSteps.failed && <FailedTransaction />}
            </div>
        </BaseLayout>
    );
};
